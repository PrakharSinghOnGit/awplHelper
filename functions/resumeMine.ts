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
  askFunc,
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
  if(retryWrong) {
    oldData.level = oldData.level.filter((item) => item.level !== "wrong");
    oldData.target = oldData.target.filter((item) => item.level !== "wrong");
    oldData.cheque = oldData.cheque.filter((item) => item.level !== "wrong");
  }
  ogData.forEach((ogItem) => {
    let c = 0;
    oldData.level.forEach((oldItem) => {
      if(oldItem.id === ogItem.id) c++;
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
  const func = await askFunc();
  const includeWrong = await askRetryWrong();
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
    const missingItems = findMissingData(prevData, teamData, includeWrong);
    console.log("Missing items:", missingItems);
    // const newData = await Mine(missingItems, func, name);
    // const Data:DataType = {
    //   level: prevData.level.concat(newData.level),
    //   target: prevData.target.concat(newData.target),
    //   cheque: prevData.cheque.concat(newData.cheque),
    // };
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
