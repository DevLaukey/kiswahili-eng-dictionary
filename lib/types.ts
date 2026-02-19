/**
 * TypeScript types matching the API models
 */

export enum Language {
  SWAHILI = "sw",
  ENGLISH = "en",
  AUTO = "auto",
}

export interface DictionaryEntry {
  word: string;
  part_of_speech?: string;
  definition_sw?: string;
  definition_en?: string;
  similarity_score: number;
  examples?: string[];
  synonyms?: string[];
}

export interface QueryRequest {
  query: string;
  k?: number;
  language?: Language;
  threshold?: number;
}

export interface QueryResponse {
  query: string;
  language: string;
  response: string;
  retrieved_entries: DictionaryEntry[];
  top_match?: DictionaryEntry;
  processing_time_ms?: number;
  below_threshold?: boolean;
  blocked?: boolean;
}

export interface BatchQueryRequest {
  queries: string[];
  k?: number;
  language?: Language;
}

export interface BatchQueryResponse {
  total_queries: number;
  results: QueryResponse[];
  total_processing_time_ms: number;
}

export interface SearchRequest {
  query: string;
  k?: number;
}

export interface SearchResponse {
  query: string;
  results: DictionaryEntry[];
  processing_time_ms?: number;
}

export interface HealthResponse {
  status: string;
  ollama_connected: boolean;
  vector_store: string;
  total_entries: number;
  model_name: string;
}

export interface ErrorResponse {
  error: string;
  detail?: string;
  query?: string;
}

export type StepStatus = "pending" | "running" | "done" | "error";

export interface PipelineStep {
  step: string;
  status: StepStatus;
  data: Record<string, unknown>;
  startedAt?: number;
  completedAt?: number;
}

export interface StreamEvent {
  step: string;
  status: "running" | "done" | "error";
  data: Record<string, unknown>;
}
