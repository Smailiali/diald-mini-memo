import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function stripCodeFences(text: string): string {
  return text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
}

async function attempt<T>(
  systemPrompt: string,
  userMessage: string
): Promise<T> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  const block = message.content[0];
  if (block.type !== "text") {
    throw new Error("Unexpected response type from Claude API");
  }

  const cleaned = stripCodeFences(block.text);
  return JSON.parse(cleaned) as T;
}

export async function callClaude<T>(
  systemPrompt: string,
  userMessage: string
): Promise<T> {
  try {
    return await attempt<T>(systemPrompt, userMessage);
  } catch {
    // One retry on failure
    return await attempt<T>(systemPrompt, userMessage);
  }
}
