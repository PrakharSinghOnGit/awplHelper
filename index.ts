#!/usr/bin/env bun
const startTime = Date.now();
import { handleOutput } from "./functions/handleData";
import { Mine } from "./functions/miner";
import path from "path";
import chalk from "chalk";
import { Command } from "commander";
const program = new Command();
const env = Bun.env;
import { resumeMine } from "./functions/resumeMine";
import {
  mergeLvlData,
  terminate,
  clear,
  openOUT,
  print,
  getTimeLeft,
  askTeam,
  askFunc,
  getTeam,
  askDiscord,
} from "./functions/helper";
import {
  sendDiscordMessage,
  client,
} from "./functions/Discord";

const Main = async () => {
  const func = await askFunc();
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
    const Data = await Mine(teamData, func, name);
    if (func.includes("CHEQUE")) {
      Data.cheque = mergeLvlData(Data.cheque, Data.level);
    }
    Bun.write(
      path.join(__dirname, "json", name + ".json"),
      JSON.stringify(Data, null, 2)
    );
    await handleOutput(name, Data);
    try {
      await sendDiscordMessage(
        `Completed Mine of ${name}
        Time Taken: ${getTimeLeft(localTime)}
        `,
        path.join(__dirname, "./out/" + name + ".html")
      );
    } catch (error) {
      console.log(chalk.red("!Error sending message or file"));
    }
  }
  console.log(chalk.green("Mining Completed..."));
  console.log(chalk.green("Time Taken:"), getTimeLeft(startTime));
};

program
  .name("awpl")
  .version("0.0.1")
  .description("A simple CLI for managing AWPL automation project");

program.command("start").description("Start the AWPL Miner").action(Main);

program
  .command("print")
  .description("Prints the Output of the AWPL Miner")
  .action(print);

program
  .command("clear")
  .description("Clear the Output of the AWPL Miner")
  .action(clear);

program
  .command("out")
  .description("Opens the Output of the AWPL Miner")
  .action(openOUT);

program
  .command("resume")
  .description("Resume the AWPL Miner")
  .action(resumeMine);

program.parse(process.argv);
