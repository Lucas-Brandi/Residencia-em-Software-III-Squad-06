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
  Query,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AnalysisRulesService } from './analysis-rules.service';
import { FindingsService } from '../findings/findings.service';
import { CreateAnalysisRuleDto } from './dto/create-analysis-rule.dto';
import { UpdateAnalysisRuleDto } from './dto/update-analysis-rule.dto';

@ApiTags('Analysis Rules')
@ApiBearerAuth('access-token')
@Controller('analysis-rules')
export class AnalysisRulesController {
  constructor(
    private readonly analysisRulesService: AnalysisRulesService,
    private readonly findingsService: FindingsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar regra de análise' })
  @ApiBody({ type: CreateAnalysisRuleDto })
  @ApiResponse({
    status: 201,
    description: 'Regra de análise criada com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou referência inexistente',
  })
  async create(@Body() createAnalysisRuleDto: CreateAnalysisRuleDto) {
    const analysisRule = await this.analysisRulesService.create(
      createAnalysisRuleDto,
    );
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Analysis rule created successfully',
      data: analysisRule,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar regras de análise' })
  @ApiQuery({
    name: 'repositoryId',
    required: false,
    description: 'Filtrar regras por UUID do repositório',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de regras retornada com sucesso',
  })
  async findAll(@Query('repositoryId') repositoryId?: string) {
    const analysisRules = await this.analysisRulesService.findAll(repositoryId);
    return {
      statusCode: HttpStatus.OK,
      data: analysisRules,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar regra de análise por ID' })
  @ApiParam({
    name: 'id',
    description: 'UUID da regra de análise',
    type: String,
  })
  @ApiResponse({ status: 200, description: 'Regra de análise encontrada' })
  @ApiResponse({ status: 404, description: 'Regra de análise não encontrada' })
  async findOne(@Param('id') id: string) {
    const analysisRule = await this.analysisRulesService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      data: analysisRule,
    };
  }

  @Get(':id/findings')
  @ApiOperation({
    summary: 'Listar findings gerados pela IA para uma regra',
    description:
      'Retorna todos os findings (descobertas) que foram gerados pela IA ' +
      'e estão associados a esta regra de análise. ' +
      'Cada finding inclui severity, description, filePath, lineNumber e o PR de origem. ' +
      'Útil para entender quais PRs violaram esta regra com mais frequência.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID da regra de análise',
    type: String,
    example: 'c9d8e7f6-a5b4-3210-cdef-fedcba098765',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de findings da regra retornada com sucesso',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 200 },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              analysisResultId: { type: 'string', format: 'uuid' },
              ruleId: { type: 'string', format: 'uuid' },
              severity: {
                type: 'string',
                enum: ['CRITICO', 'AVISO', 'INFO'],
                example: 'AVISO',
              },
              description: {
                type: 'string',
                example: 'Variável usa snake_case em vez de camelCase',
              },
              filePath: {
                type: 'string',
                nullable: true,
                example: 'src/utils/helpers.ts',
              },
              lineNumber: { type: 'number', nullable: true, example: 14 },
              createdAt: { type: 'string', format: 'date-time' },
              analysisResult: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  healthScore: { type: 'number', example: 78 },
                  status: {
                    type: 'string',
                    enum: ['pendente', 'aprovado', 'rejeitado'],
                  },
                  createdAt: { type: 'string', format: 'date-time' },
                  pr: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      prNumber: { type: 'number', example: 42 },
                      title: {
                        type: 'string',
                        example: 'feat: add user endpoint',
                      },
                      githubUrl: { type: 'string', nullable: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Regra de análise não encontrada' })
  async findFindings(@Param('id') id: string) {
    const findings = await this.findingsService.findByRuleId(id);
    return {
      statusCode: HttpStatus.OK,
      data: findings,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar regra de análise' })
  @ApiParam({
    name: 'id',
    description: 'UUID da regra de análise',
    type: String,
  })
  @ApiBody({ type: UpdateAnalysisRuleDto })
  @ApiResponse({
    status: 200,
    description: 'Regra de análise atualizada com sucesso',
  })
  @ApiResponse({
    status: 403,
    description: 'Sem permissão para editar esta regra',
  })
  @ApiResponse({ status: 404, description: 'Regra de análise não encontrada' })
  async update(
    @Param('id') id: string,
    @Body() updateAnalysisRuleDto: UpdateAnalysisRuleDto,
    @Request() req,
  ) {
    const analysisRule = await this.analysisRulesService.update(
      id,
      updateAnalysisRuleDto,
      req.user.id,
      req.user.role,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Analysis rule updated successfully',
      data: analysisRule,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover regra de análise' })
  @ApiParam({
    name: 'id',
    description: 'UUID da regra de análise',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Regra de análise removida com sucesso',
  })
  @ApiResponse({
    status: 403,
    description: 'Sem permissão para deletar esta regra',
  })
  @ApiResponse({ status: 404, description: 'Regra de análise não encontrada' })
  async remove(@Param('id') id: string, @Request() req) {
    const analysisRule = await this.analysisRulesService.remove(
      id,
      req.user.id,
      req.user.role,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Analysis rule deleted successfully',
      data: analysisRule,
    };
  }
}
