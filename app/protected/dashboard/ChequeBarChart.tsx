"use client";

import { MoveRight, Shredder, TrendingDown, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

const chartConfig = {
  a0: {
    color: "var(--color-blue-300)",
  },
  a1: {
    color: "var(--color-blue-300)",
  },
  a2: {
    color: "var(--color-blue-400)",
  },
  a3: {
    color: "var(--color-blue-500)",
  },
  a4: {
    color: "var(--color-blue-600)",
  },
  a5: {
    color: "var(--color-blue-600)",
  },
  a6: {
    color: "var(--color-blue-700)",
  },
  a7: {
    color: "var(--color-blue-800)",
  },
} satisfies ChartConfig;
export function ChequeBarChart({
  data,
  className,
}: {
  data: { date: string; amount: number }[];
  className?: string;
}) {
  const chartData: { date: string; amount: number; fill: string }[] = [];
  data.forEach((d, i) =>
    chartData.push({
      date: d.date,
      amount: d.amount,
      fill: `var(--color-a${i})`,
    })
  );

  function calculateLinearRegressionSlope(): number {
    const arr = data.map((el) => el.amount);
    const n = arr.length;
    if (n < 2) return 0;
    let sumX = 0,
      sumY = 0,
      sumXY = 0,
      sumX2 = 0;
    for (let i = 0; i < n; i++) {
      sumX += i;
      sumY += arr[i];
      sumXY += i * arr[i];
      sumX2 += i * i;
    }
    const numerator = n * sumXY - sumX * sumY;
    const denominator = n * sumX2 - sumX * sumX;
    if (denominator === 0) {
      return 0;
    }
    return numerator / denominator;
  }

  function getTrendStringWithRegression() {
    const arr = data.map((el) => el.amount);
    const duration = arr.length;
    if (duration < 2) {
      return (
        <div className="flex gap-2 leading-none font-medium">
          Not enough data to determine trend.
          <Shredder className="h-4 w-4" />
        </div>
      );
    }

    const slope = calculateLinearRegressionSlope();

    if (Math.abs(slope) < 1e-6) {
      return (
        <div className="flex gap-2 leading-none font-medium">
          Trend is flat over the last ${duration} days.
          <MoveRight className="h-4 w-4" />
        </div>
      );
    }

    const direction = slope > 0 ? "up" : "down";
    const dirIcon =
      slope > 0 ? (
        <TrendingUp className="h-4 w-4" />
      ) : (
        <TrendingDown className="h-4 w-4" />
      );
    const averageValue = arr.reduce((a, b) => a + b, 0) / duration;
    const percentageChangePerDay = Math.abs((slope / averageValue) * 100);
    const totalChangePercentage = percentageChangePerDay * (duration - 1);
    return (
      <div className="flex gap-2 leading-none font-medium">
        Trending {direction} by {totalChangePercentage.toFixed(0)}% last{" "}
        {duration} days. {dirIcon}
      </div>
    );
  }

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Check Data</CardTitle>
        <CardDescription>
          {data.length === 0
            ? "No data"
            : `from ${data[0].date} to ${data[data.length - 1].date}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, -3).replaceAll("-", "/")}
            />
            <Bar dataKey="amount" radius={8}>
              <LabelList
                position="top"
                offset={12}
                formatter={(value: number) => value.toLocaleString()}
                className="fill-foreground"
                fontSize={10}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {getTrendStringWithRegression()}
        <div className="text-muted-foreground leading-none">
          Total earned in last {data.length} days: ₹
          {data.reduce((a, cv) => a + cv.amount, 0).toLocaleString()}
        </div>
      </CardFooter>
    </Card>
  );
}
