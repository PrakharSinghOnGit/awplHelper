"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, ShieldAlert } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface SyncProgressBarProps {
  isSyncing: boolean;
  onComplete?: () => void;
  error?: string | null;
}

const STAGES = [
  { atSec: 0, text: "Connecting to AWPL secure portal..." },
  { atSec: 3, text: "Validating distributor credentials..." },
  { atSec: 6, text: "Mining team sales points (SAO & SGO)..." },
  { atSec: 10, text: "Extracting recent payouts & cheque history..." },
  { atSec: 13, text: "Calculating rank milestone requirements..." },
  { atSec: 14.5, text: "Finalizing and saving your dashboard..." },
];

export function SyncProgressBar({ isSyncing, error }: SyncProgressBarProps) {
  const [progress, setProgress] = useState(0);
  const [stageText, setStageText] = useState(STAGES[0].text);
  const [isDone, setIsDone] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    let finishTimeout: NodeJS.Timeout | null = null;

    if (isSyncing) {
      setVisible(true);
      setIsDone(false);
      setProgress(5);
      const startTime = Date.now();
      const targetDuration = 14500; // 14.5 seconds

      interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const elapsedSec = elapsed / 1000;

        // Find stage text
        for (let i = STAGES.length - 1; i >= 0; i--) {
          if (elapsedSec >= STAGES[i].atSec) {
            setStageText(STAGES[i].text);
            break;
          }
        }

        // Progress up to ~95%
        const pct = Math.min(95, Math.floor((elapsed / targetDuration) * 95));
        setProgress(Math.max(5, pct));
      }, 250);
    } else if (visible && !isSyncing) {
      // Finished!
      if (!error) {
        setProgress(100);
        setStageText("Dashboard updated successfully!");
        setIsDone(true);
        finishTimeout = setTimeout(() => {
          setVisible(false);
          setIsDone(false);
          setProgress(0);
        }, 1800);
      } else {
        finishTimeout = setTimeout(() => {
          setVisible(false);
        }, 3000);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
      if (finishTimeout) clearTimeout(finishTimeout);
    };
  }, [isSyncing, error, visible]);

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="w-full rounded-2xl border border-primary/20 bg-card/90 backdrop-blur-md p-4 sm:p-5 shadow-md space-y-3"
      >
        <div className="flex items-center justify-between text-sm sm:text-base">
          <div className="flex items-center gap-2.5 font-medium text-foreground">
            {error ? (
              <ShieldAlert className="size-5 text-destructive shrink-0" />
            ) : isDone ? (
              <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />
            ) : (
              <Loader2 className="size-5 text-primary animate-spin shrink-0" />
            )}
            <span className="font-semibold text-foreground">
              {error ? "Sync Error" : stageText}
            </span>
          </div>

          <span className="font-mono text-sm font-bold text-primary">
            {progress}%
          </span>
        </div>

        <Progress
          value={progress}
          className="h-2.5 bg-muted/70 rounded-full"
          childClassName={
            error
              ? "bg-destructive"
              : isDone
              ? "bg-emerald-500"
              : "bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500"
          }
        />

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {error
              ? error
              : isDone
              ? "All data cached & saved to your account"
              : "Mining directly from official AWPL portal (takes ~15 sec)"}
          </span>
          {!isDone && !error && <span>Please don&apos;t close this window</span>}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
