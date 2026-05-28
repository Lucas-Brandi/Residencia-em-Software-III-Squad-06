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
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AddTeamMemberDto } from './dto/add-team-member.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('Teams')
@ApiBearerAuth('access-token')
@UseGuards(RolesGuard)
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  // ─── CREATE (ADMIN only) ───────────────────────────────────────────────────

  @Post()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar equipe (Admin only)' })
  @ApiBody({ type: CreateTeamDto })
  @ApiResponse({ status: 201, description: 'Equipe criada com sucesso' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  async create(@Body() createTeamDto: CreateTeamDto) {
    const team = await this.teamsService.create(createTeamDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Team created successfully',
      data: team,
    };
  }

  // ─── GET ALL (todos logados) ───────────────────────────────────────────────

  @Get()
  @ApiOperation({ summary: 'Listar todas as equipes' })
  @ApiResponse({
    status: 200,
    description: 'Lista de equipes retornada com sucesso',
  })
  async findAll() {
    const teams = await this.teamsService.findAll();
    return { statusCode: HttpStatus.OK, data: teams };
  }

  // ─── GET BY ID (todos logados) ─────────────────────────────────────────────

  @Get(':id')
  @ApiOperation({ summary: 'Buscar equipe por ID' })
  @ApiParam({ name: 'id', description: 'UUID da equipe', type: String })
  @ApiResponse({ status: 200, description: 'Equipe encontrada' })
  @ApiResponse({ status: 404, description: 'Equipe não encontrada' })
  async findOne(@Param('id') id: string) {
    const team = await this.teamsService.findOne(id);
    return { statusCode: HttpStatus.OK, data: team };
  }

  // ─── UPDATE (ADMIN only) ───────────────────────────────────────────────────

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Atualizar equipe (Admin only)' })
  @ApiParam({ name: 'id', description: 'UUID da equipe', type: String })
  @ApiBody({ type: UpdateTeamDto })
  @ApiResponse({ status: 200, description: 'Equipe atualizada com sucesso' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 404, description: 'Equipe não encontrada' })
  async update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    const team = await this.teamsService.update(id, updateTeamDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Team updated successfully',
      data: team,
    };
  }

  // ─── DELETE (ADMIN only) ───────────────────────────────────────────────────

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Remover equipe (Admin only)' })
  @ApiParam({ name: 'id', description: 'UUID da equipe', type: String })
  @ApiResponse({ status: 200, description: 'Equipe removida com sucesso' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 404, description: 'Equipe não encontrada' })
  async remove(@Param('id') id: string) {
    const team = await this.teamsService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Team deleted successfully',
      data: team,
    };
  }

  // ─── ADD MEMBER (ADMIN only) ───────────────────────────────────────────────

  @Post(':id/members')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Adicionar membro à equipe (Admin only)' })
  @ApiParam({ name: 'id', description: 'UUID da equipe', type: String })
  @ApiBody({ type: AddTeamMemberDto })
  @ApiResponse({ status: 201, description: 'Membro adicionado com sucesso' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
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

  // ─── REMOVE MEMBER (ADMIN only) ────────────────────────────────────────────

  @Delete(':id/members/:userId')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Remover membro da equipe (Admin only)' })
  @ApiParam({ name: 'id', description: 'UUID da equipe', type: String })
  @ApiParam({
    name: 'userId',
    description: 'ID numérico do usuário',
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'Membro removido com sucesso' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({
    status: 404,
    description: 'Equipe não encontrada ou usuário não é membro',
  })
  async removeMember(@Param('id') id: string, @Param('userId') userId: string) {
    const teamUser = await this.teamsService.removeMember(id, +userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Member removed from team successfully',
      data: teamUser,
    };
  }
}
