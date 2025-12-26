const vehicles = [
  { name:"Yamaha MT-15", type:"bike", seat:810, comfort:85, control:90, posture:80, cityBias:60 },
  { name:"Royal Enfield Classic 350", type:"bike", seat:805, comfort:88, control:75, posture:90, cityBias:55 },
  { name:"TVS Ntorq 125", type:"scooter", seat:770, comfort:80, control:78, posture:82, cityBias:85 },
  { name:"Honda Activa 6G", type:"scooter", seat:765, comfort:78, control:76, posture:80, cityBias:90 },
  { name:"Hyundai i20", type:"car", seat:740, comfort:88, control:85, posture:90, cityBias:55 },
  { name:"Kia Seltos", type:"suv", seat:820, comfort:90, control:82, posture:92, cityBias:50 }
];

let selected = null;
let compare = [];

/* ===============================
   HELPERS
================================ */
function $(id) {
  return document.getElementById(id);
}

function avg(v) {
  const height = Number($("height").value);
  const usage = Number($("usage").value);
  const freq = Number($("frequency").value);
  const leg = Number($("legHeight")?.value || height * 0.45);

  const idealSeat = leg * 0.9;
  let seatScore = 100 - Math.abs(v.seat - idealSeat) * 0.2;
  seatScore = Math.max(60, Math.min(100, seatScore));

  let base =
    v.comfort * 0.25 +
    v.control * 0.25 +
    v.posture * 0.25 +
    v.cityBias * 0.25;

  if (freq > 70) base += (v.comfort - 75) * 0.3;
  if (usage > 60) base -= (v.cityBias - 50) * 0.15;

  return Math.round(base * 0.8 + seatScore * 0.2);
}

/* ===============================
   ADVANCED TOGGLE
================================ */
function toggleAdvanced() {
  $("advancedBox").classList.toggle("hidden");
}

/* ===============================
   MAIN RECOMMENDATION
================================ */
function recommend() {
  const type = $("type").value;
  const results = $("results");

  results.innerHTML = "";
  compare = [];

  const usageVal = Number($("usage").value);
  const freqVal = Number($("frequency").value);

  $("usageText").innerText =
    usageVal < 40 ? "City focused" :
    usageVal > 60 ? "Highway focused" :
    "Balanced usage";

  $("freqText").innerText =
    freqVal < 40 ? "Occasional usage" :
    freqVal > 70 ? "Daily usage" :
    "Moderate usage";

  const list = vehicles
    .filter(v => v.type === type)
    .sort((a, b) => avg(b) - avg(a));

  list.forEach((v, i) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      ${i === 0 ? '<div class="best">⭐ Best for you</div>' : ''}
      <b>${v.name}</b><br>
      Score: ${avg(v)}/100
      <button onclick='showDetail(${JSON.stringify(v)})'>Details</button>
    `;
    results.appendChild(card);
  });
}

/* ===============================
   DETAIL MODAL
================================ */
function showDetail(v) {
  selected = v;
  $("detailModal").classList.remove("hidden");

  $("dName").innerText = v.name;
  $("dScore").innerText = `Overall Score: ${avg(v)}/100`;

  $("barComfort").style.width = v.comfort + "%";
  $("barControl").style.width = v.control + "%";
  $("barPosture").style.width = v.posture + "%";
  $("barUsage").style.width = v.cityBias + "%";

  $("whyFit").innerHTML = "";
  $("whyNot").innerHTML = "";

  const height = Number($("height").value);
  const leg = Number($("legHeight")?.value || height * 0.45);

  if (Math.abs(v.seat - leg) < 50)
    $("whyFit").innerHTML += "<li>Seat height suits your body</li>";
  else
    $("whyNot").innerHTML += "<li>Seat height may feel uncomfortable</li>";

  $("whyFit").innerHTML += "<li>Overall posture matches your usage</li>";
}

function closeDetail() {
  $("detailModal").classList.add("hidden");
}

/* ===============================
   COMPARISON
================================ */
function selectCompare() {
  if (!compare.includes(selected)) compare.push(selected);
  closeDetail();

  if (compare.length === 2) openCompare();
}

function openCompare() {
  const box = $("compareContent");
  box.innerHTML = "";

  compare.forEach(v => {
    box.innerHTML += `
      <div class="compare-card">
        <h3>${v.name}</h3>
        Comfort: ${v.comfort}<br>
        Control: ${v.control}<br>
        Posture: ${v.posture}<br>
        Usage: ${v.cityBias}<br>
        <b>Total: ${avg(v)}/100</b>
      </div>
    `;
  });

  $("compareModal").classList.remove("hidden");
}

function closeCompare() {
  $("compareModal").classList.add("hidden");
  compare = [];
}