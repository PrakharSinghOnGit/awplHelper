"use client";

import { SidebarMenuButton } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

export function SidebarLogoutButton() {
  const router = useRouter();
  const { signOut } = useAuth();

  const logout = async () => {
    await signOut();
    router.refresh();
    router.push("/");
  };

  return (
    <SidebarMenuButton
      variant="outline"
      className="hover:scale-105 transition-all text-nowrap p-2.5 size-10 w-full rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 text-foreground"
      onClick={logout}
      tooltip={"Log Out"}
    >
      <LogOut size={20} className="shrink-0" />
      <span className="pl-1 text-sm font-semibold group-data-[collapsible=icon]:hidden">Log Out</span>
    </SidebarMenuButton>
  );
}
