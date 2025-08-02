export type OrbitCalculationResult = {
  position: {
    x: number;
    y: number;
    z: number;
  };
  orbital_elements: {
    semimajor_axis: number;
    eccentricity: number;
    inclination: number;
    true_anomaly: number;
    argument_of_periapsis: number;
    longitude_of_ascending_node: number;
  };
  calculation_date: string;
};

export type CalculateOrbitParams = {
  semimajor_axis: number;
  eccentricity: number;
  inclination: number;
  mean_anomaly: number;
  periphelion_argument: number;
  ascending_node_longitude: number;
  mean_motion: number;
  orbit_determination_date: string;
  desired_date: string;
};
