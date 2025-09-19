"use client";

import React, { useState, useEffect } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  MoreHorizontal,
  ArrowUpDown,
  ChevronDown,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { calcLevel, Levels } from "@/utils/awpl.helper";
import { EditMember } from "./EditMemberDialog";
import { useProfile } from "@/hooks/useDatabase";

import EditTeamSkeleton from "./EditTeamSkeleton";
import { TeamMember } from "./type";

const StatusBadge = ({ status }: { status: string | null }) => {
  const getStatusColor = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case "ok":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "wrong":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <Badge
      variant="outline"
      className={`${getStatusColor(status)} font-medium`}
    >
      {status || "Unknown"}
    </Badge>
  );
};

export function EditTeam() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const { data, isLoading, error } = useProfile();
  const [members, setMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    if (data?.team) {
      setMembers(data.team as TeamMember[]);
    }
  }, [data?.team]);

  const columns: ColumnDef<TeamMember>[] = [
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
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name") || "No Name"}</div>
      ),
    },
    {
      accessorKey: "awplId",
      header: "AWPL ID",
      cell: ({ row }) => (
        <div className="font-mono text-sm font-semibold">
          {row.getValue("awplId") || "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "awplPass",
      header: "AWPL Pass",
      cell: ({ row }) => (
        <div className="font-mono text-sm font-semibold">
          {row.getValue("awplPass") || "N/A"}
        </div>
      ),
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
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const member = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(member.awplId || "")
                }
              >
                Copy AWPL ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  document.dispatchEvent(
                    new CustomEvent("editMember", { detail: member })
                  );
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit member
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  document.dispatchEvent(
                    new CustomEvent("deleteMember", { detail: member })
                  );
                }}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete member
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: members || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleSaveMember = (
    awplId: string,
    awplPass: string,
    name: string,
    isNew: boolean
  ) => {
    if (isNew) {
      if (members.find((m) => m.awplId === awplId)) {
        alert("A member with this AWPL ID already exists.");
        return;
      }
      const newMember: TeamMember = {
        awplId: awplId.trim().toUpperCase(),
        awplPass: awplPass.trim(),
        name: name.trim(),
        levelSao: 0,
        levelSgo: 0,
        status: "pending",
        chequeData: [],
        targetData: [],
        lastMine: "",
      };
      const updatedMembers = [...members, newMember];
      setMembers(updatedMembers);
    } else {
      const updatedMembers = members.map((m) =>
        m.awplId === awplId
          ? { ...m, awplPass: awplPass.trim(), name: name.trim() }
          : m
      );
      setMembers(updatedMembers);
    }
  };

  const handleDeleteMember = (awplId: string) => {
    console.log("Deleting member with AWPL ID:", awplId);
  };

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
      {/* Header */}
      <div className="flex items-center justify-between p-4 shrink-0">
        <div className="hidden sm:block">
          <h2 className="text-xl font-bold tracking-tight">Team Management</h2>
          <p className="text-muted-foreground text-sm">
            Manage your team members and track their progress
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedMember(null);
            setEditDialogOpen(true);
          }}
          className="flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="h-4 w-4" />
          Add Member
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-2 p-4 shrink-0">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <Input
            placeholder="Filter by name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="min-w-0"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="shrink-0">
              <Filter className="mr-2 h-4 w-4" />
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuItem
                    key={column.id}
                    className="capitalize"
                    onClick={() =>
                      column.toggleVisibility(!column.getIsVisible())
                    }
                  >
                    <Checkbox
                      className="mr-2"
                      checked={column.getIsVisible()}
                      onChange={() =>
                        column.toggleVisibility(!column.getIsVisible())
                      }
                    />
                    {column.id}
                  </DropdownMenuItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto px-4">
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
                    No team members found. Click &quot;Add Member&quot; to get
                    started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Selection Info */}
        <div className="flex items-center justify-end p-4 shrink-0">
          <div className="text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
        </div>

        {/* Edit Member Dialog */}
        <EditMember
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          member={selectedMember}
          onSave={handleSaveMember}
          onDelete={handleDeleteMember}
        />
      </div>
    </div>
  );
}

export default EditTeam;
