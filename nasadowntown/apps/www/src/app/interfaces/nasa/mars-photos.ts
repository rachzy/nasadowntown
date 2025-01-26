export type NasaAPIMarsRover = 'curiosity' | 'opportunity' | 'spirit';
export type NasaAPIMarsRoverCamera =
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
  name: NasaAPIMarsRover;
  landing_date: string;
  launch_date: string;
  status: string;
}

interface NasaAPIMarsPhotosBaseRequest {
  rover: NasaAPIMarsRover;
  camera?: NasaAPIMarsRoverCamera;
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
  photo_manifest: {
    name: string;
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
  };
}
