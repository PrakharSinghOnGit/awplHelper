#!/usr/bin/env bun
const startTime = Date.now();
import { handleOutput } from "./functions/handleData";
import { Mine } from "./functions/miner";
import path from "path";
import chalk from "chalk";
import { Command } from "commander";
const program = new Command();
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
} from "./functions/helper";
const Main = async () => {
  const func = await askFunc();
  const team = await askTeam();
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
    const Data = await Mine(teamData, func, name);
    if (func.includes("CHEQUE")) {
      Data.cheque = mergeLvlData(Data.cheque, Data.level);
    }
    Bun.write(
      path.join(__dirname, "json", name + ".json"),
      JSON.stringify(Data, null, 2)
    );
    await handleOutput(name, Data);
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
