async function callGemini(prompt) {
  const geminiKey = await chrome.storage.local.get("apiKey"); // store from options.html
  const key = geminiKey?.apiKey || geminiKey; // handle both old and new storage formats

  if (!key) throw new Error("Missing Gemini API key");
  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
  const res = await fetch(`${url}?key=${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        { role: "user", parts: [{ 
          text: `You are an expert in LeetCode problems. give the solution based on python language of the question based on the problem number and title: ${prompt}` }]  },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Gemini error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  // Extract text from candidates
  const ans = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  return ans.trim() || "No answer received from Gemini.";
}

chrome.runtime.onMessage.addListener(async (msg, sender, send) => {
  if (msg.type === "ASK_AI") {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"],
    });

    const problem = await new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(tab.id, { type: "SCRAPE" }, (response) => {
        const err = chrome.runtime.lastError;
        if (err) {
          reject(new Error(err.message)); // Handle "connection doesn't build" errors
        } else {
          resolve(response);
        }
      });
    });

    console.log("problem:", problem);
    if (problem.error) {
      send({ answer: problem.error });
      return true; // keep port open for async reply[23]
    }
    //const answer = await callOpenAI(problem.body, msg.mode);
    const answer = await callGemini(problem); // mode can be "SOLUTION" or "EXPLANATION"
    console.log("answer:", answer);
    if (!answer) {
      send({ answer: "No answer received from OpenAI." });
      return true; // keep port open for async reply[23]
    }
    send(answer);
    return true; // keep port open for async reply[23]
  }
});
