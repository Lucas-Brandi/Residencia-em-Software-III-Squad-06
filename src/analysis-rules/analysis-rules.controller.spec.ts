import { Test, TestingModule } from '@nestjs/testing';
import { AnalysisRulesController } from './analysis-rules.controller';
import { AnalysisRulesService } from './analysis-rules.service';
import { FindingsService } from '../findings/findings.service';
import { mockPrismaServiceProvider } from '../prisma/prisma.service.mock';

describe('AnalysisRulesController', () => {
  let controller: AnalysisRulesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalysisRulesController],
      providers: [
        mockPrismaServiceProvider,
        {
          provide: AnalysisRulesService,
          useValue: {
            // Add mock methods here as needed
          },
        },
        {
          provide: FindingsService,
          useValue: {
            findByRuleId: jest.fn(),
            // Add other mock methods as needed
          },
        },
      ],
    }).compile();

    controller = module.get<AnalysisRulesController>(AnalysisRulesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
