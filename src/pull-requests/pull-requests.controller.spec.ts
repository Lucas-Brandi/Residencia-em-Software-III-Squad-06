import { Test, TestingModule } from '@nestjs/testing';
import { PullRequestsController } from './pull-requests.controller';
import { PullRequestsService } from './pull-requests.service';
import { mockPrismaServiceProvider } from '../prisma/prisma.service.mock';

describe('PullRequestsController', () => {
  let controller: PullRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PullRequestsController],
      providers: [PullRequestsService, mockPrismaServiceProvider],
    }).compile();

    controller = module.get<PullRequestsController>(PullRequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
