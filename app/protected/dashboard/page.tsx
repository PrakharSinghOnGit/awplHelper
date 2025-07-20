"use client";

import { useProfile } from "@/context/ProfileContext";
import { ChartRadialSimple } from "@/components/cards/Radial2";
import Link from "next/link";
import DashSkeleton from "@/components/cards/DashboardSkeleton";
import LevelCard from "./LevelCard";
import { getLevel } from "@/lib/utils";

export default function Dashboard() {
  const { profile, loading } = useProfile();

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
      <h1 className="scroll-m-20 text-xl font-extrabold text-balance my-6 sm:mt-3">
        Welcome, {profile.name || "Leader"}!
      </h1>
      <div className="gap-6 grid md:grid-cols-2 lg:grid-cols-3">
        <LevelCard level={getLevel(profile.level_SAO!, profile.level_SGO!)} />
        <ChartRadialSimple
          saosp={profile.level_SAO!}
          sgosp={profile.level_SGO!}
        />
      </div>
    </div>
  );
}

// next level progress circular
// cheque bar chart
// total income
// total sp done
// current rank
