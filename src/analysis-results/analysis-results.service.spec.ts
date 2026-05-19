import { Test, TestingModule } from '@nestjs/testing';
import { AnalysisResultsService } from './analysis-results.service';
import { mockPrismaServiceProvider } from '../prisma/prisma.service.mock';

describe('AnalysisResultsService', () => {
  let service: AnalysisResultsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnalysisResultsService, mockPrismaServiceProvider],
    }).compile();

    service = module.get<AnalysisResultsService>(AnalysisResultsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
