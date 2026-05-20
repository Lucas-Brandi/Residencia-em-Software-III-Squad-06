import { Controller, Put, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { UpdateApiKeyDto } from './dto/update-api-key.dto';
import { UpdateApiKeyResponseDto } from './dto/update-api-key-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('settings')
@ApiBearerAuth('access-token')
@Controller('settings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Put('api-key')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update API key (Admin only)' })
  @ApiBody({ type: UpdateApiKeyDto })
  @ApiResponse({
    status: 200,
    description: 'Chave de API atualizada com sucesso',
    type: UpdateApiKeyResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  updateApiKey(
    @Body() updateApiKeyDto: UpdateApiKeyDto,
  ): UpdateApiKeyResponseDto {
    return this.settingsService.updateApiKey(updateApiKeyDto.apiKey);
  }
}
