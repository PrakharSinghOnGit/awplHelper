import { AppSidebar } from "@/components/protected/AppSidebar";
import { ModeToggle } from "@/components/ThemeChange";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { NavigationProvider } from "@/providers/NavigationContext";
import { Toaster } from "@/components/ui/sonner";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NavigationProvider>
      <SidebarProvider>
        <AppSidebar />
        <div className="pt-[var(--standalone)] flex flex-col gap-3 w-[calc(100vw-24px)] justify-center m-3 lg:ml-0 md:ml-0 h-[calc(100vh-24px)]">
          <div className="flex">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
            </div>
            <div className="flex gap-3 self-end ml-auto">
              <Badge variant={"outline"} color="blue">
                {new Date().toDateString()}
              </Badge>
              <ModeToggle />
              <Avatar>
                <AvatarImage src="/pp.jpg" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          </div>
          <main className="rounded-xl grow border w-full p-3 lg:p-6 overflow-scroll">
            {children}
            <Toaster position="bottom-center" richColors />
          </main>
        </div>
      </SidebarProvider>
    </NavigationProvider>
  );
}
