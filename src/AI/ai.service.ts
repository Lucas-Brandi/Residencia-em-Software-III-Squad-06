import { Injectable, InternalServerErrorException } from '@nestjs/common';
import OpenAI from 'openai';
import { AIResponse } from './interfaces/ai-response.interface';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AIService {
  private readonly apiKey = process.env.AI_API_KEY;
  private readonly openai: OpenAI;

  constructor(private readonly prisma: PrismaService) {
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

      return completion.choices[0]?.message?.content ?? '';
    } catch (error) {
      console.error('Erro ao chamar a API da OpenAI:', error);
      throw new InternalServerErrorException(
        'Falha ao gerar resposta com a IA',
      );
    }
  }

  async analyzeCode(
    codeSnippet: string,
    rules: string[],
    configId?: string,
  ): Promise<AIResponse> {
    try {
      let temperature = 0.7;

      if (configId) {
        const config = await this.prisma.config.findUnique({
          where: { id: configId },
        });

        if (config && config.key === 'Rigidez da Análise') {
          const parsed = parseFloat(config.value);
          if (!isNaN(parsed) && parsed >= 0 && parsed <= 2) {
            temperature = parsed;
          }
        }
      }

      const systemPrompt = this.buildSystemPrompt(rules);
      const userPrompt = this.buildUserPrompt(codeSnippet);

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature,
      });

      const responseText = completion.choices[0]?.message?.content;
      if (!responseText) {
        throw new Error('Resposta vazia da OpenAI');
      }

      const parsedResponse: AIResponse = JSON.parse(responseText);

      // Garante que findings sempre existe como array (compatibilidade defensiva)
      if (!Array.isArray(parsedResponse.findings)) {
        parsedResponse.findings = [];
      }

      return parsedResponse;
    } catch (error) {
      console.error('Erro ao chamar a API da OpenAI:', error);
      throw new InternalServerErrorException(
        'Falha ao processar a análise com a IA',
      );
    }
  }

  private buildSystemPrompt(rules: string[]): string {
    const securityRule =
      'Always scan for security vulnerabilities such as SQL injection, XSS, insecure deserialization, hardcoded secrets, broken authentication, and any other OWASP Top 10 issues.';

    const allRules = rules.length ? [...rules, securityRule] : [securityRule];

    const focus = rules.length
      ? 'Analyze the provided code snippet based EXACTLY on the following rules:'
      : 'No custom rules are registered for this repository. Analyze the provided code snippet focusing exclusively on security vulnerabilities:';

    return `You are a strict code review assistant. ${focus}
${allRules.map((rule, index) => `${index + 1}. ${rule}`).join('\n')}

You MUST respond with a valid JSON object containing exactly these three keys:
- "healthScore": A number between 0 and 100 representing the overall code quality.
- "feedback": A string with a general summary of the code analysis.
- "findings": An array of specific issues found. Each finding must be an object with:
  - "severity": One of "CRITICO", "AVISO", or "INFO".
  - "description": A clear description of the issue found.
  - "filePath": (optional) The file path where the issue was found, if identifiable from the diff.
  - "lineNumber": (optional) The line number of the issue, if identifiable.

Example response:
{
  "healthScore": 72,
  "feedback": "The code has some security vulnerabilities and style issues that should be addressed.",
  "findings": [
    {
      "severity": "CRITICO",
      "description": "Potential SQL injection vulnerability: user input is concatenated directly into a query string.",
      "filePath": "src/controllers/users.ts",
      "lineNumber": 42
    },
    {
      "severity": "AVISO",
      "description": "Variable 'data' uses snake_case instead of camelCase.",
      "filePath": "src/utils/helpers.ts"
    }
  ]
}`;
  }

  private buildUserPrompt(codeSnippet: string): string {
    return `Please analyze the following code snippet:\n\n${codeSnippet}`;
  }
}