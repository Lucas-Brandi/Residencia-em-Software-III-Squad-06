import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateAnalysisResultDto } from './create-analysis-result.dto';

export class UpdateAnalysisResultDto extends PartialType(
  CreateAnalysisResultDto,
) {
  @ApiPropertyOptional({
    description: 'ID do revisor (usuário)',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  reviewedById?: number;
}
