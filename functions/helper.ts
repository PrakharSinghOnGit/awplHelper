import chalk from "chalk";
import type { DataItem, data } from "./types";
import cliWidth from "cli-width";
import child_process from "child_process";
const { MultiSelect, Confirm } = require("enquirer");
import { handleOutput } from "./handleData";
import path from "path";
import fs from "fs";

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
const getURL = (id: string, pass: string): string => {
  return `https://asclepiuswellness.com/userpanel/uservalidationnew.aspx?memberid=${removeNonAlphaNum(
    id
  )}&pwd=${removeNonAlphaNum(pass)}`;
};
const pad = (str: String, amt: number, clr: any, join: String): string => {
  return str.length < amt ? clr(str) + join.repeat(amt - str.length) : clr(str);
};
const mergeLvlData = (ChequeData: DataItem[], LevelData: DataItem[]) => {
  ChequeData.forEach((chequeItem) => {
    const matchingLevel = LevelData.find(
      (levelItem) => levelItem.id === chequeItem.id
    );
    if (matchingLevel) {
      chequeItem.level = matchingLevel.level;
    }
  });
  return ChequeData;
};
const terminate = () => {
  console.log(chalk.dim("-=".repeat(cliWidth() / 4)));
};
const openOUT = () => {
  console.log(chalk.green("Opening the Output of the AWPL Miner..."));
  child_process.exec("start out");
};
const clear = () => {
  fs.readdirSync(path.join(__dirname, "../out")).forEach((file) => {
    fs.unlinkSync(path.join(__dirname, "../out", file));
  });
  fs.readdirSync(path.join(__dirname, "../json")).forEach((file) => {
    fs.unlinkSync(path.join(__dirname, "../json", file));
  });
  console.log(chalk.green("Output Cleared..."));
};
async function print() {
  let lists = fs
    .readdirSync(path.join(__dirname, "../json"))
    .map((file) => file.replace(".json", ""));

  const list = await new MultiSelect({
    name: "list",
    message: "SELECT LIST",
    choices: lists,
  }).run();

  list.forEach(async (e: string) => {
    let content = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../json", e + ".json"), "utf-8")
    );
    await handleOutput(e, content);
  });
}
function getTimeLeft(startTime: number) {
  const endTime = Date.now();
  const timeTaken = endTime - startTime;
  const hours = Math.floor(timeTaken / 3600000);
  const minutes = Math.floor((timeTaken % 3600000) / 60000);
  const seconds = Math.floor((timeTaken % 60000) / 1000);
  const milliseconds = timeTaken % 1000;
  return `${hours}h ${minutes}m ${seconds}s ${milliseconds}ms`;
}
function askTeam() {
  return new MultiSelect({
    name: "team",
    message: "SELECT TEAM",
    choices: getTeamList(),
  }).run();
}
function askFunc() {
  return new MultiSelect({
    name: "func",
    message: "SELECT FUNCTION",
    choices: ["LEVEL", "TARGET", "CHEQUE"],
  }).run();
}
function getTeamList() {
  let list = fs
    .readdirSync(path.join(__dirname, "../data"))
    .map((file) => file.replace(".csv", ""));
  return list;
}
function getTeam(team: string) {
  let data = fs.readFileSync(
    path.join(__dirname, "../data", `${team}.csv`),
    "utf-8"
  );
  return csvToJson(data);
}
function csvToJson(csv: string): data[] {
  let lines = csv.replaceAll("\r", "").split("\n");
  let headers = lines[0].split(",");
  let result: data[] = [];
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].toString().startsWith("!")) continue;
    let obj: data = { id: "", pass: "", name: "" };
    let currentline = lines[i].split(",");
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j] as keyof data] = currentline[j].toUpperCase().trim();
    }
    result.push(obj);
  }
  return result;
}
async function askDiscord() {
  return await new Confirm({
    name: "question",
    message: "Send Output via Discord?",
  }).run();
}

async function askRetryWrong(): Promise<boolean> {
  return await new Confirm({
    name: "question",
    message: "retry wrong passwords?",
  }).run();
}

export {
  Levels,
  TargetSAOs,
  TargetSGOs,
  getURL,
  pad,
  mergeLvlData,
  terminate,
  openOUT,
  clear,
  print,
  getTimeLeft,
  askTeam,
  askFunc,
  getTeamList,
  getTeam,
  askDiscord,
  askRetryWrong,
};
