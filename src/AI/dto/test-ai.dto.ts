import { ApiProperty } from '@nestjs/swagger';

export class TestAiDto {
  @ApiProperty({
    description: 'Trecho de código para ser analisado pela IA',
    example: 'function hello() { return "world"; }',
  })
  codeSnippet: string;

  @ApiProperty({
    description: 'Lista de regras para análise do código',
    example: ['security', 'performance', 'style'],
    type: [String],
  })
  rules: string[];
}
