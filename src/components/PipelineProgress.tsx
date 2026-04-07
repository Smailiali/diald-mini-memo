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
      className="animate-spin w-4 h-4 text-white"
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
      className="w-4 h-4 text-white"
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

function InfoIcon() {
  return (
    <svg
      className="w-4 h-4 text-gray-400"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <circle cx="12" cy="12" r="10" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4M12 8h.01" />
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
    <div className="min-h-screen flex flex-col bg-light-gray">
      {/* Navy header banner */}
      <div className="bg-navy w-full py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs uppercase tracking-widest text-blue-300 font-sans mb-3">
            Analyzing Property
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-white font-sans">
            {address}
          </h2>
          <p className="text-sm text-blue-200 mt-2 font-sans">
            This usually takes 30-60 seconds
          </p>
          {/* Progress bar */}
          <div className="mt-6 h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent-blue rounded-full transition-all duration-500"
              style={{ width: `${(completedSteps.size / STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-2xl flex flex-col gap-4">
          {error ? (
            <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-6 text-center">
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
            <>
              {/* Steps card */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Card header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <span className="text-sm font-semibold text-navy font-sans">
                    Analysis Pipeline
                  </span>
                  <span className="text-sm text-gray-400 font-sans">
                    {completedSteps.size} of {STEPS.length} complete
                  </span>
                </div>

                {/* Steps list */}
                <div className="relative">
                  {/* Vertical connecting line */}
                  <div className="absolute left-[2.875rem] top-0 bottom-0 w-0.5 bg-gray-100 z-0" />

                  {STEPS.map((step) => {
                    const isComplete = completedSteps.has(step.key);
                    const isActive = !isComplete && step.key === activeStepKey;

                    return (
                      <div
                        key={step.key}
                        className="relative z-10 flex items-center gap-4 px-6 py-4"
                      >
                        {/* Step indicator */}
                        {isComplete ? (
                          <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 transition-all duration-300">
                            <CheckmarkIcon />
                          </div>
                        ) : isActive ? (
                          <div className="w-9 h-9 rounded-full bg-accent-blue flex items-center justify-center flex-shrink-0 animate-pulse">
                            <SpinnerIcon />
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center flex-shrink-0">
                            <div className="w-2 h-2 rounded-full bg-gray-300" />
                          </div>
                        )}

                        {/* Step label */}
                        <span
                          className={`flex-1 text-sm font-sans ${
                            isComplete
                              ? "text-gray-400 line-through"
                              : isActive
                              ? "font-semibold text-navy"
                              : "text-gray-400"
                          }`}
                        >
                          {step.label}
                        </span>

                        {/* Status badge */}
                        {isComplete && (
                          <span className="px-2.5 py-1 bg-green-50 text-green-600 text-xs font-medium rounded-full font-sans">
                            Done
                          </span>
                        )}
                        {isActive && (
                          <span className="px-2.5 py-1 bg-blue-50 text-accent-blue text-xs font-medium rounded-full font-sans flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse" />
                            In progress
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer note */}
              <div className="flex items-center justify-center gap-2 text-xs text-gray-400 font-sans">
                <InfoIcon />
                <span>Keep this tab open while the analysis runs</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Page footer */}
      <div className="py-6 text-center">
        <p className="text-xs text-gray-400 font-sans">
          Generated by AI. This is not financial advice.
        </p>
      </div>
    </div>
  );
}
