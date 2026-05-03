import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateRepositoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  githubId: number;

  @IsString()
  @IsOptional()
  githubUrl?: string;

  @IsUUID()
  @IsNotEmpty()
  teamId: string;
}
