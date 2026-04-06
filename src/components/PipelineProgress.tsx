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

function SpinnerIcon() {
  return (
    <svg
      className="animate-spin h-4 w-4 text-accent-blue"
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

function CheckmarkIcon() {
  return (
    <svg
      className="h-4 w-4 text-green-600"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
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
    <div className="flex flex-col items-center gap-8 w-full max-w-lg">
      {/* Header */}
      <div className="text-center">
        <p className="text-xs uppercase tracking-widest text-gray-400 font-sans mb-1">
          Analyzing Property
        </p>
        <h2 className="text-2xl font-bold text-navy font-sans">{address}</h2>
        <p className="text-sm text-gray-400 mt-1 font-sans">
          This usually takes 30-60 seconds
        </p>
      </div>

      {error ? (
        <div className="w-full bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700 text-sm font-semibold font-sans mb-1">
            Something went wrong
          </p>
          <p className="text-red-600 text-sm font-sans">{error}</p>
          <button
            onClick={onReset}
            className="mt-4 text-sm text-accent-blue hover:underline font-sans"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="w-full bg-white rounded-xl border border-gray-200 overflow-hidden">
          {STEPS.map((step) => {
            const isComplete = completedSteps.has(step.key);
            const isActive = !isComplete && step.key === activeStepKey;
            const isPending = !isComplete && !isActive;

            return (
              <div
                key={step.key}
                className="flex items-center gap-4 px-6 py-4 border-b border-gray-50 last:border-0"
              >
                {/* Step indicator */}
                {isComplete ? (
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <CheckmarkIcon />
                  </div>
                ) : isActive ? (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <SpinnerIcon />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                  </div>
                )}

                {/* Step label */}
                <span
                  className={`text-sm font-medium font-sans flex-1 ${
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

                {/* Status badge */}
                {isComplete && (
                  <span className="text-xs text-green-600 font-medium font-sans">
                    Done
                  </span>
                )}
                {isActive && (
                  <span className="text-xs text-accent-blue font-medium font-sans">
                    In progress...
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!error && (
        <p className="text-xs text-gray-400 text-center font-sans">
          Keep this tab open while the analysis runs.
        </p>
      )}
    </div>
  );
}
