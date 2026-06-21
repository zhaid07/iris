import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { encrypt } from "@/lib/encryption";
import { createServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function normalizeCanvasDomain(domain: string): string {
  return domain
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/+$/, "");
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
    const canvasToken =
      typeof body.canvasToken === "string" ? body.canvasToken.trim() : "";
    const canvasDomain =
      typeof body.canvasDomain === "string" ? body.canvasDomain.trim() : "";

    if (!canvasToken || !canvasDomain) {
      return NextResponse.json(
        { success: false, error: "Canvas token and domain are required" },
        { status: 400 },
      );
    }

    const normalizedDomain = normalizeCanvasDomain(canvasDomain);

    let canvasResponse: Response;

    try {
      canvasResponse = await fetch(
        `https://${normalizedDomain}/api/v1/courses?enrollment_state=active`,
        {
          headers: {
            Authorization: `Bearer ${canvasToken}`,
          },
        },
      );
    } catch {
      return NextResponse.json({
        success: false,
        error: "Invalid Canvas token or domain",
      });
    }

    if (!canvasResponse.ok) {
      return NextResponse.json({
        success: false,
        error: "Invalid Canvas token or domain",
      });
    }

    const supabase = createServerClient();

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", userId)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    const encryptedToken = encrypt(canvasToken);

    const { data: existing } = await supabase
      .from("integrations")
      .select("id")
      .eq("user_id", user.id)
      .eq("provider", "canvas")
      .maybeSingle();

    if (existing) {
      const { error: updateError } = await supabase
        .from("integrations")
        .update({
          canvas_token: encryptedToken,
          canvas_domain: normalizedDomain,
          is_active: true,
        })
        .eq("id", existing.id);

      if (updateError) {
        console.error("Canvas integration update failed:", updateError);
        return NextResponse.json(
          { success: false, error: "Failed to save Canvas connection" },
          { status: 500 },
        );
      }
    } else {
      const { error: insertError } = await supabase.from("integrations").insert({
        user_id: user.id,
        provider: "canvas",
        canvas_token: encryptedToken,
        canvas_domain: normalizedDomain,
        is_active: true,
      });

      if (insertError) {
        console.error("Canvas integration insert failed:", insertError);
        return NextResponse.json(
          { success: false, error: "Failed to save Canvas connection" },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Canvas connect error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save Canvas connection" },
      { status: 500 },
    );
  }
}
