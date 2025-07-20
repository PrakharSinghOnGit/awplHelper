import { createBrowserClient } from "@supabase/ssr";

// Create a singleton instance of the Supabase client
const client = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Export a function that returns the singleton instance
export function createClient() {
  return client;
}
