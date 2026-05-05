import { PartialType } from '@nestjs/mapped-types';
import { CreateAnalysisRuleDto } from './create-analysis-rule.dto';
import { IsString, IsOptional, IsUUID, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAnalysisRuleDto extends PartialType(CreateAnalysisRuleDto) {
  @ApiPropertyOptional({
    description: 'ID do repositório associado à regra',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsUUID()
  @IsOptional()
  repositoryId?: string;

  @ApiPropertyOptional({
    description: 'Tipo da regra de análise',
    example: 'performance',
  })
  @IsString()
  @IsOptional()
  ruleType?: string;

  @ApiPropertyOptional({
    description: 'Conteúdo da regra de análise',
    example: 'Verificar performance do código',
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    description: 'ID do usuário que criou a regra',
    example: 2,
  })
  @IsNumber()
  @IsOptional()
  createdById?: number;
}
