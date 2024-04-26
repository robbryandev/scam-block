import { render } from 'preact';
import { App } from '../app';

const rootID = "scam-block-root";

const preactRoot = document.createElement("div");
preactRoot.id = rootID;

function main() {
  let data: string = window.location.hostname;

  // get domain without subdomains
  const matches = data.match(/[^.]*\.[^.]{2,3}(?:\.[^.]{2,3})?$/gi);
  if (!matches || !matches.length) {
    console.log(`invalid url: ${data}`);
    return
  }

  const url: string = matches[0];

  chrome.runtime.sendMessage({ action: "checkUrl", data: url });

  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "checkRes" && typeof message.data !== "undefined") {
      console.log("Received data from background script:", message.data);
      const data = JSON.parse(message.data);
      if (data.scam === true) {
        setTimeout(() => {
          const body = document.body.innerHTML;

          document.body.replaceChildren(preactRoot);
          const newRoot = document.getElementById(rootID);
          if (newRoot) {
            render(App({ url: url, body: body }), newRoot);
          }
        }, 500)
      }
    }
  });
}

main()
