import { IsString, IsNotEmpty, IsUUID, IsNumber } from 'class-validator';

export class CreateAnalysisRuleDto {
  @IsUUID()
  @IsNotEmpty()
  repositoryId: string;

  @IsString()
  @IsNotEmpty()
  ruleType: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNumber()
  @IsNotEmpty()
  createdById: number;
}
