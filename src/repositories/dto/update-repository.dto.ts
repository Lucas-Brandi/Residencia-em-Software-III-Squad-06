import { PartialType } from '@nestjs/mapped-types';
import { CreateRepositoryDto } from './create-repository.dto';
import { IsString, IsOptional, IsNumber, IsUUID } from 'class-validator';

export class UpdateRepositoryDto extends PartialType(CreateRepositoryDto) {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  githubId?: number;

  @IsString()
  @IsOptional()
  githubUrl?: string;

  @IsUUID()
  @IsOptional()
  teamId?: string;
}
