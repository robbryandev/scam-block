console.log("adding message listener")
chrome.runtime.onMessage.addListener(function (message
  // , sender, sendResponse
) {
  if (message.action === "updateContent") {
    // Modify page content based on the message data
    console.log("Received data from background script:", message.data);
    // Your logic to update the page content here
  }
});