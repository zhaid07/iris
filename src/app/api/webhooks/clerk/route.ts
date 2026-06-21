import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest, NextResponse } from "next/server";

import { createServerClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  let event;

  try {
    event = await verifyWebhook(req, {
      signingSecret: process.env.CLERK_WEBHOOK_SECRET,
    });
  } catch (error) {
    console.error("Clerk webhook verification failed:", error);
    return NextResponse.json(
      { success: false, error: "Webhook verification failed" },
      { status: 400 },
    );
  }

  if (event.type === "user.created") {
    const email = event.data.email_addresses[0]?.email_address;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "No email address found for user" },
        { status: 400 },
      );
    }

    const supabase = createServerClient();
    const { error } = await supabase.from("users").insert({
      clerk_id: event.data.id,
      email,
    });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ success: true });
      }

      console.error("Failed to insert user:", error);
      return NextResponse.json(
        { success: false, error: "Failed to create user" },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ success: true });
}
