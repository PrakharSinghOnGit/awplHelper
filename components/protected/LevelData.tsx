"use client";

import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
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
import { ArrowUpDown, Search, ArrowUp, ArrowDown, Save } from "lucide-react";
import { calcLevel, Levels } from "@/utils/awpl.helper";
import { useProfile } from "@/hooks/useDatabase";

import EditTeamSkeleton from "./Team/EditTeamSkeleton";
import { TeamMember } from "./Team/type";
import { Separator } from "@/components/ui/separator";

export function EditTeam() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const { data, isLoading, error } = useProfile();
  const [members] = useState<TeamMember[]>([]);
  const team = data?.team || "";

  const exportData = () => {
    const header = ["Name", "AWPL ID", "AWPL Pass", "Level"];
    const rows = members.map((member) => {
      const level = calcLevel(member.levelSao || 0, member.levelSgo || 0);
      return [member.name, member.awplId, member.awplPass, level];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [header, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `team_${team || "data"}.csv`);
    document.body.appendChild(link); // Required for FF

    link.click();
    document.body.removeChild(link);
  };

  const columns: ColumnDef<TeamMember>[] = [
    // sno
    {
      id: "index",
      header: "#",
      cell: ({ row }) => row.index + 1,
      enableSorting: false,
    },
    // name
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            {column.getIsSorted() === "asc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        const member = members[row.index];
        const isEmpty = !member?.name?.trim();

        return (
          <span
            defaultValue={member?.name || ""}
            className={`border-none bg-transparent p-0 font-medium focus-visible:ring-0 focus-visible:ring-offset-0 ${
              isEmpty ? "placeholder-red-400 dark:placeholder-red-500" : ""
            }`}
          />
        );
      },
    },
    {
      accessorKey: "awplId",
      header: "AWPL ID",
      cell: ({ row }) => {
        const member = members[row.index];
        const isEmpty = !member?.awplId?.trim();

        return (
          <span
            defaultValue={member?.awplId || ""}
            className={`border-none bg-transparent p-0 font-mono text-sm font-semibold focus-visible:ring-0 focus-visible:ring-offset-0 ${
              isEmpty ? "placeholder-red-400 dark:placeholder-red-500" : ""
            }`}
          />
        );
      },
    },
    {
      accessorKey: "awplPass",
      header: "AWPL Pass",
      cell: ({ row }) => {
        const member = members[row.index];
        const isEmpty = !member?.awplPass?.trim();

        return (
          <span
            defaultValue={member?.awplPass || ""}
            className={`border-none bg-transparent p-0 font-mono text-sm font-semibold focus-visible:ring-0 focus-visible:ring-offset-0 ${
              isEmpty ? "placeholder-red-400 dark:placeholder-red-500" : ""
            }`}
          />
        );
      },
    },
    {
      accessorKey: "level",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Level
            {column.getIsSorted() === "asc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        const levelSao = row.original.levelSao || 0;
        const levelSgo = row.original.levelSgo || 0;
        const level = calcLevel(levelSao, levelSgo);

        return <p>{level}</p>;
      },
      sortingFn: (rowA, rowB) => {
        const levelA = calcLevel(
          rowA.original.levelSao || 0,
          rowA.original.levelSgo || 0
        );
        const levelB = calcLevel(
          rowB.original.levelSao || 0,
          rowB.original.levelSgo || 0
        );

        const indexA = Levels.indexOf(levelA);
        const indexB = Levels.indexOf(levelB);

        return indexA - indexB;
      },
    },
  ];

  const table = useReactTable({
    data: members || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, value) => {
      const member = row.original as TeamMember;
      const searchableFields = [
        member.name?.toLowerCase() || "",
        member.awplId?.toLowerCase() || "",
        member.awplPass?.toLowerCase() || "",
      ];
      return searchableFields.some((field) =>
        field.includes(value.toLowerCase())
      );
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
      rowSelection,
    },
  });

  if (isLoading) {
    return <EditTeamSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-destructive mb-2">Failed to load team members</p>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "An unknown error occurred"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* CONTROL BAR */}
      <div className="flex flex-col lg:flex-row justify-between">
        <div className="hidden sm:hidden md:block">
          <h2 className="text-xl font-bold tracking-tight">Level Data</h2>
          <p className="text-muted-foreground text-sm">
            Manage your team members and their AWPL details
          </p>
        </div>
        <div className="md:pt-3 lg:pt-0 w-full flex items-center gap-2 lg:max-w-fit">
          <div className="flex h-10 items-center justify-center space-x-1 overflow-hidden whitespace-nowrap rounded-lg bg-neutral-200/60 dark:bg-neutral-600/80 pl-2.5 text-neutral-600 dark:text-neutral-200 grow">
            <Search size={20} className="shrink-0" />
            <Input
              placeholder="Search by name, ID, or password"
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(String(event.target.value))}
              className="min-w-0"
            />
          </div>

          {/* SAVE BTN */}

          <Separator orientation="vertical" className="h-6" />
          <button
            onClick={exportData}
            className={
              "flex h-10 space-x-1 text-sm cursor-pointer items-center justify-center rounded-lg px-6 py-2 text-white transition-all duration-300 grow bg-green-700 dark:bg-green-600/80 hover:bg-green-800 dark:hover:bg-green-800"
            }
          >
            <Save size={20} className="shrink-0" />
            Export
          </button>
        </div>
      </div>

      <div className="flex mt-3 items-center justify-between text-muted-foreground">
        <span>Click on fields to edit</span>
        <span className="text-sm">
          {table.getFilteredSelectedRowModel().rows.length} /{" "}
          {table.getFilteredRowModel().rows.length} selected
        </span>
      </div>

      <Separator className="my-3" />

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <div className="rounded-md border w-full min-w-[640px]">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => {
                  return (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="relative">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No team members found. Add Members to see them here.
                    <p>if already added wait for backend to fetch data</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default EditTeam;
