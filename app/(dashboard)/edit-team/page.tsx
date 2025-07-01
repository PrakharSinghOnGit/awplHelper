"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader } from "@/components/ui/table";
import { DownloadIcon, Plus, Search } from "lucide-react";

export default function EditTeam() {
  function handleAdd() {}

  function handleExport() {}

  return (
    <div className="flex flex-col gap-4 w-full pt-3 grow">
      <div className="flex flex-row gap-2">
        <Input icon={<Search size={15} />} placeholder="Search User" />
        <Button
          onClick={handleAdd}
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
          <TableHeader></TableHeader>
        </Table>
      </div>
    </div>
  );
}
