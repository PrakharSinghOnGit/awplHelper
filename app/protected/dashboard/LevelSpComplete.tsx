"use client";

import { TrendingUp } from "lucide-react";
import { RadialBar, RadialBarChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { cn, getNormalizedCompletedSp } from "@/lib/utils";
import { CountingNumber } from "../../../components/animate-ui/text/counting-number";

const chartConfig = {
  Sp: {
    label: "sp",
  },
  sao: {
    label: "SAO sp",
    color: "var(--chart-2)",
  },
  sgo: {
    label: "SGO sp",
    color: "var(--chart-4)",
  },
  ttl: {
    label: "Total",
    color: "var(--card)",
  },
} satisfies ChartConfig;

export function LevelSPComplete({
  saosp,
  sgosp,
  className,
}: {
  saosp: number;
  sgosp: number;
  className?: string;
}) {
  const { psao, psgo, ncsao, ncsgo } = getNormalizedCompletedSp(saosp, sgosp);
  const chartData = [
    { label: "ttl", Sp: 100, fill: "var(--color-ttl)" },
    { label: "saoSP", Sp: ncsao, fill: "var(--color-sao)" },
    { label: "sgoSP", Sp: ncsgo, fill: "var(--color-sgo)" },
  ];

  const percentage = (ncsao + ncsgo) / 2;

  return (
    <Card className={cn("flex flex-col relative", className)}>
      <CardHeader className="items-center pb-0">
        <CardTitle>Next Level Progress</CardTitle>
        <CardDescription>SAO, SGO sp done</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={360}
            innerRadius={50}
            outerRadius={140}
            startAngle={0}
            barSize={20}
          >
            <RadialBar dataKey="Sp" background cornerRadius={10} />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <div className="flex absolute left-1/2 top-1/2 -translate-1/2">
        <CountingNumber number={percentage} className="text-4xl font-black" />
        <p>%</p>
      </div>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Pending sao:
          <p className="font-black text-chart-2">{psao.toLocaleString()}</p>,
          Pending sgo:
          <p className="font-black text-chart-4">{psgo.toLocaleString()}</p>
        </div>
        <div className="text-muted-foreground leading-none flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Showing sales progress till next level
        </div>
      </CardFooter>
    </Card>
  );
}
