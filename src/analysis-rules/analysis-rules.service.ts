import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateAnalysisRuleDto,
  Severity,
} from './dto/create-analysis-rule.dto';
import { UpdateAnalysisRuleDto } from './dto/update-analysis-rule.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AnalysisRulesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAnalysisRuleDto: CreateAnalysisRuleDto) {
    if (createAnalysisRuleDto.repositoryId) {
      const repository = await this.prisma.repository.findUnique({
        where: { id: createAnalysisRuleDto.repositoryId },
      });

      if (!repository) {
        throw new BadRequestException('Repository not found');
      }
    }

    const user = await this.prisma.user.findUnique({
      where: { id: createAnalysisRuleDto.createdById },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    try {
      const rule = await this.prisma.analysisRule.create({
        data: {
          title: createAnalysisRuleDto.title,
          description: createAnalysisRuleDto.description,
          ruleType: createAnalysisRuleDto.ruleType,
          content: createAnalysisRuleDto.content,
          createdById: createAnalysisRuleDto.createdById,
          severity: createAnalysisRuleDto.severity ?? Severity.AVISO,
          isActive: createAnalysisRuleDto.isActive ?? true,
        },
        include: this.defaultInclude(),
      });

      if (createAnalysisRuleDto.repositoryId) {
        await this.prisma.ruleRepository.create({
          data: {
            ruleId: rule.id,
            repositoryId: createAnalysisRuleDto.repositoryId,
          },
        });
      }

      return rule;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findAll(repositoryId?: string) {
    const where: Prisma.AnalysisRuleWhereInput = {};

    if (repositoryId) {
      where.repositories = {
        some: {
          repositoryId: repositoryId,
        },
      };
    }

    return this.prisma.analysisRule.findMany({
      where,
      include: this.defaultInclude(),
    });
  }

  async findOne(id: string) {
    const rule = await this.prisma.analysisRule.findUnique({
      where: { id },
      include: this.defaultInclude(),
    });

    if (!rule) {
      throw new NotFoundException(`Analysis rule with ID ${id} not found`);
    }

    return rule;
  }

  async update(
    id: string,
    updateAnalysisRuleDto: UpdateAnalysisRuleDto,
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
      throw new NotFoundException(`Analysis rule with ID ${id} not found`);
    }

    // Verificação de ownership: criador, membro do time ou ADMIN
    const isCreator = existingRule.createdById === userId;
    const isAdmin = userRole === 'ADMIN';
    const isTeamMember = existingRule.repositories.some((ruleRepo) =>
      ruleRepo.repository.team?.members.some((m) => m.userId === userId),
    );

    if (!isCreator && !isAdmin && !isTeamMember) {
      throw new ForbiddenException(
        'Você não tem permissão para editar esta regra',
      );
    }

    if (updateAnalysisRuleDto.repositoryId) {
      const repository = await this.prisma.repository.findUnique({
        where: { id: updateAnalysisRuleDto.repositoryId },
      });
      if (!repository) {
        throw new BadRequestException('Repository not found');
      }
    }

    try {
      const updatedRule = await this.prisma.analysisRule.update({
        where: { id },
        data: {
          ...(updateAnalysisRuleDto.title !== undefined && {
            title: updateAnalysisRuleDto.title,
          }),
          ...(updateAnalysisRuleDto.description !== undefined && {
            description: updateAnalysisRuleDto.description,
          }),
          ...(updateAnalysisRuleDto.ruleType !== undefined && {
            ruleType: updateAnalysisRuleDto.ruleType,
          }),
          ...(updateAnalysisRuleDto.content !== undefined && {
            content: updateAnalysisRuleDto.content,
          }),
          ...(updateAnalysisRuleDto.severity !== undefined && {
            severity: updateAnalysisRuleDto.severity,
          }),
          ...(updateAnalysisRuleDto.isActive !== undefined && {
            isActive: updateAnalysisRuleDto.isActive,
          }),
          // Nunca permite alterar o criador via update
        },
        include: this.defaultInclude(),
      });

      if (updateAnalysisRuleDto.repositoryId) {
        const existingRelation = await this.prisma.ruleRepository.findUnique({
          where: {
            ruleId_repositoryId: {
              ruleId: id,
              repositoryId: updateAnalysisRuleDto.repositoryId,
            },
          },
        });

        if (!existingRelation) {
          await this.prisma.ruleRepository.create({
            data: {
              ruleId: id,
              repositoryId: updateAnalysisRuleDto.repositoryId,
            },
          });
        }
      }

      return updatedRule;
    } catch (error) {
      this.handlePrismaError(error);
    }
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
      throw new NotFoundException(`Analysis rule with ID ${id} not found`);
    }

    // Verificação de ownership: criador, membro do time ou ADMIN
    const isCreator = existingRule.createdById === userId;
    const isAdmin = userRole === 'ADMIN';
    const isTeamMember = existingRule.repositories.some((ruleRepo) =>
      ruleRepo.repository.team?.members.some((m) => m.userId === userId),
    );

    if (!isCreator && !isAdmin && !isTeamMember) {
      throw new ForbiddenException(
        'Você não tem permissão para deletar esta regra',
      );
    }

    await this.prisma.ruleRepository.deleteMany({
      where: { ruleId: id },
    });

    await this.prisma.analysisRule.delete({ where: { id } });

    return existingRule;
  }

  // ─── HELPERS ──────────────────────────────────────────────────────────────────

  private defaultInclude() {
    return {
      repositories: {
        include: {
          repository: true,
        },
      },
      createdBy: {
        select: {
          id: true,
          username: true,
          githubUsername: true,
          avatarUrl: true,
          role: true,
        },
      },
    };
  }

  private handlePrismaError(error: any): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        throw new BadRequestException('Invalid foreign key reference');
      }
    }
    throw error;
  }
}
