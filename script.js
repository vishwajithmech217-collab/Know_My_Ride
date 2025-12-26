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

function toggleAdvanced(){
  document.getElementById("advancedBox").classList.toggle("hidden");
}

function avg(v){
  const h = Number(height.value);
  const usage = Number(usage.value);
  const freq = Number(frequency.value);
  const leg = Number(legHeight.value || h*0.45);

  const idealSeat = leg * 0.9;
  let seatScore = 100 - Math.abs(v.seat - idealSeat) * 0.2;
  seatScore = Math.max(60, Math.min(100, seatScore));

  let score =
    v.comfort*0.25 +
    v.control*0.25 +
    v.posture*0.25 +
    v.cityBias*0.25;

  if(freq>70) score += (v.comfort-75)*0.3;
  if(freq<40) score += (v.control-75)*0.2;
  if(usage>60) score += (60-v.cityBias)*0.15;
  if(usage<40) score += (v.cityBias-60)*0.15;

  score = (score*0.8 + seatScore*0.2);
  return Math.round(Math.max(0, Math.min(100, score)));
}

function recommend(){
  usageText.innerText = usage.value<40?"City focused":usage.value>60?"Highway focused":"Balanced usage";
  freqText.innerText = frequency.value<40?"Occasional usage":frequency.value>70?"Daily usage":"Moderate usage";

  results.innerHTML="";
  compare=[];

  vehicles.filter(v=>v.type===type.value)
    .sort((a,b)=>avg(b)-avg(a))
    .forEach((v,i)=>{
      const c=document.createElement("div");
      c.className="card";
      c.innerHTML=`
        ${i===0?'<div class="best">⭐ Best for you</div>':''}
        <b>${v.name}</b><br>
        Score: ${avg(v)}/100
        <button onclick='showDetail(${JSON.stringify(v)})'>Details</button>
      `;
      results.appendChild(c);
    });
}

function showDetail(v){
  selected=v;
  detailModal.classList.remove("hidden");

  dName.innerText=v.name;
  dScore.innerText=`Overall Score: ${avg(v)}/100`;

  barComfort.style.width=v.comfort+"%";
  barControl.style.width=v.control+"%";
  barPosture.style.width=v.posture+"%";
  barUsage.style.width=v.cityBias+"%";

  whyFit.innerHTML="";
  whyNot.innerHTML="";

  if(Math.abs(v.seat-(legHeight.value||height.value*0.45))<40)
    whyFit.innerHTML+="<li>Seat height matches your body well</li>";
  else
    whyNot.innerHTML+="<li>Seat height may feel slightly off</li>";

  if(frequency.value>70) whyFit.innerHTML+="<li>Comfort suitable for daily use</li>";
  if(usage.value>60 && v.cityBias>70) whyNot.innerHTML+="<li>City-tuned vehicle on highway</li>";
}

function closeDetail(){ detailModal.classList.add("hidden"); }

function selectCompare(){
  if(!compare.includes(selected)) compare.push(selected);
  closeDetail();
  if(compare.length===2) openCompare();
}

function openCompare(){
  compareContent.innerHTML="";
  compare.forEach(v=>{
    compareContent.innerHTML+=`
      <div class="compare-card">
        <h3>${v.name}</h3>
        Comfort: ${v.comfort}<br>
        Control: ${v.control}<br>
        Posture: ${v.posture}<br>
        Usage: ${v.cityBias}<br>
        <b>Total: ${avg(v)}/100</b>
      </div>`;
  });
  compareModal.classList.remove("hidden");
}

function closeCompare(){
  compareModal.classList.add("hidden");
  compare=[];
}