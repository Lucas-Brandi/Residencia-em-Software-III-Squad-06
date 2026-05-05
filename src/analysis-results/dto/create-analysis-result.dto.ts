import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsNumber,
  Min,
  Max,
  IsIn,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAnalysisResultDto {
  @ApiProperty({
    description: 'ID do Pull Request analisado',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsNotEmpty()
  prId: string;

  @ApiProperty({
    description: 'Pontuação de saúde do código (0-100)',
    example: 85,
    minimum: 0,
    maximum: 100,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsNotEmpty()
  healthScore: number;

  @ApiProperty({
    description: 'Feedback gerado pela IA sobre o código',
    example: 'O código está bem estruturado, mas pode ser otimizado.',
  })
  @IsString()
  @IsNotEmpty()
  iaFeedback: string;

  @ApiProperty({
    description: 'Status da análise',
    enum: ['pendente', 'aprovado', 'rejeitado'],
    example: 'pendente',
  })
  @IsString()
  @IsIn(['pendente', 'aprovado', 'rejeitado'])
  status: 'pendente' | 'aprovado' | 'rejeitado';
}
