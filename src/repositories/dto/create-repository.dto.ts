import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRepositoryDto {
  @ApiProperty({ description: 'Nome do repositório', example: 'meu-projeto' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'ID do repositório no GitHub',
    example: 123456789,
  })
  @IsNumber()
  @IsNotEmpty()
  githubId: number;

  @ApiPropertyOptional({
    description: 'URL do repositório no GitHub',
    example: 'https://github.com/usuario/meu-projeto',
  })
  @IsString()
  @IsOptional()
  githubUrl?: string;

  @ApiProperty({
    description: 'ID da equipe proprietária do repositório',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsNotEmpty()
  teamId: string;
}
