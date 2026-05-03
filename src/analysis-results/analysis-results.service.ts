import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnalysisResultDto } from './dto/create-analysis-result.dto';
import { UpdateAnalysisResultDto } from './dto/update-analysis-result.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AnalysisResultsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAnalysisResultDto: CreateAnalysisResultDto) {
    const pullRequest = await this.prisma.pullRequest.findUnique({
      where: { id: createAnalysisResultDto.prId },
    });

    if (!pullRequest) {
      throw new BadRequestException('Pull request not found');
    }

    const analysisResult = await this.prisma.analysisResult.create({
      data: {
        pr: {
          connect: { id: createAnalysisResultDto.prId },
        },
        healthScore: createAnalysisResultDto.healthScore,
        iaFeedback: createAnalysisResultDto.iaFeedback,
        status: createAnalysisResultDto.status,
      },
      include: {
        pr: true,
        reviewedBy: {
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

    return analysisResult;
  }

  async findAll() {
    const analysisResults = await this.prisma.analysisResult.findMany({
      include: {
        pr: true,
        reviewedBy: {
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

    return analysisResults;
  }

  async findOne(id: string) {
    const analysisResult = await this.prisma.analysisResult.findUnique({
      where: { id },
      include: {
        pr: true,
        reviewedBy: {
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

    if (!analysisResult) {
      throw new NotFoundException(`Analysis result with ID ${id} not found`);
    }

    return analysisResult;
  }

  async update(id: string, updateAnalysisResultDto: UpdateAnalysisResultDto) {
    const existingResult = await this.prisma.analysisResult.findUnique({
      where: { id },
    });

    if (!existingResult) {
      throw new NotFoundException(`Analysis result with ID ${id} not found`);
    }

    if (updateAnalysisResultDto.prId) {
      const pullRequest = await this.prisma.pullRequest.findUnique({
        where: { id: updateAnalysisResultDto.prId },
      });

      if (!pullRequest) {
        throw new BadRequestException('Pull request not found');
      }
    }

    if (updateAnalysisResultDto.reviewedById) {
      const reviewer = await this.prisma.user.findUnique({
        where: { id: updateAnalysisResultDto.reviewedById },
      });

      if (!reviewer) {
        throw new BadRequestException('Reviewer (user) not found');
      }
    }

    const data: Prisma.AnalysisResultUpdateInput = {};

    if (updateAnalysisResultDto.prId) {
      data.pr = { connect: { id: updateAnalysisResultDto.prId } };
    }

    if (updateAnalysisResultDto.healthScore !== undefined) {
      data.healthScore = updateAnalysisResultDto.healthScore;
    }

    if (updateAnalysisResultDto.iaFeedback !== undefined) {
      data.iaFeedback = updateAnalysisResultDto.iaFeedback;
    }

    if (updateAnalysisResultDto.status) {
      data.status = updateAnalysisResultDto.status;

      if (
        updateAnalysisResultDto.status === 'aprovado' ||
        updateAnalysisResultDto.status === 'rejeitado'
      ) {
        if (!updateAnalysisResultDto.reviewedById) {
          throw new BadRequestException(
            'reviewedById is required when status changes to aprovado or rejeitado',
          );
        }
        data.reviewedAt = new Date();
        data.reviewedBy = {
          connect: { id: updateAnalysisResultDto.reviewedById },
        };
      } else if (updateAnalysisResultDto.status === 'pendente') {
        data.reviewedAt = null;
        data.reviewedBy = updateAnalysisResultDto.reviewedById
          ? { connect: { id: updateAnalysisResultDto.reviewedById } }
          : { disconnect: true };
      }
    } else if (updateAnalysisResultDto.reviewedById) {
      data.reviewedBy = {
        connect: { id: updateAnalysisResultDto.reviewedById },
      };
    }

    const analysisResult = await this.prisma.analysisResult.update({
      where: { id },
      data,
      include: {
        pr: true,
        reviewedBy: {
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

    return analysisResult;
  }

  async remove(id: string) {
    const existingResult = await this.prisma.analysisResult.findUnique({
      where: { id },
    });

    if (!existingResult) {
      throw new NotFoundException(`Analysis result with ID ${id} not found`);
    }

    await this.prisma.analysisResult.delete({
      where: { id },
    });

    return existingResult;
  }
}
