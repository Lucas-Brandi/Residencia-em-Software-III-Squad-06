import { Controller, Put, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { UpdateApiKeyDto } from './dto/update-api-key.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('settings')
@ApiBearerAuth()
@Controller('settings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Put('api-key')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update API key (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'API key updated successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  updateApiKey(@Body() updateApiKeyDto: UpdateApiKeyDto) {
    return this.settingsService.updateApiKey(updateApiKeyDto.apiKey);
  }
}
