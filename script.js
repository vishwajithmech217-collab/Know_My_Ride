/* ===============================
   VEHICLE DATA
================================ */
const vehicles = [
  { name: "Yamaha MT-15", type: "bike", comfort: 85, control: 90, posture: 80, cityBias: 60 },
  { name: "Royal Enfield Classic 350", type: "bike", comfort: 88, control: 75, posture: 90, cityBias: 55 },
  { name: "TVS Ntorq 125", type: "scooter", comfort: 80, control: 78, posture: 82, cityBias: 85 },
  { name: "Honda Activa 6G", type: "scooter", comfort: 78, control: 76, posture: 80, cityBias: 90 },
  { name: "Hyundai i20", type: "car", comfort: 88, control: 85, posture: 90, cityBias: 55 },
  { name: "Kia Seltos", type: "suv", comfort: 90, control: 82, posture: 92, cityBias: 50 }
];

function avg(v) {
  return Math.round((v.comfort + v.control + v.posture + v.cityBias) / 4);
}

function recommend() {
  const type = document.getElementById("type").value;
  const results = document.getElementById("results");
  results.innerHTML = "";
  compare = []; // Reset compare array

  const list = vehicles.filter(v => v.type === type);
  list.sort((a, b) => avg(b) - avg(a));

  list.forEach((v, i) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      ${i === 0 ? "<div class='best'>⭐ Best for you</div>" : ""}
      <b>${v.name}</b><br>
      Score: ${avg(v)}/100<br><br>
      <button onclick='showDetail(${JSON.stringify(v)})'>Details</button>
    `;
    results.appendChild(card);
  });
}

function showDetail(v) {
  selected = v;
  document.getElementById("detailModal").classList.remove("hidden");
  document.getElementById("dName").innerText = v.name;
  document.getElementById("dScore").innerText = `Overall Score: ${avg(v)} / 100`;

  // Here you would generate the reasons why it fits or doesn't fit
  const whyFit = document.getElementById("whyFit");
  const whyNot = document.getElementById("whyNot");
  whyFit.innerHTML = "";
  whyNot.innerHTML = "";
  // Add logic to fill in whyFit and whyNot reasons
}

function closeDetail() {
  document.getElementById("detailModal").classList.add("hidden");
}

function selectCompare() {
  if (!compare.includes(selected)) {
    compare.push(selected);
  }
  closeDetail();
  if (compare.length === 2) {
    openCompare();
  }
}

function openCompare() {
  const modal = document.getElementById("compareModal");
  const content = document.getElementById("compareContent");
  content.innerHTML = "";

  compare.forEach(v => {
    const card = document.createElement("div");
    card.className = "compare-card";
    card.innerHTML = `
      <h3>${v.name}</h3>
      <div>Comfort: ${v.comfort}</div>
      <div>Control: ${v.control}</div>
      <div>Posture: ${v.posture}</div>
      <div>Usage: ${v.cityBias}</div>
      <strong>Total: ${avg(v)} / 100</strong>
    `;
    content.appendChild(card);
  });

  modal.classList.remove("hidden");
}

function closeCompare() {
  document.getElementById("compareModal").classList.add("hidden");
  compare = [];
}