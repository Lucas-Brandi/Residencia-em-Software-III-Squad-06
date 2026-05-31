import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { AssignRuleDto } from './dto/assign-rule.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class RulesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRuleDto: CreateRuleDto, userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const rule = await this.prisma.analysisRule.create({
      data: {
        title: createRuleDto.title,
        description: createRuleDto.description,
        ruleType: createRuleDto.ruleType,
        content: createRuleDto.content,
        severity: createRuleDto.severity || 'AVISO',
        isActive:
          createRuleDto.isActive !== undefined ? createRuleDto.isActive : true,
        createdById: userId,
      },
      include: {
        createdBy: {
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

    return rule;
  }

  async findAll(repositoryId?: string) {
    const where: Prisma.AnalysisRuleWhereInput = {};

    if (repositoryId) {
      where.repositories = {
        some: { repositoryId },
      };
    }

    const rules = await this.prisma.analysisRule.findMany({
      where,
      include: {
        createdBy: {
          select: {
            id: true,
            username: true,
            githubUsername: true,
            avatarUrl: true,
            role: true,
          },
        },
        repositories: {
          include: {
            repository: {
              include: {
                team: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return rules;
  }

  async findOne(id: string) {
    const rule = await this.prisma.analysisRule.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            username: true,
            githubUsername: true,
            avatarUrl: true,
            role: true,
          },
        },
        repositories: {
          include: {
            repository: {
              include: {
                team: true,
              },
            },
          },
        },
      },
    });

    if (!rule) {
      throw new NotFoundException(`Rule with ID ${id} not found`);
    }

    return rule;
  }

  async assignToRepositories(assignRuleDto: AssignRuleDto) {
    const rule = await this.prisma.analysisRule.findUnique({
      where: { id: assignRuleDto.ruleId },
    });

    if (!rule) {
      throw new NotFoundException(
        `Rule with ID ${assignRuleDto.ruleId} not found`,
      );
    }

    const repositories = await this.prisma.repository.findMany({
      where: {
        id: { in: assignRuleDto.repositoryIds },
      },
    });

    if (repositories.length !== assignRuleDto.repositoryIds.length) {
      throw new BadRequestException('One or more repositories not found');
    }

    const assignments = await this.prisma.ruleRepository.createMany({
      data: assignRuleDto.repositoryIds.map((repositoryId) => ({
        ruleId: assignRuleDto.ruleId,
        repositoryId,
      })),
      skipDuplicates: true,
    });

    return {
      message: 'Rule assigned to repositories successfully',
      count: assignments.count,
    };
  }

  async removeRepositoryAssignment(ruleId: string, repositoryId: string) {
    const assignment = await this.prisma.ruleRepository.findUnique({
      where: {
        ruleId_repositoryId: {
          ruleId,
          repositoryId,
        },
      },
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    await this.prisma.ruleRepository.delete({
      where: {
        ruleId_repositoryId: {
          ruleId,
          repositoryId,
        },
      },
    });

    return {
      message: 'Assignment removed successfully',
    };
  }

  async update(
    id: string,
    updateRuleDto: Partial<CreateRuleDto>,
    userId: number,
    userRole: string,
  ) {
    const existingRule = await this.prisma.analysisRule.findUnique({
      where: { id },
      include: {
        repositories: {
          include: {
            repository: {
              include: {
                team: {
                  include: { members: true },
                },
              },
            },
          },
        },
      },
    });

    if (!existingRule) {
      throw new NotFoundException(`Rule with ID ${id} not found`);
    }

    // Verificação de ownership: criador, membro do time ou ADMIN
    const isCreator = existingRule.createdById === userId;
    const isAdmin = userRole === 'ADMIN';
    const isTeamMember = existingRule.repositories.some((ruleRepo) =>
      ruleRepo.repository.team.members.some((m) => m.userId === userId),
    );

    if (!isCreator && !isAdmin && !isTeamMember) {
      throw new ForbiddenException(
        'Você não tem permissão para editar esta regra',
      );
    }

    const rule = await this.prisma.analysisRule.update({
      where: { id },
      data: {
        ...(updateRuleDto.title !== undefined && {
          title: updateRuleDto.title,
        }),
        ...(updateRuleDto.description !== undefined && {
          description: updateRuleDto.description,
        }),
        ...(updateRuleDto.ruleType && { ruleType: updateRuleDto.ruleType }),
        ...(updateRuleDto.content && { content: updateRuleDto.content }),
        ...(updateRuleDto.severity && { severity: updateRuleDto.severity }),
        ...(updateRuleDto.isActive !== undefined && {
          isActive: updateRuleDto.isActive,
        }),
      },
      include: {
        createdBy: {
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

    return rule;
  }

  async remove(id: string, userId: number, userRole: string) {
    const existingRule = await this.prisma.analysisRule.findUnique({
      where: { id },
      include: {
        repositories: {
          include: {
            repository: {
              include: {
                team: {
                  include: { members: true },
                },
              },
            },
          },
        },
      },
    });

    if (!existingRule) {
      throw new NotFoundException(`Rule with ID ${id} not found`);
    }

    // Verificação de ownership: criador, membro do time ou ADMIN
    const isCreator = existingRule.createdById === userId;
    const isAdmin = userRole === 'ADMIN';
    const isTeamMember = existingRule.repositories.some((ruleRepo) =>
      ruleRepo.repository.team.members.some((m) => m.userId === userId),
    );

    if (!isCreator && !isAdmin && !isTeamMember) {
      throw new ForbiddenException(
        'Você não tem permissão para deletar esta regra',
      );
    }

    await this.prisma.analysisRule.delete({
      where: { id },
    });

    return {
      message: 'Rule deleted successfully',
    };
  }
}
