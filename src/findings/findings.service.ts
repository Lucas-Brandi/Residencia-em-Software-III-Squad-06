import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

export type FindingSeverity = 'CRITICO' | 'AVISO' | 'INFO';

export interface FindingsFilter {
  severity?: FindingSeverity;
  analysisResultId?: string;
  ruleId?: string;
}

@Injectable()
export class FindingsService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Include reutilizável ─────────────────────────────────────────────────
  private defaultInclude() {
    return {
      rule: {
        select: {
          id: true,
          title: true,
          severity: true,
          ruleType: true,
        },
      },
      analysisResult: {
        select: {
          id: true,
          healthScore: true,
          status: true,
          prId: true,
        },
      },
    };
  }

  async findAll(filters: FindingsFilter = {}) {
    const where: Prisma.FindingWhereInput = {};

    if (filters.severity) {
      where.severity = filters.severity;
    }

    if (filters.analysisResultId) {
      where.analysisResultId = filters.analysisResultId;
    }

    if (filters.ruleId) {
      where.ruleId = filters.ruleId;
    }

    return this.prisma.finding.findMany({
      where,
      include: this.defaultInclude(),
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const finding = await this.prisma.finding.findUnique({
      where: { id },
      include: this.defaultInclude(),
    });

    if (!finding) {
      throw new NotFoundException(`Finding with ID ${id} not found`);
    }

    return finding;
  }

  async findByRuleId(ruleId: string) {
    // Verifica se a regra existe antes de retornar os findings
    const rule = await this.prisma.analysisRule.findUnique({
      where: { id: ruleId },
    });

    if (!rule) {
      throw new NotFoundException(`Analysis rule with ID ${ruleId} not found`);
    }

    return this.prisma.finding.findMany({
      where: { ruleId },
      include: {
        analysisResult: {
          select: {
            id: true,
            healthScore: true,
            status: true,
            createdAt: true,
            pr: {
              select: {
                id: true,
                prNumber: true,
                title: true,
                githubUrl: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
