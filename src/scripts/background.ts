import { jaroDistance } from "../utils/distance";

const importSites = import.meta.glob("../data/top.json", { "eager": true });

async function checkUrl(url: string) {
  const resolveImportSites = Object.values(importSites);
  const siteData = resolveImportSites as any;

  if (!siteData.length || typeof siteData[0] !== "object" ||
    !siteData[0].default || !Array.isArray(siteData[0].default)
  ) {
    console.log("failed to init siteData")
  }

  const topSites: string[] = siteData[0].default.flatMap((site: { name: string, sites: string[] }) => {
    if (!site.sites || !Array.isArray(site.sites)) {
      console.log("no sites in sites array")
      return []
    }
    return site.sites
  });

  let top = topSites.includes(url);

  let scam = false;
  let finalDistance = 0;
  let simmilarSite = "";

  if (!top) {
    for (let i = 0; i < topSites.length; i++) {
      const site = topSites[i];
      const distance = jaroDistance(url, site);
      if (distance < 1 && distance > 0.87) {
        console.log(`distance: ${distance}`)
        scam = true;
        finalDistance = distance;
        simmilarSite = site;
        break;
      }
    }
  }

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs.length > 0 && tabs[0].id) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "checkRes",
        data: JSON.stringify({ scam: scam, site: simmilarSite, distance: finalDistance })
      });
    }
  });
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "checkUrl") {
    let url: string = message.data;

    console.log(`checking url: ${url}`)
    checkUrl(url);
  }
})
