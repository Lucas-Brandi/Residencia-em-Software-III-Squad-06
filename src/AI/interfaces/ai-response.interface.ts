import { RuleContext } from './rule-context.interface';

export interface AIFinding {
  severity: 'CRITICO' | 'AVISO' | 'INFO';
  description: string;
  filePath?: string;
  lineNumber?: number;
  ruleName?: string;
}

export interface AIResponse {
  healthScore: number;
  feedback: string;
  findings: AIFinding[];
}

export interface AIAnalyzeCodeInput {
  codeSnippet: string;
  rules: RuleContext[];
}
