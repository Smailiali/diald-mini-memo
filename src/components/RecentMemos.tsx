import Link from "next/link";
import { prisma } from "@/lib/prisma";

function scoreBadge(score: number): string {
  if (score >= 80) return "bg-green-100 text-green-700";
  if (score >= 60) return "bg-blue-100 text-blue-700";
  if (score >= 40) return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
}

export default async function RecentMemos() {
  const memos = await prisma.memo.findMany({
    orderBy: { createdAt: "desc" },
    take: 3,
    select: {
      id: true,
      address: true,
      overallScore: true,
      createdAt: true,
    },
  });

  if (memos.length === 0) return null;

  return (
    <section className="bg-light-gray py-12 px-4">
      <h2 className="text-center text-navy font-bold text-xl font-sans mb-8">
        Recent Analyses
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
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
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow flex flex-col gap-2"
            >
              <div className="flex justify-between items-start gap-2">
                <p className="font-medium text-navy text-sm font-sans leading-snug truncate flex-1">
                  {memo.address}
                </p>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full font-sans flex-shrink-0 ${scoreBadge(memo.overallScore)}`}
                >
                  {memo.overallScore}/100
                </span>
              </div>
              <p className="text-xs text-gray-400 font-sans">{date}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
