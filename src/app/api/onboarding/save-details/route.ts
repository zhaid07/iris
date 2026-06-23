import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { createServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const ALLOWED_MAJORS = [
  "Engineering",
  "Business",
  "Sciences",
  "Arts",
  "Other",
];

const ALLOWED_STRESSORS = [
  "keeping_up_with_deadlines",
  "my_gpa",
  "balancing_everything",
  "the_future_honestly",
  "all_of_the_above",
];

const ALLOWED_TONES = ["nice", "friend", "unhinged"];

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

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
    const update: Record<string, unknown> = {};

    if (typeof body.displayName === "string" && body.displayName.trim()) {
      update.display_name = body.displayName.trim();
    }

    if (typeof body.major === "string" && ALLOWED_MAJORS.includes(body.major)) {
      update.major = body.major;
    }

    if (Array.isArray(body.onboardingStressors)) {
      const stressors = body.onboardingStressors.filter(
        (s: unknown): s is string =>
          typeof s === "string" && ALLOWED_STRESSORS.includes(s),
      );
      if (stressors.length > 0) {
        update.onboarding_stressors = stressors;
      }
    }

    if (typeof body.irisTone === "string" && ALLOWED_TONES.includes(body.irisTone)) {
      update.iris_tone = body.irisTone;
    }

    if (typeof body.contextBio === "string") {
      update.context_bio = body.contextBio.trim();
    }

    if ("fearContext" in body) {
      update.fear_context =
        typeof body.fearContext === "string" && body.fearContext.trim()
          ? body.fearContext.trim()
          : null;
    }

    if (typeof body.briefingTime === "string" && TIME_REGEX.test(body.briefingTime.trim())) {
      update.briefing_time = body.briefingTime.trim();
    }

    if (typeof body.phoneNumber === "string" && body.phoneNumber.trim()) {
      update.phone_number = body.phoneNumber.trim();
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid fields to save" },
        { status: 400 },
      );
    }

    const supabase = createServerClient();
    const { error } = await supabase
      .from("users")
      .update(update)
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
