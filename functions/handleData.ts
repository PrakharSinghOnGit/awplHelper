import path from "path";
import { Levels } from "./helper";
import type { DataItem, DataType } from "./types";
import chalk from "chalk";

function makeHTML(
  leaderName: String,
  levelData: DataItem[],
  targetData: DataItem[],
  chequeData: DataItem[]
) {
  let LevelHtmlTable = "";
  let TargetHtmlTable = "";
  let ChequeHtmlTable = "";
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

  const dates = new Set();
  let chequeHeader = "";
  chequeData.forEach((item) => {
    Object.keys(item.data).forEach((date) => dates.add(date));
  });
  dates.forEach((date) => (chequeHeader += `<th>${date}</th>`));

  chequeData.forEach((item, index) => {
    let chequeBodyData = "";
    dates.forEach(
      (date) =>
        (chequeBodyData += `<td style="color:var(--${
          item.data[date as string] ? "g" : "r"
        })">${item.data[date as string] || 0}</td>`)
    );
    ChequeHtmlTable += `<tr>
      <td>${index + 1}</td>
      <td>${item.name}</td>
      <td>${item.level}</td>
      ${chequeBodyData}
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
        overflow-x: scroll;
        overflow-y: hidden;
        width: 100%;
        position: absolute;
        background: var(--bg);
        left: 0;
        opacity: 0;
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
        background: var(--focus);
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
    <h1 style="text-align: center; margin: 10px;">${leaderName}</h1>
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
      ${new Date().toLocaleDateString("IN")}
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

      <li class="tab">
        <input type="radio" name="tabs" id="tab3" />
        <label for="tab3">Cheque</label>
        <div id="tab-content3" class="content">
          <table>
            <thead>
              <tr>
                <th>Sno</th>
                <th>Name</th>
                <th>Level</th>
                ${chequeHeader}
              </tr>
            </thead>
            <tbody id="cheque-body">
              ${ChequeHtmlTable}
            </tbody>
          </table>
        </div>
      </li>

    </ul>
  </body>
</html>
`;
}

async function formatChequeData(chequeData: DataItem[]) {
  return chequeData.map((item) => {
    let formattedData: any = {};
    item.data.forEach((entry: any) => {
      if (entry.payDate !== "-") {
        formattedData[entry.payDate] = entry.amount;
      }
    });
    return {
      id: item.id,
      pass: item.pass,
      name: item.name,
      level: item.level,
      data: formattedData,
    };
  });
}

function sortData(data: DataItem[]) {
  const sortedData = [];
  Levels.unshift("No DS");
  Levels.unshift("wrong");
  for (let i = 0; i < Levels.length; i++) {
    for (let j = 0; j < data.length; j++) {
      if (data[j].level.toUpperCase() === Levels[i].toUpperCase()) {
        sortedData.push(data[j]);
      }
    }
  }
  // remove duplicates from sortedData
  const unique = new Set();
  const filtered = sortedData.filter((item) => {
    if (unique.has(item.name)) {
      return false;
    }
    unique.add(item.name);
    return true;
  });
  return filtered.reverse();
}

async function save(leaderName: String, html: string) {
  Bun.write(path.join(__dirname, "../out", leaderName + ".html"), html);
}

async function handleOutput(leaderName: string, Data: DataType) {
  Data.level = sortData(Data.level);
  Data.target = sortData(Data.target);
  Data.cheque = sortData(Data.cheque);
  const FormattedChequeData = await formatChequeData(Data.cheque);
  await save(
    leaderName,
    makeHTML(leaderName, Data.level, Data.target, FormattedChequeData)
  );
  console.log(
    chalk.yellowBright.bold("Output HTML SAVED AT: "),
    chalk.green.bold.underline(
      path.join(__dirname, `../out/${leaderName}.html`)
    )
  );
}

export { handleOutput };
