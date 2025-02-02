export type MarsRover = 'curiosity' | 'opportunity' | 'spirit';
type MarsRoverCapitalized = 'Curiosity' | 'Opportunity' | 'Spirit';
export type MarsRoverCamera =
  | 'FHAZ'
  | 'RHAZ'
  | 'MAST'
  | 'CHEMCAM'
  | 'MAHLI'
  | 'MARDI'
  | 'NAVCAM'
  | 'PANCAM'
  | 'MINITES';

interface Camera {
  id: number;
  name: string;
  rover_id: number;
  full_name: string;
}

interface RoverMetadata {
  id: number;
  name: MarsRover;
  landing_date: string;
  launch_date: string;
  status: string;
}

export interface RoverPhotosMetadata {
  name: MarsRoverCapitalized;
  landing_date: string;
  launch_date: string;
  status: string;
  max_sol: number;
  max_date: string;
  total_photos: number;
  photos: {
    sol: number;
    earth_date: string;
    total_photos: number;
    cameras: string[];
  }[];
}

interface NasaAPIMarsPhotosBaseRequest {
  rover: MarsRover;
  camera?: MarsRoverCamera;
  sol?: number;
  page?: number;
  earthDate?: Date;
}

export type NasaAPIMarsPhotosRequest =
  | (NasaAPIMarsPhotosBaseRequest & {
      rover: 'curiosity';
      camera?:
        | 'FHAZ'
        | 'RHAZ'
        | 'MAST'
        | 'CHEMCAM'
        | 'MAHLI'
        | 'MARDI'
        | 'NAVCAM';
    })
  | (NasaAPIMarsPhotosBaseRequest & {
      rover: 'opportunity' | 'spirit';
      camera?: 'FHAZ' | 'RHAZ' | 'NAVCAM' | 'PANCAM' | 'MINITES';
    });

export interface NasaAPIMarsPhoto {
  id: number;
  sol: number;
  camera: Camera;
  img_src: string;
  earth_date: string;
  rover: RoverMetadata;
}

export interface NasaAPIMarsPhotosResponse {
  photos: NasaAPIMarsPhoto[];
}

export interface NasaAPIMarsManifestResponse {
  photo_manifest: RoverPhotosMetadata;
}
