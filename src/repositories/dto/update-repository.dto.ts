import { PartialType } from '@nestjs/mapped-types';
import { CreateRepositoryDto } from './create-repository.dto';
import { IsString, IsOptional, IsNumber, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRepositoryDto extends PartialType(CreateRepositoryDto) {
  @ApiPropertyOptional({
    description: 'Nome do repositório',
    example: 'novo-nome-projeto',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'ID do repositório no GitHub',
    example: 987654321,
  })
  @IsNumber()
  @IsOptional()
  githubId?: number;

  @ApiPropertyOptional({
    description: 'URL do repositório no GitHub',
    example: 'https://github.com/usuario/novo-projeto',
  })
  @IsString()
  @IsOptional()
  githubUrl?: string;

  @ApiPropertyOptional({
    description: 'ID da equipe proprietária do repositório',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsUUID()
  @IsOptional()
  teamId?: string;
}
