import { DownloadIcon, Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { TeamMember } from "@/types";
import { Table } from "@tanstack/react-table";

const handleExport = (members: TeamMember[]) => {
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

export function DataSearchAndExport({
  mems,
  table,
}: {
  mems: TeamMember[];
  table: Table<TeamMember>;
}) {
  return (
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
        onClick={() => handleExport(mems)}
        variant="secondary"
        className="h-full"
      >
        <DownloadIcon />
        Download
      </Button>
    </div>
  );
}
