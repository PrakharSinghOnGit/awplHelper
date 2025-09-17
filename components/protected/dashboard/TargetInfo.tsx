"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type TargetProp = {
  name: string;
  reqSAO: number;
  reqSGO: number;
  penSAO: number;
  penSGO: number;
}[];

export function TargetInfo({ data }: { data: TargetProp }) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader className="text-center pb-0">
          <CardTitle>Target Progress</CardTitle>
        </CardHeader>
        <CardContent className="p-6 flex flex-col gap-4">
          <p className="text-center text-sm text-muted-foreground">
            No target data available.
          </p>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardHeader className="text-center pb-0">
        <CardTitle>Target Progress</CardTitle>
      </CardHeader>

      <CardContent className="p-6 flex flex-col gap-4">
        {data.map((item, index) => {
          const saoCompleted = item.reqSAO - item.penSAO;
          const sgoCompleted = item.reqSGO - item.penSGO;

          const saoPercent = Math.min((saoCompleted / item.reqSAO) * 100, 100);
          const sgoPercent = Math.min((sgoCompleted / item.reqSGO) * 100, 100);

          return (
            <div
              key={index}
              className="border rounded-xl p-4 shadow-sm relative mt-3"
            >
              <h3 className="text-xl -translate-y-1/2 absolute top-0 left-3 bg-card px-3 font-semibold">
                {item.name}
              </h3>

              {/* SAO Section */}
              <div className="mb-4 pt-1">
                <div className="flex justify-between mb-1 text-xs">
                  <span className="font-medium text-muted-foreground">SAO</span>
                  <span className="text-muted-foreground font-mono">
                    {saoCompleted.toLocaleString()} /{" "}
                    {item.reqSAO.toLocaleString()}
                  </span>
                </div>
                <Progress
                  childClassName="bg-green-500"
                  value={saoPercent}
                  className="h-4"
                  animDuration={1000}
                />
              </div>

              {/* SGO Section */}
              <div>
                <div className="flex justify-between mb-1 text-xs">
                  <span className="font-medium text-muted-foreground">SGO</span>
                  <span className="text-muted-foreground font-mono">
                    {sgoCompleted.toLocaleString()} /{" "}
                    {item.reqSGO.toLocaleString()}
                  </span>
                </div>
                <Progress
                  childClassName="bg-indigo-500"
                  value={sgoPercent}
                  className="h-4"
                  animDuration={1500}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
