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
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RepositoriesService } from './repositories.service';
import { CreateRepositoryDto } from './dto/create-repository.dto';
import { UpdateRepositoryDto } from './dto/update-repository.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('Repositories')
@ApiBearerAuth('access-token')
@UseGuards(RolesGuard)
@Controller('repositories')
export class RepositoriesController {
  constructor(private readonly repositoriesService: RepositoriesService) {}

  @Post()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar repositório (Admin only)' })
  @ApiBody({ type: CreateRepositoryDto })
  @ApiResponse({ status: 201, description: 'Repositório criado com sucesso' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 409, description: 'Repositório GitHub já cadastrado' })
  async create(@Body() createRepositoryDto: CreateRepositoryDto) {
    const repository =
      await this.repositoriesService.create(createRepositoryDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Repository created successfully',
      data: repository,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os repositórios' })
  @ApiResponse({
    status: 200,
    description: 'Lista de repositórios retornada com sucesso',
  })
  async findAll() {
    const repositories = await this.repositoriesService.findAll();
    return { statusCode: HttpStatus.OK, data: repositories };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar repositório por ID' })
  @ApiParam({ name: 'id', description: 'UUID do repositório', type: String })
  @ApiResponse({ status: 200, description: 'Repositório encontrado' })
  @ApiResponse({ status: 404, description: 'Repositório não encontrado' })
  async findOne(@Param('id') id: string) {
    const repository = await this.repositoriesService.findOne(id);
    return { statusCode: HttpStatus.OK, data: repository };
  }

  @Get(':id/rules')
  @ApiOperation({
    summary: 'Listar regras vinculadas a um repositório',
    description:
      'Retorna todas as regras de análise vinculadas ao repositório informado. ' +
      'Inclui criador de cada regra, severity e status (ativo/inativo). ' +
      'Útil para popular a tabela de regras filtrada por repositório no front.',
  })
  @ApiParam({ name: 'id', description: 'UUID do repositório', type: String })
  @ApiResponse({
    status: 200,
    description: 'Lista de regras do repositório retornada com sucesso',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 200 },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              title: {
                type: 'string',
                example: 'Proibir variáveis snake_case',
              },
              description: { type: 'string', nullable: true },
              ruleType: { type: 'string', example: 'clean_code' },
              content: { type: 'string' },
              severity: {
                type: 'string',
                enum: ['CRITICO', 'AVISO', 'INFO'],
                example: 'AVISO',
              },
              isActive: { type: 'boolean', example: true },
              createdAt: { type: 'string', format: 'date-time' },
              createdBy: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  username: { type: 'string' },
                  githubUsername: { type: 'string', nullable: true },
                  avatarUrl: { type: 'string', nullable: true },
                  role: { type: 'string', enum: ['USER', 'ADMIN'] },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Repositório não encontrado' })
  async findRules(@Param('id') id: string) {
    const rules = await this.repositoriesService.findRules(id);
    return { statusCode: HttpStatus.OK, data: rules };
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Atualizar repositório (Admin only)' })
  @ApiParam({ name: 'id', description: 'UUID do repositório', type: String })
  @ApiBody({ type: UpdateRepositoryDto })
  @ApiResponse({
    status: 200,
    description: 'Repositório atualizado com sucesso',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 404, description: 'Repositório não encontrado' })
  async update(
    @Param('id') id: string,
    @Body() updateRepositoryDto: UpdateRepositoryDto,
  ) {
    const repository = await this.repositoriesService.update(
      id,
      updateRepositoryDto,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Repository updated successfully',
      data: repository,
    };
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Remover repositório (Admin only)' })
  @ApiParam({ name: 'id', description: 'UUID do repositório', type: String })
  @ApiResponse({ status: 200, description: 'Repositório removido com sucesso' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 404, description: 'Repositório não encontrado' })
  async remove(@Param('id') id: string) {
    const repository = await this.repositoriesService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Repository deleted successfully',
      data: repository,
    };
  }
}
