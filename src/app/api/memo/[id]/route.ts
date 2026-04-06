import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
): Promise<Response> {
  const memo = await prisma.memo.findUnique({
    where: { id: params.id },
  });

  if (!memo) {
    return Response.json({ error: "Memo not found" }, { status: 404 });
  }

  return Response.json(memo);
}
