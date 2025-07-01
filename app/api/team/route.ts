import { NextRequest, NextResponse } from "next/server";
import {
  getTeamMembers,
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "@/lib/teamService";

export async function GET() {
  const members = await getTeamMembers();
  return NextResponse.json(members);
}

export async function POST(req: NextRequest) {
  const newMember = await req.json();
  const addedMember = await addTeamMember(newMember);
  return NextResponse.json({ success: true, member: addedMember });
}

export async function PUT(req: NextRequest) {
  const updatedMember = await req.json();
  const updatedMemberWithUuid = await updateTeamMember(updatedMember);
  return NextResponse.json({ success: true, member: updatedMemberWithUuid });
}

export async function DELETE(req: NextRequest) {
  const { uuid } = await req.json();
  const deletedMember = await deleteTeamMember(uuid);
  return NextResponse.json({ success: true, member: deletedMember });
}
