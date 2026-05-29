import { IsString, IsNotEmpty, ArrayNotEmpty, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignRuleDto {
  @ApiProperty({
    description: 'ID da regra a ser vinculada',
    example: 'uuid-da-regra',
  })
  @IsString()
  @IsNotEmpty()
  ruleId: string;

  @ApiProperty({
    description: 'Lista de IDs dos repositórios para vincular a regra',
    example: ['uuid-repo-1', 'uuid-repo-2'],
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  repositoryIds: string[];
}
