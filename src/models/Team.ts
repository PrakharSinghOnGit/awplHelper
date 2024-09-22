import { csvToJson } from "../utils/fileUtils";
import fs from "fs";
import path from "path";
import type { member } from "../utils/types";

export class Team {
    name: string;
    team: member[];

    constructor(name: string) {
        this.name = name;
        let data = fs.readFileSync(
        path.join(__dirname, "/data", `${this.name}.csv`),"utf-8");
        this.team = csvToJson(data);
    }
}