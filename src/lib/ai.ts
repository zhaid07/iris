// Server-only — do not import in client components

import Anthropic from "@anthropic-ai/sdk";

export interface BriefingData {
  assignments: Array<{
    name: string;
    due_at: string;
    points_possible: number;
    course_id: string;
  }>;
  announcements: Array<{
    title: string;
    message: string;
    posted_at: string;
  }>;
  emails: Array<{
    sender: string;
    subject: string;
    snippet: string;
    date: string;
  }>;
  events: Array<{
    title: string;
    start: string;
    end: string;
    description: string;
  }>;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const BRIEFING_SYSTEM_PROMPT =
  "You are Iris, a personal academic assistant. Generate a concise morning briefing in 3-5 sentences. No markdown. No bullet points. Plain english only. Lead with the single most urgent thing. Be specific about deadlines and times.";

const CHAT_SYSTEM_PROMPT =
  "You are Iris, a personal academic assistant. You only answer questions about this student's own assignments, emails, and calendar events provided in the context. If asked anything outside this scope, respond: I can only help with questions about your academic schedule and priorities. Do not answer general knowledge questions, write essays, or help with homework.";

function getAnthropicClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey || apiKey === "YOUR_VALUE_HERE") {
    throw new Error(`ANTHROPIC_API_KEY missing or invalid: "${apiKey}"`);
  }

  return new Anthropic({ apiKey });
}

function extractTextContent(
  content: Anthropic.Messages.Message["content"],
): string | null {
  const textBlock = content.find((block) => block.type === "text");
  return textBlock?.type === "text" ? textBlock.text : null;
}

export async function generateBriefing(data: BriefingData): Promise<string> {
  try {
    const client = getAnthropicClient();

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 512,
      system: BRIEFING_SYSTEM_PROMPT,
      messages: [{ role: "user", content: JSON.stringify(data) }],
    });

    const text = extractTextContent(response.content);

    if (!text) {
      throw new Error("Failed to generate briefing");
    }

    return text;
  } catch (error) {
    throw new Error(`Anthropic API error: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function generateChatResponse(
  messages: ChatMessage[],
  context: unknown,
): Promise<string> {
  try {
    const client = getAnthropicClient();

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: CHAT_SYSTEM_PROMPT,
      messages: [
        { role: "user", content: JSON.stringify(context) },
        ...messages.map((message) => ({
          role: message.role,
          content: message.content,
        })),
      ],
    });

    const text = extractTextContent(response.content);

    if (!text) {
      throw new Error("Failed to generate briefing");
    }

    return text;
  } catch (error) {
    throw new Error(`Anthropic API error: ${error instanceof Error ? error.message : String(error)}`);
  }
}
