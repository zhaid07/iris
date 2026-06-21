import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import OnboardingFlow from "@/components/OnboardingFlow";
import { createServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const supabase = createServerClient();

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id, onboarding_complete")
    .eq("clerk_id", userId)
    .single();

  if (userError || !user) {
    return (
      <main className="mx-auto max-w-lg p-8">
        <p className="text-gray-600">Account setup in progress. Please try again in a moment.</p>
      </main>
    );
  }

  if (user.onboarding_complete) {
    redirect("/dashboard");
  }

  const { data: integrations } = await supabase
    .from("integrations")
    .select("provider")
    .eq("user_id", user.id)
    .eq("is_active", true);

  const isGoogleConnected =
    integrations?.some((i) => i.provider === "google") ?? false;
  const isCanvasConnected =
    integrations?.some((i) => i.provider === "canvas") ?? false;
  const googleError = searchParams.error === "google_failed";

  return (
    <main className="mx-auto max-w-lg p-8">
      <OnboardingFlow
        isGoogleConnected={isGoogleConnected}
        isCanvasConnected={isCanvasConnected}
        googleError={googleError}
      />
    </main>
  );
}
