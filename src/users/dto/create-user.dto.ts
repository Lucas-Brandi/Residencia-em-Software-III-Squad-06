import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsIn,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nome de usuário do sistema',
    example: 'joao.silva',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiPropertyOptional({
    description: 'Nome de usuário no GitHub',
    example: 'joaosilva',
  })
  @IsString()
  @IsOptional()
  githubUsername?: string;

  @ApiPropertyOptional({
    description: 'URL do avatar do usuário',
    example: 'https://github.com/joaosilva.png',
  })
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @ApiProperty({
    description: 'Senha do usuário (mínimo 6 caracteres)',
    example: 'senha123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Função do usuário no sistema',
    enum: ['USER', 'ADMIN'],
    example: 'USER',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['USER', 'ADMIN'])
  role: 'USER' | 'ADMIN';
}
