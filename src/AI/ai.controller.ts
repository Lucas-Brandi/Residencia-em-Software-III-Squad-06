import { Controller, Post, Body } from '@nestjs/common';
import { AIService } from './ai.service';
import { TestAiDto } from './dto/test-ai.dto';

@Controller('ai')
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Post('test')
  async testAnalyzeCode(@Body() testAiDto: TestAiDto) {
    return this.aiService.analyzeCode(testAiDto.codeSnippet, testAiDto.rules);
  }
}
