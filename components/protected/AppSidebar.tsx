"use client";

import {
  Activity,
  CreditCard,
  Gauge,
  HelpCircle,
  IndianRupee,
  LayoutDashboard,
  Users,
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
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { SidebarLogoutButton } from "@/components/auth/LogOutButton";
import { useNavigation } from "@/providers/NavigationContext";
import Link from "next/link";

const Links = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Team",
    icon: Users,
  },
  {
    name: "Level Data",
    icon: Activity,
  },
  {
    name: "Target Data",
    icon: Gauge,
  },
  {
    name: "Cheque Data",
    icon: IndianRupee,
  },
];

const FooterLinks = [
  {
    name: "Help",
    icon: HelpCircle,
  },
  {
    name: "Billing",
    icon: CreditCard,
  },
];

export function AppSidebar() {
  const { currentPage, setCurrentPage } = useNavigation();
  const { isMobile: isSidebarMobile, state, setOpenMobile } = useSidebar();
  return (
    <Sidebar collapsible={isSidebarMobile ? "offcanvas" : "icon"}>
      <SidebarContent>
        <Link href={"/"}>
          <SidebarHeader className="text-2xl font-bold flex flex-row items-center gap-2 m-4 !p-0 overflow-hidden">
            <Image src={"/pickaxe.png"} alt="LOGO" width={32} height={32} />
            <p
              className={`text-nowrap logoFace ${
                state == "collapsed" ? "" : ""
              }`}
            >
              Awpl Helper.
            </p>
          </SidebarHeader>
        </Link>

        <SidebarMenu className="gap-3">
          {Links.map((link) => (
            <SidebarMenuItem key={link.name} className="flex mx-3">
              <SidebarMenuButton
                onClick={() => {
                  setOpenMobile(false);
                  setCurrentPage(link.name);
                }}
                variant={"outline"}
                tooltip={link.name}
                className={`hover:scale-105 transition-all text-nowrap p-2.5 size-10 w-full bg-gray-50 hover:bg-blue-100 dark:bg-white/5 dark:hover:bg-white/10 ${
                  currentPage.name === link.name
                    ? "border border-blue-300 bg-blue-50"
                    : ""
                }`}
              >
                <link.icon size={20} />
                <div className="pl-[2px]">{link.name}</div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <div className="flex-grow"></div>
        <SidebarFooter className="gap-3 m-0 p-0">
          {FooterLinks.map((link) => (
            <SidebarMenuItem key={link.name} className="flex mx-3">
              <SidebarMenuButton
                onClick={() => {
                  setOpenMobile(false);
                  setCurrentPage(link.name);
                }}
                variant={"outline"}
                tooltip={link.name}
                className={`hover:scale-105 transition-all text-nowrap p-2.5 size-10 w-full bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 ${
                  currentPage.name === link.name
                    ? "border border-blue-300 bg-blue-50"
                    : ""
                }`}
              >
                <link.icon size={20} />
                <div className="pl-[2px]">{link.name}</div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarSeparator />
          <SidebarMenuItem className="flex mx-3 mb-3">
            <SidebarLogoutButton />
          </SidebarMenuItem>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
