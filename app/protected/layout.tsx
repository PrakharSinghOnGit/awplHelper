import { AppSidebar } from "@/components/protected/AppSidebar";
import { ModeToggle } from "@/components/ThemeChange";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { NavigationProvider } from "@/providers/NavigationContext";
import { TeamProvider } from "@/providers/TeamContext";
import { Toaster } from "@/components/ui/sonner";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NavigationProvider>
      <TeamProvider>
        <SidebarProvider>
          <AppSidebar />
          <div className="pt-[var(--standalone)] flex flex-col gap-2 w-full h-[100dvh] overflow-hidden p-1 sm:p-2 md:py-2 md:pr-2 md:pl-0">
            <div className="flex items-center justify-between shrink-0 px-1">
              <div className="flex items-center gap-2 sm:gap-3">
                <SidebarTrigger />
              </div>
              <div className="flex items-center gap-2 sm:gap-3 ml-auto">
                <Badge variant={"outline"} color="blue" className="hidden sm:inline-flex text-xs font-medium">
                  {new Date().toDateString()}
                </Badge>
                <ModeToggle />
                <Avatar className="size-8 sm:size-9">
                  <AvatarImage src="/pp.jpg" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
            </div>
            <main className="rounded-2xl grow border w-full p-2 sm:p-3 md:p-3.5 overflow-y-auto overflow-x-hidden">
              {children}
              <Toaster position="bottom-center" richColors />
            </main>
          </div>
        </SidebarProvider>
      </TeamProvider>
    </NavigationProvider>
  );
}
