import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateApiKeyDto {
  @IsString()
  @IsNotEmpty()
  apiKey: string;
}
