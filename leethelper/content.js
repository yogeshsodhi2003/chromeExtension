function getProblem() {
  try {
    const title = document.querySelector(".title").textContent.trim();
    const description = document
      .querySelector(".description")
      .textContent.trim();
    const url = window.location.href;
    return {
      title: title,
      description: description,
      url: url,
    };
  } catch (e) {
    return { error: "Problem not found or page structure has changed." };
  }
}
chrome.runtime.onMessage.addListener((msg, _, send) => {
  if (msg.type === "SCRAPE") send(getProblem());
});
