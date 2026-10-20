"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Compass,
  Plane,
  Gift,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { targetProp } from "../Team/type";

interface BonanzaAndTripsWidgetProps {
  targets?: targetProp | Record<string, unknown>[];
  trips?: Record<string, unknown>[];
}

export function BonanzaAndTripsWidget({
  targets = [],
  trips = [],
}: BonanzaAndTripsWidgetProps) {
  const hasTargets = targets && targets.length > 0;
  const hasTrips = trips && trips.length > 0;

  return (
    <Card className="border bg-card/60 backdrop-blur-sm flex flex-col justify-between">
      <CardHeader className="p-4 sm:p-5 pb-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Gift className="size-4" />
              </span>
              <CardTitle className="text-base sm:text-lg font-bold inter">
                Bonanza & Trips
              </CardTitle>
            </div>
            <CardDescription className="text-xs mt-0.5">
              Active promotional challenges & domestic/international tours
            </CardDescription>
          </div>

          <Badge
            variant="outline"
            className="text-[11px] font-medium border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/5 gap-1"
          >
            <Sparkles className="size-3" />
            Special
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 pt-0 space-y-3">
        {!hasTargets && !hasTrips ? (
          <div className="p-5 text-center rounded-xl border border-dashed border-border/60 bg-muted/20">
            <Plane className="size-6 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-xs font-semibold text-foreground">
              No Active Bonanza Target Open
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5 max-w-xs mx-auto">
              Seasonal qualifications (e.g. Winter Bonanza, Thailand, Dubai tours)
              will automatically appear when launched by AWPL.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Targets list */}
            {hasTargets &&
              targets.map((item, idx) => {
                const name =
                  (item as { name?: string }).name || `Bonanza Challenge ${idx + 1}`;
                const reqSAO = (item as { reqSAO?: number }).reqSAO || 0;
                const reqSGO = (item as { reqSGO?: number }).reqSGO || 0;
                const penSAO = (item as { penSAO?: number }).penSAO || 0;
                const penSGO = (item as { penSGO?: number }).penSGO || 0;

                const saoDone = Math.max(0, reqSAO - penSAO);
                const sgoDone = Math.max(0, reqSGO - penSGO);

                const saoPct = reqSAO > 0 ? Math.min((saoDone / reqSAO) * 100, 100) : 100;
                const sgoPct = reqSGO > 0 ? Math.min((sgoDone / reqSGO) * 100, 100) : 100;

                const isCompleted = penSAO === 0 && penSGO === 0;

                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-border/50 bg-background/50 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">
                        {name}
                      </span>
                      {isCompleted ? (
                        <Badge
                          variant="outline"
                          className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-[10px] gap-1"
                        >
                          <CheckCircle2 className="size-2.5" />
                          Achieved
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-[10px] text-muted-foreground gap-1"
                        >
                          <Clock className="size-2.5" />
                          In Progress
                        </Badge>
                      )}
                    </div>

                    {reqSAO > 0 && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                          <span>SAO Progress</span>
                          <span className="font-mono">
                            {saoDone.toLocaleString()} / {reqSAO.toLocaleString()} SP
                          </span>
                        </div>
                        <Progress
                          value={saoPct}
                          childClassName="bg-emerald-500"
                          className="h-1.5"
                        />
                      </div>
                    )}

                    {reqSGO > 0 && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                          <span>SGO Progress</span>
                          <span className="font-mono">
                            {sgoDone.toLocaleString()} / {reqSGO.toLocaleString()} SP
                          </span>
                        </div>
                        <Progress
                          value={sgoPct}
                          childClassName="bg-indigo-500"
                          className="h-1.5"
                        />
                      </div>
                    )}
                  </div>
                );
              })}

            {/* Trip Achievers */}
            {hasTrips && (
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                  Qualified Tours
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {trips.map((trip, i) => {
                    const destination =
                      (trip as { destination?: string; name?: string }).destination ||
                      (trip as { name?: string }).name ||
                      "International Trip";
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-2 p-2 rounded-lg border border-border/50 bg-background/40 text-xs"
                      >
                        <Compass className="size-3.5 text-blue-500 shrink-0" />
                        <span className="font-medium text-foreground truncate">
                          {destination}
                        </span>
                        <Badge
                          variant="outline"
                          className="ml-auto text-[10px] text-emerald-600 bg-emerald-500/10 border-emerald-500/30"
                        >
                          Achieved
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
