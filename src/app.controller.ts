import { Controller, Post, Body } from '@nestjs/common';
import { AIService } from './AI/ai.service';

@Controller('ai')
export class AppController {
  constructor(private readonly aiService: AIService) {}

  @Post('chat')
  async chat(@Body('prompt') prompt: string) {
    return this.aiService.generateResponse(prompt);
  }
}