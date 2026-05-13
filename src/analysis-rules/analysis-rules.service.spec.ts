import { Test, TestingModule } from '@nestjs/testing';
import { AnalysisRulesService } from './analysis-rules.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AnalysisRulesService', () => {
  let service: AnalysisRulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnalysisRulesService, PrismaService],
    }).compile();

    service = module.get<AnalysisRulesService>(AnalysisRulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
