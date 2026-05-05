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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AnalysisRulesService } from './analysis-rules.service';
import { CreateAnalysisRuleDto } from './dto/create-analysis-rule.dto';
import { UpdateAnalysisRuleDto } from './dto/update-analysis-rule.dto';

@ApiTags('analysis-rules')
@Controller('analysis-rules')
export class AnalysisRulesController {
  constructor(private readonly analysisRulesService: AnalysisRulesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar uma nova regra de análise' })
  @ApiResponse({
    status: 201,
    description: 'Regra de análise criada com sucesso',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
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
  @ApiOperation({ summary: 'Listar todas as regras de análise' })
  @ApiResponse({
    status: 200,
    description: 'Lista de regras de análise retornada com sucesso',
  })
  async findAll(@Query('repositoryId') repositoryId?: string) {
    const analysisRules = await this.analysisRulesService.findAll(repositoryId);
    return {
      statusCode: HttpStatus.OK,
      data: analysisRules,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma regra de análise por ID' })
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
  @ApiOperation({ summary: 'Atualizar uma regra de análise' })
  @ApiResponse({
    status: 200,
    description: 'Regra de análise atualizada com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Regra de análise não encontrada' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async update(
    @Param('id') id: string,
    @Body() updateAnalysisRuleDto: UpdateAnalysisRuleDto,
  ) {
    const analysisRule = await this.analysisRulesService.update(
      id,
      updateAnalysisRuleDto,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Analysis rule updated successfully',
      data: analysisRule,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma regra de análise' })
  @ApiResponse({
    status: 200,
    description: 'Regra de análise removida com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Regra de análise não encontrada' })
  async remove(@Param('id') id: string) {
    const analysisRule = await this.analysisRulesService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Analysis rule deleted successfully',
      data: analysisRule,
    };
  }
}
