import { z } from 'zod';

export const CalculateOrbitSchema = z.object({
  semimajor_axis: z.number().positive('Semimajor axis must be positive'),
  eccentricity: z
    .number()
    .min(0, 'Eccentricity must be non-negative')
    .max(1, 'Eccentricity must be less than 1'),
  inclination: z
    .number()
    .min(0, 'Inclination must be non-negative')
    .max(180, 'Inclination must be between 0 and 180 degrees'),
  mean_anomaly: z
    .number()
    .min(0, 'Mean anomaly must be non-negative')
    .max(360, 'Mean anomaly must be between 0 and 360 degrees'),
  periphelion_argument: z
    .number()
    .min(0, 'Periphelion argument must be non-negative')
    .max(360, 'Periphelion argument must be between 0 and 360 degrees'),
  ascending_node_longitude: z
    .number()
    .min(0, 'Ascending node longitude must be non-negative')
    .max(360, 'Ascending node longitude must be between 0 and 360 degrees'),
  mean_motion: z.number().positive('Mean motion must be positive'),
  orbit_determination_date: z
    .string()
    .regex(
      /^\d{4}\/\d{2}\/\d{2}$/,
      'orbit_determination_date must be in format YYYY/MM/DD'
    ),
  desired_date: z
    .string()
    .regex(
      /^\d{4}\/\d{2}\/\d{2}$/,
      'desired_date must be in format YYYY/MM/DD'
    ),
});

export type CalculateOrbitDto = z.infer<typeof CalculateOrbitSchema>;
