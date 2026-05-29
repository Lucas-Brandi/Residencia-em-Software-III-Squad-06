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
import { CreateAnalysisRuleDto } from './dto/create-analysis-rule.dto';
import { UpdateAnalysisRuleDto } from './dto/update-analysis-rule.dto';

@ApiTags('Analysis Rules')
@ApiBearerAuth('access-token')
@Controller('analysis-rules')
export class AnalysisRulesController {
  constructor(private readonly analysisRulesService: AnalysisRulesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar regra de análise' })
  @ApiBody({ type: CreateAnalysisRuleDto })
  @ApiResponse({ status: 201, description: 'Regra de análise criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou referência inexistente' })
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
  @ApiResponse({ status: 200, description: 'Lista de regras retornada com sucesso' })
  async findAll(@Query('repositoryId') repositoryId?: string) {
    const analysisRules = await this.analysisRulesService.findAll(repositoryId);
    return {
      statusCode: HttpStatus.OK,
      data: analysisRules,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar regra de análise por ID' })
  @ApiParam({ name: 'id', description: 'UUID da regra de análise', type: String })
  @ApiResponse({ status: 200, description: 'Regra de análise encontrada' })
  @ApiResponse({ status: 404, description: 'Regra de análise não encontrada' })
  async findOne(@Param('id') id: string) {
    const analysisRule = await this.analysisRulesService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      data: analysisRule,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar regra de análise' })
  @ApiParam({ name: 'id', description: 'UUID da regra de análise', type: String })
  @ApiBody({ type: UpdateAnalysisRuleDto })
  @ApiResponse({ status: 200, description: 'Regra de análise atualizada com sucesso' })
  @ApiResponse({ status: 403, description: 'Sem permissão para editar esta regra' })
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
  @ApiParam({ name: 'id', description: 'UUID da regra de análise', type: String })
  @ApiResponse({ status: 200, description: 'Regra de análise removida com sucesso' })
  @ApiResponse({ status: 403, description: 'Sem permissão para deletar esta regra' })
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