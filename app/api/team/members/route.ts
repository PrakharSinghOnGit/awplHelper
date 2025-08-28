import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const leaderId = request.headers.get("x-user-id") || "default-user";

    const teamMembers = await prisma.teamMember.findMany({
      where: { leaderId },
      include: {
        member: {
          include: {
            dataLogs: {
              orderBy: { createdAt: "desc" },
              take: 5, // Get last 5 logs
            },
          },
        },
      },
      orderBy: { addedAt: "desc" },
    });

    const membersWithStats = teamMembers.map((tm) => ({
      id: tm.member.id,
      awplId: tm.member.awplId,
      status: tm.member.status,
      lastDataFetch: tm.member.lastDataFetch,
      errorMessage: tm.member.errorMessage,
      addedAt: tm.addedAt,
      recentLogs: tm.member.dataLogs,
      levelData: tm.member.levelData,
      chequeData: tm.member.chequeData,
      targetData: tm.member.targetData,
    }));

    return NextResponse.json({
      teamMembers: membersWithStats,
      totalMembers: teamMembers.length,
      activeMembers: teamMembers.filter((tm) => tm.member.status === "ACTIVE")
        .length,
      errorMembers: teamMembers.filter((tm) => tm.member.status === "ERROR")
        .length,
    });
  } catch (error) {
    console.error("Error fetching team members:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const leaderId = request.headers.get("x-user-id") || "default-user";
    const { awplId, awplPass, validPasses } = await request.json();

    if (!awplId || !awplPass) {
      return NextResponse.json(
        { error: "AWPL ID and password are required" },
        { status: 400 }
      );
    }

    // Create or find the member
    const member = await prisma.member.upsert({
      where: { awplId },
      update: {
        awplPass,
        validPasses: validPasses || [],
        status: "ACTIVE",
        errorMessage: null,
      },
      create: {
        awplId,
        awplPass,
        validPasses: validPasses || [],
        status: "ACTIVE",
      },
    });

    // Create the team relationship
    const teamMember = await prisma.teamMember.create({
      data: {
        leaderId,
        memberId: member.id,
      },
      include: {
        member: true,
      },
    });

    return NextResponse.json(
      {
        message: "Team member added successfully",
        member: {
          id: teamMember.member.id,
          awplId: teamMember.member.awplId,
          status: teamMember.member.status,
          addedAt: teamMember.addedAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding team member:", error);

    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "This member is already part of your team" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
