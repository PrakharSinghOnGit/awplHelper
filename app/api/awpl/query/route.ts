import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { AWPL_BACKEND_URL, AWPL_DEFAULT_PIN } from "@/lib/api/awplBackend";
import { persistAwplDataToDatabase } from "@/lib/supabase/syncDatabase";
import { Database } from "@/utils/database.types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { dsCode, pass, pin = AWPL_DEFAULT_PIN, maxPages = 20 } = body;

    if (!dsCode || !pass) {
      return NextResponse.json(
        { success: false, error: "Missing distributor code (dsCode) or password (pass)" },
        { status: 400 }
      );
    }

    const backendRes = await fetch(`${AWPL_BACKEND_URL}/api/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": pin,
      },
      body: JSON.stringify({
        dsCode,
        pass,
        maxPages,
      }),
      cache: "no-store",
    });

    const data = await backendRes.json();

    if (!backendRes.ok || !data.success) {
      return NextResponse.json(
        {
          success: false,
          error: data.error || `Portal error: HTTP ${backendRes.status}`,
        },
        { status: backendRes.status || 500 }
      );
    }

    // Persist to Supabase on server side using service role key (bypasses RLS)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ynxiesmzkuqcnrdsujod.supabase.co";
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (serviceKey && data.data) {
      try {
        const adminSupabase = createClient<Database>(supabaseUrl, serviceKey);
        const { data: leaderRow } = await adminSupabase
          .from("leaders")
          .select("id")
          .ilike("awplid", dsCode.trim())
          .maybeSingle();

        await persistAwplDataToDatabase(
          adminSupabase,
          leaderRow?.id || "00000000-0000-0000-0000-000000000000",
          dsCode,
          pass,
          data.data
        );
      } catch (err) {
        console.warn("Server-side Supabase sync error:", err);
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to query AWPL backend";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
