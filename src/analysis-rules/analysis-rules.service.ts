import { Injectable } from '@nestjs/common';
import { CreateAnalysisRuleDto } from './dto/create-analysis-rule.dto';
import { UpdateAnalysisRuleDto } from './dto/update-analysis-rule.dto';

@Injectable()
export class AnalysisRulesService {
  create(createAnalysisRuleDto: CreateAnalysisRuleDto) {
    return 'This action adds a new analysisRule';
  }

  findAll() {
    return `This action returns all analysisRules`;
  }

  findOne(id: number) {
    return `This action returns a #${id} analysisRule`;
  }

  update(id: number, updateAnalysisRuleDto: UpdateAnalysisRuleDto) {
    return `This action updates a #${id} analysisRule`;
  }

  remove(id: number) {
    return `This action removes a #${id} analysisRule`;
  }
}
