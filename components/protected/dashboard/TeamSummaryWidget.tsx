"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  UserCheck,
  AlertTriangle,
  ArrowRight,
  UserPlus,
} from "lucide-react";
import { useNavigation } from "@/providers/NavigationContext";
import { TeamMember } from "../Team/type";

interface TeamSummaryWidgetProps {
  memberCount: number;
  allowedCount?: number | null;
  teamList?: TeamMember[] | Record<string, unknown>[];
}

export function TeamSummaryWidget({
  memberCount,
  allowedCount = 50,
  teamList = [],
}: TeamSummaryWidgetProps) {
  const { setCurrentPage } = useNavigation();

  // Inspect member statuses if list exists
  const stats = React.useMemo(() => {
    if (!Array.isArray(teamList) || teamList.length === 0) {
      return {
        active: memberCount,
        attention: 0,
        pending: 0,
      };
    }

    let active = 0;
    let attention = 0;
    let pending = 0;

    teamList.forEach((m) => {
      const status = (m as { status?: string }).status;
      if (status === "ok") active++;
      else if (status === "wrong") attention++;
      else pending++;
    });

    return { active, attention, pending };
  }, [teamList, memberCount]);

  const maxAllowed = allowedCount || 50;
  const utilization = Math.min((memberCount / maxAllowed) * 100, 100);

  return (
    <Card className="border bg-card/60 backdrop-blur-sm flex flex-col justify-between">
      <CardHeader className="p-4 sm:p-5 pb-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Users className="size-4" />
              </span>
              <CardTitle className="text-base sm:text-lg font-bold inter">
                Downline Team Health
              </CardTitle>
            </div>
            <CardDescription className="text-xs mt-0.5">
              Active downline team members monitored by your account
            </CardDescription>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage("Team")}
            className="text-xs font-medium gap-1 text-primary hover:text-primary/80 hover:bg-primary/5 -mr-2"
          >
            <span>Team Roster</span>
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 pt-0 space-y-3">
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 rounded-xl border border-border/50 bg-background/50 flex flex-col justify-between">
            <span className="text-[11px] text-muted-foreground font-medium">Monitored</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-foreground font-mono">
                {memberCount}
              </span>
              <span className="text-xs text-muted-foreground">/ {maxAllowed}</span>
            </div>
            <span className="text-[10px] text-muted-foreground mt-0.5">
              {utilization.toFixed(0)}% capacity
            </span>
          </div>

          <div className="p-3 rounded-xl border border-border/50 bg-background/50 flex flex-col justify-between">
            <span className="text-[11px] text-muted-foreground font-medium">Synced Status</span>
            <div className="flex items-center gap-1.5 mt-1">
              <UserCheck className="size-5 text-emerald-500" />
              <span className="text-2xl font-bold text-foreground font-mono">
                {stats.active || memberCount}
              </span>
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
              Credentials Active
            </span>
          </div>
        </div>

        {stats.attention > 0 && (
          <div className="flex items-center gap-2 p-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-xs text-amber-700 dark:text-amber-400">
            <AlertTriangle className="size-4 shrink-0" />
            <span className="leading-tight">
              {stats.attention} member credentials need updating to continue weekly automated mining.
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 sm:p-5 pt-3 border-t border-border/40 mt-auto flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Weekly automated fetch active</span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setCurrentPage("Team")}
          className="text-xs gap-1.5 h-8 font-medium"
        >
          <UserPlus className="size-3.5" />
          Add Members
        </Button>
      </CardFooter>
    </Card>
  );
}
