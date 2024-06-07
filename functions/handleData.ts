import fs from 'fs';
import path from 'path';

type DataItem = {
  name: string;
  level: string;
  sao: number;
  sgo: number;
};

type Data = {
  level: DataItem[];
  target: DataItem[];
  cheque: DataItem[];
};

function getTeamList() {
    let list = fs.readdirSync(path.join(__dirname, '../data')).map((file) => file.replace('.csv', ''));
    return list;
}

function getTeam(team: string) {
    let data = fs.readFileSync(path.join(__dirname, '../data', `${team}.csv`), 'utf-8');
    return csvToJson(data);
}

function csvToJson(csv: string) {
    let lines = csv.replaceAll("\r","").split('\n');
    let headers = lines[0].split(',');
    let result = [];
    for (let i = 1; i < lines.length; i++) {
        let obj: { [key: string]: string } = {};
        let currentline = lines[i].split(',');
        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }
        result.push(obj);
    }
    return result;
}

function makeHTML(leaderName:String,levelData: string,targetData: string,chequeData: string) {
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Tabbed Tables</title><style>:root {--theme: light;}body { font-family: monospace;font-weight: 600;}body {
            background-color: var(--bg);color: var(--text);}
          .tabs {display: flex;cursor: pointer;padding: 0 0 10px 0;}
          .tab {flex: 1;text-align: center;padding: 14px;margin: 0 2px;border-radius: 10px;border: 3px solid;font-size: larger;opacity: 0.5;filter: grayscale(1);}
          .l {border-color: var(--tab1);color: var(--tab1);}
          .t {border-color: var(--tab2);color: var(--tab2);}
          .c {border-color: var(--tab3);color: var(--tab3);}
          .tab.active {opacity: 1;filter: grayscale(0);}
          .tab-content {display: none;height: 100vh;overflow-x: scroll;}
          .tab-content.active {display: block;}
          table {width: 100%;border-collapse: collapse;}
          table,th,td {border-right: 2px solid var(--border);}
          th {font-size: x-large;}
          th, td { padding: 8px; text-align: left; }
          td:nth-child(2) {color: var(--clm1);}
          td:nth-child(3) {color: var(--clm2);}
          td:nth-child(4) {color: var(--clm3);}
          td:nth-child(5) {color: var(--clm4);}
          tr:nth-last-of-type(even) {background-color: var(--evenRow);}
          .icon {width: 1.5em;height: 1.5em;vertical-align: -0.125em;}
          .r {color: var(--r) !important;}
          .g {color: var(--g) !important;}
        </style>
      </head>
      <body>
        <button
          style="
            position: absolute;
            left: 0;
            top: 0;
            padding: 10px;
            padding-right: 30px;
            border: none;
            background-color: transparent;
            outline: none;
          "
          onclick="toogleTheme(document.documentElement.style.getPropertyValue('--theme'))"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            class="icon"
            aria-hidden="true"
            focusable="false"
          >
            <path
              id="logo"
              fill="var(--text)"
              d="M272 384c9.6-31.9 29.5-59.1 49.2-86.2l0 0c5.2-7.1 10.4-14.2 15.4-21.4c19.8-28.5 31.4-63 31.4-100.3C368 78.8 289.2 0 192 0S16 78.8 16 176c0 37.3 11.6 71.9 31.4 100.3c5 7.2 10.2 14.3 15.4 21.4l0 0c19.8 27.1 39.7 54.4 49.2 86.2H272zM192 512c44.2 0 80-35.8 80-80V416H112v16c0 44.2 35.8 80 80 80zM112 176c0 8.8-7.2 16-16 16s-16-7.2-16-16c0-61.9 50.1-112 112-112c8.8 0 16 7.2 16 16s-7.2 16-16 16c-44.2 0-80 35.8-80 80z"
            />
          </svg>
        </button>
        <h1 style="text-align: center; margin-bottom: 10px;">${leaderName}</h1>
        <p
          style="
            position: absolute;
            top: 10px;
            right: 0px;
            font-size: smaller;
            font-weight: 100;
            color: rgb(185, 185, 185);
            margin: 0;
          "
        >
          ${new Date().toLocaleDateString()}
        </p>
        <div class="tabs">
          <div class="tab active l" data-tab="level">
            Level
          </div>
          <div class="tab t" data-tab="target">
            Target
          </div>
          <div class="tab c" data-tab="cheque">
            Cheque
          </div>
        </div>
    
        <div id="level" class="tab-content active">
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
              <!-- Table rows will be inserted here -->
            </tbody>
          </table>
        </div>
    
        <div id="target" class="tab-content">
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
              <!-- Table rows will be inserted here -->
            </tbody>
          </table>
        </div>
    
        <div id="cheque" class="tab-content">
          <table>
            <thead id="cheque-header">
              <!-- Table headers will be inserted here -->
            </thead>
            <tbody id="cheque-body">
              <!-- Table rows will be inserted here -->
            </tbody>
          </table>
        </div>
        <script>
          const levelData = ${levelData};
          const targetData = ${targetData};
          const chequeData = ${chequeData};
          function toogleTheme(currentTheme) {
            const root = document.documentElement;
            if (currentTheme === "light") {
              document
                .querySelector("#logo")
                .setAttribute(
                  "d",
                  "M272 384c9.6-31.9 29.5-59.1 49.2-86.2l0 0c5.2-7.1 10.4-14.2 15.4-21.4c19.8-28.5 31.4-63 31.4-100.3C368 78.8 289.2 0 192 0S16 78.8 16 176c0 37.3 11.6 71.9 31.4 100.3c5 7.2 10.2 14.3 15.4 21.4l0 0c19.8 27.1 39.7 54.4 49.2 86.2H272zM192 512c44.2 0 80-35.8 80-80V416H112v16c0 44.2 35.8 80 80 80zM112 176c0 8.8-7.2 16-16 16s-16-7.2-16-16c0-61.9 50.1-112 112-112c8.8 0 16 7.2 16 16s-7.2 16-16 16c-44.2 0-80 35.8-80 80z"
                );
              //set dark theme
              root.style.setProperty("--theme", "dark");
              root.style.setProperty("--bg", "#0d1117");
              root.style.setProperty("--text", "aliceblue");
              root.style.setProperty("--border", "#30363d");
              root.style.setProperty("--evenRow", "#18202b");
              root.style.setProperty("--tab1", "#79c0ff");
              root.style.setProperty("--tab2", "#ff993f");
              root.style.setProperty("--tab3", "#d2a8ff");
              root.style.setProperty("--clm1", "#79c0ff");
              root.style.setProperty("--clm2", "#ff993f");
              root.style.setProperty("--clm3", "#7EE778");
              root.style.setProperty("--clm4", "#d2a8ff");
              root.style.setProperty("--r", "#FF7B72");
              root.style.setProperty("--g", "#7EE778");
            } else {
              document
                .querySelector("#logo")
                .setAttribute(
                  "d",
                  "M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"
                );
              //set light theme
              root.style.setProperty("--theme", "light");
              root.style.setProperty("--bg", "aliceblue");
              root.style.setProperty("--text", "black");
              root.style.setProperty("--border", "#a3c1e4");
              root.style.setProperty("--evenRow", "rgb(235, 235, 235)");
              root.style.setProperty("--tab1", "#000");
              root.style.setProperty("--tab2", "#000");
              root.style.setProperty("--tab3", "#000");
              root.style.setProperty("--clm1", "#000");
              root.style.setProperty("--clm2", "#000");
              root.style.setProperty("--clm3", "#000");
              root.style.setProperty("--clm4", "#000");
              root.style.setProperty("--r", "red");
              root.style.setProperty("--g", "green");
            }}
          function loadTableData(data, tableBodyId, headers) {
            const tableBody = document.getElementById(tableBodyId);
            tableBody.innerHTML = ""; // Clear existing rows
            data.forEach((item, index) => {
              const row = document.createElement("tr");
              if (tableBodyId === "cheque-body") {
                const cls = [
                  item[headers[0]] ? "g" : "r",
                  item[headers[1]] ? "g" : "r",
                  item[headers[2]] ? "g" : "r",
                  item[headers[3]] ? "g" : "r",
                ];
                row.innerHTML =
                  "<td>" +
                  (index + 1) +
                  "</td><td>" +
                  item.name +
                  "</td><td>" +
                  item.level +
                  "</td><td class='" +
                  cls[0] +
                  "'>" +
                  item[headers[0]] +
                  "</td><td class='" +
                  cls[1] +
                  "'>" +
                  item[headers[1]] +
                  "</td><td class='" +
                  cls[2] +
                  "'>" +
                  item[headers[2]] +
                  "</td><td class='" +
                  cls[3] +
                  "'>" +
                  item[headers[3]] +
                  "</td>";
              } else {
                row.innerHTML =
                  "<td>" +
                  (index + 1) +
                  "</td><td>" +
                  item.name +
                  "</td><td>" +
                  item.level +
                  "</td><td>" +
                  item.sao +
                  "</td><td>" +
                  item.sgo +
                  "</td>";
              }
              tableBody.appendChild(row);
            });
          }
    
          function generateChequeTableHeader(data) {
            const headers = [
              "Sno",
              "Name",
              "Level",
              ...Object.keys(data[0]).filter(
                (key) => !["name", "level"].includes(key)
              ),
            ];
            const chequeHeader = document.getElementById("cheque-header");
            const headerRow = document.createElement("tr");
            headerRow.innerHTML = headers
              .map((header) => "<th>" + header + "</th>")
              .join("");
            chequeHeader.appendChild(headerRow);
            return headers;
          }
    
          document.querySelectorAll(".tab").forEach((tab) => {
            tab.addEventListener("click", () => {
              document
                .querySelectorAll(".tab")
                .forEach((t) => t.classList.remove("active"));
              document
                .querySelectorAll(".tab-content")
                .forEach((tc) => tc.classList.remove("active"));
    
              tab.classList.add("active");
              document.getElementById(tab.dataset.tab).classList.add("active");
            });
          });
    
          // Load data into tables on page load
          loadTableData(levelData, "level-body");
          loadTableData(targetData, "target-body");
    
          const chequeHeaders = generateChequeTableHeader(chequeData).slice(3);
          loadTableData(chequeData, "cheque-body", chequeHeaders);
    
          toogleTheme("light");
        </script>
      </body>
    </html>
    `;
}

async function save(html: string) {
  fs.writeFileSync(path.join(__dirname, '../out', 'output.html'), html);
}

async function handleOutput(leaderName: string, Data: Data) {
  const levelDataString = JSON.stringify(Data.level);
  const targetDataString = JSON.stringify(Data.target);
  const chequeDataString = JSON.stringify(Data.cheque);
  await save(makeHTML(leaderName, levelDataString, targetDataString, chequeDataString));
  return "Output HTML saved to out/output.html";
}

export { getTeamList, getTeam , handleOutput };