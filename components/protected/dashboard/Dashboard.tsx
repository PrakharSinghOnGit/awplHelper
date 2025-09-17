import { useProfile } from "@/hooks/useDatabase";
import { DashboardSkeleton } from "@/components/protected/dashboard/DashboardSkeleton";
import { UserInfo } from "@/components/protected/dashboard/UserInfo";
import { ChequeInfo } from "@/components/protected/dashboard/ChequeInfo";
import { LevelInfo } from "@/components/protected/dashboard/LevelInfo";
import { TargetInfo } from "@/components/protected/dashboard/TargetInfo";
import { chequeProp, targetProp } from "../Team/type";

export default function Dashboard() {
  const { data, isLoading, error } = useProfile();

  if (isLoading) return <DashboardSkeleton />;
  if (!data) return <div>You don&apos;t have a profile yet.</div>;
  if (error) return <div>Error loading profile: {error.message}</div>;
  console.log("Profile Data:", data);
  return (
    <div className="grid gap-3 lg:gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-flow-dense break-inside-avoid">
      <UserInfo
        name={data.name}
        sao={data.levelsao ? data.levelsao : 0}
        sgo={data.levelsgo ? data.levelsgo : 0}
        mem={data.memcount ? data.memcount : 0}
        week={data.weekleft ? data.weekleft : 0}
        isPaid={data.ispro ? data.ispro : false}
      />
      <LevelInfo type="SAO" sp={data.levelsao} />
      <LevelInfo type="SGO" sp={data.levelsgo} />
      <TargetInfo data={data.targetdata as targetProp} />
      <ChequeInfo data={data.chequeData as chequeProp} />
    </div>
  );
}
