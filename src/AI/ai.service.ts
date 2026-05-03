import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AIResponse } from './interfaces/ai-response.interface';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AIService {
  // Pega a chave do .env
  private readonly apiKey = process.env.AI_API_KEY; 
  private genAI: GoogleGenerativeAI;

  constructor() {
    if (!this.apiKey) {
      throw new Error('AI_API_KEY não está definida no arquivo .env');
    }
    // Inicializa o SDK do Gemini
    this.genAI = new GoogleGenerativeAI(this.apiKey);
  }

  async analyzeCode(codeSnippet: string, rules: string[]): Promise<AIResponse> {
    try {
      // Usaremos o modelo 1.5-flash: é o mais rápido, barato (grátis) e excelente para código
      const model = this.genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        generationConfig: {
          // O pulo do gato: força a IA a cuspir estritamente um JSON!
          responseMimeType: "application/json", 
        }
      });

      const systemPrompt = this.buildSystemPrompt(rules);
      const userPrompt = this.buildUserPrompt(codeSnippet);

      // Juntamos as instruções com o código
      // Correto (com crases):
      const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

      // Chama a API de verdade!
      const result = await model.generateContent(fullPrompt);
      const responseText = result.response.text();

      // Como forçamos o mimeType para application/json, é seguro fazer o parse direto
      const parsedResponse: AIResponse = JSON.parse(responseText);

      return parsedResponse;
    } catch (error) {
      console.error('Erro ao chamar a API do Gemini:', error);
      throw new InternalServerErrorException('Falha ao processar a análise com a IA');
    }
  }

  private buildSystemPrompt(rules: string[]): string {
    return `You are a strict code review assistant. Analyze the provided code snippet based EXACTLY on the following rules:
$${rules.map((rule, index) => `${index + 1}. ${rule}`).join('\n')}

You MUST respond with a valid JSON object containing exactly these two keys:
- "healthScore": A number between 0 and 100 representing the overall code quality.
- "feedback": A string with detailed feedback about the code.`;
  }

  private buildUserPrompt(codeSnippet: string): string {
    return `Please analyze the following code snippet:\n\n${codeSnippet}`;
  }
}