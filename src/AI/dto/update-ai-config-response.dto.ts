import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/** Eco da configuração enviada no corpo da requisição PATCH /ai/config */
export class AiConfigResponseBodyDto {
  @ApiPropertyOptional({
    description: 'Rigidez ou peso da análise (quando aplicável)',
    example: 0.7,
  })
  rigidity?: number;

  @ApiPropertyOptional({
    description: 'Parâmetros adicionais da configuração de IA (objeto livre)',
    type: 'object',
    additionalProperties: true,
    example: { temperature: 0.2 },
  })
  parameters?: Record<string, unknown>;
}

export class UpdateAiConfigResponseDto {
  @ApiProperty({
    description: 'Mensagem de confirmação',
    example: 'AI configuration updated',
  })
  message: string;

  @ApiProperty({
    description: 'Configuração recebida (eco do corpo da requisição)',
    type: AiConfigResponseBodyDto,
  })
  config: AiConfigResponseBodyDto;
}
