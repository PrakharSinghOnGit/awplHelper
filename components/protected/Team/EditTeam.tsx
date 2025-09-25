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
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowUpDown,
  Plus,
  Search,
  ArrowUp,
  ArrowDown,
  X,
  Command,
} from "lucide-react";
import { calcLevel, Levels } from "@/utils/awpl.helper";
import { useProfile, useUpdateLeader } from "@/hooks/useDatabase";
import { ConfirmDialog } from "./ConfirmDialog";
import EditTeamSkeleton from "./EditTeamSkeleton";
import { TeamMember } from "./type";
import { Separator } from "@/components/ui/separator";

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
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const { data, isLoading, error } = useProfile();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [originalMembers, setOriginalMembers] = useState<TeamMember[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [membersToDelete, setMembersToDelete] = useState<number[]>([]);

  const { mutate: updateLeader } = useUpdateLeader();

  useEffect(() => {
    if (data?.team) {
      // Check if there are unsaved changes in localStorage
      const savedChanges = localStorage.getItem("unsaved-team-changes");
      if (savedChanges) {
        try {
          const parsedChanges = JSON.parse(savedChanges);
          setMembers(parsedChanges);
          setOriginalMembers(data.team as TeamMember[]);
          setHasUnsavedChanges(true);
        } catch (error) {
          console.error("Error parsing saved changes:", error);
          setMembers(data.team as TeamMember[]);
          setOriginalMembers(data.team as TeamMember[]);
        }
      } else {
        setMembers(data.team as TeamMember[]);
        setOriginalMembers(data.team as TeamMember[]);
      }
    }
  }, [data?.team]);

  // Add beforeunload listener to prevent closing with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Save changes to localStorage whenever members change
  useEffect(() => {
    if (originalMembers.length > 0 && members.length > 0) {
      const hasChanges =
        JSON.stringify(members) !== JSON.stringify(originalMembers);
      setHasUnsavedChanges(hasChanges);

      if (hasChanges) {
        localStorage.setItem("unsaved-team-changes", JSON.stringify(members));
      } else {
        localStorage.removeItem("unsaved-team-changes");
      }
    }
  }, [members, originalMembers]);

  // Helper function to check if a row has been modified
  const isRowModified = (rowIndex: number): boolean => {
    if (originalMembers.length === 0 || members.length === 0) return false;

    // Row is new if it doesn't exist in original
    if (rowIndex >= originalMembers.length) return true;

    // Compare current member with original
    const currentMember = members[rowIndex];
    const originalMember = originalMembers[rowIndex];

    return JSON.stringify(currentMember) !== JSON.stringify(originalMember);
  };

  // Function to update member data
  const updateMember = (
    index: number,
    field: keyof TeamMember,
    value: string | number
  ) => {
    setMembers((prev) =>
      prev.map((member, i) =>
        i === index ? { ...member, [field]: value } : member
      )
    );
  };

  const columns: ColumnDef<TeamMember>[] = [
    {
      id: "index",
      header: "#",
      cell: ({ row }) => row.index + 1,
      enableSorting: false,
    },
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
      cell: ({ row }) => {
        const member = members[row.index];
        const isEmpty = !member?.name?.trim();

        return (
          <Input
            defaultValue={member?.name || ""}
            onBlur={(e) => updateMember(row.index, "name", e.target.value)}
            className={`border-none bg-transparent p-0 font-medium focus-visible:ring-0 focus-visible:ring-offset-0 ${
              isEmpty ? "placeholder-red-400 dark:placeholder-red-500" : ""
            }`}
            placeholder="Enter Name *"
            required
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
          <Input
            defaultValue={member?.awplId || ""}
            onBlur={(e) =>
              updateMember(row.index, "awplId", e.target.value.toUpperCase())
            }
            className={`border-none bg-transparent p-0 font-mono text-sm font-semibold focus-visible:ring-0 focus-visible:ring-offset-0 ${
              isEmpty ? "placeholder-red-400 dark:placeholder-red-500" : ""
            }`}
            placeholder="Enter ID *"
            required
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
          <Input
            defaultValue={member?.awplPass || ""}
            onBlur={(e) => updateMember(row.index, "awplPass", e.target.value)}
            className={`border-none bg-transparent p-0 font-mono text-sm font-semibold focus-visible:ring-0 focus-visible:ring-offset-0 ${
              isEmpty ? "placeholder-red-400 dark:placeholder-red-500" : ""
            }`}
            placeholder="Enter Pass *"
            required
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
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
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

  const handleAddMember = () => {
    setMembers([
      ...members,
      {
        name: "",
        awplId: "",
        awplPass: "",
        status: "pending",
        levelSao: 0,
        levelSgo: 0,
        validPass: [],
        lastMine: new Date().toISOString(),
        chequeData: [],
        targetData: [],
      },
    ]);
  };

  const handleSaveMember = () => {
    // Validate all members before saving
    const invalidMembers: number[] = [];
    const validatedMembers = members.map((member, index) => {
      const trimmedMember = {
        ...member,
        name: member.name?.trim() || "",
        awplId: member.awplId?.trim().toUpperCase() || "",
        awplPass: member.awplPass?.trim() || "",
        validPass: member.validPass || [],
        lastMine: member.lastMine || new Date().toISOString(),
        status: member.status || ("pending" as const),
        levelSao: member.levelSao || 0,
        levelSgo: member.levelSgo || 0,
        chequeData: member.chequeData || [],
        targetData: member.targetData || [],
      };

      // Check if any required field is empty
      if (
        !trimmedMember.name ||
        !trimmedMember.awplId ||
        !trimmedMember.awplPass
      ) {
        invalidMembers.push(index + 1);
      }

      return trimmedMember;
    });

    // If there are invalid members, show error and don't save
    if (invalidMembers.length > 0) {
      toast.error(
        `Please fill in all required fields for the following members:\n` +
          `Row(s): ${invalidMembers.join(", ")}\n\n` +
          `Required fields: Name, AWPL ID, and AWPL Password`
      );
      return;
    }

    // Check for duplicate AWPL IDs
    const awplIds = validatedMembers.map((m) => m.awplId);
    const duplicateIds = awplIds.filter(
      (id, index) => awplIds.indexOf(id) !== index
    );

    if (duplicateIds.length > 0) {
      toast.error(
        `Duplicate AWPL IDs found: ${[...new Set(duplicateIds)].join(", ")}\n` +
          `Each member must have a unique AWPL ID.`
      );
      return;
    }

    // Update members with cleaned data
    setMembers(validatedMembers);

    // Implement actual save logic here - pass the full leader object with updated team
    if (data?.id) {
      updateLeader(
        {
          ...data,
          team: validatedMembers,
        },
        {
          onSuccess: () => {
            console.log("Saving validated members:", validatedMembers);

            // Clear unsaved changes after successful save
            setOriginalMembers(validatedMembers);
            setHasUnsavedChanges(false);
            localStorage.removeItem("unsaved-team-changes");

            // Show success message
            toast.success(
              `Successfully saved ${validatedMembers.length} team member(s)!`
            );
          },
          onError: (error) => {
            console.error("Error saving team:", error);
            toast.error("Failed to save team. Please try again.");
          },
        }
      );
    } else {
      toast.error("Unable to save: Profile not found");
    }
  };

  const handleDeleteMember = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const indicesToRemove = selectedRows.map((row) => row.index);
    if (selectedRows.length === 0) return;

    setMembersToDelete(indicesToRemove);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteMembers = () => {
    setMembers((prev) =>
      prev.filter((_, index) => !membersToDelete.includes(index))
    );

    // Clear selection after deletion
    setRowSelection({});

    // Show success message
    toast.success(`Successfully removed ${membersToDelete.length} member(s)!`);
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
      {/* CONTROL BAR */}
      <div className="flex flex-col lg:flex-row justify-between">
        <div className="hidden sm:hidden md:block">
          <h2 className="text-xl font-bold tracking-tight">Team Management</h2>
          <p className="text-muted-foreground text-sm">
            Manage your team members and track their progress
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

          {/* ADD / REMOVE BTNS */}

          <Separator orientation="vertical" className="h-6" />
          {table.getFilteredSelectedRowModel().rows.length > 0 ? (
            <button
              onClick={handleDeleteMember}
              className="flex h-10 space-x-2 text-sm cursor-pointer items-center justify-center rounded-lg bg-red-700 dark:bg-red-600/80 px-6 py-2 text-white transition-colors duration-300 dark:hover:bg-red-800 hover:bg-red-600 grow"
            >
              <X size={20} className="shrink-0" />
              <span>Remove</span>
            </button>
          ) : (
            <button
              onClick={handleAddMember}
              className="flex h-10 space-x-1 text-sm cursor-pointer items-center justify-center rounded-lg bg-blue-700 dark:bg-blue-600/80 px-6 py-2 text-white transition-colors duration-300 dark:hover:bg-blue-800 hover:bg-blue-600 grow"
            >
              <Plus size={20} className="shrink-0" />
              <span>Add</span>
            </button>
          )}

          {/* SAVE BTN */}

          <Separator orientation="vertical" className="h-6" />
          <button
            onClick={handleSaveMember}
            className={`flex h-10 space-x-1 text-sm cursor-pointer items-center justify-center rounded-lg px-6 py-2 text-white transition-all duration-300 grow ${
              hasUnsavedChanges
                ? "bg-orange-600 dark:bg-orange-500/80 hover:bg-orange-700 dark:hover:bg-orange-600 shadow-md border-2 border-orange-400 dark:border-orange-300"
                : "bg-green-700 dark:bg-green-600/80 hover:bg-green-800 dark:hover:bg-green-800"
            }`}
          >
            <Command size={20} className="shrink-0" />
            Save
            {hasUnsavedChanges && (
              <div className="w-2 h-2 bg-white rounded-full animate-pulse ml-1" />
            )}
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
                  const isModified = isRowModified(row.index);
                  return (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className={
                        isModified ? "bg-yellow-50 dark:bg-yellow-900/20" : ""
                      }
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
                    No team members found. Click &quot;Add Member&quot; to get
                    started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* DELETE CONFIRMATION DIALOG */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Remove Team Members"
        description={`Are you sure you want to remove ${
          membersToDelete.length
        } selected member${
          membersToDelete.length > 1 ? "s" : ""
        }? This action cannot be undone.`}
        onConfirm={confirmDeleteMembers}
        confirmText="Remove"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}

export default EditTeam;
