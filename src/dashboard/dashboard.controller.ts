import { Controller, Get, Query, HttpStatus } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { FilterDashboardDto } from './dto/filter-dashboard.dto';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

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
    return {
      statusCode: HttpStatus.OK,
      data: pullRequests,
    };
  }
}
