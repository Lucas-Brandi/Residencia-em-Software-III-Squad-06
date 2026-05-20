import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({ description: 'Nome de usuário', example: 'john_doe' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiPropertyOptional({ description: 'Username no GitHub', example: 'johndoe' })
  @IsString()
  @IsOptional()
  githubUsername?: string;

  @ApiPropertyOptional({
    description: 'URL do avatar',
    example: 'https://avatars.githubusercontent.com/u/1',
  })
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @ApiProperty({
    description: 'Senha (mínimo 6 caracteres)',
    example: 'SecurePass123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Papel do usuário',
    enum: Role,
    example: Role.USER,
  })
  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;
}
