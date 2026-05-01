import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AddTeamMemberDto } from './dto/add-team-member.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TeamsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTeamDto: CreateTeamDto) {
    const team = await this.prisma.team.create({
      data: {
        name: createTeamDto.name,
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                githubUsername: true,
                avatarUrl: true,
                role: true,
              },
            },
          },
        },
        repositories: true,
      },
    });

    return team;
  }

  async findAll() {
    const teams = await this.prisma.team.findMany({
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                githubUsername: true,
                avatarUrl: true,
                role: true,
              },
            },
          },
        },
        repositories: true,
      },
    });

    return teams;
  }

  async findOne(id: string) {
    const team = await this.prisma.team.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                githubUsername: true,
                avatarUrl: true,
                role: true,
              },
            },
          },
        },
        repositories: true,
      },
    });

    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }

    return team;
  }

  async update(id: string, updateTeamDto: UpdateTeamDto) {
    const existingTeam = await this.prisma.team.findUnique({
      where: { id },
    });

    if (!existingTeam) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }

    const team = await this.prisma.team.update({
      where: { id },
      data: {
        name: updateTeamDto.name,
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                githubUsername: true,
                avatarUrl: true,
                role: true,
              },
            },
          },
        },
        repositories: true,
      },
    });

    return team;
  }

  async remove(id: string) {
    const existingTeam = await this.prisma.team.findUnique({
      where: { id },
    });

    if (!existingTeam) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }

    await this.prisma.team.delete({
      where: { id },
    });

    return existingTeam;
  }

  async addMember(teamId: string, addTeamMemberDto: AddTeamMemberDto) {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new NotFoundException(`Team with ID ${teamId} not found`);
    }

    const user = await this.prisma.user.findUnique({
      where: { id: addTeamMemberDto.userId },
    });

    if (!user) {
      throw new NotFoundException(
        `User with ID ${addTeamMemberDto.userId} not found`,
      );
    }

    try {
      const teamUser = await this.prisma.teamUser.create({
        data: {
          teamId: teamId,
          userId: addTeamMemberDto.userId,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              githubUsername: true,
              avatarUrl: true,
              role: true,
            },
          },
        },
      });

      return teamUser;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('User is already a member of this team');
        }
      }
      throw error;
    }
  }

  async removeMember(teamId: string, userId: number) {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new NotFoundException(`Team with ID ${teamId} not found`);
    }

    const existingMember = await this.prisma.teamUser.findUnique({
      where: {
        teamId_userId: {
          teamId: teamId,
          userId: userId,
        },
      },
    });

    if (!existingMember) {
      throw new NotFoundException(`User is not a member of this team`);
    }

    await this.prisma.teamUser.delete({
      where: {
        teamId_userId: {
          teamId: teamId,
          userId: userId,
        },
      },
    });

    return existingMember;
  }
}
