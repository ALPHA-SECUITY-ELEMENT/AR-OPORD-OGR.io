/* ============================================================
   REFORGER OP GENERATOR
   Terrain-agnostic. Region names are internal only — never
   rendered on the map or in the OPORD output. Locations carry
   the output. User edits persist to localStorage.
   ============================================================ */

const STORE_KEY = 'reforger.opgen.terrains.v4';
const SELECTED_KEY = 'reforger.opgen.selected.v1';

/* ---------- SPICES objective pool (Reforger-adapted) ---------- */
const SPICES = [
  'Rules of Engagement: less-than-lethal only',
  'Rules of Engagement: fire only if fired upon',
  'Rules of Engagement: minimize building damage',
  'Full stealth required - no detection',
  'Leave no trace - hide bodies, clean sites',
  'Hit two objectives simultaneously',
  'Plant beacon on vehicle/crate, follow the delivery',
  'Interrogation only - capture, don\'t kill',
  'Electronic warfare - disrupt comms/radar',
  'Disinformation - plant false intel on enemy net',
  'EOD - identify and disarm IEDs on route',
  'Humanitarian aid - deliver supplies, protect civilians',
  'Convoy operation - travel and protect',
  'Survival mode - start pistol-only',
  'Time limit - complete before X event',
  'Equipment restriction - no NVGs',
  'Equipment restriction - no suppressors',
  'Equipment restriction - specific weapons only',
  'Road ambush on enemy - C4, mines, EMP',
  'No-fly zone - ground vehicles only',
  'Covert with indigenous gear - low-profile dress',
  'Investigate smuggling at location',
  'SCUBA / HELOCAST infil (near water)',
  'Extract HVT alive for interrogation',
  'Take down HVT - stage as accident',
  'Drone patrol at objectives',
  'Wiretap enemy comms - undetected',
  'Ground assault - APC / armor',
  'Strike designator - CAS on demand',
  'Aerial assault - attack helicopters',
  'Sabotage vehicle or equipment',
  'Hack an equipment / terminal',
  'Save civilians',
  'Acquire intel'
];

/* ---------- Seed terrains ---------- */
const SEED = {
  terrains: [
    {
      id: 'takistan',
      displayName: 'Takistan Conflict',
      mapImage: 'maps/takistan.jpg',
      regions: [
        { id:'r01',  name:'MAINE',         x:0.12, y:0.21, locations:['FOB Thunderbolt'] },
        { id:'r02',  name:'WASHINGTON',    x:0.36, y:0.22, locations:['Upper Kandaru','Pech Valley'] },
        { id:'r03',  name:'OHIO',          x:0.53, y:0.11, locations:['Factory','Noori'] },
        { id:'r04',  name:'NEVADA',        x:0.62, y:0.20, locations:['Tantil'] },
        { id:'r05',  name:'VERMONT',       x:0.75, y:0.29, locations:['Bar Kanday'] },
        { id:'r06',  name:'CONNECTICUT',   x:0.97, y:0.31, locations:['Khan Abad'] },
        { id:'r07',  name:'DELAWARE',      x:0.20, y:0.37, locations:['Kandar'] },
        { id:'r08',  name:'ALABAMA',       x:0.41, y:0.42, locations:['Son Tantil','Tower'] },
        { id:'r09',  name:'MASSACHUSETTS', x:0.69, y:0.40, locations:['Kandagal'] },
        { id:'r10',  name:'MARYLAND',      x:0.25, y:0.53, locations:['OP Phoenix'] },
        { id:'r11',  name:'MISSISSIPPI',   x:0.57, y:0.56, locations:['Korengal Outpost','Tower'] },
        { id:'r12',  name:'WYOMING',       x:0.80, y:0.56, locations:['Salar Ban','Tower'] },
        { id:'r13',  name:'ALASKA',        x:0.97, y:0.60, locations:['Geyiksuyu'] },
        { id:'r14',  name:'KENTUCKY',      x:0.22, y:0.67, locations:['AshatKot'] },
        { id:'r15',  name:'ILLINOIS',      x:0.45, y:0.68, locations:['OP Restrepo','Korengal Valley'] },
        { id:'r16',  name:'MISSOURI',      x:0.97, y:0.72, locations:['Gulhay'] },
        { id:'r17',  name:'MICHIGAN',      x:0.28, y:0.80, locations:['Ashat'] },
        { id:'r18',  name:'IDAHO',         x:0.41, y:0.78, locations:['OP Dallas'] },
        { id:'r19',  name:'WISCONSIN',     x:0.50, y:0.79, locations:['Landigal'] },
        { id:'r20',  name:'COLORADO',      x:0.71, y:0.75, locations:['Chichal'] },
        { id:'r21',  name:'TEXAS',         x:0.86, y:0.83, locations:['Kharka Dahy'] }
      ]
    },
    {
      id: 'ruha',
      displayName: 'Ruha Conflict',
      mapImage: 'maps/ruha.jpg',
      regions: [
        { id:'r01', name:'MICHIGAN',     x:0.60, y:0.14, locations:['Kaaranmannikko','Murtimaki','Kumuri'] },
        { id:'r02', name:'MONTANA',      x:0.28, y:0.23, locations:['Pihlajamaki','Hurnhuhta','Lansikyla Sawmill'] },
        { id:'r03', name:'NEBRASKA',     x:0.09, y:0.22, locations:['Pihlajamaa'] },
        { id:'r04', name:'OHIO',         x:0.60, y:0.04, locations:['MOB North','Tervasmaki','Kortesoja'] },
        { id:'r05', name:'PENNSYLVANIA', x:0.58, y:0.26, locations:['Hietala','Uivila','Ruhanpera'] },
        { id:'r06', name:'MAINE',        x:0.07, y:0.37, locations:['Marjasalo','Mikinneva'] },
        { id:'r07', name:'ARKANSAS',     x:0.47, y:0.44, locations:['Ruha','Isomaki','Nyrhilanmaki'] },
        { id:'r08', name:'IDAHO',        x:0.22, y:0.47, locations:['Ohmenluoma','Hyyppa'] },
        { id:'r09', name:'DELAWARE',     x:0.07, y:0.62, locations:['Vuorenmaanloukko','Ojalankyla','Takala'] },
        { id:'r10', name:'LOUISIANA',    x:0.52, y:0.57, locations:['Latvamuilu','Latvamuilu Kontolanmaki','Muliunkyla'] },
        { id:'r11', name:'VERMONT',      x:0.62, y:0.53, locations:['Lehto','Valimaki'] },
        { id:'r12', name:'OKLAHOMA',     x:0.30, y:0.75, locations:['Koskelankyla','Hietalanmaki'] },
        { id:'r13', name:'CALIFORNIA',   x:0.50, y:0.72, locations:['Virpimaki','Korvenoja','Korpil'] },
        { id:'r14', name:'TEXAS',        x:0.17, y:0.91, locations:['MOB South','Kantola','Hiidenmaki','Martikkalankyla'] },
        { id:'r15', name:'IOWA',         x:0.65, y:0.87, locations:['Metsala','Metsala Office'] }
      ]
    },
    {
      id: 'everon',
      displayName: 'Everon (vanilla)',
      mapImage: 'maps/everon.jpg',
      regions: [
        { id:'r01', name:'Morton',         x:0.55, y:0.55, locations:['Airfield','Harbor','Fuel Depot'] },
        { id:'r02', name:'Levie',          x:0.48, y:0.42, locations:['Town','Bridge','Church'] },
        { id:'r03', name:'Montignac',      x:0.62, y:0.36, locations:['Village','Farm'] },
        { id:'r04', name:'Entre-Deux',     x:0.42, y:0.60, locations:['Hamlet','Fork'] },
        { id:'r05', name:'Saint-Philippe', x:0.58, y:0.72, locations:['Village','Coast'] },
        { id:'r06', name:'Provins',        x:0.34, y:0.50, locations:['Town','Forest Edge'] },
        { id:'r07', name:'Lac Maf',        x:0.70, y:0.20, locations:['Lake Shore','Dam'] },
        { id:'r08', name:'Quarry',         x:0.80, y:0.55, locations:['Quarry Pit','Loaders'] }
      ]
    }
  ]
};

/* ---------- State ---------- */
let state = loadState();
let selectedRegions = loadSelected();
let lastOp = null;
let editSelectedRegionId = null;

/* ---------- Persistence ---------- */
function loadState(){
  try{
    const raw = localStorage.getItem(STORE_KEY);
    if(!raw) return structuredClone(SEED);
    const parsed = JSON.parse(raw);
    if(!parsed || !Array.isArray(parsed.terrains)) return structuredClone(SEED);
    return parsed;
  }catch(e){ return structuredClone(SEED); }
}
function saveState(){ localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
function loadSelected(){
  try{ return JSON.parse(localStorage.getItem(SELECTED_KEY)) || {}; }catch(e){ return {}; }
}
function saveSelected(){ localStorage.setItem(SELECTED_KEY, JSON.stringify(selectedRegions)); }

/* ---------- DOM helpers ---------- */
const $ = (id)=>document.getElementById(id);
const el = (tag, opts={})=>{
  const n = document.createElement(tag);
  if(opts.cls) n.className = opts.cls;
  if(opts.text) n.textContent = opts.text;
  if(opts.html) n.innerHTML = opts.html;
  if(opts.on) for(const [k,v] of Object.entries(opts.on)) n.addEventListener(k,v);
  return n;
};

/* ---------- Tabs ---------- */
document.querySelectorAll('.tabs button').forEach(b=>{
  b.addEventListener('click',()=>{
    document.querySelectorAll('.tabs button').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    ['gen','edit','data'].forEach(t=>{
      $('tab-'+t).classList.toggle('hidden', t!==b.dataset.tab);
      $('view-'+t).classList.toggle('hidden', t!==b.dataset.tab);
    });
    if(b.dataset.tab==='data') renderData();
  });
});

/* ---------- Terrain selectors ---------- */
function currentTerrain(){
  const id = $('terrainSel').value;
  return state.terrains.find(t=>t.id===id) || state.terrains[0];
}
function editTerrain(){
  const id = $('editTerrainSel').value;
  return state.terrains.find(t=>t.id===id) || state.terrains[0];
}
function renderTerrainSelects(){
  const genSel = $('terrainSel'), editSel = $('editTerrainSel');
  const prevGen = genSel.value, prevEdit = editSel.value;
  genSel.innerHTML = ''; editSel.innerHTML = '';
  state.terrains.forEach(t=>{
    const og = el('option',{text:t.displayName});
    og.value = t.id;
    genSel.appendChild(og);
    const oe = el('option',{text:t.displayName});
    oe.value = t.id;
    editSel.appendChild(oe);
  });
  if(state.terrains.find(t=>t.id===prevGen)) genSel.value = prevGen;
  if(state.terrains.find(t=>t.id===prevEdit)) editSel.value = prevEdit;
  genSel.value = genSel.value || state.terrains[0]?.id;
  editSel.value = editSel.value || state.terrains[0]?.id;
}

$('terrainSel').addEventListener('change',()=>{
  loadTerrainIntoUI(true);
  renderRegionList(true);
  renderMapPins(true);
  $('genOut').textContent = 'Select regions and hit Generate.';
  $('genMeta').textContent = '';
});
$('editTerrainSel').addEventListener('change',()=>{
  loadTerrainIntoUI(false);
  renderRegionList(false);
  renderMapPins(false);
});

/* ---------- Region list (names hidden — numbered label) ---------- */
function regionLabel(t, r){
  return 'Region ' + String(t.regions.indexOf(r)+1).padStart(2,'0');
}

function renderRegionList(isGen){
  const t = isGen ? currentTerrain() : editTerrain();
  const list = isGen ? $('regionList') : $('editRegionList');
  list.innerHTML = '';
  if(!t || !t.regions.length){
    list.appendChild(el('div',{cls:'empty',
      text: isGen?'No regions - edit terrain to add.':'No regions. Click map to add.'}));
    return;
  }
  const sel = isGen ? (selectedRegions[t.id] || []) : null;
  t.regions.forEach(r=>{
    const row = el('div',{text: regionLabel(t, r)});
    row.title = r.name; // internal name on hover only
    if(isGen && sel.includes(r.id)) row.classList.add('on');
    row.addEventListener('click',()=>{
      if(isGen){
        const arr = selectedRegions[t.id] ||= [];
        const i = arr.indexOf(r.id);
        if(i>=0) arr.splice(i,1); else arr.push(r.id);
        saveSelected();
        renderRegionList(true);
        renderMapPins(true);
      } else {
        editSelectedRegionId = r.id;
        renderRegionList(false);
        renderMapPins(false);
        loadRegionIntoEditor();
      }
    });
    list.appendChild(row);
  });
  if(!isGen && editSelectedRegionId && !t.regions.find(r=>r.id===editSelectedRegionId)){
    editSelectedRegionId = null;
  }
}

/* ---------- Map renderer (no names rendered) ---------- */
function renderMapPins(isGen){
  const t = isGen ? currentTerrain() : editTerrain();
  const img = isGen ? $('genMap') : $('editMap');
  const wrap = isGen ? $('genMapWrap') : $('editMapWrap');
  const overlay = isGen ? $('genOverlay') : $('editOverlay');
  const urlInput = isGen ? $('mapUrl') : $('editMapUrl');
  if(!t){ overlay.innerHTML=''; return; }
  const src = (urlInput.value || '').trim() || t.mapImage || '';
  overlay.innerHTML = '';

  function drawPins(){
    const sel = isGen ? (selectedRegions[t.id] || []) : null;
    t.regions.forEach(r=>{
      const p = el('div',{cls:'pin'});
      p.style.left = (r.x*100)+'%';
      p.style.top  = (r.y*100)+'%';
      if(isGen && sel.includes(r.id)) p.classList.add('on');
      if(!isGen && editSelectedRegionId===r.id) p.classList.add('edit');
      // numeric label only — region name never rendered
      p.appendChild(el('span',{cls:'lbl',text: regionLabel(t, r)}));
      p.addEventListener('click',(e)=>{
        e.stopPropagation();
        if(isGen){
          const arr = selectedRegions[t.id] ||= [];
          const i = arr.indexOf(r.id);
          if(i>=0) arr.splice(i,1); else arr.push(r.id);
          saveSelected();
          renderRegionList(true);
          drawPins();
        } else {
          editSelectedRegionId = r.id;
          renderRegionList(false);
          renderMapPins(false);
          loadRegionIntoEditor();
        }
      });
      if(!isGen) makeDraggable(p, t, r);
      overlay.appendChild(p);
    });
  }

  const probe = new Image();
  probe.onload = ()=>{
    img.src = src; img.style.display = 'block';
    wrap.classList.remove('no-img');
    drawPins();
  };
  probe.onerror = ()=>{
    img.style.display = 'none'; img.removeAttribute('src');
    wrap.classList.add('no-img');
    drawPins();
  };
  if(src) probe.src = src; else probe.onerror();

  if(!isGen){
    overlay.onclick = (e)=>{
      if(e.target !== overlay) return;
      const rect = overlay.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const name = prompt('Internal label (hidden on map):');
      if(!name) return;
      const id = 'r' + String(t.regions.length+1).padStart(2,'0');
      t.regions.push({ id, name, x, y, locations:[] });
      saveState();
      editSelectedRegionId = id;
      renderRegionList(false);
      renderMapPins(false);
      loadRegionIntoEditor();
      $('editStatus').textContent = 'Added '+regionLabel(t, t.regions[t.regions.length-1])+'.';
    };
  }
}

function makeDraggable(pin, terrain, region){
  let dragging = false, moved = false;
  pin.addEventListener('mousedown',(e)=>{
    e.preventDefault();
    dragging = true; moved = false;
    const overlay = pin.parentElement;
    const rect = overlay.getBoundingClientRect();
    const move = (ev)=>{
      if(!dragging) return;
      moved = true;
      const x = Math.max(0,Math.min(1,(ev.clientX-rect.left)/rect.width));
      const y = Math.max(0,Math.min(1,(ev.clientY-rect.top)/rect.height));
      region.x = x; region.y = y;
      pin.style.left = (x*100)+'%';
      pin.style.top  = (y*100)+'%';
    };
    const up = ()=>{
      dragging = false;
      document.removeEventListener('mousemove',move);
      document.removeEventListener('mouseup',up);
      if(moved){ saveState(); renderData(); }
    };
    document.addEventListener('mousemove',move);
    document.addEventListener('mouseup',up);
  });
}

/* ---------- Terrain editor ---------- */
function loadTerrainIntoUI(isGen){
  const t = isGen ? currentTerrain() : editTerrain();
  if(!t) return;
  if(isGen){
    $('terrainLabel').textContent = t.displayName + ' - ' + t.regions.length + ' regions';
    $('mapUrl').value = '';
    $('mapUrl').placeholder = t.mapImage || 'maps/terrain.jpg';
  } else {
    $('editTerrainName').value = t.displayName;
    $('editMapUrl').value = t.mapImage || '';
  }
}
function loadRegionIntoEditor(){
  const t = editTerrain();
  const r = t?.regions.find(x=>x.id===editSelectedRegionId);
  if(!r){ $('editRegionName').value = ''; $('editRegionLocations').value = ''; return; }
  $('editRegionName').value = r.name;
  $('editRegionLocations').value = (r.locations||[]).join('\n');
}
$('editRegionName').addEventListener('input',()=>{
  const t = editTerrain();
  const r = t?.regions.find(x=>x.id===editSelectedRegionId);
  if(!r) return;
  r.name = $('editRegionName').value;
  saveState();
  renderRegionList(false);
  renderMapPins(false);
});
$('editRegionLocations').addEventListener('input',()=>{
  const t = editTerrain();
  const r = t?.regions.find(x=>x.id===editSelectedRegionId);
  if(!r) return;
  r.locations = $('editRegionLocations').value.split('\n').map(s=>s.trim()).filter(Boolean);
  saveState();
});
$('editTerrainName').addEventListener('input',()=>{
  const t = editTerrain();
  if(!t) return;
  t.displayName = $('editTerrainName').value;
  saveState();
  renderTerrainSelects();
  loadTerrainIntoUI(true);
  loadTerrainIntoUI(false);
});
$('editMapUrl').addEventListener('input',()=>{
  const t = editTerrain();
  if(!t) return;
  t.mapImage = $('editMapUrl').value;
  saveState();
  renderMapPins(false);
});
$('addRegionBtn').addEventListener('click',()=>{
  const t = editTerrain();
  if(!t) return;
  const name = prompt('Internal label (hidden on map):');
  if(!name) return;
  const id = 'r' + String(t.regions.length+1).padStart(2,'0');
  t.regions.push({ id, name, x:0.5, y:0.5, locations:[] });
  saveState();
  editSelectedRegionId = id;
  renderRegionList(false);
  renderMapPins(false);
  loadRegionIntoEditor();
});
$('delRegionBtn').addEventListener('click',()=>{
  const t = editTerrain();
  if(!t || !editSelectedRegionId) return;
  const idx = t.regions.findIndex(r=>r.id===editSelectedRegionId);
  if(idx<0) return;
  if(!confirm('Delete '+regionLabel(t, t.regions[idx])+'?')) return;
  t.regions.splice(idx,1);
  saveState();
  editSelectedRegionId = null;
  renderRegionList(false);
  renderMapPins(false);
  loadRegionIntoEditor();
});
$('newTerrainBtn').addEventListener('click',()=>{
  const name = prompt('Terrain display name:');
  if(!name) return;
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');
  if(state.terrains.find(t=>t.id===id)){ alert('Terrain id already exists.'); return; }
  state.terrains.push({ id, displayName:name, mapImage:'', regions:[] });
  saveState();
  renderTerrainSelects();
  $('editTerrainSel').value = id;
  $('terrainSel').value = id;
  loadTerrainIntoUI(false); loadTerrainIntoUI(true);
  renderRegionList(false); renderMapPins(false);
});
$('delTerrainBtn').addEventListener('click',()=>{
  const t = editTerrain();
  if(!t) return;
  if(state.terrains.length<=1){ alert('Need at least one terrain.'); return; }
  if(!confirm('Delete terrain "'+t.displayName+'" and all its regions?')) return;
  state.terrains = state.terrains.filter(x=>x.id!==t.id);
  saveState();
  renderTerrainSelects();
  loadTerrainIntoUI(false); loadTerrainIntoUI(true);
  renderRegionList(false); renderRegionList(true);
  renderMapPins(false); renderMapPins(true);
});
$('exportBtn').addEventListener('click',()=>{
  const blob = new Blob([JSON.stringify(state,null,2)],{type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'terrains.json';
  a.click();
  $('editStatus').textContent = 'Exported terrains.json';
});
$('importBtn').addEventListener('click',()=>$('importFile').click());
$('importFile').addEventListener('change',(e)=>{
  const f = e.target.files[0]; if(!f) return;
  const fr = new FileReader();
  fr.onload = ()=>{
    try{
      const parsed = JSON.parse(fr.result);
      if(!parsed.terrains) throw new Error('missing terrains array');
      state = parsed;
      saveState();
      renderTerrainSelects();
      loadTerrainIntoUI(false); loadTerrainIntoUI(true);
      renderRegionList(false); renderRegionList(true);
      renderMapPins(false); renderMapPins(true);
      $('editStatus').textContent = 'Imported.';
    }catch(err){ $('editStatus').textContent = 'Import failed: '+err.message; }
  };
  fr.readAsText(f);
});

/* ---------- SPICES chips ---------- */
function renderSpiceChips(){
  const wrap = $('spiceChips');
  wrap.innerHTML = '';
  SPICES.forEach((s,i)=>{
    const c = el('span',{cls:'chip',text:s});
    c.dataset.i = i;
    c.addEventListener('click',()=>c.classList.toggle('on'));
    wrap.appendChild(c);
  });
}

/* ---------- RNG ---------- */
function mulberry32(a){
  return function(){
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function pick(rng, arr){ return arr[Math.floor(rng()*arr.length)]; }

/* ---------- Generator ---------- */
$('genBtn').addEventListener('click',()=>{
  const t = currentTerrain();
  if(!t){ $('genStatus').textContent = 'No terrain.'; return; }
  const sel = selectedRegions[t.id] || [];
  if(!sel.length){ $('genStatus').textContent = 'Pick at least one region.'; return; }
  const count = Math.max(1, Math.min(20, parseInt($('objCount').value)||4));
  const faction = $('factionSel').value;
  const spices = [...document.querySelectorAll('#spiceChips .chip.on')].map(c=>c.textContent);
  const seed = Date.now();
  const rng = mulberry32(seed);

  const chosenRegions = t.regions.filter(r=>sel.includes(r.id));
  const objectives = [];
  for(let i=0;i<count;i++){
    const r = pick(rng, chosenRegions);
    const locs = (r.locations && r.locations.length) ? r.locations : ['Objective Site'];
    const loc = pick(rng, locs);
    const objType = pick(rng, SPICES);
    const coord = (r.x*100).toFixed(1)+'% / '+(r.y*100).toFixed(1)+'%';
    objectives.push({ location:loc, type:objType, coord });
  }

  const op = {
    seed, terrain:t.displayName, faction,
    regionCount: chosenRegions.length,
    objectives, spices
  };
  lastOp = op;

  $('genOut').textContent = buildOPORD(op);
  $('genMeta').innerHTML =
    '<span class="badge">seed '+seed+'</span>'+
    '<span class="badge">'+t.displayName+'</span>'+
    '<span class="badge">'+faction+'</span>'+
    '<span class="badge">'+objectives.length+' objectives</span>'+
    (spices.length?'<span class="badge">'+spices.length+' SPICES</span>':'');
  $('genStatus').textContent = 'Generated.';
});

function buildOPORD(op){
  const lines = [];
  lines.push('OPERATION ORDER');
  lines.push('='.repeat(60));
  lines.push('TERRAIN    : '+op.terrain);
  lines.push('FACTION    : '+op.faction);
  lines.push('SEED       : '+op.seed);
  lines.push('AO         : '+op.regionCount+' region(s) selected');
  lines.push('');
  lines.push('1. SITUATION');
  lines.push('   Enemy forces operate throughout the AO.');
  lines.push('   Friendly element: one squad, insert method at commander discretion.');
  lines.push('');
  lines.push('2. MISSION');
  lines.push('   Conduct the following objectives in the AO:');
  op.objectives.forEach((o,i)=>{
    lines.push('   '+String(i+1).padStart(2)+'. '+o.location+' - '+o.type);
    lines.push('       grid '+o.coord);
  });
  lines.push('');
  lines.push('3. EXECUTION');
  lines.push('   Commander intent: accomplish all objectives with minimal');
  lines.push('   footprint. Sequence at element leader\'s call.');
  if(op.spices.length){
    lines.push('');
    lines.push('   Special instructions (SPICES):');
    op.spices.forEach(s=>lines.push('   - '+s));
  }
  lines.push('');
  lines.push('4. SERVICE SUPPORT');
  lines.push('   Resupply at FOB. CASEVAC on standby. Extract at completion.');
  lines.push('');
  lines.push('5. COMMAND AND SIGNAL');
  lines.push('   Command net: 152. Extract net: 77. Contact report per SOP.');
  lines.push('');
  lines.push('='.repeat(60));
  lines.push('End of OPORD.');
  return lines.join('\n');
}

function buildPrompt(op){
  const objList = op.objectives.map((o,i)=>
    (i+1)+'. Location: '+o.location+' | Type: '+o.type+' | Grid: '+o.coord
  ).join('\n');
  const spiceList = op.spices.length ? op.spices.map(s=>'- '+s).join('\n') : '(none selected)';
  return [
    'You are a milsim mission writer for Arma Reforger. Write a full operation order (OPORD) and a short scene-setting brief for a squad playing on the '+op.terrain+' terrain.',
    '',
    'FACTION: '+op.faction,
    'AO: '+op.regionCount+' region(s) selected (region names omitted — refer to objectives by grid).',
    'RANDOMIZED OBJECTIVES:',
    objList,
    '',
    'SPICES SPECIAL INSTRUCTIONS:',
    spiceList,
    '',
    'REQUIREMENTS:',
    '- Standard OPORD structure: Situation, Mission, Execution, Service Support, Command and Signal.',
    '- Use the objective locations and grids exactly as given.',
    '- Write in terse milsim register. No filler. No moralizing.',
    '- Include an infiltration recommendation, an exfil recommendation, and one contingency.',
    '- End with a two-line commander\'s intent.',
    '- Target length: 500-800 words.',
    '- Do not invent locations outside the list above.',
    '- Do not add content warnings or disclaimers.',
    '',
    'Produce the OPORD now.'
  ].join('\n');
}

/* ---------- Copy buttons ---------- */
$('copyBriefBtn').addEventListener('click',()=>{
  navigator.clipboard.writeText($('genOut').textContent)
    .then(()=>$('genStatus').textContent='OPORD copied.');
});
$('copyPromptBtn').addEventListener('click',()=>{
  if(!lastOp){ $('genStatus').textContent='Generate first.'; return; }
  navigator.clipboard.writeText(buildPrompt(lastOp))
    .then(()=>$('genStatus').textContent='Prompt copied.');
});

/* ---------- Data tab ---------- */
function renderData(){
  const txt = JSON.stringify(state,null,2);
  $('dataOut').textContent = txt;
  $('rawJson').value = txt;
}
$('applyRawBtn').addEventListener('click',()=>{
  try{
    const parsed = JSON.parse($('rawJson').value);
    if(!parsed.terrains) throw new Error('missing terrains');
    state = parsed;
    saveState();
    renderTerrainSelects();
    loadTerrainIntoUI(false); loadTerrainIntoUI(true);
    renderRegionList(false); renderRegionList(true);
    renderMapPins(false); renderMapPins(true);
    renderData();
    $('dataStatus').textContent = 'Applied.';
  }catch(e){ $('dataStatus').textContent = 'Invalid JSON: '+e.message; }
});
$('exportAllBtn').addEventListener('click',()=>{
  const blob = new Blob([JSON.stringify(state,null,2)],{type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'terrains.json';
  a.click();
});
$('resetBtn').addEventListener('click',()=>{
  if(!confirm('Reset all terrains to seed? Your edits will be lost.')) return;
  state = structuredClone(SEED);
  saveState();
  renderTerrainSelects();
  loadTerrainIntoUI(false); loadTerrainIntoUI(true);
  renderRegionList(false); renderRegionList(true);
  renderMapPins(false); renderMapPins(true);
  renderData();
});

/* ---------- Boot ---------- */
function boot(){
  renderTerrainSelects();
  renderSpiceChips();
  loadTerrainIntoUI(true); loadTerrainIntoUI(false);
  renderRegionList(true); renderRegionList(false);
  renderMapPins(true); renderMapPins(false);
  renderData();
}
boot();