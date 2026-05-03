import { Module } from '@nestjs/common';
import { AnalysisResultsService } from './analysis-results.service';
import { AnalysisResultsController } from './analysis-results.controller';

@Module({
  controllers: [AnalysisResultsController],
  providers: [AnalysisResultsService],
})
export class AnalysisResultsModule {}
