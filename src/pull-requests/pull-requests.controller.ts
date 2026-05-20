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
import { PullRequestsService } from './pull-requests.service';
import { CreatePullRequestDto } from './dto/create-pull-request.dto';
import { UpdatePullRequestDto } from './dto/update-pull-request.dto';

@ApiTags('Pull Requests')
@Controller('pull-requests')
export class PullRequestsController {
  constructor(private readonly pullRequestsService: PullRequestsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar pull request' })
  @ApiBody({ type: CreatePullRequestDto })
  @ApiResponse({
    status: 201,
    description: 'Pull request criado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou referência inexistente',
  })
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
  async findAll() {
    const pullRequests = await this.pullRequestsService.findAll();
    return {
      statusCode: HttpStatus.OK,
      data: pullRequests,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar pull request por ID' })
  @ApiParam({ name: 'id', description: 'UUID do pull request', type: String })
  @ApiResponse({ status: 200, description: 'Pull request encontrado' })
  @ApiResponse({ status: 404, description: 'Pull request não encontrado' })
  async findOne(@Param('id') id: string) {
    const pullRequest = await this.pullRequestsService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      data: pullRequest,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar pull request' })
  @ApiParam({ name: 'id', description: 'UUID do pull request', type: String })
  @ApiBody({ type: UpdatePullRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Pull request atualizado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou referência inexistente',
  })
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
