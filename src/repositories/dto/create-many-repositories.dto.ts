import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { CreateRepositoryDto } from './create-repository.dto';

export class CreateManyRepositoriesDto {
  @ApiProperty({ type: [CreateRepositoryDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateRepositoryDto)
  repositories: CreateRepositoryDto[];
}