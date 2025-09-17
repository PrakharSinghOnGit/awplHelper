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
      className={`hover:scale-105 transition-all text-nowrap p-2.5 size-10 w-full bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10`}
      onClick={logout}
      tooltip={"Log Out"}
    >
      <LogOut className="h-5 w-5" />
      <div className="pl-[2px]">Log Out</div>
    </SidebarMenuButton>
  );
}
