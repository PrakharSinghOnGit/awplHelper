"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "leader" | "member";
  subscriptionStatus?: string;
  billingCycle?: string;
  teamSize?: number;
  status?: string;
}

interface TeamMember {
  id: string;
  awplId: string;
  status: string;
  lastDataFetch?: string;
  errorMessage?: string;
  addedAt: string;
  levelData?: object;
  chequeData?: object;
  targetData?: object;
}

interface TeamStats {
  totalMembers: number;
  activeMembers: number;
  errorMembers: number;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;

  // Team management for leaders
  teamMembers: TeamMember[];
  teamStats: TeamStats | null;
  teamLoading: boolean;
  addTeamMember: (
    awplId: string,
    awplPass: string,
    validPasses?: string[]
  ) => Promise<boolean>;
  fetchTeamData: () => Promise<void>;
  fetchMemberData: (
    memberId: string,
    dataType: "LEVEL" | "CHEQUE" | "TARGET"
  ) => Promise<boolean>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Team management state
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [teamStats, setTeamStats] = useState<TeamStats | null>(null);
  const [teamLoading, setTeamLoading] = useState(false);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/user/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": "default-user", // In real app, get from auth
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const userData = await response.json();
      setUser(userData);

      // If user is a leader, fetch team data
      if (userData.role === "leader") {
        await fetchTeamData();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load user");
      console.error("User fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamData = async () => {
    if (!user || user.role !== "leader") return;

    try {
      setTeamLoading(true);

      const response = await fetch("/api/team/members", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch team data");
      }

      const teamData = await response.json();
      setTeamMembers(teamData.teamMembers);
      setTeamStats({
        totalMembers: teamData.totalMembers,
        activeMembers: teamData.activeMembers,
        errorMembers: teamData.errorMembers,
      });
    } catch (err) {
      console.error("Team fetch error:", err);
    } finally {
      setTeamLoading(false);
    }
  };

  const addTeamMember = async (
    awplId: string,
    awplPass: string,
    validPasses?: string[]
  ) => {
    if (!user || user.role !== "leader") return false;

    try {
      const response = await fetch("/api/team/members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({ awplId, awplPass, validPasses }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add team member");
      }

      // Refresh team data
      await fetchTeamData();
      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to add team member"
      );
      return false;
    }
  };

  const fetchMemberData = async (
    memberId: string,
    dataType: "LEVEL" | "CHEQUE" | "TARGET"
  ) => {
    try {
      const response = await fetch("/api/data/fetch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ memberId, dataType }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch member data");
      }

      const result = await response.json();

      // Update the member in our local state
      setTeamMembers((prev) =>
        prev.map((member) =>
          member.id === memberId ? { ...member, ...result.member } : member
        )
      );

      return result.success;
    } catch (err) {
      console.error("Member data fetch error:", err);
      return false;
    }
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  const updateUser = async (updates: Partial<User>) => {
    try {
      // Optimistic update
      if (user) {
        setUser({ ...user, ...updates });
      }

      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user?.id || "default-user",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
      // Refresh to get correct state
      await fetchUser();
    }
  };

  useEffect(() => {
    fetchUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        refreshUser,
        updateUser,
        teamMembers,
        teamStats,
        teamLoading,
        addTeamMember,
        fetchTeamData,
        fetchMemberData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
