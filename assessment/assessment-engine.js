// ============================================================
// DMA Business Readiness Assessment — Engine
// ============================================================

const CATEGORIES = [
  {id:'proc',  name:'Processes',           short:'Processes',   why:'Automations need something repeatable to automate.'},
  {id:'data',  name:'Data',                short:'Data',        why:'Automation and AI are only as good as the data you feed them.'},
  {id:'tech',  name:'Tech Stack',          short:'Tech Stack',  why:'If your tools don\'t talk, nothing can plug between them.'},
  {id:'team',  name:'Team & Skills',       short:'Team',        why:'The humans closest to the work decide whether automation sticks.'},
  {id:'labor', name:'Labor Inventory',     short:'Labor',       why:'Knowing where time goes tells us what\'s worth automating first.'},
  {id:'lead',  name:'Leadership & Culture',short:'Leadership',  why:'Buy-in and patience for the payoff curve make or break the program.'},
];

const QUESTIONS = [
  // Processes
  {cat:'proc', text:'How documented are your core operating procedures?', hint:'Think of the top handful of workflows that run your business day-to-day.',
    options:[{t:'Mostly in people\'s heads',score:0},{t:'Some written down, scattered',score:1},{t:'A handbook exists, partially current',score:2},{t:'Most are documented and actively maintained',score:3},{t:'Fully documented, versioned, measured',score:4}]},
  {cat:'proc', text:'How often do processes get updated when something changes?',
    options:[{t:'Rarely — docs drift fast',score:0},{t:'When someone complains',score:1},{t:'Quarterly reviews',score:2},{t:'As-needed, with ownership',score:3},{t:'Continuously, with a change log',score:4}]},
  {cat:'proc', text:'How consistently is the same job done the same way across people?',
    options:[{t:'Every person has their own way',score:0},{t:'A few common patterns',score:1},{t:'Mostly similar, some variance',score:2},{t:'Standardized with exceptions',score:3},{t:'Fully standardized and audited',score:4}]},
  {cat:'proc', text:'Are your most important processes measured?', hint:'Things like: how long does it take? how often do we make mistakes? how much do we get done?',
    options:[{t:'We don\'t measure anything',score:0},{t:'We go by gut feel',score:1},{t:'We spot-check occasionally',score:2},{t:'We get regular reports on a few',score:3},{t:'Live dashboards for everything important',score:4}]},
  // Data
  {cat:'data', text:'How easy is it to get the data you need when you need it?', hint:'Can someone pull a clean report without having to ask IT or wait days?',
    options:[{t:'It\'s all in people\'s heads or notebooks',score:0},{t:'Spread across spreadsheets',score:1},{t:'Scattered across tools — but we can export it',score:2},{t:'All in one place, we can run reports',score:3},{t:'Live and available on demand',score:4}]},
  {cat:'data', text:'How clean and trustworthy is the data inside your core systems?',
    options:[{t:'We don\'t trust it',score:0},{t:'We trust it for some things',score:1},{t:'Mostly trustworthy, with caveats',score:2},{t:'Clean with known exceptions',score:3},{t:'Actively governed and audited',score:4}]},
  {cat:'data', text:'When you look up a customer or job, does everyone see the same info?', hint:'Or does the answer depend on which system — or which person — you ask?',
    options:[{t:'No — depends who you ask',score:0},{t:'Multiple systems that drift apart daily',score:1},{t:'Multiple systems, mostly in sync',score:2},{t:'One main source, a few copies',score:3},{t:'Yes — one trusted system, always',score:4}]},
  {cat:'data', text:'How long does it take to answer a basic business question with data?',
    options:[{t:'Days — or we don\'t bother',score:0},{t:'Several hours of pulling',score:1},{t:'About an hour',score:2},{t:'A few minutes in a dashboard',score:3},{t:'Instant — it\'s on a wall somewhere',score:4}]},
  // Tech
  {cat:'tech', text:'Can your core software tools talk to each other?', hint:'Tools that "talk" can send data back and forth automatically — no copy-paste needed.',
    options:[{t:'No — they\'re all separate islands',score:0},{t:'One or two can connect',score:1},{t:'Some can connect',score:2},{t:'Most can connect',score:3},{t:'All of them connect cleanly',score:4}]},
  {cat:'tech', text:'How often does your team re-enter the same data into different tools?',
    options:[{t:'Constantly',score:0},{t:'Daily',score:1},{t:'Weekly',score:2},{t:'Rarely',score:3},{t:'Never — everything\'s wired',score:4}]},
  {cat:'tech', text:'How solid is your cybersecurity and account-access hygiene?', hint:'Things like: who can log into what, password practices, and whether your data is being backed up.',
    options:[{t:'Loose — shared passwords, no rules',score:0},{t:'Each person has their own login',score:1},{t:'Different access levels by role',score:2},{t:'Single sign-on, two-factor, regular backups',score:3},{t:'Formal security program with audits',score:4}]},
  {cat:'tech', text:'Who can make small tech changes or connect tools together when needed?',
    options:[{t:'No one on our team',score:0},{t:'Only an outside vendor',score:1},{t:'One overloaded person',score:2},{t:'A small capable team',score:3},{t:'A full internal tech team',score:4}]},
  // Team
  {cat:'team', text:'How familiar is your team with AI tools (ChatGPT, Claude, Copilot, etc.)?',
    options:[{t:'Almost no one uses them',score:0},{t:'A handful experimenting',score:1},{t:'Half the team dabbles',score:2},{t:'Most people use them weekly',score:3},{t:'Daily and integrated into work',score:4}]},
  {cat:'team', text:'How open is your team to changing how they work?',
    options:[{t:'Strong resistance',score:0},{t:'Cautious — needs convincing',score:1},{t:'Mixed — some eager, some not',score:2},{t:'Generally willing',score:3},{t:'Actively pushing for change',score:4}]},
  {cat:'team', text:'Do you have someone internal who could own an automation project?',
    options:[{t:'No',score:0},{t:'Someone could if we freed them up',score:1},{t:'Yes, but part-time',score:2},{t:'Yes, dedicated at least half-time',score:3},{t:'Yes, a full-time lead',score:4}]},
  {cat:'team', text:'How well does your team understand what AI can and can\'t do today?',
    options:[{t:'Mostly hype or fear',score:0},{t:'Broad awareness, little depth',score:1},{t:'Some realistic understanding',score:2},{t:'Practical, with boundaries',score:3},{t:'Nuanced, tool-selection-level',score:4}]},
  // Labor
  {cat:'labor', text:'Do you know which tasks eat the most labor hours each week?',
    options:[{t:'Not really',score:0},{t:'Rough intuition',score:1},{t:'A list we\'ve discussed',score:2},{t:'Documented with hour estimates',score:3},{t:'Measured with time-tracking data',score:4}]},
  {cat:'labor', text:'How much of the weekly work is repetitive and rule-based?',
    options:[{t:'Almost none — it\'s all judgment',score:0},{t:'Some, hard to extract',score:1},{t:'A meaningful chunk',score:2},{t:'A lot — we feel it daily',score:3},{t:'Majority — we\'re drowning in it',score:4}]},
  {cat:'labor', text:'Where is the biggest time sink right now?', hint:'We\'ll ask more detail later — just your gut call.',
    options:[{t:'Data entry & reconciliation',score:2},{t:'Reporting & spreadsheets',score:2},{t:'Customer email & messaging',score:2},{t:'Scheduling & coordination',score:2},{t:'Quoting / invoicing / billing',score:2}]},
  {cat:'labor', text:'Have you ever calculated what repetitive work costs you per year?',
    options:[{t:'Never',score:0},{t:'A rough guess',score:1},{t:'A back-of-envelope number',score:2},{t:'Yes — documented',score:3},{t:'Yes, and tracked month-to-month',score:4}]},
  // Leadership
  {cat:'lead', text:'How bought-in is leadership on investing in automation / AI?',
    options:[{t:'Skeptical',score:0},{t:'Curious, not committed',score:1},{t:'Willing to try small',score:2},{t:'Actively sponsoring it',score:3},{t:'It\'s a named strategic priority',score:4}]},
  {cat:'lead', text:'Is there budget available for an initial pilot (3–6 months)?',
    options:[{t:'No budget',score:0},{t:'Need to carve from elsewhere',score:1},{t:'Some discretionary funds',score:2},{t:'Yes, allocated for this year',score:3},{t:'Multi-year budget committed',score:4}]},
  {cat:'lead', text:'How does leadership handle the 3–6 month payoff curve most automations require?',
    options:[{t:'Needs to see value in weeks',score:0},{t:'Impatient, but persuadable',score:1},{t:'Cautiously patient',score:2},{t:'Comfortable with a quarter or two',score:3},{t:'Thinks in 1–3 year horizons',score:4}]},
  {cat:'lead', text:'How clear is your vision for what automation should achieve?',
    options:[{t:'Not clear — exploring',score:0},{t:'A few wishes, no plan',score:1},{t:'Goals, no KPIs',score:2},{t:'Clear goals with metrics',score:3},{t:'Strategy with phased roadmap',score:4}]},
  {cat:'lead', text:'How does your culture respond when a pilot fails or needs to pivot?',
    options:[{t:'People lose jobs over failures',score:0},{t:'Blame before learning',score:1},{t:'Tolerated but not celebrated',score:2},{t:'Treated as learning',score:3},{t:'Actively encouraged experimentation',score:4}]},
];

const TIERS = [
  {name:'Beginner',   min:0,  max:39, desc:'You\'re early. The foundations (documented processes, clean data, willing team) need work before automation will stick. Start there.'},
  {name:'Developing', min:40, max:64, desc:'You\'ve got real foundations. A few targeted fixes unlock meaningful gains — you\'re well-positioned to pilot automation within a quarter.'},
  {name:'Ready',      min:65, max:84, desc:'You\'re ready to move. Your data, team, and leadership can sustain real automation work — it\'s time to pick the first 2–3 high-leverage projects.'},
  {name:'Advanced',   min:85, max:100,desc:'You\'re ahead of the curve. The question isn\'t whether to automate — it\'s how to operationalize continuous AI adoption across the org.'},
];

const state = {
  idx: 0,
  answers: new Array(QUESTIONS.length).fill(null),
  unlocked: false,
  lead: null,
};

function save(){ try { localStorage.setItem('dma-answers', JSON.stringify(state)); } catch(e){} }
function load(){
  try {
    const s = JSON.parse(localStorage.getItem('dma-answers') || 'null');
    if(s && Array.isArray(s.answers) && s.answers.length === QUESTIONS.length){
      state.idx = s.idx || 0;
      state.answers = s.answers;
      state.unlocked = !!s.unlocked;
      state.lead = s.lead || null;
    }
  } catch(e){}
}
load();

const screens = {
  intro: document.getElementById('s-intro'),
  question: document.getElementById('s-question'),
  transition: document.getElementById('s-transition'),
  gate: document.getElementById('s-gate'),
  results: document.getElementById('s-results'),
};
function show(name){
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
  window.scrollTo({top:0, behavior:'instant'});
}

document.getElementById('start-btn').addEventListener('click', () => {
  state.idx = 0; show('question'); renderQuestion();
});

function renderQuestion(){
  const i = state.idx;
  const q = QUESTIONS[i];
  const cat = CATEGORIES.find(c => c.id === q.cat);
  const catIdx = CATEGORIES.findIndex(c => c.id === q.cat);

  document.getElementById('p-count').textContent = `Q ${String(i+1).padStart(2,'0')} / ${QUESTIONS.length}`;
  document.getElementById('p-fill').style.width = `${((i+1)/QUESTIONS.length)*100}%`;
  const remaining = Math.max(1, Math.round((QUESTIONS.length - i - 1) * 0.5));
  document.getElementById('p-remaining').textContent = `~${remaining} min left`;

  const cdots = document.getElementById('p-cats');
  cdots.innerHTML = '';
  CATEGORIES.forEach((c, idx) => {
    const d = document.createElement('span');
    d.className = 'd';
    if(idx < catIdx) d.classList.add('done');
    if(idx === catIdx) d.classList.add('here');
    cdots.appendChild(d);
  });

  document.getElementById('q-category').textContent = `Category ${String(catIdx+1).padStart(2,'0')} · ${cat.name}`;
  document.getElementById('q-text').textContent = q.text;
  document.getElementById('q-hint').textContent = q.hint || '';
  document.getElementById('q-hint').style.display = q.hint ? '' : 'none';
  document.getElementById('q-why').innerHTML = '<b>Why we ask</b>' + cat.why;

  const optsEl = document.getElementById('q-opts');
  optsEl.innerHTML = '';
  q.options.forEach((opt, oi) => {
    const el = document.createElement('div');
    el.className = 'option' + (state.answers[i] === oi ? ' selected' : '');
    el.innerHTML = `<span class="dot"></span><span>${opt.t}</span><span class="score">+${opt.score}</span>`;
    el.addEventListener('click', () => {
      state.answers[i] = oi; save(); renderQuestion();
    });
    optsEl.appendChild(el);
  });

  const sEl = document.getElementById('q-sections');
  sEl.innerHTML = '';
  CATEGORIES.forEach((c, idx) => {
    const li = document.createElement('li');
    if(idx < catIdx) li.classList.add('done');
    if(idx === catIdx) li.classList.add('here');
    li.innerHTML = `<span class="dot2"></span>${c.short}`;
    sEl.appendChild(li);
  });

  document.getElementById('q-back').disabled = i === 0;
  document.getElementById('q-next').disabled = state.answers[i] === null;
}

document.getElementById('q-back').addEventListener('click', () => {
  if(state.idx > 0){ state.idx--; save(); renderQuestion(); }
});
document.getElementById('q-next').addEventListener('click', () => {
  const cur = QUESTIONS[state.idx];
  const nxt = QUESTIONS[state.idx+1];
  if(!nxt){ goToResults(); return; }
  if(cur.cat !== nxt.cat){
    const catIdx = CATEGORIES.findIndex(c => c.id === cur.cat);
    document.getElementById('t-kicker').textContent = `Section ${String(catIdx+1).padStart(2,'0')} of ${String(CATEGORIES.length).padStart(2,'0')} complete`;
    document.getElementById('t-title').textContent = 'Nice work.';
    document.getElementById('t-body').textContent = `You've finished ${CATEGORIES[catIdx].name}. Up next: ${CATEGORIES[catIdx+1].name}.`;
    const { total, maxTotal } = currentScore();
    document.getElementById('t-count').innerHTML = `Running score: <b>${Math.round((total/maxTotal)*100)}</b> · ${state.answers.filter(a=>a!==null).length} of ${QUESTIONS.length} answered`;
    show('transition');
    return;
  }
  state.idx++; save(); renderQuestion();
});
document.getElementById('q-skip').addEventListener('click', () => {
  state.answers[state.idx] = null; save();
  if(state.idx < QUESTIONS.length-1){ state.idx++; renderQuestion(); }
  else { goToResults(); }
});

document.getElementById('t-continue').addEventListener('click', () => {
  state.idx++; save(); show('question'); renderQuestion();
});
document.getElementById('t-back').addEventListener('click', () => {
  show('question'); renderQuestion();
});

function currentScore(){
  let total = 0, maxTotal = 0;
  const byCat = {};
  CATEGORIES.forEach(c => byCat[c.id] = {sum:0, max:0, count:0});
  QUESTIONS.forEach((q, i) => {
    const a = state.answers[i];
    const maxOpt = Math.max(...q.options.map(o => o.score));
    byCat[q.cat].max += maxOpt;
    maxTotal += maxOpt;
    if(a !== null){
      byCat[q.cat].sum += q.options[a].score;
      byCat[q.cat].count++;
      total += q.options[a].score;
    }
  });
  return { total, maxTotal, byCat };
}
function tierFor(score){ return TIERS.find(t => score >= t.min && score <= t.max) || TIERS[0]; }

function strengthText(id){
  return ({
    proc:'your processes are repeatable enough to hand to software',
    data:'your data is accessible, which is half the battle',
    tech:'your tools can talk — integration is not a blocker',
    team:'your people are ready to work alongside AI',
    labor:'you already know where the time goes, so targeting is easy',
    lead:'leadership is on board — sponsorship is often the hardest piece',
  })[id];
}
function gapText(id){
  return ({
    proc:'undocumented work is hard to automate — capture it first',
    data:'clean, centralized data is the fuel for everything else',
    tech:'systems that don\'t talk force humans to be the glue',
    team:'upskilling + a named owner will decide if anything sticks',
    labor:'measure where time actually goes before you build',
    lead:'secure explicit budget and a 2-quarter runway before starting',
  })[id];
}

function renderResults(){
  const { total, maxTotal, byCat } = currentScore();
  const pct = maxTotal ? Math.round((total / maxTotal) * 100) : 0;
  const tier = tierFor(pct);

  document.getElementById('r-score').innerHTML = `${pct}<small>/100</small>`;
  document.getElementById('r-tier-chip').textContent = tier.name;
  document.getElementById('r-tier-name').textContent = tier.name;
  document.getElementById('r-tier-desc').textContent = tier.desc;
  document.querySelectorAll('#r-ladder .rung').forEach((r, idx) => {
    r.classList.toggle('current', TIERS[idx].name === tier.name);
  });

  const catEl = document.getElementById('r-cats');
  catEl.innerHTML = '';
  const catScores = CATEGORIES.map(c => {
    const b = byCat[c.id];
    const p = b.max ? Math.round((b.sum / b.max) * 100) : 0;
    return { cat:c, pct:p };
  });
  catScores.forEach(({cat, pct:p}) => {
    const row = document.createElement('div');
    row.className = 'cat-row';
    const tone = p >= 70 ? ' high' : p < 50 ? ' low' : '';
    row.innerHTML = `<span class="name">${cat.name}</span><div class="track"><div class="tf${tone}" style="width:${p}%"></div></div><span class="val">${p}</span>`;
    catEl.appendChild(row);
  });

  const sorted = [...catScores].sort((a,b) => b.pct - a.pct);
  const strengths = sorted.slice(0,2);
  const gaps = [...catScores].sort((a,b) => a.pct - b.pct).slice(0,2);
  document.getElementById('r-strengths').innerHTML = strengths.map(s => `<li><b>${s.cat.name}</b> — ${strengthText(s.cat.id)}</li>`).join('');
  document.getElementById('r-gaps').innerHTML = gaps.map(s => `<li><b>${s.cat.name}</b> — ${gapText(s.cat.id)}</li>`).join('');

  const weakest = gaps[0].cat.name.toLowerCase();
  document.getElementById('r-narrative').textContent =
    `${tier.desc} Based on your answers, ${weakest} is the first wall you'll hit — addressing it unlocks most of the higher-value automation projects below.`;

  renderOpportunities(catScores);
}

function renderOpportunities(catScores){
  const allOpps = [
    {id:'ops_int', title:'CRM ↔ ops integration', cats:['tech','data'],
      desc:'Wire your two most-used systems so data flows automatically. Unblocks every automation downstream.', build:'4-week build', impact:'Unlocks roadmap'},
    {id:'report', title:'Automated weekly reporting', cats:['data','labor'],
      desc:'Replace 8–12 hours of spreadsheet-wrangling per week with a dashboard that refreshes itself.', build:'3-week build', impact:'Reclaims weekly hours'},
    {id:'recon', title:'Inventory / invoice reconciliation', cats:['labor','data'],
      desc:'Automated matching with exception flagging. Humans only touch the 5% that needs judgment.', build:'6-week build', impact:'Major labor savings'},
    {id:'quote', title:'AI-assisted quote drafting', cats:['team','labor'],
      desc:'LLM drafts quotes from the customer brief using your pricing rules; rep reviews and sends.', build:'10-week build', impact:'Faster customer response'},
    {id:'triage', title:'Inbound email triage + drafting', cats:['team','labor'],
      desc:'Classifies and drafts replies to routine customer emails. Team reviews and sends.', build:'5-week build', impact:'Inbox time reclaimed'},
    {id:'proc_cap', title:'Process capture workshop', cats:['proc'],
      desc:'Two-week sprint to document your top 5 workflows so they become automatable.', build:'2-week sprint', impact:'Foundational'},
    {id:'data_clean', title:'Customer master data cleanup', cats:['data'],
      desc:'Dedupe + canonicalize your customer records before wiring anything to them.', build:'4-week build', impact:'Foundational'},
    {id:'enablement', title:'Team AI enablement program', cats:['team','lead'],
      desc:'Structured rollout of AI tools with training, guardrails, and internal champions.', build:'6-week program', impact:'Higher team leverage'},
  ];
  const weakMap = {}; catScores.forEach(c => weakMap[c.cat.id] = c.pct);
  const ranked = allOpps.map(o => {
    const pctSum = o.cats.reduce((a,c) => a + (weakMap[c] ?? 50), 0) / o.cats.length;
    return { ...o, relevance: 100 - pctSum };
  }).sort((a,b) => b.relevance - a.relevance).slice(0, 3);

  const el = document.getElementById('r-opps');
  el.innerHTML = '';
  ranked.forEach((o, i) => {
    const d = document.createElement('div');
    d.className = 'opp';
    const rankLabel = ['#1 Quick win','#2 Medium lift','#3 Foundation'][i];
    const chipCls = i===0 ? 'accent' : 'tonal';
    d.innerHTML = `
      <div class="rank"><span class="chip ${chipCls}">${rankLabel}</span><span class="chip">${o.build}</span></div>
      <h4>${o.title}</h4>
      <p>${o.desc}</p>
      <div class="savings">${o.impact}</div>`;
    el.appendChild(d);
  });
}

// ============ EMAIL GATE ============
var fillAnswersIfEmpty = function fillAnswersIfEmpty(){
  const missing = state.answers.filter(a => a === null).length;
  if(missing > 5){
    state.answers = QUESTIONS.map(q => {
      const n = q.options.length;
      return Math.min(n-1, Math.max(0, Math.floor(Math.random()*n*0.9 + n*0.2)));
    });
    save();
  }
};
var renderGate = function renderGate(){
  const { total, maxTotal } = currentScore();
  const pct = maxTotal ? Math.round((total / maxTotal) * 100) : 0;
  const tier = tierFor(pct);
  document.getElementById('g-score').innerHTML = `${pct}<small>/100</small>`;
  document.getElementById('g-tier-chip').textContent = tier.name;
  document.getElementById('g-tier-name').textContent = tier.name;
};
var goToResults = function goToResults(){
  if(state.unlocked){
    show('results'); renderResults();
  } else {
    renderGate();
    show('gate');
  }
};

const gateForm = document.getElementById('gate-form');
if (gateForm) gateForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const fd = new FormData(gateForm);
  const lead = {
    name: fd.get('name'),
    email: fd.get('email'),
    company: fd.get('company'),
    role: fd.get('role'),
    submittedAt: new Date().toISOString(),
  };
  const { total, maxTotal, byCat } = currentScore();
  const pct = maxTotal ? Math.round((total / maxTotal) * 100) : 0;
  const tier = tierFor(pct);
  lead.score = pct;
  lead.tier = tier.name;
  lead.categoryScores = Object.fromEntries(
    CATEGORIES.map(c => {
      const b = byCat[c.id] || {t:0,m:0};
      return [c.id, b.m ? Math.round((b.t/b.m)*100) : 0];
    })
  );

  state.unlocked = true;
  state.lead = lead;
  save();

  // TODO: set before production — see setup-sheets.md
  // Google Sheets webhook — replace SHEETS_WEBHOOK_URL with your deployed Apps Script URL.
  const SHEETS_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbz2omY-_KPy-fupLkJykjWflYKvWqQ9eOjPJE33o6cvxwhO5ChumocPLbDF1k2t6LH-UQ/exec';
  if (SHEETS_WEBHOOK_URL && !SHEETS_WEBHOOK_URL.startsWith('PASTE_')) {
    // no-cors + form body so it works cross-origin without CORS headers
    const body = new URLSearchParams();
    Object.entries(lead).forEach(([k,v]) => body.append(k, typeof v === 'object' ? JSON.stringify(v) : String(v ?? '')));
    fetch(SHEETS_WEBHOOK_URL, { method:'POST', mode:'no-cors', body }).catch(err => console.warn('[DMA lead webhook failed]', err));
  }
  window.dispatchEvent(new CustomEvent('dma:lead', { detail: lead }));

  renderResults();
  show('results');
  window.scrollTo({top:0, behavior:'instant'});
});
document.getElementById('gate-skip')?.addEventListener('click', (e) => {
  e.preventDefault();
  state.unlocked = true; save();
  renderResults(); show('results');
});

// PDF download
document.getElementById('dl-pdf')?.addEventListener('click', () => {
  const { total, maxTotal } = currentScore();
  if(maxTotal && total > 0){
    try { localStorage.setItem('dma-print-state', JSON.stringify(state)); } catch(e){}
  }
  window.open('report.html?print=1', '_blank');
});

// Tweaks
const tweaksPanel = document.getElementById('tweaks');
window.addEventListener('message', (e) => {
  if(!e.data || !e.data.type) return;
  if(e.data.type === '__activate_edit_mode') tweaksPanel.classList.add('on');
  if(e.data.type === '__deactivate_edit_mode') tweaksPanel.classList.remove('on');
});
function applyTweaks(t){
  const root = document.documentElement;
  if(t.theme === 'invert'){
    root.style.setProperty('--paper', '#1C3423');
    root.style.setProperty('--ink', '#E8E4DD');
    root.style.setProperty('--soft', '#28432F');
    root.style.setProperty('--neutral', '#28432F');
    root.style.setProperty('--line', '#3a5443');
    root.style.setProperty('--muted', '#9DB1A4');
  } else if(t.theme === 'warm'){
    root.style.setProperty('--paper', '#E8E4DD');
    root.style.setProperty('--ink', '#1C3423');
    root.style.setProperty('--soft', '#DCD6CC');
    root.style.setProperty('--neutral', '#FBFAF7');
    root.style.setProperty('--line', '#C8C2B8');
    root.style.setProperty('--muted', '#6E7770');
  } else {
    root.style.setProperty('--paper', '#FBFAF7');
    root.style.setProperty('--ink', '#1C3423');
    root.style.setProperty('--soft', '#F2EFE9');
    root.style.setProperty('--neutral', '#E8E4DD');
    root.style.setProperty('--line', '#C8C2B8');
    root.style.setProperty('--muted', '#6E7770');
  }
  if(t.density === 'compact'){
    document.querySelectorAll('.q-card').forEach(c => { c.style.padding = '28px'; c.style.minHeight = '320px'; });
    document.querySelectorAll('.option').forEach(o => o.style.padding = '10px 14px');
  } else {
    document.querySelectorAll('.q-card').forEach(c => { c.style.padding = ''; c.style.minHeight = ''; });
    document.querySelectorAll('.option').forEach(o => o.style.padding = '');
  }
  document.querySelectorAll('.q-aside .why').forEach(el => el.style.display = t.why ? '' : 'none');
}
const TWEAK_DEFAULTS = { theme:'default', density:'comfortable', why:true };
const tstate = {...TWEAK_DEFAULTS};
applyTweaks(tstate);
document.getElementById('t-theme').value = tstate.theme;
document.getElementById('t-density').value = tstate.density;
document.getElementById('t-why').checked = tstate.why;
function tchange(k,v){ tstate[k]=v; applyTweaks(tstate); }
document.getElementById('t-theme').addEventListener('change', e => tchange('theme', e.target.value));
document.getElementById('t-density').addEventListener('change', e => tchange('density', e.target.value));
document.getElementById('t-why').addEventListener('change', e => tchange('why', e.target.checked));
window.parent.postMessage({type:'__edit_mode_available'}, '*');

// Initial
if(state.answers.some(a => a !== null)){
  show('question');
  renderQuestion();
}
