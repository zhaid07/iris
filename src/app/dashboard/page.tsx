import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import DashboardContent from "@/components/DashboardContent";
import { createServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
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
        <p className="text-gray-600">
          Account setup in progress. Please try again in a moment.
        </p>
      </main>
    );
  }

  if (!user.onboarding_complete) {
    redirect("/onboarding");
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

  const { data: chatMessages } = await supabase
    .from("chat_messages")
    .select("role, content, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  const initialMessages = (chatMessages ?? [])
    .reverse()
    .filter(
      (msg) =>
        (msg.role === "user" || msg.role === "assistant") &&
        typeof msg.content === "string",
    )
    .map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }));

  return (
    <main className="mx-auto max-w-2xl p-8">
      <DashboardContent
        briefing={
          briefing
            ? {
                content: briefing.content,
                created_at: briefing.created_at,
              }
            : null
        }
        isGoogleConnected={isGoogleConnected}
        isCanvasConnected={isCanvasConnected}
        initialMessages={initialMessages}
        irisUserId={user.id}
      />
    </main>
  );
}
