import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { nasaAPIRequestBuilder } from '../../utils/nasa-api';
import {
  NasaAPIAsteroidsResponse,
  NasaAPIAsteroidsRequest,
} from '../../interfaces/nasa-api/asteroids';
import { Observable } from 'rxjs';
import { ApiKeyService } from '../../services/api-key.service';

@Injectable({
  providedIn: 'root',
})
export class NeowsAPIService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _apiKeyService = inject(ApiKeyService);

  public getOverallData(
    params?: NasaAPIAsteroidsRequest
  ): Observable<NasaAPIAsteroidsResponse> {
    const queryParams = this._buildQueryParams(params);
    return this._httpClient.get<NasaAPIAsteroidsResponse>(
      nasaAPIRequestBuilder(
        `/neo/rest/v1/neo/browse${queryParams}`,
        this._apiKeyService
      )
    );
  }

  private _buildQueryParams(params?: NasaAPIAsteroidsRequest): string {
    if (!params) {
      return '';
    }

    const queryParams: string[] = [];

    if (params.page !== undefined) {
      queryParams.push(`page=${params.page}`);
    }

    if (params.size !== undefined) {
      queryParams.push(`size=${params.size}`);
    }

    if (params.start_date) {
      queryParams.push(`start_date=${params.start_date}`);
    }

    if (params.end_date) {
      queryParams.push(`end_date=${params.end_date}`);
    }

    return queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
  }
}
