import Link from "next/link";
import { prisma } from "@/lib/prisma";
import MemoHistoryList from "@/components/MemoHistoryList";

export default async function HistoryPage() {
  const memos = await prisma.memo.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      address: true,
      overallScore: true,
      locationScore: true,
      demographicScore: true,
      marketScore: true,
      riskScore: true,
      createdAt: true,
    },
  });

  return (
    <main className="min-h-screen bg-light-gray">
      {/* Hero header */}
      <div className="bg-navy">
        <div className="max-w-6xl mx-auto px-6 py-10 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-blue-300 font-sans mb-1">
              Analysis History
            </p>
            <h1 className="text-2xl font-bold text-white font-sans">
              Past Memos
            </h1>
            <p className="text-sm text-blue-200 font-sans mt-1">
              {memos.length} {memos.length === 1 ? "memo" : "memos"} generated
            </p>
          </div>
          <Link
            href="/"
            className="px-5 py-2.5 bg-accent-blue text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors font-sans flex-shrink-0"
          >
            New Memo
          </Link>
        </div>
      </div>

      {/* Card grid */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <MemoHistoryList memos={memos} />
      </div>
    </main>
  );
}
