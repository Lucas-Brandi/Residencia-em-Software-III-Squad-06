import { IsString, IsNotEmpty, IsUUID, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAnalysisRuleDto {
  @ApiProperty({
    description: 'UUID do repositório',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsUUID()
  @IsNotEmpty()
  repositoryId: string;

  @ApiProperty({ description: 'Tipo da regra', example: 'naming' })
  @IsString()
  @IsNotEmpty()
  ruleType: string;

  @ApiProperty({
    description: 'Conteúdo/descrição da regra',
    example: 'Variáveis devem usar camelCase',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'ID do usuário que criou a regra', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  createdById: number;
}
