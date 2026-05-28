import { Controller, Get, Query, HttpStatus, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { FilterDashboardDto } from './dto/filter-dashboard.dto';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('Dashboard')
@ApiBearerAuth('access-token')
@UseGuards(RolesGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  // ─── LISTAGEM DE PRs ────────────────────────────────────────────────────────

  @Get()
  @ApiOperation({ summary: 'Buscar pull requests com filtros opcionais' })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Data inicial (ISO 8601)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Data final (ISO 8601)',
  })
  @ApiQuery({
    name: 'title',
    required: false,
    description: 'Filtro por título (case-insensitive)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de pull requests retornada com sucesso',
  })
  async findAll(@Query() filterDto: FilterDashboardDto) {
    const pullRequests = await this.dashboardService.findAll(filterDto);
    return { statusCode: HttpStatus.OK, data: pullRequests };
  }

  // ─── MÉTRICAS DO ADMIN ──────────────────────────────────────────────────────

  @Get('metrics')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Buscar métricas do admin (cards de estatísticas)',
    description:
      'Retorna totais, economia de tempo, health score médio e breakdown de status. ' +
      'Usado pelos 4 cards de estatísticas da tela de administração.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({
    status: 200,
    description: 'Métricas retornadas com sucesso',
    schema: {
      properties: {
        totalPRsAnalyzed: { type: 'number', example: 42 },
        timeSavedHours: { type: 'number', example: 63 },
        timeSavedFormatted: { type: 'string', example: '63h' },
        avgHealthScore: { type: 'number', example: 78 },
        approvalRate: { type: 'number', example: 85 },
        statusBreakdown: {
          type: 'object',
          properties: {
            approved: { type: 'number' },
            rejected: { type: 'number' },
            pending: { type: 'number' },
          },
        },
        totalUsers: { type: 'number' },
        totalActiveRules: { type: 'number' },
      },
    },
  })
  async getMetrics() {
    const metrics = await this.dashboardService.getMetrics();
    return { statusCode: HttpStatus.OK, data: metrics };
  }
}
