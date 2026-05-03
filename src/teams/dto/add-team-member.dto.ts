import { IsNumber, IsNotEmpty } from 'class-validator';

export class AddTeamMemberDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
