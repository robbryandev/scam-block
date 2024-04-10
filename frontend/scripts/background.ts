// import render from 'preact-render-to-string';
// import { App } from '../app';

// const url = window.location.href;
// const backendUrl = import.meta.env.VITE_BACKEND_URL;
// const replacement = render(App());

const backendHost = "127.0.0.1";
const backendPort = 5000;

async function main() {
  console.log("Loaded scam-block");

  try {
    const fetchRes = await fetch(`http://${backendHost}:${backendPort}`, {
      method: "GET",
      mode: "no-cors"
    });

    const textRes = await fetchRes.text();
    console.log("Response from API:", textRes);

    // Send message to content script with API response
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs.length > 0 && tabs[0].id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "updateContent",
          data: textRes
        });
      }
    });
  } catch (error) {
    console.error("Error fetching data from API:", error);
  }
}

chrome.runtime.onStartup.addListener(function () {
  main();
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  void tabId
  void tab
  // Execute main whenever a tab is updated
  if (changeInfo.status === "complete") {
    main();
  }
});