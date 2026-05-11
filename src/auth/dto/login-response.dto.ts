import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../enums/role.enum';

/**
 * DTO for login response containing access token and user information
 */
export class LoginResponseDto {
  @ApiProperty({
    description: 'JWT access token for authenticated requests',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    type: String,
  })
  accessToken: string;

  @ApiProperty({
    description: 'User information',
    type: 'object',
    properties: {
      id: { type: 'number', example: 1 },
      username: { type: 'string', example: 'john_doe' },
      role: { enum: Role, example: Role.USER },
    },
  })
  user: {
    id: number;
    username: string;
    role: Role;
  };
}
