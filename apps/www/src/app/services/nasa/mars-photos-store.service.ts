import { inject, Injectable, signal } from '@angular/core';
import { NasaService } from '../../api/nasa.service';
import { BehaviorSubject, firstValueFrom, map, Subject, takeUntil } from 'rxjs';
import {
  MarsRover,
  NasaAPIMarsPhoto,
  NasaAPIMarsPhotosRequest,
  RoverPhotosMetadata,
} from '../../interfaces/nasa-api/mars-photos';
import { filterPhotosByPayload } from '../../utils/mars-photots';
import { LocalStorageService } from '../local-storage.service';
import { PreviousPayloads } from '../../interfaces/nasa-api';

type Manifests = Record<MarsRover, RoverPhotosMetadata>;
@Injectable({
  providedIn: 'root',
})
export class MarsPhotosStoreService {
  private readonly _localStorageService = inject(LocalStorageService);

  private readonly _previousPayloads = signal<PreviousPayloads[]>(
    this._localStorageService.getItem<PreviousPayloads[]>('previousPayloads') ??
      []
  );
  private readonly _marsPhotos = new BehaviorSubject<NasaAPIMarsPhoto[]>(
    this._localStorageService.getItem<NasaAPIMarsPhoto[]>('marsPhotos') ?? []
  );
  private readonly _manifests = new BehaviorSubject<Manifests | null>(
    this._localStorageService.getItem<Manifests>('manifests') ?? null
  );

  public readonly marsPhotos$ = this._marsPhotos.asObservable();
  public readonly manifests$ = this._manifests.asObservable();
  public readonly hasFetchedInitialData$ = this.manifests$.pipe(
    map((manifests) => Boolean(manifests))
  );

  public readonly selectedPhotoID = signal<number | null>(null);

  constructor(private readonly _nasaService: NasaService) {
    this._marsPhotos.subscribe((photos) =>
      this._localStorageService.setItem('marsPhotos', photos)
    );

    this.manifests$.subscribe((manifests) => {
      this._localStorageService.setItem('manifests', manifests);
    });

    // If there are no manifests, fetch the one for curiosity
    if (!this._manifests.getValue()) {
      this._fetchManifest('curiosity');
    }

    if (this._marsPhotos.getValue().length === 0) {
      this._fetchRoverLatestPhotos('curiosity');
    }
  }

  public addMarsPhotos(photos: NasaAPIMarsPhoto[]): void {
    const currentPhotos = this._marsPhotos.getValue();
    this._marsPhotos.next([...currentPhotos, ...photos]);
  }

  public addManifest(manifest: RoverPhotosMetadata): void {
    const currentManifests = this._manifests.getValue() ?? {};
    this._manifests.next({
      ...currentManifests,
      [manifest.name.toLowerCase()]: manifest,
    } as Record<MarsRover, RoverPhotosMetadata>);
  }

  public async getPhotos(
    payload: NasaAPIMarsPhotosRequest
  ): Promise<NasaAPIMarsPhoto[]> {
    const isAlreadyFetched = this._previousPayloads().some(
      (request) =>
        request.type === 'mars-photos' &&
        JSON.stringify(request.payload) === JSON.stringify(payload)
    );

    if (!isAlreadyFetched) {
      await this._fetchPhotos(payload);
    }

    return filterPhotosByPayload(this._marsPhotos.getValue(), payload);
  }

  private async _fetchPhotos(data: NasaAPIMarsPhotosRequest): Promise<void> {
    const { photos } = await firstValueFrom(
      this._nasaService.getMarsPhotos(data)
    );

    if (!photos) {
      throw new Error('No photos found');
    }
    this.addMarsPhotos(photos);

    this._previousPayloads.update((prev) => [
      ...prev,
      { type: 'mars-photos', payload: data },
    ]);
  }

  private async _fetchManifest(rover: MarsRover): Promise<void> {
    const { photo_manifest } = await firstValueFrom(
      this._nasaService.getMarsRoverManifest(rover)
    );
    this.addManifest(photo_manifest);

    this._previousPayloads.update((prev) => [
      ...prev,
      { type: 'mars-rover-manifest', payload: rover },
    ]);
  }

  private _fetchRoverLatestPhotos(rover: MarsRover): void {
    const manifest = this._manifests.getValue()?.[rover];
    if (!manifest) {
      throw new Error(
        'Trying to fetch photos for a rover that has no manifest'
      );
    }

    const latestPhotosData = manifest?.photos.pop();
    if (!latestPhotosData) {
      throw new Error('No photos found');
    }

    this.getPhotos({
      rover: manifest.name.toLowerCase() as MarsRover,
      earthDate: new Date(latestPhotosData.earth_date),
      page: 1,
    });
  }
}
