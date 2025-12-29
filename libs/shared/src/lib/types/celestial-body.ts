export interface CelestialBody {
  id: string;
  name: string;
  type: 'star' | 'planet' | 'moon' | 'asteroid';
  position: { x: number; y: number };
  radius: number;
  color: string;
  orbitRadius?: number;
  orbitCenter?: { x: number; y: number };
  selected?: boolean;
  mass?: number;
  info?: string;
}

export interface ViewportState {
  zoom: number;
  panX: number;
  panY: number;
}

export interface SolarSystemData {
  bodies: CelestialBody[];
  center: { x: number; y: number };
  scale: number;
}
