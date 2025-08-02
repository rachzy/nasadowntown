import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { environment } from './environments/environment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(environment.cors);

  await app.listen(environment.port);
  console.log(
    `Application running on port ${environment.port} in ${
      environment.production ? 'production' : 'development'
    } mode`
  );
}
bootstrap();
