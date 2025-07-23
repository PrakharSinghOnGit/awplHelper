"use client";

import { useState } from "react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
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
import {
  DownloadIcon,
  Plus,
  Search,
  ArrowUpDown,
  Edit,
  Trash2,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { EditMember } from "@/app/protected/edit-team/EditMember";
import { useTeam } from "@/app/protected/context/TeamContext";
import { useProfile } from "@/app/protected/context/ProfileContext";

export default function EditTeam() {
  const { members, loading, addMember, updateMember, deleteMembers } =
    useTeam();
  const { profile } = useProfile();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [confirmMultiDeleteOpen, setConfirmMultiDeleteOpen] = useState(false);

  const columnsData: ColumnDef<TeamMember>[] = [
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
      accessorKey: "awpl_pass",
      header: "Pass",
      cell: ({ row }) => row.getValue("awpl_pass"),
    },
    {
      id: "actions",
      enableHiding: false,
      header: "Edit",
      cell: ({ row }) => {
        const member = row.original;
        return (
          <Button
            onClick={() => handleEdit(false, member)}
            variant="outline"
            size="sm"
          >
            <Edit />
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
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
  });

  const handleEdit = (isNew: boolean, member: TeamMember | null) => {
    if (isNew) {
      setSelectedMember(null);
      setIsDialogOpen(true);
      return;
    }
    setSelectedMember(member);
    setIsDialogOpen(true);
  };

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
    const filename = `${profile?.name || "leader"}_team_${timestamp}.csv`;

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

  const handleSave = (
    updatedMember: Partial<TeamMember> & { id?: string },
    isNew?: boolean
  ) => {
    if (isNew) {
      addMember(updatedMember as Omit<TeamMember, "id">);
    } else {
      updateMember(updatedMember as TeamMember & { id: string });
    }
    setIsDialogOpen(false);
    setSelectedMember(null);
  };

  const handleDelete = (id: string) => {
    deleteMembers([id]);
    setIsDialogOpen(false);
    setSelectedMember(null);
  };

  const handleMultiDelete = () => {
    const ids = table.getSelectedRowModel().rows.map((row) => row.original.id);
    deleteMembers(ids);
    setRowSelection({});
    setConfirmMultiDeleteOpen(false);
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
        <Button
          onClick={() => handleEdit(true, null)}
          variant="default"
          className="font-semibold gap-1"
        >
          <Plus strokeWidth={3} />
          Add
        </Button>
        {Object.keys(rowSelection).length > 0 && (
          <Button
            onClick={() => setConfirmMultiDeleteOpen(true)}
            variant="destructive"
          >
            <Trash2 strokeWidth={3} />
            Delete
          </Button>
        )}
        <Button onClick={handleExport} variant="secondary">
          <DownloadIcon />
          Export
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
      <EditMember
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        member={selectedMember}
        onSave={handleSave}
        onDelete={handleDelete}
      />
      <ConfirmDialog
        open={confirmMultiDeleteOpen}
        onOpenChange={setConfirmMultiDeleteOpen}
        title="Delete Multiple Members"
        description={`Are you sure you want to delete ${
          Object.keys(rowSelection).length
        } team members? This action cannot be undone.`}
        onConfirm={handleMultiDelete}
        confirmText="Delete"
      />
    </div>
  );
}
