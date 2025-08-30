import UserLevel from "@/components/protected/dashboard/userLevel";
import { useUserProfile } from "@/hooks/useDatabase";
import { calcLevel } from "@/utils/awpl.helper";

export default function UserLevelExample() {
  const { data: profile, isLoading } = useUserProfile();

  if (isLoading) {
    return (
      <div className="w-full max-w-sm mx-auto">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-64 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="w-full max-w-sm mx-auto">
        <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">No profile data available</p>
        </div>
      </div>
    );
  }

  // Calculate current level based on SAO and SGO values
  const currentLevel = calcLevel(profile.level_SAO, profile.level_SGO);

  return (
    <div className="space-y-4">
      <UserLevel rank={currentLevel} />

      {/* Additional stats */}
      <div className="text-center text-sm text-gray-600 space-y-1">
        <p>
          SAO: {profile.level_SAO.toLocaleString()} / SGO:{" "}
          {profile.level_SGO.toLocaleString()}
        </p>
        <p>
          Target SAO: {profile.target_SAO.toLocaleString()} / Target SGO:{" "}
          {profile.target_SGO.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
