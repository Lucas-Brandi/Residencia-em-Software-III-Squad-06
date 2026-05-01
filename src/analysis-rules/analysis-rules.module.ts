import { Module } from '@nestjs/common';
import { AnalysisRulesService } from './analysis-rules.service';
import { AnalysisRulesController } from './analysis-rules.controller';

@Module({
  controllers: [AnalysisRulesController],
  providers: [AnalysisRulesService],
})
export class AnalysisRulesModule {}
