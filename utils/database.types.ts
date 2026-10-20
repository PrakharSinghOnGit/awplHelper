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
    PostgrestVersion: "13.0.5";
  };
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      distributors: {
        Row: {
          awplid: string;
          created_at: string;
          current_level: number | null;
          current_level_name: string | null;
          last_mined_at: string | null;
          name: string;
          next_level: number | null;
          next_level_name: string | null;
          next_target_sao: number | null;
          next_target_sgo: number | null;
          pass: string;
          sao_sp: number | null;
          sgo_sp: number | null;
          status: string | null;
          total_income: number | null;
          updated_at: string;
          valid_passwords: string[] | null;
        };
        Insert: {
          awplid: string;
          created_at?: string;
          current_level?: number | null;
          current_level_name?: string | null;
          last_mined_at?: string | null;
          name?: string;
          next_level?: number | null;
          next_level_name?: string | null;
          next_target_sao?: number | null;
          next_target_sgo?: number | null;
          pass?: string;
          sao_sp?: number | null;
          sgo_sp?: number | null;
          status?: string | null;
          total_income?: number | null;
          updated_at?: string;
          valid_passwords?: string[] | null;
        };
        Update: {
          awplid?: string;
          created_at?: string;
          current_level?: number | null;
          current_level_name?: string | null;
          last_mined_at?: string | null;
          name?: string;
          next_level?: number | null;
          next_level_name?: string | null;
          next_target_sao?: number | null;
          next_target_sgo?: number | null;
          pass?: string;
          sao_sp?: number | null;
          sgo_sp?: number | null;
          status?: string | null;
          total_income?: number | null;
          updated_at?: string;
          valid_passwords?: string[] | null;
        };
        Relationships: [];
      };
      team_memberships: {
        Row: {
          added_at: string;
          custom_alias: string | null;
          distributor_id: string;
          leader_id: string;
          notes: string | null;
        };
        Insert: {
          added_at?: string;
          custom_alias?: string | null;
          distributor_id: string;
          leader_id: string;
          notes?: string | null;
        };
        Update: {
          added_at?: string;
          custom_alias?: string | null;
          distributor_id?: string;
          leader_id?: string;
          notes?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "team_memberships_distributor_id_fkey";
            columns: ["distributor_id"];
            isOneToOne: false;
            referencedRelation: "distributors";
            referencedColumns: ["awplid"];
          },
          {
            foreignKeyName: "team_memberships_leader_id_fkey";
            columns: ["leader_id"];
            isOneToOne: false;
            referencedRelation: "leaders";
            referencedColumns: ["id"];
          }
        ];
      };
      payouts: {
        Row: {
          admin_charges: number;
          cheque_date: string;
          cheque_no: string;
          created_at: string;
          distributor_id: string;
          gross_amount: number;
          id: number;
          net_amount: number;
          status: string;
          tds_amount: number;
          transaction_no: string | null;
        };
        Insert: {
          admin_charges?: number;
          cheque_date: string;
          cheque_no: string;
          created_at?: string;
          distributor_id: string;
          gross_amount?: number;
          id?: never;
          net_amount?: number;
          status?: string;
          tds_amount?: number;
          transaction_no?: string | null;
        };
        Update: {
          admin_charges?: number;
          cheque_date?: string;
          cheque_no?: string;
          created_at?: string;
          distributor_id?: string;
          gross_amount?: number;
          id?: never;
          net_amount?: number;
          status?: string;
          tds_amount?: number;
          transaction_no?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "payouts_distributor_id_fkey";
            columns: ["distributor_id"];
            isOneToOne: false;
            referencedRelation: "distributors";
            referencedColumns: ["awplid"];
          }
        ];
      };
      weekly_sp: {
        Row: {
          closing_date: string;
          created_at: string;
          distributor_id: string;
          id: number;
          sao_sp: number;
          sgo_sp: number;
          total_sp: number;
        };
        Insert: {
          closing_date: string;
          created_at?: string;
          distributor_id: string;
          id?: never;
          sao_sp?: number;
          sgo_sp?: number;
          total_sp?: number;
        };
        Update: {
          closing_date?: string;
          created_at?: string;
          distributor_id?: string;
          id?: never;
          sao_sp?: number;
          sgo_sp?: number;
          total_sp?: number;
        };
        Relationships: [
          {
            foreignKeyName: "weekly_sp_distributor_id_fkey";
            columns: ["distributor_id"];
            isOneToOne: false;
            referencedRelation: "distributors";
            referencedColumns: ["awplid"];
          }
        ];
      };
      bonanza_targets: {
        Row: {
          achieved_sao: number | null;
          achieved_sgo: number | null;
          distributor_id: string;
          id: string;
          name: string;
          req_sao: number | null;
          req_sgo: number | null;
          status: string | null;
          updated_at: string;
        };
        Insert: {
          achieved_sao?: number | null;
          achieved_sgo?: number | null;
          distributor_id: string;
          id?: string;
          name: string;
          req_sao?: number | null;
          req_sgo?: number | null;
          status?: string | null;
          updated_at?: string;
        };
        Update: {
          achieved_sao?: number | null;
          achieved_sgo?: number | null;
          distributor_id?: string;
          id?: string;
          name?: string;
          req_sao?: number | null;
          req_sgo?: number | null;
          status?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "bonanza_targets_distributor_id_fkey";
            columns: ["distributor_id"];
            isOneToOne: false;
            referencedRelation: "distributors";
            referencedColumns: ["awplid"];
          }
        ];
      };
      leaders: {
        Row: {
          allowedmemcount: number | null;
          awplid: string;
          awplpass: string;
          chequeData: Json | null;
          created_at: string;
          id: string;
          ispro: boolean | null;
          lastFetch: string | null;
          levelsao: number | null;
          levelsgo: number | null;
          memcount: number | null;
          name: string;
          phone: string | null;
          rank: string | null;
          selfStatus: string | null;
          targetdata: Json | null;
          team: Json | null;
          weekleft: number | null;
        };
        Insert: {
          allowedmemcount?: number | null;
          awplid?: string;
          awplpass?: string;
          chequeData?: Json | null;
          created_at?: string;
          id?: string;
          ispro?: boolean | null;
          lastFetch?: string | null;
          levelsao?: number | null;
          levelsgo?: number | null;
          memcount?: number | null;
          name?: string;
          phone?: string | null;
          rank?: string | null;
          selfStatus?: string | null;
          targetdata?: Json | null;
          team?: Json | null;
          weekleft?: number | null;
        };
        Update: {
          allowedmemcount?: number | null;
          awplid?: string;
          awplpass?: string;
          chequeData?: Json | null;
          created_at?: string;
          id?: string;
          ispro?: boolean | null;
          lastFetch?: string | null;
          levelsao?: number | null;
          levelsgo?: number | null;
          memcount?: number | null;
          name?: string;
          phone?: string | null;
          rank?: string | null;
          selfStatus?: string | null;
          targetdata?: Json | null;
          team?: Json | null;
          weekleft?: number | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      add_team_member: {
        Args: {
          p_awpl_id: string;
          p_awpl_pass: string;
          p_name?: string;
        };
        Returns: Json;
      };
      remove_team_member: {
        Args: {
          p_awpl_id: string;
        };
        Returns: Json;
      };
      check_awplid_available: {
        Args: { input_awplid: string };
        Returns: boolean;
      };
      json_matches_schema: {
        Args: { instance: Json; schema: Json };
        Returns: boolean;
      };
      jsonb_matches_schema: {
        Args: { instance: Json; schema: Json };
        Returns: boolean;
      };
      jsonschema_is_valid: {
        Args: { schema: Json };
        Returns: boolean;
      };
      jsonschema_validation_errors: {
        Args: { instance: Json; schema: Json };
        Returns: string[];
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
