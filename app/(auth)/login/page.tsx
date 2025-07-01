import { Pickaxe } from "lucide-react";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a
          href="#"
          className="flex items-center gap-2 self-center font-bold text-2xl"
        >
          <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
            <Pickaxe className="size-5" />
          </div>
          Awpl Helper.
        </a>
        <LoginForm />
      </div>
    </div>
  );
}
