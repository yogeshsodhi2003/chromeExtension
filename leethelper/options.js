document.querySelector('form').onsubmit = e=>{
  e.preventDefault();
  const apiKey = e.target.apiKey.value.trim();
  chrome.storage.local.set({apiKey}, ()=>alert('Saved!'));
};
