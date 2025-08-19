console.log("Content script loaded on:", window.location.href);

function getProblem() {
  try {
    //extracting problem title  from the page
    const a = document.querySelector('div.text-title-large a[href^="/problems/"]') 
    const title = a?.textContent.trim() || "";
    console.log(title);
    return title
  } catch (e) {
    console.error("Error scraping problem:", e);
    return { error: "Failed to scrape problem." };
  }
}
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "SCRAPE") {
    try {
      const data = getProblem(); //getProblem();
      console.log("Scraped data:", data);
      sendResponse(data ? data : { error: "Empty scrape." });
    } catch (e) {
      sendResponse({ error: "SCRAPE failed." });
    }
  }
});
