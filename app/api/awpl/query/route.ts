import { NextResponse } from "next/server";
import { AWPL_BACKEND_URL, AWPL_DEFAULT_PIN } from "@/lib/api/awplBackend";

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

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to query AWPL backend";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
