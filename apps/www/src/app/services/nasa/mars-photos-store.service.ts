import { computed, inject, Injectable, signal } from '@angular/core';
import { NasaService } from '../../api/nasa.service';
import { BehaviorSubject, firstValueFrom, map } from 'rxjs';
import {
  MarsRover,
  NasaAPIMarsPhoto,
  NasaAPIMarsPhotosRequest,
  Manifest,
  Manifests,
} from '../../interfaces/nasa-api/mars-photos';
import { filterPhotosByPayload } from '../../utils/mars-photots';
import { LocalStorageService } from '../local-storage.service';
import { PreviousPayloads } from '../../interfaces/nasa-api';
import { DEFAULT_ROVER } from '../../constants/mars-photos';
import { ApiKeyService } from '../api-key.service';

@Injectable({
  providedIn: 'root',
})
export class MarsPhotosStoreService {
  private readonly _localStorageService = inject(LocalStorageService);
  private readonly _apiKeyService = inject(ApiKeyService);

  private readonly _previousPayloads = signal<PreviousPayloads[]>(
    this._localStorageService.getItem('previousPayloads') ?? []
  );
  private readonly _marsPhotos = new BehaviorSubject<NasaAPIMarsPhoto[]>(
    this._localStorageService.getItem('marsPhotos') ?? []
  );
  private readonly _manifests = new BehaviorSubject<Manifests | null>(
    this._localStorageService.getItem('manifests') ?? null
  );

  public readonly marsPhotos$ = this._marsPhotos.asObservable();
  public readonly marsPhotos = computed(() => this._marsPhotos.getValue());

  public readonly manifests$ = this._manifests.asObservable();
  public readonly hasFetchedInitialData$ = this.manifests$.pipe(
    map((manifests) => Boolean(manifests))
  );

  public readonly selectedPhotoID = signal<string | null>(null);

  constructor(private readonly _nasaService: NasaService) {
    this._marsPhotos.subscribe((photos) =>
      this._localStorageService.setItem('marsPhotos', photos)
    );

    this.manifests$.subscribe((manifests) => {
      if (manifests) {
        this._localStorageService.setItem('manifests', manifests);
      }
    });

    // If there are no manifests, fetch the one for curiosity
    if (this._marsPhotos.getValue().length === 0) {
      this._fetchRoverLatestPhotos(DEFAULT_ROVER);
    }
  }

  public addMarsPhotos(photos: NasaAPIMarsPhoto[]): void {
    const currentPhotos = this._marsPhotos.getValue();
    const nonRepeatedPhotos = photos.filter(
      (photo) =>
        !currentPhotos.some((currentPhoto) => currentPhoto.id === photo.id)
    );
    this._marsPhotos.next([...currentPhotos, ...nonRepeatedPhotos]);
  }

  public updateMarsPhotos(photos: NasaAPIMarsPhoto[]): void {
    this._marsPhotos.next(photos);
  }

  public addManifest(manifest: Manifest): void {
    const currentManifests = this._manifests.getValue() ?? {};
    this._manifests.next({
      ...currentManifests,
      [manifest.name.toLowerCase()]: manifest,
    } as Record<MarsRover, Manifest>);
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
      return await this._fetchPhotos(payload);
    }

    return filterPhotosByPayload(this._marsPhotos.getValue(), payload);
  }

  public async getManifest(rover: MarsRover): Promise<Manifest> {
    const manifests = this._manifests.getValue();

    if (!manifests || !Object.hasOwn(manifests, rover)) {
      return await this._fetchManifest(rover);
    }

    return manifests[rover];
  }

  private async _fetchPhotos(
    data: NasaAPIMarsPhotosRequest
  ): Promise<NasaAPIMarsPhoto[]> {
    // Ensure we have the API key before making the request
    if (!this._apiKeyService.apiKey) {
      await firstValueFrom(this._apiKeyService.fetchApiKey());
    }

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

    return photos;
  }

  private async _fetchManifest(rover: MarsRover): Promise<Manifest> {
    // Ensure we have the API key before making the request
    if (!this._apiKeyService.apiKey) {
      await firstValueFrom(this._apiKeyService.fetchApiKey());
    }

    const { photo_manifest } = await firstValueFrom(
      this._nasaService.getMarsRoverManifest(rover)
    );
    this.addManifest(photo_manifest);

    this._previousPayloads.update((prev) => [
      ...prev,
      { type: 'mars-rover-manifest', payload: rover },
    ]);

    return photo_manifest;
  }

  private async _fetchRoverLatestPhotos(
    rover: MarsRover
  ): Promise<NasaAPIMarsPhoto[]> {
    const manifest = await this.getManifest(rover);

    const latestPhotosData = manifest.photos.pop();
    if (!latestPhotosData) {
      throw new Error('No photos found');
    }

    return await this.getPhotos({
      rover: manifest.name.toLowerCase() as MarsRover,
      earthDate: new Date(latestPhotosData.earth_date),
      page: 1,
    });
  }
}
