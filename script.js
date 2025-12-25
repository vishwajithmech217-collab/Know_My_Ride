alert("SCRIPT LOADED");

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
   UTIL
================================ */
function avg(v) {
  return Math.round((v.comfort + v.control + v.posture + v.cityBias) / 4);
}

/* ===============================
   RECOMMENDATION
================================ */
function recommend() {
  const type = document.getElementById("type").value;
  const results = document.getElementById("results");
  results.innerHTML = "";

  compare = []; // reset compare

  const filtered = vehicles
    .filter(v => v.type === type)
    .sort((a, b) => avg(b) - avg(a));

  filtered.forEach((v, i) => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      ${i === 0 ? `<div class="best">⭐ Best for you</div>` : ""}
      <b>${v.name}</b><br>
      Score: ${avg(v)}/100
      <button onclick='showDetail(${JSON.stringify(v)})'>Details</button>
    `;

    results.appendChild(div);
  });
}

/* ===============================
   DETAIL MODAL
================================ */
function showDetail(v) {
  selected = v;

  document.getElementById("detailModal").classList.remove("hidden");
  document.getElementById("dName").innerText = v.name;
  document.getElementById("dScore").innerText =
    `Overall Score: ${avg(v)}/100`;

  buildWhyFit(v);
  buildWhyNot(v);
}

function closeDetail() {
  document.getElementById("detailModal").classList.add("hidden");
}

/* ===============================
   WHY FIT / WHY NOT
================================ */
function buildWhyFit(v) {
  const height = Number(document.getElementById("height").value);
  const weight = Number(document.getElementById("weight").value);
  const usage = Number(document.getElementById("usage").value);

  const list = document.getElementById("whyFit");
  list.innerHTML = "";

  if (height >= 165 && height <= 180)
    addLi(list, "Your height supports a comfortable posture");

  if (weight <= 90)
    addLi(list, "Vehicle balance matches your body weight");

  if (usage > 60)
    addLi(list, "Stable choice for highway cruising");
  else
    addLi(list, "Well suited for city traffic");

  addLi(list, "Overall, this vehicle suits your needs");
}

function buildWhyNot(v) {
  const usage = Number(document.getElementById("usage").value);
  const list = document.getElementById("whyNot");
  list.innerHTML = "";

  if (v.type === "scooter" && usage > 70)
    addLi(list, "Scooters are less comfortable for long highway rides");

  if (v.cityBias > 75 && usage > 70)
    addLi(list, "Engine tuning favors city riding");

  if (list.children.length === 0)
    addLi(list, "No major drawbacks for your usage");
}

function addLi(list, text) {
  const li = document.createElement("li");
  li.innerText = text;
  list.appendChild(li);
}

/* ===============================
   COMPARISON
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
  const box = document.getElementById("compareContent");

  box.innerHTML = "";

  compare.forEach(v => {
    box.innerHTML += `
      <p><b>${v.name}</b><br>
      Overall Score: ${avg(v)}/100</p>
    `;
  });

  modal.classList.remove("hidden");
  modal.style.display = "flex";
}

function closeCompare() {
  const modal = document.getElementById("compareModal");

  modal.classList.add("hidden");
  modal.style.display = "none";

  compare = [];
}

/* ===============================
   UX: CLOSE ON OUTSIDE CLICK
================================ */
window.addEventListener("click", e => {
  const modal = document.getElementById("compareModal");
  const box = modal.querySelector(".modal-box");

  if (!modal.classList.contains("hidden") && !box.contains(e.target)) {
    closeCompare();
  }
});