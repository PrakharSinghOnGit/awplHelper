"use client";

import React from "react";
import {
  IndianRupee,
  Award,
  Layers,
  Users,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCompactINR, formatINR } from "@/lib/api/awplBackend";

interface KpiMetricsGridProps {
  totalIncome: number;
  currentLevelName: string;
  currentLevelNumber?: number;
  nextLevelName?: string | null;
  saoSp: number;
  sgoSp: number;
  nextTargetSao: number;
  nextTargetSgo: number;
  memberCount: number;
}

export function KpiMetricsGrid({
  totalIncome,
  currentLevelName,
  currentLevelNumber,
  nextLevelName,
  saoSp,
  sgoSp,
  nextTargetSao,
  nextTargetSgo,
  memberCount,
}: KpiMetricsGridProps) {
  // SAO Progress
  const saoPercent = nextTargetSao > 0 ? Math.min((saoSp / nextTargetSao) * 100, 100) : 100;
  // SGO Progress
  const sgoPercent = nextTargetSgo > 0 ? Math.min((sgoSp / nextTargetSgo) * 100, 100) : 100;
  // Promotion Readiness
  const combinedPercent = Math.min(saoPercent, sgoPercent);

  // Combined Total SP
  const totalVolumeSp = saoSp + sgoSp;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {/* 1. Lifetime Earnings KPI */}
      <Card className="border bg-card/75 hover:shadow-lg transition-all rounded-2xl">
        <CardContent className="p-6 flex flex-col justify-between h-full space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Total Earnings
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <IndianRupee className="size-5" />
            </div>
          </div>

          <div>
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground inter">
              {formatCompactINR(totalIncome)}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 truncate" title={formatINR(totalIncome)}>
              Exact: {formatINR(totalIncome)}
            </p>
          </div>

          <div className="pt-3 border-t border-border/50 flex items-center justify-between text-xs sm:text-sm">
            <span className="text-muted-foreground">Cumulative Payout</span>
            <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-semibold">
              Verified
              <ArrowUpRight className="size-3.5 ml-0.5" />
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 2. Rank & Promotion Readiness */}
      <Card className="border bg-card/75 hover:shadow-lg transition-all rounded-2xl">
        <CardContent className="p-6 flex flex-col justify-between h-full space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Current Rank
            </span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Award className="size-5" />
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground logoFace">
                {currentLevelName}
              </h3>
              {currentLevelNumber ? (
                <span className="text-sm text-muted-foreground font-semibold">
                  (Lvl {currentLevelNumber})
                </span>
              ) : null}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 truncate">
              {nextLevelName ? `Next Goal: ${nextLevelName}` : "Top Rank Reached"}
            </p>
          </div>

          <div className="pt-3 border-t border-border/50 space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm font-medium">
              <span className="text-muted-foreground">Readiness</span>
              <span className="font-bold text-foreground">
                {combinedPercent.toFixed(1)}%
              </span>
            </div>
            <Progress
              value={combinedPercent}
              childClassName="bg-amber-500"
              className="h-2 rounded-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* 3. Total Team SP Production */}
      <Card className="border bg-card/75 hover:shadow-lg transition-all rounded-2xl">
        <CardContent className="p-6 flex flex-col justify-between h-full space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Total Sales Volume
            </span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Layers className="size-5" />
            </div>
          </div>

          <div>
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground inter">
              {totalVolumeSp >= 1000000
                ? `${(totalVolumeSp / 1000000).toFixed(2)}M`
                : totalVolumeSp.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Combined SAO + SGO Points
            </p>
          </div>

          <div className="pt-3 border-t border-border/50 flex items-center justify-between text-xs sm:text-sm">
            <span className="text-muted-foreground">Volume Balanced</span>
            <span className="font-mono font-semibold text-foreground">
              {totalVolumeSp.toLocaleString("en-IN", { maximumFractionDigits: 0 })} SP
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 4. Downline Team Network */}
      <Card className="border bg-card/75 hover:shadow-lg transition-all rounded-2xl">
        <CardContent className="p-6 flex flex-col justify-between h-full space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Monitored Network
            </span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Users className="size-5" />
            </div>
          </div>

          <div>
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground inter">
              {memberCount}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Active Downline Members
            </p>
          </div>

          <div className="pt-3 border-t border-border/50 flex items-center justify-between text-xs sm:text-sm">
            <span className="text-muted-foreground">Weekly Mining</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              Automated
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
