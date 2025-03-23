import { MarsRover, NasaAPIMarsPhotosRequest } from './nasa-api/mars-photos';

export type PreviousPayloads =
  | {
      type: 'mars-photos';
      payload: NasaAPIMarsPhotosRequest;
    }
  | {
      type: 'mars-rover-manifest';
      payload: MarsRover;
    };
