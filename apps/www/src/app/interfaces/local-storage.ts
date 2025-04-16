import { PreviousPayloads } from './nasa-api';
import { Manifests, NasaAPIMarsPhoto } from './nasa-api/mars-photos';

export type LocalStorageKey =
  | 'manifests'
  | 'marsPhotos'
  | 'previousPayloads'
  | 'NASA_API_KEY'; // This is gonna be snake cased because it's basically an environment variable

export interface LocalStorageValueTypes {
  manifests: Manifests;
  marsPhotos: NasaAPIMarsPhoto[];
  previousPayloads: PreviousPayloads[];
  NASA_API_KEY: string;
}

export type LocalStorageKeyValue = {
  [K in LocalStorageKey]: LocalStorageValueTypes[K];
};
