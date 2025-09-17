import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProtectedContent from "@/components/protected/ProtectedContent";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  console.log(data);
  if (error || !data?.claims) {
    console.log("No LOfin FOund here");
    redirect("/auth/login");
  }

  return <ProtectedContent />;
}
