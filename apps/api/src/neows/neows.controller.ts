import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { NeowsService } from './neows.service';
import {
  CalculateOrbitDto,
  CalculateOrbitSchema,
} from './dto/calculate-orbit.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import {
  CalculateOrbitParams,
  OrbitCalculationResult,
} from '@libs/shared/lib/types/nd-api/neows';

@Controller('neows')
export class NeowsController {
  constructor(private readonly neowsService: NeowsService) {}

  @Post('calculate-orbit')
  @UsePipes(new ZodValidationPipe(CalculateOrbitSchema))
  calculateOrbit(
    @Body() calculateOrbitDto: CalculateOrbitDto
  ): OrbitCalculationResult {
    return this.neowsService.calculateOrbit(
      calculateOrbitDto as CalculateOrbitParams
    );
  }
}
