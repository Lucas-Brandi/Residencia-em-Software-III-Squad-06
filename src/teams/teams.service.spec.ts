import { Test, TestingModule } from '@nestjs/testing';
import { TeamsService } from './teams.service';
import { mockPrismaServiceProvider } from '../prisma/prisma.service.mock';

describe('TeamsService', () => {
  let service: TeamsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeamsService, mockPrismaServiceProvider],
    }).compile();

    service = module.get<TeamsService>(TeamsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
