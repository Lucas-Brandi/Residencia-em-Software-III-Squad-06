import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsNumber,
  Min,
  Max,
  IsIn,
} from 'class-validator';

export class CreateAnalysisResultDto {
  @IsUUID()
  @IsNotEmpty()
  prId: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsNotEmpty()
  healthScore: number;

  @IsString()
  @IsNotEmpty()
  iaFeedback: string;

  @IsString()
  @IsIn(['pendente', 'aprovado', 'rejeitado'])
  status: 'pendente' | 'aprovado' | 'rejeitado';
}
