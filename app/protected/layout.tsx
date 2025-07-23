"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ModeToggle } from "@/components/ui/themeButton";
import { Separator } from "@radix-ui/react-separator";
import { usePathname } from "next/navigation";
import { ProfileProvider } from "@/app/protected/context/ProfileContext";
import { TeamProvider } from "@/app/protected/context/TeamContext";

const PAGE_TITLES: Record<string, string> = {
  "/protected/dashboard": "Dashboard",
  "/protected/edit-team": "Edit Team",
  "/protected/levelData": "Level Data",
  "/protected/targetData": "Target Data",
  "/protected/chequeData": "Cheque Data",
  "/protected/payment": "Billing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const pageTitle = PAGE_TITLES[pathname] || "Dashboard";

  return (
    <ProfileProvider>
      <TeamProvider>
        <SidebarProvider>
          <AppSidebar />
          <main className="w-full p-3 flex flex-col">
            <div className="flex flex-row mb-3 items-center">
              <SidebarTrigger />
              <h1 className="text-xl font-bold w-full text-center">
                {pageTitle}
              </h1>
              <ModeToggle />
            </div>
            <Separator className="w-auto h-0.5 bg-sidebar-border" />
            {children}
          </main>
        </SidebarProvider>
      </TeamProvider>
    </ProfileProvider>
  );
}
