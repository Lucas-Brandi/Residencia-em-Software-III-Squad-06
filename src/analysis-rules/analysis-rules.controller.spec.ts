import { Test, TestingModule } from '@nestjs/testing';
import { AnalysisRulesController } from './analysis-rules.controller';
import { AnalysisRulesService } from './analysis-rules.service';
import { mockPrismaServiceProvider } from '../prisma/prisma.service.mock';

describe('AnalysisRulesController', () => {
  let controller: AnalysisRulesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalysisRulesController],
      providers: [AnalysisRulesService, mockPrismaServiceProvider],
    }).compile();

    controller = module.get<AnalysisRulesController>(AnalysisRulesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
