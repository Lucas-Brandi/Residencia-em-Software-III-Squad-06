import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsNumber,
  IsOptional,
  IsIn,
} from 'class-validator';

export class CreatePullRequestDto {
  @IsUUID()
  @IsNotEmpty()
  repositoryId: string;

  @IsNumber()
  @IsNotEmpty()
  prNumber: number;

  @IsNumber()
  @IsNotEmpty()
  authorId: number;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  githubUrl?: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['aberto', 'fechado', 'mergeado'])
  status: 'aberto' | 'fechado' | 'mergeado';
}
