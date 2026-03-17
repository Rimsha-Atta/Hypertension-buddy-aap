/**
 * Knowledge-Based System (KBS) Logic
 * Handles Clinical Analysis and Data Management
 */

// Load data from LocalStorage or initialize with empty array
let bpHistory = JSON.parse(localStorage.getItem("bpData")) || [];

window.onload = function () {
  if (localStorage.getItem("isLoggedIn") === "true") {
    showApp();
    updateStatsTable();
  }
};

// Validates email format in real-time
function checkEmail() {
  const email = document.getElementById("login-email").value;
  const error = document.getElementById("email-error");
  const regex = /\S+@\S+\.\S+/;
  error.style.display = regex.test(email) || email === "" ? "none" : "block";
}

// Manages user login and session storage
function loginUser() {
  const name = document.getElementById("login-name").value;
  const email = document.getElementById("login-email").value;
  const errorDisplay = document.getElementById("email-error").style.display;

  if (name && email && errorDisplay === "none") {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);
    showApp();
  } else {
    alert("Please enter valid clinical credentials.");
  }
}

function showApp() {
  document.getElementById("login-screen").style.display = "none";
  document.getElementById("app-screen").style.display = "block";
  showTab("home");
}

// Tab navigation controller
function showTab(tabName) {
  document.getElementById("home-tab").style.display = "none";
  document.getElementById("stats-tab").style.display = "none";
  document.getElementById("profile-tab").style.display = "none";

  if (tabName === "home") {
    document.getElementById("home-tab").style.display = "block";
  } else if (tabName === "stats") {
    document.getElementById("stats-tab").style.display = "block";
    updateStatsTable();
  } else if (tabName === "profile") {
    document.getElementById("display-name").innerText =
      localStorage.getItem("userName");
    document.getElementById("display-email").innerText =
      localStorage.getItem("userEmail");
    document.getElementById("profile-tab").style.display = "block";
  }
}

// Clinical Inference Engine
function analyzeBP() {
  const sys = parseInt(document.getElementById("systolic").value);
  const dia = parseInt(document.getElementById("diastolic").value);

  if (isNaN(sys) || isNaN(dia)) {
    alert("Please input valid numerical values.");
    return;
  }

  let status = "",
    color = "",
    advice = "";

  // Clinical Logic based on Medical Stages
  if (sys >= 160 || dia >= 100) {
    status = "Stage 2 Hypertension";
    color = "#d32f2f";
    advice =
      "Immediate medical consultation is required. Minimize sodium intake.";
  } else if (sys >= 140 || dia >= 90) {
    status = "Stage 1 Hypertension";
    color = "#f57c00";
    advice =
      "Consult a physician. Lifestyle modifications and monitoring are necessary.";
  } else if (sys >= 120 || dia >= 80) {
    status = "Pre-Hypertension";
    color = "#1976d2";
    advice = "Adopt a healthy diet and increase daily physical activity.";
  } else {
    status = "Normal BP";
    color = "#388e3c";
    advice =
      "Your blood pressure is within the healthy range. Maintain your lifestyle.";
  }

  // Update UI components
  document.getElementById("result-box").style.display = "block";
  const badge = document.getElementById("status-badge");
  badge.innerText = status;
  badge.style.backgroundColor = color;
  document.getElementById("expert-advice").innerText = "Advice: " + advice;

  // Save record to history
  const today = new Date().toLocaleDateString();
  bpHistory.unshift({
    date: today,
    bp: `${sys}/${dia}`,
    status: status.split(" ")[0],
  });
  localStorage.setItem("bpData", JSON.stringify(bpHistory));
}

// Updates the Statistics table with historical data
function updateStatsTable() {
  const tableBody = document.getElementById("stats-table-body");
  tableBody.innerHTML = "";
  bpHistory.forEach((record) => {
    const row = `<tr>
            <td style="padding: 10px; border-bottom: 1px solid #f0f0f0; text-align: center;">${record.date}</td>
            <td style="padding: 10px; border-bottom: 1px solid #f0f0f0; text-align: center;">${record.bp}</td>
            <td style="padding: 10px; border-bottom: 1px solid #f0f0f0; text-align: center; font-weight: bold;">${record.status}</td>
        </tr>`;
    tableBody.innerHTML += row;
  });
}

// Clears all stored records
function clearHistory() {
  if (
    confirm("Are you sure you want to permanently delete all clinical records?")
  ) {
    bpHistory = [];
    localStorage.removeItem("bpData");
    updateStatsTable();
  }
}

function logout() {
  localStorage.removeItem("isLoggedIn");
  location.reload();
}
