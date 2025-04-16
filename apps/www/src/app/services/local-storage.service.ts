import { Injectable } from '@angular/core';
import {
  LocalStorageKey,
  LocalStorageValueTypes,
} from '../interfaces/local-storage';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  public getItem<K extends LocalStorageKey>(
    key: K
  ): LocalStorageValueTypes[K] | null {
    const item = localStorage.getItem(key);
    if (!item) {
      return null;
    }

    // Only parse JSON for object/array values
    if (
      key === 'manifests' ||
      key === 'marsPhotos' ||
      key === 'previousPayloads'
    ) {
      try {
        return JSON.parse(item) as LocalStorageValueTypes[K];
      } catch {
        return null;
      }
    }

    return item as LocalStorageValueTypes[K];
  }

  public setItem<K extends LocalStorageKey>(
    key: K,
    value: LocalStorageValueTypes[K]
  ): void {
    if (value === null) {
      localStorage.removeItem(key);
      return;
    }

    // Only stringify JSON for object/array values
    if (
      key === 'manifests' ||
      key === 'marsPhotos' ||
      key === 'previousPayloads'
    ) {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.setItem(key, value as string);
    }
  }

  public removeItem(key: LocalStorageKey): void {
    localStorage.removeItem(key);
  }

  public clear(): void {
    localStorage.clear();
  }
}
