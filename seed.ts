import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create a test leader
  const leader = await prisma.leader.upsert({
    where: { email: "john@example.com" },
    update: {},
    create: {
      email: "john@example.com",
      name: "John Doe",
      awplId: "LEADER001",
      awplPass: "password123",
      subscriptionStatus: "ACTIVE",
      billingCycle: "MONTHLY",
    },
  });

  console.log("✅ Created leader:", leader.name);

  // Create some test members
  const members = await Promise.all([
    prisma.member.upsert({
      where: { awplId: "MEMBER001" },
      update: {},
      create: {
        awplId: "MEMBER001",
        awplPass: "memberpass1",
        validPasses: ["memberpass1", "backup1"],
        status: "ACTIVE",
        levelData: {
          currentLevel: 3,
          pointsEarned: 1500,
          pointsToNext: 500,
          achievements: ["First Sale", "Team Builder"],
        },
        chequeData: {
          totalEarnings: 25000,
          thisMonth: 3500,
          lastPayment: {
            amount: 1500,
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          },
          pendingAmount: 750,
        },
      },
    }),
    prisma.member.upsert({
      where: { awplId: "MEMBER002" },
      update: {},
      create: {
        awplId: "MEMBER002",
        awplPass: "memberpass2",
        validPasses: ["memberpass2", "backup2"],
        status: "ACTIVE",
        levelData: {
          currentLevel: 5,
          pointsEarned: 3200,
          pointsToNext: 800,
          achievements: ["First Sale", "Team Builder", "Top Performer"],
        },
        targetData: {
          monthlyTarget: 10000,
          achieved: 8500,
          percentage: 85,
          daysLeft: 12,
          onTrack: true,
        },
      },
    }),
    prisma.member.upsert({
      where: { awplId: "MEMBER003" },
      update: {},
      create: {
        awplId: "MEMBER003",
        awplPass: "memberpass3",
        validPasses: ["memberpass3"],
        status: "ERROR",
        errorMessage: "Invalid credentials",
        lastDataFetch: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    }),
  ]);

  console.log("✅ Created members:", members.map((m) => m.awplId).join(", "));

  // Create team relationships
  for (const member of members) {
    await prisma.teamMember.upsert({
      where: {
        leaderId_memberId: {
          leaderId: leader.id,
          memberId: member.id,
        },
      },
      update: {},
      create: {
        leaderId: leader.id,
        memberId: member.id,
      },
    });
  }

  console.log("✅ Created team relationships");

  // Create some data fetch logs
  for (const member of members) {
    await prisma.dataFetchLog.createMany({
      data: [
        {
          memberId: member.id,
          success: true,
          dataType: "LEVEL",
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
        {
          memberId: member.id,
          success: member.status === "ACTIVE",
          dataType: "CHEQUE",
          error: member.status === "ERROR" ? "Failed to login" : null,
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        },
      ],
    });
  }

  console.log("✅ Created data fetch logs");
  console.log("🎉 Seeding completed!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
