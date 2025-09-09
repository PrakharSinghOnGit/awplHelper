import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSupabase } from "@/providers/SupabaseProvider";
import type { Database } from "@/utils/database.types";

// Type helpers
type Tables = Database["public"]["Tables"];
type TableName = keyof Tables;

export const useTableData = (
  table: TableName,
  queryKey?: string[],
  options?: {
    enabled?: boolean;
    staleTime?: number;
    refetchInterval?: number;
  }
) => {
  const supabase = useSupabase();

  return useQuery({
    queryKey: [table, ...(queryKey || [])],
    queryFn: async () => {
      const { data, error } = await supabase.from(table).select();
      if (error) throw error;
      return data;
    },
    enabled: options?.enabled ?? true,
    staleTime: options?.staleTime ?? 60 * 1000,
    refetchInterval: options?.refetchInterval,
  });
};

export const useCustomQuery = <T>(
  queryKey: string[],
  queryFn: (supabase: ReturnType<typeof useSupabase>) => Promise<T>,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    refetchInterval?: number;
  }
) => {
  const supabase = useSupabase();

  return useQuery({
    queryKey,
    queryFn: () => queryFn(supabase),
    enabled: options?.enabled ?? true,
    staleTime: options?.staleTime ?? 60 * 1000,
    refetchInterval: options?.refetchInterval,
  });
};

export const useCustomMutation = <TVariables, TData>(
  mutationFn: (
    supabase: ReturnType<typeof useSupabase>
  ) => (variables: TVariables) => Promise<TData>,
  options?: {
    onSuccess?: (data: TData) => void;
    onError?: (error: Error) => void;
    invalidateQueries?: string[];
  }
) => {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mutationFn(supabase),
    onSuccess: (data) => {
      if (options?.invalidateQueries) {
        options.invalidateQueries.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey: [queryKey] });
        });
      }
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
};

export const useMembers = (options?: { enabled?: boolean }) => {
  const supabase = useSupabase();

  return useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      console.log("🔍 Fetching members from database...");
      const { data, error } = await supabase.from("members").select();
      if (error) throw error;
      console.log("✅ Members fetched:", data?.length, "records");
      return data as Tables["members"]["Row"][];
    },
    enabled: options?.enabled ?? true,
    staleTime: 60 * 1000,
  });
};

export const useProfile = (options?: { enabled?: boolean }) => {
  const supabase = useSupabase();

  return useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select();
      if (error) throw error;
      return data as Tables["profiles"]["Row"][];
    },
    enabled: options?.enabled ?? true,
    staleTime: 60 * 1000,
  });
};

export const useLeaderMembers = (options?: { enabled?: boolean }) => {
  const supabase = useSupabase();

  return useQuery({
    queryKey: ["leader_members"],
    queryFn: async () => {
      const { data, error } = await supabase.from("leader_members").select();
      if (error) throw error;
      return data as Tables["leader_members"]["Row"][];
    },
    enabled: options?.enabled ?? true,
    staleTime: 60 * 1000,
  });
};

// Example of a more complex query
export const useMembersByLeader = (
  leaderId: string,
  options?: { enabled?: boolean }
) => {
  return useCustomQuery(
    ["members", "by-leader", leaderId],
    async (supabase) => {
      const { data, error } = await supabase
        .from("leader_members")
        .select(
          `
          member_id,
          members (*)
        `
        )
        .eq("leader_id", leaderId);

      if (error) throw error;
      return data;
    },
    options
  );
};

// Example mutation
export const useCreateMember = () => {
  return useCustomMutation(
    (supabase) => async (memberData: Tables["members"]["Insert"]) => {
      const { data, error } = await supabase
        .from("members")
        .insert(memberData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    {
      invalidateQueries: ["members"],
    }
  );
};

export const useUpdateMember = () => {
  return useCustomMutation(
    (supabase) =>
      async ({
        id,
        updates,
      }: {
        id: string;
        updates: Tables["members"]["Update"];
      }) => {
        const { data, error } = await supabase
          .from("members")
          .update(updates)
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;
        return data;
      },
    {
      invalidateQueries: ["members"],
    }
  );
};

export const useDeleteMember = () => {
  return useCustomMutation(
    (supabase) => async (id: string) => {
      const { error } = await supabase.from("members").delete().eq("id", id);

      if (error) throw error;
      return { id };
    },
    {
      invalidateQueries: ["members"],
    }
  );
};
