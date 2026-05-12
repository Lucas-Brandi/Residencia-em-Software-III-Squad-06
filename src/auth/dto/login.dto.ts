import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for user login authentication
 */
export class LoginDto {
  @ApiProperty({
    description: 'Username for authentication',
    example: 'john_doe',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Password for authentication',
    example: 'SecurePass123',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
