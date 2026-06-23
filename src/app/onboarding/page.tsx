import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import OnboardingFlow from "@/components/OnboardingFlow";
import { createServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

async function ensureSupabaseUser(clerkId: string, email: string) {
  const supabase = createServerClient();

  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_id", clerkId)
    .maybeSingle();

  if (existing) {
    return existing;
  }

  const { data: created, error } = await supabase
    .from("users")
    .insert({ clerk_id: clerkId, email })
    .select("id")
    .single();

  if (error || !created) {
    return null;
  }

  return created;
}

export default async function OnboardingPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const clerk = await clerkClient();
  const clerkUser = await clerk.users.getUser(userId);

  if (clerkUser.publicMetadata?.onboardingComplete === true) {
    redirect("/dashboard");
  }

  const email = clerkUser.emailAddresses[0]?.emailAddress;

  if (!email) {
    return (
      <main className="mx-auto max-w-lg p-8">
        <p className="text-gray-600">
          Account setup in progress. Please try again in a moment.
        </p>
      </main>
    );
  }

  const user = await ensureSupabaseUser(userId, email);

  if (!user) {
    return (
      <main className="mx-auto max-w-lg p-8">
        <p className="text-gray-600">
          Account setup in progress. Please try again in a moment.
        </p>
      </main>
    );
  }

  const defaultName =
    clerkUser.firstName?.trim() ||
    clerkUser.username?.trim() ||
    "";

  return (
    <OnboardingFlow irisUserId={user.id} defaultName={defaultName} />
  );
}
