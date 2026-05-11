import { Controller, Post, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AIService } from './ai.service';
import { TestAiDto } from './dto/test-ai.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('ai')
@Controller('ai')
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Post('test')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Testar análise de código com IA' })
  @ApiResponse({
    status: 200,
    description: 'Análise de código realizada com sucesso',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async testAnalyzeCode(@Body() testAiDto: TestAiDto) {
    return this.aiService.analyzeCode(testAiDto.codeSnippet, testAiDto.rules);
  }

  @Patch('config')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update AI configuration (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'AI configuration updated successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  async updateConfig(@Body() config: { rigidity?: number; parameters?: any }) {
    return { message: 'AI configuration updated', config };
  }
}
