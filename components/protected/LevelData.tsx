"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Award,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useProfile, useDistributor } from "@/hooks/useDatabase";
import { calcLevel } from "@/utils/awpl.helper";

interface LevelStep {
  step: number;
  name: string;
  reqSao: number;
  reqSgo: number;
  image: string;
}

const ALL_LEVELS: LevelStep[] = [
  { step: 1, name: "Bronze", reqSao: 200, reqSgo: 100, image: "/Bronze.png" },
  { step: 2, name: "Silver", reqSao: 600, reqSgo: 300, image: "/Silver.png" },
  { step: 3, name: "Gold", reqSao: 1200, reqSgo: 600, image: "/Gold.png" },
  { step: 4, name: "Platinum", reqSao: 2400, reqSgo: 1200, image: "/Gold.png" },
  { step: 5, name: "Emerald", reqSao: 4800, reqSgo: 2400, image: "/Master.png" },
  { step: 6, name: "Topaz", reqSao: 12000, reqSgo: 6000, image: "/Master.png" },
  { step: 7, name: "Ruby Star", reqSao: 24000, reqSgo: 12000, image: "/Royal0.png" },
  { step: 8, name: "Sapphire Star", reqSao: 48000, reqSgo: 24000, image: "/Royal0.png" },
  { step: 9, name: "Star Sapphire", reqSao: 96000, reqSgo: 48000, image: "/Royal0.png" },
  { step: 10, name: "Diamond", reqSao: 192000, reqSgo: 96000, image: "/Diamond.png" },
  { step: 11, name: "Blue Diamond", reqSao: 384000, reqSgo: 192000, image: "/Diamond.png" },
  { step: 12, name: "Black Diamond", reqSao: 768000, reqSgo: 384000, image: "/Diamond.png" },
  { step: 13, name: "Royal Diamond", reqSao: 1536000, reqSgo: 768000, image: "/Diamond.png" },
  { step: 14, name: "Crown Diamond", reqSao: 3072000, reqSgo: 1536000, image: "/Diamond.png" },
  { step: 15, name: "Ambassador", reqSao: 6144000, reqSgo: 3072000, image: "/Royal.png" },
  { step: 16, name: "Royal Ambassador", reqSao: 12288000, reqSgo: 6144000, image: "/Royal.png" },
  { step: 17, name: "Crown Ambassador", reqSao: 24576000, reqSgo: 12288000, image: "/Royal.png" },
  { step: 18, name: "Brand Ambassador", reqSao: 49152000, reqSgo: 24576000, image: "/Royal.png" },
  { step: 19, name: "Chief Brand Ambassador", reqSao: 196605200, reqSgo: 49152000, image: "/Royal.png" },
  { step: 20, name: "Global Brand Ambassador", reqSao: 393213200, reqSgo: 196605200, image: "/Royal.png" },
];

interface LevelDataProps {
  distributorId?: string;
}

export default function LevelData({ distributorId: propDistributorId }: LevelDataProps = {}) {
  const { data: leader } = useProfile();
  const effectiveId = propDistributorId || leader?.awplid;
  const { data: distributor } = useDistributor(effectiveId);

  const sao = distributor?.sao_sp ?? leader?.levelsao ?? 0;
  const sgo = distributor?.sgo_sp ?? leader?.levelsgo ?? 0;
  const currentRank = distributor?.current_level_name || leader?.rank || calcLevel(sao, sgo);

  const currentStep = useMemo(() => {
    const found = ALL_LEVELS.find((l) => l.name.toLowerCase() === currentRank.toLowerCase());
    return found ? found.step : 0;
  }, [currentRank]);

  return (
    <div className="space-y-6 sm:space-y-8 w-full pb-12">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight inter">
            Rank & Level Roadmap
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Complete Asclepius 20-level hierarchy and sales points qualification benchmarks
          </p>
        </div>

        <Badge
          variant="outline"
          className="bg-primary/5 text-primary border-primary/20 text-sm font-semibold py-1.5 px-3.5 gap-2 self-start sm:self-auto"
        >
          <Award className="size-4" />
          Current: {currentRank} (Step {currentStep} of 20)
        </Badge>
      </div>

      {/* 2. Current Progress Highlight Card */}
      <Card className="border bg-card/75 backdrop-blur-md rounded-3xl p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Distributor Level
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground logoFace">
              {currentRank}
            </h2>
            <p className="text-xs text-muted-foreground font-mono">
              AWPL ID: {leader?.awplid || "N/A"}
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] space-y-1">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Total SAO Points
            </span>
            <p className="text-2xl font-extrabold font-mono text-foreground">
              {sao.toLocaleString("en-IN")} SP
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/[0.04] space-y-1">
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              Total SGO Points
            </span>
            <p className="text-2xl font-extrabold font-mono text-foreground">
              {sgo.toLocaleString("en-IN")} SP
            </p>
          </div>
        </div>
      </Card>

      {/* 3. Steps Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-foreground inter">
          Official 20 Steps Progression
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ALL_LEVELS.map((level) => {
            const isCompleted = level.step <= currentStep;
            const isCurrent = level.step === currentStep + 1;

            const saoPct = Math.min((sao / level.reqSao) * 100, 100);
            const sgoPct = Math.min((sgo / level.reqSgo) * 100, 100);

            return (
              <div
                key={level.step}
                className={`p-5 rounded-2xl border transition-all ${
                  isCompleted
                    ? "bg-emerald-500/[0.03] border-emerald-500/30"
                    : isCurrent
                    ? "bg-card border-primary/40 shadow-md ring-1 ring-primary/20"
                    : "bg-card/40 border-border/50 opacity-80"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="size-12 rounded-xl bg-muted/60 border p-1 flex items-center justify-center shrink-0">
                      <Image
                        src={level.image}
                        alt={level.name}
                        width={36}
                        height={36}
                        className="object-contain"
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-muted-foreground">
                          Step {level.step}
                        </span>
                        <h4 className="font-bold text-base sm:text-lg text-foreground">
                          {level.name}
                        </h4>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Required: {level.reqSao.toLocaleString("en-IN")} SAO /{" "}
                        {level.reqSgo.toLocaleString("en-IN")} SGO
                      </span>
                    </div>
                  </div>

                  {isCompleted ? (
                    <Badge
                      variant="outline"
                      className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-xs font-bold py-1 px-2.5 gap-1"
                    >
                      <CheckCircle2 className="size-3.5" />
                      Completed
                    </Badge>
                  ) : isCurrent ? (
                    <Badge
                      variant="outline"
                      className="bg-primary/10 text-primary border-primary/30 text-xs font-bold py-1 px-2.5 gap-1"
                    >
                      <Sparkles className="size-3.5" />
                      Next Target
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs text-muted-foreground">
                      Locked
                    </Badge>
                  )}
                </div>

                {/* Progress bars for the next target */}
                {isCurrent && (
                  <div className="mt-4 pt-3 border-t border-border/50 space-y-2 text-xs">
                    <div className="space-y-1">
                      <div className="flex justify-between text-muted-foreground">
                        <span>SAO Progress</span>
                        <span className="font-mono font-semibold text-foreground">
                          {sao.toLocaleString("en-IN")} / {level.reqSao.toLocaleString("en-IN")} SP ({saoPct.toFixed(0)}%)
                        </span>
                      </div>
                      <Progress value={saoPct} childClassName="bg-emerald-500" className="h-1.5" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-muted-foreground">
                        <span>SGO Progress</span>
                        <span className="font-mono font-semibold text-foreground">
                          {sgo.toLocaleString("en-IN")} / {level.reqSgo.toLocaleString("en-IN")} SP ({sgoPct.toFixed(0)}%)
                        </span>
                      </div>
                      <Progress value={sgoPct} childClassName="bg-indigo-500" className="h-1.5" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
