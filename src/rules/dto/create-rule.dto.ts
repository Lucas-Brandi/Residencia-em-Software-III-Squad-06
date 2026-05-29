import { IsString, IsEnum, IsOptional, IsNotEmpty, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

enum Severity {
  CRITICO = 'CRITICO',
  AVISO = 'AVISO',
  INFO = 'INFO',
}

export class CreateRuleDto {
  @ApiProperty({
    description: 'Tipo da regra (ex: segurança, clean_code, performance)',
    example: 'segurança',
  })
  @IsString()
  @IsNotEmpty()
  ruleType: string;

  @ApiProperty({
    description: 'Conteúdo da regra em formato Markdown ou JSON para a IA',
    example: 'Verifique se há vulnerabilidades de segurança no código',
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
