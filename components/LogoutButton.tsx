"use client";

import { LogOut } from "lucide-react";
import { SidebarMenuButton } from "@/components/ui/sidebar";

export function LogoutButton() {
  const handleLogout = () => {
    // Temporary redirect for demo:
    window.location.href = "/";
  };

  return (
    <SidebarMenuButton
      variant="outline"
      className="flex items-center gap-2"
      onClick={handleLogout}
    >
      <LogOut className="h-5 w-5" />
      Log out
    </SidebarMenuButton>
  );
}
