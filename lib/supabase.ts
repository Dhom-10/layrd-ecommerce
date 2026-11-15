import { createClient, SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && key);

let browserClient: SupabaseClient | null = null;

/** One shared client in the browser so the login session is kept between pages. */
export function getSupabase(): SupabaseClient {
  if (!url || !key) throw new Error("Supabase is not configured. Add the keys to .env.local");
  if (typeof window === "undefined") {
    // On the server, make a fresh client per request (no session is stored there)
    return createClient(url, key, { auth: { persistSession: false } });
  }
  browserClient ??= createClient(url, key);
  return browserClient;
}
