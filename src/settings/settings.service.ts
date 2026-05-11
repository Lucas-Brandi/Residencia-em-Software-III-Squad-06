import { Injectable } from '@nestjs/common';

@Injectable()
export class SettingsService {
  private apiKey = process.env.GEMINI_API_KEY || '';

  updateApiKey(apiKey: string): { apiKey: string } {
    this.apiKey = apiKey;
    process.env.GEMINI_API_KEY = apiKey;
    return { apiKey: this.apiKey };
  }

  getApiKey(): { apiKey: string } {
    return { apiKey: this.apiKey };
  }
}
