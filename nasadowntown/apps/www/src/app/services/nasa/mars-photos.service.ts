import { Injectable } from '@angular/core';
import { NasaService } from '../../api/nasa.service';
import { BehaviorSubject, map } from 'rxjs';
import {
  NasaAPIMarsPhoto,
  NasaAPIMarsPhotosRequest,
} from '../../interfaces/nasa/mars-photos';

@Injectable({
  providedIn: 'root',
})
export class MarsPhotosService {
  private readonly _marsPhotos = new BehaviorSubject<NasaAPIMarsPhoto[]>([]);
  public readonly marsPhotos$ = this._marsPhotos.asObservable();

  constructor(private readonly _nasaService: NasaService) {
    this._fetchPhotosFromToday();
  }

  private _fetchPhotosFromToday(): void {
    const defaultRequest: NasaAPIMarsPhotosRequest = {
      rover: 'curiosity',
      earthDate: new Date(),
    };
    this._nasaService
      .getMarsPhotos(defaultRequest)
      .pipe(map((res) => res?.photos ?? []))
      .subscribe((photos) => {
        this._marsPhotos.next(photos);
      });
  }
}
