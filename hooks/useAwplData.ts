"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSupabase } from "@/providers/SupabaseProvider";
import { AwplApiResponse, AwplQueryData } from "@/lib/api/awplBackend";
import { persistAwplDataToDatabase } from "@/lib/supabase/syncDatabase";
import { Database } from "@/utils/database.types";
import { toast } from "sonner";

type LeaderRow = Database["public"]["Tables"]["leaders"]["Row"];

export function useAwplData(leader: LeaderRow | null | undefined) {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  const cacheKey = leader?.id ? `awpl_cache_${leader.id}` : null;

  // Retrieve locally cached data so UI NEVER wipes on page navigation
  const getLocalCache = (): AwplQueryData | null => {
    if (typeof window === "undefined" || !cacheKey) return null;
    try {
      const raw = localStorage.getItem(cacheKey);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return null;
  };

  // Determine if automatic 6-hour refresh is due
  const lastSyncTime = leader?.lastFetch ? new Date(leader.lastFetch).getTime() : 0;
  const isOlderThan6Hours = Date.now() - lastSyncTime > 6 * 60 * 60 * 1000;

  const queryKey = ["awpl-portal-data", leader?.id, leader?.awplid];

  const {
    data: portalData,
    isLoading,
    isFetching,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: async (): Promise<AwplQueryData | null> => {
      if (!leader?.awplid || !leader?.awplpass) {
        // Return existing cached data if credentials not configured
        return getLocalCache();
      }

      const res = await fetch("/api/awpl/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dsCode: leader.awplid,
          pass: leader.awplpass,
        }),
      });

      const json: AwplApiResponse = await res.json();
      if (!res.ok || !json.success || !json.data) {
        const fallback = getLocalCache();
        if (fallback) return fallback;
        throw new Error(json.error || "Failed to fetch data from AWPL portal");
      }

      const freshData = json.data;

      // 1. Persist to localStorage for zero-flicker instant navigation
      if (typeof window !== "undefined" && cacheKey) {
        try {
          localStorage.setItem(cacheKey, JSON.stringify(freshData));
          localStorage.setItem(`${cacheKey}_time`, new Date().toISOString());
        } catch {
          // ignore
        }
      }

      // 2. Persist to relational database (distributors, payouts, weekly_sp, leaders)
      await persistAwplDataToDatabase(
        supabase,
        leader.id,
        leader.awplid,
        leader.awplpass,
        freshData
      );

      return freshData;
    },
    // Keep cached data fresh for 6 hours
    staleTime: 6 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    // Initialize immediately with local storage or Supabase data
    initialData: () => getLocalCache() ?? undefined,
    // Do NOT run query automatically by default; data is served directly from Supabase
    enabled: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Manual Trigger Mutation (Sync Live Data button)
  const syncMutation = useMutation({
    mutationFn: async () => {
      if (!leader?.awplid || !leader?.awplpass) {
        throw new Error("Missing AWPL ID or password. Please configure your credentials.");
      }

      const res = await fetch("/api/awpl/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dsCode: leader.awplid,
          pass: leader.awplpass,
        }),
      });

      const json: AwplApiResponse = await res.json();
      if (!res.ok || !json.success || !json.data) {
        throw new Error(json.error || "Failed to fetch live data from AWPL portal.");
      }

      const fresh = json.data;

      // Save to local storage
      if (typeof window !== "undefined" && cacheKey) {
        try {
          localStorage.setItem(cacheKey, JSON.stringify(fresh));
          localStorage.setItem(`${cacheKey}_time`, new Date().toISOString());
        } catch {
          // ignore
        }
      }

      // Save to relational database (server route /api/awpl/query also persists with service role)
      try {
        await persistAwplDataToDatabase(
          supabase,
          leader.id,
          leader.awplid,
          leader.awplpass,
          fresh
        );
      } catch (dbErr) {
        console.warn("Client persist skipped (handled by server route):", dbErr);
      }

      // Invalidate all relational Supabase queries so UI re-reads immediately
      queryClient.setQueryData(queryKey, fresh);
      queryClient.invalidateQueries({ queryKey: ["leaders"] });
      queryClient.invalidateQueries({ queryKey: ["distributors"] });
      queryClient.invalidateQueries({ queryKey: ["payouts"] });
      queryClient.invalidateQueries({ queryKey: ["weekly_sp"] });
      queryClient.invalidateQueries({ queryKey: ["bonanza_targets"] });
      queryClient.invalidateQueries({ queryKey: ["team_members"] });

      return fresh;
    },
    onSuccess: () => {
      toast.success("Synchronized with AWPL Portal successfully!");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to sync with AWPL");
    },
  });

  const isSyncing = syncMutation.isPending || (isFetching && !portalData);
  const syncError = (syncMutation.error as Error)?.message || (queryError as Error)?.message || null;

  return {
    data: portalData || getLocalCache(),
    isLoading,
    isSyncing,
    syncError,
    syncNow: () => syncMutation.mutate(),
    refetch,
  };
}
