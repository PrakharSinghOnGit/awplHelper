"use client";

import { TrendingUp } from "lucide-react";
import {
  Label,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

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
import { getRequiredSp } from "@/utils/awpl.helper";

export function LevelInfo({
  type,
  sp,
}: {
  type: "SAO" | "SGO";
  sp: number | null;
}) {
  if (sp === null) {
    sp = 0;
  }
  const req = getRequiredSp(type, sp);
  const percentage = (sp / req) * 100;
  const clr = type === "SAO" ? 2 : 5;
  const chartData = [
    {
      name: "progress",
      value: percentage,
      fill: `hsl(var(--chart-${clr}))`,
    },
  ];

  return (
    <Card
      className={cn("flex flex-col relative", sp >= req && "border-green-500")}
    >
      <CardHeader className="items-center pb-0">
        <CardTitle>Next Level Progress</CardTitle>
        <CardDescription>{type} SP done</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 justify-center items-center">
        <ChartContainer
          config={{} satisfies ChartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={360}
            innerRadius={80}
            outerRadius={150}
            barSize={35}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} />
            <RadialBar
              dataKey="value"
              cornerRadius={10}
              background={{
                fill: "hsl(var(--muted))",
              }}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {percentage.toFixed(0)}%
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Pending {type} SP:
          <p
            className="font-black"
            style={{ color: `hsl(var(--chart-${clr}))` }}
          >
            {(req - sp).toLocaleString()}
          </p>
        </div>
        <div className="text-muted-foreground leading-none flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Showing sales progress till next level
        </div>
      </CardFooter>
    </Card>
  );
}
