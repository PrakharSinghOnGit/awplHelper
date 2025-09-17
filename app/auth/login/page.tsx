import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";
import Image from "next/image";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="mb-1 flex justify-center border rounded-md p-2">
          <Link
            href="/"
            aria-label="home"
            className="flex items-center space-x-2"
          >
            <Image src={"/pickaxe.png"} alt="LOGO" width={32} height={32} />
            <span className="text-2xl font-bold logoFace">AWPL Helper</span>
          </Link>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
