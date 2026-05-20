import { PartialType } from '@nestjs/swagger';
import { CreateAnalysisRuleDto } from './create-analysis-rule.dto';

export class UpdateAnalysisRuleDto extends PartialType(CreateAnalysisRuleDto) {}
