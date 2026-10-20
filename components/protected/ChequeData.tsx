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
  Search,
  Download,
  IndianRupee,
  Receipt,
  ShieldCheck,
  CheckCircle2,
  ArrowUpDown,
} from "lucide-react";
import { useProfile, usePayouts } from "@/hooks/useDatabase";
import { formatINR, formatCompactINR, parseCleanNumber } from "@/lib/api/awplBackend";

interface NormalizedCheque {
  id: string;
  chequeNo: string;
  date: string;
  grossAmount: number;
  tdsAmount: number;
  adminCharges: number;
  netAmount: number;
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
      return dbPayouts.map((p, idx) => ({
        id: String(p.id || idx),
        chequeNo: p.cheque_no,
        date: p.cheque_date,
        grossAmount: p.gross_amount || 0,
        tdsAmount: p.tds_amount || 0,
        adminCharges: p.admin_charges || 0,
        netAmount: p.net_amount || 0,
        status: p.status || "Paid",
        transactionNo: p.transaction_no || "—",
      }));
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
            grossAmount: gross,
            tdsAmount: tds,
            adminCharges: admin,
            netAmount: net,
            status: String(p["Payment Status"] || "Paid"),
            transactionNo: String(p["Transaction No"] || "—"),
          };
        } else if ("date" in p) {
          const amt = parseCleanNumber(p.amount as string | number);
          return {
            id: String(idx),
            chequeNo: `CHQ-${idx + 100}`,
            date: String(p.date),
            grossAmount: amt,
            tdsAmount: Math.round(amt * 0.05),
            adminCharges: Math.round(amt * 0.05),
            netAmount: amt,
            status: "Paid",
            transactionNo: "—",
          };
        }
        return {
          id: String(idx),
          chequeNo: "—",
          date: "—",
          grossAmount: 0,
          tdsAmount: 0,
          adminCharges: 0,
          netAmount: 0,
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
    const avg = cheques.length > 0 ? totalNet / cheques.length : 0;
    return {
      totalNet,
      totalTds,
      avg,
      count: cheques.length,
    };
  }, [cheques]);

  const exportCSV = () => {
    if (cheques.length === 0) return;
    const headers = [
      "Cheque No",
      "Date",
      "Gross Amount (INR)",
      "TDS Amount (INR)",
      "Admin Charges (INR)",
      "Net Amount (INR)",
      "Payment Status",
      "Transaction No",
    ];

    const rows = cheques.map((c) => [
      `"${c.chequeNo}"`,
      `"${c.date}"`,
      c.grossAmount,
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
    link.setAttribute("download", `awpl_cheques_${leader?.awplid || "export"}.csv`);
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
          Cheque Date
          <ArrowUpDown className="size-3.5" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-semibold text-foreground">{row.original.date}</span>
      ),
    },
    {
      accessorKey: "chequeNo",
      header: "Cheque #",
      cell: ({ row }) => (
        <span className="font-mono font-medium text-xs sm:text-sm text-muted-foreground">
          {row.original.chequeNo}
        </span>
      ),
    },
    {
      accessorKey: "grossAmount",
      header: () => <div className="text-right">Gross Total</div>,
      cell: ({ row }) => (
        <div className="text-right font-mono text-muted-foreground">
          {formatINR(row.original.grossAmount)}
        </div>
      ),
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
              Avg Cheque Size
            </span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <IndianRupee className="size-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold inter text-foreground">
              {formatINR(metrics.avg)}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Per Closing Cycle
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
