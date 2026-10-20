"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Gift,
  Plane,
  Compass,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { useProfile, useBonanzaTargets } from "@/hooks/useDatabase";

interface TargetDataProps {
  distributorId?: string;
}

export default function TargetData({ distributorId: propDistributorId }: TargetDataProps = {}) {
  const { data: leader } = useProfile();
  const effectiveId = propDistributorId || leader?.awplid;
  const { data: dbBonanza } = useBonanzaTargets(effectiveId);

  // Directly map from Supabase bonanza_targets table with legacy fallback
  const targets = useMemo(() => {
    if (dbBonanza && dbBonanza.length > 0) {
      return dbBonanza.map((b) => {
        const reqSAO = Number(b.req_sao || 0);
        const reqSGO = Number(b.req_sgo || 0);
        const saoDone = Number(b.achieved_sao || 0);
        const sgoDone = Number(b.achieved_sgo || 0);
        const penSAO = Math.max(0, reqSAO - saoDone);
        const penSGO = Math.max(0, reqSGO - sgoDone);

        return {
          name: b.name,
          reqSAO,
          reqSGO,
          penSAO,
          penSGO,
        };
      });
    }
    return (leader?.targetdata as unknown as Array<Record<string, unknown>>) || [];
  }, [dbBonanza, leader?.targetdata]);

  const trips: Array<Record<string, unknown>> = [];

  const hasTargets = Array.isArray(targets) && targets.length > 0;
  const hasTrips = Array.isArray(trips) && trips.length > 0;

  return (
    <div className="space-y-6 sm:space-y-8 w-full pb-12">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight inter">
            Bonanza & Trip Qualifications
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track seasonal company contests, cash bonanzas, and luxury international tour targets
          </p>
        </div>

        <Badge
          variant="outline"
          className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-sm font-semibold py-1.5 px-3.5 gap-2 self-start sm:self-auto"
        >
          <Gift className="size-4" />
          Promotional Rewards
        </Badge>
      </div>

      {/* 2. Content */}
      {!hasTargets && !hasTrips ? (
        <Card className="border bg-card/60 backdrop-blur-md rounded-3xl p-12 text-center">
          <div className="size-16 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4">
            <Plane className="size-8" />
          </div>
          <h3 className="text-xl font-bold text-foreground inter">
            No Active Bonanza Target Open
          </h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
            Seasonal company challenges (such as the Winter Bonanza, Thailand, Dubai, or Goa conventions) will automatically populate once launched on the official AWPL distributor portal.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Targets */}
          {hasTargets &&
            targets.map((item, idx) => {
              const name = (item.name as string) || `Bonanza Challenge ${idx + 1}`;
              const reqSAO = Number(item.reqSAO || 0);
              const reqSGO = Number(item.reqSGO || 0);
              const penSAO = Number(item.penSAO || 0);
              const penSGO = Number(item.penSGO || 0);

              const saoDone = Math.max(0, reqSAO - penSAO);
              const sgoDone = Math.max(0, reqSGO - penSGO);

              const saoPct = reqSAO > 0 ? Math.min((saoDone / reqSAO) * 100, 100) : 100;
              const sgoPct = reqSGO > 0 ? Math.min((sgoDone / reqSGO) * 100, 100) : 100;

              const isComplete = penSAO === 0 && penSGO === 0;

              return (
                <Card key={idx} className="border bg-card/75 rounded-3xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="size-5 text-amber-500" />
                      <h4 className="font-bold text-lg text-foreground">{name}</h4>
                    </div>
                    {isComplete ? (
                      <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30 text-xs font-bold gap-1">
                        <CheckCircle2 className="size-3" />
                        Qualified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs text-muted-foreground gap-1">
                        <Clock className="size-3" />
                        In Progress
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-3 pt-2">
                    {reqSAO > 0 && (
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between text-muted-foreground">
                          <span>SAO Leg Target</span>
                          <span className="font-mono font-semibold text-foreground">
                            {saoDone.toLocaleString()} / {reqSAO.toLocaleString()} SP ({saoPct.toFixed(0)}%)
                          </span>
                        </div>
                        <Progress value={saoPct} childClassName="bg-emerald-500" className="h-2" />
                      </div>
                    )}

                    {reqSGO > 0 && (
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between text-muted-foreground">
                          <span>SGO Leg Target</span>
                          <span className="font-mono font-semibold text-foreground">
                            {sgoDone.toLocaleString()} / {reqSGO.toLocaleString()} SP ({sgoPct.toFixed(0)}%)
                          </span>
                        </div>
                        <Progress value={sgoPct} childClassName="bg-indigo-500" className="h-2" />
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}

          {/* Qualified Trips */}
          {hasTrips && (
            <Card className="border bg-card/75 rounded-3xl p-6 space-y-4 col-span-full">
              <div className="flex items-center gap-2">
                <Compass className="size-5 text-blue-500" />
                <h4 className="font-bold text-lg text-foreground">Qualified Tour Delegations</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {trips.map((trip, i) => (
                  <div key={i} className="p-4 rounded-2xl border bg-muted/30 flex items-center justify-between">
                    <span className="font-semibold text-sm text-foreground">
                      {(trip.destination as string) || (trip.name as string) || "Tour Destination"}
                    </span>
                    <Badge variant="outline" className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30 text-xs">
                      Achieved
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
