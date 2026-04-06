import Link from "next/link";
import type {
  MemoData,
  LocationChapter,
  DemographicChapter,
  MarketChapter,
  SwotChapter,
  ScoreChapter,
} from "@/types/memo";
import MemoScore from "@/components/MemoScore";
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

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Page header */}
      <div className="bg-navy rounded-2xl px-8 py-8 mb-6">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0 pr-4">
            <p className="text-xs uppercase tracking-widest text-blue-300 font-sans mb-2">
              Investment Memorandum
            </p>
            <h1 className="text-2xl font-bold text-white font-sans leading-snug">
              {memo.address}
            </h1>
            <p className="text-sm text-blue-200 font-sans mt-1">{date}</p>
          </div>
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-full border-2 border-white/30 bg-white/10 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-white leading-none">
                {memo.overallScore}
              </span>
              <span className="text-xs text-blue-200 leading-none mt-0.5">
                /100
              </span>
            </div>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-white/10 flex gap-4 flex-wrap">
          <PrintButton />
          <Link
            href="/"
            className="px-4 py-2 bg-accent-blue hover:bg-blue-700 text-white text-sm rounded-lg transition-colors font-sans"
          >
            Generate New Memo
          </Link>
        </div>
      </div>

      {/* Score card */}
      <MemoScore
        overallScore={memo.overallScore}
        locationScore={memo.locationScore}
        demographicScore={memo.demographicScore}
        marketScore={memo.marketScore}
        riskScore={memo.riskScore}
      />

      {/* Chapters card */}
      <div className="bg-white rounded-2xl border border-gray-200 px-8 py-6 mb-4">
        <ChapterSection
          title="Location Overview"
          data={locationChapter as unknown as Record<string, string | string[]>}
        />
        <ChapterSection
          title="Demographic Analysis"
          data={demographicChapter as unknown as Record<string, string | string[]>}
        />
        <ChapterSection
          title="Market Landscape"
          data={marketChapter as unknown as Record<string, string | string[]>}
        />
      </div>

      {/* SWOT card */}
      <div className="bg-white rounded-2xl border border-gray-200 px-8 py-6 mb-4">
        <SwotGrid swot={swotChapter} />
      </div>

      {/* Executive Summary card */}
      <div className="bg-white rounded-2xl border border-gray-200 px-8 py-6 mb-4">
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <div className="w-1 h-5 bg-accent-blue rounded-full flex-shrink-0" />
            <h2 className="text-base font-bold text-navy font-sans uppercase tracking-wide">
              Executive Summary
            </h2>
          </div>
          <div className="bg-blue-50 border-l-4 border-accent-blue rounded-r-lg p-5">
            <p className="font-serif text-gray-700 text-base leading-relaxed">
              {scoreChapter.executiveSummary}
            </p>
          </div>
        </section>

        <section className="mb-6">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <div className="w-1 h-5 bg-accent-blue rounded-full flex-shrink-0" />
            <h2 className="text-base font-bold text-navy font-sans uppercase tracking-wide">
              Key Takeaways
            </h2>
          </div>
          <ul className="list-disc list-inside font-serif text-gray-700 text-base leading-relaxed space-y-2">
            {scoreChapter.keyTakeaways.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <div className="w-1 h-5 bg-accent-blue rounded-full flex-shrink-0" />
            <h2 className="text-base font-bold text-navy font-sans uppercase tracking-wide">
              Recommendation
            </h2>
          </div>
          <p className="font-serif text-gray-700 text-base leading-relaxed">
            {scoreChapter.recommendation}
          </p>
        </section>
      </div>

      {/* Footer */}
      <div className="pt-2 pb-8 text-center">
        <p className="text-xs text-gray-400 font-sans">
          Generated by AI. This is not financial advice.
        </p>
      </div>
    </div>
  );
}
