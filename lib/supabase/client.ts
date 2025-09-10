import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/utils/database.types";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        // Configure persistent sessions
        storage:
          typeof window !== "undefined" ? window.localStorage : undefined,
        storageKey: "supabase.auth.token",
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: "pkce",
      },
    }
  );
}
