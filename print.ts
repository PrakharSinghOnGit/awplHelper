const { MultiSelect } = require("enquirer");
import { getTeamList, getTeam, handleOutput } from "./functions/handleData";
import { Mine } from "./functions/miner";
import path from "path";
import fs from "fs";

fs.readdirSync(path.join(__dirname, "json")).forEach(async (file) => {
  if (file == "temp.json") return;
  let name = file.replace(".json", "");
  let content = JSON.parse(
    await Bun.file(path.join(__dirname, "json", file)).text()
  );
  await handleOutput(name, content);
});
