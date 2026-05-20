import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateApiKeyDto {
  @ApiProperty({
    description: 'Nova chave de API da OpenAI',
    example: 'sk-...',
  })
  @IsString()
  @IsNotEmpty()
  apiKey: string;
}
