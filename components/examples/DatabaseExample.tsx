import {
  useProfile,
  useCreateMember,
  useUpdateMember,
} from "@/hooks/useDatabase";
import { useUser } from "@/components/providers/SupabaseProvider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ExampleDatabaseComponent() {
  const { user, loading } = useUser();
  const { data: members, isLoading, error } = useProfile();
  const createMember = useCreateMember();
  const updateMember = useUpdateMember();

  if (loading) return <div>Loading user...</div>;
  if (!user) return <div>Please log in</div>;
  console.log("Authenticated user:", user.new_email);

  const handleCreateMember = async () => {
    try {
      await createMember.mutateAsync({
        name: "New Member",
        awpl_id: "TEST123",
        levelSao: 1,
        levelSgo: 1,
        targetSao: 10,
        targetSgo: 10,
      });
    } catch (error) {
      console.error("Error creating member:", error);
    }
  };

  const handleUpdateMember = async (memberId: string) => {
    try {
      await updateMember.mutateAsync({
        id: memberId,
        updates: {
          levelSao: 20,
        },
      });
    } catch (error) {
      console.error("Error updating member:", error);
    }
  };

  if (isLoading) return <div>Loading members...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Members Management</CardTitle>
        <CardDescription>
          Example component showing React Query + Supabase integration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button
            onClick={handleCreateMember}
            disabled={createMember.isPending}
          >
            {createMember.isPending ? "Creating..." : "Create Member"}
          </Button>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              Members ({members?.length || 0})
            </h3>
            {members?.map((member) => (
              <div
                key={member.id}
                className="flex justify-between items-center p-2 border rounded"
              >
                <div>
                  <span className="font-medium">{member.name}</span>
                  <span className="ml-2 text-sm text-gray-600">
                    Level SAO: {member.name}
                  </span>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleUpdateMember(member.id)}
                  disabled={updateMember.isPending}
                >
                  Update Level
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
