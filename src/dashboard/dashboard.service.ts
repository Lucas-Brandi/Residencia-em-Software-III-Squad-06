import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FilterDashboardDto } from './dto/filter-dashboard.dto';
import { Prisma } from '@prisma/client';

// Tempo médio (em horas) que um desenvolvedor levaria para revisar um PR manualmente
const MANUAL_REVIEW_HOURS = 2;

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── LISTAGEM DE PRs (mantida) ─────────────────────────────────────────────

  async findAll(filterDto: FilterDashboardDto) {
    const where: Prisma.PullRequestWhereInput = {};

    if (filterDto.startDate || filterDto.endDate) {
      where.openedAt = {};
      if (filterDto.startDate)
        where.openedAt.gte = new Date(filterDto.startDate);
      if (filterDto.endDate) where.openedAt.lte = new Date(filterDto.endDate);
    }

    if (filterDto.title) {
      where.title = { contains: filterDto.title, mode: 'insensitive' };
    }

    return this.prisma.pullRequest.findMany({
      where,
      include: {
        repository: true,
        author: {
          select: {
            id: true,
            username: true,
            githubUsername: true,
            avatarUrl: true,
            role: true,
          },
        },
        results: true,
      },
      orderBy: { openedAt: 'desc' },
    });
  }

  // ─── MÉTRICAS DO ADMIN ─────────────────────────────────────────────────────

  async getMetrics() {
    const [
      totalPRs,
      approvedResults,
      rejectedResults,
      pendingResults,
      totalUsers,
      totalRules,
      allResults,
    ] = await Promise.all([
      // Total de PRs analisados
      this.prisma.pullRequest.count(),

      // PRs aprovados
      this.prisma.analysisResult.count({ where: { status: 'aprovado' } }),

      // PRs rejeitados
      this.prisma.analysisResult.count({ where: { status: 'rejeitado' } }),

      // PRs pendentes
      this.prisma.analysisResult.count({ where: { status: 'pendente' } }),

      // Total de usuários
      this.prisma.user.count(),

      // Total de regras ativas
      this.prisma.analysisRule.count({ where: { isActive: true } }),

      // Todos os resultados para calcular médias
      this.prisma.analysisResult.findMany({
        select: { healthScore: true, createdAt: true },
      }),
    ]);

    // ─── Cálculo de economia de tempo ────────────────────────────────────────
    // Lógica: cada PR analisado pela IA economizou MANUAL_REVIEW_HOURS
    // de revisão manual. Aprovados economizam 100%, rejeitados 50% (ainda
    // precisam de atenção), pendentes 0%.
    const timeSavedHours =
      approvedResults * MANUAL_REVIEW_HOURS +
      rejectedResults * (MANUAL_REVIEW_HOURS * 0.5);

    const timeSavedFormatted =
      timeSavedHours >= 24
        ? `${(timeSavedHours / 24).toFixed(1)} dias`
        : `${timeSavedHours.toFixed(0)}h`;

    // ─── Health score médio ───────────────────────────────────────────────────
    const avgHealthScore =
      allResults.length > 0
        ? allResults.reduce((sum, r) => sum + r.healthScore, 0) /
          allResults.length
        : 0;

    // ─── Taxa de aprovação ────────────────────────────────────────────────────
    const totalReviewed = approvedResults + rejectedResults;
    const approvalRate =
      totalReviewed > 0
        ? Math.round((approvedResults / totalReviewed) * 100)
        : 0;

    return {
      // Cards do admin
      totalPRsAnalyzed: totalPRs,
      timeSavedHours,
      timeSavedFormatted,
      avgHealthScore: Math.round(avgHealthScore),
      approvalRate,

      // Breakdown de status
      statusBreakdown: {
        approved: approvedResults,
        rejected: rejectedResults,
        pending: pendingResults,
      },

      // Outros totais
      totalUsers,
      totalActiveRules: totalRules,
    };
  }
}
