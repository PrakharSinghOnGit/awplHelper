"use client";

import React, { useState } from "react";
import {
  Users,
  LayoutDashboard,
  IndianRupee,
  Activity,
  Gauge,
  MoreVertical,
  Edit2,
  Trash2,
  Check,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTeamContext, TeamSubTab } from "@/providers/TeamContext";
import { useTeamMembers } from "@/hooks/useDatabase";
import { TeamOverviewTab } from "./TeamOverviewTab";
import { EditTeam } from "./EditTeam";
import ChequeData from "../ChequeData";
import LevelData from "../LevelData";
import TargetData from "../TargetData";

export default function TeamWorkspace() {
  const {
    activeTeam,
    renameTeam,
    deleteTeam,
    teams,
    activeTab,
    setActiveTab,
  } = useTeamContext();

  const { data: teamMemberships } = useTeamMembers();

  const [isEditingName, setIsEditingName] = useState(false);
  const [teamNameInput, setTeamNameInput] = useState(activeTeam.name);

  // Sync input with active team
  React.useEffect(() => {
    setTeamNameInput(activeTeam.name);
    setIsEditingName(false);
  }, [activeTeam.id, activeTeam.name]);

  const handleSaveName = () => {
    if (teamNameInput.trim()) {
      renameTeam(activeTeam.id, teamNameInput.trim());
    }
    setIsEditingName(false);
  };

  // Filter members belonging to this team
  const currentTeamMembers = React.useMemo(() => {
    if (!teamMemberships) return [];
    return teamMemberships
      .filter((tm) =>
        activeTeam.memberIds.length === 0 ||
        activeTeam.memberIds.includes(tm.distributor_id.toUpperCase())
      )
      .map((tm) => {
        const d = tm.distributors;
        return {
          awplId: tm.distributor_id,
          name: d?.name || "Distributor",
          levelSao: Number(d?.sao_sp || 0),
          levelSgo: Number(d?.sgo_sp || 0),
          totalIncome: Number(d?.total_income || 0),
          levelName: d?.current_level_name || "Fresher",
          status: d?.status || "ok",
        };
      });
  }, [teamMemberships, activeTeam.memberIds]);

  const subTabs: { id: TeamSubTab; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "roster", label: "Members Roster", icon: Users },
    { id: "cheques", label: "Team Cheques", icon: IndianRupee },
    { id: "levels", label: "Level Progress", icon: Activity },
    { id: "targets", label: "Bonanza Targets", icon: Gauge },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 w-full pb-12">
      {/* 1. Team Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-5">
        <div className="flex items-center gap-3">
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <Input
                value={teamNameInput}
                onChange={(e) => setTeamNameInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                className="h-10 text-xl font-bold w-60 sm:w-80"
                autoFocus
              />
              <Button size="icon" variant="ghost" onClick={handleSaveName}>
                <Check className="size-4 text-emerald-500" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  setTeamNameInput(activeTeam.name);
                  setIsEditingName(false);
                }}
              >
                <X className="size-4 text-muted-foreground" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight inter">
                {activeTeam.name}
              </h1>
              <Badge variant="outline" className="text-xs font-semibold px-2.5 py-0.5">
                {currentTeamMembers.length} Members
              </Badge>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground">
                    <MoreVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => setIsEditingName(true)} className="gap-2 text-xs">
                    <Edit2 className="size-3.5" />
                    Rename Team
                  </DropdownMenuItem>
                  {teams.length > 1 && (
                    <DropdownMenuItem
                      onClick={() => deleteTeam(activeTeam.id)}
                      className="gap-2 text-xs text-destructive focus:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                      Delete Team
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        {/* Subtabs Navigation Bar */}
        <div className="flex items-center p-1 rounded-2xl bg-muted/60 border border-border/60 overflow-x-auto scrollbar-thin self-start sm:self-auto max-w-full">
          {subTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className={`size-4 ${isActive ? "text-primary" : ""}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Subtab Content */}
      <div className="w-full">
        {activeTab === "overview" && (
          <TeamOverviewTab
            members={currentTeamMembers}
            onGoToRoster={() => setActiveTab("roster")}
          />
        )}

        {activeTab === "roster" && <EditTeam />}

        {activeTab === "cheques" && <ChequeData />}

        {activeTab === "levels" && <LevelData />}

        {activeTab === "targets" && <TargetData />}
      </div>
    </div>
  );
}
