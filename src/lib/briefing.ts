// Server-only — do not import in client components

import { generateBriefing, type BriefingData } from "@/lib/ai";
import { fetchCanvasData } from "@/lib/canvas";
import { fetchGoogleData } from "@/lib/google";
import { sendBriefing } from "@/lib/notifications";
import { createServerClient } from "@/lib/supabase";

interface IntegrationRow {
  id: string;
  provider: string;
  access_token: string | null;
  refresh_token: string | null;
  token_expiry: string | null;
  canvas_token: string | null;
  canvas_domain: string | null;
  is_active: boolean;
}

const EMPTY_CANVAS = {
  assignments: [] as BriefingData["assignments"],
  announcements: [] as BriefingData["announcements"],
};

async function getCanvasDataFromBriefings(
  userId: string,
): Promise<Pick<BriefingData, "assignments" | "announcements">> {
  const supabase = createServerClient();

  const { data: briefing, error } = await supabase
    .from("briefings")
    .select("raw_data")
    .eq("user_id", userId)
    .not("raw_data", "is", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !briefing?.raw_data) {
    if (error) {
      console.error("Failed to fetch Canvas raw_data from briefings:", error);
    }
    return EMPTY_CANVAS;
  }

  const raw = briefing.raw_data as Record<string, unknown>;

  return {
    assignments: Array.isArray(raw.assignments)
      ? (raw.assignments as BriefingData["assignments"])
      : [],
    announcements: Array.isArray(raw.announcements)
      ? (raw.announcements as BriefingData["announcements"])
      : [],
  };
}

export async function generateBriefingForUser(userId: string): Promise<void> {
  try {
    const supabase = createServerClient();

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, phone_number")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      console.error("Failed to fetch user for briefing:", userError);
      return;
    }

    const { data: integrations, error: integrationsError } = await supabase
      .from("integrations")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true);

    if (integrationsError) {
      console.error("Failed to fetch integrations for briefing:", integrationsError);
    }

    const activeIntegrations = (integrations ?? []) as IntegrationRow[];
    const canvasIntegration = activeIntegrations.find(
      (integration) => integration.provider === "canvas",
    );
    const googleIntegration = activeIntegrations.find(
      (integration) => integration.provider === "google",
    );

    const canvasDataPromise = canvasIntegration
      ? canvasIntegration.canvas_token === "cookie-based"
        ? getCanvasDataFromBriefings(userId)
        : fetchCanvasData({
            canvas_token: canvasIntegration.canvas_token,
            canvas_domain: canvasIntegration.canvas_domain,
          }).then((data) => ({
            assignments: data.assignments,
            announcements: data.announcements,
          }))
      : Promise.resolve(EMPTY_CANVAS);

    const [canvasData, googleData] = await Promise.all([
      canvasDataPromise,
      googleIntegration
        ? fetchGoogleData({
            id: googleIntegration.id,
            access_token: googleIntegration.access_token,
            refresh_token: googleIntegration.refresh_token,
            token_expiry: googleIntegration.token_expiry,
          })
        : Promise.resolve({ emails: [], events: [] }),
    ]);

    const data: BriefingData = {
      assignments: canvasData.assignments,
      announcements: canvasData.announcements,
      emails: googleData.emails,
      events: googleData.events,
    };

    let briefingText: string;

    try {
      briefingText = await generateBriefing(data);
    } catch (error) {
      console.error("Failed to generate briefing:", error);
      return;
    }

    const hasPhone = Boolean(user.phone_number?.trim());

    if (hasPhone) {
      await sendBriefing(user.phone_number!, briefingText);
    }

    const { error: insertError } = await supabase.from("briefings").insert({
      user_id: userId,
      content: briefingText,
      raw_data: data,
      sent_via_sms: hasPhone,
      sms_sent_at: hasPhone ? new Date().toISOString() : null,
    });

    if (insertError) {
      console.error("Failed to save briefing:", insertError);
    }
  } catch (error) {
    console.error("generateBriefingForUser failed:", error);
  }
}
