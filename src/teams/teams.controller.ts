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
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AddTeamMemberDto } from './dto/add-team-member.dto';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTeamDto: CreateTeamDto) {
    const team = await this.teamsService.create(createTeamDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Team created successfully',
      data: team,
    };
  }

  @Get()
  async findAll() {
    const teams = await this.teamsService.findAll();
    return {
      statusCode: HttpStatus.OK,
      data: teams,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const team = await this.teamsService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      data: team,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    const team = await this.teamsService.update(id, updateTeamDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Team updated successfully',
      data: team,
    };
  }

  @Delete(':id')
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
  async removeMember(@Param('id') id: string, @Param('userId') userId: string) {
    const teamUser = await this.teamsService.removeMember(id, +userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Member removed from team successfully',
      data: teamUser,
    };
  }
}
