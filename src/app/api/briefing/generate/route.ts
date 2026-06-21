import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { generateBriefingForUser } from "@/lib/briefing";
import { createServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
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

    await generateBriefingForUser(user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Generate briefing error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate briefing" },
      { status: 500 },
    );
  }
}
