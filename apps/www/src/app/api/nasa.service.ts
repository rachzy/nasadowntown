import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NASA_MARS_ROUTE } from './api.routes';
import { nasaAPIRequestBuilder } from '../utils/nasa-api';
import {
  MarsRover,
  NasaAPIMarsManifestResponse,
  NasaAPIMarsPhotosRequest,
  NasaAPIMarsPhotosResponse,
} from '../interfaces/nasa-api/mars-photos';
import { Observable, from } from 'rxjs';
import { format } from 'date-fns';
import { ApiKeyService } from '../services/api-key.service';

@Injectable({
  providedIn: 'root',
})
export class NasaService {
  constructor(
    private readonly _httpClient: HttpClient,
    private readonly _apiKeyService: ApiKeyService
  ) {}

  public getMarsPhotos(
    data: NasaAPIMarsPhotosRequest
  ): Observable<NasaAPIMarsPhotosResponse> {
    return from(
      this._ensureApiKey().then(() => {
        const { rover, earthDate } = data;
        const earth_date = earthDate
          ? `earth_date=${format(earthDate, 'yyyy-MM-dd')}`
          : '';
        const sol = data.sol ? `sol=${data.sol}&` : '';
        const camera = data.camera ? `camera=${data.camera}&` : '';
        const page = data.page ? `page=${data.page}&` : '';
        return this._httpClient
          .get<NasaAPIMarsPhotosResponse>(
            nasaAPIRequestBuilder(
              `${NASA_MARS_ROUTE}/rovers/${rover}/photos?${sol}${camera}${page}${earth_date}`,
              this._apiKeyService
            )
          )
          .toPromise() as Promise<NasaAPIMarsPhotosResponse>;
      })
    );
  }

  public getMarsRoverManifest(
    rover: MarsRover
  ): Observable<NasaAPIMarsManifestResponse> {
    return from(
      this._ensureApiKey().then(() => {
        return this._httpClient
          .get<NasaAPIMarsManifestResponse>(
            nasaAPIRequestBuilder(
              `${NASA_MARS_ROUTE}/manifests/${rover}`,
              this._apiKeyService
            )
          )
          .toPromise() as Promise<NasaAPIMarsManifestResponse>;
      })
    );
  }

  private async _ensureApiKey(): Promise<void> {
    if (!this._apiKeyService.apiKey) {
      await this._apiKeyService.fetchApiKey().toPromise();
    }
  }
}
