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
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AddTeamMemberDto } from './dto/add-team-member.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('teams')
@ApiBearerAuth('access-token')
@Controller('teams')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar uma nova equipe' })
  @ApiResponse({ status: 201, description: 'Equipe criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  async create(@Body() createTeamDto: CreateTeamDto) {
    const team = await this.teamsService.create(createTeamDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Team created successfully',
      data: team,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as equipes' })
  @ApiResponse({
    status: 200,
    description: 'Lista de equipes retornada com sucesso',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll() {
    const teams = await this.teamsService.findAll();
    return {
      statusCode: HttpStatus.OK,
      data: teams,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma equipe por ID' })
  @ApiResponse({ status: 200, description: 'Equipe encontrada' })
  @ApiResponse({ status: 404, description: 'Equipe não encontrada' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findOne(@Param('id') id: string) {
    const team = await this.teamsService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      data: team,
    };
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Atualizar uma equipe' })
  @ApiResponse({ status: 200, description: 'Equipe atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Equipe não encontrada' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  async update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    const team = await this.teamsService.update(id, updateTeamDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Team updated successfully',
      data: team,
    };
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Remover uma equipe' })
  @ApiResponse({ status: 200, description: 'Equipe removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Equipe não encontrada' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  async remove(@Param('id') id: string) {
    const team = await this.teamsService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Team deleted successfully',
      data: team,
    };
  }

  @Post(':id/members')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Adicionar um membro à equipe' })
  @ApiResponse({
    status: 201,
    description: 'Membro adicionado à equipe com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Equipe ou usuário não encontrado' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  async addMember(
    @Param('id') id: string,
    @Body() addTeamMemberDto: AddTeamMemberDto,
  ) {
    const teamUser = await this.teamsService.addMember(id, addTeamMemberDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Member added to team successfully',
      data: teamUser,
    };
  }

  @Delete(':id/members/:userId')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Remover um membro da equipe' })
  @ApiResponse({
    status: 200,
    description: 'Membro removido da equipe com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Equipe ou usuário não encontrado' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  async removeMember(@Param('id') id: string, @Param('userId') userId: string) {
    const teamUser = await this.teamsService.removeMember(id, +userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Member removed from team successfully',
      data: teamUser,
    };
  }
}
