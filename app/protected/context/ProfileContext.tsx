"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";

// Define the type for your profile data
interface Profile {
  id: string;
  awpl_id?: string;
  is_paid?: boolean;
  week_left?: number;
  name?: string;
  level_SAO?: number;
  level_SGO?: number;
  target_SAO?: number;
  target_SGO?: number;
  cheque_data?: {
    date: string;
    amount: number;
  }[];
  updated_at: string;
}

interface ProfileContextType {
  profile: Profile | null;
  loading: boolean;
  forceRefresh: () => void;
}

const ProfileContext = createContext<ProfileContextType>({
  profile: null,
  loading: true,
  forceRefresh: () => {},
});

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile(data);
        localStorage.setItem("userProfile", JSON.stringify(data));
      }
      if (error) {
        console.error("Error fetching profile in context", error);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    const localProfile = localStorage.getItem("userProfile");
    if (localProfile) {
      setProfile(JSON.parse(localProfile));
      setLoading(false);
    } else {
      fetchProfile();
    }
  }, []);

  const forceRefresh = () => {
    localStorage.removeItem("userProfile");
    fetchProfile();
  };

  return (
    <ProfileContext.Provider value={{ profile, loading, forceRefresh }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
