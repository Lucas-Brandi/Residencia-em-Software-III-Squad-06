import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AIService } from './ai.service';
import { TestAiDto } from './dto/test-ai.dto';

@ApiTags('ai')
@Controller('ai')
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Post('test')
  @ApiOperation({ summary: 'Testar análise de código com IA' })
  @ApiResponse({
    status: 200,
    description: 'Análise de código realizada com sucesso',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async testAnalyzeCode(@Body() testAiDto: TestAiDto) {
    return this.aiService.analyzeCode(testAiDto.codeSnippet, testAiDto.rules);
  }
}
