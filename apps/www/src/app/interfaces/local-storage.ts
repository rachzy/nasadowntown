import { PreviousPayloads } from './nasa-api';
import { NasaAPIPage } from './nasa-api/asteroids';
import { Asteroid } from './nasa-api/asteroids';
import { Manifests, NasaAPIMarsPhoto } from './nasa-api/mars-photos';

export type LocalStorageKey =
  | 'manifests'
  | 'marsPhotos'
  | 'previousPayloads'
  | 'NASA_API_KEY'
  | 'asteroids'
  | 'asteroidsPagination'
  | 'asteroidsPreviousPayloads';

export interface LocalStorageValueTypes {
  manifests: Manifests;
  marsPhotos: NasaAPIMarsPhoto[];
  previousPayloads: PreviousPayloads[];
  NASA_API_KEY: string;
  asteroids: Asteroid[];
  asteroidsPagination: NasaAPIPage;
  asteroidsPreviousPayloads: PreviousPayloads[];
}

export type LocalStorageKeyValue = {
  [K in LocalStorageKey]: LocalStorageValueTypes[K];
};
