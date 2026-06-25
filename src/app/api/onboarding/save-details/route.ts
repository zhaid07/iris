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
  "deadlines",
  "my_gpa",
  "lsat_mcat_gre",
  "internship",
  "job_after_graduation",
  "career_choice",
  "grad_school",
  "research_experience",
  "financial_aid",
  "work_and_school",
  "burnout",
  "the_future",
];

function normalizeIrisTone(tone: string): string | null {
  if (tone === "friend" || tone === "nice") return "nice";
  if (tone === "unhinged") return "unhinged";
  return null;
}

const ALLOWED_EMAIL_PRIORITIES = [
  "professors_tas",
  "career_internships",
  "financial_aid",
  "advisor_registration",
  "clubs_orgs",
  "campus_deadlines",
];

const ALLOWED_CLASS_DAYS = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
];

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

    if (typeof body.irisTone === "string") {
      const tone = normalizeIrisTone(body.irisTone);
      if (tone) {
        update.iris_tone = tone;
      }
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

    if (Array.isArray(body.emailPriorities)) {
      const emailPriorities = body.emailPriorities.filter(
        (item: unknown): item is string =>
          typeof item === "string" && ALLOWED_EMAIL_PRIORITIES.includes(item),
      );
      if (emailPriorities.length > 0) {
        update.email_priorities = emailPriorities;
      }
    }

    if (typeof body.emailPrioritiesOther === "string") {
      update.email_priorities_other = body.emailPrioritiesOther.trim().slice(0, 100);
    }

    if (Array.isArray(body.classDays)) {
      const classDays = body.classDays.filter(
        (item: unknown): item is string =>
          typeof item === "string" && ALLOWED_CLASS_DAYS.includes(item),
      );
      update.class_days = classDays;
    }

    if (typeof body.scheduleContext === "string") {
      update.schedule_context = body.scheduleContext.trim().slice(0, 150);
    }

    if (typeof body.briefingEnabled === "boolean") {
      update.briefing_enabled = body.briefingEnabled;
    }

    if (typeof body.deadlineInterventions === "boolean") {
      update.deadline_interventions = body.deadlineInterventions;
    }

    if (typeof body.lowStakesReminders === "boolean") {
      update.low_stakes_reminders = body.lowStakesReminders;
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
