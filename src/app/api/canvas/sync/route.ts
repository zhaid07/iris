import { NextRequest, NextResponse } from "next/server";

import { generateBriefingForUser } from "@/lib/briefing";
import { createServerClient } from "@/lib/supabase";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-iris-secret",
};

export const dynamic = "force-dynamic";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isAuthorized(req: NextRequest): boolean {
  const extensionSecret = process.env.EXTENSION_SECRET;

  if (!extensionSecret || extensionSecret === "YOUR_VALUE_HERE") {
    return false;
  }

  return req.headers.get("x-iris-secret") === extensionSecret;
}

function normalizeCanvasDomain(domain: string): string {
  return domain
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/+$/, "");
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(req: NextRequest) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401, headers: CORS_HEADERS },
      );
    }

    const body = await req.json();
    const userId = typeof body.userId === "string" ? body.userId.trim() : "";
    const data = body.data;
    const canvasDomain =
      typeof body.canvasDomain === "string" ? body.canvasDomain.trim() : "";

    if (!userId || !UUID_REGEX.test(userId)) {
      return NextResponse.json(
        { success: false, error: "Invalid userId" },
        { status: 400, headers: CORS_HEADERS },
      );
    }

    if (!data || typeof data !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid data" },
        { status: 400, headers: CORS_HEADERS },
      );
    }

    const supabase = createServerClient();

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404, headers: CORS_HEADERS },
      );
    }

    const normalizedDomain = canvasDomain
      ? normalizeCanvasDomain(canvasDomain)
      : null;

    const { data: existing } = await supabase
      .from("integrations")
      .select("id")
      .eq("user_id", userId)
      .eq("provider", "canvas")
      .maybeSingle();

    if (existing) {
      const { error: updateError } = await supabase
        .from("integrations")
        .update({
          canvas_token: "cookie-based",
          ...(normalizedDomain ? { canvas_domain: normalizedDomain } : {}),
          is_active: true,
        })
        .eq("id", existing.id);

      if (updateError) {
        console.error("Canvas integration update failed:", updateError);
        return NextResponse.json(
          { success: false, error: "Failed to save Canvas integration" },
          { status: 500, headers: CORS_HEADERS },
        );
      }
    } else {
      const { error: insertError } = await supabase.from("integrations").insert({
        user_id: userId,
        provider: "canvas",
        canvas_token: "cookie-based",
        canvas_domain: normalizedDomain,
        is_active: true,
      });

      if (insertError) {
        console.error("Canvas integration insert failed:", insertError);
        return NextResponse.json(
          { success: false, error: "Failed to save Canvas integration" },
          { status: 500, headers: CORS_HEADERS },
        );
      }
    }

    const { error: briefingError } = await supabase.from("briefings").insert({
      user_id: userId,
      content: "pending",
      raw_data: data,
    });

    if (briefingError) {
      console.error("Failed to save pending briefing:", briefingError);
      return NextResponse.json(
        { success: false, error: "Failed to save Canvas data" },
        { status: 500, headers: CORS_HEADERS },
      );
    }

    await generateBriefingForUser(userId);

    return NextResponse.json({ success: true }, { headers: CORS_HEADERS });
  } catch (error) {
    console.error("Canvas sync error:", error);
    return NextResponse.json(
      { success: false, error: "Canvas sync failed" },
      { status: 500, headers: CORS_HEADERS },
    );
  }
}
