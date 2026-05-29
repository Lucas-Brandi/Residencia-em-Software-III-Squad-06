import {
  Injectable,
  NotFoundException,
  BadRequestException,
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
    // Se ainda passarem um repositoryId no DTO por compatibilidade, podemos vincular na tabela pivô depois,
    // mas na tabela analysisRule não salvamos mais o ID direto.
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
          ruleType: createAnalysisRuleDto.ruleType,
          content: createAnalysisRuleDto.content,
          createdById: createAnalysisRuleDto.createdById,
          severity: createAnalysisRuleDto.severity ?? Severity.AVISO,
          isActive: createAnalysisRuleDto.isActive ?? true,
        },
        include: this.defaultInclude(),
      });

      // Se foi passado um repositoryId na criação antiga, fazemos o vínculo na tabela pivô Many-to-Many automaticamente
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
    
    // Ajuste cirúrgico: Filtrando através da tabela pivô usando o operador 'some'
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
      const updatedRule = await this.prisma.analysisRule.update({
        where: { id },
        data: {
          ruleType: updateAnalysisRuleDto.ruleType,
          content: updateAnalysisRuleDto.content,
          createdById: updateAnalysisRuleDto.createdById,
          severity: updateAnalysisRuleDto.severity,
          isActive: updateAnalysisRuleDto.isActive,
        },
        include: this.defaultInclude(),
      });

      // Se atualizou o repositório pelo método antigo, garante o vínculo na tabela pivô
      if (updateAnalysisRuleDto.repositoryId) {
        // Verifica se o vínculo já existe para não duplicar
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

  async remove(id: string) {
    const existingRule = await this.prisma.analysisRule.findUnique({
      where: { id },
    });

    if (!existingRule) {
      throw new NotFoundException(`Analysis rule with ID ${id} not found`);
    }

    // Deleta os vínculos na tabela pivô primeiro devido à restrição de chave estrangeira
    await this.prisma.ruleRepository.deleteMany({
      where: { ruleId: id },
    });

    await this.prisma.analysisRule.delete({ where: { id } });

    return existingRule;
  }

  // ─── HELPERS ──────────────────────────────────────────────────────────────────

  private defaultInclude() {
    return {
      // Ajuste cirúrgico: O campo 'repository' virou 'repositories' (relação Many-to-Many)
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