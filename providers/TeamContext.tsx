"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useProfile, useTeamMembers } from "@/hooks/useDatabase";
import { toast } from "sonner";

export interface TeamGroup {
  id: string;
  name: string;
  createdAt: string;
  memberIds: string[]; // awplIds
}

export type TeamSubTab = "overview" | "roster" | "cheques" | "levels" | "targets";

interface TeamContextType {
  teams: TeamGroup[];
  activeTeam: TeamGroup;
  activeTeamId: string;
  setActiveTeamId: (id: string) => void;
  createTeam: (name: string) => string;
  renameTeam: (id: string, newName: string) => void;
  deleteTeam: (id: string) => void;
  assignMemberToTeam: (teamId: string, awplId: string) => void;
  removeMemberFromTeam: (teamId: string, awplId: string) => void;
  activeTab: TeamSubTab;
  setActiveTab: (tab: TeamSubTab) => void;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

const DEFAULT_TEAM_ID = "team-main";

export function TeamProvider({ children }: { children: React.ReactNode }) {
  const { data: leader } = useProfile();
  const { data: teamMemberships } = useTeamMembers();

  const storageKey = leader?.id ? `awpl_teams_${leader.id}` : "awpl_teams_default";

  const [teams, setTeams] = useState<TeamGroup[]>([
    {
      id: DEFAULT_TEAM_ID,
      name: "Main Team",
      createdAt: new Date().toISOString(),
      memberIds: [],
    },
  ]);

  const [activeTeamId, setActiveTeamId] = useState<string>(DEFAULT_TEAM_ID);
  const [activeTab, setActiveTab] = useState<TeamSubTab>("overview");

  // Load teams from localStorage on mount or leader change
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed: TeamGroup[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTeams(parsed);
          // If activeTeamId is not in parsed, set to first
          if (!parsed.some((t) => t.id === activeTeamId)) {
            setActiveTeamId(parsed[0].id);
          }
          return;
        }
      }
    } catch {
      // ignore
    }

    // Default initialization
    const initial: TeamGroup[] = [
      {
        id: DEFAULT_TEAM_ID,
        name: "Main Team",
        createdAt: new Date().toISOString(),
        memberIds: [],
      },
    ];
    setTeams(initial);
    setActiveTeamId(DEFAULT_TEAM_ID);
  }, [storageKey]);

  // Synchronize team memberships from DB with the main team if no assignment exists
  useEffect(() => {
    if (!teamMemberships || teamMemberships.length === 0) return;

    setTeams((prevTeams) => {
      const allDbIds = teamMemberships.map((tm) => tm.distributor_id.toUpperCase());

      // Check if all DB members are present in at least one team
      const assignedIds = new Set<string>();
      prevTeams.forEach((t) => t.memberIds.forEach((id) => assignedIds.add(id.toUpperCase())));

      const unassigned = allDbIds.filter((id) => !assignedIds.has(id));

      if (unassigned.length === 0) return prevTeams;

      // Add unassigned members to the first team
      const updated = prevTeams.map((t, idx) => {
        if (idx === 0) {
          const combined = Array.from(new Set([...t.memberIds, ...unassigned]));
          return { ...t, memberIds: combined };
        }
        return t;
      });

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(storageKey, JSON.stringify(updated));
        } catch {
          // ignore
        }
      }

      return updated;
    });
  }, [teamMemberships, storageKey]);

  const saveTeams = (newTeams: TeamGroup[]) => {
    setTeams(newTeams);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(storageKey, JSON.stringify(newTeams));
      } catch {
        // ignore
      }
    }
  };

  const createTeam = (name: string): string => {
    const trimmed = name.trim();
    if (!trimmed) return activeTeamId;

    const newId = `team-${Date.now()}`;
    const newTeam: TeamGroup = {
      id: newId,
      name: trimmed,
      createdAt: new Date().toISOString(),
      memberIds: [],
    };

    const updated = [...teams, newTeam];
    saveTeams(updated);
    setActiveTeamId(newId);
    toast.success(`Created team "${trimmed}"`);
    return newId;
  };

  const renameTeam = (id: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) return;

    const updated = teams.map((t) => (t.id === id ? { ...t, name: trimmed } : t));
    saveTeams(updated);
    toast.success(`Renamed team to "${trimmed}"`);
  };

  const deleteTeam = (id: string) => {
    if (teams.length <= 1) {
      toast.error("You must have at least one team.");
      return;
    }

    const teamToDelete = teams.find((t) => t.id === id);
    const updated = teams.filter((t) => t.id !== id);

    saveTeams(updated);
    if (activeTeamId === id) {
      setActiveTeamId(updated[0].id);
    }

    toast.success(`Deleted team "${teamToDelete?.name || ""}"`);
  };

  const assignMemberToTeam = (teamId: string, awplId: string) => {
    const cleanId = awplId.trim().toUpperCase();
    const updated = teams.map((t) => {
      if (t.id === teamId) {
        if (t.memberIds.includes(cleanId)) return t;
        return { ...t, memberIds: [...t.memberIds, cleanId] };
      }
      return t;
    });
    saveTeams(updated);
  };

  const removeMemberFromTeam = (teamId: string, awplId: string) => {
    const cleanId = awplId.trim().toUpperCase();
    const updated = teams.map((t) => {
      if (t.id === teamId) {
        return { ...t, memberIds: t.memberIds.filter((id) => id !== cleanId) };
      }
      return t;
    });
    saveTeams(updated);
  };

  const activeTeam = useMemo(() => {
    const found = teams.find((t) => t.id === activeTeamId);
    return (
      found ||
      teams[0] || {
        id: DEFAULT_TEAM_ID,
        name: "Main Team",
        createdAt: new Date().toISOString(),
        memberIds: [],
      }
    );
  }, [teams, activeTeamId]);

  return (
    <TeamContext.Provider
      value={{
        teams,
        activeTeam,
        activeTeamId,
        setActiveTeamId,
        createTeam,
        renameTeam,
        deleteTeam,
        assignMemberToTeam,
        removeMemberFromTeam,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
}

export function useTeamContext() {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error("useTeamContext must be used within TeamProvider");
  }
  return context;
}
