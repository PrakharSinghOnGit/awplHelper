export type chequeProp = { date: string; amount: number }[];
export type targetProp = {
  name: string;
  reqSAO: number;
  reqSGO: number;
  penSAO: number;
  penSGO: number;
}[];
export type TeamMember = {
  awplId: string;
  awplPass: string;
  levelSao: number;
  levelSgo: number;
  name: string;
  lastMine: string; // ISO date string
  status: "ok" | "wrong" | "pending";
  chequeData: chequeProp[];
  targetData: targetProp[];
};
