"use client";

import React, { useMemo } from "react";
import { motion, type Variants } from "framer-motion";
import { useProfile, usePayouts, useWeeklySp, useDistributor } from "@/hooks/useDatabase";
import { useAwplData } from "@/hooks/useAwplData";
import { calcLevel, getRequiredSp } from "@/utils/awpl.helper";
import { parseCleanNumber } from "@/lib/api/awplBackend";
import { DashboardSkeleton } from "./DashboardSkeleton";
import { DashboardHeader } from "./DashboardHeader";
import { KpiMetricsGrid } from "./KpiMetricsGrid";
import { RankProgressTracker } from "./RankProgressTracker";
import { WeeklyPerformanceChart } from "./WeeklyPerformanceChart";
import { RecentPayoutsTable } from "./RecentPayoutsTable";
import { SyncProgressBar } from "./SyncProgressBar";

export default function Dashboard() {
  const { data: leader, isLoading: isProfileLoading, error: profileError } = useProfile();
  const { data: distributor, isLoading: isDistributorLoading } = useDistributor(leader?.awplid);
  const { data: dbPayouts } = usePayouts(leader?.awplid);
  const { data: dbWeeklySp } = useWeeklySp(leader?.awplid);
  const { isSyncing, syncError, syncNow } = useAwplData(leader);

  // Directly derive values from Supabase tables: distributors > leaders > helper calculation
  const sao = distributor?.sao_sp ?? leader?.levelsao ?? 0;
  const sgo = distributor?.sgo_sp ?? leader?.levelsgo ?? 0;

  const fallbackLevel = calcLevel(sao, sgo);
  const currentRank =
    distributor?.current_level_name || leader?.rank || fallbackLevel;
  const currentLevelNum = distributor?.current_level ?? undefined;

  const nextRank = distributor?.next_level_name || null;
  const targetSao =
    distributor?.next_target_sao ?? getRequiredSp("SAO", sao);
  const targetSgo =
    distributor?.next_target_sgo ?? getRequiredSp("SGO", sgo);

  // Payout cheques normalized directly from Supabase payouts table
  const payouts = useMemo(() => {
    if (dbPayouts && dbPayouts.length > 0) {
      return dbPayouts.map((p) => ({
        "Cheque No.": p.cheque_no,
        "Cheque Date": p.cheque_date,
        "Net Amount": p.net_amount,
        "Total Amount": p.gross_amount,
        "TDS Amount": p.tds_amount,
        "Admin Charges": p.admin_charges,
        "Payment Status": p.status,
        "Transaction No": p.transaction_no || "—",
      }));
    }
    return (
      (leader?.chequeData as unknown as Record<string, unknown>[]) ||
      []
    );
  }, [dbPayouts, leader?.chequeData]);

  // Weekly SP history normalized directly from Supabase weekly_sp table
  const weeklySP = useMemo(() => {
    if (dbWeeklySp && dbWeeklySp.length > 0) {
      return dbWeeklySp.map((w) => ({
        "Closing Date": w.closing_date,
        "SAO SP": String(w.sao_sp),
        "SGO SP": String(w.sgo_sp),
        "Total SP": String(w.total_sp),
      }));
    }
    return [];
  }, [dbWeeklySp]);

  // Lifetime Income loaded directly from distributor.total_income or payouts sum
  const totalIncome = useMemo(() => {
    if (distributor?.total_income != null && distributor.total_income > 0) {
      return distributor.total_income;
    }
    if (dbPayouts && dbPayouts.length > 0) {
      return dbPayouts.reduce((acc, p) => acc + (p.net_amount || 0), 0);
    }
    const cheques = (leader?.chequeData as unknown as Array<Record<string, unknown>>) || [];
    if (Array.isArray(cheques) && cheques.length > 0) {
      return cheques.reduce((acc, c) => {
        if (typeof c?.amount === "number") return acc + c.amount;
        if (c?.["Net Amount"]) return acc + parseCleanNumber(c["Net Amount"] as string);
        if (c?.["Total Amount"]) return acc + parseCleanNumber(c["Total Amount"] as string);
        return acc;
      }, 0);
    }
    return 0;
  }, [distributor?.total_income, dbPayouts, leader?.chequeData]);

  const isLoading = isProfileLoading || (!!leader?.awplid && isDistributorLoading && !distributor);
  if (isLoading) return <DashboardSkeleton />;

  if (profileError) {
    return (
      <div className="p-8 sm:p-12 text-center rounded-3xl border border-destructive/20 bg-destructive/5 text-destructive max-w-lg mx-auto my-12">
        <h3 className="font-bold text-xl mb-2">Failed to Load Profile</h3>
        <p className="text-base opacity-90">{profileError.message}</p>
      </div>
    );
  }

  if (!leader) {
    return (
      <div className="p-8 sm:p-12 text-center rounded-3xl border bg-card/60 max-w-md mx-auto my-12 shadow-sm space-y-3">
        <h3 className="font-bold text-2xl text-foreground">Distributor Profile Needed</h3>
        <p className="text-sm text-muted-foreground">
          No distributor profile record found. Please verify your account setup to start monitoring your AWPL tree.
        </p>
      </div>
    );
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 sm:space-y-8 w-full pb-12"
    >
      {/* 1. Sync Progress Bar (Displays only when manual sync is running) */}
      <SyncProgressBar isSyncing={isSyncing} error={syncError} />

      {/* 2. Top Profile Header Banner */}
      <motion.div variants={itemVariants}>
        <DashboardHeader
          name={distributor?.name || leader.name || "Leader"}
          dsCode={leader.awplid}
          rank={currentRank}
          levelNumber={currentLevelNum}
          isPaid={leader.ispro || false}
          memberCount={leader.memcount || 0}
          weeksLeft={leader.weekleft || 0}
          lastSync={distributor?.last_mined_at || leader.lastFetch}
          onSync={syncNow}
          isSyncing={isSyncing}
        />
      </motion.div>

      {/* 3. High-Level KPI 4-Card Summary Grid (No duplicates with leg tracker!) */}
      <motion.div variants={itemVariants}>
        <KpiMetricsGrid
          totalIncome={totalIncome}
          currentLevelName={currentRank}
          currentLevelNumber={currentLevelNum}
          nextLevelName={nextRank}
          saoSp={sao}
          sgoSp={sgo}
          nextTargetSao={targetSao}
          nextTargetSgo={targetSgo}
          memberCount={leader.memcount || 0}
        />
      </motion.div>

      {/* 4. Single Definitive Rank Milestone & Leg Balance Centerpiece */}
      <motion.div variants={itemVariants}>
        <RankProgressTracker
          currentLevelName={currentRank}
          nextLevelName={nextRank}
          saoSp={sao}
          sgoSp={sgo}
          targetSao={targetSao}
          targetSgo={targetSgo}
        />
      </motion.div>

      {/* 5. Production Momentum Chart & Recent Disbursements */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <WeeklyPerformanceChart
          weeklyData={weeklySP}
          payoutData={payouts as unknown as { date: string; amount: number }[]}
          onSync={syncNow}
          isSyncing={isSyncing}
        />
        <RecentPayoutsTable
          payouts={payouts as unknown as { date: string; amount: number }[]}
        />
      </motion.div>
    </motion.div>
  );
}
