"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CreditCard,
  HelpCircle,
  IndianRupee,
  LayoutDashboard,
  Users,
  Plus,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SidebarLogoutButton } from "@/components/auth/LogOutButton";
import { useNavigation } from "@/providers/NavigationContext";
import { useTeamContext } from "@/providers/TeamContext";

const PersonalLinks = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Payouts",
    icon: IndianRupee,
  },
];

const FooterLinks = [
  {
    name: "Billing",
    icon: CreditCard,
  },
  {
    name: "Help",
    icon: HelpCircle,
  },
];

export function AppSidebar() {
  const { currentPage, setCurrentPage } = useNavigation();
  const { isMobile: isSidebarMobile, setOpenMobile } = useSidebar();
  const {
    teams,
    activeTeamId,
    setActiveTeamId,
    createTeam,
  } = useTeamContext();

  const [addTeamDialogOpen, setAddTeamDialogOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;

    createTeam(newTeamName.trim());
    setNewTeamName("");
    setAddTeamDialogOpen(false);
    setCurrentPage("Team Workspace");
    if (isSidebarMobile) setOpenMobile(false);
  };

  return (
    <>
      <Sidebar collapsible={isSidebarMobile ? "offcanvas" : "icon"}>
        <SidebarContent className="pt-[var(--standalone)]">
          {/* Logo Header */}
          <Link href={"/"}>
            <SidebarHeader className="text-2xl font-bold flex flex-row items-center gap-2 m-4 !p-0 overflow-hidden shrink-0">
              <Image src={"/pickaxe.png"} alt="LOGO" width={32} height={32} className="shrink-0" />
              <p className="text-nowrap logoFace group-data-[collapsible=icon]:hidden">
                Awpl Helper.
              </p>
            </SidebarHeader>
          </Link>

          {/* 1. PERSONAL SECTION */}
          <div className="px-4 pt-2 pb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground/80 group-data-[collapsible=icon]:hidden">
            Personal
          </div>

          <SidebarMenu className="gap-3">
            {PersonalLinks.map((link) => {
              const isActive =
                currentPage.name === link.name ||
                (link.name === "Payouts" && currentPage.name === "Cheque Data");

              return (
                <SidebarMenuItem key={link.name} className="flex mx-3">
                  <SidebarMenuButton
                    onClick={() => {
                      if (isSidebarMobile) setOpenMobile(false);
                      setCurrentPage(link.name);
                    }}
                    variant={"outline"}
                    tooltip={link.name}
                    className={`hover:scale-105 transition-all text-nowrap p-2.5 size-10 w-full rounded-xl ${
                      isActive
                        ? "border-2 border-blue-500 bg-blue-50 text-blue-900 font-bold hover:bg-blue-100 hover:text-blue-900 dark:bg-blue-950/70 dark:text-blue-200 dark:border-blue-400 dark:hover:bg-blue-900/60 dark:hover:text-blue-100"
                        : "bg-gray-50 text-foreground hover:bg-blue-50/80 hover:text-foreground dark:bg-white/5 dark:hover:bg-white/10"
                    }`}
                  >
                    <link.icon size={20} className="shrink-0" />
                    <span className="pl-1 text-sm font-semibold group-data-[collapsible=icon]:hidden">
                      {link.name}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>

          <SidebarSeparator className="my-1.5 mx-3 group-data-[collapsible=icon]:hidden" />

          {/* 2. TEAMS SECTION */}
          <div className="flex items-center justify-between px-4 pt-1.5 pb-1 group-data-[collapsible=icon]:hidden">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
              Teams
            </span>
            <button
              type="button"
              onClick={() => setAddTeamDialogOpen(true)}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              title="Add New Team"
            >
              <Plus size={16} />
            </button>
          </div>

          <SidebarMenu className="gap-3">
            {teams.map((team) => {
              const isTeamActive =
                (currentPage.name === "Team Workspace" || currentPage.name === "Team") &&
                activeTeamId === team.id;

              return (
                <SidebarMenuItem key={team.id} className="flex mx-3">
                  <SidebarMenuButton
                    onClick={() => {
                      setActiveTeamId(team.id);
                      setCurrentPage("Team Workspace");
                      if (isSidebarMobile) setOpenMobile(false);
                    }}
                    variant={"outline"}
                    tooltip={team.name}
                    className={`hover:scale-105 transition-all text-nowrap p-2.5 size-10 w-full rounded-xl ${
                      isTeamActive
                        ? "border-2 border-blue-500 bg-blue-50 text-blue-900 font-bold hover:bg-blue-100 hover:text-blue-900 dark:bg-blue-950/70 dark:text-blue-200 dark:border-blue-400 dark:hover:bg-blue-900/60 dark:hover:text-blue-100"
                        : "bg-gray-50 text-foreground hover:bg-blue-50/80 hover:text-foreground dark:bg-white/5 dark:hover:bg-white/10"
                    }`}
                  >
                    <Users size={20} className="shrink-0" />
                    <div className="flex items-center justify-between w-full pl-1 overflow-hidden group-data-[collapsible=icon]:hidden">
                      <span className="truncate text-sm font-semibold text-inherit">{team.name}</span>
                      {team.memberIds.length > 0 && (
                        <Badge
                          variant="secondary"
                          className="text-xs px-1.5 py-0 h-4 font-mono font-bold shrink-0 ml-1.5 bg-blue-100 text-blue-800 dark:bg-blue-900/70 dark:text-blue-200"
                        >
                          {team.memberIds.length}
                        </Badge>
                      )}
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>

          <div className="flex-grow"></div>

          {/* 3. FOOTER SECTION */}
          <SidebarFooter className="gap-3 m-0 p-0">
            <SidebarSeparator className="my-1.5 mx-3 group-data-[collapsible=icon]:hidden" />
            {FooterLinks.map((link) => {
              const isActive = currentPage.name === link.name;
              return (
                <SidebarMenuItem key={link.name} className="flex mx-3">
                  <SidebarMenuButton
                    onClick={() => {
                      if (isSidebarMobile) setOpenMobile(false);
                      setCurrentPage(link.name);
                    }}
                    variant={"outline"}
                    tooltip={link.name}
                    className={`hover:scale-105 transition-all text-nowrap p-2.5 size-10 w-full rounded-xl ${
                      isActive
                        ? "border-2 border-blue-500 bg-blue-50 text-blue-900 font-bold hover:bg-blue-100 hover:text-blue-900 dark:bg-blue-950/70 dark:text-blue-200 dark:border-blue-400 dark:hover:bg-blue-900/60 dark:hover:text-blue-100"
                        : "bg-gray-50 text-foreground hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10"
                    }`}
                  >
                    <link.icon size={20} className="shrink-0" />
                    <span className="pl-1 text-sm font-semibold group-data-[collapsible=icon]:hidden">{link.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
            <SidebarMenuItem className="flex mx-3 mb-5">
              <SidebarLogoutButton />
            </SidebarMenuItem>
          </SidebarFooter>
        </SidebarContent>
      </Sidebar>

      {/* Add Team Modal Dialog */}
      <Dialog open={addTeamDialogOpen} onOpenChange={setAddTeamDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <form onSubmit={handleCreateTeam}>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold inter">
                Create New Team
              </DialogTitle>
            </DialogHeader>

            <div className="py-4 space-y-3">
              <p className="text-xs text-muted-foreground">
                Organize your downline distributors into custom cohorts (e.g. &quot;Alpha Builders&quot;, &quot;Varanasi Leg&quot;, &quot;Core Leaders&quot;).
              </p>
              <Input
                placeholder="Team Name (e.g. Core Achievers)"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                className="h-11 rounded-xl text-sm"
                autoFocus
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddTeamDialogOpen(false)}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!newTeamName.trim()} className="rounded-xl font-semibold">
                Create Team
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
