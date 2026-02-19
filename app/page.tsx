"use client";

import { useState, useEffect } from "react";
import { SearchBar } from "@/components/SearchBar";
import { SearchResults } from "@/components/SearchResults";
import { HealthStatus } from "@/components/HealthStatus";
import { PipelineSteps } from "@/components/PipelineSteps";
import { api } from "@/lib/api";
import {
  QueryResponse,
  HealthResponse,
  Language,
  PipelineStep,
  StreamEvent,
  DictionaryEntry,
} from "@/lib/types";
import { AlertCircle, BookOpen } from "lucide-react";

function convertToQueryResponse(
  data: Record<string, unknown>
): QueryResponse {
  return {
    query: data.query as string,
    language: data.language as string,
    response: data.response as string,
    retrieved_entries: (data.retrieved_entries as DictionaryEntry[]) ?? [],
    top_match: data.top_match as DictionaryEntry | undefined,
    processing_time_ms: data.processing_time_ms as number | undefined,
    below_threshold: (data.below_threshold as boolean) ?? false,
    blocked: (data.blocked as boolean) ?? false,
  };
}

export default function Home() {
  const [result, setResult] = useState<QueryResponse | null>(null);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [steps, setSteps] = useState<PipelineStep[]>([]);
  const [showPipelineSteps, setShowPipelineSteps] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const healthData = await api.health();
        setHealth(healthData);
      } catch (err) {
        console.error("Failed to fetch health status:", err);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = async (
    query: string,
    k: number,
    language: Language
  ) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setSteps([]);

    try {
      await api.queryStream({ query, k, language }, (event: StreamEvent) => {
        if (event.step === "complete") {
          setResult(convertToQueryResponse(event.data));
        } else if (event.step === "error") {
          setError((event.data.message as string) ?? "An unexpected error occurred");
        } else {
          const now = Date.now();
          setSteps((prev) => {
            const idx = prev.findIndex((s) => s.step === event.step);
            if (idx >= 0) {
              // Update existing step (running → done)
              const updated = [...prev];
              updated[idx] = {
                ...updated[idx],
                status: event.status,
                data: event.data,
                completedAt: event.status === "done" ? now : undefined,
              };
              return updated;
            }
            // New step appearing
            return [
              ...prev,
              {
                step: event.step,
                status: event.status,
                data: event.data,
                startedAt: now,
              },
            ];
          });
        }
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const showSteps = steps.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 font-sans dark:from-zinc-950 dark:to-black">
      <main className="container mx-auto flex min-h-screen flex-col items-center gap-8 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-3xl text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <BookOpen className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
              Swahili Dictionary
            </h1>
          </div>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Powered by AI and vector search technology
          </p>
        </div>

        <HealthStatus health={health} />

        <SearchBar
          onSearch={handleSearch}
          isLoading={isLoading}
          showPipelineSteps={showPipelineSteps}
          onTogglePipelineSteps={setShowPipelineSteps}
        />

        {error && (
          <div className="w-full max-w-3xl rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/30">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
              <div>
                <h3 className="font-semibold text-red-800 dark:text-red-400">
                  Error
                </h3>
                <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {showSteps && showPipelineSteps && <PipelineSteps steps={steps} />}

        {result && <SearchResults result={result} />}

        {!result && !isLoading && !error && !showSteps && (
          <div className="w-full max-w-3xl rounded-lg border border-zinc-200 bg-white p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
            <BookOpen className="mx-auto mb-4 h-12 w-12 text-zinc-400" />
            <h2 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              Start your search
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Enter a word in Swahili or English to get definitions, examples, and more.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
