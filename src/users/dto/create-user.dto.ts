import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsEmail,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role, UserStatus } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({ description: 'Nome de usuário', example: 'john_doe' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiPropertyOptional({
    description: 'E-mail do usuário',
    example: 'john@email.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'Username no GitHub',
    example: 'johndoe',
  })
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

  @ApiPropertyOptional({
    description: 'Status do usuário',
    enum: UserStatus,
    default: UserStatus.PENDENTE,
  })
  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;
}
