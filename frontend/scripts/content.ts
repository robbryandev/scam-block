import render from 'preact-render-to-string';
import { App } from '../app';

const url = window.location.hostname;
chrome.runtime.sendMessage({ action: "checkUrl", data: url });

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "checkRes") {
    const replacement = render(App());
    void replacement
    console.log("Received data from background script:", message.data);
  }
});