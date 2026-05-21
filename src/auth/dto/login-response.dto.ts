import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../enums/role.enum';

export class LoginResponseDto {
  @ApiProperty({
    description:
      'JWT access token de curta duração para requisições autenticadas',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    type: String,
  })
  accessToken: string;

  @ApiProperty({
    description: 'Refresh token de longa duração para renovar o access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    type: String,
  })
  refreshToken: string;

  @ApiProperty({
    description: 'Informações do usuário autenticado',
    type: 'object',
    properties: {
      id: { type: 'number', example: 1 },
      username: { type: 'string', example: 'john_doe' },
      role: { enum: Object.values(Role), example: Role.USER },
    },
  })
  user: {
    id: number;
    username: string;
    role: Role;
  };
}
