import { useProfile } from "@/hooks/useDatabase";
import DashboardSkeleton from "../skeleton/DashboardSkeleton";

export default function Dashboard() {
  const { data: profile, isLoading, error } = useProfile();

  if (isLoading) return <DashboardSkeleton />;
  if (!profile) return <div>You don&apos;t have a profile yet.</div>;
  if (error) return <div>Error loading profile: {error.message}</div>;
  return (
    <div>
      <h2 className="font-bold text-2xl p-5">Welcome {profile[0].name}</h2>
    </div>
  );
}
