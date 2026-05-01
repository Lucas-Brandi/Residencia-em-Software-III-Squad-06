import { PartialType } from '@nestjs/mapped-types';
import { CreateAnalysisRuleDto } from './create-analysis-rule.dto';

export class UpdateAnalysisRuleDto extends PartialType(CreateAnalysisRuleDto) {}
