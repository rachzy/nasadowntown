import { Environment } from '../types/environment';

export const environment: Environment = {
  production: false,
  port: 3000,
  cors: {
    origin: ['http://localhost:4200'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
};
