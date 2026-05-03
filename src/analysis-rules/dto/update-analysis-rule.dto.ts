import { PartialType } from '@nestjs/mapped-types';
import { CreateAnalysisRuleDto } from './create-analysis-rule.dto';
import { IsString, IsOptional, IsUUID, IsNumber } from 'class-validator';

export class UpdateAnalysisRuleDto extends PartialType(CreateAnalysisRuleDto) {
  @IsUUID()
  @IsOptional()
  repositoryId?: string;

  @IsString()
  @IsOptional()
  ruleType?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsNumber()
  @IsOptional()
  createdById?: number;
}
