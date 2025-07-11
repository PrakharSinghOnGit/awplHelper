import { SignUpForm } from "@/components/sign-up-form";
import Image from "next/image";

export default function Page() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div
          style={{ fontFamily: "Bytesized" }}
          className="flex items-center gap-2 self-center font-bold text-2xl"
        >
          <Image
            src="/smallPick.webp"
            unoptimized
            alt="Pick"
            unselectable="on"
            width={35}
            height={35}
          />
          Awpl Helper.
        </div>
        <SignUpForm />
      </div>
    </div>
  );
}
