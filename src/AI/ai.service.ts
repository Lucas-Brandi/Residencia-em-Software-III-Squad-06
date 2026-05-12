import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AIResponse } from './interfaces/ai-response.interface';
import OpenAI from 'openai';

@Injectable()
export class AIService {
  private readonly apiKey = process.env.AI_API_KEY;
  private openai: OpenAI;

  constructor() {
    if (!this.apiKey) {
      throw new Error('AI_API_KEY não está definida no arquivo .env');
    }
    this.openai = new OpenAI({ apiKey: this.apiKey });
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
      });

      return completion.choices[0].message.content ?? '';
    } catch (error) {
      console.error('Erro ao chamar a API da OpenAI:', error);
      throw new InternalServerErrorException(
        'Falha ao gerar resposta com a IA',
      );
    }
  }

  async analyzeCode(codeSnippet: string, rules: string[]): Promise<AIResponse> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: this.buildSystemPrompt(rules) },
          { role: 'user', content: this.buildUserPrompt(codeSnippet) },
        ],
      });

      const responseText = completion.choices[0].message.content ?? '{}';
      const parsedResponse: AIResponse = JSON.parse(responseText);

      return parsedResponse;
    } catch (error) {
      console.error('Erro ao chamar a API da OpenAI:', error);
      throw new InternalServerErrorException(
        'Falha ao processar a análise com a IA',
      );
    }
  }

  private buildSystemPrompt(rules: string[]): string {
    return `You are a strict code review assistant. Analyze the provided code snippet based EXACTLY on the following rules:
${rules.map((rule, index) => `${index + 1}. ${rule}`).join('\n')}

You MUST respond with a valid JSON object containing exactly these two keys:
- "healthScore": A number between 0 and 100 representing the overall code quality.
- "feedback": A string with detailed feedback about the code.`;
  }

  private buildUserPrompt(codeSnippet: string): string {
    return `Please analyze the following code snippet:\n\n${codeSnippet}`;
  }
}
