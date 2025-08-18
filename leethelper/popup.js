[...document.querySelectorAll('button')].forEach(btn=>{
  btn.onclick = async () => {
    const {answer} = await chrome.runtime.sendMessage({
      type:'ASK_OPENAI',
      mode:btn.dataset.mode
    });
    document.getElementById('out').textContent = answer;
  };
});
