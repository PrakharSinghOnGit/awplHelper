"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
export default function Help() {
  const router = useRouter();
  return (
    <div>
      <Button
        onClick={() => router.back()}
        variant={"outline"}
        size={"icon"}
        className="m-3"
      >
        <ChevronLeft className="w-7 h-7" />
      </Button>
      <h2>HELP PAGE</h2>
    </div>
  );
}
