#!/usr/bin/env bun
const startTime = Date.now();
const { MultiSelect } = require("enquirer");
import { getTeamList, getTeam, handleOutput } from "./functions/handleData";
import { Mine } from "./functions/miner";
import {
  mergeLvlData,
  terminate,
  clear,
  openOUT,
  print,
  getTimeLeft
} from "./functions/helper";
import path from "path";
import chalk from "chalk";
import { Command } from "commander";
const program = new Command();
import { env } from "bun";
import {
  sendDiscordMessage,
  getDiscordChannel,
  client,
} from "./functions/Discord";
const channel = await getDiscordChannel(client, env.DiscordChannelID || ""); // Use async function for clarity
if (!channel) {
  console.error(`Channel with ID ${env.DiscordChannelID} not found`);
  process.exit(1);
}
const Main = async () => {
  const func = await new MultiSelect({
    name: "function",
    message: "SELECT FUNCTION",
    choices: ["LEVEL", "TARGET", "CHEQUE"],
  }).run();

  const team = await new MultiSelect({
    name: "team",
    message: "SELECT TEAM",
    choices: getTeamList(),
  }).run();

  for (let i = 0; i < team.length; i++) {
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
    const Data = await Mine(teamData, func);
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
        channel,
        "Completed Mine of "+name,
        path.join(__dirname, "../out/" + name + ".html")
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

program.parse(process.argv);
