import { computed, inject, Injectable, signal } from '@angular/core';
import { NeowsAPIService } from '../../api/nasa-endpoints/neows.service';
import { BehaviorSubject, firstValueFrom, map } from 'rxjs';
import {
  Asteroid,
  NasaAPIAsteroidsRequest,
  NasaAPIPage,
} from '../../interfaces/nasa-api/asteroids';
import { LocalStorageService } from '../local-storage.service';
import { PreviousPayloads } from '../../interfaces/nasa-api';
import { ApiKeyService } from '../api-key.service';
import { ApiNDNeowsService } from '../../api/nd-neows.service';
import { OrbitCalculationResult } from '@libs/shared/lib/types/nd-api/neows';
import { getGregorianDateInStandardFormat } from '@libs/shared/lib/utils/astrophysics/julian';
type OrbitCalculation = {
  asteroidID: string;
  calculationDate: string;
  heliocentricCoordinates: OrbitCalculationResult['position'];
};

type OrbitCalculationByAsteroid = {
  [asteroidID: string]: {
    [calculationDate: string]: OrbitCalculation;
  };
};

@Injectable({
  providedIn: 'root',
})
export class NeowsStoreService {
  private readonly _localStorageService = inject(LocalStorageService);
  private readonly _apiKeyService = inject(ApiKeyService);
  private readonly _neowsService = inject(NeowsAPIService);
  private readonly _ndNeowsService = inject(ApiNDNeowsService);

  private readonly _previousPayloads = signal<PreviousPayloads[]>(
    this._localStorageService.getItem('asteroidsPreviousPayloads') ?? []
  );
  private readonly _asteroids = new BehaviorSubject<Asteroid[]>(
    this._localStorageService.getItem('asteroids') ?? []
  );
  private readonly _paginationInfo = new BehaviorSubject<NasaAPIPage | null>(
    this._localStorageService.getItem('asteroidsPagination') ?? null
  );

  public readonly asteroids$ = this._asteroids.asObservable();
  public readonly asteroids = computed(() => this._asteroids.getValue());

  public readonly paginationInfo$ = this._paginationInfo.asObservable();
  public readonly hasFetchedInitialData$ = this.paginationInfo$.pipe(
    map((pagination) => Boolean(pagination))
  );

  private readonly _orbitCalculations = signal<Array<OrbitCalculation>>([]);
  public readonly orbitCalculationsByAsteroid =
    computed<OrbitCalculationByAsteroid>(() => {
      return this._orbitCalculations().reduce((acc, calculation) => {
        acc[calculation.asteroidID] = acc[calculation.asteroidID] || {};
        acc[calculation.asteroidID][calculation.calculationDate] = calculation;
        return acc;
      }, {} as OrbitCalculationByAsteroid);
    });

  public readonly selectedAsteroidID = signal<string | null>(null);

  constructor() {
    this._asteroids.subscribe((asteroids) =>
      this._localStorageService.setItem('asteroids', asteroids)
    );

    this.paginationInfo$.subscribe((pagination) => {
      if (pagination) {
        this._localStorageService.setItem('asteroidsPagination', pagination);
      }
    });

    // If there are no asteroids, fetch initial data
    if (this._asteroids.getValue().length === 0) {
      this._fetchInitialData();
    }
  }

  public addAsteroids(asteroids: Asteroid[]): void {
    const currentAsteroids = this._asteroids.getValue();
    const nonRepeatedAsteroids = asteroids.filter(
      (asteroid) =>
        !currentAsteroids.some(
          (currentAsteroid) => currentAsteroid.id === asteroid.id
        )
    );
    this._asteroids.next([...currentAsteroids, ...nonRepeatedAsteroids]);
  }

  public updateAsteroids(asteroids: Asteroid[]): void {
    this._asteroids.next(asteroids);
  }

  public updatePaginationInfo(pagination: NasaAPIPage): void {
    this._paginationInfo.next(pagination);
  }

  public async getAsteroids(
    payload: NasaAPIAsteroidsRequest
  ): Promise<Asteroid[]> {
    const isAlreadyFetched = this._previousPayloads().some(
      (request) =>
        request.type === 'asteroids' &&
        JSON.stringify(request.payload) === JSON.stringify(payload)
    );

    if (!isAlreadyFetched) {
      return await this._fetchAsteroids(payload);
    }

    // Return cached data if already fetched
    return this._asteroids.getValue();
  }

  public async calculateOrbit(
    asteroidID: string
  ): Promise<OrbitCalculationResult> {
    const asteroid = this._asteroids
      .getValue()
      .find((asteroid) => asteroid.id === asteroidID);

    if (!asteroid) {
      throw new Error('Asteroid not found');
    }

    const {
      semi_major_axis,
      eccentricity,
      inclination,
      mean_anomaly,
      perihelion_argument,
      ascending_node_longitude,
      mean_motion,
      orbit_determination_date,
    } = asteroid.orbital_data;

    const orbit = await firstValueFrom(
      this._ndNeowsService.calculateOrbit({
        semimajor_axis: Number(semi_major_axis),
        eccentricity: Number(eccentricity),
        inclination: Number(inclination),
        mean_anomaly: Number(mean_anomaly),
        periphelion_argument: Number(perihelion_argument),
        ascending_node_longitude: Number(ascending_node_longitude),
        mean_motion: Number(mean_motion),
        desired_date: getGregorianDateInStandardFormat(new Date()),
        orbit_determination_date: getGregorianDateInStandardFormat(
          new Date(orbit_determination_date)
        ),
      })
    );

    this._orbitCalculations.update((prev) => [
      ...prev,
      {
        asteroidID,
        calculationDate: new Date().toISOString(),
        heliocentricCoordinates: orbit.position,
      },
    ]);

    return orbit;
  }

  private async _fetchAsteroids(
    data: NasaAPIAsteroidsRequest
  ): Promise<Asteroid[]> {
    // Ensure we have the API key before making the request
    if (!this._apiKeyService.apiKey) {
      await firstValueFrom(this._apiKeyService.fetchApiKey());
    }

    const response = await firstValueFrom(
      this._neowsService.getOverallData(data)
    );

    if (!response.near_earth_objects) {
      throw new Error('No asteroids found');
    }

    this.addAsteroids(response.near_earth_objects);
    this.updatePaginationInfo(response.page);

    this._previousPayloads.update((prev) => [
      ...prev,
      { type: 'asteroids', payload: data },
    ]);

    return response.near_earth_objects;
  }

  private async _fetchInitialData(): Promise<Asteroid[]> {
    return await this.getAsteroids({
      page: 0,
      size: 20,
    });
  }
}
