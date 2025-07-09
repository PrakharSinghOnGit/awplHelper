import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (!error || data.user) {
    redirect("/protected/dashboard");
  }

  return (
    <>
      <h1>Welcome to AWPL Helper</h1>
      <h3>This is a data mining project </h3>
      <div>THIS IS LANDING PAGE</div>
      <Link href="/auth/login">
        <Button variant={"default"}>Login</Button>
      </Link>
      <Link href="/auth/sign-up">
        <Button variant={"default"}>SignUp</Button>
      </Link>
    </>
  );
}

// hero page
// with login button
