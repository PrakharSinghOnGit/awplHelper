"use client";

import { useProfile } from "@/context/ProfileContext";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartRadialSimple } from "@/components/cards/Radial2";

export default function Dashboard() {
  const { profile, loading } = useProfile();

  if (loading) {
    return (
      <div className="p-4">
        <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance mb-8">
          <Skeleton className="h-12 w-1/2 mx-auto" />
        </h1>
        <div className="max-w-2xl mx-auto bg-muted p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">
            <Skeleton className="h-8 w-1/4" />
          </h2>
          <ul className="space-y-4">
            <li>
              <Skeleton className="h-6 w-3/4" />
            </li>
            <li>
              <Skeleton className="h-6 w-1/2" />
            </li>
            <li>
              <Skeleton className="h-6 w-2/3" />
            </li>
            <li>
              <Skeleton className="h-6 w-1/2" />
            </li>
            <li>
              <Skeleton className="h-6 w-3/4" />
            </li>
          </ul>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome!</h1>
        <p className="text-muted-foreground">
          Your profile data could not be loaded. Please try refreshing the page
          or contact support.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance mb-8">
        Welcome, {profile.name || "Leader"}!
      </h1>
      <div className="max-w-2xl mx-auto p-6 rounded-lg shadow">
        <ChartRadialSimple />
      </div>
    </div>
  );
}

// next level progress circular
// cheque bar chart
// total income
// total sp done
// current rank
