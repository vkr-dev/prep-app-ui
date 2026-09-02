// Mirrors app/schemas/quick_search.py in prep-app-be.

export type FusionMethod = 'rrf' | 'weighted';
export type RetrievalMethod = 'keyword' | 'vector';

export interface QuickSearchRequest {
  query: string;
  k: number;
  fusion_method: FusionMethod;
  bm25_weight: number;
  vector_weight: number;
  use_llm_rerank: boolean;
}

export interface SearchResultItem {
  id: string;
  snippet: string;
  score: number;
  methods: RetrievalMethod[];
  bm25_score: number | null;
  vector_score: number | null;
}

export interface QueryEvalMetrics {
  k: number;
  ndcg_at_k: number;
  precision_at_k: number;
  recall_at_k: number;
}

export interface QuickSearchMetrics {
  total_latency_ms: number;
  bm25_hit_count: number;
  vector_hit_count: number;
  fusion_method: string;
  reranked: boolean;
  eval: QueryEvalMetrics | null;
}

export interface QuickSearchResponse {
  results: SearchResultItem[];
  metrics: QuickSearchMetrics;
}

export interface LabeledQueryResult {
  query: string;
  ndcg_at_k: number;
  precision_at_k: number;
  recall_at_k: number;
}

export interface QuickSearchEvalResponse {
  k: number;
  per_query: LabeledQueryResult[];
  average_ndcg_at_k: number;
  average_precision_at_k: number;
  average_recall_at_k: number;
}
