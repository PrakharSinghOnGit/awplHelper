import chalk from "chalk";
import path from "path";
import fs from "fs";
import { askTeam, terminate, getTeam, mergeLvlData,askDiscord } from "./helper";
import { Mine } from "./miner";
import { handleOutput } from "./handleData";
import { client } from "./Discord";
const env = Bun.env;

async function resumeMine() {
  const team = await askTeam();
  if(await askDiscord()) client.login(env.DiscordToken);
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
    const prevData = JSON.parse(fs.readFileSync(path.join(__dirname, "../datajson", name + ".json")).toString());
    console.log(prevData)
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
