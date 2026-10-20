"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-6 sm:space-y-8 w-full pb-12">
      {/* 1. Header Banner Skeleton */}
      <div className="rounded-3xl border bg-card/50 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-5 sm:gap-6">
          <Skeleton className="size-20 rounded-2xl" />
          <div className="space-y-2.5">
            <Skeleton className="h-8 w-60" />
            <Skeleton className="h-5 w-40" />
            <div className="flex gap-2.5 pt-1">
              <Skeleton className="h-6 w-32 rounded-full" />
              <Skeleton className="h-6 w-28 rounded-full" />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-11 w-40 rounded-xl" />
        </div>
      </div>

      {/* 2. KPI 4 Cards Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border bg-card/50 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="size-9 rounded-xl" />
            </div>
            <Skeleton className="h-9 w-36" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>

      {/* 3. Milestone Tracker Skeleton */}
      <div className="rounded-3xl border bg-card/50 p-6 sm:p-8 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-7 w-52" />
          <Skeleton className="h-6 w-28 rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
        </div>
      </div>

      {/* 4. Chart & Table Split Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-3xl border bg-card/50 p-6 sm:p-8 space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-8 w-32 rounded-xl" />
          </div>
          <Skeleton className="h-72 rounded-2xl" />
        </div>
        <div className="rounded-3xl border bg-card/50 p-6 sm:p-8 space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-6 w-20" />
          </div>
          <Skeleton className="h-72 rounded-2xl" />
        </div>
      </div>
    </div>
  );
};
