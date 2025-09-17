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

export const useProfile = (options?: { enabled?: boolean }) => {
  const supabase = useSupabase();

  return useQuery({
    queryKey: ["leaders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("leaders").select();
      if (error) throw error;
      if (!data || data.length === 0) return null;
      return data[0] as Tables["leaders"]["Row"];
    },
    enabled: options?.enabled ?? true,
    staleTime: 100 * 1000,
  });
};
