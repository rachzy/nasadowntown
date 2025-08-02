import { Environment } from '../types/environment';

export const environment: Environment = {
  production: true,
  port: Number(process.env.PORT) || 3000,
  cors: {
    origin: [process.env.ND_PROD_API_URL],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
};
