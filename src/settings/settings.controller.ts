import { Controller, Put, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateApiKeyDto } from './dto/update-api-key.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('settings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Put('api-key')
  @Roles('ADMIN')
  updateApiKey(@Body() updateApiKeyDto: UpdateApiKeyDto) {
    return this.settingsService.updateApiKey(updateApiKeyDto.apiKey);
  }
}
