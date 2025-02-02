import { Injectable } from '@angular/core';
import { NasaService } from '../../api/nasa.service';
import { BehaviorSubject, map, Subject, takeUntil } from 'rxjs';
import {
  MarsRover,
  NasaAPIMarsPhoto,
  RoverPhotosMetadata,
} from '../../interfaces/nasa/mars-photos';

@Injectable({
  providedIn: 'root',
})
export class MarsPhotosStoreService {
  private readonly destroy$ = new Subject<void>();

  private readonly _marsPhotos = new BehaviorSubject<NasaAPIMarsPhoto[]>([]);
  public readonly marsPhotos$ = this._marsPhotos.asObservable();

  private readonly _manifests = new BehaviorSubject<Record<
    MarsRover,
    RoverPhotosMetadata
  > | null>(null);
  public readonly manifests$ = this._manifests.asObservable();

  constructor(private readonly _nasaService: NasaService) {
    this._fetchCuriosityManifest();
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

  private _fetchCuriosityManifest(): void {
    this._nasaService
      .getMarsRoverManifest('curiosity')
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
  }

  private _fetchRoverLatestPhotos(manifest: RoverPhotosMetadata): void {
    const latestPhotosData = manifest.photos.pop();
    if (!latestPhotosData) {
      throw new Error('No photos found');
    }
    this._nasaService
      .getMarsPhotos({
        rover: manifest.name.toLowerCase() as MarsRover,
        earthDate: new Date(latestPhotosData.earth_date),
        page: 1,
      })
      .subscribe((res) => {
        if (!res) {
          return;
        }
        this.addMarsPhotos(res.photos);
      });
  }
}
