import type { DataItem } from "./types";


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
  200,
  800,
  2000,
  4400,
  9200,
  21200,
  45200,
  93200,
  189200,
  381200,
  765200,
  1533200,
  3069200,
  6141200,
  12285200,
  24573200,
  49149200,
  98301200,
];
const TargetSGOs = [
  100,
  400,
  1000,
  2200,
  4600,
  10600,
  22600,
  46600,
  94600,
  190600,
  382600,
  766600,
  1534600,
  3070600,
  6142600,
  12286600,
  24574600,
  49150600,
];

const removeNonAlphaNum = (str: string) => str.replace(/\W/g, "");

const getURL = (id: string, pass: string) =>
  `https://asclepiuswellness.com/userpanel/uservalidationnew.aspx?memberid=${removeNonAlphaNum(id)}&pwd=${removeNonAlphaNum(pass)}`;

const pad = (str:String,amt:number,clr:any,join:String) => 
  (str.length < amt ? clr(str) + join.repeat(amt - str.length) : clr(str));

const mergeLvlData = (ChequeData: DataItem[], LevelData : DataItem[]) => {
    ChequeData.forEach((chequeItem) => {
      const matchingLevel = LevelData.find((levelItem) => levelItem.id === chequeItem.id);
      if (matchingLevel) {
        chequeItem.level = matchingLevel.level;
      }
    });
    return ChequeData;
}

export { Levels, TargetSAOs, TargetSGOs, getURL, pad , mergeLvlData };
