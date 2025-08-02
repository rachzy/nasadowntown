import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { NeowsModule } from './neows/neows.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
    }),
    NeowsModule,
    ConfigModule,
  ],
  controllers: [],
})
export class AppModule {}
