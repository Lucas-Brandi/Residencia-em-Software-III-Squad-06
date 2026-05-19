import { Test, TestingModule } from '@nestjs/testing';
import { PullRequestsService } from './pull-requests.service';
import { mockPrismaServiceProvider } from '../prisma/prisma.service.mock';

describe('PullRequestsService', () => {
  let service: PullRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PullRequestsService, mockPrismaServiceProvider],
    }).compile();

    service = module.get<PullRequestsService>(PullRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
