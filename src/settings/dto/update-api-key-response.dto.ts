import { ApiProperty } from '@nestjs/swagger';

export class UpdateApiKeyResponseDto {
  @ApiProperty({
    description: 'Chave de API armazenada após a atualização',
    example: 'AIzaSyExampleKeyNotForProductionUse',
  })
  apiKey: string;
}
