import { IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddTeamMemberDto {
  @ApiProperty({
    description: 'ID do usuário a ser adicionado à equipe',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
