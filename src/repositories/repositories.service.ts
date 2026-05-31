import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRepositoryDto } from './dto/create-repository.dto';
import { UpdateRepositoryDto } from './dto/update-repository.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class RepositoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRepositoryDto: CreateRepositoryDto) {
    try {
      const repository = await this.prisma.repository.create({
        data: {
          name: createRepositoryDto.name,
          githubId: createRepositoryDto.githubId,
          githubUrl: createRepositoryDto.githubUrl,
          teamId: createRepositoryDto.teamId,
        },
        include: {
          team: true,
        },
      });

      return repository;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            'Repository with this githubId already exists',
          );
        }
        if (error.code === 'P2003') {
          throw new BadRequestException('Invalid teamId: team does not exist');
        }
      }
      throw error;
    }
  }

  async findAll() {
    const repositories = await this.prisma.repository.findMany({
      where: {
        isActive: true,
      },
      include: {
        team: true,
      },
    });

    return repositories;
  }

  async findOne(id: string) {
    const repository = await this.prisma.repository.findUnique({
      where: { id },
      include: {
        team: true,
        rules: {
          include: {
            rule: {
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
            },
          },
        },
      },
    });

    if (!repository) {
      throw new NotFoundException(`Repository with ID ${id} not found`);
    }

    return repository;
  }

  async update(id: string, updateRepositoryDto: UpdateRepositoryDto) {
    const existingRepository = await this.prisma.repository.findUnique({
      where: { id },
    });

    if (!existingRepository) {
      throw new NotFoundException(`Repository with ID ${id} not found`);
    }

    try {
      const repository = await this.prisma.repository.update({
        where: { id },
        data: {
          name: updateRepositoryDto.name,
          githubId: updateRepositoryDto.githubId,
          githubUrl: updateRepositoryDto.githubUrl,
          teamId: updateRepositoryDto.teamId,
        },
        include: {
          team: true,
        },
      });

      return repository;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            'Repository with this githubId already exists',
          );
        }
        if (error.code === 'P2003') {
          throw new BadRequestException('Invalid teamId: team does not exist');
        }
      }
      throw error;
    }
  }

  async findRules(repositoryId: string) {
    const repository = await this.prisma.repository.findUnique({
      where: { id: repositoryId },
    });

    if (!repository) {
      throw new NotFoundException(
        `Repository with ID ${repositoryId} not found`,
      );
    }

    const ruleRepositories = await this.prisma.ruleRepository.findMany({
      where: { repositoryId },
      include: {
        rule: {
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
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return ruleRepositories.map((rr) => rr.rule);
  }

  async remove(id: string) {
    const existingRepository = await this.prisma.repository.findUnique({
      where: { id },
    });

    if (!existingRepository) {
      throw new NotFoundException(`Repository with ID ${id} not found`);
    }

    const repository = await this.prisma.repository.update({
      where: { id },
      data: {
        isActive: false,
      },
      include: {
        team: true,
      },
    });

    return repository;
  }
}
