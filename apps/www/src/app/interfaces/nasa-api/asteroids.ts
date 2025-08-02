// Links interface for pagination
export interface NasaAPILinks {
  next?: string;
  self: string;
}

// Page information for pagination
export interface NasaAPIPage {
  size: number;
  total_elements: number;
  total_pages: number;
  number: number;
}

// Estimated diameter in different units
export interface EstimatedDiameter {
  estimated_diameter_min: number;
  estimated_diameter_max: number;
}

export interface AsteroidEstimatedDiameter {
  kilometers: EstimatedDiameter;
  meters: EstimatedDiameter;
  miles: EstimatedDiameter;
  feet: EstimatedDiameter;
}

// Relative velocity in different units
export interface RelativeVelocity {
  kilometers_per_second: string;
  kilometers_per_hour: string;
  miles_per_hour: string;
}

// Miss distance in different units
export interface MissDistance {
  astronomical: string;
  lunar: string;
  kilometers: string;
  miles: string;
}

// Close approach data for an asteroid
export interface CloseApproachData {
  close_approach_date: string;
  close_approach_date_full: string;
  epoch_date_close_approach: number;
  relative_velocity: RelativeVelocity;
  miss_distance: MissDistance;
  orbiting_body: string;
}

// Orbital class information
export interface OrbitClass {
  orbit_class_type: string;
  orbit_class_description: string;
  orbit_class_range: string;
}

// Orbital data for an asteroid
export interface OrbitalData {
  orbit_id: string;
  orbit_determination_date: string;
  first_observation_date: string;
  last_observation_date: string;
  data_arc_in_days: number;
  observations_used: number;
  orbit_uncertainty: string;
  minimum_orbit_intersection: string;
  jupiter_tisserand_invariant: string;
  epoch_osculation: string;
  eccentricity: string;
  semi_major_axis: string;
  inclination: string;
  ascending_node_longitude: string;
  orbital_period: string;
  perihelion_distance: string;
  perihelion_argument: string;
  aphelion_distance: string;
  perihelion_time: string;
  mean_anomaly: string;
  mean_motion: string;
  equinox: string;
  orbit_class: OrbitClass;
}

// Main asteroid interface
export interface Asteroid {
  links: NasaAPILinks;
  id: string;
  neo_reference_id: string;
  name: string;
  name_limited: string;
  designation: string;
  nasa_jpl_url: string;
  absolute_magnitude_h: number;
  estimated_diameter: AsteroidEstimatedDiameter;
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: CloseApproachData[];
  orbital_data: OrbitalData;
  is_sentry_object: boolean;
}

// Main response interface for the asteroids API
export interface NasaAPIAsteroidsResponse {
  links: NasaAPILinks;
  page: NasaAPIPage;
  near_earth_objects: Asteroid[];
}

// Request parameters for asteroids API
export interface NasaAPIAsteroidsRequest {
  page?: number;
  size?: number;
  start_date?: string;
  end_date?: string;
}

// Individual asteroid lookup response
export interface NasaAPIAsteroidLookupResponse {
  links: NasaAPILinks;
  id: string;
  neo_reference_id: string;
  name: string;
  name_limited: string;
  designation: string;
  nasa_jpl_url: string;
  absolute_magnitude_h: number;
  estimated_diameter: AsteroidEstimatedDiameter;
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: CloseApproachData[];
  orbital_data: OrbitalData;
  is_sentry_object: boolean;
}
