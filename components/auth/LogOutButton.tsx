"use client";

import { createClient } from "@/lib/supabase/client";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function SidebarLogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
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
