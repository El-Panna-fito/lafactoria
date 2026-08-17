import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient as createSupabaseClient, SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./client";

export { SUPABASE_URL, SUPABASE_ANON_KEY };

export const createServerSupabaseClient = (
  cookieStore?: {
    getAll: () => { name: string; value: string }[];
    setAll: (cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) => void;
  }
): SupabaseClient => {
  if (cookieStore) {
    return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookieStore.setAll(cookiesToSet);
          } catch {
            // Can be ignored if handled by middleware
          }
        },
      },
    });
  }
  return createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);
};

export const createClient = createServerSupabaseClient;
