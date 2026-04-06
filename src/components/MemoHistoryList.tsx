import Link from "next/link";

interface MemoSummary {
  id: string;
  address: string;
  overallScore: number;
  createdAt: Date;
}

interface MemoHistoryListProps {
  memos: MemoSummary[];
}

function scoreBadge(score: number): string {
  if (score >= 80) return "bg-green-100 text-green-700";
  if (score >= 60) return "bg-blue-100 text-blue-700";
  if (score >= 40) return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
}

export default function MemoHistoryList({ memos }: MemoHistoryListProps) {
  if (memos.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 font-sans text-sm">
          No memos generated yet.{" "}
          <Link href="/" className="text-accent-blue hover:underline">
            Generate your first one.
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
      {memos.map((memo) => {
        const date = new Date(memo.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });

        return (
          <Link
            key={memo.id}
            href={`/memo/${memo.id}`}
            className="flex items-center justify-between px-6 py-4 hover:bg-light-gray transition-colors duration-100 group"
          >
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-sm font-medium text-navy font-sans truncate group-hover:text-accent-blue transition-colors">
                {memo.address}
              </span>
              <span className="text-xs text-gray-400 font-sans">{date}</span>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0 ml-4">
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full font-sans ${scoreBadge(memo.overallScore)}`}
              >
                {memo.overallScore}/100
              </span>
              <svg
                className="w-4 h-4 text-gray-300 group-hover:text-accent-blue transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
