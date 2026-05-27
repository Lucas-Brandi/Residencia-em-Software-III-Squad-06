import { Controller, Post, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AIService } from './ai.service';
import { TestAiDto } from './dto/test-ai.dto';

@ApiTags('AI')
@ApiBearerAuth('access-token')
@Controller('ai')
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Post('test')
  @ApiOperation({
    summary: 'Testar análise de código com IA',
    description:
      'Envia um trecho de código e regras de análise. A IA retorna um healthScore (0-100) e feedback.',
  })
  @ApiBody({
    type: TestAiDto,
    examples: {
      example1: {
        summary: 'Teste simples',
        value: {
          codeSnippet: 'function hello() { console.log("Hello"); }',
          rules: ['Use camelCase'],
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Análise concluída com sucesso',
    schema: {
      properties: {
        healthScore: { type: 'number', minimum: 0, maximum: 100, example: 85 },
        feedback: {
          type: 'string',
          example: 'Código bem estruturado e segue as regras.',
        },
        suggestions: { type: 'array', items: { type: 'string' } },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Code snippet ou rules inválidos' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 500,
    description: 'Falha ao conectar com a IA (OpenAI)',
  })
  async testAnalyzeCode(@Body() testAiDto: TestAiDto) {
    return this.aiService.analyzeCode(testAiDto.codeSnippet, testAiDto.rules);
  }
}
