"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSupabase } from "@/providers/SupabaseProvider";
import { AwplApiResponse, AwplQueryData } from "@/lib/api/awplBackend";
import { toast } from "sonner";
import { Database } from "@/utils/database.types";

type LeaderRow = Database["public"]["Tables"]["leaders"]["Row"];

export function useAwplSync() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();
  const [liveData, setLiveData] = useState<AwplQueryData | null>(null);

  const mutation = useMutation({
    mutationFn: async (leader: LeaderRow) => {
      if (!leader.awplid || !leader.awplpass) {
        throw new Error("Leader AWPL ID or password is missing. Please update in profile/settings.");
      }

      // Call our internal Next.js API route that securely calls the AWPL Bun backend
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

      const fetched = json.data;
      setLiveData(fetched);

      // Prepare Supabase update
      const updatePayload: Partial<LeaderRow> = {
        name: fetched.dashboard.name || leader.name,
        levelsao: fetched.dashboard.saoTeamSp ?? leader.levelsao,
        levelsgo: fetched.dashboard.sgoTeamSp ?? leader.levelsgo,
        rank: fetched.dashboard.currentLevelName || leader.rank,
        lastFetch: new Date().toISOString(),
        chequeData: fetched.payouts as unknown as LeaderRow["chequeData"],
        targetdata: fetched.bonanzaTargets as unknown as LeaderRow["targetdata"],
      };

      const { error: dbError } = await supabase
        .from("leaders")
        .update(updatePayload)
        .eq("id", leader.id);

      if (dbError) {
        console.warn("Could not save to Supabase, but live data fetched successfully:", dbError.message);
      }

      return fetched;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaders"] });
      toast.success("Synchronized with AWPL Portal successfully!");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to sync with AWPL");
    },
  });

  return {
    sync: mutation.mutate,
    isSyncing: mutation.isPending,
    liveData,
    setLiveData,
    error: mutation.error,
  };
}
