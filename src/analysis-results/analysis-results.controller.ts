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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { AnalysisResultsService } from './analysis-results.service';
import { CreateAnalysisResultDto } from './dto/create-analysis-result.dto';
import { UpdateAnalysisResultDto } from './dto/update-analysis-result.dto';

@ApiTags('Analysis Results')
@Controller('analysis-results')
export class AnalysisResultsController {
  constructor(
    private readonly analysisResultsService: AnalysisResultsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar resultado de análise' })
  @ApiBody({ type: CreateAnalysisResultDto })
  @ApiResponse({ status: 201, description: 'Resultado de análise criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou referência inexistente' })
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
  @ApiOperation({ summary: 'Buscar resultado de análise por ID' })
  @ApiParam({ name: 'id', description: 'UUID do resultado de análise', type: String })
  @ApiResponse({ status: 200, description: 'Resultado de análise encontrado' })
  @ApiResponse({ status: 404, description: 'Resultado de análise não encontrado' })
  async findOne(@Param('id') id: string) {
    const analysisResult = await this.analysisResultsService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      data: analysisResult,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar resultado de análise' })
  @ApiParam({ name: 'id', description: 'UUID do resultado de análise', type: String })
  @ApiBody({ type: UpdateAnalysisResultDto })
  @ApiResponse({ status: 200, description: 'Resultado de análise atualizado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou referência inexistente' })
  @ApiResponse({ status: 404, description: 'Resultado de análise não encontrado' })
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
  @ApiOperation({ summary: 'Remover resultado de análise' })
  @ApiParam({ name: 'id', description: 'UUID do resultado de análise', type: String })
  @ApiResponse({ status: 200, description: 'Resultado de análise removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Resultado de análise não encontrado' })
  async remove(@Param('id') id: string) {
    const analysisResult = await this.analysisResultsService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Analysis result deleted successfully',
      data: analysisResult,
    };
  }
}
