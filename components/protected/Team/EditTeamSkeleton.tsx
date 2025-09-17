import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const EditTeamSkeleton = () => {
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-2">
        <Skeleton className="h-10 w-[300px]" />
        <Skeleton className="h-10 w-[100px]" />
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <div className="p-4">
          {/* Table Header */}
          <div className="flex gap-4 pb-4">
            <Skeleton className="h-8 w-[100px]" />
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-8 w-[150px]" />
            <Skeleton className="h-8 w-[100px]" />
          </div>

          {/* Table Rows */}
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex gap-4 py-4">
              <Skeleton className="h-6 w-[100px]" />
              <Skeleton className="h-6 w-[200px]" />
              <Skeleton className="h-6 w-[150px]" />
              <Skeleton className="h-6 w-[100px]" />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Skeleton className="h-4 w-[200px]" />
        <div className="space-x-2">
          <Skeleton className="h-9 w-[80px] inline-block" />
          <Skeleton className="h-9 w-[80px] inline-block" />
        </div>
      </div>
    </div>
  );
};

export default EditTeamSkeleton;
