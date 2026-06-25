import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { generateChatResponse, getChatDailyLimitMessage, type ChatMessage } from "@/lib/ai";
import { createServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const EMPTY_RAW_DATA = {
  assignments: [],
  announcements: [],
  emails: [],
  events: [],
};

const DAILY_CHAT_LIMIT = 3;

function startOfUtcDay(): string {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  ).toISOString();
}

function getSourcesUsed(rawData: Record<string, unknown>): string[] {
  const sources: string[] = [];

  const assignments = Array.isArray(rawData.assignments)
    ? rawData.assignments
    : [];
  const announcements = Array.isArray(rawData.announcements)
    ? rawData.announcements
    : [];
  const emails = Array.isArray(rawData.emails) ? rawData.emails : [];
  const events = Array.isArray(rawData.events) ? rawData.events : [];

  if (assignments.length > 0 || announcements.length > 0) {
    sources.push("Canvas");
  }
  if (emails.length > 0) {
    sources.push("Gmail");
  }
  if (events.length > 0) {
    sources.push("Calendar");
  }

  return sources;
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!message) {
      return NextResponse.json(
        { success: false, error: "Message is required" },
        { status: 400 },
      );
    }

    const supabase = createServerClient();

    const { data: user, error: userError } = await supabase
      .from("users")
      .select(
        "id, display_name, major, onboarding_stressors, iris_tone, context_bio, fear_context",
      )
      .eq("clerk_id", userId)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    const { count: questionsToday, error: countError } = await supabase
      .from("chat_messages")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("role", "user")
      .gte("created_at", startOfUtcDay());

    if (countError) {
      console.error("Failed to count daily chat messages:", countError);
      return NextResponse.json(
        { success: false, error: "Failed to check chat limit" },
        { status: 500 },
      );
    }

    if ((questionsToday ?? 0) >= DAILY_CHAT_LIMIT) {
      const limitMessage = getChatDailyLimitMessage(user.iris_tone);
      return NextResponse.json({
        success: true,
        response: limitMessage,
        sourcesUsed: [],
        limitReached: true,
      });
    }

    const { data: briefing, error: briefingError } = await supabase
      .from("briefings")
      .select("content, raw_data")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (briefingError) {
      console.error("Failed to fetch latest briefing:", briefingError);
      return NextResponse.json(
        { success: false, error: "Failed to fetch context" },
        { status: 500 },
      );
    }

    const rawData =
      briefing && briefing.raw_data && typeof briefing.raw_data === "object"
        ? (briefing.raw_data as Record<string, unknown>)
        : EMPTY_RAW_DATA;
    const briefingContent =
      briefing && typeof briefing.content === "string" && briefing.content.trim()
        ? briefing.content
        : "No briefing generated yet. Use available context only.";

    const { data: recentMessages, error: messagesError } = await supabase
      .from("chat_messages")
      .select("role, content")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (messagesError) {
      console.error("Failed to fetch chat history:", messagesError);
      return NextResponse.json(
        { success: false, error: "Failed to fetch chat history" },
        { status: 500 },
      );
    }

    const history: ChatMessage[] = (recentMessages ?? [])
      .reverse()
      .filter(
        (msg): msg is ChatMessage =>
          (msg.role === "user" || msg.role === "assistant") &&
          typeof msg.content === "string",
      );

    let response: string;

    try {
      response = await generateChatResponse(
        [...history, { role: "user", content: message }],
        { briefing: briefingContent, rawData },
        {
          display_name: user.display_name,
          major: user.major,
          onboarding_stressors: Array.isArray(user.onboarding_stressors)
            ? (user.onboarding_stressors as string[])
            : null,
          iris_tone: user.iris_tone,
          context_bio: user.context_bio,
          fear_context: user.fear_context,
        },
      );
    } catch (error) {
      console.error("Failed to generate chat response:", error);
      return NextResponse.json(
        { success: false, error: "Failed to generate response" },
        { status: 500 },
      );
    }

    const { error: insertUserError } = await supabase
      .from("chat_messages")
      .insert({
        user_id: user.id,
        role: "user",
        content: message,
      });

    if (insertUserError) {
      console.error("Failed to save user message:", insertUserError);
      return NextResponse.json(
        { success: false, error: "Failed to save message" },
        { status: 500 },
      );
    }

    const { error: insertAssistantError } = await supabase
      .from("chat_messages")
      .insert({
        user_id: user.id,
        role: "assistant",
        content: response,
      });

    if (insertAssistantError) {
      console.error("Failed to save assistant message:", insertAssistantError);
      return NextResponse.json(
        { success: false, error: "Failed to save response" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      response,
      sourcesUsed: getSourcesUsed(rawData),
    });
  } catch (error) {
    console.error("Chat route error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process chat" },
      { status: 500 },
    );
  }
}
