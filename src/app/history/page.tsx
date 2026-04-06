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
      createdAt: true,
    },
  });

  return (
    <main className="min-h-screen bg-light-gray px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold text-navy font-sans">
              Past Memos
            </h1>
            <p className="text-sm text-gray-400 font-sans mt-1">
              {memos.length} {memos.length === 1 ? "memo" : "memos"} generated
            </p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 bg-accent-blue text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-150 font-sans"
          >
            New Memo
          </Link>
        </div>

        <MemoHistoryList memos={memos} />
      </div>
    </main>
  );
}
