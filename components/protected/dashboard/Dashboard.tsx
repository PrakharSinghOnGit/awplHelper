import { useProfile } from "@/hooks/useDatabase";
import { DashboardSkeleton } from "@/components/protected/dashboard/DashboardSkeleton";
import { UserInfo } from "@/components/protected/dashboard/UserInfo";
import { ChequeInfo } from "@/components/protected/dashboard/ChequeInfo";
import { LevelInfo } from "@/components/protected/dashboard/LevelInfo";
import { TargetInfo } from "@/components/protected/dashboard/TargetInfo";
type CheckProp = { date: string; amount: number }[];
type TargetProp = {
  name: string;
  reqSAO: number;
  reqSGO: number;
  penSAO: number;
  penSGO: number;
}[];

export default function Dashboard() {
  const { data, isLoading, error } = useProfile();

  if (isLoading) return <DashboardSkeleton />;
  if (!data) return <div>You don&apos;t have a profile yet.</div>;
  if (error) return <div>Error loading profile: {error.message}</div>;
  const user = data[0];

  return (
    <div className="grid gap-3 lg:gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-flow-dense break-inside-avoid">
      <UserInfo
        name={user.name}
        sao={user.level_SAO ? user.level_SAO : 0}
        sgo={user.level_SGO ? user.level_SGO : 0}
        mem={user.members ? user.members : 0}
        week={user.week_left ? user.week_left : 0}
        isPaid={user.is_paid ? user.is_paid : false}
      />
      <LevelInfo type="SAO" sp={user.level_SAO} />
      <LevelInfo type="SGO" sp={user.level_SGO} />
      <TargetInfo data={user.target_data as TargetProp} />
      <ChequeInfo data={user.cheque_data as CheckProp} />
    </div>
  );
}
