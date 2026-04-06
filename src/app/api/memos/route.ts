import { prisma } from "@/lib/prisma";

export async function GET(): Promise<Response> {
  const memos = await prisma.memo.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      address: true,
      overallScore: true,
      createdAt: true,
    },
  });

  return Response.json(memos);
}
