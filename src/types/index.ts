export interface Value {
  id: string;
  name: string;
  description: string;
}

export interface Question {
  id: string;
  valueId: string;
  text: string;
  order: number;
}

export interface Response {
  questionId: string;
  score: number; // 1-5 scale
  timestamp: Date;
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  values: Value[];
  questions: Question[];
  isActive: boolean;
  expectedResponses?: number;
}

export interface QuestionScore {
  questionId: string;
  questionText: string;
  valueId: string;
  score: number; // Percentage of 4-5 responses
  totalResponses: number;
}

export interface ValueScore {
  valueId: string;
  valueName: string;
  score: number; // Average of question scores for this value
  questionScores: QuestionScore[];
}

export interface SurveyResults {
  totalResponses: number;
  expectedResponses?: number;
  responseRate?: number;
  valueScores: ValueScore[];
  overallScore: number;
}

export type ViewMode = 'overview' | 'survey' | 'results';