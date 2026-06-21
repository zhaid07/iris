import { createClient } from "@supabase/supabase-js";

function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!url || url === "YOUR_VALUE_HERE") {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not configured");
  }

  return url;
}

export function createServerClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey || serviceRoleKey === "YOUR_VALUE_HERE") {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");
  }

  return createClient(getSupabaseUrl(), serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function createBrowserClient() {
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!anonKey || anonKey === "YOUR_VALUE_HERE") {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured");
  }

  return createClient(getSupabaseUrl(), anonKey);
}
