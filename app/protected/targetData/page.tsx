"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  SortingState,
  ColumnDef,
  flexRender,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { ArrowUpDown, DownloadIcon, Info, Search } from "lucide-react";
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
import Details from "./Details";

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
      accessorKey: "level",
      header: "level",
      cell: ({ row }) => row.getValue("level"),
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
      header: "Sgo",
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

  const handleExport = () => {
    if (!members.length) return;

    let csv = "sno, name, id, pass\n";
    members.forEach((member, index) => {
      csv += `${index + 1}, ${member.name}, ${member.awpl_id}, ${
        member.awpl_pass
      }\n`;
    });
    const d = new Date();
    const timestamp = `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
    const filename = `Level Data ${timestamp}.csv`;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;

    if (navigator.userAgent.toLowerCase().includes("android")) {
      window.open(url, "_blank");
    } else {
      link.click();
    }

    URL.revokeObjectURL(url);
  };

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
        <Button onClick={handleExport} variant="secondary">
          <DownloadIcon />
          Download
        </Button>
      </div>
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
