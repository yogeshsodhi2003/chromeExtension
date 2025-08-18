async function callOpenAI(prompt, mode) {
  const { apiKey } = await chrome.storage.local.get("apiKey");
  console.log(apiKey); // secure storage[22]
  const SYSTEM = `You are a coding tutor who can provide a ${mode}.`;
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: prompt },
      ],
      max_tokens: mode === "SOLUTION" ? 800 : 300,
      temperature: 0.2,
    }),
  });
  const data = await res.json(); // promise-based Fetch[20]
  return data.choices?.message.content.trim();
}

chrome.runtime.onMessage.addListener(async (msg, sender, send) => {
  if (msg.type === "ASK_OPENAI") {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    const problem = await chrome.tabs.sendMessage(tab.id, { type: "SCRAPE" }); // content-script[23]
    console.log("problem:", problem);
    if (problem.error) {
      send({ answer: problem.error });
      return true; // keep port open for async reply[23]
    }
    const answer = await callOpenAI(problem.body, msg.mode);
    console.log("answer:", answer);
    if (!answer) {
      send({ answer: "No answer received from OpenAI." });
      return true; // keep port open for async reply[23]
    }
    send({ answer });
    return true; // keep port open for async reply[23]
  }
});
