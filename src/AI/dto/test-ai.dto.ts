import { IsString, IsNotEmpty, IsArray, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TestAiDto {
  @ApiProperty({
    description: 'Trecho de código a ser analisado',
    example: 'function hello() { return "world"; }',
  })
  @IsString()
  @IsNotEmpty()
  codeSnippet: string;

  @ApiProperty({
    description: 'Lista de regras de análise a aplicar',
    example: ['Use camelCase para variáveis', 'Evite funções com mais de 50 linhas'],
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  rules: string[];
}
