import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiConfigService {
  private readonly _httpClient = inject(HttpClient);

  public fetchApiKey(): Observable<{ apiKey: string }> {
    return this._httpClient.get<{ apiKey: string }>(
      `${environment.apiUrl}/config/api-key`
    );
  }
}
