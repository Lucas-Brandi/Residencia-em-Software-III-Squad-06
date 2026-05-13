import { Test, TestingModule } from '@nestjs/testing';
import { PullRequestsService } from './pull-requests.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PullRequestsService', () => {
  let service: PullRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PullRequestsService, PrismaService],
    }).compile();

    service = module.get<PullRequestsService>(PullRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
