"use client";

import * as React from "react";

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
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { TeamMember } from "@/types";
import { DownloadIcon, Plus, Search, ArrowUpDown, Edit } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const data: TeamMember[] = [
  {
    id: "aabbcc",
    level: "Ambassador",
    pass: "5135",
    name: "vv",
  },
  {
    id: "ababab",
    level: "Ambassador",
    pass: "5135",
    name: "b",
  },
  {
    id: "abcabc",
    level: "Ambassador",
    pass: "5135",
    name: "c",
  },
  {
    id: "acacac",
    level: "Ambassador",
    pass: "5135",
    name: "de",
  },
  {
    id: "cacaca",
    level: "Ambassador",
    pass: "5135",
    name: "fg",
  },
  {
    id: "bcbcbc",
    level: "Ambassador",
    pass: "5135",
    name: "zz",
  },
];

function handleEdit(id: string) {
  console.log(id);
}

function handleExport() {}

export const columns: ColumnDef<TeamMember>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          className="has-[>svg]:px-0 m-0 p-0 w-full rounded-none justify-start"
          variant="ghost"
          onClick={() =>
            column.toggleSorting(
              !column.getIsSorted()
                ? false
                : column.getIsSorted() === "asc"
                ? true
                : false
            )
          }
        >
          Name
          <ArrowUpDown strokeWidth={2} />
        </Button>
      );
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "id",
    header: "User Id",
    cell: ({ row }) => <div className="uppercase">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "pass",
    header: "Pass",
    cell: ({ row }) => row.getValue("pass"),
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Edit",
    cell: ({ row }) => {
      return (
        <Button onClick={() => handleEdit(row.id)} variant="outline" size="sm">
          <Edit />
        </Button>
      );
    },
  },
];

export default function EditTeam() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
  });

  return (
    <div className="flex flex-col gap-4 w-full pt-3 grow">
      <div className="flex flex-row gap-2">
        <Input
          icon={<Search size={15} />}
          placeholder="Search..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
        />
        <Button
          onClick={() => handleEdit("")}
          variant="default"
          className="font-semibold gap-1"
        >
          <Plus strokeWidth={3} />
          Add
        </Button>
        <Button onClick={handleExport} variant="secondary">
          <DownloadIcon />
          Export
        </Button>
      </div>
      <div className="border-2 border-color-border grow rounded-md overflow-scroll">
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
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
