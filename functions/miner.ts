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

const Data: DataType = {
  level: [],
  target: [],
  cheque: [],
};

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

type AllowedType = "lvl" | "trg" | "chq";
async function handleData(type: AllowedType, data: any) {
  let join = chalk.dim('.');
  if (type === "lvl") {
    console.log(
      chalk.dim(">"),
      pad("Level", 8, chalk.blue.bold,join),
      pad(data.level, 16, chalk.green.bold,join),
      pad(data.sao.toString(), 10, chalk.yellow.bold,join),
      pad(data.sgo.toString(), 10, chalk.yellow.bold,join),
      pad(data.id, 8, chalk.magenta.bold,join),
      pad(data.pass, 6, chalk.cyan.bold,join),
      chalk.blue.bold(data.name)
    );
    Data.level.push(data);
  } else if (type === "trg") {
    console.log(
      chalk.dim(">"),
      pad("Target", 8, chalk.magenta.bold,join),
      pad(data.level, 16, chalk.green.bold,join),
      pad(data.sao.toString(), 10, chalk.yellow.bold,join),
      pad(data.sgo.toString(), 10, chalk.yellow.bold,join),
      pad(data.id, 8, chalk.magenta.bold,join),
      pad(data.pass, 6, chalk.cyan.bold,join),
      chalk.blue.bold(data.name)
    );
    Data.target.push(data);
  } else if (type === "chq") {
    console.log("Cheque", data);
    // Data.cheque.push(data);
  } else {
    console.log("Invalid type");
  }
  Bun.write(
    path.join(__dirname, "../json", "temp.json"),
    JSON.stringify(Data, null, 2)
  );
}

async function login(page: any, name: string, id: string, pass: string) {
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
  await page.evaluate(() => {
    const pad = (nbr: number) => (nbr < 10 ? "0" + nbr : nbr);
    let d = new Date();
    var omb =
      pad(d.getDate()) +
      "/" +
      pad(Number(d.getMonth() == 0 ? "12" : d.getMonth())) +
      "/" +
      (d.getMonth() == 0 ? d.getFullYear() - 1 : d.getFullYear());
    (document.querySelector(
      "#ctl00_ContentPlaceHolder1_txtFrom"
    ) as HTMLInputElement).value = omb;
  });
  await page.click("#ctl00_ContentPlaceHolder1_btnshow");
  await pending.waitForAllXhrFinished();
  let data = await page.evaluate(() => {
    let childCount = document.querySelector("tbody")?.childElementCount ?? 5;
    function getData() {
      let data = [];
      for (let i = 2; i < 1 + childCount; i++) {
        let pdt = document.querySelector(
          "#ctl00_ContentPlaceHolder1_gvIncome > tbody > tr:nth-child(" +
            i +
            ") > td:nth-child(24)"
        )?.textContent;
        let amt = Number(
          document.querySelector(
            "#ctl00_ContentPlaceHolder1_gvIncome > tbody > tr:nth-child(" +
              i +
              ") > td:nth-child(26)"
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
  Team: { [key: string]: string }[],
  func: [string]
): Promise<DataType> {
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
      { name, id }: data
    ) => {
      // Error Handling
      console.error("Error for ID: ", id, "Name: ", name, _err.message);
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
      if (await verify(id, pass)) await login(page, name, id, pass);
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
            sao: "-",
            sgo: "-",
          });

        return;
      }
      if (func.includes("LEVEL")) await level(page, name, id, pass);
      if (func.includes("TARGET")) await target(page, name, id, pass);
      if (func.includes("CHEQUE")) await cheque(page, name, id, pass);
    }
  );
  // Team.forEach(async (e) => {
  //   await cluster.queue(e);
  // });
  await cluster.queue({ id: "aa4f9b", pass: "8990", name: "SUD" });
  await cluster.idle();
  await cluster.close();

  return Data;
}

export { Mine };
