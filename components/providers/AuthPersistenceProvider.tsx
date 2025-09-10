"use client";

import { useEffect } from "react";
import { initializeAuth } from "@/lib/supabase/auth-persistence";

export function AuthPersistenceProvider() {
  useEffect(() => {
    initializeAuth();
  }, []);

  return null; // This component doesn't render anything
}
