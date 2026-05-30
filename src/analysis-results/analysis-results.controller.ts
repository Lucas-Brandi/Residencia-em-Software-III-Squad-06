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
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AnalysisResultsService } from './analysis-results.service';
import { CreateAnalysisResultDto } from './dto/create-analysis-result.dto';
import { UpdateAnalysisResultDto } from './dto/update-analysis-result.dto';

@ApiTags('Analysis Results')
@ApiBearerAuth('access-token')
@Controller('analysis-results')
export class AnalysisResultsController {
  constructor(
    private readonly analysisResultsService: AnalysisResultsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar resultado de análise' })
  @ApiBody({ type: CreateAnalysisResultDto })
  @ApiResponse({
    status: 201,
    description: 'Resultado de análise criado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou referência inexistente',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
  @ApiOperation({ summary: 'Buscar resultado de análise por ID' })
  @ApiParam({
    name: 'id',
    description: 'UUID do resultado de análise',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Resultado de análise encontrado (inclui findings)',
    schema: {
      properties: {
        id: { type: 'string' },
        healthScore: { type: 'number' },
        iaFeedback: { type: 'string' },
        status: { type: 'string', enum: ['pendente', 'aprovado', 'rejeitado'] },
        findings: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              severity: { type: 'string', enum: ['CRITICO', 'AVISO', 'INFO'] },
              description: { type: 'string' },
              filePath: { type: 'string', nullable: true },
              lineNumber: { type: 'number', nullable: true },
              rule: { type: 'object', nullable: true },
            },
          },
        },
      },
    },
  })
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

  // ─── NOVO ENDPOINT: Findings de um resultado específico ───────────────────
  // FIX: endpoint dedicado para o front buscar os findings da IA sem
  // precisar carregar o resultado completo

  @Get(':id/findings')
  @ApiOperation({
    summary: 'Listar findings da IA para um resultado de análise',
    description:
      'Retorna todos os findings (descobertas) gerados pela IA para um resultado de análise específico. ' +
      'Cada finding contém severity (CRITICO | AVISO | INFO), description, filePath e lineNumber. ' +
      'Use este endpoint para alimentar o painel "Todas as Descobertas" na tela de PR Analysis.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID do resultado de análise',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de findings retornada com sucesso',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 200 },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'uuid-...' },
              analysisResultId: { type: 'string' },
              severity: {
                type: 'string',
                enum: ['CRITICO', 'AVISO', 'INFO'],
                example: 'CRITICO',
              },
              description: {
                type: 'string',
                example: 'SQL injection via concatenação de string',
              },
              filePath: {
                type: 'string',
                nullable: true,
                example: 'src/api/users.ts',
              },
              lineNumber: { type: 'number', nullable: true, example: 87 },
              rule: {
                type: 'object',
                nullable: true,
                properties: {
                  id: { type: 'string' },
                  title: { type: 'string' },
                  severity: { type: 'string' },
                },
              },
              createdAt: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Resultado de análise não encontrado',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findFindings(@Param('id') id: string) {
    const findings = await this.analysisResultsService.findFindings(id);
    return {
      statusCode: HttpStatus.OK,
      data: findings,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar resultado de análise' })
  @ApiParam({
    name: 'id',
    description: 'UUID do resultado de análise',
    type: String,
  })
  @ApiBody({ type: UpdateAnalysisResultDto })
  @ApiResponse({
    status: 200,
    description: 'Resultado de análise atualizado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou referência inexistente',
  })
  @ApiResponse({
    status: 404,
    description: 'Resultado de análise não encontrado',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
  @ApiParam({
    name: 'id',
    description: 'UUID do resultado de análise',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Resultado de análise removido com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Resultado de análise não encontrado',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async remove(@Param('id') id: string) {
    const analysisResult = await this.analysisResultsService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Analysis result deleted successfully',
      data: analysisResult,
    };
  }
}
