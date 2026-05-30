import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePullRequestDto } from './dto/create-pull-request.dto';
import { UpdatePullRequestDto } from './dto/update-pull-request.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PullRequestsService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Includes reutilizáveis ────────────────────────────────────────────────

  private baseInclude() {
    return {
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
    };
  }

  private analysisInclude() {
    return {
      ...this.baseInclude(),
      results: {
        orderBy: { createdAt: 'desc' as const },
        include: {
          reviewedBy: {
            select: {
              id: true,
              username: true,
              avatarUrl: true,
              role: true,
            },
          },
          // FIX: findings agora incluídos em cada result
          findings: {
            orderBy: { createdAt: 'asc' as const },
            include: {
              rule: {
                select: {
                  id: true,
                  title: true,
                  severity: true,
                },
              },
            },
          },
        },
      },
    };
  }

  // ─── CREATE ───────────────────────────────────────────────────────────────

  async create(createPullRequestDto: CreatePullRequestDto) {
    const repository = await this.prisma.repository.findUnique({
      where: { id: createPullRequestDto.repositoryId },
    });
    if (!repository) throw new BadRequestException('Repository not found');

    const author = await this.prisma.user.findUnique({
      where: { id: createPullRequestDto.authorId },
    });
    if (!author) throw new BadRequestException('Author (user) not found');

    const data: Prisma.PullRequestCreateInput = {
      repository: { connect: { id: createPullRequestDto.repositoryId } },
      prNumber: createPullRequestDto.prNumber,
      author: { connect: { id: createPullRequestDto.authorId } },
      title: createPullRequestDto.title,
      githubUrl: createPullRequestDto.githubUrl,
      status: createPullRequestDto.status,
    };

    if (
      createPullRequestDto.status === 'fechado' ||
      createPullRequestDto.status === 'mergeado'
    ) {
      data.closedAt = new Date();
    }

    return this.prisma.pullRequest.create({
      data,
      include: this.baseInclude(),
    });
  }

  // ─── FIND ALL ─────────────────────────────────────────────────────────────

  async findAll() {
    return this.prisma.pullRequest.findMany({
      include: this.baseInclude(),
      orderBy: { openedAt: 'desc' },
    });
  }

  // ─── FIND ONE ─────────────────────────────────────────────────────────────

  async findOne(id: string) {
    const pr = await this.prisma.pullRequest.findUnique({
      where: { id },
      include: this.baseInclude(),
    });
    if (!pr)
      throw new NotFoundException(`Pull request with ID ${id} not found`);
    return pr;
  }

  // ─── FIND ONE WITH ANALYSIS (tela de pr-analysis) ─────────────────────────
  // FIX: agora retorna findings dentro de analysis (resultado mais recente)
  // e também no analysisHistory completo

  async findOneWithAnalysis(id: string) {
    const pr = await this.prisma.pullRequest.findUnique({
      where: { id },
      include: this.analysisInclude(),
    });

    if (!pr)
      throw new NotFoundException(`Pull request with ID ${id} not found`);

    // Pega o resultado mais recente da IA
    const latestResult = pr.results[0] ?? null;

    return {
      id: pr.id,
      prNumber: pr.prNumber,
      title: pr.title,
      githubUrl: pr.githubUrl,
      status: pr.status,
      openedAt: pr.openedAt,
      closedAt: pr.closedAt,
      repository: pr.repository,
      author: pr.author,
      // Dados da análise da IA (resultado mais recente)
      analysis: latestResult
        ? {
            id: latestResult.id,
            healthScore: latestResult.healthScore,
            iaFeedback: latestResult.iaFeedback,
            status: latestResult.status,
            reviewedBy: latestResult.reviewedBy,
            reviewedAt: latestResult.reviewedAt,
            createdAt: latestResult.createdAt,
            // FIX: findings do resultado mais recente expostos diretamente
            findings: latestResult.findings,
          }
        : null,
      // Histórico completo de análises (cada uma com seus findings)
      analysisHistory: pr.results,
    };
  }

  // ─── UPDATE ───────────────────────────────────────────────────────────────

  async update(id: string, updatePullRequestDto: UpdatePullRequestDto) {
    const existingPR = await this.prisma.pullRequest.findUnique({
      where: { id },
    });
    if (!existingPR)
      throw new NotFoundException(`Pull request with ID ${id} not found`);

    if (updatePullRequestDto.repositoryId) {
      const repo = await this.prisma.repository.findUnique({
        where: { id: updatePullRequestDto.repositoryId },
      });
      if (!repo) throw new BadRequestException('Repository not found');
    }

    if (updatePullRequestDto.authorId) {
      const author = await this.prisma.user.findUnique({
        where: { id: updatePullRequestDto.authorId },
      });
      if (!author) throw new BadRequestException('Author (user) not found');
    }

    const data: Prisma.PullRequestUpdateInput = {};

    if (updatePullRequestDto.repositoryId)
      data.repository = { connect: { id: updatePullRequestDto.repositoryId } };
    if (updatePullRequestDto.prNumber !== undefined)
      data.prNumber = updatePullRequestDto.prNumber;
    if (updatePullRequestDto.authorId)
      data.author = { connect: { id: updatePullRequestDto.authorId } };
    if (updatePullRequestDto.title !== undefined)
      data.title = updatePullRequestDto.title;
    if (updatePullRequestDto.githubUrl !== undefined)
      data.githubUrl = updatePullRequestDto.githubUrl;

    if (updatePullRequestDto.status) {
      data.status = updatePullRequestDto.status;
      if (
        updatePullRequestDto.status === 'fechado' ||
        updatePullRequestDto.status === 'mergeado'
      ) {
        data.closedAt = new Date();
      } else if (updatePullRequestDto.status === 'aberto') {
        data.closedAt = null;
      }
    }

    return this.prisma.pullRequest.update({
      where: { id },
      data,
      include: this.baseInclude(),
    });
  }

  // ─── REMOVE ───────────────────────────────────────────────────────────────

  async remove(id: string) {
    const existingPR = await this.prisma.pullRequest.findUnique({
      where: { id },
    });
    if (!existingPR)
      throw new NotFoundException(`Pull request with ID ${id} not found`);

    await this.prisma.pullRequest.delete({ where: { id } });
    return existingPR;
  }
}
