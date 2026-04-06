"use client";

import { useState } from "react";
import AddressInput from "@/components/AddressInput";
import PipelineProgress from "@/components/PipelineProgress";

type View = "form" | "progress";

const FEATURES = [
  {
    icon: "🏙",
    title: "Location Analysis",
    desc: "Neighborhood context, transit access, nearby landmarks, and area characteristics.",
  },
  {
    icon: "📊",
    title: "Market Intelligence",
    desc: "Comparable properties, rental and sale price ranges, vacancy trends, and demand drivers.",
  },
  {
    icon: "🎯",
    title: "Investment Score",
    desc: "A 0-100 score with sub-scores across location, demographics, market, and risk profile.",
  },
];

export default function LandingHero() {
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

  if (view === "progress") {
    return (
      <div className="min-h-screen bg-light-gray flex items-center justify-center px-4">
        <PipelineProgress address={address} onReset={handleReset} />
      </div>
    );
  }

  return (
    <>
      {/* Hero section */}
      <section className="bg-navy dot-pattern py-20 px-4">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-accent-blue font-sans mb-3">
            AI-Powered CRE Analysis
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-sans leading-tight mb-4 max-w-3xl">
            Institutional-Grade Property Analysis in Minutes
          </h1>
          <p className="text-blue-200 max-w-xl text-center mb-8 text-base font-sans">
            Enter any commercial property address and get a full investment memo
            with location analysis, demographics, market comps, SWOT, and an
            investment score.
          </p>
          <AddressInput onSubmit={handleSubmit} />
          <p className="text-blue-300 text-xs mt-4 font-sans">
            Powered by Claude AI
          </p>
        </div>
      </section>

      {/* Feature cards section */}
      <section className="bg-white py-16 px-4">
        <h2 className="text-center text-navy font-bold text-xl font-sans mb-10">
          What&apos;s Inside Every Memo
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="bg-light-gray rounded-xl p-6 flex flex-col gap-3"
            >
              <span className="text-3xl">{feature.icon}</span>
              <p className="font-bold text-navy text-base font-sans">
                {feature.title}
              </p>
              <p className="text-gray-500 text-sm font-sans">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
