import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { encrypt } from "@/lib/encryption";
import { createServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const FAILURE_REDIRECT = "/onboarding?error=google_failed";
const SUCCESS_REDIRECT = "/onboarding";

function redirectToFailure(req: NextRequest) {
  return NextResponse.redirect(new URL(FAILURE_REDIRECT, req.url));
}

function redirectToSuccess(req: NextRequest) {
  return NextResponse.redirect(new URL(SUCCESS_REDIRECT, req.url));
}

interface GoogleTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  error?: string;
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return redirectToFailure(req);
    }

    const { searchParams } = req.nextUrl;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const cookieStore = await cookies();
    const storedState = cookieStore.get("google_oauth_state")?.value;

    if (!code || !state || !storedState || state !== storedState) {
      return redirectToFailure(req);
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      return redirectToFailure(req);
    }

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokens = (await tokenResponse.json()) as GoogleTokenResponse;

    if (!tokenResponse.ok || !tokens.access_token) {
      console.error("Google token exchange failed:", tokens.error);
      return redirectToFailure(req);
    }

    const supabase = createServerClient();

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", userId)
      .single();

    if (userError || !user) {
      console.error("User lookup failed:", userError);
      return redirectToFailure(req);
    }

    const encryptedAccessToken = encrypt(tokens.access_token);
    const encryptedRefreshToken = tokens.refresh_token
      ? encrypt(tokens.refresh_token)
      : null;
    const tokenExpiry = new Date(
      Date.now() + tokens.expires_in * 1000,
    ).toISOString();

    const { data: existing } = await supabase
      .from("integrations")
      .select("id")
      .eq("user_id", user.id)
      .eq("provider", "google")
      .maybeSingle();

    if (existing) {
      const { error: updateError } = await supabase
        .from("integrations")
        .update({
          access_token: encryptedAccessToken,
          refresh_token: encryptedRefreshToken,
          token_expiry: tokenExpiry,
          is_active: true,
        })
        .eq("id", existing.id);

      if (updateError) {
        console.error("Integration update failed:", updateError);
        return redirectToFailure(req);
      }
    } else {
      const { error: insertError } = await supabase.from("integrations").insert({
        user_id: user.id,
        provider: "google",
        access_token: encryptedAccessToken,
        refresh_token: encryptedRefreshToken,
        token_expiry: tokenExpiry,
        is_active: true,
      });

      if (insertError) {
        console.error("Integration insert failed:", insertError);
        return redirectToFailure(req);
      }
    }

    const response = redirectToSuccess(req);
    response.cookies.delete("google_oauth_state");
    return response;
  } catch (error) {
    console.error("Google OAuth callback error:", error);
    return redirectToFailure(req);
  }
}
