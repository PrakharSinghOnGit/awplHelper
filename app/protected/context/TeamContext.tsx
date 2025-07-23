"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { TeamMember } from "@/types";

interface TeamContextType {
  members: TeamMember[];
  loading: boolean;
  error: string | null;
  addMember: (newMember: Omit<TeamMember, "id">) => Promise<void>;
  updateMember: (
    updatedMember: Partial<TeamMember> & { id: string }
  ) => Promise<void>;
  deleteMembers: (ids: string[]) => Promise<void>;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const TeamProvider = ({ children }: { children: ReactNode }) => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/team");
      if (!response.ok) {
        throw new Error("Failed to fetch team members");
      }
      const data = await response.json();
      setMembers(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const addMember = async (newMember: Omit<TeamMember, "id">) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticMember: TeamMember = {
      ...newMember,
      id: tempId,
      created_at: new Date(),
      last_updated: new Date(),
      status_flag: "OK",
      valid_passwords: null,
    };

    setMembers((prev) => [...prev, optimisticMember]);

    try {
      const response = await fetch("/api/team", {
        method: "POST",
        body: JSON.stringify(newMember),
        headers: { "Content-Type": "application/json" },
      });
      const addedMember = await response.json();
      // Replace temporary member with the real one from the server
      setMembers((prev) =>
        prev.map((m) => (m.id === tempId ? addedMember : m))
      );
    } catch (e) {
      // Rollback
      setMembers((prev) => prev.filter((m) => m.id !== tempId));
      console.error("Failed to add member\n", e);
      alert("Failed to add Team Member");
    }
  };

  const updateMember = async (
    updatedMember: Partial<TeamMember> & { id: string }
  ) => {
    const originalMembers = members;
    setMembers((prev) =>
      prev.map((m) =>
        m.id === updatedMember.id ? { ...m, ...updatedMember } : m
      )
    );

    try {
      await fetch("/api/team", {
        method: "PUT",
        body: JSON.stringify(updatedMember),
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      setMembers(originalMembers);
      console.error("Failed to update member", e);
      alert("Failed to update member");
    }
  };

  const deleteMembers = async (ids: string[]) => {
    const originalMembers = members;
    setMembers((prev) => prev.filter((m) => !ids.includes(m.id)));

    try {
      await fetch("/api/team", {
        method: "DELETE",
        body: JSON.stringify({ ids }),
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      setMembers(originalMembers);
      console.error("Failed to delete members", e);
    }
  };

  return (
    <TeamContext.Provider
      value={{
        members,
        loading,
        error,
        addMember,
        updateMember,
        deleteMembers,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error("useTeam must be used within a TeamProvider");
  }
  return context;
};
