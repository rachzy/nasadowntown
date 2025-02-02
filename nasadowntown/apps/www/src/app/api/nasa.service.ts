import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NASA_MARS_ROUTE } from './api.routes';
import { nasaAPIRequestBuilder } from '../utils/nasa-api';
import {
  MarsRover,
  NasaAPIMarsManifestResponse,
  NasaAPIMarsPhotosRequest,
  NasaAPIMarsPhotosResponse,
} from '../interfaces/nasa/mars-photos';
import { Observable } from 'rxjs';
import { format } from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class NasaService {
  constructor(private readonly _httpClient: HttpClient) {}

  public getMarsPhotos(
    data: NasaAPIMarsPhotosRequest
  ): Observable<NasaAPIMarsPhotosResponse | null> {
    const { rover, earthDate } = data;
    const earth_date = earthDate
      ? `earth_date=${format(earthDate, 'yyyy-MM-dd')}`
      : '';
    const sol = data.sol ? `sol=${data.sol}&` : '';
    const camera = data.camera ? `camera=${data.camera}&` : '';
    const page = data.page ? `page=${data.page}&` : '';
    return this._httpClient.get<NasaAPIMarsPhotosResponse>(
      nasaAPIRequestBuilder(
        `${NASA_MARS_ROUTE}/rovers/${rover}/photos?${sol}${camera}${page}${earth_date}`
      )
    );
  }

  public getMarsRoverManifest(
    rover: MarsRover
  ): Observable<NasaAPIMarsManifestResponse | null> {
    return this._httpClient.get<NasaAPIMarsManifestResponse>(
      nasaAPIRequestBuilder(`${NASA_MARS_ROUTE}/manifests/${rover}`)
    );
  }
}
