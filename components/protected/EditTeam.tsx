"use client";

import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
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
import {
  useMembers,
  useCreateMember,
  useUpdateMember,
  useDeleteMember,
} from "@/hooks/useDatabase";
import { calcLevel, Levels } from "@/utils/awpl.helper";
import { EditMember } from "./EditMemberDialog";

// Team member type based on your database structure
export type TeamMember = {
  id: string;
  name: string | null;
  awpl_id: string;
  awpl_pass: string | null;
  levelSao: number | null;
  levelSgo: number | null;
  targetSao: number | null;
  targetSgo: number | null;
  status_flag: string | null;
  created_at: string | null;
  last_updated: string | null;
  chequeData: unknown | null;
  valid_passwords: string[] | null;
};

const StatusBadge = ({ status }: { status: string | null }) => {
  const getStatusColor = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "error":
      case "red":
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

  const { data: members = [], isLoading, error } = useMembers();
  const createMember = useCreateMember();
  const updateMember = useUpdateMember();
  const deleteMember = useDeleteMember();

  React.useEffect(() => {
    const handleEditMember = (event: CustomEvent) => {
      setSelectedMember(event.detail);
      setEditDialogOpen(true);
    };

    const handleDeleteMember = (event: CustomEvent) => {
      const memberId = event.detail.id;
      if (confirm("Are you sure you want to delete this member?")) {
        deleteMember.mutate(memberId);
      }
    };

    document.addEventListener("editMember", handleEditMember as EventListener);
    document.addEventListener(
      "deleteMember",
      handleDeleteMember as EventListener
    );

    return () => {
      document.removeEventListener(
        "editMember",
        handleEditMember as EventListener
      );
      document.removeEventListener(
        "deleteMember",
        handleDeleteMember as EventListener
      );
    };
  }, [deleteMember]);

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
      accessorKey: "awpl_id",
      header: "AWPL ID",
      cell: ({ row }) => (
        <div className="font-mono text-sm font-semibold">
          {row.getValue("awpl_id") || "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "awpl_pass",
      header: "AWPL Pass",
      cell: ({ row }) => (
        <div className="font-mono text-sm font-semibold">
          {row.getValue("awpl_pass") || "N/A"}
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
      accessorKey: "levelSao",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Level SAO
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
        <div className="text-center font-mono font-semibold">
          {row.getValue("levelSao") || 0}
        </div>
      ),
    },
    {
      accessorKey: "levelSgo",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Level SGO
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
        <div className="text-center font-mono font-bold">
          {row.getValue("levelSgo") || 0}
        </div>
      ),
    },
    {
      accessorKey: "status_flag",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.getValue("status_flag")} />,
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
                  navigator.clipboard.writeText(member.awpl_id || "")
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
    data: members,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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
    memberData: Partial<TeamMember> & { id?: string },
    isNew: boolean
  ) => {
    if (isNew) {
      // Create new member - convert to Insert type
      const insertData = {
        awpl_id: memberData.awpl_id || "",
        name: memberData.name,
        awpl_pass: memberData.awpl_pass,
      };
      createMember.mutate(insertData, {
        onSuccess: () => {
          setEditDialogOpen(false);
          setSelectedMember(null);
        },
        onError: (error) => {
          console.error("Failed to create member:", error);
        },
      });
    } else {
      // Update existing member
      if (memberData.id) {
        // Convert to Update type - only include fields that can be updated
        const updateData = {
          awpl_id: memberData.awpl_id,
          name: memberData.name,
          awpl_pass: memberData.awpl_pass,
          levelSao: memberData.levelSao,
          levelSgo: memberData.levelSgo,
          targetSao: memberData.targetSao,
          targetSgo: memberData.targetSgo,
          status_flag: memberData.status_flag,
        };
        updateMember.mutate(
          {
            id: memberData.id,
            updates: updateData,
          },
          {
            onSuccess: () => {
              setEditDialogOpen(false);
              setSelectedMember(null);
            },
            onError: (error) => {
              console.error("Failed to update member:", error);
            },
          }
        );
      }
    }
  };

  const handleDeleteMember = (id: string) => {
    deleteMember.mutate(id, {
      onSuccess: () => {
        console.log("Member deleted successfully");
      },
      onError: (error) => {
        console.error("Failed to delete member:", error);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading team members...</p>
        </div>
      </div>
    );
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
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Team Management</h2>
          <p className="text-muted-foreground">
            Manage your team members and track their progress
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedMember(null);
            setEditDialogOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Member
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2 flex-1">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter by name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
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
      <div className="rounded-md border">
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

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
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
  );
}

// Default export for compatibility
export default EditTeam;
