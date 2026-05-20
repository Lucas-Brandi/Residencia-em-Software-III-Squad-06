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
    description: 'UUID do repositório',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsUUID()
  @IsNotEmpty()
  repositoryId: string;

  @ApiProperty({ description: 'Número do PR no GitHub', example: 42 })
  @IsNumber()
  @IsNotEmpty()
  prNumber: number;

  @ApiProperty({ description: 'ID do autor (usuário)', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  authorId: number;

  @ApiPropertyOptional({ description: 'Título do pull request', example: 'fix: corrige bug' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'URL do pull request no GitHub',
    example: 'https://github.com/org/repo/pull/42',
  })
  @IsString()
  @IsOptional()
  githubUrl?: string;

  @ApiProperty({
    description: 'Status do pull request',
    enum: ['aberto', 'fechado', 'mergeado'],
    example: 'aberto',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['aberto', 'fechado', 'mergeado'])
  status: 'aberto' | 'fechado' | 'mergeado';
}
