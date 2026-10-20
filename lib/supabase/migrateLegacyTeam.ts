import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/utils/database.types";

export async function migrateLegacyTeam(
  supabase: SupabaseClient<Database>,
  teamJson: unknown
): Promise<number> {
  if (!Array.isArray(teamJson) || teamJson.length === 0) return 0;

  let migrated = 0;
  for (const m of teamJson) {
    if (m && m.awplId && m.awplPass) {
      try {
        const { data, error } = await supabase.rpc("add_team_member", {
          p_awpl_id: String(m.awplId).trim(),
          p_awpl_pass: String(m.awplPass).trim(),
          p_name: String(m.name || "").trim(),
        });

        if (!error && data && (data as { success?: boolean }).success) {
          migrated++;
        }
      } catch (err) {
        console.warn("Could not migrate legacy team member:", m.awplId, err);
      }
    }
  }

  return migrated;
}
