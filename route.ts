import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // In a real app, you'd get the user ID from auth/session
    // For now, let's assume we have some way to identify the user
    const userId = request.headers.get("x-user-id") || "default-user";

    // Try to find the leader first
    const user = await prisma.leader.findUnique({
      where: { id: userId },
      include: {
        teamMembers: {
          include: {
            member: true,
          },
        },
      },
    });

    if (!user) {
      // If not found as leader, try as member
      const member = await prisma.member.findUnique({
        where: { id: userId },
        include: {
          leaders: {
            include: {
              leader: true,
            },
          },
        },
      });

      if (member) {
        return NextResponse.json({
          id: member.id,
          name: member.awplId, // Using awplId as name for now
          email: member.awplId + "@example.com", // Placeholder
          role: "member",
          status: member.status,
          leaders: member.leaders.map((tl) => tl.leader),
        });
      }

      // If no user found, return error
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return leader data
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: "leader",
      subscriptionStatus: user.subscriptionStatus,
      billingCycle: user.billingCycle,
      teamSize: user.teamMembers.length,
      teamMembers: user.teamMembers.map((tm) => tm.member),
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id") || "default-user";
    const updates = await request.json();

    // Try to update as leader first
    try {
      const updatedLeader = await prisma.leader.update({
        where: { id: userId },
        data: updates,
        include: {
          teamMembers: {
            include: {
              member: true,
            },
          },
        },
      });

      return NextResponse.json({
        id: updatedLeader.id,
        name: updatedLeader.name,
        email: updatedLeader.email,
        role: "leader",
        subscriptionStatus: updatedLeader.subscriptionStatus,
        billingCycle: updatedLeader.billingCycle,
        teamSize: updatedLeader.teamMembers.length,
      });
    } catch {
      // If not found as leader, try as member
      const updatedMember = await prisma.member.update({
        where: { id: userId },
        data: updates,
      });

      return NextResponse.json({
        id: updatedMember.id,
        name: updatedMember.awplId,
        email: updatedMember.awplId + "@example.com",
        role: "member",
        status: updatedMember.status,
      });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
