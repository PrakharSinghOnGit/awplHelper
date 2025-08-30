import { AppSidebar } from "@/components/protected/AppSidebar";
import { ModeToggle } from "@/components/ThemeChange";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { NavigationProvider } from "@/components/providers/NavigationContext";
import { SupabaseProvider } from "@/components/providers/SupabaseProvider";
import { Title } from "@/components/ui/title";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SupabaseProvider>
      <NavigationProvider>
        <SidebarProvider>
          <AppSidebar />
          <div className="flex flex-col gap-3 w-full justify-center m-3 lg:ml-0 md:ml-0">
            <div className="flex">
              <div className="flex items-center gap-3">
                <SidebarTrigger />
                {/* <Title /> */}
              </div>
              <div className="flex gap-3 self-end ml-auto">
                <Badge variant={"outline"} color="blue">
                  {new Date().toDateString()}
                </Badge>
                <ModeToggle />
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
            </div>
            <main className="rounded-xl grow border w-full">{children}</main>
          </div>
        </SidebarProvider>
      </NavigationProvider>
    </SupabaseProvider>
  );
}
