import fs from "fs";
import path from "path";
import { Levels } from "./helper";

type DataItem = {
  name: string;
  level: string;
  sao: number;
  sgo: number;
};

type Data = {
  level: DataItem[];
  target: DataItem[];
  // cheque: DataItem[];
};

function getTeamList() {
  let list = fs
    .readdirSync(path.join(__dirname, "../data"))
    .map((file) => file.replace(".csv", ""));
  return list;
}

function getTeam(team: string) {
  let data = fs.readFileSync(
    path.join(__dirname, "../data", `${team}.csv`),
    "utf-8"
  );
  return csvToJson(data);
}

function csvToJson(csv: string) {
  let lines = csv.replaceAll("\r", "").split("\n");
  let headers = lines[0].split(",");
  let result = [];
  for (let i = 1; i < lines.length; i++) {
    let obj: { [key: string]: string } = {};
    let currentline = lines[i].split(",");
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }
    result.push(obj);
  }
  return result;
}

function makeHTML(
  leaderName: String,
  levelData: DataItem[],
  targetData: DataItem[]
) {
  let LevelHtmlTable = "";
  let TargetHtmlTable = "";
  levelData.forEach((item, index) => {
    LevelHtmlTable += `<tr>
    <td>${index + 1}</td>
    <td>${item.name}</td>
    <td>${item.level}</td>
    <td>${item.sao}</td>
    <td>${item.sgo}</td>
    </tr>`;
  });

  targetData.forEach((item, index) => {
    TargetHtmlTable += `<tr>
    <td>${index + 1}</td>
    <td>${item.name}</td>
    <td>${item.level}</td>
    <td>${item.sao}</td>
    <td>${item.sgo}</td>
    </tr>`;
  });

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Awpl Data</title>
    <style>
      :root {
        --bg: #0d1117;
        --text: aliceblue;
        --nofocus: #30363d;
        --border: #30363d;
        --focus: rgb(0, 36, 126);
        --evenRow: #18202b;
        --tab1: #79c0ff;
        --tab2: #ff993f;
        --tab3: #d2a8ff;
        --clm1: #79c0ff;
        --clm2: #ff993f;
        --clm3: #7ee778;
        --clm4: #d2a8ff;
        --r: #ff7b72;
        --g: #7ee778;
      }
      * {
        margin: 0;
        padding: 0;
      }
      body {
        font-family: monospace;
        font-weight: 600;
        background-color: var(--bg);
        color: var(--text);
      }
      h1,
      h3 {
        text-transform: uppercase;
        font-weight: normal;
      }
      .tabs {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        margin: 10px;
        list-style: none;
      }

      .tabs .tab {
        flex: 1;
        text-align: center;
        margin: 0 2px;
        cursor: pointer;
      }

      .tabs .tab > input[type="radio"] {
        position: absolute;
        top: -9999px;
        left: -9999px;
      }

      .tabs .tab > label {
        display: block;
        padding: 14px;
        font-size: larger;
        text-transform: uppercase;
        cursor: pointer;
        position: relative;
        color: #fff;
        background: var(--nofocus);
      }

      .tabs .content {
        z-index: 0;
        overflow: scroll;
        width: 100%;
        position: absolute;
        background: var(--bg);
        left: 0;
        opacity: 0;
        height: calc(100vh - 101px);
      }

      .content table {
        margin-top: 10px;
        width: 100%;
        border-collapse: collapse;
      }
      th {
        font-size: x-large;
        border-bottom: 2px solid var(--border);
      }
      td {
        font-size: medium;
      }
      th,
      td {
        border-right: 2px solid var(--border);
        padding: 8px;
        text-align: left;
        text-wrap: nowrap;
      }
      th:last-child,
      td:last-child {
        border-right: none;
      }
      td:nth-child(2) {
        color: var(--clm1);
      }
      td:nth-child(3) {
        color: var(--clm2);
      }
      td:nth-child(4) {
        color: var(--clm3);
      }
      td:nth-child(5) {
        color: var(--clm4);
      }
      tr:nth-last-of-type(even) {
        background-color: var(--evenRow);
      }

      .tabs > .tab > [id^="tab"]:checked + label {
        top: 0;
        background: var(--clm3);
        color: var(--bg);
        font-size: x-large;
      }
      .tabs > .tab > [id^="tab"]:checked ~ [id^="tab-content"] {
        z-index: 1;
        opacity: 1;
      }
    </style>
  </head>
  <body>
    <h1 style="text-align: center; margin-bottom: 10px;">${leaderName}</h1>
    <p
      style="
        position: absolute;
        top: 10px;
        right: 0px;
        font-size: 1;
        font-weight: 100;
        color: rgb(185, 185, 185);
        margin: 0;
      "
    >
      ${new Date().toDateString()}
    </p>
    <ul class="tabs">
      <li class="tab">
        <input type="radio" name="tabs" checked="checked" id="tab1" />
        <label for="tab1">LEVEL</label>
        <div id="tab-content1" class="content">
          <table>
            <thead>
              <tr>
                <th>Sno</th>
                <th>Name</th>
                <th>Level</th>
                <th>Sao</th>
                <th>Sgo</th>
              </tr>
            </thead>
            <tbody id="level-body">
              ${LevelHtmlTable}
            </tbody>
          </table>
        </div>
      </li>

      <li class="tab">
        <input type="radio" name="tabs" id="tab2" />
        <label for="tab2">TARGET</label>
        <div id="tab-content2" class="content">
          <table>
            <thead>
              <tr>
                <th>Sno</th>
                <th>Name</th>
                <th>Level</th>
                <th>Sao</th>
                <th>Sgo</th>
              </tr>
            </thead>
            <tbody id="target-body">
              ${TargetHtmlTable}
            </tbody>
          </table>
        </div>
      </li>
    </ul>
  </body>
</html>
`;
}

function sortData(data: DataItem[]) {
  const sortedData = [];
  const uniqueLevels = [...new Set(Levels)]; // Remove duplicates from Levels array
  uniqueLevels.unshift("No DS");
  for (let i = 0; i < uniqueLevels.length; i++) {
    for (let j = 0; j < data.length; j++) {
      if (data[j].level === uniqueLevels[i]) {
        sortedData.push(data[j]);
      }
    }
  }
  sortedData.reverse();
  return sortedData;
}

async function save(leaderName: String, html: string) {
  Bun.write(path.join(__dirname, "../out", leaderName + ".html"), html);
}

async function handleOutput(leaderName: string, Data: Data) {
  Data.level = sortData(Data.level);
  Data.target = sortData(Data.target);
  await save(leaderName, makeHTML(leaderName, Data.level, Data.target));
  console.log(
    "Output HTML saved to",
    Bun.pathToFileURL(path.join(__dirname, "../out", leaderName + ".html")).href
  );
}

export { getTeamList, getTeam, handleOutput };
