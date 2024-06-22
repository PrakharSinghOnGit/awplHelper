const { MultiSelect } = require("enquirer");
import { getTeamList, getTeam, handleOutput } from "./functions/handleData";
import { Mine } from "./functions/miner";
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

team.forEach(async (e: string) => {
  const Data = await Mine(getTeam(e), func);
  Bun.write(
    path.join(__dirname, "json", e + ".json"),
    JSON.stringify(Data, null, 2)
  );
  await handleOutput(e, Data);
});
