import { Test, TestingModule } from '@nestjs/testing';
import { AnalysisResultsService } from './analysis-results.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AnalysisResultsService', () => {
  let service: AnalysisResultsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnalysisResultsService, PrismaService],
    }).compile();

    service = module.get<AnalysisResultsService>(AnalysisResultsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
