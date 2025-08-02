import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  tap,
  catchError,
  of,
  shareReplay,
} from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { ApiConfigService } from '../api/config.service';

@Injectable({
  providedIn: 'root',
})
export class ApiKeyService {
  private readonly _apiKey = new BehaviorSubject<string | null>(null);
  private readonly _localStorageService = inject(LocalStorageService);
  private readonly _apiConfigService = inject(ApiConfigService);

  constructor() {
    this._initializeApiKey();
  }

  public get apiKey$(): Observable<string | null> {
    return this._apiKey.asObservable();
  }

  public get apiKey(): string | null {
    return this._apiKey.getValue();
  }

  public fetchApiKey(): Observable<{ apiKey: string | null }> {
    return this._apiConfigService.fetchApiKey().pipe(
      tap((response) => {
        this._apiKey.next(response.apiKey);
        this._localStorageService.setItem('NASA_API_KEY', response.apiKey);
      }),
      catchError((error) => {
        console.error('Failed to fetch API key:', error);

        this._localStorageService.removeItem('NASA_API_KEY');
        this._apiKey.next(null);
        return of({ apiKey: null });
      }),
      shareReplay(1)
    );
  }

  private _initializeApiKey(): void {
    const storedKey = this._localStorageService.getItem('NASA_API_KEY');
    if (storedKey) {
      this._apiKey.next(storedKey);
      return;
    }

    this.fetchApiKey().subscribe({
      error: (error) => {
        console.error('Failed to initialize API key:', error);
      },
    });
  }
}
