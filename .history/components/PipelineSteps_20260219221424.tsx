"use client";

import { PipelineStep, StepStatus } from "@/lib/types";
import {
  Globe,
  Database,
  FileText,
  Sparkles,
  CheckCircle2,
  XCircle,
  Loader2,
  Circle,
  ShieldCheck,
  ShieldX,
  ArrowUpDown,
} from "lucide-react";

interface PipelineStepsProps {
  steps: PipelineStep[];
}

const STEP_META: Record<
  string,
  { label: string; Icon: React.ElementType; color: string }
> = {
  guard_check: {
    label: "Guard Rail",
    Icon: ShieldX,
    color: "text-rose-500 dark:text-rose-400",
  },
  language_detection: {
    label: "Language Detection",
    Icon: Globe,
    color: "text-violet-500 dark:text-violet-400",
  },
  vector_search: {
    label: "Vector Search",
    Icon: Database,
    color: "text-blue-500 dark:text-blue-400",
  },
  score_check: {
    label: "Confidence Check",
    Icon: ShieldCheck,
    color: "text-orange-500 dark:text-orange-400",
  },
  reranking: {
    label: "Cross-Encoder Reranking",
    Icon: ArrowUpDown,
    color: "text-pink-500 dark:text-pink-400",
  },
  prompt_build: {
    label: "Building Prompt",
    Icon: FileText,
    color: "text-amber-500 dark:text-amber-400",
  },
  llm_generation: {
    label: "AI Generation",
    Icon: Sparkles,
    color: "text-emerald-500 dark:text-emerald-400",
  },
};

function StatusIcon({ status }: { status: StepStatus }) {
  if (status === "running")
    return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
  if (status === "done")
    return <CheckCircle2 className="h-5 w-5 text-green-500 dark:text-green-400" />;
  if (status === "error")
    return <XCircle className="h-5 w-5 text-red-500 dark:text-red-400" />;
  return <Circle className="h-5 w-5 text-zinc-300 dark:text-zinc-600" />;
}

function stepDescription(step: string, status: StepStatus, data: Record<string, unknown>): string {
  if (status === "running") return ((data.message as string) ?? "Processing...") as string;

  switch (step) {
    case "guard_check": {
      const passed = data.passed as boolean;
      if (!passed) return `Blocked · ${data.reason as string}`;
      return "Query is relevant to dictionary lookup";
    }

    case "language_detection":
      return `Detected ${data.label as string} (${data.language as string})`;

    case "vector_search": {
      const count = data.count as number;
      if (!count) return "No entries found";
      const top = data.top_word as string;
      const score = ((data.top_score as number) * 100).toFixed(1);
      return `${count} entries retrieved · Top match: "${top}" (${score}%)`;
    }

    case "prompt_build": {
      const tmpl = data.template as string;
      const used = data.entries_used as number;
      return `${tmpl} template · ${used} entries used`;
    }

    case "score_check": {
      const passed = data.passed as boolean;
      const score = ((data.top_score as number) * 100).toFixed(1);
      const thr = ((data.threshold as number) * 100).toFixed(0);
      if (!passed)
        return `Below threshold · ${score}% < ${thr}% required — skipped LLM`;
      return `Passed · Top score ${score}% ≥ ${thr}% threshold`;
    }

    case "reranking": {
      const cands = data.candidates as number;
      const kept = data.returned as number;
      return `Cross-encoder scored ${cands} candidates · Kept top ${kept}`;
    }

    case "llm_generation": {
      if (data.fallback)
        return `Fallback response (Ollama unavailable)`;
      const chars = data.response_length as number;
      return `Generated ${chars} characters with ${data.model as string}`;
    }

    default:
      return status === "done" ? "Complete" : "";
  }
}

function ElapsedBadge({ startedAt, completedAt }: { startedAt?: number; completedAt?: number }) {
  if (!startedAt || !completedAt) return null;
  const ms = completedAt - startedAt;
  return (
    <span className="ml-auto rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
      {ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`}
    </span>
  );
}

export function PipelineSteps({ steps }: PipelineStepsProps) {
  const stepMap = new Map(steps.map((s) => [s.step, s]));

  // `reranking` only appears in the list when the backend actually emits it
  const effectiveOrder = [
    "guard_check",
    "language_detection",
    "vector_search",
    "score_check",
    ...(steps.some((s) => s.step === "reranking") ? ["reranking"] : []),
    "prompt_build",
    "llm_generation",
  ];

  return (
    <div className="w-full max-w-3xl">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
        Pipeline Steps
      </h3>
      <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900 divide-y divide-zinc-100 dark:divide-zinc-800">
        {effectiveOrder.map((stepId, idx) => {
          const step = stepMap.get(stepId);
          const status: StepStatus = step?.status ?? "pending";
          const meta = STEP_META[stepId];
          const { Icon, label, color } = meta;
          const isLast = idx === effectiveOrder.length - 1;

          return (
            <div
              key={stepId}
              className={`flex items-start gap-4 px-5 py-4 transition-colors ${
                status === "running"
                  ? "bg-blue-50/60 dark:bg-blue-950/20"
                  : status === "done"
                  ? "bg-white dark:bg-zinc-900"
                  : "bg-zinc-50/50 dark:bg-zinc-900/50"
              } ${idx === 0 ? "rounded-t-lg" : ""} ${isLast ? "rounded-b-lg" : ""}`}
            >
              {/* Step icon */}
              <div className={`mt-0.5 flex-shrink-0 ${color}`}>
                <Icon className="h-5 w-5" />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-semibold ${
                      status === "pending"
                        ? "text-zinc-400 dark:text-zinc-500"
                        : "text-zinc-900 dark:text-zinc-100"
                    }`}
                  >
                    {label}
                  </span>
                  {status === "done" && step && (
                    <ElapsedBadge
                      startedAt={step.startedAt}
                      completedAt={step.completedAt}
                    />
                  )}
                </div>
                {status !== "pending" && (
                  <p
                    className={`mt-0.5 text-sm ${
                      status === "running"
                        ? "text-blue-600 dark:text-blue-400"
                        : status === "error"
                        ? "text-red-600 dark:text-red-400"
                        : "text-zinc-500 dark:text-zinc-400"
                    }`}
                  >
                    {step
                      ? (stepDescription(stepId, status, step.data) as string)
                      : ""}
                  </p>
                )}

                {/* Expanded entries list for vector_search */}
                {stepId === "vector_search" &&
                  status === "done" &&
                  step?.data.entries && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {(step.data.entries as Array<{ word: string; score: number }>).map((e) => (
                        <span
                          key={e.word}
                          className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                        >
                          {e.word}{" "}
                          <span className="text-zinc-400">
                            {(e.score * 100).toFixed(0)}%
                          </span>
                        </span>
                      ))}
                    </div>
                  )}
              </div>

              {/* Status icon */}
              <div className="mt-0.5 flex-shrink-0">
                <StatusIcon status={status} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
