import React from "react";
import { Button } from "./button";
import Image from "next/image";
import { ArrowRightIcon } from "lucide-react";

const TopBar = () => {
  return (
    <div className="w-full top-0 m-2 flex px-3">
      <div className="w-full sm:mx-[10%] lg:mx-[5%] mt-2 rounded-xl flex justify-between p-2">
        <div className="flex justify-center items-center gap-3">
          <Image
            src="/smallPick.webp"
            unoptimized
            width={25}
            height={25}
            alt="Hero"
            className=""
          />
          <div
            className="text-2xl font-bold"
            style={{ fontFamily: "Bytesized" }}
          >
            AWPL Helper
          </div>
        </div>
        <div></div>
        <div className="flex gap-2 justify-center items-center">
          <Button variant="outline" icon={ArrowRightIcon} iconPlacement="right">
            Sign In
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
