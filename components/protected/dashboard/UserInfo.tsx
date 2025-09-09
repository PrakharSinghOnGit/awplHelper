import { calcLevel } from "@/utils/awpl.helper";
import Image from "next/image";
import React from "react";

const levelImageMap: Record<string, string> = {
  Fresher: "/Bronze.png",
  Bronze: "/Bronze.png",
  Silver: "/Silver.png",
  Gold: "/Gold.png",
  Platinum: "/Gold.png",
  Emerald: "/Master.png",
  Topaz: "/Master.png",
  "Ruby Star": "/Royal0.png",
  Sapphire: "/Royal0.png",
  "Star Sapphire": "/Royal0.png",
  Diamond: "/Diamond.png",
  "Blue Diamond": "/Diamond.png",
  "Black Diamond": "/Diamond.png",
  "Royal Diamond": "/Diamond.png",
  "Crown Diamond": "/Diamond.png",
  Ambassador: "/Royal.png",
  "Royal Ambassador": "/Royal.png",
  "Crown Ambassador": "/Royal.png",
  "Brand Ambassador": "/Royal.png",
};

export const UserInfo = ({
  name,
  sao,
  sgo,
  mem,
  week,
  isPaid,
}: {
  name: string;
  sao: number;
  sgo: number;
  mem: number;
  week: number;
  isPaid: boolean;
}) => {
  const level = calcLevel(sao, sgo);
  return (
    <div className="col-span-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src={levelImageMap[level] || "/Bronze.png"}
            alt={level}
            width={80}
            height={80}
          />
          <div className="flex flex-col">
            <p className="inter text-muted-foreground">Welcome, {name}</p>
            <span className="drop-shadow-sm text-4xl font-bold logoFace">
              {level}
            </span>
          </div>
        </div>
        <div className="hidden sm:block">
          <p className="inter text-muted-foreground sm:text-right">
            {isPaid ? "Premium" : "Free"} Member
          </p>
          <span className="drop-shadow-sm text-2xl font-bold inter sm:text-right">
            {mem} Members | {week} Weeks
          </span>
        </div>
      </div>
    </div>
  );
};
