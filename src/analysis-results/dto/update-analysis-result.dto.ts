import { PartialType } from '@nestjs/mapped-types';
import { CreateAnalysisResultDto } from './create-analysis-result.dto';
import {
  IsString,
  IsOptional,
  IsUUID,
  IsNumber,
  Min,
  Max,
  IsIn,
} from 'class-validator';

export class UpdateAnalysisResultDto extends PartialType(
  CreateAnalysisResultDto,
) {
  @IsUUID()
  @IsOptional()
  prId?: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  healthScore?: number;

  @IsString()
  @IsOptional()
  iaFeedback?: string;

  @IsString()
  @IsOptional()
  @IsIn(['pendente', 'aprovado', 'rejeitado'])
  status?: 'pendente' | 'aprovado' | 'rejeitado';

  @IsNumber()
  @IsOptional()
  reviewedById?: number;
}
