"use client";

import { useState, useEffect } from "react";
import { SearchBar } from "@/components/SearchBar";
import { SearchResults } from "@/components/SearchResults";
import { HealthStatus } from "@/components/HealthStatus";
import { api } from "@/lib/api";
import { QueryResponse, HealthResponse, Language } from "@/lib/types";
import { AlertCircle, BookOpen } from "lucide-react";

export default function Home() {
  const [result, setResult] = useState<QueryResponse | null>(null);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSearch = async (query: string, k: number, language: Language) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await api.query({
        query,
        k,
        language,
      });
      setResult(response);
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

        <SearchBar onSearch={handleSearch} isLoading={isLoading} />

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

        {result && <SearchResults result={result} />}

        {!result && !isLoading && !error && (
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
