export interface AIResponse {
  healthScore: number;
  feedback: string;
}

export interface AIAnalyzeCodeInput {
  codeSnippet: string;
  rules: string[];
}
