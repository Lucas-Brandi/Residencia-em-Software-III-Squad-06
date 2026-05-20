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
import { RepositoriesService } from './repositories.service';
import { CreateRepositoryDto } from './dto/create-repository.dto';
import { UpdateRepositoryDto } from './dto/update-repository.dto';

@ApiTags('Repositories')
@Controller('repositories')
export class RepositoriesController {
  constructor(private readonly repositoriesService: RepositoriesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar repositório' })
  @ApiBody({ type: CreateRepositoryDto })
  @ApiResponse({ status: 201, description: 'Repositório criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou equipe inexistente' })
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
  @ApiResponse({ status: 200, description: 'Lista de repositórios retornada com sucesso' })
  async findAll() {
    const repositories = await this.repositoriesService.findAll();
    return {
      statusCode: HttpStatus.OK,
      data: repositories,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar repositório por ID' })
  @ApiParam({ name: 'id', description: 'UUID do repositório', type: String })
  @ApiResponse({ status: 200, description: 'Repositório encontrado' })
  @ApiResponse({ status: 404, description: 'Repositório não encontrado' })
  async findOne(@Param('id') id: string) {
    const repository = await this.repositoriesService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      data: repository,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar repositório' })
  @ApiParam({ name: 'id', description: 'UUID do repositório', type: String })
  @ApiBody({ type: UpdateRepositoryDto })
  @ApiResponse({ status: 200, description: 'Repositório atualizado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou equipe inexistente' })
  @ApiResponse({ status: 404, description: 'Repositório não encontrado' })
  @ApiResponse({ status: 409, description: 'Repositório GitHub já cadastrado' })
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
  @ApiOperation({ summary: 'Remover repositório (soft delete)' })
  @ApiParam({ name: 'id', description: 'UUID do repositório', type: String })
  @ApiResponse({ status: 200, description: 'Repositório removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Repositório não encontrado' })
  async remove(@Param('id') id: string) {
    const repository = await this.repositoriesService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Repository deleted successfully (soft delete)',
      data: repository,
    };
  }
}
