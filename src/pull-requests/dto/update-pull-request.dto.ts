import { PartialType } from '@nestjs/mapped-types';
import { CreatePullRequestDto } from './create-pull-request.dto';
import { IsString, IsOptional, IsUUID, IsNumber, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePullRequestDto extends PartialType(CreatePullRequestDto) {
  @ApiPropertyOptional({
    description: 'ID do repositório associado ao PR',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsUUID()
  @IsOptional()
  repositoryId?: string;

  @ApiPropertyOptional({
    description: 'Número do Pull Request no GitHub',
    example: 43,
  })
  @IsNumber()
  @IsOptional()
  prNumber?: number;

  @ApiPropertyOptional({ description: 'ID do autor do PR', example: 2 })
  @IsNumber()
  @IsOptional()
  authorId?: number;

  @ApiPropertyOptional({
    description: 'Título do Pull Request',
    example: 'Feature: Atualizar funcionalidade',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'URL do Pull Request no GitHub',
    example: 'https://github.com/usuario/repo/pull/43',
  })
  @IsString()
  @IsOptional()
  githubUrl?: string;

  @ApiPropertyOptional({
    description: 'Status do Pull Request',
    enum: ['aberto', 'fechado', 'mergeado'],
    example: 'mergeado',
  })
  @IsString()
  @IsOptional()
  @IsIn(['aberto', 'fechado', 'mergeado'])
  status?: 'aberto' | 'fechado' | 'mergeado';
}
