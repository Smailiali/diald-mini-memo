"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const STEPS = [
  { key: "location", label: "Analyzing Location" },
  { key: "demographic", label: "Evaluating Demographics" },
  { key: "market", label: "Assessing Market" },
  { key: "swot", label: "Identifying Risks" },
  { key: "score", label: "Generating Score" },
] as const;

type StepKey = (typeof STEPS)[number]["key"];

interface PipelineProgressProps {
  address: string;
  onReset: () => void;
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-5 w-5 text-accent-blue"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      />
    </svg>
  );
}

function Checkmark() {
  return (
    <svg
      className="h-5 w-5 text-green-500"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function PipelineProgress({
  address,
  onReset,
}: PipelineProgressProps) {
  const router = useRouter();
  const [completedSteps, setCompletedSteps] = useState<Set<StepKey>>(
    new Set()
  );
  const [error, setError] = useState<string | null>(null);

  const activeStepKey =
    STEPS.find((s) => !completedSteps.has(s.key))?.key ?? null;

  useEffect(() => {
    let cancelled = false;

    async function run() {
      let response: Response;
      try {
        response = await fetch("/api/memo/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address }),
        });
      } catch {
        if (!cancelled) setError("Failed to connect to the server.");
        return;
      }

      if (!response.body) {
        if (!cancelled) setError("No response stream received.");
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done || cancelled) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const event = JSON.parse(line.slice(6)) as {
              step: string;
              data?: unknown;
              memoId?: string;
              error?: string;
            };

            if (event.step === "error") {
              if (!cancelled) setError(event.error ?? "An error occurred.");
              return;
            }

            if (event.step === "complete" && event.memoId) {
              if (!cancelled) router.push(`/memo/${event.memoId}`);
              return;
            }

            const matched = STEPS.find((s) => s.key === event.step);
            if (matched) {
              if (!cancelled)
                setCompletedSteps((prev) => new Set(Array.from(prev).concat(matched.key)));
            }
          } catch {
            // skip malformed event lines
          }
        }
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [address, router]);

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-md">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-navy font-sans">
          Generating Memo
        </h2>
        <p className="mt-1 text-gray-500 text-sm truncate max-w-sm">
          {address}
        </p>
      </div>

      {error ? (
        <div className="w-full bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-700 text-sm font-medium">Error</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <button
            onClick={onReset}
            className="mt-3 text-sm text-accent-blue hover:underline"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="w-full bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {STEPS.map((step) => {
            const isComplete = completedSteps.has(step.key);
            const isActive = !isComplete && step.key === activeStepKey;
            const isPending = !isComplete && !isActive;

            return (
              <div
                key={step.key}
                className="flex items-center gap-4 px-5 py-4"
              >
                <div className="w-6 flex items-center justify-center flex-shrink-0">
                  {isComplete ? (
                    <Checkmark />
                  ) : isActive ? (
                    <Spinner />
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-gray-300" />
                  )}
                </div>
                <span
                  className={`text-sm font-medium ${
                    isComplete
                      ? "text-gray-400 line-through"
                      : isActive
                      ? "text-navy"
                      : isPending
                      ? "text-gray-400"
                      : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
                {isComplete && (
                  <span className="ml-auto text-xs text-green-500 font-medium">
                    Done
                  </span>
                )}
                {isActive && (
                  <span className="ml-auto text-xs text-accent-blue font-medium">
                    In progress
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!error && (
        <p className="text-xs text-gray-400 text-center">
          This takes about 30 seconds. Please keep this tab open.
        </p>
      )}
    </div>
  );
}
