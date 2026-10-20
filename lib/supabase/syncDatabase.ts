import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/utils/database.types";
import { AwplQueryData, parseCleanNumber } from "@/lib/api/awplBackend";

type TypedSupabase = SupabaseClient<Database>;

export function parseDateToSql(dateStr: string): string {
  if (!dateStr) return new Date().toISOString().split("T")[0];
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

  const parts = dateStr.trim().split(/[/.-]/);
  if (parts.length === 3) {
    const day = parts[0].padStart(2, "0");
    const month = parts[1].padStart(2, "0");
    let year = parts[2];
    if (year.length === 2) year = `20${year}`;
    return `${year}-${month}-${day}`;
  }
  return new Date().toISOString().split("T")[0];
}

/**
 * Persists scraped AWPL data into the relational tables:
 * - distributors
 * - payouts (incremental unique cheques)
 * - weekly_sp (cycle production)
 * - leaders (summary stats)
 */
export async function persistAwplDataToDatabase(
  supabase: TypedSupabase,
  leaderId: string,
  leaderAwplId: string,
  leaderPass: string,
  data: AwplQueryData
) {
  const cleanId = leaderAwplId.trim().toUpperCase();

  try {
    // 1. Upsert distributor in unified catalog
    const { error: distErr } = await supabase.from("distributors").upsert(
      {
        awplid: cleanId,
        name: data.dashboard.name || "",
        pass: leaderPass,
        current_level: data.dashboard.currentLevel ?? null,
        current_level_name: data.dashboard.currentLevelName || "Fresher",
        next_level: data.dashboard.nextLevel ?? null,
        next_level_name: data.dashboard.nextLevelName ?? null,
        next_target_sao: data.dashboard.nextLevelTargetSao ?? null,
        next_target_sgo: data.dashboard.nextLevelTargetSgo ?? null,
        sao_sp: data.dashboard.saoTeamSp ?? 0,
        sgo_sp: data.dashboard.sgoTeamSp ?? 0,
        total_income: data.dashboard.totalIncome ?? 0,
        status: "ok",
        last_mined_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "awplid" }
    );

    if (distErr) {
      console.warn("Error upserting distributor:", distErr.message);
    }

    // 2. Incrementally insert payouts (Cheques)
    if (Array.isArray(data.payouts) && data.payouts.length > 0) {
      const payoutRows = data.payouts
        .map((p) => {
          if (!p) return null;
          const rawDate = String(p["Pay Date"] || p["Cheque Date"] || p["Date"] || "").trim();
          const chqDate = parseDateToSql(rawDate);
          if (!chqDate) return null;

          const chqNo = String(
            p["Cheque No."] ||
            p["Cheque No"] ||
            p["cheque_no"] ||
            `PAY_${chqDate}`
          ).trim();

          return {
            distributor_id: cleanId,
            cheque_no: chqNo,
            cheque_date: chqDate,
            gross_amount: parseCleanNumber(p["Total Amount"]),
            net_amount: parseCleanNumber(p["Net Amount"] || p["Total Amount"]),
            tds_amount: parseCleanNumber(p["TDS"] || p["TDS Amount"]),
            admin_charges: parseCleanNumber(p["AWPL Foundation"] || p["Admin Charges"]),
            status: p["Payment Status"] || "Paid",
            transaction_no: p["Transaction No"] || null,
          };
        })
        .filter((r): r is NonNullable<typeof r> => r !== null);

      if (payoutRows.length > 0) {
        // Upsert ignoring duplicates based on (distributor_id, cheque_no)
        const { error: payErr } = await supabase.from("payouts").upsert(
          payoutRows,
          { onConflict: "distributor_id,cheque_no", ignoreDuplicates: true }
        );
        if (payErr) {
          console.warn("Error upserting payouts:", payErr.message);
        }
      }
    }

    // 3. Incrementally insert weekly_sp
    if (Array.isArray(data.weeklySP) && data.weeklySP.length > 0) {
      const weeklyRows = data.weeklySP
        .filter((w) => w && w["Closing Date"])
        .map((w) => ({
          distributor_id: cleanId,
          closing_date: parseDateToSql(w["Closing Date"]),
          sao_sp: parseCleanNumber(w["SAO SP"]),
          sgo_sp: parseCleanNumber(w["SGO SP"]),
          total_sp: parseCleanNumber(w["Total SP"]),
        }));

      if (weeklyRows.length > 0) {
        const { error: spErr } = await supabase.from("weekly_sp").upsert(
          weeklyRows,
          { onConflict: "distributor_id,closing_date", ignoreDuplicates: true }
        );
        if (spErr) {
          console.warn("Error upserting weekly_sp:", spErr.message);
        }
      }
    }

    // 4. Update the Leader record summary
    const { error: leaderErr } = await supabase
      .from("leaders")
      .update({
        name: data.dashboard.name || undefined,
        levelsao: data.dashboard.saoTeamSp ?? undefined,
        levelsgo: data.dashboard.sgoTeamSp ?? undefined,
        rank: data.dashboard.currentLevelName || undefined,
        lastFetch: new Date().toISOString(),
        chequeData: data.payouts as unknown as Database["public"]["Tables"]["leaders"]["Row"]["chequeData"],
        targetdata: data.bonanzaTargets as unknown as Database["public"]["Tables"]["leaders"]["Row"]["targetdata"],
      })
      .eq("id", leaderId);

    if (leaderErr) {
      console.warn("Error updating leader summary:", leaderErr.message);
    }
  } catch (err) {
    console.error("Failed to persist AWPL data to database:", err);
  }
}
