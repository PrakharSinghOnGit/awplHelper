import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardContent from "@/components/protected/ProtectedContent";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    console.log("No Login Found here");
    redirect("/auth/login");
  }

  return <DashboardContent />;
}
