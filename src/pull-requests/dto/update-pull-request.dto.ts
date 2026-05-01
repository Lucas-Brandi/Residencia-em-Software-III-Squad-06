import { PartialType } from '@nestjs/mapped-types';
import { CreatePullRequestDto } from './create-pull-request.dto';
import { IsString, IsOptional, IsUUID, IsNumber, IsIn } from 'class-validator';

export class UpdatePullRequestDto extends PartialType(CreatePullRequestDto) {
  @IsUUID()
  @IsOptional()
  repositoryId?: string;

  @IsNumber()
  @IsOptional()
  prNumber?: number;

  @IsNumber()
  @IsOptional()
  authorId?: number;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  githubUrl?: string;

  @IsString()
  @IsOptional()
  @IsIn(['aberto', 'fechado', 'mergeado'])
  status?: 'aberto' | 'fechado' | 'mergeado';
}
