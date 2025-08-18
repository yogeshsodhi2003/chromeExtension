function getProblem() {
  try {
    //extracting problem title and description from the page
    const a = document.querySelector(
      "a.no-underline.hover\\:text-blue-s.dark\\:hover\\:text-dark-blue-s.truncate.cursor-text.whitespace-normal.hover\\:!text-\\[inherit\\]"
    );
    const title = a?.textContent.trim() || "";
    console.log(title);

    const el = document.querySelector('[data-key="description-content"]');
    const description = el ? el.textContent.trim() : "";
    const url = window.location.href;
    console.log("title", title, "description", description, "url", url);
    return {
      title: title,
      description: description,
      url: url,
    };
  } catch (e) {
    return {
      error:
        "Problem not found or page structure has changed. Please check the page.",
    };
  }
}
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === "SCRAPE") {
    try {
      const data = getProblem();
      sendResponse(data?.body ? data : { error: "Empty scrape." });
    } catch (e) {
      sendResponse({ error: "SCRAPE failed." });
    }
    return true; // keep port open for async reply[23]
  }
});
