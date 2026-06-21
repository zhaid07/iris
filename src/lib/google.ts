// Server-only — do not import in client components

import { decrypt, encrypt } from "@/lib/encryption";
import { createServerClient } from "@/lib/supabase";

export interface GoogleIntegration {
  id: string;
  access_token: string | null;
  refresh_token: string | null;
  token_expiry: string | null;
}

export interface GoogleEmail {
  sender: string;
  subject: string;
  snippet: string;
  date: string;
}

export interface GoogleEvent {
  title: string;
  start: string;
  end: string;
  description: string;
}

export interface GoogleData {
  emails: GoogleEmail[];
  events: GoogleEvent[];
}

const EMPTY_RESULT: GoogleData = {
  emails: [],
  events: [],
};

interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  error?: string;
}

interface GmailMessageListResponse {
  messages?: Array<{ id: string }>;
}

interface GmailHeader {
  name: string;
  value: string;
}

interface GmailMessageResponse {
  snippet?: string;
  payload?: {
    headers?: GmailHeader[];
  };
}

interface CalendarEventsResponse {
  items?: Array<{
    summary?: string;
    description?: string;
    start?: { dateTime?: string; date?: string };
    end?: { dateTime?: string; date?: string };
  }>;
}

function getHeader(headers: GmailHeader[] | undefined, name: string): string {
  return headers?.find((h) => h.name === name)?.value ?? "";
}

async function googleFetch(url: string, accessToken: string): Promise<Response> {
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

async function refreshAccessToken(
  integration: GoogleIntegration,
  refreshToken: string,
): Promise<string | null> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error("Google OAuth credentials not configured");
    return null;
  }

  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    const tokens = (await response.json()) as GoogleTokenResponse;

    if (!response.ok || !tokens.access_token) {
      console.error("Google token refresh failed");
      return null;
    }

    const supabase = createServerClient();
    const updatePayload: {
      access_token: string;
      token_expiry: string;
      refresh_token?: string;
    } = {
      access_token: encrypt(tokens.access_token),
      token_expiry: new Date(
        Date.now() + tokens.expires_in * 1000,
      ).toISOString(),
    };

    if (tokens.refresh_token) {
      updatePayload.refresh_token = encrypt(tokens.refresh_token);
    }

    const { error } = await supabase
      .from("integrations")
      .update(updatePayload)
      .eq("id", integration.id);

    if (error) {
      console.error("Failed to persist refreshed Google token");
    }

    return tokens.access_token;
  } catch {
    console.error("Google token refresh failed");
    return null;
  }
}

async function fetchEmails(accessToken: string): Promise<GoogleEmail[]> {
  try {
    const listResponse = await googleFetch(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages?q=is:unread+newer_than:2d&maxResults=20",
      accessToken,
    );

    if (!listResponse.ok) {
      console.error("Gmail list fetch failed");
      return [];
    }

    const listData = (await listResponse.json()) as GmailMessageListResponse;
    const messageIds = listData.messages?.slice(0, 20) ?? [];

    if (messageIds.length === 0) {
      return [];
    }

    const emails = await Promise.all(
      messageIds.map(async ({ id }) => {
        try {
          const messageResponse = await googleFetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date`,
            accessToken,
          );

          if (!messageResponse.ok) {
            return null;
          }

          const message =
            (await messageResponse.json()) as GmailMessageResponse;
          const headers = message.payload?.headers;

          return {
            sender: getHeader(headers, "From"),
            subject: getHeader(headers, "Subject"),
            snippet: (message.snippet ?? "").slice(0, 200),
            date: getHeader(headers, "Date"),
          };
        } catch {
          return null;
        }
      }),
    );

    return emails.filter((email): email is GoogleEmail => email !== null);
  } catch {
    console.error("Gmail fetch failed");
    return [];
  }
}

async function fetchEvents(accessToken: string): Promise<GoogleEvent[]> {
  try {
    const now = new Date();
    const sevenDaysFromNow = new Date(
      now.getTime() + 7 * 24 * 60 * 60 * 1000,
    );

    const params = new URLSearchParams({
      timeMin: now.toISOString(),
      timeMax: sevenDaysFromNow.toISOString(),
      singleEvents: "true",
      orderBy: "startTime",
      maxResults: "50",
    });

    const response = await googleFetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params.toString()}`,
      accessToken,
    );

    if (!response.ok) {
      console.error("Google Calendar fetch failed");
      return [];
    }

    const data = (await response.json()) as CalendarEventsResponse;

    return (data.items ?? []).map((event) => ({
      title: event.summary ?? "",
      start: event.start?.dateTime ?? event.start?.date ?? "",
      end: event.end?.dateTime ?? event.end?.date ?? "",
      description: (event.description ?? "").slice(0, 100),
    }));
  } catch {
    console.error("Google Calendar fetch failed");
    return [];
  }
}

export async function fetchGoogleData(
  integration: GoogleIntegration,
): Promise<GoogleData> {
  if (
    !integration.access_token ||
    !integration.refresh_token ||
    !integration.token_expiry
  ) {
    return EMPTY_RESULT;
  }

  let accessToken: string;
  let refreshToken: string;

  try {
    accessToken = decrypt(integration.access_token);
    refreshToken = decrypt(integration.refresh_token);
  } catch {
    console.error("Google token decryption failed");
    return EMPTY_RESULT;
  }

  const expiry = new Date(integration.token_expiry).getTime();
  const needsRefresh = expiry <= Date.now() + 5 * 60 * 1000;

  if (needsRefresh) {
    const newToken = await refreshAccessToken(integration, refreshToken);
    if (!newToken) {
      return EMPTY_RESULT;
    }
    accessToken = newToken;
  }

  const [emails, events] = await Promise.all([
    fetchEmails(accessToken),
    fetchEvents(accessToken),
  ]);

  return { emails, events };
}
