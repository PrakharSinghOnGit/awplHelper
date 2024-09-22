import type { member } from "./types";

export function csvToJson(csv: string) :member[] {
    let lines = csv.replaceAll("\r", "").split("\n");
    let headers = lines[0].split(",");
    let result: member[] = [];
    for (let i = 1; i < lines.length; i++) {
      if(lines[i].toString().startsWith('!')) continue;
      let obj: member = { id: "", pass: "", name: "" };
      let currentline = lines[i].split(",");
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j] as keyof member] = currentline[j].toUpperCase().trim();
      }
      result.push(obj);
    }
    return result;
}
