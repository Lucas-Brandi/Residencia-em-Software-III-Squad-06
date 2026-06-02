import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsNumber,
  IsEnum,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum Severity {
  CRITICO = 'CRITICO',
  AVISO = 'AVISO',
  INFO = 'INFO',
}

export class CreateAnalysisRuleDto {
  @ApiProperty({
    description: 'Título da regra',
    example: 'Proibir variáveis snake_case',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    description: 'Descrição detalhada do objetivo da regra',
    example:
      'Esta regra garante que o código siga o padrão camelCase do projeto.',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'UUID do repositório para vincular na criação (opcional)',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsUUID()
  @IsOptional()
  repositoryId?: string;

  @ApiProperty({ description: 'Tipo/categoria da regra', example: 'Qualidade' })
  @IsString()
  @IsNotEmpty()
  ruleType: string;

  @ApiProperty({
    description: 'Conteúdo/instrução da regra em formato texto para a IA',
    example: 'Variáveis devem usar camelCase',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'ID do usuário que criou a regra', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  createdById: number;

  @ApiPropertyOptional({
    description: 'Gravidade da regra',
    enum: Severity,
    default: Severity.AVISO,
  })
  @IsEnum(Severity)
  @IsOptional()
  severity?: Severity;

  @ApiPropertyOptional({
    description: 'Indica se a regra está ativa',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
