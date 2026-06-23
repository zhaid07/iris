import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

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

    const clerk = await clerkClient();
    const clerkUser = await clerk.users.getUser(userId);

    await clerk.users.updateUser(userId, {
      publicMetadata: {
        ...clerkUser.publicMetadata,
        onboardingComplete: true,
      },
    });

    const supabase = createServerClient();
    const { error } = await supabase
      .from("users")
      .update({ onboarding_complete: true })
      .eq("clerk_id", userId);

    if (error) {
      console.error("Failed to update Supabase onboarding status:", error);
      return NextResponse.json(
        { success: false, error: "Failed to complete onboarding" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Complete onboarding error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to complete onboarding" },
      { status: 500 },
    );
  }
}
