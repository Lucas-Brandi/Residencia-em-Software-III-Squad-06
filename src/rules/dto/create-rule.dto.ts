import {
  IsString,
  IsEnum,
  IsOptional,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

enum Severity {
  CRITICO = 'CRITICO',
  AVISO = 'AVISO',
  INFO = 'INFO',
}

export class CreateRuleDto {
  @ApiProperty({
    description: 'Título da regra',
    example: 'Proibir variáveis snake_case',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    description: 'Descrição detalhada do objetivo da regra',
    example: 'Esta regra garante que o código siga o padrão camelCase do projeto.',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Tipo da regra (ex: segurança, clean_code, performance)',
    example: 'clean_code',
  })
  @IsString()
  @IsNotEmpty()
  ruleType: string;

  @ApiProperty({
    description: 'Conteúdo/instrução da regra em formato texto para a IA',
    example: 'Variáveis e funções devem usar camelCase. Proibido usar snake_case.',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({
    description: 'Severidade da regra',
    enum: Severity,
    default: Severity.AVISO,
  })
  @IsEnum(Severity)
  @IsOptional()
  severity?: Severity;

  @ApiPropertyOptional({
    description: 'Status da regra (ativo ou inativo)',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}