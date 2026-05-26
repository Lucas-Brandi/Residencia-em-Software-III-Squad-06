import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
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

@ApiTags('Settings')
@ApiBearerAuth('access-token')
@Controller('settings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  // ─── GET API KEY ────────────────────────────────────────────────────────────

  @Get('api-key')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Buscar chave de API atual (Admin only)',
    description: 'Retorna a chave de API da IA configurada no sistema.',
  })
  @ApiResponse({
    status: 200,
    description: 'Chave de API retornada com sucesso',
    schema: {
      properties: {
        apiKey: { type: 'string', example: 'AIzaSy...' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  getApiKey() {
    return {
      statusCode: HttpStatus.OK,
      data: this.settingsService.getApiKey(),
    };
  }

  // ─── GET ALL SETTINGS ───────────────────────────────────────────────────────

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Buscar todas as configurações (Admin only)',
    description:
      'Retorna todas as configurações do sistema (api key, configs de IA, etc.).',
  })
  @ApiResponse({
    status: 200,
    description: 'Configurações retornadas com sucesso',
    schema: {
      properties: {
        apiKey: { type: 'string' },
        aiModel: { type: 'string' },
        analysisStrictness: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  getSettings() {
    return {
      statusCode: HttpStatus.OK,
      data: this.settingsService.getSettings(),
    };
  }

  // ─── UPDATE API KEY ─────────────────────────────────────────────────────────

  @Put('api-key')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Atualizar chave de API (Admin only)' })
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
