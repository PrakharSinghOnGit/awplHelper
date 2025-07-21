import { levels } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const LEVELS: levels[] = [
  "Fresher",
  "Bronze",
  "Silver",
  "Gold",
  "Platinum",
  "Emerald",
  "Topaz",
  "Ruby Star",
  "Sapphire",
  "Star Sapphire",
  "Diamond",
  "Blue Diamond",
  "Black Diamond",
  "Royal Diamond",
  "Crown Diamond",
  "Ambassador",
  "Royal Ambassador",
  "Crown Ambassador",
  "Brand Ambassador",
];

const TARGET_SAOS = [
  200, 800, 2000, 4400, 9200, 21200, 45200, 93200, 189200, 381200, 765200,
  1533200, 3069200, 6141200, 12285200, 24573200, 49149200, 98301200,
];
const TARGET_SGOS = [
  100, 400, 1000, 2200, 4600, 10600, 22600, 46600, 94600, 190600, 382600,
  766600, 1534600, 3070600, 6142600, 12286600, 24574600, 49150600,
];

export function getLevel(sao: number, sgo: number): levels {
  const minIndex = Math.min(
    TARGET_SAOS.findIndex((targetSAO) => sao < targetSAO),
    TARGET_SGOS.findIndex((targetSGO) => sgo < targetSGO)
  );
  return minIndex === -1 ? LEVELS[LEVELS.length - 1] : LEVELS[minIndex];
}

export function getNormalizedCompletedSp(
  saosp: number,
  sgosp: number
): { ncsao: number; ncsgo: number; psao: number; psgo: number } {
  const minIndex = Math.min(
    TARGET_SAOS.findIndex((targetSAO) => saosp < targetSAO),
    TARGET_SGOS.findIndex((targetSGO) => sgosp < targetSGO)
  );
  const psao = Math.round(
    minIndex === -1 ? 0 : Math.max(0, TARGET_SAOS[minIndex] - saosp)
  );
  const psgo = Math.round(
    minIndex === -1 ? 0 : Math.max(0, TARGET_SGOS[minIndex] - sgosp)
  );
  const ncsao = 100 - (psao / TARGET_SAOS[minIndex]) * 100;
  const ncsgo = 100 - (psgo / TARGET_SGOS[minIndex]) * 100;
  return {
    psao: psao,
    psgo: psgo,
    ncsao: ncsao,
    ncsgo: ncsgo,
  };
}
