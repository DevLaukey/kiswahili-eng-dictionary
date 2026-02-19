"use client";

import { DictionaryEntry as DictionaryEntryType } from "@/lib/types";
import { BookOpen, Tag } from "lucide-react";

interface DictionaryEntryProps {
  entry: DictionaryEntryType;
  isTopMatch?: boolean;
}

export function DictionaryEntry({ entry, isTopMatch = false }: DictionaryEntryProps) {
  const scorePercentage = (entry.similarity_score * 100).toFixed(1);

  return (
    <div
      className={`rounded-lg border p-5 transition-all ${
        isTopMatch
          ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/30"
          : "border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900"
      }`}
    >
      {isTopMatch && (
        <div className="mb-3 inline-block rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white dark:bg-blue-500">
          Top Match
        </div>
      )}

      <div className="mb-3 flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {entry.word}
          </h3>
          {entry.part_of_speech && (
            <div className="mt-1 flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400">
              <Tag className="h-4 w-4" />
              <span className="italic">{entry.part_of_speech}</span>
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Similarity
          </div>
          <div
            className={`text-lg font-bold ${
              entry.similarity_score > 0.8
                ? "text-green-600 dark:text-green-400"
                : entry.similarity_score > 0.6
                ? "text-yellow-600 dark:text-yellow-400"
                : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            {scorePercentage}%
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {entry.definition_en && (
          <div>
            <div className="mb-1 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                English Definition:
              </span>
            </div>
            <p className="text-base text-zinc-700 dark:text-zinc-300">
              {entry.definition_en}
            </p>
          </div>
        )}

        {entry.definition_sw && (
          <div>
            <div className="mb-1 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Swahili Definition:
              </span>
            </div>
            <p className="text-base text-zinc-700 dark:text-zinc-300">
              {entry.definition_sw}
            </p>
          </div>
        )}

        {entry.synonyms && entry.synonyms.length > 0 && (
          <div>
            <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Synonyms:{" "}
            </span>
            <span className="text-base text-zinc-600 dark:text-zinc-400">
              {entry.synonyms.join(", ")}
            </span>
          </div>
        )}

        {entry.examples && entry.examples.length > 0 && (
          <div>
            <div className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Examples:
            </div>
            <ul className="space-y-2">
              {entry.examples.map((example, idx) => (
                <li
                  key={idx}
                  className="rounded-md border-l-4 border-blue-300 bg-zinc-50 px-3 py-2 text-sm italic text-zinc-600 dark:border-blue-700 dark:bg-zinc-800 dark:text-zinc-400"
                >
                  &ldquo;{example}&rdquo;
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
