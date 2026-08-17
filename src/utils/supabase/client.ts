import { createBrowserClient } from "@supabase/ssr";
import { createClient as createSupabaseClient, SupabaseClient } from "@supabase/supabase-js";

export const SUPABASE_URL =
  (typeof import.meta !== "undefined" && (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_SUPABASE_URL) ||
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  "https://oqxhyrzpxyhvuzubfasu.supabase.co";

export const SUPABASE_ANON_KEY =
  (typeof import.meta !== "undefined" && (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ||
  "sb_publishable_bBCitl6LpLdVAJyZzqmPdg_zgnEhKcS";

export const createClient = (): SupabaseClient => {
  try {
    return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch {
    return createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
};
