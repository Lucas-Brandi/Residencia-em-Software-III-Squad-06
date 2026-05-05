import { IsString, IsNotEmpty, IsUUID, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAnalysisRuleDto {
  @ApiProperty({
    description: 'ID do repositório associado à regra',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsNotEmpty()
  repositoryId: string;

  @ApiProperty({ description: 'Tipo da regra de análise', example: 'security' })
  @IsString()
  @IsNotEmpty()
  ruleType: string;

  @ApiProperty({
    description: 'Conteúdo da regra de análise',
    example: 'Verificar vulnerabilidades de segurança',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'ID do usuário que criou a regra', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  createdById: number;
}
