import {
  BarChart2,
  CreditCard,
  HelpCircle,
  Users,
  TrendingUpIcon,
  GoalIcon,
  BanknoteIcon,
  ServerIcon,
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
import Image from "next/image";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader
          style={{ fontFamily: "Bytesized" }}
          className="text-2xl font-bold flex flex-row justify-center items-center gap-2 pb-0 pt-3"
        >
          <Image
            src="/smallPick.webp"
            unoptimized
            alt="Pick"
            unselectable="on"
            width={25}
            height={25}
          />
          <p className="mt-2 pb-2">Awpl Helper.</p>
        </SidebarHeader>

        <SidebarSeparator />

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              href="/protected/dashboard"
              className="flex items-center gap-2"
            >
              <BarChart2 />
              Dashboard
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              href="/protected/edit-team"
              className="flex items-center gap-2"
            >
              <Users />
              Team
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              aria-disabled="true"
              className="flex items-center gap-2"
            >
              <ServerIcon />
              Data
            </SidebarMenuButton>

            <SidebarMenuSub>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton
                  href="/protected/levelData"
                  className="flex items-center gap-2"
                >
                  <TrendingUpIcon />
                  Level Data
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>

              <SidebarMenuSubItem>
                <SidebarMenuSubButton
                  href="/protected/targetData"
                  className="flex items-center gap-2"
                >
                  <GoalIcon />
                  Target Data
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>

              <SidebarMenuSubItem>
                <SidebarMenuSubButton
                  href="/protected/chequeData"
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
