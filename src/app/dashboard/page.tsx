import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import DashboardApp from "@/components/dashboard/DashboardApp";
import type { StressorId } from "@/components/onboarding/constants";
import { createServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const clerk = await clerkClient();
  const clerkUser = await clerk.users.getUser(userId);

  if (clerkUser.publicMetadata?.onboardingComplete !== true) {
    redirect("/onboarding");
  }

  const supabase = createServerClient();

  const { data: user, error: userError } = await supabase
    .from("users")
    .select(
      "id, display_name, major, onboarding_stressors, iris_tone, context_bio, fear_context, briefing_time, briefing_enabled, deadline_interventions, low_stakes_reminders",
    )
    .eq("clerk_id", userId)
    .single();

  if (userError || !user) {
    return (
      <main className="mx-auto max-w-lg p-8">
        <p className="text-gray-600">
          Account setup in progress. Please try again in a moment.
        </p>
      </main>
    );
  }

  const { data: briefing } = await supabase
    .from("briefings")
    .select("content, raw_data, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: integrations } = await supabase
    .from("integrations")
    .select("provider")
    .eq("user_id", user.id)
    .eq("is_active", true);

  const isGoogleConnected =
    integrations?.some((i) => i.provider === "google") ?? false;
  const isCanvasConnected =
    integrations?.some((i) => i.provider === "canvas") ?? false;
  const isGradescopeConnected =
    integrations?.some((i) => i.provider === "gradescope") ?? false;

  const stressors = Array.isArray(user.onboarding_stressors)
    ? (user.onboarding_stressors as StressorId[])
    : [];

  const displayName =
    user.display_name?.trim() ||
    clerkUser.firstName?.trim() ||
    clerkUser.username?.trim() ||
    "Student";

  const email =
    clerkUser.emailAddresses[0]?.emailAddress ??
    clerkUser.primaryEmailAddress?.emailAddress ??
    "";

  return (
    <DashboardApp
      displayName={displayName}
      email={email}
      major={user.major ?? ""}
      irisTone={user.iris_tone ?? "unhinged"}
      contextBio={user.context_bio ?? ""}
      fearContext={user.fear_context ?? ""}
      briefingTime={user.briefing_time ?? "09:00"}
      briefingEnabled={user.briefing_enabled ?? true}
      deadlineInterventions={user.deadline_interventions ?? true}
      lowStakesReminders={user.low_stakes_reminders ?? false}
      stressors={stressors}
      briefing={
        briefing
          ? {
              content: briefing.content,
              created_at: briefing.created_at,
              raw_data: briefing.raw_data,
            }
          : null
      }
      isGoogleConnected={isGoogleConnected}
      isCanvasConnected={isCanvasConnected}
      isGradescopeConnected={isGradescopeConnected}
      irisUserId={user.id}
    />
  );
}
