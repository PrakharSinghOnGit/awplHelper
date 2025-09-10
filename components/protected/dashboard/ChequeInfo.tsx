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
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {} satisfies ChartConfig;

export function ChequeInfo({
  data,
}: {
  data: { date: string; amount: number }[];
}) {
  const chartData: { date: string; amount: number; fill: string }[] = data.map(
    (d) => {
      return {
        date: d.date,
        amount: d.amount,
        fill: `hsl(var(--chart-1))`,
      };
    }
  );

  // Calculate chart dimensions for scrollability
  const minBarWidth = 60; // Minimum width per bar in pixels
  const maxBarsVisible = {
    mobile: 4, // Show max 3 bars on mobile
    tablet: 6, // Show max 5 bars on tablet
    desktop: 10, // Show max 7 bars on desktop
  };

  // Calculate the required width based on data length
  const chartMinWidth = Math.max(data.length * minBarWidth, 300);

  // Determine if scrolling is needed based on screen size
  const shouldScroll = data.length > maxBarsVisible.mobile;

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
    <Card className="col-span-1 md:col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle>Check Data</CardTitle>
        <CardDescription>
          {data.length === 0
            ? "No data"
            : `from ${data[0].date} to ${data[data.length - 1].date}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[400px] px-5">
        <div
          className={`
            h-full w-full
            ${
              shouldScroll
                ? "overflow-x-auto overflow-y-hidden"
                : "overflow-hidden"
            }
            scrollbar-thin
            ${data.length > maxBarsVisible.mobile ? "sm:overflow-x-auto" : ""}
            ${data.length > maxBarsVisible.tablet ? "md:overflow-x-auto" : ""}
            ${data.length > maxBarsVisible.desktop ? "lg:overflow-x-auto" : ""}
          `}
        >
          <div
            className="h-full"
            style={{
              minWidth: shouldScroll ? `${chartMinWidth}px` : "100%",
              width: shouldScroll ? `${chartMinWidth}px` : "100%",
            }}
          >
            <ChartContainer
              style={{ height: "100%", width: "100%" }}
              config={chartConfig}
            >
              <BarChart
                accessibilityLayer
                data={chartData}
                margin={{
                  top: 20,
                }}
                width={shouldScroll ? chartMinWidth : undefined}
              >
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      className="w-[150px]"
                      nameKey="views"
                      labelFormatter={(value) => {
                        // Split the date and rearrange to create valid date object
                        const [day, month, year] = value.split("-");
                        const date = new Date(`20${year}-${month}-${day}`);
                        return date.toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        });
                      }}
                    />
                  }
                />
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => {
                    // Keep only day and month for X-axis
                    const [day, month] = value.split("-");
                    return `${day}/${month}`;
                  }}
                />
                <Bar dataKey="amount" radius={[8, 8, 2, 2]}>
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
          </div>
        </div>
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
