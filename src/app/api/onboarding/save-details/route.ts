import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { createServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const ALLOWED_BRIEFING_TIMES = ["06:00", "07:00", "08:00", "09:00", "10:00"];

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
    const phoneNumber =
      typeof body.phoneNumber === "string" ? body.phoneNumber.trim() : "";
    const briefingTime =
      typeof body.briefingTime === "string" ? body.briefingTime.trim() : "";

    if (!phoneNumber) {
      return NextResponse.json(
        { success: false, error: "Phone number is required" },
        { status: 400 },
      );
    }

    if (!ALLOWED_BRIEFING_TIMES.includes(briefingTime)) {
      return NextResponse.json(
        { success: false, error: "Invalid briefing time" },
        { status: 400 },
      );
    }

    const supabase = createServerClient();
    const { error } = await supabase
      .from("users")
      .update({
        phone_number: phoneNumber,
        briefing_time: briefingTime,
        onboarding_complete: true,
      })
      .eq("clerk_id", userId);

    if (error) {
      console.error("Failed to save onboarding details:", error);
      return NextResponse.json(
        { success: false, error: "Failed to save details" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Save onboarding details error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save details" },
      { status: 500 },
    );
  }
}
