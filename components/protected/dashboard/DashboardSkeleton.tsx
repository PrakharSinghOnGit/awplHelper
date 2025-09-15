import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const DashboardSkeleton = () => {
  return (
    <div className="grid gap-3 lg:gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-flow-dense break-inside-avoid">
      <div className="col-span-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-20 h-20" />
            <div className="flex flex-col gap-3">
              <Skeleton className="w-32 h-5" />
              <Skeleton className="w-14 h-4" />
            </div>
          </div>
          <div className="hidden sm:block">
            <Skeleton className="w-32 h-5 mb-3" />
            <Skeleton className="w-12 h-4" />
          </div>
        </div>
      </div>
      <Skeleton className="h-80" />
      <Skeleton />
      <Skeleton />
      <Skeleton className="col-span-full h-80" />
    </div>
  );
};
