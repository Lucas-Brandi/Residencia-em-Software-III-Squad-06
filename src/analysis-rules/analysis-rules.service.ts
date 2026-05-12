import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnalysisRuleDto } from './dto/create-analysis-rule.dto';
import { UpdateAnalysisRuleDto } from './dto/update-analysis-rule.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AnalysisRulesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAnalysisRuleDto: CreateAnalysisRuleDto) {
    const repository = await this.prisma.repository.findUnique({
      where: { id: createAnalysisRuleDto.repositoryId },
    });

    if (!repository) {
      throw new BadRequestException('Repository not found');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: createAnalysisRuleDto.createdById },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    try {
      const analysisRule = await this.prisma.analysisRule.create({
        data: {
          repositoryId: createAnalysisRuleDto.repositoryId,
          ruleType: createAnalysisRuleDto.ruleType,
          content: createAnalysisRuleDto.content,
          createdById: createAnalysisRuleDto.createdById,
        },
        include: {
          repository: true,
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

      return analysisRule;
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new BadRequestException('Invalid foreign key reference');
        }
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async findAll(repositoryId?: string) {
    const where: Prisma.AnalysisRuleWhereInput = {};

    if (repositoryId) {
      where.repositoryId = repositoryId;
    }

    const analysisRules = await this.prisma.analysisRule.findMany({
      where,
      include: {
        repository: true,
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

    return analysisRules;
  }

  async findOne(id: string) {
    const analysisRule = await this.prisma.analysisRule.findUnique({
      where: { id },
      include: {
        repository: true,
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

    if (!analysisRule) {
      throw new NotFoundException(`Analysis rule with ID ${id} not found`);
    }

    return analysisRule;
  }

  async update(id: string, updateAnalysisRuleDto: UpdateAnalysisRuleDto) {
    const existingRule = await this.prisma.analysisRule.findUnique({
      where: { id },
    });

    if (!existingRule) {
      throw new NotFoundException(`Analysis rule with ID ${id} not found`);
    }

    if (updateAnalysisRuleDto.repositoryId) {
      const repository = await this.prisma.repository.findUnique({
        where: { id: updateAnalysisRuleDto.repositoryId },
      });

      if (!repository) {
        throw new BadRequestException('Repository not found');
      }
    }

    if (updateAnalysisRuleDto.createdById) {
      const user = await this.prisma.user.findUnique({
        where: { id: updateAnalysisRuleDto.createdById },
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }
    }

    try {
      const analysisRule = await this.prisma.analysisRule.update({
        where: { id },
        data: {
          repositoryId: updateAnalysisRuleDto.repositoryId,
          ruleType: updateAnalysisRuleDto.ruleType,
          content: updateAnalysisRuleDto.content,
          createdById: updateAnalysisRuleDto.createdById,
        },
        include: {
          repository: true,
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

      return analysisRule;
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new BadRequestException('Invalid foreign key reference');
        }
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async remove(id: string) {
    const existingRule = await this.prisma.analysisRule.findUnique({
      where: { id },
    });

    if (!existingRule) {
      throw new NotFoundException(`Analysis rule with ID ${id} not found`);
    }

    await this.prisma.analysisRule.delete({
      where: { id },
    });

    return existingRule;
  }
}
