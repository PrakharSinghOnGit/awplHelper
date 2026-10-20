"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  RefreshCw,
  Crown,
  Users,
  Calendar,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const levelImageMap: Record<string, string> = {
  Fresher: "/Bronze.png",
  Bronze: "/Bronze.png",
  Silver: "/Silver.png",
  Gold: "/Gold.png",
  Platinum: "/Gold.png",
  Emerald: "/Master.png",
  Topaz: "/Master.png",
  "Ruby Star": "/Royal0.png",
  Sapphire: "/Royal0.png",
  "Star Sapphire": "/Royal0.png",
  Diamond: "/Diamond.png",
  "Blue Diamond": "/Diamond.png",
  "Black Diamond": "/Diamond.png",
  "Royal Diamond": "/Diamond.png",
  "Crown Diamond": "/Diamond.png",
  Ambassador: "/Royal.png",
  "Royal Ambassador": "/Royal.png",
  "Crown Ambassador": "/Royal.png",
  "Brand Ambassador": "/Royal.png",
  "Chief Brand Ambassador": "/Royal.png",
  "Global Brand Ambassador": "/Royal.png",
};

interface DashboardHeaderProps {
  name: string;
  dsCode?: string;
  rank: string;
  levelNumber?: number;
  isPaid: boolean;
  memberCount: number;
  weeksLeft: number;
  lastSync?: string | null;
  onSync?: () => void;
  isSyncing?: boolean;
}

export function DashboardHeader({
  name,
  dsCode,
  rank,
  levelNumber,
  isPaid,
  memberCount,
  weeksLeft,
  lastSync,
  onSync,
  isSyncing = false,
}: DashboardHeaderProps) {
  const [copied, setCopied] = useState(false);

  const copyDsCode = () => {
    if (!dsCode) return;
    navigator.clipboard.writeText(dsCode);
    setCopied(true);
    toast.success(`Copied DS Code: ${dsCode}`);
    setTimeout(() => setCopied(false), 2000);
  };

  const minutesSinceSync = React.useMemo(() => {
    if (!lastSync) return 999;
    try {
      const diffMs = Date.now() - new Date(lastSync).getTime();
      return Math.floor(diffMs / (1000 * 60));
    } catch {
      return 999;
    }
  }, [lastSync]);

  const isCooldown = minutesSinceSync < 30;
  const cooldownMinutesLeft = Math.max(1, 30 - minutesSinceSync);

  const formattedLastSync = React.useMemo(() => {
    if (!lastSync) return "Not synced recently";
    try {
      const date = new Date(lastSync);
      const isToday = new Date().toDateString() === date.toDateString();
      if (isToday) {
        return `Today at ${date.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        })}`;
      }
      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return lastSync;
    }
  }, [lastSync]);

  const insigniaImg = levelImageMap[rank] || "/Bronze.png";

  return (
    <div className="relative overflow-hidden rounded-3xl border bg-card/70 backdrop-blur-md p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between relative z-10">
        {/* Left Profile Info */}
        <div className="flex items-center gap-5 sm:gap-6">
          <div className="relative shrink-0">
            <div className="relative flex items-center justify-center p-2 rounded-2xl bg-gradient-to-tr from-muted via-background to-muted/50 border shadow-md">
              <Image
                src={insigniaImg}
                alt={rank}
                width={84}
                height={84}
                className="object-contain drop-shadow-lg"
                priority
              />
            </div>
            {levelNumber ? (
              <span className="absolute -bottom-1 -right-1 text-xs font-bold px-2 py-0.5 rounded-full bg-primary text-primary-foreground border shadow">
                Lvl {levelNumber}
              </span>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight capitalize inter">
                {name?.toLowerCase()}
              </h1>
              {isPaid && (
                <Badge
                  variant="default"
                  className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 gap-1 text-xs font-bold py-1 px-2.5"
                >
                  <Crown className="size-3.5" />
                  PRO LEADER
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-base text-muted-foreground">
              <span className="font-bold text-foreground logoFace tracking-wide text-2xl text-primary">
                {rank}
              </span>
              <span>•</span>
              {dsCode ? (
                <button
                  type="button"
                  onClick={copyDsCode}
                  className="inline-flex items-center gap-1.5 font-mono text-sm px-2.5 py-1 rounded-lg bg-muted hover:bg-muted/80 text-foreground transition-all cursor-pointer border"
                  title="Click to copy DS Code"
                >
                  <span>ID: {dsCode}</span>
                  {copied ? (
                    <Check className="size-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="size-3.5 opacity-60" />
                  )}
                </button>
              ) : null}
            </div>

            {/* Downline & Subscription info pills */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-sm">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/60 border text-muted-foreground font-medium">
                <Users className="size-4 text-blue-500" />
                <span>
                  <strong className="text-foreground">{memberCount}</strong> Downline Members
                </span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/60 border text-muted-foreground font-medium">
                <Calendar className="size-4 text-indigo-500" />
                <span>
                  <strong className="text-foreground">{weeksLeft}</strong> Weeks Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sync Control */}
        <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-border/50">
          <div className="text-left lg:text-right">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              Last Synced
            </p>
            <p className="text-sm font-semibold text-foreground">{formattedLastSync}</p>
          </div>

          {onSync && (
            <div className="flex flex-col items-end gap-1">
              <Button
                size="lg"
                onClick={onSync}
                disabled={isSyncing || isCooldown}
                variant={isCooldown ? "outline" : "default"}
                className={`gap-2.5 text-sm font-semibold h-11 px-5 shadow-sm active:scale-95 transition-all ${
                  isCooldown ? "opacity-75 cursor-not-allowed bg-muted/60 text-muted-foreground border-border" : ""
                }`}
                title={
                  isCooldown
                    ? `Data was synced recently. You can sync again in ${cooldownMinutesLeft} minutes.`
                    : "Click to fetch the latest distributor data from AWPL"
                }
              >
                <RefreshCw
                  className={`size-4 ${
                    isSyncing ? "animate-spin text-primary" : isCooldown ? "opacity-50" : ""
                  }`}
                />
                <span>
                  {isSyncing
                    ? "Syncing AWPL (~15s)..."
                    : isCooldown
                    ? `Up to Date (${cooldownMinutesLeft}m cooldown)`
                    : "Sync Live Data"}
                </span>
              </Button>
              {isCooldown && (
                <span className="text-[11px] text-muted-foreground/80">
                  Sync rate-limited to once per 30 mins
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
