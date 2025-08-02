import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import {
  CalculateOrbitParams,
  OrbitCalculationResult,
} from '@libs/shared/lib/types/nd-api/neows';

@Injectable({
  providedIn: 'root',
})
export class ApiNDNeowsService {
  private readonly _httpClient = inject(HttpClient);

  public calculateOrbit(
    data: CalculateOrbitParams
  ): Observable<OrbitCalculationResult> {
    return this._httpClient.post<OrbitCalculationResult>(
      `${environment.apiUrl}/neows/calculate-orbit`,
      data
    );
  }
}
