import puppeteer from "puppeteer-extra";
import axios from "axios";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
const { Cluster } = require("puppeteer-cluster");
const { PendingXHR } = require("pending-xhr-puppeteer");
const chromium = require("chromium");
const env = Bun.env;
const Debug = env.Debug?.toLocaleLowerCase() == "true";
interface data {
  id: string;
  pass: string;
  name: string;
}
process.on("SIGINT", () => {
  console.log("Process Ended by User");
  process.exit();
});
puppeteer.use(stealthPlugin());
const removeNonAlphaNum = (str: string) => str.replace(/\W/g, "");
const getURL = (id: string, pass: string) =>
  `https://asclepiuswellness.com/userpanel/uservalidationnew.aspx?memberid=${removeNonAlphaNum(
    id
  )}&pwd=${removeNonAlphaNum(pass)}`;
const Levels = [
  "Fresher",
  "Bronze",
  "Silver",
  "Gold",
  "Platinum",
  "Emerald",
  "Topaz",
  "Ruby Star",
  "Sapphire",
  "Star Sapphire",
  "Diamond",
  "Blue Diamond",
  "Black Diamond",
  "Royal Diamond",
  "Crown Diamond",
  "Ambassador",
  "Royal Ambassador",
  "Crown Ambassador",
  "Brand Ambassador",
];
const TargetSAOs = [
  200,
  800,
  2000,
  4400,
  9200,
  21200,
  45200,
  93200,
  189200,
  381200,
  765200,
  1533200,
  3069200,
  6141200,
  12285200,
  24573200,
  49149200,
  98301200,
];
const TargetSGOs = [
  100,
  400,
  1000,
  2200,
  4600,
  10600,
  22600,
  46600,
  94600,
  190600,
  382600,
  766600,
  1534600,
  3070600,
  6142600,
  12286600,
  24574600,
  49150600,
];

async function verify(id: string, pass: string) {
  try {
    const response = await axios.get(getURL(id, pass));
    if (response.data.includes("alert")) return false;
  } catch (e) {
    throw new Error("Network Issue", { cause: e });
  }
  return true;
}

type AllowedType = "lvl" | "trg" | "chq";
async function handleData(type: AllowedType, data: any) {
  if (type === "lvl") {
    console.log("Level Data", data);
  } else if (type === "trg") {
    console.log("Target Data", data);
  } else if (type === "chq") {
    console.log("Cheque Data", data);
  } else {
    console.log("Invalid type");
  }
}

async function handleWrongCred(name: string, id: string, pass: string) {
  console.log("Wrong Cred", name, id, pass);
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
  //TODO ADD TARET URL
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
  let pendingSao = Math.round(
    (TargetSAOs.find((targetSao) => targetSao > sao) ?? 0) - sao
  );
  let pendingSgo = Math.round(
    (TargetSGOs.find((targetSgo) => targetSgo > sgo) ?? 0) - sgo
  );
  let level = Levels[TargetSAOs.findIndex((targetSao) => targetSao > sao)];
  handleData("lvl", {
    id: id,
    pass: pass,
    name: name,
    level: level,
    sao: pendingSao,
    sgo: pendingSgo,
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
  if (noDs == "No such DS ") {
    handleData("trg", {
      id: id,
      pass: pass,
      name: name,
      level: "No DS",
    });
    return;
  }
  let level =
    (await page.evaluate(() =>
      document
        .querySelector(
          "#ctl00_ContentPlaceHolder1_CustomersGridView > tbody > tr:nth-child(2) > td:nth-child(2)"
        )
        ?.textContent?.replace(" DS", "")
    )) ?? null;
  let pendingSao =
    (await page.evaluate(() =>
      Number(
        document.querySelector(
          "#ctl00_ContentPlaceHolder1_CustomersGridView > tbody > tr:nth-child(2) > td:nth-child(5)"
        )?.textContent
      )
    )) ?? null;
  let pendingSgo =
    (await page.evaluate(() =>
      Number(
        document.querySelector(
          "#ctl00_ContentPlaceHolder1_CustomersGridView > tbody > tr:nth-child(2) > td:nth-child(6)"
        )?.textContent
      )
    )) ?? null;
  handleData("trg", {
    id: id,
    pass: pass,
    name: name,
    level: level,
    sao: pendingSao,
    sgo: pendingSgo,
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

async function Mine(Team: { [key: string]: string }[], func: [string]) {
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
      { name, pass, id }: data
    ) => {
      // Error Handling
      console.error("Error for ID: ", id, _err);
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
      else handleWrongCred(name, id, pass);
      if (func.includes("LEVEL")) await level(page, name, id, pass);
      if (func.includes("TARGET")) await target(page, name, id, pass);
      if (func.includes("CHEQUE")) await cheque(page, name, id, pass);
    }
  );
  // Team.forEach(async (e) => {
  //     await cluster.queue(e);
  // });
  // await cluster.queue({name:"Renu",id:"51364FB",pass:"1896"});
  await cluster.queue({ name: "Sudheer", id: "aa4f9b", pass: "8990" });
  await cluster.idle();
  await cluster.close();
}

export { Mine };
