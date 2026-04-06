"use client";

import { useState } from "react";
import Link from "next/link";
import AddressInput from "@/components/AddressInput";
import PipelineProgress from "@/components/PipelineProgress";

type View = "form" | "progress";

export default function HomePage() {
  const [view, setView] = useState<View>("form");
  const [address, setAddress] = useState("");

  function handleSubmit(submittedAddress: string) {
    setAddress(submittedAddress);
    setView("progress");
  }

  function handleReset() {
    setAddress("");
    setView("form");
  }

  return (
    <main className="min-h-screen bg-light-gray flex flex-col items-center justify-center px-4 py-16">
      {view === "form" ? (
        <div className="flex flex-col items-center gap-8 w-full">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-navy font-sans tracking-tight">
              Mini Memo
            </h1>
            <p className="mt-3 text-gray-500 text-base">
              AI-powered commercial real estate analysis in minutes
            </p>
          </div>

          <AddressInput onSubmit={handleSubmit} />

          <Link
            href="/history"
            className="text-sm text-accent-blue hover:underline"
          >
            View past memos
          </Link>
        </div>
      ) : (
        <PipelineProgress address={address} onReset={handleReset} />
      )}
    </main>
  );
}
