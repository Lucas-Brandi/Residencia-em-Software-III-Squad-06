import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRepositoryDto {
  @ApiProperty({ description: 'Nome do repositório', example: 'my-repo' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'ID numérico do repositório no GitHub', example: 123456789 })
  @IsNumber()
  @IsNotEmpty()
  githubId: number;

  @ApiPropertyOptional({
    description: 'URL do repositório no GitHub',
    example: 'https://github.com/org/my-repo',
  })
  @IsString()
  @IsOptional()
  githubUrl?: string;

  @ApiProperty({
    description: 'UUID da equipe proprietária',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsUUID()
  @IsNotEmpty()
  teamId: string;
}
