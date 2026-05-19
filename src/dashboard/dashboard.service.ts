import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FilterDashboardDto } from './dto/filter-dashboard.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filterDto: FilterDashboardDto) {
    const where: Prisma.PullRequestWhereInput = {};

    if (filterDto.startDate || filterDto.endDate) {
      where.openedAt = {};
      if (filterDto.startDate) {
        where.openedAt.gte = new Date(filterDto.startDate);
      }
      if (filterDto.endDate) {
        where.openedAt.lte = new Date(filterDto.endDate);
      }
    }

    if (filterDto.title) {
      where.title = {
        contains: filterDto.title,
        mode: 'insensitive',
      };
    }

    const pullRequests = await this.prisma.pullRequest.findMany({
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
      orderBy: {
        openedAt: 'desc',
      },
    });

    return pullRequests;
  }
}
