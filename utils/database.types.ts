export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)";
  };
  public: {
    Tables: {
      leader_members: {
        Row: {
          leader_id: string;
          member_id: string;
        };
        Insert: {
          leader_id: string;
          member_id: string;
        };
        Update: {
          leader_id?: string;
          member_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "leader_members_leader_id_fkey";
            columns: ["leader_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "leader_members_member_id_fkey";
            columns: ["member_id"];
            isOneToOne: false;
            referencedRelation: "members";
            referencedColumns: ["id"];
          }
        ];
      };
      members: {
        Row: {
          awpl_id: string;
          awpl_pass: string | null;
          chequeData: Json | null;
          created_at: string | null;
          id: string;
          last_updated: string | null;
          levelSao: number | null;
          levelSgo: number | null;
          name: string | null;
          status_flag: string | null;
          targetSao: number | null;
          targetSgo: number | null;
          valid_passwords: string[] | null;
        };
        Insert: {
          awpl_id: string;
          awpl_pass?: string | null;
          chequeData?: Json | null;
          created_at?: string | null;
          id?: string;
          last_updated?: string | null;
          levelSao?: number | null;
          levelSgo?: number | null;
          name?: string | null;
          status_flag?: string | null;
          targetSao?: number | null;
          targetSgo?: number | null;
          valid_passwords?: string[] | null;
        };
        Update: {
          awpl_id?: string;
          awpl_pass?: string | null;
          chequeData?: Json | null;
          created_at?: string | null;
          id?: string;
          last_updated?: string | null;
          levelSao?: number | null;
          levelSgo?: number | null;
          name?: string | null;
          status_flag?: string | null;
          targetSao?: number | null;
          targetSgo?: number | null;
          valid_passwords?: string[] | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          awpl_id: string | null;
          awpl_pass: string | null;
          cheque_data: Json[] | null;
          id: string;
          is_paid: boolean;
          level_SAO: number | null;
          level_SGO: number | null;
          members: number;
          name: string;
          target_data: Json[] | null;
          updated_at: string | null;
          week_left: number;
        };
        Insert: {
          awpl_id?: string | null;
          awpl_pass?: string | null;
          cheque_data?: Json[] | null;
          id: string;
          is_paid?: boolean;
          level_SAO?: number | null;
          level_SGO?: number | null;
          members?: number;
          name?: string;
          target_data?: Json[] | null;
          updated_at?: string | null;
          week_left?: number;
        };
        Update: {
          awpl_id?: string | null;
          awpl_pass?: string | null;
          cheque_data?: Json[] | null;
          id?: string;
          is_paid?: boolean;
          level_SAO?: number | null;
          level_SGO?: number | null;
          members?: number;
          name?: string;
          target_data?: Json[] | null;
          updated_at?: string | null;
          week_left?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      add_member_to_leader: {
        Args: {
          leader_id_param: string;
          member_awpl_id_param: string;
          member_name_param: string;
          member_pass_param: string;
        };
        Returns: Json;
      };
      process_login_attempt: {
        Args: {
          member_awpl_id: string;
          successful_password: string;
          was_successful: boolean;
        };
        Returns: undefined;
      };
      remove_multiple_members_from_team: {
        Args: { member_awpl_ids: string[] };
        Returns: undefined;
      };
      update_member_awpl_id: {
        Args: {
          new_awpl_id: string;
          new_awpl_pass: string;
          old_awpl_id: string;
        };
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
