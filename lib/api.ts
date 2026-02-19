/**
 * API client for communicating with the Swahili Dictionary backend
 */

import {
  QueryRequest,
  QueryResponse,
  BatchQueryRequest,
  BatchQueryResponse,
  SearchRequest,
  SearchResponse,
  HealthResponse,
  ErrorResponse,
  StreamEvent,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const API_PREFIX = "/api/v1";

class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public detail?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData: ErrorResponse;
    try {
      errorData = await response.json();
    } catch {
      throw new ApiError(
        `HTTP Error ${response.status}: ${response.statusText}`,
        response.status
      );
    }

    throw new ApiError(
      errorData.error || "An error occurred",
      response.status,
      errorData.detail
    );
  }

  return response.json();
}

export const api = {
  /**
   * Check API health status
   */
  async health(): Promise<HealthResponse> {
    const response = await fetch(`${API_BASE_URL}${API_PREFIX}/health`);
    return handleResponse<HealthResponse>(response);
  },

  /**
   * Process a single query through the RAG pipeline
   */
  async query(request: QueryRequest): Promise<QueryResponse> {
    const response = await fetch(`${API_BASE_URL}${API_PREFIX}/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });
    return handleResponse<QueryResponse>(response);
  },

  /**
   * Process multiple queries in batch
   */
  async batchQuery(request: BatchQueryRequest): Promise<BatchQueryResponse> {
    const response = await fetch(`${API_BASE_URL}${API_PREFIX}/batch-query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });
    return handleResponse<BatchQueryResponse>(response);
  },

  /**
   * Process a query with real-time step-by-step progress via SSE streaming.
   * onEvent is called for each step event as it arrives.
   */
  async queryStream(
    request: QueryRequest,
    onEvent: (event: StreamEvent) => void
  ): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}${API_PREFIX}/query/stream`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      }
    );

    if (!response.ok) {
      let errorData: ErrorResponse;
      try {
        errorData = await response.json();
      } catch {
        throw new ApiError(
          `HTTP Error ${response.status}: ${response.statusText}`,
          response.status
        );
      }
      throw new ApiError(
        errorData.error || "An error occurred",
        response.status,
        errorData.detail
      );
    }

    if (!response.body) throw new ApiError("No response body from stream");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const raw = line.slice(6).trim();
          if (!raw) continue;
          try {
            const event = JSON.parse(raw) as StreamEvent;
            onEvent(event);
          } catch {
            // skip malformed lines
          }
        }
      }
    }
  },

  /**
   * Vector similarity search without LLM generation (faster)
   */
  async search(request: SearchRequest): Promise<SearchResponse> {
    const response = await fetch(`${API_BASE_URL}${API_PREFIX}/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });
    return handleResponse<SearchResponse>(response);
  },
};

export { ApiError };
