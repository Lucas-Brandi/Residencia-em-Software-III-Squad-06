import {
  Controller,
  Get,
  Param,
  Query,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FindingsService, FindingSeverity } from './findings.service';

// ─── Schema reutilizável de um Finding completo ───────────────────────────────
const findingSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      example: 'b2d9f1a0-3c4e-4f1b-9d12-abcdef012345',
    },
    analysisResultId: {
      type: 'string',
      format: 'uuid',
      example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    },
    ruleId: {
      type: 'string',
      format: 'uuid',
      nullable: true,
      example: 'c9d8e7f6-a5b4-3210-cdef-fedcba098765',
    },
    severity: {
      type: 'string',
      enum: ['CRITICO', 'AVISO', 'INFO'],
      example: 'CRITICO',
    },
    description: {
      type: 'string',
      example: 'SQL injection via concatenação de string não sanitizada',
    },
    filePath: {
      type: 'string',
      nullable: true,
      example: 'src/api/users.ts',
    },
    lineNumber: {
      type: 'number',
      nullable: true,
      example: 87,
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      example: '2026-05-30T18:00:00.000Z',
    },
    rule: {
      type: 'object',
      nullable: true,
      properties: {
        id: { type: 'string' },
        title: { type: 'string', example: 'Proibir SQL raw sem sanitização' },
        severity: { type: 'string', enum: ['CRITICO', 'AVISO', 'INFO'] },
        ruleType: { type: 'string', example: 'segurança' },
      },
    },
    analysisResult: {
      type: 'object',
      nullable: true,
      properties: {
        id: { type: 'string' },
        healthScore: { type: 'number', example: 72 },
        status: {
          type: 'string',
          enum: ['pendente', 'aprovado', 'rejeitado'],
        },
        prId: { type: 'string' },
      },
    },
  },
};

// ─── Schema de resposta paginada/lista ────────────────────────────────────────
const findingListResponseSchema = {
  properties: {
    statusCode: { type: 'number', example: 200 },
    data: {
      type: 'array',
      items: findingSchema,
    },
  },
};

@ApiTags('Findings')
@ApiBearerAuth('access-token')
@Controller('findings')
export class FindingsController {
  constructor(private readonly findingsService: FindingsService) {}

  /**
   * GET /findings
   * Lista todos os findings gerados pela IA, com filtros opcionais.
   */
  @Get()
  @ApiOperation({
    summary: 'Listar todos os findings da IA',
    description:
      'Retorna todos os findings gerados pela IA durante as análises de PRs. ' +
      'É possível filtrar por severity, analysisResultId ou ruleId. ' +
      'Findings são criados automaticamente pelo webhook quando um PR é aberto ou atualizado.',
  })
  @ApiQuery({
    name: 'severity',
    required: false,
    enum: ['CRITICO', 'AVISO', 'INFO'],
    description: 'Filtrar findings pela severidade',
  })
  @ApiQuery({
    name: 'analysisResultId',
    required: false,
    type: String,
    description: 'Filtrar findings por UUID do resultado de análise',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiQuery({
    name: 'ruleId',
    required: false,
    type: String,
    description: 'Filtrar findings por UUID da regra que o originou',
    example: 'c9d8e7f6-a5b4-3210-cdef-fedcba098765',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de findings retornada com sucesso',
    schema: findingListResponseSchema,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(
    @Query('severity') severity?: FindingSeverity,
    @Query('analysisResultId') analysisResultId?: string,
    @Query('ruleId') ruleId?: string,
  ) {
    const findings = await this.findingsService.findAll({
      severity,
      analysisResultId,
      ruleId,
    });

    return {
      statusCode: HttpStatus.OK,
      data: findings,
    };
  }

  /**
   * GET /findings/:id
   * Retorna um finding específico pelo UUID.
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Buscar finding por ID',
    description:
      'Retorna um único finding pelo UUID, incluindo a regra que o originou (se houver) ' +
      'e o resultado de análise ao qual pertence.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID do finding',
    type: String,
    example: 'b2d9f1a0-3c4e-4f1b-9d12-abcdef012345',
  })
  @ApiResponse({
    status: 200,
    description: 'Finding encontrado com sucesso',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 200 },
        data: findingSchema,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Finding não encontrado' })
  async findOne(@Param('id') id: string) {
    const finding = await this.findingsService.findOne(id);

    return {
      statusCode: HttpStatus.OK,
      data: finding,
    };
  }
}
