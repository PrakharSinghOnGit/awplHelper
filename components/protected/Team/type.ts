export type chequeProp = { date: string; amount: number }[];
export type targetProp = {
  name: string;
  penSAO: number;
  penSGO: number;
  reqSAO: number;
  reqSGO: number;
}[];
export type TeamMember = {
  awplId: string;
  awplPass: string;
  levelSao: number;
  levelSgo: number;
  name: string;
  validPass: string[];
  lastMine: string; // ISO date string
  status: "ok" | "wrong" | "pending";
  chequeData: chequeProp[];
  targetData: targetProp[];
};
