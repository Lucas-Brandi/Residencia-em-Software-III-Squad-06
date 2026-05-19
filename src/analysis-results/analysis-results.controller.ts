import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AnalysisResultsService } from './analysis-results.service';
import { CreateAnalysisResultDto } from './dto/create-analysis-result.dto';
import { UpdateAnalysisResultDto } from './dto/update-analysis-result.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('analysis-results')
@ApiBearerAuth('access-token')
@Controller('analysis-results')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnalysisResultsController {
  constructor(
    private readonly analysisResultsService: AnalysisResultsService,
  ) {}

  @Post()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar um novo resultado de análise' })
  @ApiResponse({
    status: 201,
    description: 'Resultado de análise criado com sucesso',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  async create(@Body() createAnalysisResultDto: CreateAnalysisResultDto) {
    const analysisResult = await this.analysisResultsService.create(
      createAnalysisResultDto,
    );
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Analysis result created successfully',
      data: analysisResult,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os resultados de análise' })
  @ApiResponse({
    status: 200,
    description: 'Lista de resultados de análise retornada com sucesso',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll() {
    const analysisResults = await this.analysisResultsService.findAll();
    return {
      statusCode: HttpStatus.OK,
      data: analysisResults,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um resultado de análise por ID' })
  @ApiResponse({ status: 200, description: 'Resultado de análise encontrado' })
  @ApiResponse({
    status: 404,
    description: 'Resultado de análise não encontrado',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findOne(@Param('id') id: string) {
    const analysisResult = await this.analysisResultsService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      data: analysisResult,
    };
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Atualizar um resultado de análise' })
  @ApiResponse({
    status: 200,
    description: 'Resultado de análise atualizado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Resultado de análise não encontrado',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  async update(
    @Param('id') id: string,
    @Body() updateAnalysisResultDto: UpdateAnalysisResultDto,
  ) {
    const analysisResult = await this.analysisResultsService.update(
      id,
      updateAnalysisResultDto,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Analysis result updated successfully',
      data: analysisResult,
    };
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Remover um resultado de análise' })
  @ApiResponse({
    status: 200,
    description: 'Resultado de análise removido com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Resultado de análise não encontrado',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  async remove(@Param('id') id: string) {
    const analysisResult = await this.analysisResultsService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Analysis result deleted successfully',
      data: analysisResult,
    };
  }
}
