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

  // temporarily block all non top sites
  const scam = !topSites.includes(url);

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs.length > 0 && tabs[0].id) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "checkRes",
        data: JSON.stringify({ scam: scam })
      });
    }
  });
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "checkUrl") {
    let data: string = message.data;
    const matches = data.match(/[^.]*\.[^.]{2,3}(?:\.[^.]{2,3})?$/gi);
    if (!matches || !matches.length) {
      console.log(`invalid url: ${message.data}`);
      return
    }

    const url: string = matches[0];

    console.log(`checking url: ${url}`)
    checkUrl(url);
  }
})
