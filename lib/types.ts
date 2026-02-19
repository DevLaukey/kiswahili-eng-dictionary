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
  examples?: Array<{ [key: string]: string }>;
  synonyms?: string[];
}

export interface QueryRequest {
  query: string;
  k?: number;
  language?: Language;
}

export interface QueryResponse {
  query: string;
  language: string;
  response: string;
  retrieved_entries: DictionaryEntry[];
  top_match?: DictionaryEntry;
  processing_time_ms?: number;
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
