"use client";

import { createClient } from "@/lib/supabase/client";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <SidebarMenuButton
      variant="outline"
      className="flex items-center gap-2"
      onClick={logout}
    >
      <LogOut className="h-5 w-5" />
      Log out
    </SidebarMenuButton>
  );
}
