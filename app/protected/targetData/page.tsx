"use client";

import { useState } from "react";
import {
  SortingState,
  ColumnDef,
  flexRender,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { ArrowUpDown, Info } from "lucide-react";
import { TeamMember } from "@/types";
import { Button } from "@/components/ui/button";
import { useTeam } from "../context/TeamContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Details from "../../../components/Details";
import { getLevel } from "@/lib/utils";
import { DataSearchAndExport } from "@/components/DataSearchAndExport";

export default function TargetData() {
  const { members, loading } = useTeam();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const showInfo = (member: TeamMember) => {
    setSelectedMember(member);
    setIsDialogOpen(true);
  };

  const columnsData: ColumnDef<TeamMember>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
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
      ),
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "awpl_id",
      header: "User Id",
      cell: ({ row }) => (
        <div className="uppercase">{row.getValue("awpl_id")}</div>
      ),
    },
    {
      accessorKey: "levelSao",
      header: "Rank",
      cell: ({ row }) =>
        getLevel(row.getValue("levelSao"), row.getValue("levelSgo")),
    },
    {
      accessorKey: "targetSao",
      header: "Sao",
      cell: ({ row }) => row.getValue("targetSao"),
    },
    {
      accessorKey: "targetSgo",
      header: "Sgo",
      cell: ({ row }) => row.getValue("targetSgo"),
    },
    {
      id: "actions",
      enableHiding: false,
      header: "Info",
      cell: ({ row }) => {
        const member = row.original;
        return (
          <Button onClick={() => showInfo(member)} variant="outline" size="sm">
            <Info />
          </Button>
        );
      },
    },
  ];

  const table = useReactTable({
    data: members,
    columns: columnsData,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="flex flex-col gap-3 w-full pt-3 grow">
      <DataSearchAndExport mems={members} table={table} />
      <div className="border-1 border-color-border grow rounded-md overflow-scroll">
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
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columnsData.length}
                  className="h-24 text-center"
                >
                  Loading team members...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
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
                  colSpan={columnsData.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Details
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        member={selectedMember}
      />
    </div>
  );
}
