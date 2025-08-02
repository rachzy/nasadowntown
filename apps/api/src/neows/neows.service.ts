import { Injectable } from '@nestjs/common';
import { getJulianDate } from '@libs/shared/lib/utils/astrophysics/julian';
import {
  calcEccAnom,
  calcHelioCentric,
  calcTrueAnom,
} from '@libs/shared/lib/utils/astrophysics/kepler';
import {
  CalculateOrbitParams,
  OrbitCalculationResult,
} from '@libs/shared/lib/types/nd-api/neows';

const PRECISION_ECCENTRIC_ANOMALY = 10;

@Injectable()
export class NeowsService {
  calculateOrbit(params: CalculateOrbitParams): OrbitCalculationResult {
    const {
      semimajor_axis,
      eccentricity,
      inclination,
      mean_anomaly,
      periphelion_argument,
      ascending_node_longitude,
      mean_motion,
      orbit_determination_date,
      desired_date,
    } = params;

    const julianDesiredDate = getJulianDate(desired_date);
    const julianOrbitDeterminationDate = getJulianDate(
      orbit_determination_date
    );

    const periphelion_longitude =
      ascending_node_longitude + periphelion_argument;

    const mean_anomaly_at_desired_date =
      mean_anomaly +
      mean_motion * (julianDesiredDate - julianOrbitDeterminationDate);

    const eccentric_anomaly = calcEccAnom(
      eccentricity,
      mean_anomaly_at_desired_date,
      PRECISION_ECCENTRIC_ANOMALY
    );

    const true_anomaly = calcTrueAnom(eccentricity, eccentric_anomaly);

    const heliocentric_coordinates = calcHelioCentric(
      semimajor_axis,
      eccentricity,
      inclination,
      true_anomaly,
      ascending_node_longitude,
      periphelion_longitude
    );

    return {
      position: heliocentric_coordinates,
      orbital_elements: {
        semimajor_axis,
        eccentricity,
        inclination,
        true_anomaly,
        argument_of_periapsis: periphelion_argument,
        longitude_of_ascending_node: ascending_node_longitude,
      },
      calculation_date: desired_date,
    };
  }
}
