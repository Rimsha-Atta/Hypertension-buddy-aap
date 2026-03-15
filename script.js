// Page Loading Logic
window.onload = function () {
  const visitCount = localStorage.getItem("visitCount") || 0;
  const guestBtn = document.getElementById("guest-option");

  // Agar user 1 se zyada baar aaya hai, guest option chupa do
  if (visitCount >= 1) {
    guestBtn.style.display = "none";
  }
  updateUI();
};

// Navigation
function showPage(pageName) {
  const pages = ["home-page", "stats-page", "profile-page"];
  const icons = ["home-icon", "stats-icon", "profile-icon"];

  pages.forEach((p) => (document.getElementById(p).style.display = "none"));
  icons.forEach((i) => document.getElementById(i).classList.remove("active"));

  document.getElementById(pageName + "-page").style.display = "block";
  document.getElementById(pageName + "-icon").classList.add("active");
}

// Login with Guest Restriction
function handleLogin(isGuest) {
  const nameInput = document.getElementById("username").value;

  if (!isGuest && nameInput === "") {
    return alert("Please enter your name to access the system!");
  }

  // Update Visit Count
  let count = parseInt(localStorage.getItem("visitCount") || 0);
  localStorage.setItem("visitCount", count + 1);

  // Profile Settings
  const finalName = isGuest ? "Guest User" : nameInput;
  document.getElementById("display-username").innerText = finalName;

  // Switch to App
  document.getElementById("login-screen").style.display = "none";
  document.getElementById("app-content").style.display = "flex";
}

// KBS Logic
function analyzeHealth() {
  const age = parseInt(document.getElementById("user-age").value);
  const sys = parseInt(document.getElementById("systolic").value);
  const dia = parseInt(document.getElementById("diastolic").value);
  const card = document.getElementById("result-card");

  if (!age || !sys || !dia) return alert("Please fill all fields!");

  let status = "",
    color = "",
    advice = "";

  if (age >= 60) {
    if (sys >= 150 || dia >= 90) {
      status = "High BP (Senior)";
      color = "#dc2626";
      advice = "Urgent consultation needed.";
    } else {
      status = "Normal (Senior)";
      color = "#16a34a";
      advice = "Health is stable.";
    }
  } else {
    if (sys >= 140 || dia >= 90) {
      status = "Hypertension";
      color = "#dc2626";
      advice = "Seek medical advice.";
    } else if (sys >= 120 || dia >= 80) {
      status = "Pre-Hypertension";
      color = "#ca8a04";
      advice = "Improve diet and exercise.";
    } else {
      status = "Healthy";
      color = "#16a34a";
      advice = "Great job!";
    }
  }

  card.style.display = "block";
  card.style.backgroundColor = color;
  document.getElementById("diagnosis-title").innerText = status;
  document.getElementById("diagnosis-desc").innerText = advice;

  saveRecord(sys, dia, status);
}

function saveRecord(s, d, res) {
  let records = JSON.parse(localStorage.getItem("bp_history")) || [];
  records.unshift({ s, d, res });
  localStorage.setItem("bp_history", JSON.stringify(records.slice(0, 5)));
  updateUI();
}

function updateUI() {
  let records = JSON.parse(localStorage.getItem("bp_history")) || [];
  document.getElementById("history-list").innerHTML = records
    .map(
      (r) => `
        <div class="history-item"><span>${r.s}/${r.d}</span><span>${r.res}</span></div>
    `,
    )
    .join("");
}

function clearHistory() {
  localStorage.removeItem("bp_history");
  updateUI();
}

function resetApp() {
  // Ye button logout karega aur visit count reset kar dega (Sir ko demo dikhane ke liye)
  localStorage.removeItem("visitCount");
  location.reload();
}
