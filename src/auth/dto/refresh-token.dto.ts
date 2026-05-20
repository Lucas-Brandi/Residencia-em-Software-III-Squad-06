import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token recebido no login',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
