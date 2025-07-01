"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ModeToggle } from "@/components/ui/themeButton";
import { Separator } from "@radix-ui/react-separator";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  function mapTitle(pathName: string) {
    switch (pathName) {
      case "/dashboard":
        return "Dashboard";
      case "/edit-team":
        return "Edit Team";
      case "/levelData":
        return "Level Data";
      case "/targetData":
        return "Target Data";
      case "/chequeData":
        return "Cheque Data";
      case "/payment":
        return "Billing";
      default:
        return "Dashboard";
    }
  }
  const pathname = usePathname();
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full p-3 flex flex-col">
        <div className="flex flex-row mb-3 items-center">
          <SidebarTrigger />
          <h1 className="text-xl font-bold w-full text-center">
            {mapTitle(pathname)}
          </h1>
          <ModeToggle />
        </div>
        <Separator className="w-auto h-0.5 bg-sidebar-border" />
        {children}
      </main>
    </SidebarProvider>
  );
}
