"use client";

import { createClient } from "@/lib/supabase/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createContext, useContext, useState, useEffect } from "react";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { Database } from "@/utils/database.ty";

type TypedSupabaseClient = SupabaseClient<Database>;

// Create context for Supabase client
const SupabaseContext = createContext<TypedSupabaseClient | undefined>(
  undefined
);

export const SupabaseProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Create React Query client
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 60 * 1000,
            retry: 1,
            // Prevent refetching on window focus in development
            refetchOnWindowFocus: process.env.NODE_ENV === "production",
            // Prevent refetching on reconnect in development
            refetchOnReconnect: process.env.NODE_ENV === "production",
            // Prevent refetching on mount in development
            refetchOnMount:
              process.env.NODE_ENV === "production" ? true : false,
          },
          mutations: {
            retry: 1,
          },
        },
      })
  );

  // Create Supabase client
  const [supabase] = useState(() => createClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseContext.Provider value={supabase}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </SupabaseContext.Provider>
    </QueryClientProvider>
  );
};

// Hook to use Supabase client
export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  return context;
};

// Hook for auth user
export const useUser = () => {
  const supabase = useSupabase();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return { user, loading };
};
