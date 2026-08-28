// Mirrors app/schemas/generate.py in prep-app-be.

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  category: string;
  difficulty: Difficulty;
  question: string;
  answer: string;
}

export interface GenerateRequest {
  topic: string;
}

export interface GeneratedQuestionSet {
  topic: string;
  questions: Question[];
}
