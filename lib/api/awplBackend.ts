/**
 * AWPL Backend API Client and Data Definitions
 * Interfaces and helpers for interacting with the AWPL Helper Bun backend
 * Deployed at: https://awpl-helper-backend.onrender.com/
 */

export interface AwplDashboardProfile {
  name: string;
  saoTeamSp: number;
  sgoTeamSp: number;
  totalIncome: number;
  currentLevel: number;
  currentLevelName: string;
  nextLevel: number | null;
  nextLevelName: string | null;
  nextLevelTargetSao: number | null;
  nextLevelTargetSgo: number | null;
  phone?: string | null;
  email?: string | null;
  state?: string | null;
  userId?: number | null;
}

export interface AwplWeeklySP {
  "Closing Date": string;
  "SAO SP": string;
  "SGO SP": string;
  "Total SP": string;
}

export interface AwplPayout {
  [key: string]: string | undefined;
  "Id"?: string;
  "Cheque No."?: string;
  "Cheque Date"?: string;
  "Pay Date"?: string;
  "Total Amount"?: string;
  "TDS Amount"?: string;
  "TDS"?: string;
  "AWPL Foundation"?: string;
  "Admin Charges"?: string;
  "Net Amount"?: string;
  "Payment Status"?: string;
  "Transaction No"?: string;
}

export interface AwplLevelPending {
  Id?: string;
  Step: string;
  LevelName: string;
  TotalSAOSP: string;
  TotalSGOSP: string;
  SAOSP: string;
  SGOSP: string;
  RemainSAOSP: string;
  RemainSGOSP: string;
  Status: string;
}

export interface AwplBonanzaTarget {
  name?: string;
  target?: string;
  achieved?: string;
  status?: string;
  deadline?: string;
  [key: string]: unknown;
}

export interface AwplTripAchiever {
  name?: string;
  destination?: string;
  period?: string;
  status?: string;
  [key: string]: unknown;
}

export interface AwplQueryData {
  dashboard: AwplDashboardProfile;
  weeklySP: AwplWeeklySP[];
  bonanzaTargets: AwplBonanzaTarget[];
  tripAchievers: AwplTripAchiever[];
  levelPending: AwplLevelPending[];
  payouts: AwplPayout[];
}

export interface AwplApiResponse<T = AwplQueryData> {
  success: boolean;
  dsCode?: string;
  proxyUsed?: string;
  timestamp?: string;
  data?: T;
  error?: string;
}

export const AWPL_BACKEND_URL =
  process.env.NEXT_PUBLIC_AWPL_BACKEND_URL ||
  "https://awpl-helper-backend.onrender.com";

export const AWPL_DEFAULT_PIN =
  process.env.NEXT_PUBLIC_AWPL_PIN || "1122";

/**
 * Format currency in Indian Rupees (INR)
 */
export function formatINR(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return "₹0";
  const num = typeof value === "string" ? parseFloat(value.replace(/,/g, "")) : value;
  if (isNaN(num)) return "₹0";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Format currency with compact notation (e.g. ₹2.84 Cr, ₹42.5 K)
 */
export function formatCompactINR(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return "₹0";
  const num = typeof value === "string" ? parseFloat(value.replace(/,/g, "")) : value;
  if (isNaN(num)) return "₹0";

  if (Math.abs(num) >= 10000000) {
    return `₹${(num / 10000000).toFixed(2)} Cr`;
  }
  if (Math.abs(num) >= 100000) {
    return `₹${(num / 100000).toFixed(2)} Lakh`;
  }
  if (Math.abs(num) >= 1000) {
    return `₹${(num / 1000).toFixed(1)} K`;
  }
  return `₹${num.toLocaleString("en-IN")}`;
}

/**
 * Format Sales Points (SP) numbers nicely
 */
export function formatSP(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return "0 SP";
  const num = typeof value === "string" ? parseFloat(value.replace(/,/g, "")) : value;
  if (isNaN(num)) return "0 SP";

  return `${num.toLocaleString("en-IN", { maximumFractionDigits: 1 })} SP`;
}

/**
 * Parses numeric value from currency or SP strings (e.g. "35,000.00" -> 35000)
 */
export function parseCleanNumber(val: string | number | null | undefined): number {
  if (val === null || val === undefined) return 0;
  if (typeof val === "number") return val;
  const cleaned = val.replace(/[^0-9.-]/g, "");
  const res = parseFloat(cleaned);
  return isNaN(res) ? 0 : res;
}

/**
 * Query distributor data directly from the backend
 */
export async function queryDistributorData(
  dsCode: string,
  pass: string,
  pin: string = AWPL_DEFAULT_PIN,
  maxPages = 20
): Promise<AwplApiResponse> {
  const response = await fetch(`${AWPL_BACKEND_URL}/api/query`, {
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
  });

  if (!response.ok) {
    const errorJson = await response.json().catch(() => ({}));
    throw new Error(
      errorJson.error || `AWPL Backend returned error: HTTP ${response.status}`
    );
  }

  return response.json();
}
