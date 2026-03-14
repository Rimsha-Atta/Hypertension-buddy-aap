// Function to update UI from memory when page loads
document.addEventListener("DOMContentLoaded", updateHistoryUI);

/**
 * Core KBS Logic Function
 * Analyzes Blood Pressure based on Age and Clinical Guidelines
 */
function analyzeHealth() {
  const age = parseInt(document.getElementById("user-age").value);
  const systolic = parseInt(document.getElementById("systolic").value);
  const diastolic = parseInt(document.getElementById("diastolic").value);
  const resultCard = document.getElementById("result-card");
  const title = document.getElementById("diagnosis-title");
  const description = document.getElementById("diagnosis-desc");

  // Validation Check
  if (!age || !systolic || !diastolic) {
    alert("Error: Please provide all patient metrics.");
    return;
  }

  let status = "";
  let bgColor = "";
  let medicalAdvice = "";

  // Knowledge-Based Reasoning Engine (Age-Sensitive)
  if (age >= 60) {
    // Clinical Rules for Seniors
    if (systolic >= 150 || diastolic >= 90) {
      status = "Stage 2 Hypertension (Senior)";
      bgColor = "#dc2626"; // Red
      medicalAdvice =
        "High clinical risk. Immediate medical consultation required.";
    } else if (systolic >= 130 || diastolic >= 85) {
      status = "Elevated BP (Senior)";
      bgColor = "#ca8a04"; // Yellow
      medicalAdvice = "Common for this age group. Continue daily monitoring.";
    } else {
      status = "Stable Health (Senior)";
      bgColor = "#16a34a"; // Green
      medicalAdvice = "Patient is within healthy limits for their age.";
    }
  } else {
    // Standard Rules for Adults
    if (systolic >= 140 || diastolic >= 90) {
      status = "Stage 2 Hypertension";
      bgColor = "#dc2626"; // Red
      medicalAdvice =
        "Danger: High blood pressure detected. Seek physician advice.";
    } else if (systolic >= 120 || diastolic >= 80) {
      status = "Pre-Hypertension";
      bgColor = "#ca8a04"; // Yellow
      medicalAdvice =
        "Warning: Improve lifestyle, increase exercise, and reduce salt.";
    } else {
      status = "Optimal Health";
      bgColor = "#16a34a"; // Green
      medicalAdvice = "Blood pressure is perfectly normal.";
    }
  }

  // Update Visualization
  resultCard.style.display = "block";
  resultCard.style.backgroundColor = bgColor;
  title.innerText = status;
  description.innerText = medicalAdvice;

  // Save data locally
  saveRecord(systolic, diastolic, status);
}

/**
 * Saves analysis record to Browser Storage
 */
function saveRecord(s, d, result) {
  let records = JSON.parse(localStorage.getItem("bp_history")) || [];
  records.unshift({ s, d, result, date: new Date().toLocaleDateString() });
  // Store only last 5 records
  localStorage.setItem("bp_history", JSON.stringify(records.slice(0, 5)));
  updateHistoryUI();
}

/**
 * Refreshes the History Log on the screen
 */
function updateHistoryUI() {
  let records = JSON.parse(localStorage.getItem("bp_history")) || [];
  const list = document.getElementById("history-list");
  list.innerHTML = records
    .map(
      (r) => `
        <div class="history-item">
            <span><b>${r.s}/${r.d}</b></span>
            <span>${r.result}</span>
        </div>
    `,
    )
    .join("");
}

/**
 * Clears all stored patient logs
 */
function clearHistory() {
  localStorage.removeItem("bp_history");
  updateHistoryUI();
}
