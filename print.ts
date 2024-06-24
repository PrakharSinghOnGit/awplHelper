const { MultiSelect } = require("enquirer");
import { handleOutput } from "./functions/handleData";
import path from "path";
import fs from "fs";

let lists = fs
  .readdirSync(path.join(__dirname, "json"))
  .map((file) => file.replace(".json", ""));

const list = await new MultiSelect({
  name: "list",
  message: "SELECT LIST",
  choices: lists,
}).run();

list.forEach(async (e: string) => {
  let content = JSON.parse(
    fs.readFileSync(path.join(__dirname, "json", e + ".json"), "utf-8")
  );
  await handleOutput(e, content);
});
