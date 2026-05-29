import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { RulesService } from './rules.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { AssignRuleDto } from './dto/assign-rule.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('rules')
@Controller('rules')
export class RulesController {
  constructor(private readonly rulesService: RulesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar uma nova regra' })
  @ApiResponse({
    status: 201,
    description: 'Regra criada com sucesso',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou usuário não encontrado' })
  @ApiBody({ type: CreateRuleDto })
  async create(@Body() createRuleDto: CreateRuleDto, @Request() req) {
    const userId = req.user?.id || 1; // Fallback para ID 1 se não tiver auth
    const rule = await this.rulesService.create(createRuleDto, userId);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Rule created successfully',
      data: rule,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as regras' })
  @ApiResponse({
    status: 200,
    description: 'Lista de regras retornada com sucesso',
  })
  async findAll() {
    const rules = await this.rulesService.findAll();
    return {
      statusCode: HttpStatus.OK,
      data: rules,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma regra por ID' })
  @ApiParam({ name: 'id', description: 'ID da regra' })
  @ApiResponse({
    status: 200,
    description: 'Regra encontrada com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Regra não encontrada' })
  async findOne(@Param('id') id: string) {
    const rule = await this.rulesService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      data: rule,
    };
  }

  @Post('assign')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Vincular uma regra a um ou mais repositórios' })
  @ApiResponse({
    status: 200,
    description: 'Regra vinculada aos repositórios com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Regra ou repositório(s) não encontrado(s)' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiBody({ type: AssignRuleDto })
  async assignToRepositories(@Body() assignRuleDto: AssignRuleDto) {
    const result = await this.rulesService.assignToRepositories(assignRuleDto);
    return {
      statusCode: HttpStatus.OK,
      ...result,
    };
  }

  @Delete(':ruleId/repositories/:repositoryId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remover vínculo entre regra e repositório' })
  @ApiParam({ name: 'ruleId', description: 'ID da regra' })
  @ApiParam({ name: 'repositoryId', description: 'ID do repositório' })
  @ApiResponse({
    status: 200,
    description: 'Vínculo removido com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Vínculo não encontrado' })
  async removeRepositoryAssignment(
    @Param('ruleId') ruleId: string,
    @Param('repositoryId') repositoryId: string,
  ) {
    const result = await this.rulesService.removeRepositoryAssignment(
      ruleId,
      repositoryId,
    );
    return {
      statusCode: HttpStatus.OK,
      ...result,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma regra' })
  @ApiParam({ name: 'id', description: 'ID da regra' })
  @ApiResponse({
    status: 200,
    description: 'Regra atualizada com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Regra não encontrada' })
  @ApiBody({ type: CreateRuleDto })
  async update(
    @Param('id') id: string,
    @Body() updateRuleDto: Partial<CreateRuleDto>,
  ) {
    const rule = await this.rulesService.update(id, updateRuleDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Rule updated successfully',
      data: rule,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deletar uma regra' })
  @ApiParam({ name: 'id', description: 'ID da regra' })
  @ApiResponse({
    status: 200,
    description: 'Regra deletada com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Regra não encontrada' })
  async remove(@Param('id') id: string) {
    const result = await this.rulesService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      ...result,
    };
  }
}
