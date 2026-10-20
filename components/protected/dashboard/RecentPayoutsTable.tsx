"use client";

import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ReceiptText,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { useNavigation } from "@/providers/NavigationContext";
import { AwplPayout, formatINR, parseCleanNumber } from "@/lib/api/awplBackend";

interface RecentPayoutsTableProps {
  payouts?: AwplPayout[] | { date: string; amount: number }[];
}

export function RecentPayoutsTable({ payouts = [] }: RecentPayoutsTableProps) {
  const { setCurrentPage } = useNavigation();

  // Normalize payouts to top 5 most recent
  const recentList = useMemo(() => {
    if (!payouts || !Array.isArray(payouts) || payouts.length === 0) return [];
    return payouts.slice(0, 5).map((p, idx) => {
      if ("Cheque Date" in p) {
        return {
          id: p["Id"] || `${idx}`,
          chequeNo: p["Cheque No."] || "—",
          date: p["Cheque Date"],
          totalAmount: parseCleanNumber(p["Total Amount"]),
          netAmount: parseCleanNumber(p["Net Amount"] || p["Total Amount"]),
          tds: parseCleanNumber(p["TDS Amount"]),
          status: p["Payment Status"] || "Paid",
          txn: p["Transaction No"] || "—",
        };
      } else if ("date" in p) {
        return {
          id: `${idx}`,
          chequeNo: `CHQ-${idx + 100}`,
          date: p.date,
          totalAmount: parseCleanNumber(p.amount),
          netAmount: parseCleanNumber(p.amount),
          tds: 0,
          status: "Paid",
          txn: "—",
        };
      }
      return {
        id: `${idx}`,
        chequeNo: "—",
        date: "—",
        totalAmount: 0,
        netAmount: 0,
        tds: 0,
        status: "Paid",
        txn: "—",
      };
    });
  }, [payouts]);

  const totalRecent = recentList.reduce((acc, p) => acc + p.netAmount, 0);

  return (
    <Card className="border bg-card/75 backdrop-blur-md rounded-3xl p-2 sm:p-4 flex flex-col justify-between">
      <CardHeader className="p-4 sm:p-6 pb-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
                <ReceiptText className="size-5" />
              </span>
              <CardTitle className="text-xl sm:text-2xl font-bold inter">
                Recent Disbursements
              </CardTitle>
            </div>
            <CardDescription className="text-sm mt-1">
              Latest weekly commission cheques credited to account
            </CardDescription>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage("Cheque Data")}
            className="text-sm font-semibold gap-1.5 text-primary hover:text-primary/80 hover:bg-primary/5 -mr-2"
          >
            <span>View All</span>
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0 sm:px-2">
        {recentList.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            No cheque disbursements on record yet.
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-thin">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border/50 text-xs uppercase tracking-wider text-muted-foreground">
                  <TableHead className="py-3 px-5 font-bold">Cheque Date</TableHead>
                  <TableHead className="py-3 px-4 font-bold">Cheque #</TableHead>
                  <TableHead className="py-3 px-4 text-right font-bold">Net Payout</TableHead>
                  <TableHead className="py-3 px-5 text-center font-bold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-sm divide-y divide-border/40">
                {recentList.map((item) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-muted/50 transition-colors border-border/40"
                  >
                    <TableCell className="py-4 px-5 font-semibold text-foreground">
                      <div className="flex flex-col">
                        <span className="text-sm sm:text-base">{item.date}</span>
                        {item.txn !== "—" && (
                          <span className="text-xs font-mono text-muted-foreground truncate max-w-[130px]">
                            {item.txn}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="py-4 px-4 font-mono text-muted-foreground font-medium text-xs sm:text-sm">
                      {item.chequeNo}
                    </TableCell>

                    <TableCell className="py-4 px-4 text-right font-mono font-extrabold text-base sm:text-lg text-emerald-600 dark:text-emerald-400">
                      {formatINR(item.netAmount)}
                    </TableCell>

                    <TableCell className="py-4 px-5 text-center">
                      <Badge
                        variant="outline"
                        className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-xs font-bold py-1 px-2.5 gap-1 inline-flex"
                      >
                        <CheckCircle2 className="size-3" />
                        Paid
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 sm:p-6 pt-3 border-t border-border/50 mt-auto flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2 font-medium">
          <ShieldCheck className="size-4 text-emerald-500" />
          <span>TDS & Admin verified</span>
        </div>
        <div className="font-semibold text-foreground">
          Recent Total:{" "}
          <span className="font-mono font-bold text-primary text-base">
            {formatINR(totalRecent)}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
