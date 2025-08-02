import { MarsRover, NasaAPIMarsPhotosRequest } from './nasa-api/mars-photos';
import { NasaAPIAsteroidsRequest } from './nasa-api/asteroids';

export type PreviousPayloads =
  | {
      type: 'mars-photos';
      payload: NasaAPIMarsPhotosRequest;
    }
  | {
      type: 'mars-rover-manifest';
      payload: MarsRover;
    }
  | {
      type: 'asteroids';
      payload: NasaAPIAsteroidsRequest;
    };
