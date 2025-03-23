import { Injectable, signal } from '@angular/core';
import { NasaService } from '../../api/nasa.service';
import { BehaviorSubject, firstValueFrom, map, Subject, takeUntil } from 'rxjs';
import {
  MarsRover,
  NasaAPIMarsPhoto,
  NasaAPIMarsPhotosRequest,
  RoverPhotosMetadata,
} from '../../interfaces/nasa/mars-photos';
import { filterPhotosByPayload } from '../../utils/mars-photots';

type PreviousPayloads =
  | {
      type: 'photos';
      payload: NasaAPIMarsPhotosRequest;
    }
  | {
      type: 'manifest';
      payload: MarsRover;
    };

@Injectable({
  providedIn: 'root',
})
export class MarsPhotosStoreService {
  private readonly destroy$ = new Subject<void>();

  private readonly _previousPayloads = signal<PreviousPayloads[]>([]);

  private readonly _marsPhotos = new BehaviorSubject<NasaAPIMarsPhoto[]>([]);
  public readonly marsPhotos$ = this._marsPhotos.asObservable();

  private readonly _manifests = new BehaviorSubject<Record<
    MarsRover,
    RoverPhotosMetadata
  > | null>(null);
  public readonly manifests$ = this._manifests.asObservable();

  constructor(private readonly _nasaService: NasaService) {
    this._fetchManifest('curiosity');
    this.manifests$.subscribe((manifests) => {
      if (!manifests || this._marsPhotos.getValue().length > 0) {
        return;
      }
      this._fetchRoverLatestPhotos(manifests['curiosity']);
    });
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

  public readonly hasFetchedInitialData$ = this.manifests$.pipe(
    map((manifests) => Boolean(manifests))
  );

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
      { type: 'photos', payload: data },
    ]);
  }

  private _fetchManifest(rover: MarsRover): void {
    this._nasaService
      .getMarsRoverManifest(rover)
      .pipe(
        map((res) => res?.photo_manifest),
        takeUntil(this.destroy$)
      )
      .subscribe((manifest) => {
        if (!manifest) {
          throw new Error('No manifest found');
        }
        this.addManifest(manifest);
      });

    this._previousPayloads.update((prev) => [
      ...prev,
      { type: 'manifest', payload: rover },
    ]);
  }

  private _fetchRoverLatestPhotos(manifest: RoverPhotosMetadata): void {
    const latestPhotosData = manifest.photos.pop();
    if (!latestPhotosData) {
      throw new Error('No photos found');
    }
    this._fetchPhotos({
      rover: manifest.name.toLowerCase() as MarsRover,
      earthDate: new Date(latestPhotosData.earth_date),
      page: 1,
    });
  }

  public async getPhotos(
    payload: NasaAPIMarsPhotosRequest
  ): Promise<NasaAPIMarsPhoto[]> {
    const isAlreadyFetched = this._previousPayloads().some(
      (request) =>
        request.type === 'photos' &&
        JSON.stringify(request.payload) === JSON.stringify(payload)
    );

    if (!isAlreadyFetched) {
      await this._fetchPhotos(payload);
    }

    return filterPhotosByPayload(this._marsPhotos.getValue(), payload);
  }
}
