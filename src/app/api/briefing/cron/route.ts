import { NextRequest, NextResponse } from "next/server";

import { generateBriefingForUser } from "@/lib/briefing";
import { createServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function isAuthorized(req: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || cronSecret === "YOUR_VALUE_HERE") {
    return false;
  }

  const headerSecret = req.headers.get("x-cron-secret");
  const authHeader = req.headers.get("authorization");

  if (headerSecret === cronSecret) {
    return true;
  }

  if (authHeader === `Bearer ${cronSecret}`) {
    return true;
  }

  return false;
}

function getBriefingHour(briefingTime: string): number | null {
  const hour = parseInt(briefingTime.split(":")[0], 10);
  return Number.isNaN(hour) ? null : hour;
}

export async function GET(req: NextRequest) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const supabase = createServerClient();
    const currentHour = new Date().getUTCHours();

    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, briefing_time, briefing_enabled")
      .eq("onboarding_complete", true);

    if (usersError) {
      console.error("Failed to fetch users for cron:", usersError);
      return NextResponse.json(
        { success: false, error: "Failed to fetch users" },
        { status: 500 },
      );
    }

    const matchingUsers = (users ?? []).filter((user) => {
      const hour = getBriefingHour(user.briefing_time ?? "");
      return hour === currentHour && user.briefing_enabled === true;
    });

    let processed = 0;

    for (const user of matchingUsers) {
      try {
        await generateBriefingForUser(user.id);
        processed++;
      } catch (error) {
        console.error("Cron briefing failed for user:", user.id, error);
      }
    }

    return NextResponse.json({ success: true, processed });
  } catch (error) {
    console.error("Cron route error:", error);
    return NextResponse.json(
      { success: false, error: "Cron job failed" },
      { status: 500 },
    );
  }
}
