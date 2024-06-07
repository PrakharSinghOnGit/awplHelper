import { getTeamList , getTeam , handleOutput } from "./functions/handleData";
import fs from "fs";
import path from "path";

fs.readdirSync(path.join(__dirname + "/json" )).forEach(async (file) => {
    let content = JSON.parse(fs.readFileSync(path.join(__dirname + "/json/" + file), "utf-8"));
    console.log(content);
});