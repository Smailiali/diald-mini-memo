import Link from "next/link";

interface MemoSummary {
  id: string;
  address: string;
  overallScore: number;
  locationScore: number;
  demographicScore: number;
  marketScore: number;
  riskScore: number;
  createdAt: Date;
}

interface MemoHistoryListProps {
  memos: MemoSummary[];
}

function scoreRing(score: number): { border: string; text: string; bg: string; topBorder: string } {
  if (score >= 80) return { border: "border-green-400", text: "text-green-600", bg: "bg-green-50", topBorder: "border-t-green-400" };
  if (score >= 60) return { border: "border-blue-400", text: "text-blue-600", bg: "bg-blue-50", topBorder: "border-t-blue-400" };
  if (score >= 40) return { border: "border-amber-400", text: "text-amber-600", bg: "bg-amber-50", topBorder: "border-t-amber-400" };
  return { border: "border-red-400", text: "text-red-600", bg: "bg-red-50", topBorder: "border-t-red-400" };
}

function subScoreColor(score: number, max: number): string {
  const pct = (score / max) * 100;
  if (pct >= 80) return "bg-green-400";
  if (pct >= 60) return "bg-blue-400";
  if (pct >= 40) return "bg-amber-400";
  return "bg-red-400";
}

interface SubScoreMiniProps {
  label: string;
  score: number;
}

function SubScoreMini({ label, score }: SubScoreMiniProps) {
  const pct = (score / 25) * 100;
  const barColor = subScoreColor(score, 25);
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-400 font-sans">{label}</span>
        <span className="text-xs font-semibold text-gray-500 font-sans">{score}</span>
      </div>
      <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function MemoHistoryList({ memos }: MemoHistoryListProps) {
  if (memos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-6xl mb-5">🏢</p>
        <h2 className="font-bold text-navy text-xl font-sans mb-2">
          No memos yet
        </h2>
        <p className="text-gray-400 text-sm font-sans mb-6">
          Generate your first property analysis to see it here.
        </p>
        <Link
          href="/"
          className="px-5 py-2.5 bg-accent-blue text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors font-sans"
        >
          Generate a Memo
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {memos.map((memo) => {
        const colors = scoreRing(memo.overallScore);
        const date = new Date(memo.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });

        return (
          <Link
            key={memo.id}
            href={`/memo/${memo.id}`}
            className={`bg-white rounded-xl border border-gray-200 border-t-4 ${colors.topBorder} shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-150 flex flex-col overflow-hidden`}
          >
            {/* Card body */}
            <div className="p-5 flex flex-col gap-4 flex-1">
              {/* Score circle + address */}
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-full border-2 ${colors.border} ${colors.bg} flex flex-col items-center justify-center flex-shrink-0`}>
                  <span className={`text-lg font-bold leading-none ${colors.text}`}>
                    {memo.overallScore}
                  </span>
                  <span className="text-xs text-gray-400 leading-none mt-0.5">/100</span>
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <p className="text-sm font-semibold text-navy font-sans leading-snug">
                    {memo.address}
                  </p>
                </div>
              </div>

              {/* Sub-scores */}
              <div className="flex flex-col gap-2">
                <SubScoreMini label="Location" score={memo.locationScore} />
                <SubScoreMini label="Demographics" score={memo.demographicScore} />
                <SubScoreMini label="Market" score={memo.marketScore} />
                <SubScoreMini label="Risk" score={memo.riskScore} />
              </div>
            </div>

            {/* Card footer */}
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <span className="text-xs text-gray-400 font-sans">{date}</span>
              <span className="text-xs text-accent-blue font-medium font-sans">
                View memo →
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
