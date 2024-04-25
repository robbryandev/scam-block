import render from 'preact-render-to-string';
import { App } from '../app';

const url = window.location.hostname;
const current = {
  body: ""
}

void current;

function updateCurrent() {
  current.body = document.body.innerHTML;
}

chrome.runtime.sendMessage({ action: "checkUrl", data: url });

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "checkRes" && typeof message.data !== "undefined") {
    console.log("Received data from background script:", message.data);
    const data = JSON.parse(message.data);
    if (data.scam === true) {
      updateCurrent();
      const replacement = render(App());
      document.body.innerHTML = replacement;
    }
  }
});