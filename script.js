window.onload = function () {
  const visitCount = localStorage.getItem("visitCount") || 0;
  if (visitCount >= 1) {
    document.getElementById("guest-option").style.display = "none";
  }
  updateUI();
};

function showPage(pageName) {
  const pages = ["home-page", "stats-page", "profile-page"];
  const icons = ["home-icon", "stats-icon", "profile-icon"];
  pages.forEach((p) => (document.getElementById(p).style.display = "none"));
  icons.forEach((i) => document.getElementById(i).classList.remove("active"));
  document.getElementById(pageName + "-page").style.display = "block";
  document.getElementById(pageName + "-icon").classList.add("active");
}

function handleLogin(isGuest) {
  const nameInput = document.getElementById("username").value;
  const emailInput = document.getElementById("useremail").value;

  if (!isGuest && (nameInput === "" || emailInput === "")) {
    return alert("Please enter both Name and Email!");
  }

  let count = parseInt(localStorage.getItem("visitCount") || 0);
  localStorage.setItem("visitCount", count + 1);

  document.getElementById("display-username").innerText = isGuest
    ? "Guest User"
    : nameInput;
  document.getElementById("display-email").innerText = isGuest
    ? "No Email Provided"
    : emailInput;

  document.getElementById("login-screen").style.display = "none";
  document.getElementById("app-content").style.display = "flex";
}

function analyzeHealth() {
  const age = parseInt(document.getElementById("user-age").value);
  const sys = parseInt(document.getElementById("systolic").value);
  const dia = parseInt(document.getElementById("diastolic").value);
  const card = document.getElementById("result-card");

  if (!age || !sys || !dia) return alert("Please fill all fields!");

  let status = "",
    color = "",
    advice = "";

  if (sys < 120 && dia < 80) {
    status = "Optimal Health";
    color = "#16a34a";
    advice = "Sahi: Pani zyada peeyein aur rozana walk jari rakhein.";
  } else if ((sys >= 120 && sys <= 139) || (dia >= 80 && dia <= 89)) {
    status = "Pre-Hypertension";
    color = "#ca8a04";
    advice = "Mashwara: Namak kam karein aur fried food se parhez karein.";
  } else {
    status = "High Blood Pressure";
    color = "#dc2626";
    advice = "Khatra: Doctor se rabta karein aur Cholesterol test karwayein.";
  }

  if (age >= 60 && sys < 150) {
    advice += " (Seniors ke liye ye range behtar hai.)";
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

// Sirf Logout (Login Screen wapas layega)
function logoutOnly() {
  location.reload();
}

// Reset (Sab kuch mita dega taake naya demo ho sakay)
function resetApp() {
  localStorage.clear();
  location.reload();
}
