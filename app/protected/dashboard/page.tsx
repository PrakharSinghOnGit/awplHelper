"use client";

import { useProfile } from "@/context/ProfileContext";
import { LevelSPComplete } from "@/app/protected/dashboard/LevelSpComplete";
import Link from "next/link";
import DashSkeleton from "@/app/protected/dashboard/DashboardSkeleton";
import LevelCard from "./LevelCard";
import { getLevel } from "@/lib/utils";
import { ChequeBarChart } from "./ChequeBarChart";

export default function Dashboard() {
  const { profile, loading, forceRefresh } = useProfile();

  if (loading) {
    return <DashSkeleton />;
  }

  if (!profile) {
    return (
      <div className="p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome!</h1>
        <p className="text-muted-foreground">
          Your profile data could not be loaded. Please try refreshing the page
          or ask for{" "}
          <Link href={"/help"} className="underline">
            help
          </Link>
          .
        </p>
      </div>
    );
  }

  console.log(profile);

  return (
    <div className="p-0 sm:p-3">
      <h1
        onClick={forceRefresh}
        className="scroll-m-20 text-xl font-extrabold text-balance my-6 sm:mt-3"
      >
        Welcome, {profile.name || "Leader"}!
      </h1>
      <div className="gap-6 columns-1 md:columns-1 lg:columns-2">
        <LevelCard
          level={getLevel(profile.level_SAO!, profile.level_SGO!)}
          className="break-inside-avoid mb-6"
        />
        <LevelSPComplete
          saosp={profile.level_SAO!}
          sgosp={profile.level_SGO!}
          className="break-inside-avoid mb-6"
        />
        <ChequeBarChart
          data={profile.cheque_data!}
          className="break-inside-avoid mb-6"
        />
      </div>
    </div>
  );
}

// next level progress circular // done
// cheque bar chart
// total income
// total sp done
// current rank // done
