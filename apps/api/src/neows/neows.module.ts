import { Module } from '@nestjs/common';
import { NeowsService } from './neows.service';
import { NeowsController } from './neows.controller';

@Module({
  controllers: [NeowsController],
  providers: [NeowsService],
  exports: [NeowsService],
})
export class NeowsModule {}
