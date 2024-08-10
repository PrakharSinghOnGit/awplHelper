import puppeteer from "puppeteer-extra";
import axios from "axios";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
const { Cluster } = require("puppeteer-cluster");
const { PendingXHR } = require("pending-xhr-puppeteer");
const chromium = require("chromium");
const env = Bun.env;
import chalk from 'chalk';
const Debug = env.Debug?.toLocaleLowerCase() == "true";
import path from "path";
import type { DataType , data } from "./types";
import { Levels, TargetSAOs, TargetSGOs, getURL , pad } from "./helper";

const Rem = [0,0,0]
const Data: DataType = {
  level: [],
  target: [],
  cheque: [],
};
let LEADER_NAME:string;

process.on("SIGINT", () => {
  console.log("Process Ended by User");
  process.exit();
});
puppeteer.use(stealthPlugin());

async function verify(id: string, pass: string) {
  try {
    const response = await axios.get(getURL(id, pass));
    if (response.data.includes("Plz Try After some Time :")) {
      console.log("Plz Try After some Time :");
      process.exit();
    }
    if (response.data.includes("alert")) return false;
  } catch (e) {
    throw new Error("Network Issue", { cause: e });
  }
  return true;
}

type AllowedType = "lvl" | "trg" | "chq" | "ret";
async function handleData(type: AllowedType, data: any, ret?: number ) {
  let join = chalk.dim('.');
  let stL = (Rem[0]<10) ? '0'+Rem[0] : Rem[0];
  let stT = (Rem[1]<10) ? '0'+Rem[1] : Rem[1];
  let stC = (Rem[2]<10) ? '0'+Rem[2] : Rem[2];
  if (type === "lvl") {
    Rem[0]--;
    console.log(
      chalk.blue(stL)+'|'+chalk.dim(stT)+'|'+chalk.dim(stC),
      chalk.dim(">"),
      pad("Level", 8, chalk.blue,join) +
      pad(data.level, 16, chalk.green,join) +
      pad(data.sao.toString(), 10, chalk.yellow,join) +
      pad(data.sgo.toString(), 10, chalk.yellow,join) +
      pad(data.id, 8, chalk.magenta,join) +
      pad(data.pass, 6, chalk.cyan,join) +
      chalk.blue(data.name)
    );
    Data.level.push(data);
  } else if (type === "trg") {
    Rem[1]--;
    console.log(
      chalk.dim(stL)+'|'+chalk.magenta(stT)+'|'+chalk.dim(stC),
      chalk.dim(">"),
      pad("Target", 8, chalk.magenta,join) +
      pad(data.level, 16, chalk.green,join) +
      pad(data.sao.toString(), 10, chalk.yellow,join) +
      pad(data.sgo.toString(), 10, chalk.yellow,join) +
      pad(data.id, 8, chalk.magenta,join) +
      pad(data.pass, 6, chalk.cyan,join) +
      chalk.blue(data.name)
    );
    Data.target.push(data);
  } else if (type === "chq") {
    Rem[2]--;
    console.log(
      chalk.dim(stL)+'|'+chalk.dim(stT)+'|'+chalk.cyan(stC),
      chalk.dim(">"),
      pad("Cheque", 8, chalk.cyan,join) +
      pad("Nbr of Weeks : " + data.data.length, 36, chalk.yellow,join) +
      pad(data.id, 8, chalk.magenta,join) +
      pad(data.pass, 6, chalk.cyan,join) +
      chalk.blue(data.name)
    );
    Data.cheque.push(data);
  } else if (type === "ret") {
    console.log(
      chalk.dim(stL)+'|'+chalk.dim(stT)+'|'+chalk.red(stC),
      chalk.dim(">"),
      pad("Retry Left: " + ret, 44, chalk.red,join) +
      pad(data.id, 8, chalk.magenta,join) +
      pad(data.pass, 6, chalk.cyan,join) +
      chalk.blue(data.name)
    );
  } else {
    console.log("Invalid type");
  }
  Bun.write(
    path.join(__dirname, "../json", LEADER_NAME + ".json"),
    JSON.stringify(Data, null, 2)
  );
}

async function login(page: any, id: string, pass: string) {
  page.on("dialog", async (dialog: any) => {
    let alertText = dialog.message();
    await dialog.dismiss();
    throw new Error("Alert Struct", { cause: alertText });
  });
  await page.goto(getURL(id, pass), { waitUntil: "networkidle2" });
  return;
}

async function level(page: any, name: string, id: string, pass: string) {
  await page.evaluate(
    (LevelURL: string) => window.open(LevelURL, "_self"),
    env.LevelURL
  );
  await page.waitForNavigation({ waitUntil: "networkidle2" });
  let sao = await page.evaluate(() =>
    Number(
      document.querySelector(
        "#ctl00_ContentPlaceHolder1_GVPanding > tbody > tr:nth-child(2) > td:nth-child(5)"
      )?.textContent
    )
  );
  let sgo = await page.evaluate(() =>
    Number(
      document.querySelector(
        "#ctl00_ContentPlaceHolder1_GVPanding > tbody > tr:nth-child(2) > td:nth-child(6)"
      )?.textContent
    )
  );

  const minIndex = Math.min(TargetSAOs.findIndex(targetSAO => sao < targetSAO), TargetSGOs.findIndex(targetSGO => sgo < targetSGO));
  const pendingSAO = Math.round((minIndex === -1 ? 0 : TargetSAOs[minIndex] - sao) < 0 ? 0 : TargetSAOs[minIndex] - sao);
  const pendingSGO = Math.round((minIndex === -1 ? 0 : TargetSGOs[minIndex] - sgo) < 0 ? 0 : TargetSGOs[minIndex] - sgo);
  const level = Levels[minIndex];
  handleData("lvl", {
    id: id,
    pass: pass,
    name: name,
    level: level,
    sao: pendingSAO,
    sgo: pendingSGO,
  });
}

async function target(page: any, name: string, id: string, pass: string) {
  const pending = new PendingXHR(page);
  await page.evaluate(
    (TargetURL: string) => window.open(TargetURL, "_self"),
    env.TargetURL
  );
  await page.waitForNavigation({ waitUntil: "networkidle2" });
  await pending.waitForAllXhrFinished();
  let noDs = await page.evaluate(
    () =>
      document.querySelector("#ctl00_ContentPlaceHolder1_lblMsg")?.textContent
  );
  if (noDs != undefined) {
    handleData("trg", {
      id: id,
      pass: pass,
      name: name,
      level: "No DS",
      sao: "-",
      sgo: "-",
    });
    // await page.screenshot({ path: "../ScreenShot/" + id + ".png", fullPage: 'false' });
    return;
  }
  let level =
    (await page.evaluate(() =>
      document
        .querySelector(
          "#ctl00_ContentPlaceHolder1_CustomersGridView > tbody > tr:nth-child(2) > td:nth-child(3)"
        )
        ?.textContent?.replace(" DS", "")
    )) ?? null;
  let pendingSao =
    (await page.evaluate(() =>
      Number(
        document.querySelector(
          "#ctl00_ContentPlaceHolder1_CustomersGridView > tbody > tr:nth-child(2) > td:nth-child(6)"
        )?.textContent
      )
    )) ?? null;
  let pendingSgo =
    (await page.evaluate(() =>
      Number(
        document.querySelector(
          "#ctl00_ContentPlaceHolder1_CustomersGridView > tbody > tr:nth-child(2) > td:nth-child(7)"
        )?.textContent
      )
    )) ?? null;
  handleData("trg", {
    id: id,
    pass: pass,
    name: name,
    level: level,
    sao: Math.round(pendingSao),
    sgo: Math.round(pendingSgo),
  });
}

async function cheque(page: any, name: string, id: string, pass: string) {
  const pending = new PendingXHR(page);
    await page.evaluate(() =>
      window.open(
        "https://www.asclepiuswellness.com/userpanel/UserLevelNew.aspx",
        "_self"
     )
    );
      await page.waitForNavigation({ waitUntil: "networkidle2" });
      await pending.waitForAllXhrFinished();
  const pad = (nbr: number) => (nbr < 10 ? "0" + nbr : nbr);
  let d = new Date();
  var omb = pad(d.getDate()) + "/" + pad(Number(d.getMonth() == 0 ? "12" : d.getMonth())) + "/" + (d.getMonth() == 0 ? d.getFullYear() - 1 : d.getFullYear());
  await page.evaluate((omb:string) => {
    (document.querySelector(
      "#ctl00_ContentPlaceHolder1_txtFrom"
    ) as HTMLInputElement).value = omb;
  },omb);
  await page.click("#ctl00_ContentPlaceHolder1_btnshow");
  await page.waitForNavigation({ waitUntil: "networkidle2" });
  await pending.waitForAllXhrFinished();
  let data = await page.evaluate(() => {
    let childCount = document.querySelector("tbody")?.childElementCount ?? 5;
    function getData() {
      let data = [];
      for (let i = 2; i < 1 + childCount; i++) {
        let pdt = document.querySelector(
          "#ctl00_ContentPlaceHolder1_gvIncome > tbody > tr:nth-child(" +
            i +
            ") > td:nth-child(25)"
        )?.textContent;
        let amt = Number(
          document.querySelector(
            "#ctl00_ContentPlaceHolder1_gvIncome > tbody > tr:nth-child(" +
              i +
              ") > td:nth-child(27)"
          )?.textContent
        );
        data.push({ payDate: pdt?.substring(0, pdt.length - 5), amount: amt });
      }
      return data;
    }
    return getData();
  });
  handleData("chq", {
    id: id,
    pass: pass,
    name: name,
    data: data,
  });
}

async function Mine(
  Team: data[],
  func: [string],
  leaderName: string
): Promise<DataType> {
  Rem[0] = Team.length;
  Rem[1] = Team.length;
  Rem[2] = Team.length;
  Data.level = [];
  Data.target = [];
  Data.cheque = [];
  LEADER_NAME = leaderName;
  const cluster = await Cluster.launch({
    // browser Launch Properties
    concurrency: Cluster.CONCURRENCY_CONTEXT, // Incognito Pages gor each Worker
    maxConcurrency: Debug ? 1 : parseInt(env.MaxConcurrency ?? "1"),
    puppeteer: puppeteer,
    sameDomainDelay: parseInt(env.someDomainDelay ?? "1000"),
    timeout: parseInt(env.Timeout ?? "60000"),
    puppeteerOptions: {
      executablePath: chromium.path,
      timeout: parseInt(env.Timeout ?? "60000"),
      headless: Debug ? false : "new",
      defaultViewport: null,
      args: [`--start-maximized`, `--auto-open-devtools-for-tabs`],
    },
  });

  cluster.on(
    "taskerror",
    async (
      _err: { message: string; cause: string },
      { name, id,pass }: data
    ) => {
      // Error Handling
      console.error("Error for ID:", id,"Pass", pass,"Name: ", name, _err.message);
    }
  );

  cluster.task(
    async ({ page, data: { id, pass, name } }: { page: any; data: data }) => {
      await page.setRequestInterception(true); // Not Loading FONT and IMAGE
      let block = ["font", "image"];
      page.on("request", (req: any) => {
        if (block.includes(req.resourceType())) req.abort();
        else req.continue();
      });
      if (await verify(id, pass)) await login(page, id, pass);
      else {
        if (func.includes("LEVEL"))
          handleData("lvl", {
            id: id,
            pass: pass,
            name: name,
            level: "wrong",
            sao: "-",
            sgo: "-",
          });
        if (func.includes("TARGET"))
          handleData("trg", {
            id: id,
            pass: pass,
            name: name,
            level: "wrong",
            sao: "-",
            sgo: "-",
          });
        if (func.includes("CHEQUE"))
          handleData("chq", {
            id: id,
            pass: pass,
            name: name,
            level: "wrong",
            data : [ {
              payDate: "-",
              amount: 0
              }
            ]
          });

        return;
      }
      if (func.includes("LEVEL")) {
        let retryCount = Number(env.Retry);
        while (retryCount > 0) {
          try {
        await level(page, name, id, pass);
        break;
          } catch (e) {
        if ((e as Error).message.includes("Navigation timeout")) {
          handleData("ret", { id: id, pass: pass, name: name }, retryCount);
          retryCount--;
        } else throw e;
          }
        }
        if (retryCount === 0) 
          handleData("lvl", { id: id, pass: pass, name: name, level: "retry" });
      }
      if (func.includes("TARGET")) {
        let retryCount = Number(env.Retry);
        while (retryCount > 0) {
          try {
        await target(page, name, id, pass);
        break;
          } catch (e) {
        if ((e as Error).message.includes("Navigation timeout")) {
          handleData("ret", { id: id, pass: pass, name: name }, retryCount);
          retryCount--;
        } else throw e;
          }
        }
        if (retryCount === 0) 
          handleData("trg", { id: id, pass: pass, name: name, level: "retry" });
      }
      try {
        if (func.includes("CHEQUE")) {
          let retryCount = Number(env.Retry);
          while (retryCount > 0) {
            try {
              await cheque(page, name, id, pass);
              break;
            } catch (e) {
              if ((e as Error).message.includes("Navigation timeout")) {
                handleData("ret", { id: id, pass: pass, name: name }, retryCount);
                retryCount--;
              } else throw e;
            }
          }
          if (retryCount === 0) 
            handleData("chq", { id: id,pass: pass,name: name,data : [ {payDate: "-",amount: 0}]});
        }
      } catch (e) { throw e}; 
    }
  );
  Team.forEach(async (e) => {
    await cluster.queue(e);
  });
  await cluster.idle();
  await cluster.close();

  return Data;
}

export { Mine };
