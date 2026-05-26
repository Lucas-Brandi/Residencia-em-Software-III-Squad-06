import { Injectable } from '@nestjs/common';

@Injectable()
export class SettingsService {
  private apiKey = process.env.AI_API_KEY || '';
  private aiModel = process.env.AI_MODEL || 'gpt-4o-mini';
  private analysisStrictness = process.env.ANALYSIS_STRICTNESS || 'moderado';

  // ─── GET ─────────────────────────────────────────────────────────────────────

  getApiKey(): { apiKey: string } {
    // Mascara a chave retornando só os últimos 6 caracteres por segurança
    const masked = this.apiKey ? '••••••••' + this.apiKey.slice(-6) : '';
    return { apiKey: masked };
  }

  getSettings(): {
    apiKey: string;
    aiModel: string;
    analysisStrictness: string;
  } {
    const masked = this.apiKey ? '••••••••' + this.apiKey.slice(-6) : '';
    return {
      apiKey: masked,
      aiModel: this.aiModel,
      analysisStrictness: this.analysisStrictness,
    };
  }

  // ─── UPDATE ───────────────────────────────────────────────────────────────────

  updateApiKey(apiKey: string): { apiKey: string } {
    this.apiKey = apiKey;
    process.env.GEMINI_API_KEY = apiKey;
    return { apiKey: this.apiKey };
  }

  updateSettings(data: { aiModel?: string; analysisStrictness?: string }): {
    aiModel: string;
    analysisStrictness: string;
  } {
    if (data.aiModel) {
      this.aiModel = data.aiModel;
      process.env.AI_MODEL = data.aiModel;
    }
    if (data.analysisStrictness) {
      this.analysisStrictness = data.analysisStrictness;
      process.env.ANALYSIS_STRICTNESS = data.analysisStrictness;
    }
    return {
      aiModel: this.aiModel,
      analysisStrictness: this.analysisStrictness,
    };
  }
}
