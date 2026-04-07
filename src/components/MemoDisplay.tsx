import Link from "next/link";
import type {
  MemoData,
  LocationChapter,
  DemographicChapter,
  MarketChapter,
  SwotChapter,
  ScoreChapter,
} from "@/types/memo";
import ChapterSection from "@/components/ChapterSection";
import SwotGrid from "@/components/SwotGrid";
import PrintButton from "@/components/PrintButton";

interface MemoDisplayProps {
  memo: MemoData;
  locationChapter: LocationChapter;
  demographicChapter: DemographicChapter;
  marketChapter: MarketChapter;
  swotChapter: SwotChapter;
  scoreChapter: ScoreChapter;
}

function subScoreColor(score: number): string {
  const pct = (score / 25) * 100;
  if (pct >= 80) return "#22c55e";
  if (pct >= 60) return "#3b82f6";
  if (pct >= 40) return "#f59e0b";
  return "#ef4444";
}

export default function MemoDisplay({
  memo,
  locationChapter,
  demographicChapter,
  marketChapter,
  swotChapter,
  scoreChapter,
}: MemoDisplayProps) {
  const date = new Date(memo.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const { overallScore } = memo;
  const circumference = 2 * Math.PI * 38;
  const offset = circumference - (overallScore / 100) * circumference;
  const ringColor =
    overallScore >= 80
      ? "#22c55e"
      : overallScore >= 60
      ? "#3b82f6"
      : overallScore >= 40
      ? "#f59e0b"
      : "#ef4444";

  const subScores = [
    { label: "Location", score: memo.locationScore },
    { label: "Demographics", score: memo.demographicScore },
    { label: "Market", score: memo.marketScore },
    { label: "Risk Profile", score: memo.riskScore },
  ];

  return (
    <div className="min-h-screen bg-light-gray">
      {/* Full-width navy header */}
      <div className="bg-navy">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="flex items-start justify-between gap-6">
            {/* Left: labels + address + date + buttons */}
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-widest text-blue-300 font-sans mb-2">
                Investment Memorandum
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-white font-sans leading-snug mb-1">
                {memo.address}
              </h1>
              <p className="text-sm text-blue-200 font-sans mb-6">{date}</p>
              <div className="flex gap-3 flex-wrap">
                <PrintButton />
                <Link
                  href="/"
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors font-sans"
                >
                  Generate New Memo
                </Link>
              </div>
            </div>

            {/* Right: large score ring */}
            <svg
              viewBox="0 0 100 100"
              className="w-28 h-28 flex-shrink-0"
              aria-label={`Overall score: ${overallScore} out of 100`}
            >
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#ffffff20"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke={ringColor}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={offset}
                transform="rotate(-90 50 50)"
              />
              <text
                x="50"
                y="46"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="20"
                fontWeight="bold"
                fill="#ffffff"
              >
                {overallScore}
              </text>
              <text
                x="50"
                y="62"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="9"
                fill="#bfdbfe"
              >
                /100
              </text>
            </svg>
          </div>
        </div>
      </div>

      {/* Sub-scores row */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {subScores.map(({ label, score }) => {
            const color = subScoreColor(score);
            return (
              <div key={label} className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-sans">
                  {label}
                </span>
                <div className="flex items-baseline gap-0.5">
                  <span
                    className="text-lg font-bold font-sans"
                    style={{ color }}
                  >
                    {score}
                  </span>
                  <span className="text-gray-300 text-sm font-sans">/25</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(score / 25) * 100}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col gap-6">
        {/* Location card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-5 border-b border-gray-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-navy flex items-center justify-center text-xs font-bold text-white font-sans">
              01
            </div>
            <h2 className="text-base font-bold text-navy font-sans uppercase tracking-wide">
              Location Overview
            </h2>
          </div>
          <div className="px-8 py-6">
            <ChapterSection
              data={locationChapter as unknown as Record<string, string | string[]>}
            />
          </div>
        </div>

        {/* Demographic card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-5 border-b border-gray-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-navy flex items-center justify-center text-xs font-bold text-white font-sans">
              02
            </div>
            <h2 className="text-base font-bold text-navy font-sans uppercase tracking-wide">
              Demographic Analysis
            </h2>
          </div>
          <div className="px-8 py-6">
            <ChapterSection
              data={demographicChapter as unknown as Record<string, string | string[]>}
            />
          </div>
        </div>

        {/* Market card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-5 border-b border-gray-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-navy flex items-center justify-center text-xs font-bold text-white font-sans">
              03
            </div>
            <h2 className="text-base font-bold text-navy font-sans uppercase tracking-wide">
              Market Landscape
            </h2>
          </div>
          <div className="px-8 py-6">
            <ChapterSection
              data={marketChapter as unknown as Record<string, string | string[]>}
            />
          </div>
        </div>

        {/* SWOT card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-5 border-b border-gray-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-navy flex items-center justify-center text-xs font-bold text-white font-sans">
              04
            </div>
            <h2 className="text-base font-bold text-navy font-sans uppercase tracking-wide">
              SWOT Analysis
            </h2>
          </div>
          <div className="px-8 py-6">
            <SwotGrid swot={swotChapter} />
          </div>
        </div>

        {/* Executive Summary card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-5 border-b border-gray-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-navy flex items-center justify-center text-xs font-bold text-white font-sans">
              05
            </div>
            <h2 className="text-base font-bold text-navy font-sans uppercase tracking-wide">
              Investment Assessment
            </h2>
          </div>
          <div className="px-8 py-6 flex flex-col gap-8">
            {/* Executive Summary */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-sans mb-3">
                Executive Summary
              </p>
              <div className="bg-blue-50 border-l-4 border-accent-blue rounded-r-xl p-5">
                <p className="font-serif text-gray-700 text-base leading-relaxed">
                  {scoreChapter.executiveSummary}
                </p>
              </div>
            </div>

            {/* Key Takeaways */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-sans mb-3">
                Key Takeaways
              </p>
              <div className="flex flex-col gap-2">
                {scoreChapter.keyTakeaways.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-blue mt-2 flex-shrink-0" />
                    <p className="font-serif text-gray-700 text-base leading-relaxed">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendation */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-sans mb-3">
                Recommendation
              </p>
              <p className="font-serif text-gray-700 text-base leading-relaxed">
                {scoreChapter.recommendation}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="max-w-4xl mx-auto px-6 py-8 text-center">
          <p className="text-xs text-gray-400 font-sans">
            Generated by AI. This is not financial advice.
          </p>
        </div>
      </div>
    </div>
  );
}
