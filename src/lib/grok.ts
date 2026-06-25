// Server-only — xAI Grok chat completions (OpenAI-compatible API)

const XAI_API_URL = "https://api.x.ai/v1/chat/completions";

export type GrokRole = "system" | "user" | "assistant";

export interface GrokMessage {
  role: GrokRole;
  content: string;
}

function resolveGrokApiKey(): string {
  const apiKey = process.env.GROK_API_KEY ?? process.env.XAI_API_KEY;

  if (!apiKey || apiKey === "YOUR_VALUE_HERE") {
    throw new Error("GROK_API_KEY missing or invalid");
  }

  return apiKey;
}

export function getGrokModel(variant: "default" | "fast" = "default"): string {
  if (process.env.GROK_MODEL) {
    return process.env.GROK_MODEL;
  }

  return variant === "fast" ? "grok-3-fast" : "grok-4-1-fast-non-reasoning";
}

export async function grokChatCompletion(options: {
  system?: string;
  messages: GrokMessage[];
  maxTokens?: number;
  model?: string;
}): Promise<string> {
  const apiKey = resolveGrokApiKey();
  const messages: GrokMessage[] = options.system
    ? [
        { role: "system", content: options.system },
        ...options.messages.filter((message) => message.role !== "system"),
      ]
    : options.messages;

  const response = await fetch(XAI_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: options.model ?? getGrokModel(),
      messages,
      max_tokens: options.maxTokens ?? 1024,
      temperature: 0.4,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Grok API error (${response.status}): ${errorBody}`);
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string | null } }>;
  };

  const text = payload.choices?.[0]?.message?.content?.trim();

  if (!text) {
    throw new Error("Grok API returned an empty response");
  }

  return text;
}
