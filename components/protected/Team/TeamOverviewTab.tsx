"use client";

import React, { useMemo } from "react";
import {
  Card,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  IndianRupee,
  Layers,
  Award,
  TrendingUp,
} from "lucide-react";
import { formatCompactINR, formatINR } from "@/lib/api/awplBackend";

interface MemberRecord {
  awplId: string;
  name: string;
  levelSao: number;
  levelSgo: number;
  totalIncome?: number;
  levelName?: string;
  status: string;
}

interface TeamOverviewTabProps {
  members: MemberRecord[];
  onGoToRoster?: () => void;
}

export function TeamOverviewTab({ members, onGoToRoster }: TeamOverviewTabProps) {
  const stats = useMemo(() => {
    let totalSao = 0;
    let totalSgo = 0;
    let totalEarnings = 0;
    let activeCount = 0;
    let attentionCount = 0;

    members.forEach((m) => {
      totalSao += m.levelSao || 0;
      totalSgo += m.levelSgo || 0;
      totalEarnings += m.totalIncome || 0;
      if (m.status === "ok") activeCount++;
      else if (m.status === "wrong") attentionCount++;
    });

    const totalVolume = totalSao + totalSgo;
    const avgVolume = members.length > 0 ? totalVolume / members.length : 0;

    return {
      totalSao,
      totalSgo,
      totalVolume,
      totalEarnings,
      activeCount,
      attentionCount,
      avgVolume,
    };
  }, [members]);

  // Top 5 performers
  const topMembers = useMemo(() => {
    return [...members]
      .sort((a, b) => (b.levelSao + b.levelSgo) - (a.levelSao + a.levelSgo))
      .slice(0, 5);
  }, [members]);

  if (members.length === 0) {
    return (
      <Card className="border bg-card/60 backdrop-blur-md rounded-3xl p-12 text-center w-full">
        <Users className="size-12 text-muted-foreground/40 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-foreground inter">
          No Members in this Team Yet
        </h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
          Add members to this team cohort to track their aggregated earnings, sales points, and level growth.
        </p>
        {onGoToRoster && (
          <button
            type="button"
            onClick={onGoToRoster}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all shadow-sm"
          >
            Go to Members Roster
          </button>
        )}
      </Card>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 w-full">
      {/* 1. Top Aggregated KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border bg-card/75 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Collective Earnings
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <IndianRupee className="size-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold inter text-foreground">
              {formatCompactINR(stats.totalEarnings)}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Exact: {formatINR(stats.totalEarnings)}
            </p>
          </div>
        </Card>

        <Card className="border bg-card/75 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Total Team SP
            </span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Layers className="size-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold inter text-foreground">
              {stats.totalVolume >= 1000000
                ? `${(stats.totalVolume / 1000000).toFixed(2)}M`
                : stats.totalVolume.toLocaleString("en-IN")}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 font-mono">
              Combined SAO + SGO Points
            </p>
          </div>
        </Card>

        <Card className="border bg-card/75 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Team Members
            </span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Users className="size-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold inter text-foreground">
              {members.length}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.activeCount} Active • {stats.attentionCount} Need Pass
            </p>
          </div>
        </Card>

        <Card className="border bg-card/75 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Avg Volume / Member
            </span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <TrendingUp className="size-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold inter text-foreground">
              {stats.avgVolume >= 1000
                ? `${(stats.avgVolume / 1000).toFixed(1)}k`
                : stats.avgVolume.toFixed(0)}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Sales Points Average
            </p>
          </div>
        </Card>
      </div>

      {/* 2. Team Production Breakdown: SAO vs SGO */}
      <Card className="border bg-card/75 backdrop-blur-md rounded-3xl p-6 sm:p-8">
        <div className="flex items-center justify-between pb-4">
          <div>
            <CardTitle className="text-xl font-bold inter">
              Team Leg Production Balance
            </CardTitle>
            <CardDescription className="text-sm mt-0.5">
              Cumulative sales generation across both organizational legs
            </CardDescription>
          </div>

          <Badge variant="outline" className="font-mono text-xs">
            Ratio: {stats.totalSgo > 0 ? (stats.totalSao / stats.totalSgo).toFixed(2) : "1.00"} : 1
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          <div className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] space-y-2">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Total SAO Points Generated
            </span>
            <p className="text-2xl sm:text-3xl font-extrabold font-mono text-foreground">
              {stats.totalSao.toLocaleString("en-IN")} SP
            </p>
            <Progress
              value={stats.totalVolume > 0 ? (stats.totalSao / stats.totalVolume) * 100 : 50}
              childClassName="bg-emerald-500"
              className="h-2"
            />
          </div>

          <div className="p-5 rounded-2xl border border-indigo-500/20 bg-indigo-500/[0.04] space-y-2">
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              Total SGO Points Generated
            </span>
            <p className="text-2xl sm:text-3xl font-extrabold font-mono text-foreground">
              {stats.totalSgo.toLocaleString("en-IN")} SP
            </p>
            <Progress
              value={stats.totalVolume > 0 ? (stats.totalSgo / stats.totalVolume) * 100 : 50}
              childClassName="bg-indigo-500"
              className="h-2"
            />
          </div>
        </div>
      </Card>

      {/* 3. Top Performers in this Team */}
      <Card className="border bg-card/75 backdrop-blur-md rounded-3xl p-6 sm:p-8">
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-2">
            <Award className="size-5 text-amber-500" />
            <CardTitle className="text-xl font-bold inter">
              Top Producers Leaderboard
            </CardTitle>
          </div>

          <span className="text-xs sm:text-sm text-muted-foreground">
            Ranked by total SP volume
          </span>
        </div>

        <div className="space-y-3">
          {topMembers.map((m, idx) => {
            const memberTotal = (m.levelSao || 0) + (m.levelSgo || 0);
            return (
              <div
                key={m.awplId}
                className="flex items-center justify-between p-4 rounded-2xl border bg-muted/20 hover:bg-muted/40 transition-colors gap-3"
              >
                <div className="flex items-center gap-3.5">
                  <span className={`size-8 rounded-full flex items-center justify-center font-bold text-xs ${
                    idx === 0
                      ? "bg-amber-500 text-white shadow-sm"
                      : idx === 1
                      ? "bg-slate-400 text-white"
                      : idx === 2
                      ? "bg-amber-700 text-white"
                      : "bg-muted text-muted-foreground border"
                  }`}>
                    {idx + 1}
                  </span>

                  <div>
                    <h5 className="font-bold text-sm sm:text-base text-foreground">
                      {m.name || "Distributor"}
                    </h5>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-mono">{m.awplId}</span>
                      <span>•</span>
                      <span>{m.levelName || "Member"}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-extrabold text-base sm:text-lg text-primary block">
                    {memberTotal.toLocaleString("en-IN")} SP
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {m.levelSao.toLocaleString()} SAO / {m.levelSgo.toLocaleString()} SGO
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
