import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import MemoDisplay from "@/components/MemoDisplay";
import type {
  LocationChapter,
  DemographicChapter,
  MarketChapter,
  SwotChapter,
  ScoreChapter,
} from "@/types/memo";

interface MemoPageProps {
  params: { id: string };
}

export default async function MemoPage({ params }: MemoPageProps) {
  const memo = await prisma.memo.findUnique({
    where: { id: params.id },
  });

  if (!memo) {
    notFound();
  }

  const locationChapter = JSON.parse(memo.locationChapter) as LocationChapter;
  const demographicChapter = JSON.parse(memo.demographicChapter) as DemographicChapter;
  const marketChapter = JSON.parse(memo.marketChapter) as MarketChapter;
  const swotChapter = JSON.parse(memo.swotChapter) as SwotChapter;
  const scoreChapter = JSON.parse(memo.scoreChapter) as ScoreChapter;

  return (
    <MemoDisplay
      memo={{ ...memo, createdAt: new Date(memo.createdAt) }}
      locationChapter={locationChapter}
      demographicChapter={demographicChapter}
      marketChapter={marketChapter}
      swotChapter={swotChapter}
      scoreChapter={scoreChapter}
    />
  );
}
