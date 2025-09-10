import { createClient } from "@/lib/supabase/client";

/**
 * Initialize persistent authentication session
 * This ensures the user stays logged in across browser sessions
 * Works with hosted Supabase service
 */
export function initializeAuth() {
  if (typeof window === "undefined") return;

  const supabase = createClient();

  // Listen for auth state changes and handle session persistence
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === "SIGNED_IN" && session) {
      // Store additional session info for persistence
      localStorage.setItem("supabase.auth.persisted", "true");
      localStorage.setItem(
        "supabase.auth.last_activity",
        Date.now().toString()
      );
      console.log("User signed in, session persisted for hosted Supabase");
    } else if (event === "SIGNED_OUT") {
      // Clean up persisted session
      localStorage.removeItem("supabase.auth.persisted");
      localStorage.removeItem("supabase.auth.last_activity");
      console.log("User signed out, session cleared");
    } else if (event === "TOKEN_REFRESHED" && session) {
      // Update persisted session on token refresh
      localStorage.setItem("supabase.auth.persisted", "true");
      localStorage.setItem(
        "supabase.auth.last_activity",
        Date.now().toString()
      );
      console.log("Session token refreshed for hosted Supabase");
    }
  });

  // Set up automatic session refresh every 50 minutes (before 1-hour expiry)
  const refreshInterval = setInterval(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      await supabase.auth.refreshSession();
    }
  }, 50 * 60 * 1000); // 50 minutes

  // Clean up interval on page unload
  window.addEventListener("beforeunload", () => {
    clearInterval(refreshInterval);
  });

  // Attempt to restore session on app load
  return supabase.auth.getSession();
}

/**
 * Check if user has a persistent session
 */
export function hasPersistentSession(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("supabase.auth.persisted") === "true";
}

/**
 * Get last activity timestamp
 */
export function getLastActivity(): number | null {
  if (typeof window === "undefined") return null;
  const lastActivity = localStorage.getItem("supabase.auth.last_activity");
  return lastActivity ? parseInt(lastActivity, 10) : null;
}

/**
 * Manually refresh the session
 */
export async function refreshSession() {
  if (typeof window === "undefined") return null;

  const supabase = createClient();
  const { data, error } = await supabase.auth.refreshSession();

  if (error) {
    console.error("Failed to refresh session:", error);
    return null;
  }

  if (data.session) {
    localStorage.setItem("supabase.auth.last_activity", Date.now().toString());
  }

  return data;
}
