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
import { PullRequestsService } from './pull-requests.service';
import { CreatePullRequestDto } from './dto/create-pull-request.dto';
import { UpdatePullRequestDto } from './dto/update-pull-request.dto';

@ApiTags('Pull Requests')
@ApiBearerAuth('access-token')
@Controller('pull-requests')
export class PullRequestsController {
  constructor(private readonly pullRequestsService: PullRequestsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar pull request' })
  @ApiBody({ type: CreatePullRequestDto })
  @ApiResponse({ status: 201, description: 'Pull request criado com sucesso' })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou referência inexistente',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() createPullRequestDto: CreatePullRequestDto) {
    const pullRequest =
      await this.pullRequestsService.create(createPullRequestDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Pull request created successfully',
      data: pullRequest,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os pull requests' })
  @ApiResponse({
    status: 200,
    description: 'Lista de pull requests retornada com sucesso',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll() {
    const pullRequests = await this.pullRequestsService.findAll();
    return { statusCode: HttpStatus.OK, data: pullRequests };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar pull request por ID' })
  @ApiParam({ name: 'id', description: 'UUID do pull request', type: String })
  @ApiResponse({ status: 200, description: 'Pull request encontrado' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Pull request não encontrado' })
  async findOne(@Param('id') id: string) {
    const pullRequest = await this.pullRequestsService.findOne(id);
    return { statusCode: HttpStatus.OK, data: pullRequest };
  }

  // ─── ENDPOINT DA TELA DE PR ANALYSIS ──────────────────────────────────────

  @Get(':id/analysis')
  @ApiOperation({
    summary: 'Buscar PR com resultado completo da análise da IA',
    description:
      'Retorna o PR junto com o feedback mais recente da IA (healthScore, iaFeedback, status) ' +
      'incluindo os findings (descobertas) gerados pela IA, e o histórico completo de análises. ' +
      'Usado pela tela de pr-analysis — elimina a necessidade de dados mockados no front.',
  })
  @ApiParam({ name: 'id', description: 'UUID do pull request', type: String })
  @ApiResponse({
    status: 200,
    description: 'PR com análise e findings retornados com sucesso',
    schema: {
      properties: {
        id: { type: 'string' },
        prNumber: { type: 'number' },
        title: { type: 'string' },
        status: { type: 'string' },
        analysis: {
          type: 'object',
          nullable: true,
          properties: {
            id: { type: 'string' },
            healthScore: { type: 'number', example: 87 },
            iaFeedback: { type: 'string' },
            status: {
              type: 'string',
              enum: ['pendente', 'aprovado', 'rejeitado'],
            },
            reviewedBy: { type: 'object', nullable: true },
            reviewedAt: { type: 'string', format: 'date-time', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            // FIX: findings agora documentados na resposta
            findings: {
              type: 'array',
              description: 'Descobertas geradas pela IA para este PR',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  severity: {
                    type: 'string',
                    enum: ['CRITICO', 'AVISO', 'INFO'],
                    example: 'CRITICO',
                  },
                  description: {
                    type: 'string',
                    example:
                      'SQL injection via concatenação de string em /api/users.ts',
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
                  rule: {
                    type: 'object',
                    nullable: true,
                    properties: {
                      id: { type: 'string' },
                      title: { type: 'string' },
                      severity: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
        analysisHistory: {
          type: 'array',
          description: 'Histórico completo de análises (cada uma com findings)',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Pull request não encontrado' })
  async findOneWithAnalysis(@Param('id') id: string) {
    const data = await this.pullRequestsService.findOneWithAnalysis(id);
    return { statusCode: HttpStatus.OK, data };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar pull request' })
  @ApiParam({ name: 'id', description: 'UUID do pull request', type: String })
  @ApiBody({ type: UpdatePullRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Pull request atualizado com sucesso',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Pull request não encontrado' })
  async update(
    @Param('id') id: string,
    @Body() updatePullRequestDto: UpdatePullRequestDto,
  ) {
    const pullRequest = await this.pullRequestsService.update(
      id,
      updatePullRequestDto,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Pull request updated successfully',
      data: pullRequest,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover pull request' })
  @ApiParam({ name: 'id', description: 'UUID do pull request', type: String })
  @ApiResponse({
    status: 200,
    description: 'Pull request removido com sucesso',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Pull request não encontrado' })
  async remove(@Param('id') id: string) {
    const pullRequest = await this.pullRequestsService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Pull request deleted successfully',
      data: pullRequest,
    };
  }
}
