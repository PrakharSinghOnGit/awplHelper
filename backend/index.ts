import fs from "fs";
import { v4 as uuidv4 } from "uuid";
const leaders = JSON.parse(
  fs.readFileSync("./Leaders.json", "utf-8")
) as LeaderType[];
const members = JSON.parse(
  fs.readFileSync("./Members.json", "utf-8")
) as MemberType[];
type LeaderType = {
  name: string;
  uuid: string;
  email: string;
  awplId: string;
  awplPass: string;
  weekLeft: number;
  isPaid: boolean;
  slots: number;
  team: string[];
  lastPaid: Date | null;
  lastMine: Date | null;
  passStatus: string;
  chequeData: {
    amount: number;
    date: string;
  }[];
};

type MemberType = {
  name: string;
  id: string;
  pass: string;
  newPass: string[];
  levelSAO: number;
  levelSGO: number;
  tergetSAO: number;
  tergetSGO: number;
  parentCount: number;
  lastMine: Date | null;
  passStatus: "Correct" | "Incorrect" | "Pending";
  chequeData: {
    amount: number;
    date: string;
  }[];
};

// this is like a signup and the parameters are filled when signed in
export function addNewLeader(
  name: string,
  email: string,
  awplId: string,
  awplPass: string
) {
  const newLeader: LeaderType = {
    uuid: uuidv4(),
    name,
    email,
    awplId,
    awplPass,
    weekLeft: 0,
    isPaid: false,
    slots: 0,
    team: [],
    lastPaid: null,
    lastMine: null,
    passStatus: "false",
    chequeData: [],
  };
  leaders.push(newLeader);
  fs.writeFileSync("./Leaders.json", JSON.stringify(leaders));
}

export function addNewMember(name: string, id: string, pass: string) {
  const newMember: MemberType = {
    name,
    id,
    pass,
    newPass: [],
    levelSAO: 0,
    levelSGO: 0,
    tergetSAO: 0,
    tergetSGO: 0,
    parentCount: 0,
    lastMine: null,
    passStatus: "Pending",
    chequeData: [],
  };
  members.push(newMember);
  fs.writeFileSync("./Members.json", JSON.stringify(members));
}

export function getTeam(uuid: string) {
  const teamLeader = leaders.find((leader) => leader.uuid === uuid);
  if (!teamLeader) {
    throw new Error("Team leader not found");
  }
  if (!teamLeader.team) {
    throw new Error("No Team under this Leader");
  }
  const teamIds = teamLeader.team;
  const team: MemberType[] = [];
  members.forEach((mem) => {
    if (teamIds.includes(mem.id)) {
      team.push(mem);
    }
  });

  return team;
}
