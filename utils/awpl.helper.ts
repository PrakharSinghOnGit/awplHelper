const Levels = [
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

const TargetSAOs = [
  200, 800, 2000, 4400, 9200, 21200, 45200, 93200, 189200, 381200, 765200,
  1533200, 3069200, 6141200, 12285200, 24573200, 49149200, 98301200,
];
const TargetSGOs = [
  100, 400, 1000, 2200, 4600, 10600, 22600, 46600, 94600, 190600, 382600,
  766600, 1534600, 3070600, 6142600, 12286600, 24574600, 49150600,
];

export { Levels };
export type LevelProp = (typeof Levels)[number];

export function calcLevel(sao: number, sgo: number) {
  const saoIdx = TargetSAOs.findIndex((target) => sao < target);
  const sgoIdx = TargetSGOs.findIndex((target) => sgo < target);
  const minIdx =
    saoIdx === -1 ? sgoIdx : sgoIdx === -1 ? saoIdx : Math.min(saoIdx, sgoIdx);
  return Levels[minIdx === -1 ? Levels.length - 1 : minIdx];
}
