// Mirrors app/schemas/generate.py and app/schemas/pipeline.py in prep-app-be.

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

export interface EvalReport {
  average_relevance: number;
  relevance_scores: number[];
  max_pairwise_similarity: number;
  duplication_flagged: boolean;
}

export interface RunMetrics {
  total_latency_ms: number;
  step_latencies_ms: Record<string, number>;
  total_input_tokens: number;
  total_output_tokens: number;
}

// The full response shape for POST /api/generate.
export interface GenerateResult {
  topic: string;
  questions: Question[];
  eval: EvalReport;
  metrics: RunMetrics;
  // True when served from the shared topic cache (any user's prior search
  // for this topic) instead of a fresh LLM run - metrics reflect the cheap
  // cache lookup, not the original run's real cost.
  from_cache: boolean;
}
