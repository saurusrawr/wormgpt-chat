const loginBtn = document.getElementById("login-btn");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginMsg = document.getElementById("login-msg");
const loginCard = document.querySelector(".login-card");
const chatContainer = document.querySelector(".chat-container");
const chatWindow = document.getElementById("chat-window");
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");

let messages = [];

loginBtn.addEventListener("click", () => {
  const user = usernameInput.value.trim();
  const pass = passwordInput.value.trim();
  if(!user || !pass){
    loginMsg.textContent = "Masukkan username dan password";
    return;
  }
  loginCard.style.display = "none";
  chatContainer.style.display = "block";
});

function addMessage(text, sender){
  const div = document.createElement("div");
  div.classList.add("message", sender);
  div.textContent = text;
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

sendBtn.addEventListener("click", async ()=>{
  const text = chatInput.value.trim();
  if(!text) return;
  addMessage(text, "user");
  chatInput.value = "";
  messages.push({ role: "user", parts:[{text}] });
  
  const res = await fetch("/api/chat", {
    method:"POST",
    headers: { "Content-Type":"application/json" },
    body: JSON.stringify({ messages })
  });
  const data = await res.json();
  addMessage(data.answer || "AI tidak merespon", "ai");
  messages.push({ role: "ai", parts:[{text:data.answer || ""}] });
});

chatInput.addEventListener("keypress", e=>{
  if(e.key==="Enter") sendBtn.click();
});