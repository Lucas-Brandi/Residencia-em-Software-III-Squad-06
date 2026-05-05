import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeamDto {
  @ApiProperty({ description: 'Nome da equipe', example: 'Equipe Alpha' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
