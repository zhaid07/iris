import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import OnboardingFlow from "@/components/OnboardingFlow";
import { createServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

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

  const supabase = createServerClient();

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id")
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

  return <OnboardingFlow irisUserId={user.id} />;
}
