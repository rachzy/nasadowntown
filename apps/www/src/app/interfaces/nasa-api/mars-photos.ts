export type MarsRover = 'curiosity' | 'opportunity' | 'spirit';
export type CapitalizedMarsRover = 'Curiosity' | 'Opportunity' | 'Spirit';
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

export interface Manifest {
  name: CapitalizedMarsRover;
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

export type Manifests = Record<MarsRover, Manifest>;

interface NasaAPIMarsPhotosBaseRequest {
  rover: MarsRover;
  camera?: MarsRoverCamera;
  sol?: number;
  page?: number;
  earthDate?: Date;
}

export type CuriosityCameras =
  | 'FHAZ'
  | 'RHAZ'
  | 'MAST'
  | 'CHEMCAM'
  | 'MAHLI'
  | 'MARDI'
  | 'NAVCAM';

export type OtherCameras = 'FHAZ' | 'RHAZ' | 'NAVCAM' | 'PANCAM' | 'MINITES';
export type RoverCameras = CuriosityCameras | OtherCameras;

export type NasaAPIMarsPhotosRequest = NasaAPIMarsPhotosBaseRequest & {
  rover: MarsRover;
  camera?: RoverCameras;
};

export interface NasaAPIMarsPhoto {
  id: string;
  sol: number;
  camera: Camera;
  img_src: string;
  earth_date: string;
  rover: RoverMetadata;
  isBroken?: boolean;
}

export interface NasaAPIMarsPhotosResponse {
  photos: NasaAPIMarsPhoto[];
}

export interface NasaAPIMarsManifestResponse {
  photo_manifest: Manifest;
}
