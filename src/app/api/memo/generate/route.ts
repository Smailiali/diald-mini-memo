import { runPipeline } from "@/lib/pipeline";
import { prisma } from "@/lib/prisma";
import type { PipelineStatus } from "@/types/memo";
import type { StepData } from "@/lib/pipeline";

function sseEvent(payload: Record<string, unknown>): string {
  return `data: ${JSON.stringify(payload)}\n\n`;
}

export async function POST(request: Request): Promise<Response> {
  const body = await request.json() as { address?: unknown };
  const address = typeof body.address === "string" ? body.address.trim() : "";

  if (!address) {
    return Response.json({ error: "Address is required" }, { status: 400 });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      function send(payload: Record<string, unknown>) {
        controller.enqueue(encoder.encode(sseEvent(payload)));
      }

      try {
        const onStepComplete = (step: PipelineStatus, data: StepData) => {
          send({ step, data });
        };

        const memoData = await runPipeline(address, onStepComplete);

        const saved = await prisma.memo.create({ data: memoData });

        send({ step: "complete", memoId: saved.id });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Pipeline failed";
        send({ step: "error", error: message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
