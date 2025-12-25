console.log("JS loaded");

// VEHICLE DATA
const vehicles = [
  {name:"Yamaha MT-15", type:"bike", comfort:85, control:90, posture:80, cityBias:60},
  {name:"Royal Enfield Classic 350", type:"bike", comfort:88, control:75, posture:90, cityBias:55},
  {name:"TVS Ntorq 125", type:"scooter", comfort:80, control:78, posture:82, cityBias:85},
  {name:"Honda Activa 6G", type:"scooter", comfort:78, control:76, posture:80, cityBias:90},
  {name:"Hyundai i20", type:"car", comfort:88, control:85, posture:90, cityBias:55},
  {name:"Kia Seltos", type:"suv", comfort:90, control:82, posture:92, cityBias:50}
];

let selected = null;
let compare = [];

// SCORE
function avg(v){
  return Math.round((v.comfort + v.control + v.posture + v.cityBias) / 4);
}

// MAIN LOGIC
function recommend(){
  const type = document.getElementById("type").value;
  const results = document.getElementById("results");
  results.innerHTML = "";
  compare = [];
  document.getElementById("compareBtn").classList.add("hidden");

  let filtered = vehicles.filter(v => v.type === type);
  filtered.sort((a,b)=>avg(b)-avg(a));

  filtered.forEach((v,i)=>{
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      ${i===0 ? "<div class='best'>⭐ Best for you</div>" : ""}
      <b>${v.name}</b><br>
      Score: ${avg(v)}/100<br><br>
      <button onclick='showDetail(${JSON.stringify(v)})'>Details</button>
    `;
    results.appendChild(div);
  });
}

// DETAIL VIEW
function showDetail(v){
  selected = v;
  document.getElementById("detailModal").classList.remove("hidden");
  document.getElementById("dName").innerText = v.name;
  document.getElementById("dScore").innerText = "Overall Score: " + avg(v) + "/100";

  buildWhy(v);
  buildWhyNot(v);
}

function closeDetail(){
  document.getElementById("detailModal").classList.add("hidden");
}

// WHY FITS
function buildWhy(v){
  const ul = document.getElementById("whyFit");
  ul.innerHTML = "";
  const height = Number(document.getElementById("height").value);
  const usage = Number(document.getElementById("usage").value);

  if(height >= 165 && height <= 180) ul.innerHTML += "<li>Comfortable posture for your height</li>";
  if(usage > 50) ul.innerHTML += "<li>Good stability for highway rides</li>";
  else ul.innerHTML += "<li>Easy to use in city traffic</li>";
}

// WHY NOT
function buildWhyNot(v){
  const ul = document.getElementById("whyNot");
  ul.innerHTML = "";
  const usage = Number(document.getElementById("usage").value);

  if(v.type==="scooter" && usage > 70)
    ul.innerHTML += "<li>Not ideal for long highway rides</li>";
  else
    ul.innerHTML += "<li>No major drawbacks</li>";
}

// COMPARE
function selectCompare(){
  if(selected && compare.length < 2 && !compare.includes(selected)){
    compare.push(selected);
  }
  closeDetail();
  if(compare.length === 2){
    document.getElementById("compareBtn").classList.remove("hidden");
  }
}

function openCompare(){
  const box = document.getElementById("compareBox");
  box.innerHTML = "";
  compare.forEach(v=>{
    box.innerHTML += `<p><b>${v.name}</b> – ${avg(v)}/100</p>`;
  });
  document.getElementById("compareModal").classList.remove("hidden");
}

function closeCompare(){
  document.getElementById("compareModal").classList.add("hidden");
  compare = [];
}