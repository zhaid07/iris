import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { createServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

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
    const connected = typeof body.connected === "boolean" ? body.connected : null;

    if (connected === null) {
      return NextResponse.json(
        { success: false, error: "connected must be a boolean" },
        { status: 400 },
      );
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

    const { data: existing, error: existingError } = await supabase
      .from("integrations")
      .select("id")
      .eq("user_id", user.id)
      .eq("provider", "gradescope")
      .maybeSingle();

    if (existingError) {
      console.error("Failed to fetch existing Gradescope integration:", existingError);
      return NextResponse.json(
        { success: false, error: "Failed to update Gradescope status" },
        { status: 500 },
      );
    }

    if (existing) {
      const { error: updateError } = await supabase
        .from("integrations")
        .update({ is_active: connected })
        .eq("id", existing.id);

      if (updateError) {
        console.error("Failed to update Gradescope integration:", updateError);
        return NextResponse.json(
          { success: false, error: "Failed to update Gradescope status" },
          { status: 500 },
        );
      }
    } else if (connected) {
      const { error: insertError } = await supabase.from("integrations").insert({
        user_id: user.id,
        provider: "gradescope",
        is_active: true,
      });

      if (insertError) {
        console.error("Failed to create Gradescope integration:", insertError);
        return NextResponse.json(
          { success: false, error: "Failed to update Gradescope status" },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({ success: true, connected });
  } catch (error) {
    console.error("Gradescope integration route error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update Gradescope status" },
      { status: 500 },
    );
  }
}
