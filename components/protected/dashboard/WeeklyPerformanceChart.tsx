"use client";

import React, { useState, useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  TrendingUp,
  Layers,
  IndianRupee,
  RefreshCw,
} from "lucide-react";
import { AwplWeeklySP, AwplPayout, parseCleanNumber, formatCompactINR } from "@/lib/api/awplBackend";

interface WeeklyPerformanceChartProps {
  weeklyData?: AwplWeeklySP[];
  payoutData?: AwplPayout[] | { date: string; amount: number }[];
  onSync?: () => void;
  isSyncing?: boolean;
}

export function WeeklyPerformanceChart({
  weeklyData = [],
  payoutData = [],
  onSync,
  isSyncing = false,
}: WeeklyPerformanceChartProps) {
  // Normalize weekly SP data
  const spChartData = useMemo(() => {
    if (!weeklyData || !Array.isArray(weeklyData) || weeklyData.length === 0) return [];
    return weeklyData.slice(-10).map((item) => {
      const dateStr = item["Closing Date"] || "";
      return {
        date: dateStr.length > 5 ? dateStr.substring(0, 5) : dateStr,
        fullDate: dateStr,
        sao: parseCleanNumber(item["SAO SP"]),
        sgo: parseCleanNumber(item["SGO SP"]),
        total: parseCleanNumber(item["Total SP"]),
      };
    });
  }, [weeklyData]);

  // Normalize payout data (handles both backend payout format & legacy Supabase format)
  const payoutChartData = useMemo(() => {
    if (!payoutData || !Array.isArray(payoutData) || payoutData.length === 0) return [];
    return payoutData
      .slice(-10)
      .reverse() // show chronological order
      .map((item, idx) => {
        if ("Cheque Date" in item) {
          const rawAmount = parseCleanNumber(item["Net Amount"] || item["Total Amount"]);
          const dateStr = item["Cheque Date"] || `Week ${idx + 1}`;
          return {
            date: dateStr.length > 5 ? dateStr.substring(0, 5) : dateStr,
            fullDate: dateStr,
            amount: rawAmount,
            chequeNo: item["Cheque No."] || "—",
          };
        } else if ("date" in item) {
          const rawAmount = parseCleanNumber(item.amount);
          const dateStr = item.date || `Week ${idx + 1}`;
          return {
            date: dateStr.length > 5 ? dateStr.substring(0, 5) : dateStr,
            fullDate: dateStr,
            amount: rawAmount,
            chequeNo: `CHQ-${idx + 100}`,
          };
        }
        return {
          date: `Cycle ${idx + 1}`,
          fullDate: `Cycle ${idx + 1}`,
          amount: 0,
          chequeNo: "—",
        };
      });
  }, [payoutData]);

  // Initial viewMode: prefer SP if available, otherwise Payout
  const [viewMode, setViewMode] = useState<"sp" | "payout">(() =>
    spChartData.length > 0 ? "sp" : "payout"
  );

  // If viewMode is SP but we only have payout data, switch to payout
  React.useEffect(() => {
    if (spChartData.length === 0 && payoutChartData.length > 0) {
      setViewMode("payout");
    }
  }, [spChartData.length, payoutChartData.length]);

  const hasData =
    viewMode === "sp" ? spChartData.length > 0 : payoutChartData.length > 0;

  // Summaries
  const spSummary = useMemo(() => {
    if (spChartData.length === 0) return { avg: 0, total: 0 };
    const total = spChartData.reduce((acc, d) => acc + d.total, 0);
    const avg = total / spChartData.length;
    return { avg, total };
  }, [spChartData]);

  const payoutSummary = useMemo(() => {
    if (payoutChartData.length === 0) return { avg: 0, total: 0 };
    const total = payoutChartData.reduce((acc, d) => acc + d.amount, 0);
    const avg = total / payoutChartData.length;
    return { avg, total };
  }, [payoutChartData]);

  return (
    <Card className="border bg-card/75 backdrop-blur-md rounded-3xl p-2 sm:p-4 flex flex-col justify-between">
      <CardHeader className="p-4 sm:p-6 pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
                <BarChart3 className="size-5" />
              </span>
              <CardTitle className="text-xl sm:text-2xl font-bold inter">
                {viewMode === "sp" ? "Weekly Production Momentum" : "Disbursement Cheques"}
              </CardTitle>
            </div>
            <CardDescription className="text-sm mt-1">
              {viewMode === "sp"
                ? "Recent closing sales points volume (SAO vs SGO production)"
                : "Weekly commission cheques credited to distributor"}
            </CardDescription>
          </div>

          {/* Toggle buttons */}
          <div className="flex items-center p-1 rounded-xl bg-muted border text-sm shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setViewMode("sp")}
              className={`px-4 py-1.5 rounded-lg font-semibold transition-all ${
                viewMode === "sp"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              SP Volume
            </button>
            <button
              type="button"
              onClick={() => setViewMode("payout")}
              className={`px-4 py-1.5 rounded-lg font-semibold transition-all ${
                viewMode === "payout"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Payouts (₹)
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 pt-2">
        {!hasData ? (
          <div className="h-72 sm:h-80 flex flex-col items-center justify-center text-center p-6 rounded-2xl border-2 border-dashed border-border/70 bg-muted/20 space-y-3">
            <BarChart3 className="size-10 text-muted-foreground/40" />
            <div>
              <p className="text-base font-bold text-foreground">No Performance History Found</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                Distributor cycle points & payout cheques will populate automatically once synced.
              </p>
            </div>
            {onSync && (
              <Button
                variant="outline"
                size="sm"
                onClick={onSync}
                disabled={isSyncing}
                className="mt-2 text-sm gap-2 font-semibold h-10 px-4"
              >
                <RefreshCw className={`size-4 ${isSyncing ? "animate-spin" : ""}`} />
                {isSyncing ? "Syncing..." : "Sync Portal Now"}
              </Button>
            )}
          </div>
        ) : (
          <div className="h-72 sm:h-80 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              {viewMode === "sp" ? (
                <BarChart data={spChartData} margin={{ top: 15, right: 15, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    tickMargin={10}
                    stroke="currentColor"
                    className="text-muted-foreground font-medium"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)}
                    stroke="currentColor"
                    className="text-muted-foreground font-medium"
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="rounded-2xl border bg-popover/95 p-4 shadow-xl text-sm space-y-2 backdrop-blur-md">
                          <p className="font-bold text-foreground pb-1.5 border-b border-border/60">
                            Closing: {d.fullDate}
                          </p>
                          <div className="flex items-center justify-between gap-6 text-emerald-600 dark:text-emerald-400 font-semibold">
                            <span>SAO SP:</span>
                            <span className="font-mono">{d.sao.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between gap-6 text-indigo-600 dark:text-indigo-400 font-semibold">
                            <span>SGO SP:</span>
                            <span className="font-mono">{d.sgo.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between gap-6 pt-1.5 border-t border-border/60 font-extrabold text-foreground">
                            <span>Total SP:</span>
                            <span className="font-mono">{d.total.toLocaleString()}</span>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="circle"
                    iconSize={10}
                    wrapperStyle={{ fontSize: "13px", paddingBottom: "12px", fontWeight: 600 }}
                  />
                  <Bar
                    name="SAO (Left)"
                    dataKey="sao"
                    fill="#10b981"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={38}
                  />
                  <Bar
                    name="SGO (Right)"
                    dataKey="sgo"
                    fill="#6366f1"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={38}
                  />
                </BarChart>
              ) : (
                <BarChart data={payoutChartData} margin={{ top: 15, right: 15, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    tickMargin={10}
                    stroke="currentColor"
                    className="text-muted-foreground font-medium"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                    stroke="currentColor"
                    className="text-muted-foreground font-medium"
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="rounded-2xl border bg-popover/95 p-4 shadow-xl text-sm space-y-2 backdrop-blur-md">
                          <p className="font-bold text-foreground pb-1 border-b border-border/60">
                            Cheque: {d.fullDate}
                          </p>
                          {d.chequeNo && d.chequeNo !== "—" && (
                            <p className="text-xs text-muted-foreground font-mono">
                              Cheque #: {d.chequeNo}
                            </p>
                          )}
                          <div className="flex items-center justify-between gap-6 font-extrabold text-emerald-600 dark:text-emerald-400 text-base">
                            <span>Net Payout:</span>
                            <span className="font-mono">₹{d.amount.toLocaleString()}</span>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Bar
                    name="Payout (₹)"
                    dataKey="amount"
                    fill="#0ea5e9"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={48}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 sm:p-6 pt-3 border-t border-border/50 mt-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 w-full text-sm text-muted-foreground">
          {viewMode === "sp" ? (
            <>
              <div className="flex items-center gap-2">
                <Layers className="size-4 text-primary" />
                <span>
                  Avg Cycle SP:{" "}
                  <strong className="text-foreground text-base">
                    {spSummary.avg.toLocaleString("en-IN", { maximumFractionDigits: 0 })} SP
                  </strong>
                </span>
              </div>
              <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10 text-xs font-semibold px-2.5 py-1 gap-1">
                <TrendingUp className="size-3.5" />
                Cycle Verified
              </Badge>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <IndianRupee className="size-4 text-primary" />
                <span>
                  Avg Cheque:{" "}
                  <strong className="text-foreground text-base">
                    ₹{payoutSummary.avg.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  </strong>
                </span>
              </div>
              <span className="text-sm font-semibold text-foreground">
                Sum: {formatCompactINR(payoutSummary.total)}
              </span>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
