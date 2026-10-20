"use client";

import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Search,
  Download,
  IndianRupee,
  Receipt,
  ShieldCheck,
  CheckCircle2,
  ArrowUpDown,
  Sparkles,
  Info,
  Award,
} from "lucide-react";
import { useProfile, usePayouts } from "@/hooks/useDatabase";
import { formatINR, formatCompactINR, parseCleanNumber } from "@/lib/api/awplBackend";

const STEP_NAME_MAP: Record<number, string> = {
  1: "Bronze",
  2: "Silver",
  3: "Gold",
  4: "Platinum",
  5: "Emerald",
  6: "Topaz",
  7: "Ruby Star",
  8: "Sapphire Star",
  9: "Star Sapphire",
  10: "Diamond",
  11: "Blue Diamond",
  12: "Black Diamond",
  13: "Royal Diamond",
  14: "Crown Diamond",
  15: "Ambassador",
  16: "Royal Ambassador",
  17: "Crown Ambassador",
  18: "Brand Ambassador",
  19: "Chief Brand Ambassador",
  20: "Global Brand Ambassador",
};

interface NormalizedCheque {
  id: string;
  chequeNo: string;
  date: string;
  saoSp: number;
  sgoSp: number;
  matchedSp: number;
  step: number;
  grossAmount: number;
  tdsAmount: number;
  adminCharges: number;
  netAmount: number;
  salesGrowth: number;
  otherIncomes: Record<string, number>;
  status: string;
  transactionNo: string;
}

interface ChequeDataProps {
  distributorId?: string;
  distributorName?: string;
}

export default function ChequeData({ distributorId: propDistributorId, distributorName: propDistributorName }: ChequeDataProps = {}) {
  const { data: leader, isLoading: isProfileLoading } = useProfile();
  const effectiveId = propDistributorId || leader?.awplid;
  const { data: dbPayouts, isLoading: isPayoutsLoading } = usePayouts(effectiveId);

  const [sorting, setSorting] = useState<SortingState>([
    { id: "date", desc: true },
  ]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  // Normalize cheques from Supabase relational payouts or legacy JSON
  const cheques: NormalizedCheque[] = useMemo(() => {
    if (dbPayouts && dbPayouts.length > 0) {
      return dbPayouts.map((p, idx) => {
        const sao = Number(p.sao_sp || 0);
        const sgo = Number(p.sgo_sp || 0);
        const step = Number(p.step || 0);
        const others = (p.other_incomes && typeof p.other_incomes === "object" ? p.other_incomes : {}) as Record<string, number>;

        // Dynamic Calculations:
        // Sum all non-growth extra bonuses
        const otherTotal = Object.values(others).reduce((a, b) => a + Number(b || 0), 0);
        // Sales Growth Commission = Gross - all other bonuses
        const salesGrowth = Math.max(0, (p.gross_amount || 0) - otherTotal);
        // Matched SP = Sales Growth / 10 (1 SP = ₹10)
        const matchedSp = Math.round(salesGrowth / 10);

        return {
          id: String(p.id || idx),
          chequeNo: p.cheque_no,
          date: p.cheque_date,
          saoSp: sao,
          sgoSp: sgo,
          matchedSp: matchedSp,
          step: step,
          grossAmount: p.gross_amount || 0,
          tdsAmount: p.tds_amount || 0,
          adminCharges: p.admin_charges || 0,
          netAmount: p.net_amount || 0,
          salesGrowth: salesGrowth,
          otherIncomes: others,
          status: p.status || "Paid",
          transactionNo: p.transaction_no || "—",
        };
      });
    }

    const legacy = (leader?.chequeData as unknown as Array<Record<string, unknown>>) || [];
    if (Array.isArray(legacy) && legacy.length > 0) {
      return legacy.map((p, idx) => {
        if ("Cheque Date" in p) {
          const gross = parseCleanNumber(p["Total Amount"] as string);
          const net = parseCleanNumber((p["Net Amount"] || p["Total Amount"]) as string);
          const tds = parseCleanNumber(p["TDS Amount"] as string);
          const admin = parseCleanNumber(p["Admin Charges"] as string);
          return {
            id: String(p["Id"] || idx),
            chequeNo: String(p["Cheque No."] || `CHQ-${idx + 1}`),
            date: String(p["Cheque Date"]),
            saoSp: 0,
            sgoSp: 0,
            matchedSp: 0,
            step: 0,
            grossAmount: gross,
            tdsAmount: tds,
            adminCharges: admin,
            netAmount: net,
            salesGrowth: gross,
            otherIncomes: {},
            status: String(p["Payment Status"] || "Paid"),
            transactionNo: String(p["Transaction No"] || "—"),
          };
        } else if ("date" in p) {
          const amt = parseCleanNumber(p.amount as string | number);
          return {
            id: String(idx),
            chequeNo: `CHQ-${idx + 100}`,
            date: String(p.date),
            saoSp: 0,
            sgoSp: 0,
            matchedSp: 0,
            step: 0,
            grossAmount: amt,
            tdsAmount: Math.round(amt * 0.05),
            adminCharges: Math.round(amt * 0.05),
            netAmount: amt,
            salesGrowth: amt,
            otherIncomes: {},
            status: "Paid",
            transactionNo: "—",
          };
        }
        return {
          id: String(idx),
          chequeNo: "—",
          date: "—",
          saoSp: 0,
          sgoSp: 0,
          matchedSp: 0,
          step: 0,
          grossAmount: 0,
          tdsAmount: 0,
          adminCharges: 0,
          netAmount: 0,
          salesGrowth: 0,
          otherIncomes: {},
          status: "Paid",
          transactionNo: "—",
        };
      });
    }

    return [];
  }, [dbPayouts, leader?.chequeData]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const totalNet = cheques.reduce((acc, c) => acc + c.netAmount, 0);
    const totalTds = cheques.reduce((acc, c) => acc + c.tdsAmount, 0);
    const totalMilestones = cheques.reduce((acc, c) => acc + (c.otherIncomes.sales_performance || 0), 0);
    const avg = cheques.length > 0 ? totalNet / cheques.length : 0;
    const milestoneCount = cheques.filter((c) => c.step > 0).length;
    return {
      totalNet,
      totalTds,
      totalMilestones,
      milestoneCount,
      avg,
      count: cheques.length,
    };
  }, [cheques]);

  const exportCSV = () => {
    if (cheques.length === 0) return;
    const headers = [
      "Cheque No",
      "Date",
      "Step",
      "Matched SP",
      "SAO SP",
      "SGO SP",
      "Gross Amount (INR)",
      "Sales Growth (INR)",
      "Level Bonus (INR)",
      "TDS Amount (INR)",
      "Admin Charges (INR)",
      "Net Amount (INR)",
      "Payment Status",
      "Transaction No",
    ];

    const rows = cheques.map((c) => [
      `"${c.chequeNo}"`,
      `"${c.date}"`,
      c.step,
      c.matchedSp,
      c.saoSp,
      c.sgoSp,
      c.grossAmount,
      c.salesGrowth,
      c.otherIncomes.sales_performance || 0,
      c.tdsAmount,
      c.adminCharges,
      c.netAmount,
      `"${c.status}"`,
      `"${c.transactionNo}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `awpl_cheques_${effectiveId || "export"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns: ColumnDef<NormalizedCheque>[] = [
    {
      id: "index",
      header: "#",
      cell: ({ row }) => <span className="font-mono text-muted-foreground">{row.index + 1}</span>,
      enableSorting: false,
    },
    {
      accessorKey: "date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="gap-1 font-bold -ml-3 text-xs sm:text-sm"
        >
          Date / Milestone
          <ArrowUpDown className="size-3.5" />
        </Button>
      ),
      cell: ({ row }) => {
        const { date, step } = row.original;
        const rankName = STEP_NAME_MAP[step];
        return (
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-foreground whitespace-nowrap">{date}</span>
            {step > 0 && (
              <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 text-[10px] sm:text-[11px] font-extrabold px-2 py-0.5 w-fit gap-1 shadow-sm">
                <Sparkles className="size-3 text-amber-500" />
                Step {step}: {rankName || "Milestone"}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      id: "points",
      header: "Sales Points (SP)",
      cell: ({ row }) => {
        const { saoSp, sgoSp, matchedSp } = row.original;
        if (saoSp === 0 && sgoSp === 0 && matchedSp === 0) {
          return <span className="text-muted-foreground font-mono text-xs">—</span>;
        }
        return (
          <div className="flex flex-col text-xs font-mono">
            <span className="font-semibold text-foreground">
              {matchedSp > 0 ? `${matchedSp.toLocaleString("en-IN")} SP Matched` : "—"}
            </span>
            <span className="text-[11px] text-muted-foreground whitespace-nowrap">
              SAO: {Math.round(saoSp).toLocaleString("en-IN")} | SGO: {Math.round(sgoSp).toLocaleString("en-IN")}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "grossAmount",
      header: () => <div className="text-right">Gross Total</div>,
      cell: ({ row }) => {
        const { grossAmount, salesGrowth, otherIncomes, step, tdsAmount, adminCharges, netAmount } = row.original;
        const rankName = STEP_NAME_MAP[step] || `Step ${step}`;
        const hasBreakdown = Object.keys(otherIncomes).length > 0 || step > 0;

        return (
          <div className="flex items-center justify-end gap-1.5 font-mono">
            <span className="text-muted-foreground font-medium">{formatINR(grossAmount)}</span>
            {hasBreakdown && (
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      aria-label="View breakdown"
                      className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                    >
                      <Info className="size-3.5 text-primary/80" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="max-w-xs p-3 space-y-1.5 text-xs bg-popover text-popover-foreground border shadow-xl rounded-xl"
                  >
                    <div className="font-bold border-b border-border/50 pb-1 text-foreground flex items-center justify-between">
                      <span>Commission Breakdown</span>
                      {step > 0 && <span className="text-amber-500 font-extrabold">{rankName}</span>}
                    </div>
                    <div className="space-y-1 text-muted-foreground text-[11px]">
                      {salesGrowth > 0 && (
                        <div className="flex justify-between">
                          <span>Sales Growth (Weekly):</span>
                          <span className="font-mono text-foreground font-semibold">{formatINR(salesGrowth)}</span>
                        </div>
                      )}
                      {otherIncomes.sales_performance > 0 && (
                        <div className="flex justify-between text-amber-600 dark:text-amber-400 font-medium">
                          <span>Rank Milestone Bonus:</span>
                          <span className="font-mono font-bold">{formatINR(otherIncomes.sales_performance)}</span>
                        </div>
                      )}
                      {otherIncomes.bonanza > 0 && (
                        <div className="flex justify-between text-indigo-500 font-medium">
                          <span>Bonanza Contest Reward:</span>
                          <span className="font-mono font-bold">{formatINR(otherIncomes.bonanza)}</span>
                        </div>
                      )}
                      {otherIncomes.reward_income > 0 && (
                        <div className="flex justify-between">
                          <span>Reward Income:</span>
                          <span className="font-mono text-foreground">{formatINR(otherIncomes.reward_income)}</span>
                        </div>
                      )}
                      {otherIncomes.diamond_royalty > 0 && (
                        <div className="flex justify-between text-blue-500">
                          <span>Diamond Royalty:</span>
                          <span className="font-mono font-bold">{formatINR(otherIncomes.diamond_royalty)}</span>
                        </div>
                      )}
                      {otherIncomes.blue_diamond_royalty > 0 && (
                        <div className="flex justify-between text-blue-500">
                          <span>Blue Diamond Royalty:</span>
                          <span className="font-mono font-bold">{formatINR(otherIncomes.blue_diamond_royalty)}</span>
                        </div>
                      )}
                      <div className="border-t border-border/40 pt-1 flex justify-between font-semibold text-foreground">
                        <span>Total Gross:</span>
                        <span className="font-mono">{formatINR(grossAmount)}</span>
                      </div>
                      <div className="flex justify-between text-rose-500 text-[10px]">
                        <span>TDS Deduction:</span>
                        <span className="font-mono">-{formatINR(tdsAmount)}</span>
                      </div>
                      {adminCharges > 0 && (
                        <div className="flex justify-between text-rose-500 text-[10px]">
                          <span>Admin / Foundation:</span>
                          <span className="font-mono">-{formatINR(adminCharges)}</span>
                        </div>
                      )}
                      <div className="border-t border-border/50 pt-1 flex justify-between font-extrabold text-emerald-600 dark:text-emerald-400">
                        <span>Net Credited:</span>
                        <span className="font-mono">{formatINR(netAmount)}</span>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "tdsAmount",
      header: () => <div className="text-right">TDS (5%)</div>,
      cell: ({ row }) => (
        <div className="text-right font-mono text-xs text-muted-foreground">
          {formatINR(row.original.tdsAmount)}
        </div>
      ),
    },
    {
      accessorKey: "netAmount",
      header: ({ column }) => (
        <div className="text-right">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="gap-1 font-bold -mr-3 text-xs sm:text-sm"
          >
            Net Payout
            <ArrowUpDown className="size-3.5" />
          </Button>
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right font-mono font-extrabold text-base sm:text-lg text-emerald-600 dark:text-emerald-400">
          {formatINR(row.original.netAmount)}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: () => <div className="text-center">Status</div>,
      cell: ({ row }) => (
        <div className="text-center">
          <Badge
            variant="outline"
            className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-xs font-bold py-1 px-2.5 gap-1 inline-flex"
          >
            <CheckCircle2 className="size-3.5" />
            {row.original.status}
          </Badge>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: cheques,
    columns,
    state: {
      sorting,
      globalFilter,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const isLoading = isProfileLoading || isPayoutsLoading;

  return (
    <div className="space-y-6 sm:space-y-8 w-full pb-12">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight inter">
            {propDistributorName ? `${propDistributorName}'s Disbursements` : "Payout Disbursements"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {propDistributorId
              ? `Audited record of weekly commissions for AWPL ID: ${propDistributorId}`
              : "Complete record of weekly commissions and bank transfers issued by AWPL"}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={exportCSV}
          disabled={cheques.length === 0}
          className="gap-2 font-semibold text-sm h-10 px-4 self-start sm:self-auto"
        >
          <Download className="size-4" />
          Export CSV
        </Button>
      </div>

      {/* 2. Top Metric KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border bg-card/75 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Lifetime Income
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <IndianRupee className="size-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold inter text-foreground">
              {formatCompactINR(metrics.totalNet)}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 font-mono">
              Exact: {formatINR(metrics.totalNet)}
            </p>
          </div>
        </Card>

        <Card className="border bg-card/75 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Total Cheques
            </span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Receipt className="size-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold inter text-foreground">
              {metrics.count}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Weekly Disbursements
            </p>
          </div>
        </Card>

        <Card className="border bg-card/75 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Level Bonuses
            </span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Award className="size-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold inter text-foreground">
              {formatCompactINR(metrics.totalMilestones)}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {metrics.milestoneCount} Rank Milestones Reached
            </p>
          </div>
        </Card>

        <Card className="border bg-card/75 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Total TDS Deducted
            </span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <ShieldCheck className="size-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold inter text-foreground">
              {formatINR(metrics.totalTds)}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              5% Section 194H
            </p>
          </div>
        </Card>
      </div>

      {/* 3. Search and Table Card */}
      <div className="rounded-3xl border bg-card/75 backdrop-blur-md p-4 sm:p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search cheques, date, amount..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-9 h-11 text-sm rounded-xl"
            />
          </div>

          <span className="text-xs sm:text-sm text-muted-foreground font-medium">
            Showing <strong className="text-foreground">{table.getRowModel().rows.length}</strong> of{" "}
            {cheques.length} disbursements
          </span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            Loading payout records...
          </div>
        ) : cheques.length === 0 ? (
          <div className="p-16 text-center text-sm text-muted-foreground rounded-2xl border-2 border-dashed border-border/60">
            No payout cheques on record yet. Sync your distributor data from the Dashboard.
          </div>
        ) : (
          <div className="rounded-2xl border overflow-x-auto scrollbar-thin">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="hover:bg-transparent border-border/50 bg-muted/30">
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="py-3 px-4 font-bold text-xs uppercase tracking-wider">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="text-sm divide-y divide-border/40">
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="hover:bg-muted/40 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3.5 px-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
