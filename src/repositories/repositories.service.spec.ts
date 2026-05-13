import { Test, TestingModule } from '@nestjs/testing';
import { RepositoriesService } from './repositories.service';
import { PrismaService } from '../prisma/prisma.service';

describe('RepositoriesService', () => {
  let service: RepositoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RepositoriesService, PrismaService],
    }).compile();

    service = module.get<RepositoriesService>(RepositoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
