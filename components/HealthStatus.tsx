"use client";

import { HealthResponse } from "@/lib/types";
import { Activity, Database, Brain, CheckCircle, XCircle } from "lucide-react";

interface HealthStatusProps {
  health: HealthResponse | null;
}

export function HealthStatus({ health }: HealthStatusProps) {
  if (!health) return null;

  const isHealthy = health.status === "healthy" && health.ollama_connected;

  return (
    <div className="w-full max-w-3xl rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="mb-3 flex items-center gap-2">
        <Activity className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          System Status
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            {isHealthy ? (
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            )}
            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              API Status
            </span>
          </div>
          <span className={`text-sm font-semibold ${isHealthy ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
            {health.status}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              LLM Model
            </span>
          </div>
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {health.model_name}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Vector Store
            </span>
          </div>
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {health.vector_store}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Total Entries
            </span>
          </div>
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {health.total_entries.toLocaleString()}
          </span>
        </div>
      </div>

      {!health.ollama_connected && (
        <div className="mt-3 rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950/30 dark:text-red-400">
          Warning: Ollama service is not connected. Some features may be unavailable.
        </div>
      )}
    </div>
  );
}
