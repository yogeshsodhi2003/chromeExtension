async function callGemini(prompt, mode) {
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
          text: `You are an expert in LeetCode problems. give the ${mode} based on python language of the question based on the problem number and title: ${prompt} if given hint give hint of the solution with no code if given explantion give the short explantion of the question in short and easy to understand language with no code. if given solution give only the code in python` }]  },
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

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "ASK_AI") {
    (async () => {
      try {
        // Find active tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        // Inject content.js (only if not already injected)
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["content.js"],
        });

        // Ask content.js for the problem
        const problem = await new Promise((resolve, reject) => {
          chrome.tabs.sendMessage(tab.id, { type: "SCRAPE" }, (response) => {
            const err = chrome.runtime.lastError;
            if (err) {
              reject(new Error(err.message));
            } else {
              resolve(response);
            }
          });
        });

        const mode = msg.mode || "SOLUTION";

        if (!problem) {
          sendResponse({ error: "No problem data received." });
          return; // stop execution here
        }

        // Call Gemini
        const answer = await callGemini(problem, mode);

        if (!answer) {
          sendResponse({ error: "No answer received from Gemini." });
        } else {
          sendResponse({ answer });
        }
      } catch (err) {
        sendResponse({ error: `Failed: ${err.message}` });
      }
    })();

    return true; // keep port alive for async
  }
});

