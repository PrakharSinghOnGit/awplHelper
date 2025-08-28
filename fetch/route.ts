import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { memberId, dataType } = await request.json();

    if (!memberId || !dataType) {
      return NextResponse.json(
        { error: "Member ID and data type are required" },
        { status: 400 }
      );
    }

    const member = await prisma.member.findUnique({
      where: { id: memberId },
    });

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // Simulate AWPL data fetching
    let success = true;
    let fetchedData = null;
    let errorMessage = null;

    try {
      // This is where you'd integrate with the actual AWPL website
      // For now, we'll simulate the data fetching
      fetchedData = await simulateAWPLDataFetch(member, dataType);
    } catch (error) {
      success = false;
      errorMessage =
        error instanceof Error ? error.message : "Failed to fetch data";
    }

    // Update member with fetched data
    const updateData: {
      lastDataFetch: Date;
      status: string;
      errorMessage: string | null;
      levelData?: object;
      chequeData?: object;
      targetData?: object;
    } = {
      lastDataFetch: new Date(),
      status: success ? "ACTIVE" : "ERROR",
      errorMessage: success ? null : errorMessage,
    };

    if (success && fetchedData) {
      switch (dataType) {
        case "LEVEL":
          updateData.levelData = fetchedData;
          break;
        case "CHEQUE":
          updateData.chequeData = fetchedData;
          break;
        case "TARGET":
          updateData.targetData = fetchedData;
          break;
      }
    }

    const updatedMember = await prisma.member.update({
      where: { id: memberId },
      data: updateData,
    });

    // Log the data fetch attempt
    await prisma.dataFetchLog.create({
      data: {
        memberId,
        success,
        error: errorMessage,
        dataType,
      },
    });

    return NextResponse.json({
      success,
      message: success ? "Data fetched successfully" : "Failed to fetch data",
      data: success ? fetchedData : null,
      error: errorMessage,
      member: {
        id: updatedMember.id,
        awplId: updatedMember.awplId,
        status: updatedMember.status,
        lastDataFetch: updatedMember.lastDataFetch,
      },
    });
  } catch (error) {
    console.error("Error in data fetch API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Simulate AWPL data fetching - replace with actual implementation
async function simulateAWPLDataFetch(
  member: { awplId: string; awplPass: string },
  dataType: string
) {
  // Simulate network delay
  await new Promise((resolve) =>
    setTimeout(resolve, 1000 + Math.random() * 2000)
  );

  // Simulate occasional failures
  if (Math.random() < 0.1) {
    throw new Error("AWPL website timeout");
  }

  // Generate mock data based on type
  switch (dataType) {
    case "LEVEL":
      return {
        currentLevel: Math.floor(Math.random() * 10) + 1,
        pointsEarned: Math.floor(Math.random() * 10000),
        pointsToNext: Math.floor(Math.random() * 2000),
        achievements: ["First Sale", "Team Builder"],
        fetchedAt: new Date().toISOString(),
      };

    case "CHEQUE":
      return {
        totalEarnings: Math.floor(Math.random() * 50000),
        thisMonth: Math.floor(Math.random() * 5000),
        lastPayment: {
          amount: Math.floor(Math.random() * 2000),
          date: new Date(
            Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
        pendingAmount: Math.floor(Math.random() * 1000),
        fetchedAt: new Date().toISOString(),
      };

    case "TARGET":
      return {
        monthlyTarget: 10000,
        achieved: Math.floor(Math.random() * 12000),
        percentage: Math.floor(Math.random() * 120),
        daysLeft: Math.floor(Math.random() * 30),
        onTrack: Math.random() > 0.3,
        fetchedAt: new Date().toISOString(),
      };

    default:
      throw new Error("Unknown data type");
  }
}
