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
    description: 'UUID do pull request analisado',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsUUID()
  @IsNotEmpty()
  prId: string;

  @ApiProperty({
    description: 'Score de saúde do código (0-100)',
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
    description: 'Feedback gerado pela IA',
    example: 'O código está bem estruturado.',
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
