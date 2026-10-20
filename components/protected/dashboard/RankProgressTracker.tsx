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
  CheckCircle2,
  Clock,
  Sparkles,
  GitFork,
  TrendingUp,
} from "lucide-react";

interface RankProgressTrackerProps {
  currentLevelName: string;
  nextLevelName?: string | null;
  saoSp: number;
  sgoSp: number;
  targetSao: number;
  targetSgo: number;
}

export function RankProgressTracker({
  currentLevelName,
  nextLevelName = "Next Rank",
  saoSp,
  sgoSp,
  targetSao,
  targetSgo,
}: RankProgressTrackerProps) {
  const saoPercent = targetSao > 0 ? Math.min((saoSp / targetSao) * 100, 100) : 100;
  const sgoPercent = targetSgo > 0 ? Math.min((sgoSp / targetSgo) * 100, 100) : 100;

  const saoRemain = Math.max(0, targetSao - saoSp);
  const sgoRemain = Math.max(0, targetSgo - sgoSp);

  const isSaoDone = saoRemain === 0;
  const isSgoDone = sgoRemain === 0;

  // Leg Ratio
  const ratio = sgoSp > 0 ? (saoSp / sgoSp).toFixed(2) : "1.00";

  return (
    <Card className="border bg-card/75 backdrop-blur-md rounded-3xl p-2 sm:p-4">
      <CardHeader className="p-4 sm:p-6 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
                <Sparkles className="size-5" />
              </span>
              <CardTitle className="text-xl sm:text-2xl font-bold inter">
                Rank Promotion Milestone
              </CardTitle>
            </div>
            <CardDescription className="text-sm mt-1">
              Current Rank: <strong className="text-foreground">{currentLevelName}</strong> • Next Promotion Goal:{" "}
              <strong className="text-primary">{nextLevelName || "Peak Leadership"}</strong>
            </CardDescription>
          </div>

          <Badge
            variant="outline"
            className="text-sm font-mono font-medium bg-muted/60 px-3 py-1 gap-1.5 border self-start sm:self-auto"
          >
            <GitFork className="size-4 text-primary" />
            Leg Ratio: {ratio} : 1
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 pt-0 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SAO Leg Box */}
          <div className="p-6 rounded-2xl border-2 border-emerald-500/20 bg-emerald-500/[0.04] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="inline-block size-3 rounded-full bg-emerald-500 shadow-sm" />
                <span className="font-bold text-base sm:text-lg text-foreground">
                  SAO Organization (Left Leg)
                </span>
              </div>
              {isSaoDone ? (
                <Badge
                  variant="outline"
                  className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-xs font-semibold py-1 px-2.5 gap-1"
                >
                  <CheckCircle2 className="size-3.5" />
                  Target Met
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="bg-muted text-muted-foreground text-xs py-1 px-2.5 gap-1 font-medium"
                >
                  <Clock className="size-3.5" />
                  In Progress
                </Badge>
              )}
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs sm:text-sm text-muted-foreground block">Achieved Points</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-foreground font-mono">
                  {saoSp.toLocaleString("en-IN", { maximumFractionDigits: 1 })}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs sm:text-sm text-muted-foreground block">Required</span>
                <span className="text-lg sm:text-xl font-bold text-muted-foreground font-mono">
                  {targetSao.toLocaleString("en-IN")} SP
                </span>
              </div>
            </div>

            <Progress
              value={saoPercent}
              childClassName="bg-emerald-500"
              className="h-3 rounded-full bg-emerald-500/15"
            />

            <div className="flex items-center justify-between text-sm text-muted-foreground pt-1">
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {saoPercent.toFixed(1)}% Completed
              </span>
              <span className="font-semibold text-foreground">
                {isSaoDone
                  ? "Requirement Fulfilled"
                  : `Needs ${saoRemain.toLocaleString("en-IN")} SP`}
              </span>
            </div>
          </div>

          {/* SGO Leg Box */}
          <div className="p-6 rounded-2xl border-2 border-indigo-500/20 bg-indigo-500/[0.04] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="inline-block size-3 rounded-full bg-indigo-500 shadow-sm" />
                <span className="font-bold text-base sm:text-lg text-foreground">
                  SGO Organization (Right Leg)
                </span>
              </div>
              {isSgoDone ? (
                <Badge
                  variant="outline"
                  className="bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border-indigo-500/30 text-xs font-semibold py-1 px-2.5 gap-1"
                >
                  <CheckCircle2 className="size-3.5" />
                  Target Met
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="bg-muted text-muted-foreground text-xs py-1 px-2.5 gap-1 font-medium"
                >
                  <Clock className="size-3.5" />
                  In Progress
                </Badge>
              )}
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs sm:text-sm text-muted-foreground block">Achieved Points</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-foreground font-mono">
                  {sgoSp.toLocaleString("en-IN", { maximumFractionDigits: 1 })}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs sm:text-sm text-muted-foreground block">Required</span>
                <span className="text-lg sm:text-xl font-bold text-muted-foreground font-mono">
                  {targetSgo.toLocaleString("en-IN")} SP
                </span>
              </div>
            </div>

            <Progress
              value={sgoPercent}
              childClassName="bg-indigo-500"
              className="h-3 rounded-full bg-indigo-500/15"
            />

            <div className="flex items-center justify-between text-sm text-muted-foreground pt-1">
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                {sgoPercent.toFixed(1)}% Completed
              </span>
              <span className="font-semibold text-foreground">
                {isSgoDone
                  ? "Requirement Fulfilled"
                  : `Needs ${sgoRemain.toLocaleString("en-IN")} SP`}
              </span>
            </div>
          </div>
        </div>

        {/* Strategy notice */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border text-sm text-muted-foreground">
          <TrendingUp className="size-5 shrink-0 text-primary" />
          <p>
            {isSaoDone && isSgoDone
              ? "All qualification criteria reached! Portal will automatically reflect your rank promotion on next closing."
              : isSaoDone
              ? `SAO target reached! Direct your team focus towards SGO to complete the remaining ${sgoRemain.toLocaleString("en-IN")} SP.`
              : isSgoDone
              ? `SGO target reached! Direct your team focus towards SAO to complete the remaining ${saoRemain.toLocaleString("en-IN")} SP.`
              : `Both legs are active. Focus team sales on balancing SAO (${saoRemain.toLocaleString("en-IN")} SP needed) and SGO (${sgoRemain.toLocaleString("en-IN")} SP needed).`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
