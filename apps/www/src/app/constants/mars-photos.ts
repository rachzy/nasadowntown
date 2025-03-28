import { MarsRover } from '../interfaces/nasa-api/mars-photos';

export const ROVERS = ['Curiosity', 'Opportunity', 'Spirit'];
export const ROVER_CAMERAS: Record<MarsRover, string[]> = {
  curiosity: ['FHAZ', 'RHAZ', 'MAST', 'CHEMCAM', 'MAHLI', 'MARDI', 'NAVCAM'],
  opportunity: ['FHAZ', 'RHAZ', 'NAVCAM', 'PANCAM', 'MINITES'],
  spirit: ['FHAZ', 'RHAZ', 'NAVCAM', 'PANCAM', 'MINITES'],
};
export const DEFAULT_ROVER = 'curiosity';
