import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsNumber,
  IsOptional,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePullRequestDto {
  @ApiProperty({
    description: 'ID do repositório associado ao PR',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsNotEmpty()
  repositoryId: string;

  @ApiProperty({ description: 'Número do Pull Request no GitHub', example: 42 })
  @IsNumber()
  @IsNotEmpty()
  prNumber: number;

  @ApiProperty({ description: 'ID do autor do PR', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  authorId: number;

  @ApiPropertyOptional({
    description: 'Título do Pull Request',
    example: 'Feature: Adicionar nova funcionalidade',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'URL do Pull Request no GitHub',
    example: 'https://github.com/usuario/repo/pull/42',
  })
  @IsString()
  @IsOptional()
  githubUrl?: string;

  @ApiProperty({
    description: 'Status do Pull Request',
    enum: ['aberto', 'fechado', 'mergeado'],
    example: 'aberto',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['aberto', 'fechado', 'mergeado'])
  status: 'aberto' | 'fechado' | 'mergeado';
}
