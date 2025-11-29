/* ------------------------------------
   LOGIN HANDLER (FIXED)
------------------------------------ */
function goLogin() {
  document.getElementById("login").scrollIntoView({ behavior: "smooth" });
}

document.addEventListener("DOMContentLoaded", () => {

  // SPECIFIC LOGIN BUTTON SELECTOR
  const loginBtn = document.querySelector("#login .login-card button[type='button']");

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      const user = document.getElementById("username").value.trim();
      const pass = document.getElementById("password").value.trim();

      if (user === "" || pass === "") {
        alert("Please enter both username and password.");
        return;
      }

      // DEMO LOGIN
      if (user === "user" && pass === "user123") {
        window.location.href = "dashboard.html";
      }
      else if (user === "admin" && pass === "admin123") {
        window.location.href = "admin.html";
      }
      else {
        alert("Invalid credentials. Try user/user123 OR admin/admin123.");
      }
    });
  }
});


/* ------------------------------------
   CHATBOT TOGGLE (GLOBAL)
------------------------------------ */
window.gcToggleChatbot = function () {
  const box = document.getElementById("gcChatbot");
  box.classList.toggle("show");
};

/* ------------------------------------
   CHAT SEND FUNCTION (GLOBAL)
------------------------------------ */
window.gcSend = function () {
  const input = document.getElementById("gcUserInput");
  const text = input.value.trim();
  if (text === "") return;

  const chat = document.getElementById("gcChatArea");

  // Add user message
  const userMsg = document.createElement("div");
  userMsg.className = "gc-user-msg";
  userMsg.textContent = text;
  chat.appendChild(userMsg);

  input.value = "";
  chat.scrollTop = chat.scrollHeight;

  window.gcBotReply(text);
};

/* ------------------------------------
   ENTER KEY SUPPORT (GLOBAL)
------------------------------------ */
window.gcKey = function (event) {
  if (event.key === "Enter") window.gcSend();
};

/* ------------------------------------
   CHATBOT AUTO REPLIES (GLOBAL)
------------------------------------ */
window.gcBotReply = function (text) {
  const chat = document.getElementById("gcChatArea");
  let reply = "Ask me about immobiliser, tracking, alerts, tamper detection, or safety!";

  const t = text.toLowerCase();

  if (t.includes("immobiliser") || t.includes("immobilizer")) {
    reply = "The immobiliser activates ONLY when vehicle speed ≤ 3 km/h to ensure safety.";
  }
  else if (t.includes("track") || t.includes("location")) {
    reply = "GuardianCar supports real-time GPS tracking and route history logging.";
  }
  else if (t.includes("alert") || t.includes("notification")) {
    reply = "The system sends instant push alerts for ignition, movement, and tamper events.";
  }
  else if (t.includes("not me")) {
    reply = "When you press 'Not Me', the system activates immobilisation and live tracking.";
  }
  else if (t.includes("safe") || t.includes("engine")) {
    reply = "Yes! GuardianCar will NEVER cut engine power while the vehicle is above 3 km/h.";
  }
  else if (t.includes("esp32")) {
    reply = "ESP32 reads ignition, speed, tamper, and triggers immobiliser safely.";
  }

  setTimeout(() => {
    const botMsg = document.createElement("div");
    botMsg.className = "gc-bot-msg";
    botMsg.textContent = reply;
    chat.appendChild(botMsg);
    chat.scrollTop = chat.scrollHeight;
  }, 300);
};
