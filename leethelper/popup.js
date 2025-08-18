[...document.querySelectorAll("button")].forEach((btn) => {
  btn.onclick = async () => {
    try {
      api = await chrome.storage.local.get("apiKey");
      if (!api) {
        document.getElementById("out").textContent = "API key not set.";
        return;
      }
      const answer = await chrome.runtime.sendMessage({
        type: "ASK_OPENAI",
        mode: btn.dataset.mode,
      });
      document.getElementById("out").textContent = answer.answer || "No answer received.";
    } catch (e) {
      document.getElementById("out").textContent = "error in fetching answer: " ;
      return;
    }
  };
});
