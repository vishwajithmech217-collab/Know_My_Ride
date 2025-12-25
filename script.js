console.log("SCRIPT LOADED");

const vehicles = [
  {name:"Yamaha MT-15", type:"bike", comfort:85, control:90, posture:80, cityBias:60, seatHeight:810},
  {name:"Royal Enfield Classic 350", type:"bike", comfort:88, control:75, posture:90, cityBias:55, seatHeight:805},
  {name:"TVS Ntorq 125", type:"scooter", comfort:80, control:78, posture:82, cityBias:85, seatHeight:770},
  {name:"Honda Activa 6G", type:"scooter", comfort:78, control:76, posture:80, cityBias:90, seatHeight:692},
  {name:"Hyundai i20", type:"car", comfort:88, control:85, posture:90, cityBias:55, seatHeight:480},
  {name:"Kia Seltos", type:"suv", comfort:90, control:82, posture:92, cityBias:50, seatHeight:600}
];

let selectedVehicle = null;
let compareList = [];

// ---------- HELPERS ----------

function toggleAdvanced() {
  const box = document.getElementById("advancedSection");
  box.style.display = box.style.display === "none" ? "block" : "none";
}

function getLegHeight() {
  const manualInput = document.getElementById("legHeight");
  const manual = manualInput ? Number(manualInput.value) : 0;

  // If user entered leg height, ALWAYS use it
  if (manual && manual > 40) {
    return manual;
  }

  // Else estimate from height
  const height = Number(document.getElementById("height").value);
  if (!height || height < 120) return null;

  return height * 0.45;
}

function avg(v) {
  return Math.round((v.comfort + v.control + v.posture + v.cityBias) / 4);
}

function finalScore(v) {
  let score = avg(v);
  const leg = getLegHeight();
  if (!leg) return score;

  const reach = leg * 10 * 0.9;
  if (v.seatHeight > reach + 40) score -= 6;
  else if (v.seatHeight > reach) score -= 3;
  else score += 2;

  return Math.max(0, Math.min(score, 100));
}

// ---------- MAIN ----------

function recommend() {
  const type = document.getElementById("type").value;
  const box = document.getElementById("results");
  box.innerHTML = "";

  const list = vehicles
    .filter(v => v.type === type)
    .sort((a,b) => finalScore(b) - finalScore(a));

  list.forEach((v,i) => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      ${i===0 ? `<div class="best-tag">⭐ Best for you</div>` : ""}
      <b>${v.name}</b><br>
      Score: ${finalScore(v)}/100
      <button onclick='showDetail(${JSON.stringify(v)})'>Details</button>
    `;
    box.appendChild(div);
  });
}

// ---------- DETAILS ----------

function buildWhyFit(v) {
  return [
    "Recommendation based on your height and usage",
    "Overall balance suits your riding profile"
  ];
}

function buildWhyNotFit(v) {
  const warnings = [];
  const leg = getLegHeight();

  if (leg) {
    const reach = leg * 10 * 0.9;
    if (v.seatHeight > reach + 40)
      warnings.push("Seat height may feel tall when stopping");
  }

  if (warnings.length === 0)
    warnings.push("No major drawbacks found");

  return warnings;
}

function showDetail(v) {
  selectedVehicle = v;
  document.getElementById("detailModal").classList.remove("hidden");

  document.getElementById("dName").innerText = v.name;
  document.getElementById("dScore").innerText =
    `Overall Score: ${finalScore(v)}/100`;

  const fit = document.getElementById("whyFitList");
  fit.innerHTML = "";
  buildWhyFit(v).forEach(t => {
    const li = document.createElement("li");
    li.innerText = t;
    fit.appendChild(li);
  });

  const notFit = document.getElementById("whyNotFitList");
  notFit.innerHTML = "";
  buildWhyNotFit(v).forEach(t => {
    const li = document.createElement("li");
    li.innerText = t;
    notFit.appendChild(li);
  });
}

function closeDetail() {
  document.getElementById("detailModal").classList.add("hidden");
}

// ---------- COMPARE ----------

function addToCompare() {
  if (!selectedVehicle) return;

  if (compareList.length >= 2) {
    alert("You can compare only 2 vehicles at a time");
    return;
  }

  if (!compareList.find(v => v.name === selectedVehicle.name)) {
    compareList.push(selectedVehicle);
  }

  closeDetail();

  if (compareList.length === 2) {
    document.getElementById("compareBtn").disabled = false;
  }

  recommend(); // re-render to show selected tag
}

function showCompare() {
  document.getElementById("compareModal").classList.remove("hidden");
  renderCompare("c1", compareList[0]);
  renderCompare("c2", compareList[1]);
}

function renderCompare(id, v) {
  document.getElementById(id).innerHTML = `
    <div class="compare-card">
      <h3>${v.name}</h3>
      Comfort: ${v.comfort}<br>
      Control: ${v.control}<br>
      Posture: ${v.posture}<br>
      City Bias: ${v.cityBias}<br>
      Seat Height: ${v.seatHeight} mm<br>
      <b>Score: ${finalScore(v)}/100</b>
    </div>
  `;
}

function closeCompare() {
  document.getElementById("compareModal").classList.add("hidden");
  compareList = [];
}

// ---------- SLIDER TEXT ----------

document.addEventListener("DOMContentLoaded", () => {
  const usage = document.getElementById("usage");
  const usageText = document.getElementById("usageText");
  const frequency = document.getElementById("frequency");
  const freqText = document.getElementById("freqText");

  usage.addEventListener("input", () => {
    usageText.innerText =
      usage.value < 30 ? "City focused" :
      usage.value < 60 ? "Balanced usage" :
      "Highway focused";
  });

  frequency.addEventListener("input", () => {
    freqText.innerText =
      frequency.value < 30 ? "Occasional usage" :
      frequency.value < 60 ? "Moderate usage" :
      "Daily usage";
  });
});