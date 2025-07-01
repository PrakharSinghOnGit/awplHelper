import { TeamMember } from "@/types";
import { v4 as uuidv4 } from "uuid";

const data: TeamMember[] = [
  {
    uuid: uuidv4(),
    id: "aabbcc",
    pass: "5135",
    name: "vv",
  },
  {
    uuid: uuidv4(),
    id: "ababab",
    pass: "5135",
    name: "b",
  },
  {
    uuid: uuidv4(),
    id: "abcabc",
    pass: "5135",
    name: "c",
  },
  {
    uuid: uuidv4(),
    id: "acacac",
    pass: "5135",
    name: "de",
  },
  {
    uuid: uuidv4(),
    id: "cacaca",
    pass: "5135",
    name: "fg",
  },
  {
    uuid: uuidv4(),
    id: "bcbcbc",
    pass: "5135",
    name: "zz",
  },
];

export async function getTeamMembers() {
  return data;
}

export async function addTeamMember(member: Omit<TeamMember, "uuid">) {
  const newMember = { ...member, uuid: uuidv4() };
  data.push(newMember);
  return newMember;
}

export async function updateTeamMember(member: TeamMember) {
  const index = data.findIndex((m) => m.uuid === member.uuid);
  if (index !== -1) {
    data[index] = { ...data[index], ...member };
    return data[index];
  }
  return null;
}

export async function deleteTeamMember(memberId: string) {
  const index = data.findIndex((m) => m.uuid === memberId);
  if (index !== -1) {
    const deletedMember = data[index];
    data.splice(index, 1);
    return deletedMember;
  }
  return null;
}
