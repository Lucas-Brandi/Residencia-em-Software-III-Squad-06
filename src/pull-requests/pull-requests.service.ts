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

  async create(createPullRequestDto: CreatePullRequestDto) {
    const repository = await this.prisma.repository.findUnique({
      where: { id: createPullRequestDto.repositoryId },
    });

    if (!repository) {
      throw new BadRequestException('Repository not found');
    }

    const author = await this.prisma.user.findUnique({
      where: { id: createPullRequestDto.authorId },
    });

    if (!author) {
      throw new BadRequestException('Author (user) not found');
    }

    const data: Prisma.PullRequestCreateInput = {
      repository: {
        connect: { id: createPullRequestDto.repositoryId },
      },
      prNumber: createPullRequestDto.prNumber,
      author: {
        connect: { id: createPullRequestDto.authorId },
      },
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

    const pullRequest = await this.prisma.pullRequest.create({
      data,
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
      },
    });

    return pullRequest;
  }

  async findAll() {
    const pullRequests = await this.prisma.pullRequest.findMany({
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
      },
    });

    return pullRequests;
  }

  async findOne(id: string) {
    const pullRequest = await this.prisma.pullRequest.findUnique({
      where: { id },
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
      },
    });

    if (!pullRequest) {
      throw new NotFoundException(`Pull request with ID ${id} not found`);
    }

    return pullRequest;
  }

  async update(id: string, updatePullRequestDto: UpdatePullRequestDto) {
    const existingPR = await this.prisma.pullRequest.findUnique({
      where: { id },
    });

    if (!existingPR) {
      throw new NotFoundException(`Pull request with ID ${id} not found`);
    }

    if (updatePullRequestDto.repositoryId) {
      const repository = await this.prisma.repository.findUnique({
        where: { id: updatePullRequestDto.repositoryId },
      });

      if (!repository) {
        throw new BadRequestException('Repository not found');
      }
    }

    if (updatePullRequestDto.authorId) {
      const author = await this.prisma.user.findUnique({
        where: { id: updatePullRequestDto.authorId },
      });

      if (!author) {
        throw new BadRequestException('Author (user) not found');
      }
    }

    const data: Prisma.PullRequestUpdateInput = {};

    if (updatePullRequestDto.repositoryId) {
      data.repository = { connect: { id: updatePullRequestDto.repositoryId } };
    }

    if (updatePullRequestDto.prNumber !== undefined) {
      data.prNumber = updatePullRequestDto.prNumber;
    }

    if (updatePullRequestDto.authorId) {
      data.author = { connect: { id: updatePullRequestDto.authorId } };
    }

    if (updatePullRequestDto.title !== undefined) {
      data.title = updatePullRequestDto.title;
    }

    if (updatePullRequestDto.githubUrl !== undefined) {
      data.githubUrl = updatePullRequestDto.githubUrl;
    }

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

    const pullRequest = await this.prisma.pullRequest.update({
      where: { id },
      data,
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
      },
    });

    return pullRequest;
  }

  async remove(id: string) {
    const existingPR = await this.prisma.pullRequest.findUnique({
      where: { id },
    });

    if (!existingPR) {
      throw new NotFoundException(`Pull request with ID ${id} not found`);
    }

    await this.prisma.pullRequest.delete({
      where: { id },
    });

    return existingPR;
  }
}
