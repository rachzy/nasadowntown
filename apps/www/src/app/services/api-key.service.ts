import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class ApiKeyService {
  private readonly _apiKey = new BehaviorSubject<string | null>(null);
  private readonly _localStorageService = inject(LocalStorageService);

  constructor(private readonly _httpClient: HttpClient) {
    // Try to get API key from localStorage first
    const storedKey = this._localStorageService.getItem('NASA_API_KEY');
    if (storedKey) {
      this._apiKey.next(storedKey);
    }
  }

  public get apiKey$(): Observable<string | null> {
    return this._apiKey.asObservable();
  }

  public get apiKey(): string | null {
    return this._apiKey.getValue();
  }

  public fetchApiKey(): Observable<{ apiKey: string }> {
    return this._httpClient
      .get<{ apiKey: string }>('http://localhost:3000/config/api-key')
      .pipe(
        tap((response) => {
          this._apiKey.next(response.apiKey);
          this._localStorageService.setItem('NASA_API_KEY', response.apiKey);
        })
      );
  }
}
