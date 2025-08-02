export type Environment = {
  production: boolean;
  port: number;
  cors: {
    origin: string[];
    methods: string[];
    allowedHeaders: string[];
    credentials: boolean;
  };
};
