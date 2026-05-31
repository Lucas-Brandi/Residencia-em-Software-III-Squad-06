import { Module } from '@nestjs/common';
import { AnalysisRulesService } from './analysis-rules.service';
import { AnalysisRulesController } from './analysis-rules.controller';
import { FindingsModule } from '../findings/findings.module';

@Module({
  imports: [FindingsModule],
  controllers: [AnalysisRulesController],
  providers: [AnalysisRulesService],
})
export class AnalysisRulesModule {}
