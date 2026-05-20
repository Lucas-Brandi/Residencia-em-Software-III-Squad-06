import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeamDto {
  @ApiProperty({ description: 'Nome da equipe', example: 'Squad 06' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
