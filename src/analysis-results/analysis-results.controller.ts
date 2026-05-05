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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AnalysisResultsService } from './analysis-results.service';
import { CreateAnalysisResultDto } from './dto/create-analysis-result.dto';
import { UpdateAnalysisResultDto } from './dto/update-analysis-result.dto';

@ApiTags('analysis-results')
@Controller('analysis-results')
export class AnalysisResultsController {
  constructor(
    private readonly analysisResultsService: AnalysisResultsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar um novo resultado de análise' })
  @ApiResponse({
    status: 201,
    description: 'Resultado de análise criado com sucesso',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
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
  async findOne(@Param('id') id: string) {
    const analysisResult = await this.analysisResultsService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      data: analysisResult,
    };
  }

  @Patch(':id')
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
  @ApiOperation({ summary: 'Remover um resultado de análise' })
  @ApiResponse({
    status: 200,
    description: 'Resultado de análise removido com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Resultado de análise não encontrado',
  })
  async remove(@Param('id') id: string) {
    const analysisResult = await this.analysisResultsService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Analysis result deleted successfully',
      data: analysisResult,
    };
  }
}
