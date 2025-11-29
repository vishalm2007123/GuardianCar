// ====== GuardianCar Frontend "Backend" (client-only) ======

// ---- State ----
const state = {
  ignition: false,
  speed: 0,
  immobiliser: false,
  pending: false,
  gps: { lat: 12.97, lon: 77.59 },
  trail: []
};

// ---- Utils ----
function toast(msg){
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(()=> el.classList.remove('show'), 2600);
}

function now(){
  return new Date().toLocaleTimeString();
}

function pushEvent(text){
  const ev = document.createElement('div');
  ev.className = 'ev';
  ev.textContent = `[${now()}] ${text}`;
  const container = document.getElementById('events');
  container.prepend(ev);
  // keep in localStorage
  const logs = JSON.parse(localStorage.getItem('gc_logs')||'[]');
  logs.unshift({t: Date.now(), text});
  localStorage.setItem('gc_logs', JSON.stringify(logs.slice(0,200)));
}

// ---- DOM update ----
function renderStatus(){
  document.getElementById('app-ignition').textContent = state.ignition? 'ON':'OFF';
  document.getElementById('app-speed').textContent = `${state.speed} km/h`;
  document.getElementById('app-immob').textContent = state.immobiliser? 'IMMOBILISED':'ALLOWED';

  document.getElementById('statSpeed').textContent = state.speed;
  document.getElementById('statIgn').textContent = state.ignition? 'ON':'OFF';
  document.getElementById('statImmo').textContent = state.immobiliser? 'IMMOBILISED':'ALLOWED';
  document.getElementById('statPending').textContent = state.pending? 'YES':'NO';
}

// ---- Simulated movement & map ----
let map, marker, poly;

function initMap(){
  map = L.map('map', {zoomControl:true}).setView([state.gps.lat, state.gps.lon], 14);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  marker = L.marker([state.gps.lat, state.gps.lon]).addTo(map);
  poly = L.polyline([[state.gps.lat, state.gps.lon]], {color:'#00d0ff'}).addTo(map);
}

function moveMarker(){
  // small drift when ignition on and speed>0
  if(state.ignition && state.speed>0){
    const dlat = (Math.random()-0.5) * (state.speed/10000);
    const dlon = (Math.random()-0.5) * (state.speed/10000);
    state.gps.lat += dlat;
    state.gps.lon += dlon;
    state.trail.push([state.gps.lat, state.gps.lon]);
    marker.setLatLng([state.gps.lat, state.gps.lon]);
    poly.setLatLngs(state.trail);
    map.panTo([state.gps.lat, state.gps.lon], {animate:true, duration:0.6});
  }
}

// ---- Simulation tick ----
function tick(){
  // pending immob auto-execute when stopped
  if(state.pending && state.speed <= 3){
    state.immobiliser = true;
    state.pending = false;
    pushEvent('Pending immobiliser executed (vehicle stopped)');
    toast('Immobiliser engaged (pending executed)');
  }

  // auto log
  renderStatus();
  moveMarker();
  saveState();
}

// ---- Fake "backend" persistence ----
function saveState(){
  localStorage.setItem('gc_state', JSON.stringify(state));
}
function loadState(){
  const s = JSON.parse(localStorage.getItem('gc_state')||'null');
  if(s) Object.assign(state, s);
}

// ---- Controls ----
document.addEventListener('DOMContentLoaded', ()=>{
  // initial load
  setTimeout(()=> {
    // hide loading overlay
    document.getElementById('loadingOverlay').style.display = 'none';
  }, 700);

  // init map after leaflet script loads
  setTimeout(()=> {
    if(document.getElementById('map')) initMap();
  }, 800);

  loadState();
  renderStatus();
  // buttons
  document.getElementById('btnToggleIgn').onclick = () => {
    state.ignition = !state.ignition;
    if(state.ignition){ pushEvent('Ignition turned ON'); toast('Ignition ON'); }
    else { pushEvent('Ignition turned OFF'); toast('Ignition OFF'); state.speed = 0; }
    renderStatus();
    saveState();
  };

  document.getElementById('btnSimSpeed').onclick = () => {
    if(!state.ignition){ toast('Turn ignition ON first'); return; }
    // simulate speed
    state.speed = Math.floor(Math.random()*90);
    pushEvent(`Speed updated to ${state.speed} km/h (simulated)`);
    // if speed>3 then queue pending immob if immobiliser toggle requests it
    renderStatus();
    saveState();
  };

  document.getElementById('btnToggleImmo').onclick = () => {
    // toggle immobiliser only when safe or allow force (demo)
    if(state.immobiliser){
      state.immobiliser = false;
      pushEvent('Immobiliser disabled (manual)');
      toast('Immobiliser disabled');
    } else {
      if(state.speed <= 3){
        state.immobiliser = true;
        pushEvent('Immobiliser enabled (manual, safe)');
        toast('Immobiliser engaged');
      } else {
        // queue pending
        state.pending = true;
        pushEvent('Immobiliser queued (pending while moving)');
        toast('Pending immobiliser queued');
      }
    }
    renderStatus();
    saveState();
  };

  document.getElementById('btnQueuePending').onclick = ()=>{
    if(state.speed > 3){
      state.pending = true;
      pushEvent('Pending immobiliser queued (manual)');
      toast('Pending queued');
    } else {
      state.immobiliser = true;
      pushEvent('Immobiliser engaged immediately (manual)');
      toast('Immobiliser engaged');
    }
    renderStatus(); saveState();
  };

  document.getElementById('btnClearLogs').onclick = ()=>{
    localStorage.removeItem('gc_logs');
    document.getElementById('events').innerHTML = '';
    toast('Logs cleared');
  };

  // login modal triggers
  document.getElementById('openLogin').onclick = ()=>{
    document.getElementById('loginModal').classList.remove('hidden');
  };
  document.getElementById('closeLogin').onclick = ()=>{
    document.getElementById('loginModal').classList.add('hidden');
  };

  // login form
  document.getElementById('loginForm').onsubmit = (e)=>{
    e.preventDefault();
    const u = document.getElementById('username').value.trim();
    const p = document.getElementById('password').value.trim();
    // simple demo auth
    if(u === 'admin' && p === 'admin123'){
      document.getElementById('adminPanel').classList.remove('hidden');
      document.getElementById('loginModal').classList.add('hidden');
      pushEvent('Admin logged in');
      toast('Admin access granted');
      drawCharts();
    } else if(u === 'user' && p === 'user123'){
      document.getElementById('loginModal').classList.add('hidden');
      pushEvent('User logged in');
      toast('User logged in');
    } else {
      toast('Invalid credentials (demo: admin/admin123 or user/user123)');
    }
  };

  // theme toggle
  document.getElementById('themeToggle').onclick = ()=>{
    document.documentElement.classList.toggle('light');
  };

  // export logs
  document.getElementById('btnExport').onclick = ()=>{
    const logs = localStorage.getItem('gc_logs') || '[]';
    const blob = new Blob([logs], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'guardiancar_logs.json'; a.click();
    URL.revokeObjectURL(url);
  };

  // load recent logs to UI
  const recent = JSON.parse(localStorage.getItem('gc_logs')||'[]');
  const evContainer = document.getElementById('events');
  recent.slice(0,50).forEach(l => {
    const el = document.createElement('div'); el.className='ev'; el.textContent = `[${new Date(l.t).toLocaleTimeString()}] ${l.text}`;
    evContainer.prepend(el);
  });

  // start tick
  setInterval(tick, 1200);
  setInterval(()=> {
    // small automatic drift if ignition on
    if(state.ignition && Math.random() > 0.6){
      state.speed = Math.max(0, state.speed + (Math.random()>0.5?5:-4));
      if(state.speed < 0) state.speed = 0;
    }
    renderStatus(); saveState();
  }, 3000);
});

// ---- Chart (admin) ----
function drawCharts(){
  const ctx = document.getElementById('chartSpeed').getContext('2d');
  // simulate a dataset from logs
  const logs = JSON.parse(localStorage.getItem('gc_logs') || '[]');
  const labels = [];
  const data = [];
  for(let i=0;i<20;i++){
    labels.push(`${i}m`);
    data.push(Math.floor(Math.random()*80));
  }
  new Chart(ctx, {
    type: 'line',
    data: { labels, datasets:[{ label:'Speed (km/h)', data, borderColor:'#00d0ff', tension:0.3 }]},
    options:{plugins:{legend:{display:false}}, responsive:true}
  });
}

// ---- auto-init: try to load and render saved state if present
window.addEventListener('load', ()=>{
  try{ loadState(); renderStatus(); }catch(e){}
});
