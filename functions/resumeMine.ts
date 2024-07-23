import chalk from "chalk";
import path from "path";
import fs from "fs";
import {
  askTeam,
  terminate,
  getTeam,
  mergeLvlData,
  askDiscord,
  askRetryWrong,
} from "./helper";
import { Mine } from "./miner";
import { handleOutput } from "./handleData";
import { client } from "./Discord";
import type { DataType, DataItem, data } from "./types";
const env = Bun.env;

function findMissingData(
  oldData: DataType,
  ogData: data[],
  retryWrong: boolean
): data[] {
  const missingData: data[] = [];
  console.log(retryWrong)
  ogData.forEach((ogItem) => {
    let c = 0;
    oldData.level.forEach((oldItem) => {
      if(oldItem.id === ogItem.id) c++;
      if(retryWrong || oldItem.level === "wrong") c=0;
    });
    oldData.cheque.forEach((oldItem) => {
      if(oldItem.id === ogItem.id) c++;
    });
    oldData.cheque.forEach((oldItem) => {
      if(oldItem.id === ogItem.id) c++;
    });
    if (c !== 3) missingData.push(ogItem);
  });


  return missingData;
}

async function resumeMine() {
  const team = await askTeam();
  const retryWrong = await askRetryWrong();
  if (await askDiscord()) client.login(env.DiscordToken);
  for (let i = 0; i < team.length; i++) {
    const localTime = Date.now();
    const name = team[i];
    const teamData = getTeam(name);
    terminate();
    console.log(
      chalk.whiteBright.bold("Mining for Team"),
      ":",
      chalk.yellow.bold(name),
      ":",
      chalk.green.bold(teamData.length)
    );
    terminate();
    const prevData = JSON.parse(
      fs
        .readFileSync(path.join(__dirname, "../json/", name + ".json"))
        .toString()
    );
    const missingItems = findMissingData(prevData, teamData, retryWrong);
    console.log("Missing items:", missingItems);
    // const Data = await Mine(teamData, func);
    // if (func.includes("CHEQUE")) {
    //   Data.cheque = mergeLvlData(Data.cheque, Data.level);
    // }
    // Bun.write(
    //   path.join(__dirname, "json", name + ".json"),
    //   JSON.stringify(Data, null, 2)
    // );
    // await handleOutput(name, Data);
  }
}

export { resumeMine };
