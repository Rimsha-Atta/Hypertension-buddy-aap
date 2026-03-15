/**
 * Heart Health Smart KBS
 * Developed by: Rimsha
 */

window.onload = function () {
  // Manage Guest Access logic
  const visitCount = localStorage.getItem("visitCount") || 0;
  const guestBtn = document.getElementById("guest-option");

  if (visitCount >= 1) {
    guestBtn.style.display = "none";
  }
  updateUI(); // Refresh list on load
};

// Navigation Logic
function showPage(pageName) {
  const pages = ["home-page", "stats-page", "profile-page"];
  const icons = ["home-icon", "stats-icon", "profile-icon"];

  pages.forEach((p) => (document.getElementById(p).style.display = "none"));
  icons.forEach((i) => document.getElementById(i).classList.remove("active"));

  document.getElementById(pageName + "-page").style.display = "block";
  document.getElementById(pageName + "-icon").classList.add("active");
}

// Login Logic with Name and Email
function handleLogin(isGuest) {
  const nameInput = document.getElementById("username").value;
  const emailInput = document.getElementById("useremail").value;

  if (!isGuest && (nameInput === "" || emailInput === "")) {
    return alert("Please enter both Name and Email to proceed!");
  }

  let count = parseInt(localStorage.getItem("visitCount") || 0);
  localStorage.setItem("visitCount", count + 1);

  document.getElementById("display-username").innerText = isGuest
    ? "Guest User"
    : nameInput;
  document.getElementById("display-email").innerText = isGuest
    ? "Not Registered"
    : emailInput;

  document.getElementById("login-screen").style.display = "none";
  document.getElementById("app-content").style.display = "flex";
}

// Decision Support Logic (KBS)
function analyzeHealth() {
  const age = parseInt(document.getElementById("user-age").value);
  const sys = parseInt(document.getElementById("systolic").value);
  const dia = parseInt(document.getElementById("diastolic").value);
  const card = document.getElementById("result-card");

  if (!age || !sys || !dia) return alert("Please fill all input fields!");

  let status = "",
    color = "",
    advice = "";

  if (sys < 120 && dia < 80) {
    status = "Optimal Health";
    color = "#16a34a";
    advice =
      "Your BP is perfect. Maintain a healthy diet, stay hydrated, and continue regular exercise.";
  } else if ((sys >= 120 && sys <= 139) || (dia >= 80 && dia <= 89)) {
    status = "Pre-Hypertension";
    color = "#ca8a04";
    advice =
      "Warning: Reduce salt intake, avoid fried foods, and walk for 30 minutes daily.";
  } else {
    status = "High Blood Pressure";
    color = "#dc2626";
    advice =
      "High Risk: Consult a doctor immediately. It is recommended to perform a Cholesterol test and an ECG.";
  }

  if (age >= 60 && sys < 150 && status !== "Optimal Health") {
    advice +=
      " (Note: This range might be acceptable for seniors, but monitor regularly.)";
  }

  card.style.display = "block";
  card.style.backgroundColor = color;
  document.getElementById("diagnosis-title").innerText = status;
  document.getElementById("diagnosis-desc").innerText = advice;

  saveRecord(sys, dia, status);
}

// SAVE & UPDATE UI (Fixed Clear History Issue)
function saveRecord(s, d, res) {
  let records = JSON.parse(localStorage.getItem("bp_history")) || [];
  records.unshift({ s, d, res });
  localStorage.setItem("bp_history", JSON.stringify(records.slice(0, 5)));
  updateUI();
}

function updateUI() {
  let records = JSON.parse(localStorage.getItem("bp_history")) || [];
  const list = document.getElementById("history-list");

  if (records.length === 0) {
    list.innerHTML =
      "<p style='text-align:center; color:#64748b; font-size: 0.9rem;'>No recent records found.</p>";
  } else {
    list.innerHTML = records
      .map(
        (r) => `
            <div class="history-item">
                <span><b>${r.s}/${r.d}</b></span>
                <span>${r.res}</span>
            </div>
        `,
      )
      .join("");
  }
}

// Clear History Button
function clearHistory() {
  localStorage.removeItem("bp_history");
  updateUI(); // This will clear the screen immediately
}

// Logout & Reset Buttons
function logoutOnly() {
  location.reload();
}

function resetApp() {
  if (confirm("Are you sure you want to reset everything?")) {
    localStorage.clear();
    location.reload();
  }
}
