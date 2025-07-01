import {
  BarChart2,
  CreditCard,
  HelpCircle,
  Users,
  TrendingUpIcon,
  GoalIcon,
  BanknoteIcon,
  ServerIcon,
  Pickaxe,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarHeader,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarMenuButton,
  SidebarFooter,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { LogoutButton } from "./LogoutButton";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader className="text-xl font-bold flex flex-row justify-center items-center gap-2 p-4">
          <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
            <Pickaxe className="size-5" />
          </div>
          <p className="mt-2">Awpl Helper.</p>
        </SidebarHeader>

        <SidebarSeparator />

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              href="/dashboard"
              className="flex items-center gap-2"
            >
              <BarChart2 size={"lg"} className="h-5 w-5" />
              Dashboard
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              href="/edit-team"
              className="flex items-center gap-2"
            >
              <Users className="h-5 w-5" />
              Team
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton className="flex items-center gap-2">
              <ServerIcon className="w-2 h-2" />
              Data
            </SidebarMenuButton>

            <SidebarMenuSub>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton
                  href="/levelData"
                  className="flex items-center gap-2"
                >
                  <TrendingUpIcon />
                  Level Data
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>

              <SidebarMenuSubItem>
                <SidebarMenuSubButton
                  href="/targetData"
                  className="flex items-center gap-2"
                >
                  <GoalIcon />
                  Target Data
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>

              <SidebarMenuSubItem>
                <SidebarMenuSubButton
                  href="/chequeData"
                  className="flex items-center gap-2"
                >
                  <BanknoteIcon />
                  Cheque Data
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className="flex-grow"></div>

        <SidebarFooter className="mt-auto">
          <SidebarMenuButton href="/help" className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Help
          </SidebarMenuButton>
          <SidebarMenuButton
            href="/payment"
            className="flex items-center gap-2"
          >
            <CreditCard className="h-5 w-5" />
            Billing
          </SidebarMenuButton>
          <SidebarSeparator />

          <LogoutButton />
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
