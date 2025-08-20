console.log("LeetHelper popup loaded");
const out = document.getElementById('out');

[...document.querySelectorAll('button')].forEach((btn) => {
  btn.onclick = () => {
    const mode = btn.dataset.mode;
    // Disable buttons during request
    setButtonsDisabled(true);
    showOut('Working...', false);

    chrome.runtime.sendMessage({ type: "ASK_AI", mode: mode}, (resp) => {
      const err = chrome.runtime.lastError;
      console.log("Error from runtime:", err);
      console.log("Response from runtime:", resp);
      // if (err) {
      //   showOut(`Error: ${err.message}`, true);
      //   setButtonsDisabled(false);
      //   return ;
      // }
      // if (!resp) {
      //   showOut('No answer received.', true);
      //   setButtonsDisabled(false);
      //   return;
      // }
      // if (resp.error) {
      //   showOut(resp.error, true);
      //   setButtonsDisabled(false);
      //   return;
      // }
      const text = typeof resp === 'string' ? resp : (resp.answer || '');
      showOut(text || 'No answer received.', false);
      setButtonsDisabled(false);
    });
  };
});

function showOut(text, isError) {
  // render as <pre> once; don’t overwrite with textContent later
  out.innerHTML = `<p>${text}</p>`;
  out.style.color = isError ? '#b00020' : '#222';
}

function setButtonsDisabled(disabled) {
  document.querySelectorAll('button').forEach(b => b.disabled = disabled);
}

function escapeHtml(str = '') {
  return str.replace(/[&<>"']/g, (m) => (
    { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[m]
  ));
}
