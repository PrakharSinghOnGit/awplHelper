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
} from "./functions/helper";
import path from "path";
import chalk from "chalk";
import { Command } from "commander";
const program = new Command();

const Main = async () => {
  const func = await new MultiSelect({
    name: "function",
    message: "SELECT FUNCTION",
    choices: ["LEVEL", "TARGET", "CHEQUE"],
    //initial: ["LEVEL", "TARGET", "CHEQUE"]
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
  }

  const endTime = Date.now();
  const timeTaken = endTime - startTime;
  const hours = Math.floor(timeTaken / 3600000);
  const minutes = Math.floor((timeTaken % 3600000) / 60000);
  const seconds = Math.floor((timeTaken % 60000) / 1000);
  const milliseconds = timeTaken % 1000;
  console.log(
    chalk.bold("Time Taken:"),
    chalk.yellow.bold(`${hours}h ${minutes}m ${seconds}s ${milliseconds}ms`)
  );
};

program
  .name("awpl")
  .version("0.0.1")
  .description("A simple CLI for managing AWPL automation project");

program
.command("start")
.description("Start the AWPL Miner")
.action(Main);

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
