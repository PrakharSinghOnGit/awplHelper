const { MultiSelect } = require("enquirer");
import { getTeamList, getTeam, handleOutput } from "./functions/handleData";
import { Mine } from "./functions/miner";
import { mergeLvlData } from "./functions/helper";
import path from "path";

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
  const e = team[i];
  console.log("Mining for Team: ", e);
  const Data = await Mine(getTeam(e), func);
  if (func.includes("CHEQUE")) {
    Data.cheque = mergeLvlData(Data.cheque, Data.level);
  }
  Bun.write(
    path.join(__dirname, "json", e + ".json"),
    JSON.stringify(Data, null, 2)
  );
  await handleOutput(e, Data);
}
