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
  uuid: string;
  id: string;
  name: string;
  pass: string;
};
