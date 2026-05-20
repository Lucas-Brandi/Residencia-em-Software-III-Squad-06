import { Controller, Post, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { AIService } from './ai.service';
import { TestAiDto } from './dto/test-ai.dto';

@ApiTags('AI')
@Controller('ai')
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Post('test')
  @ApiOperation({ summary: 'Testar análise de código com IA' })
  @ApiBody({ type: TestAiDto })
  @ApiResponse({
    status: 200,
    description: 'Análise concluída com sucesso',
    schema: {
      type: 'object',
      properties: {
        healthScore: { type: 'number', example: 85 },
        feedback: {
          type: 'string',
          example: 'O código segue as regras definidas.',
        },
      },
    },
  })
  @ApiResponse({ status: 500, description: 'Falha ao gerar resposta com a IA' })
  async testAnalyzeCode(@Body() testAiDto: TestAiDto) {
    return this.aiService.analyzeCode(testAiDto.codeSnippet, testAiDto.rules);
  }
}
