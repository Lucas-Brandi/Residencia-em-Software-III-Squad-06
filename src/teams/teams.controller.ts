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
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AddTeamMemberDto } from './dto/add-team-member.dto';

@ApiTags('Teams')
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar equipe' })
  @ApiBody({ type: CreateTeamDto })
  @ApiResponse({ status: 201, description: 'Equipe criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
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
  @ApiResponse({ status: 200, description: 'Lista de equipes retornada com sucesso' })
  async findAll() {
    const teams = await this.teamsService.findAll();
    return {
      statusCode: HttpStatus.OK,
      data: teams,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar equipe por ID' })
  @ApiParam({ name: 'id', description: 'UUID da equipe', type: String })
  @ApiResponse({ status: 200, description: 'Equipe encontrada' })
  @ApiResponse({ status: 404, description: 'Equipe não encontrada' })
  async findOne(@Param('id') id: string) {
    const team = await this.teamsService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      data: team,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar equipe' })
  @ApiParam({ name: 'id', description: 'UUID da equipe', type: String })
  @ApiBody({ type: UpdateTeamDto })
  @ApiResponse({ status: 200, description: 'Equipe atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Equipe não encontrada' })
  async update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    const team = await this.teamsService.update(id, updateTeamDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Team updated successfully',
      data: team,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover equipe' })
  @ApiParam({ name: 'id', description: 'UUID da equipe', type: String })
  @ApiResponse({ status: 200, description: 'Equipe removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Equipe não encontrada' })
  async remove(@Param('id') id: string) {
    const team = await this.teamsService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Team deleted successfully',
      data: team,
    };
  }

  @Post(':id/members')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Adicionar membro à equipe' })
  @ApiParam({ name: 'id', description: 'UUID da equipe', type: String })
  @ApiBody({ type: AddTeamMemberDto })
  @ApiResponse({ status: 201, description: 'Membro adicionado com sucesso' })
  @ApiResponse({ status: 404, description: 'Equipe ou usuário não encontrado' })
  @ApiResponse({ status: 409, description: 'Usuário já é membro da equipe' })
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
  @ApiOperation({ summary: 'Remover membro da equipe' })
  @ApiParam({ name: 'id', description: 'UUID da equipe', type: String })
  @ApiParam({ name: 'userId', description: 'ID numérico do usuário', type: Number })
  @ApiResponse({ status: 200, description: 'Membro removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Equipe não encontrada ou usuário não é membro' })
  async removeMember(@Param('id') id: string, @Param('userId') userId: string) {
    const teamUser = await this.teamsService.removeMember(id, +userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Member removed from team successfully',
      data: teamUser,
    };
  }
}
