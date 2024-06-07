const { MultiSelect } = require("enquirer");
import { getTeamList , getTeam  } from "./functions/handleData";
import { Mine } from "./functions/miner";

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

team.forEach(async (e:string) => {
  await Mine(getTeam(e), func);
})
