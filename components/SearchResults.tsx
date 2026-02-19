"use client";

import { QueryResponse } from "@/lib/types";
import { DictionaryEntry } from "./DictionaryEntry";
import { Clock, MessageSquare, Globe, AlertTriangle, ShieldX } from "lucide-react";

interface SearchResultsProps {
  result: QueryResponse;
}

export function SearchResults({ result }: SearchResultsProps) {
  return (
    <div className="w-full max-w-3xl space-y-6">
      <div className="flex flex-wrap gap-4 text-sm text-zinc-600 dark:text-zinc-400">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span>
            Query: <span className="font-medium text-zinc-900 dark:text-zinc-100">{result.query}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          <span>
            Language: <span className="font-medium text-zinc-900 dark:text-zinc-100">{result.language}</span>
          </span>
        </div>
        {result.processing_time_ms && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>
              Processed in: <span className="font-medium text-zinc-900 dark:text-zinc-100">{result.processing_time_ms.toFixed(0)}ms</span>
            </span>
          </div>
        )}
      </div>

      {result.blocked ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-950/30">
          <h2 className="mb-2 flex items-center gap-2 text-lg font-bold text-red-800 dark:text-red-300">
            <ShieldX className="h-5 w-5" />
            Query Not Allowed
          </h2>
          <p className="text-sm text-red-700 dark:text-red-400">
            {result.response}
          </p>
          <p className="mt-2 text-xs text-red-500 dark:text-red-500">
            Try searching for a Swahili or English word, e.g. &ldquo;rafiki&rdquo;, &ldquo;translate kusoma&rdquo;, or &ldquo;what does chakula mean?&rdquo;
          </p>
        </div>
      ) : result.below_threshold ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-950/30">
          <h2 className="mb-2 flex items-center gap-2 text-lg font-bold text-amber-800 dark:text-amber-300">
            <AlertTriangle className="h-5 w-5" />
            No Strong Match Found
          </h2>
          <p className="text-sm text-amber-700 dark:text-amber-400">
            {result.response}
          </p>
          <p className="mt-2 text-xs text-amber-600 dark:text-amber-500">
            The retrieved entries had low confidence scores. Try rephrasing your query or using a more specific word.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-zinc-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 dark:border-zinc-700 dark:from-blue-950/30 dark:to-indigo-950/30">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-zinc-900 dark:text-zinc-100">
            <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            AI Response
          </h2>
          <p className="text-base leading-relaxed text-zinc-800 dark:text-zinc-200">
            {result.response}
          </p>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Retrieved Entries ({result.retrieved_entries.length})
        </h2>

        {result.top_match && (
          <DictionaryEntry entry={result.top_match} isTopMatch={true} />
        )}

        {result.retrieved_entries
          .filter((entry) => entry.word !== result.top_match?.word)
          .map((entry, idx) => (
            <DictionaryEntry key={idx} entry={entry} />
          ))}
      </div>
    </div>
  );
}
