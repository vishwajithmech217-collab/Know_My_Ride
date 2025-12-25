console.log("SCRIPT LOADED");

const vehicles = [
  {name:"Yamaha MT-15", type:"bike", comfort:85, control:90, posture:80, cityBias:60, seatHeight:810},
  {name:"Royal Enfield Classic 350", type:"bike", comfort:88, control:75, posture:90, cityBias:55, seatHeight:805},
  {name:"TVS Ntorq 125", type:"scooter", comfort:80, control:78, posture:82, cityBias:85, seatHeight:770},
  {name:"Honda Activa 6G", type:"scooter", comfort:78, control:76, posture:80, cityBias:90, seatHeight:692},
  {name:"Hyundai i20", type:"car", comfort:88, control:85, posture:90, cityBias:55, seatHeight:480},
  {name:"Kia Seltos", type:"suv", comfort:90, control:82, posture:92, cityBias:50, seatHeight:600}
];

function avg(v) {
  return Math.round((v.comfort + v.control + v.posture + v.cityBias) / 4);
}

function getEstimatedLegHeight() {
  const h = Number(document.getElementById("height").value);
  if (!h || h < 120) return null;
  return h * 0.45;
}

function finalScore(v) {
  let score = avg(v);
  const leg = getEstimatedLegHeight();
  if (!leg) return score;

  const reach = leg * 10 * 0.9;

  if (v.seatHeight > reach + 40) score -= 6;
  else if (v.seatHeight > reach) score -= 3;
  else score += 2;

  return Math.max(0, Math.min(score, 100));
}

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

function buildWhyFit(v) {
  const reasons = [];
  reasons.push("Recommendation based on your height and usage");
  reasons.push("Overall balance suits your riding needs");
  return reasons;
}

function buildWhyNotFit(v) {
  const warnings = [];
  const leg = getEstimatedLegHeight();
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

/* Slider text */
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
