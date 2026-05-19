import { Test, TestingModule } from '@nestjs/testing';
import { AnalysisRulesService } from './analysis-rules.service';
import { mockPrismaServiceProvider } from '../prisma/prisma.service.mock';

describe('AnalysisRulesService', () => {
  let service: AnalysisRulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnalysisRulesService, mockPrismaServiceProvider],
    }).compile();

    service = module.get<AnalysisRulesService>(AnalysisRulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
