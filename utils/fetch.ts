import puppeteer from 'puppeteer';
import { writeFileSync } from "fs";
import { $ } from "bun";

const path = import.meta.dirname;

const country = "united-states";
const base = `https://www.semrush.com/website/top/${country}`;

async function main() {
  console.log("STEP: starting browser")
  const browser = await puppeteer.launch({ "headless": false });
  const page = await browser.newPage();

  console.log("STEP: going to data page")
  await page.goto(`${base}/all`);
  await page.setViewport({ width: 1080, height: 1024 });


  console.log("STEP: loading source options")
  const optMenuSelector = "div[data-ui-name='ButtonTrigger.Text']";

  const tableSelector = "div[itemscope]";
  await page.waitForSelector(tableSelector);

  await page.$$eval(optMenuSelector, (menus) => {
    menus.forEach((menu) => {
      if (menu.innerText === "All categories") {
        menu.click()
      }
    })
  })

  console.log("STEP: fetching sources")
  const optionSelector = 'div[role=option]';
  const sourceData = await page.$$eval(optionSelector, (options) => {
    return options.flatMap((opt) => {
      const value = opt.getAttribute("value");
      if (!value || value === "all") {
        return []
      }
      console.log("value: " + value)
      return [{
        value: value,
        alias: opt.innerText.split(" ")[0].toLowerCase()
      }]
    })
  });

  const sources = {
    base: base,
    sources: sourceData
  }

  console.log(`STEP: fetching top sites`)
  const data: { name: string, sites: string[] }[] = [];

  const getSite = (async (value: string) => {
    const topUrl = `${base}/${value}/`;
    console.log(`STEP: fetching top sites (${topUrl})`)
    await page.goto(topUrl);
    await page.waitForSelector(tableSelector);

    const topSites = await page.$$eval("a", (linkElements) => {
      // get links
      const hrefs = linkElements.map((link) => { return link.href });

      // only contain top site links
      const validSites = hrefs.filter((link) => { return link.startsWith("https://www.semrush.com/website/") && link.endsWith("overview/") });

      // get actual site
      const links = validSites.map((link) => {
        return link.replace("https://www.semrush.com/website/", "")
          .replace("/overview/", "");
      });

      return links;
    });

    return topSites
  })

  for (let i = 0; i < sources.sources.length; i++) {
    const source = sources.sources[i];

    const siteRes = await getSite(source.value);
    data.push({ name: source.alias, sites: siteRes });
  }

  await browser.close();

  console.log("STEP: writing data file")
  writeFileSync(`${path}/top.json`, JSON.stringify(data));
  await $`mv ${path}/top.json src/data/`
}

main()