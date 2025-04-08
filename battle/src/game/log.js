export function log(text) {
    const logEl = document.getElementById("log");
    logEl.innerHTML += text + "<br>";
    logEl.scrollTop = logEl.scrollHeight;
  }
  