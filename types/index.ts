export type levels =
  | "Fresher"
  | "Bronze"
  | "Silver"
  | "Gold"
  | "Platinum"
  | "Emerald"
  | "Topaz"
  | "Ruby Star"
  | "Sapphire"
  | "Star Sapphire"
  | "Diamond"
  | "Blue Diamond"
  | "Black Diamond"
  | "Royal Diamond"
  | "Crown Diamond"
  | "Ambassador"
  | "Royal Ambassador"
  | "Crown Ambassador"
  | "Brand Ambassador";

export type TeamMember = {
  awpl_id: string;
  awpl_pass: string;
  created_at: Date;
  id: string;
  last_updated: Date;
  name: string;
  status_flag: "OK" | "PENDING" | "WRONG";
  valid_passwords: string[] | null;
};
