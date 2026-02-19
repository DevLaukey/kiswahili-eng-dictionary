"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Language } from "@/lib/types";

interface SearchBarProps {
  onSearch: (query: string, k: number, language: Language) => void;
  isLoading: boolean;
  showPipelineSteps: boolean;
  onTogglePipelineSteps: (value: boolean) => void;
}

export function SearchBar({
  onSearch,
  isLoading,
  showPipelineSteps,
  onTogglePipelineSteps,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [k, setK] = useState(3);
  const [language, setLanguage] = useState<Language>(Language.AUTO);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), k, language);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a word in Swahili or English..."
            className="w-full rounded-lg border border-zinc-300 bg-white py-3 pl-10 pr-4 text-base text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Searching...
            </>
          ) : (
            "Search"
          )}
        </button>
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <label htmlFor="results" className="text-zinc-600 dark:text-zinc-400">
            Results:
          </label>
          <select
            id="results"
            value={k}
            onChange={(e) => setK(Number(e.target.value))}
            className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            disabled={isLoading}
          >
            {[3, 5].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor="language"
            className="text-zinc-600 dark:text-zinc-400"
          >
            Language:
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            disabled={isLoading}
          >
            <option value={Language.AUTO}>Auto-detect</option>
            <option value={Language.SWAHILI}>Swahili</option>
            <option value={Language.ENGLISH}>English</option>
          </select>
        </div>

        <label className="flex cursor-pointer items-center gap-2 select-none">
          <input
            type="checkbox"
            checked={showPipelineSteps}
            onChange={(e) => onTogglePipelineSteps(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-300 accent-blue-600 dark:border-zinc-600"
          />
          <span className="text-zinc-600 dark:text-zinc-400">
            Show pipeline steps
          </span>
        </label>
      </div>
    </form>
  );
}
