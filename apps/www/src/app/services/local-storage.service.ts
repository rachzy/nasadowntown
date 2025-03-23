import { Injectable } from '@angular/core';
import { LocalStorageKey } from '../interfaces/local-storage';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  public getItem<T>(key: LocalStorageKey): T | null {
    const item = localStorage.getItem(key);
    if (!item) {
      return null;
    }
    return JSON.parse(item) as T;
  }

  public setItem(key: LocalStorageKey, value: unknown): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  public removeItem(key: LocalStorageKey): void {
    localStorage.removeItem(key);
  }

  public clear(): void {
    localStorage.clear();
  }
}
