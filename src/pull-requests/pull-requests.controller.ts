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
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PullRequestsService } from './pull-requests.service';
import { CreatePullRequestDto } from './dto/create-pull-request.dto';
import { UpdatePullRequestDto } from './dto/update-pull-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('pull-requests')
@ApiBearerAuth()
@Controller('pull-requests')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PullRequestsController {
  constructor(private readonly pullRequestsService: PullRequestsService) {}

  @Post()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar um novo pull request' })
  @ApiResponse({ status: 201, description: 'Pull request criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
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
    return {
      statusCode: HttpStatus.OK,
      data: pullRequests,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um pull request por ID' })
  @ApiResponse({ status: 200, description: 'Pull request encontrado' })
  @ApiResponse({ status: 404, description: 'Pull request não encontrado' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findOne(@Param('id') id: string) {
    const pullRequest = await this.pullRequestsService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      data: pullRequest,
    };
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Atualizar um pull request' })
  @ApiResponse({
    status: 200,
    description: 'Pull request atualizado com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Pull request não encontrado' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
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
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Remover um pull request' })
  @ApiResponse({
    status: 200,
    description: 'Pull request removido com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Pull request não encontrado' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  async remove(@Param('id') id: string) {
    const pullRequest = await this.pullRequestsService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Pull request deleted successfully',
      data: pullRequest,
    };
  }
}
