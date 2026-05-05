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
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAnalysisResultDto extends PartialType(
  CreateAnalysisResultDto,
) {
  @ApiPropertyOptional({
    description: 'ID do Pull Request analisado',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsUUID()
  @IsOptional()
  prId?: string;

  @ApiPropertyOptional({
    description: 'Pontuação de saúde do código (0-100)',
    example: 90,
    minimum: 0,
    maximum: 100,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  healthScore?: number;

  @ApiPropertyOptional({
    description: 'Feedback gerado pela IA sobre o código',
    example: 'O código foi melhorado após as correções.',
  })
  @IsString()
  @IsOptional()
  iaFeedback?: string;

  @ApiPropertyOptional({
    description: 'Status da análise',
    enum: ['pendente', 'aprovado', 'rejeitado'],
    example: 'aprovado',
  })
  @IsString()
  @IsOptional()
  @IsIn(['pendente', 'aprovado', 'rejeitado'])
  status?: 'pendente' | 'aprovado' | 'rejeitado';

  @ApiPropertyOptional({
    description: 'ID do usuário que revisou a análise',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  reviewedById?: number;
}
