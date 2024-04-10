async function checkUrl(url: string) {
  const backendHost = import.meta.env.VITE_BACKEND_HOST;
  const backendPort = import.meta.env.VITE_BACKEND_PORT;

  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  console.log("sending type: " + headers.get("Content-Type"))

  const fetchRes = await fetch(`http://${backendHost}:${backendPort}/check`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      site: url
    })
  });

  const textRes = await fetchRes.text();
  console.log("Response from API:", textRes);

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs.length > 0 && tabs[0].id) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "checkRes",
        data: textRes
      });
    }
  });
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "checkUrl") {
    const url = message.data;
    checkUrl(url);
  }
})
