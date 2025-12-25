/* ===============================
   VEHICLE DATA (V3)
================================ */
const vehicles = [
  // BIKES
  { name: "Yamaha MT-15", type: "bike", comfort: 85, control: 90, posture: 80, cityBias: 60 },
  { name: "Royal Enfield Classic 350", type: "bike", comfort: 88, control: 75, posture: 90, cityBias: 55 },
  { name: "Bajaj Pulsar NS200", type: "bike", comfort: 82, control: 88, posture: 78, cityBias: 65 },

  // SCOOTERS
  { name: "TVS Ntorq 125", type: "scooter", comfort: 80, control: 78, posture: 82, cityBias: 85 },
  { name: "Honda Activa 6G", type: "scooter", comfort: 78, control: 76, posture: 80, cityBias: 90 },

  // CARS
  { name: "Hyundai i20", type: "car", comfort: 88, control: 85, posture: 90, cityBias: 55 },

  // SUV
  { name: "Kia Seltos", type: "suv", comfort: 90, control: 82, posture: 92, cityBias: 50 }
];

/* ===============================
   GLOBAL STATE
================================ */
let selected = null;
let compare = [];

/* ===============================
   UTILITIES
================================ */
function avg(v) {
  return Math.round((v.comfort + v.control + v.posture + v.cityBias) / 4);
}

/* ===============================
   MAIN RECOMMENDATION
================================ */
function recommend() {
  const type = document.getElementById("type").value;
  const box = document.getElementById("results");
  box.innerHTML = "";

  let filtered = vehicles.filter(v => v.type === type);
  if (filtered.length === 0) return;

  filtered.sort((a, b) => avg(b) - avg(a));

  filtered.forEach((v, i) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      ${i === 0 ? `<div class="best-tag">⭐ Best for you</div>` : ""}
      <b>${v.name}</b><br>
      Score: ${avg(v)}/100
      <button onclick='showDetail(${JSON.stringify(v)})'>Details</button>
    `;

    box.appendChild(card);
  });
}

/* ===============================
   DETAIL MODAL
================================ */
function showDetail(v) {
  selected = v;
  document.getElementById("detailModal").classList.remove("hidden");

  document.getElementById("dName").innerText = v.name;
  document.getElementById("dComfort").style.width = v.comfort + "%";
  document.getElementById("dControl").style.width = v.control + "%";
  document.getElementById("dPosture").style.width = v.posture + "%";
  document.getElementById("dUsage").style.width = v.cityBias + "%";
  document.getElementById("dScore").innerText = `Overall Score: ${avg(v)}/100`;

  buildWhyFit(v);
  buildWhyNotFit(v);
}

function closeDetail() {
  document.getElementById("detailModal").classList.add("hidden");
}

/* ===============================
   WHY FIT / WHY NOT FIT
================================ */
function buildWhyFit(v) {
  const height = Number(document.getElementById("height").value);
  const weight = Number(document.getElementById("weight").value);
  const usage = Number(document.getElementById("usage").value);

  const list = document.getElementById("whyFitList");
  list.innerHTML = "";

  if (height >= 165 && height <= 180)
    list.appendChild(li("Your height supports a comfortable riding posture"));

  if (weight <= 90)
    list.appendChild(li("Vehicle balance matches your body weight"));

  if (usage > 60)
    list.appendChild(li("Good stability for highway cruising"));
  else
    list.appendChild(li("Very suitable for city traffic"));

  list.appendChild(li("Overall, this vehicle suits your usage well"));
}

function buildWhyNotFit(v) {
  const usage = Number(document.getElementById("usage").value);
  const list = document.getElementById("whyNotList");
  list.innerHTML = "";

  if (v.type === "scooter" && usage > 70)
    list.appendChild(li("Scooters are less comfortable for long highway rides"));

  if (v.cityBias > 75 && usage > 70)
    list.appendChild(li("Engine tuning favors city riding more"));

  if (list.children.length === 0)
    list.appendChild(li("No major drawbacks for your usage"));
}

function li(text) {
  const l = document.createElement("li");
  l.innerText = text;
  return l;
}

/* ===============================
   COMPARISON LOGIC
================================ */
function selectCompare() {
  if (!selected) return;

  if (!compare.includes(selected) && compare.length < 2) {
    compare.push(selected);
  }

  closeDetail();

  if (compare.length === 2) {
    showCompare();
  }
}

function showCompare() {
  const modal = document.getElementById("compareModal");
  modal.classList.remove("hidden");
  modal.style.display = "flex";

  renderCompare("c1", compare[0]);
  renderCompare("c2", compare[1]);
}

function renderCompare(id, v) {
  document.getElementById(id).innerHTML = `
    <h3>${v.name}</h3>
    Comfort<div class="bar"><div class="fill" style="width:${v.comfort}%"></div></div>
    Control<div class="bar"><div class="fill" style="width:${v.control}%"></div></div>
    Posture<div class="bar"><div class="fill" style="width:${v.posture}%"></div></div>
    Usage<div class="bar"><div class="fill" style="width:${v.cityBias}%"></div></div>
    <b>Overall: ${avg(v)}/100</b>
  `;
}

function closeCompare() {
  const modal = document.getElementById("compareModal");
  modal.classList.add("hidden");
  modal.style.display = "none";
  compare = [];
}

/* ===============================
   UX FIX: TAP OUTSIDE TO CLOSE
================================ */
document.getElementById("compareModal")?.addEventListener("click", e => {
  if (e.target.id === "compareModal") closeCompare();
});