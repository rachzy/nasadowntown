import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('config')
export class ConfigController {
  constructor(private configService: ConfigService) {}

  @Get('api-key')
  getApiKey() {
    return {
      apiKey: this.configService.get<string>('NASA_API_KEY'),
    };
  }
}
