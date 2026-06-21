/* ════ SHARED ASSETS ════ */
const APP = {
  canvas:{logo:'https://cdn.simpleicons.org/instructure/E72429',bg:'rgba(231,36,41,.08)',bc:'#E72429'},
  calendar:{logo:'https://cdn.simpleicons.org/googlecalendar/4285F4',bg:'rgba(66,133,244,.08)',bc:'#4285F4'},
  gmail:{logo:'https://cdn.simpleicons.org/gmail/EA4335',bg:'rgba(234,67,53,.08)',bc:'#EA4335'},
  slack:{logo:'https://cdn.simpleicons.org/slack/4A154B',bg:'rgba(74,21,75,.08)',bc:'#4A154B'},
  gradescope:{logo:'https://www.google.com/s2/favicons?domain=gradescope.com&sz=128',bg:'rgba(0,153,161,.08)',bc:'#0099A1'},
  discord:{logo:'https://cdn.simpleicons.org/discord/5865F2',bg:'rgba(88,101,242,.08)',bc:'#5865F2'},
  handshake:{logo:'https://www.google.com/s2/favicons?domain=joinhandshake.com&sz=128',bg:'rgba(229,75,75,.08)',bc:'#E54B4B'},
  linkedin:{logo:'https://cdn.simpleicons.org/linkedin/0A66C2',bg:'rgba(10,102,194,.08)',bc:'#0A66C2'},
  imessage:{logo:'https://cdn.simpleicons.org/imessage/34C759',bg:'rgba(52,199,89,.08)',bc:'#34C759'},
  acm:{logo:'https://www.google.com/s2/favicons?domain=acm.org&sz=128',bg:'rgba(0,82,155,.08)',bc:'#00529B'},
  research:{logo:'https://www.google.com/s2/favicons?domain=scholar.google.com&sz=128',bg:'rgba(66,133,244,.08)',bc:'#4285F4'},
};
const BRAND = {
  google:{logo:'https://cdn.simpleicons.org/google/4285F4',bg:'rgba(66,133,244,.08)',bc:'#4285F4'},
  stripe:{logo:'https://cdn.simpleicons.org/stripe/635BFF',bg:'rgba(99,91,255,.08)',bc:'#635BFF'},
  notion:{logo:'https://cdn.simpleicons.org/notion/000000',bg:'rgba(0,0,0,.05)',bc:'#1d1d1f'},
  github:{logo:'https://cdn.simpleicons.org/github/181717',bg:'rgba(24,23,23,.06)',bc:'#181717'},
};

function logoImg(src, size) {
  return `<img src="${src}" alt="" width="${size}" height="${size}" loading="lazy" draggable="false">`;
}

function cardVisual(d) {
  if (d.brand && BRAND[d.brand]) return BRAND[d.brand];
  return APP[d.app] || APP.gmail;
}

function schedule(fn, ms) {
  return setTimeout(fn, ms);
}

function initLanding() {
  const site = document.getElementById('create-iris');
  if (!site) return;

  document.body.classList.add('site-live');
  document.body.style.background = '#fff';
  document.body.style.color = '#1d1d1f';

  const nav = document.getElementById('main-nav');
  if (nav) {
    const logo = nav.querySelector('.nav-logo');
    if (logo) logo.style.color = '#1d1d1f';
    nav.querySelectorAll('.nav-links a').forEach(a => { a.style.color = 'rgba(0,0,0,.55)'; });
    nav.classList.remove('scrolled');
    nav.style.background = 'rgba(255,255,255,.8)';
    nav.style.backdropFilter = 'blur(12px)';
  }

  site.classList.add('iris-open');
  site.style.opacity = '1';

  const cmdWin = site.querySelector('.iris-cmd-window');
  if (cmdWin) cmdWin.classList.add('handoff-pulse');

  onIrisOpen();
}

/* ════ NAV ════ */
window.addEventListener('scroll', () => document.getElementById('main-nav').classList.toggle('scrolled', scrollY > 10));

/* ════ REVEAL ════ */
const revealObs = new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); }), {threshold:.1});
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ════ GOAL INPUT DEMO ════ */
const goalDemoPairs = [
  {
    goal: 'Land a software internship at a top company',
    response: 'Recruiting emails flagged first. OA windows protected. LeetCode prep blocks added before every interview round. Low weight assignments deprioritized automatically.'
  },
  {
    goal: 'Keep my GPA above 3.8 this quarter',
    response: 'Exam prep blocks locked 3 days before every midterm. Low weight assignments flagged as skippable. Study rhythm tracked across your calendar.'
  },
  {
    goal: 'Get into undergraduate research by spring',
    response: 'Professor office hours surfaced. RA opening emails flagged. Application deadlines tracked. Lab visit windows added to your calendar.'
  },
  {
    goal: 'Be more active in my clubs this year',
    response: 'Club meeting conflicts resolved automatically. Leadership opportunity deadlines tracked. Event RSVPs managed so nothing closes without you knowing.'
  },
  {
    goal: 'Graduate with strong relationships with my professors',
    response: 'Office hours surfaced weekly. Email response windows tracked. Research and rec letter deadlines added. Iris drafts follow ups when you go quiet.'
  },
];

let gdIdx = 0, gdCharI = 0, gdDeleting = false, gdPhase = 'typing';
const gdTextEl = document.getElementById('goalDemoText');
const gdCursorEl = document.getElementById('goalDemoCursor');
const gdResponseEl = document.getElementById('goalDemoResponse');
const gdResponseTextEl = document.getElementById('goalDemoResponseText');

function runGoalDemo() {
  if (!gdTextEl) return;
  const pair = goalDemoPairs[gdIdx];

  if (gdPhase === 'typing') {
    gdCharI++;
    gdTextEl.textContent = pair.goal.slice(0, gdCharI);
    gdTextEl.appendChild(gdCursorEl);
    if (gdCharI < pair.goal.length) {
      setTimeout(runGoalDemo, 48 + Math.random() * 20);
    } else {
      gdPhase = 'showing';
      gdResponseTextEl.textContent = pair.response;
      gdResponseEl.style.opacity = '1';
      setTimeout(runGoalDemo, 5800);
    }
  } else if (gdPhase === 'showing') {
    gdResponseEl.style.opacity = '0';
    gdPhase = 'deleting';
    setTimeout(runGoalDemo, 500);
  } else {
    gdCharI--;
    gdTextEl.textContent = pair.goal.slice(0, gdCharI);
    gdTextEl.appendChild(gdCursorEl);
    if (gdCharI > 0) {
      setTimeout(runGoalDemo, 22);
    } else {
      gdIdx = (gdIdx + 1) % goalDemoPairs.length;
      gdPhase = 'typing';
      setTimeout(runGoalDemo, 500);
    }
  }
}

// Start when section scrolls into view
const bentoObs = new IntersectionObserver(es => {
  if (es[0].isIntersecting) { runGoalDemo(); bentoObs.disconnect(); }
}, { threshold: 0.3 });
const bentoSection = document.getElementById('features');
if (bentoSection) bentoObs.observe(bentoSection);

/* ════ MAGNETIC BUTTONS ════ */
document.querySelectorAll('.btn-pill-primary,.btn-ghost,.nav-cta').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const dx = e.clientX-(r.left+r.width/2), dy = e.clientY-(r.top+r.height/2);
    btn.style.transform = `translate(${dx*.18}px,${dy*.18}px) scale(1.04)`;
  });
  btn.addEventListener('mouseleave', () => btn.style.transform = '');
});

/* ════ SPOTLIGHT ════ */
function addSpotlight(sel, color) {
  document.querySelectorAll(sel).forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--sx', (e.clientX-r.left)+'px');
      el.style.setProperty('--sy', (e.clientY-r.top)+'px');
      el.style.setProperty('--spotlight', color);
      el.classList.add('spotlight-active');
    });
    el.addEventListener('mouseleave', () => el.classList.remove('spotlight-active'));
  });
}
addSpotlight('.bento-card.dark,.goal-tradeoff', 'rgba(255,255,255,0.045)');
addSpotlight('.bento-card.purple,.bento-card.teal,.bento-card.peach,.bento-card.sky,.bento-card.yellow', 'rgba(0,0,0,0.03)');

/* ════ BENTO TILT ════ */
document.querySelectorAll('.bento-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const dx = (e.clientX-r.left)/r.width-.5, dy = (e.clientY-r.top)/r.height-.5;
    card.style.transform = `perspective(900px) rotateX(${-dy*7}deg) rotateY(${dx*7}deg) translateY(-4px) scale(1.01)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform=''; card.style.transition='transform .5s cubic-bezier(.16,1,.3,1)'; setTimeout(()=>card.style.transition='',500); });
});

/* ════ SHIFT CONSTELLATION ════ */
const SHIFT_NODES = [
  { id: 'canvas', app: 'canvas', label: 'Canvas', x: 12, y: 16, floatDur: 7, floatDelay: 0 },
  { id: 'gmail', app: 'gmail', label: 'Gmail', x: 78, y: 10, floatDur: 8, floatDelay: -1.2 },
  { id: 'calendar', app: 'calendar', label: 'Calendar', x: 88, y: 38, floatDur: 6.5, floatDelay: -2 },
  { id: 'slack', app: 'slack', label: 'Slack', x: 8, y: 52, floatDur: 9, floatDelay: -2.8 },
  { id: 'discord', app: 'discord', label: 'Discord', x: 18, y: 80, floatDur: 7.5, floatDelay: -1.5 },
  { id: 'handshake', app: 'handshake', label: 'Handshake', x: 82, y: 72, floatDur: 7.2, floatDelay: -3.2 },
  { id: 'gradescope', app: 'gradescope', label: 'Gradescope', x: 50, y: 6, floatDur: 8, floatDelay: -0.6, mobileHide: true },
];
const SHIFT_INFRA = [
  { app: 'canvas', label: 'Canvas' },
  { app: 'gmail', label: 'Gmail' },
  { app: 'calendar', label: 'Calendar' },
  { app: 'slack', label: 'Slack' },
  { app: 'discord', label: 'Discord' },
  { app: 'handshake', label: 'Handshake' },
  { app: 'gradescope', label: 'Gradescope' },
];
const SHIFT_SYNC_MSGS = [
  'Linking your apps...',
  'Reading Canvas & Gmail...',
  'Syncing calendar & Slack...',
  'All connected.',
];
let shiftStarted = false;
let shiftParticleTimer = null;

function shiftCenter(el, box) {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top };
}

function shiftVisual(n) {
  if (n.brand && BRAND[n.brand]) return BRAND[n.brand];
  if (n.app && APP[n.app]) return APP[n.app];
  return null;
}

function buildShiftNodes() {
  const container = document.getElementById('shiftNodes');
  if (!container) return;
  container.innerHTML = '';
  SHIFT_NODES.forEach(n => {
    const el = document.createElement('div');
    el.className = 'shift-node' + (n.mobileHide ? ' hide-mobile' : '');
    el.dataset.node = n.id;
    el.style.left = n.x + '%';
    el.style.top = n.y + '%';
    el.style.setProperty('--float-dur', n.floatDur + 's');
    el.style.setProperty('--float-delay', n.floatDelay + 's');
    const vis = shiftVisual(n);
    const iconHtml = vis
      ? `<span class="shift-node-icon" style="background:${vis.bg}">${logoImg(vis.logo, 17)}</span>`
      : '';
    el.innerHTML = iconHtml + `<span class="shift-node-label">${n.label}</span>`;
    container.appendChild(el);
  });
}

function buildShiftInfra() {
  const container = document.getElementById('shiftInfra');
  if (!container) return;
  container.innerHTML = SHIFT_INFRA.map(item => {
    const vis = APP[item.app];
    if (!vis) return '';
    return `<span class="integration-chip">${logoImg(vis.logo, 14)}${item.label}</span>`;
  }).join('');
}

function drawShiftGraph() {
  const arena = document.getElementById('shiftArena');
  const svg = document.getElementById('shiftGraph');
  const hub = document.getElementById('shiftHub');
  if (!arena || !svg || !hub) return;
  const box = arena.getBoundingClientRect();
  svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
  svg.innerHTML = '';
  const hc = shiftCenter(hub, box);
  SHIFT_NODES.forEach((n, i) => {
    if (n.mobileHide && window.innerWidth <= 768) return;
    const nodeEl = arena.querySelector(`[data-node="${n.id}"]`);
    if (!nodeEl) return;
    const nc = shiftCenter(nodeEl, box);
    const mx = (nc.x + hc.x) / 2, my = (nc.y + hc.y) / 2;
    const bend = 0.14;
    const cx = mx + (hc.y - nc.y) * bend;
    const cy = my - (hc.x - nc.x) * bend;
    const d = `M ${nc.x} ${nc.y} Q ${cx} ${cy} ${hc.x} ${hc.y}`;
    const glow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    glow.setAttribute('d', d);
    glow.setAttribute('class', 'shift-line-glow');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    path.setAttribute('class', 'shift-line');
    const len = path.getTotalLength();
    path.style.setProperty('--line-len', len);
    path.style.setProperty('--line-delay', (i * 0.09) + 's');
    svg.appendChild(glow);
    svg.appendChild(path);
  });
}

function spawnShiftParticle() {
  const arena = document.getElementById('shiftArena');
  const container = document.getElementById('shiftParticles');
  const svg = document.getElementById('shiftGraph');
  if (!arena || !container || !svg) return;
  const paths = svg.querySelectorAll('.shift-line');
  if (!paths.length) return;
  const path = paths[Math.floor(Math.random() * paths.length)];
  const len = path.getTotalLength();
  const dot = document.createElement('div');
  dot.className = 'shift-particle';
  container.appendChild(dot);
  let t = 0;
  const dur = 2400 + Math.random() * 1000;
  function step() {
    if (!dot.parentElement) return;
    t += 16;
    const p = Math.min(t / dur, 1);
    const pt = path.getPointAtLength(len * p);
    dot.style.left = pt.x + 'px';
    dot.style.top = pt.y + 'px';
    dot.style.opacity = p < 0.82 ? '0.45' : String(0.45 * (1 - (p - 0.82) / 0.18));
    if (p < 1) requestAnimationFrame(step);
    else dot.remove();
  }
  requestAnimationFrame(step);
}

function cycleShiftSyncStatus() {
  const status = document.getElementById('shiftIrisStatus');
  if (!status) return;
  let idx = 0;
  status.textContent = SHIFT_SYNC_MSGS[0];
  const timer = setInterval(() => {
    idx++;
    if (idx >= SHIFT_SYNC_MSGS.length) { clearInterval(timer); return; }
    status.classList.add('fade');
    schedule(() => {
      status.textContent = SHIFT_SYNC_MSGS[idx];
      status.classList.remove('fade');
    }, 200);
  }, 1100);
}

function showShiftConnected() {
  document.getElementById('shiftHub')?.classList.add('synced');
  const sub = document.getElementById('shiftHubSub');
  if (sub) sub.textContent = 'All connected';
  schedule(() => document.getElementById('shiftIrisStatus')?.classList.add('fade'), 400);
}

function initShiftConstellation() {
  if (shiftStarted) return;
  shiftStarted = true;
  const arena = document.getElementById('shiftArena');
  if (!arena) return;
  buildShiftNodes();
  buildShiftInfra();
  arena.classList.add('active');

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    drawShiftGraph();
    document.querySelectorAll('.shift-line').forEach(l => { l.style.strokeDashoffset = '0'; });
    showShiftConnected();
    const status = document.getElementById('shiftIrisStatus');
    if (status) status.textContent = 'All connected.';
    return;
  }

  schedule(drawShiftGraph, 120);
  shiftParticleTimer = setInterval(spawnShiftParticle, 3200);
  schedule(spawnShiftParticle, 800);
  schedule(cycleShiftSyncStatus, 400);
  schedule(showShiftConnected, 4200);

  let resizeTimer;
  addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(drawShiftGraph, 150);
  });
}

const shiftObs = new IntersectionObserver(es => {
  if (es[0].isIntersecting) {
    initShiftConstellation();
    shiftObs.disconnect();
  }
}, { threshold: 0.25 });
const shiftArenaEl = document.getElementById('shiftArena');
if (shiftArenaEl) {
  buildShiftInfra();
  shiftObs.observe(shiftArenaEl);
}

/* ════ SEQUENTIAL CHAT ════ */
const chatScript = [
  {from:'buddy', text:'Morning 👋 The Google recruiter replied. Your 24hr window is open. I drafted a response that leads with your distributed systems project.', action:'→ Review draft', time:'7:42 AM', typingMs:1500},
  {from:'me',    text:'send it. what about my stats hw', time:'7:43 AM', pauseMs:800},
  {from:'buddy', text:'Sent ✓  For Stats: today\'s lecture covered null hypothesis setup, two sample t tests, and p value interpretation. Questions 1 to 3 map directly to those examples (Prof. Rodriguez even used the same dataset format). 7 to 9 PM is already blocked for you. Start with Q1, it\'s a straight t test from lecture.', time:'7:43 AM', typingMs:2200},
  {from:'buddy', text:'You have an ACM club meeting at 4 and you skipped prep yesterday. I\'d skip the meeting for interview prep.', time:'7:43 AM', typingMs:1600},
  {from:'me',    text:'Ya ur right', time:'7:44 AM', pauseMs:600},
  {from:'buddy', text:'Ur calendar\'s updated. You got this. You\'re gonna crush that interview.', time:'7:44 AM', typingMs:1000},
];

function makeBubble(msg) {
  const wrap = document.createElement('div');
  wrap.className = `bubble-wrap from-${msg.from}`;
  wrap.style.cssText = 'opacity:0;transform:translateY(8px);transition:opacity .35s cubic-bezier(.16,1,.3,1),transform .35s cubic-bezier(.16,1,.3,1);';
  const bub = document.createElement('div');
  bub.className = `bubble from-${msg.from}`;
  bub.textContent = msg.text;
  if (msg.action) { const a = document.createElement('span'); a.className='action-link'; a.textContent=msg.action; bub.appendChild(a); }
  const t = document.createElement('div');
  t.className = 'bubble-time'; t.textContent = msg.time;
  if (msg.from==='me') t.style.textAlign='right';
  wrap.appendChild(bub); wrap.appendChild(t);
  return wrap;
}

function makeTyping() {
  const wrap = document.createElement('div');
  wrap.className = 'typing-indicator';
  wrap.innerHTML = '<div class="typing-bubble"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>';
  return wrap;
}

function scrollChat() {
  const ca = document.getElementById('chatArea');
  if (ca) ca.scrollTop = ca.scrollHeight;
}

function runChat() {
  const ca = document.getElementById('chatArea');
  if (!ca) return;
  ca.innerHTML = '';
  let p = Promise.resolve();
  chatScript.forEach(msg => {
    p = p.then(() => new Promise(res => {
      const d = msg.from==='me' ? (msg.pauseMs||600) : 200;
      setTimeout(() => {
        if (msg.from==='buddy') {
          const typing = makeTyping();
          ca.appendChild(typing); scrollChat();
          requestAnimationFrame(() => requestAnimationFrame(() => typing.classList.add('show')));
          setTimeout(() => {
            typing.classList.remove('show');
            setTimeout(() => {
              typing.remove();
              const b = makeBubble(msg); ca.appendChild(b); scrollChat();
              requestAnimationFrame(() => requestAnimationFrame(() => { b.style.opacity='1'; b.style.transform='none'; }));
              setTimeout(res, 360);
            }, 220);
          }, msg.typingMs||1200);
        } else {
          const b = makeBubble(msg); ca.appendChild(b); scrollChat();
          requestAnimationFrame(() => requestAnimationFrame(() => { b.style.opacity='1'; b.style.transform='none'; }));
          setTimeout(res, 280);
        }
      }, d);
    }));
  });
}

let chatPlayed = false;
const chatObs = new IntersectionObserver(es => {
  if (!es[0].isIntersecting || chatPlayed) return;
  chatPlayed = true;
  setTimeout(runChat, 300);
}, {threshold:.1, rootMargin:'0px 0px -50px 0px'});
const phoneWrapEl = document.getElementById('phoneWrap');
if (phoneWrapEl) chatObs.observe(phoneWrapEl);

/* ════ PHONE 3D TILT ════ */
const pw = document.getElementById('phoneWrap');
if (pw) {
  pw.addEventListener('mousemove', e => {
    const r=pw.getBoundingClientRect();
    const dx=(e.clientX-r.left)/r.width-.5, dy=(e.clientY-r.top)/r.height-.5;
    document.getElementById('messagesPhone').style.transform = `perspective(800px) rotateX(${-dy*8}deg) rotateY(${dx*8}deg) scale(1.02)`;
  });
  pw.addEventListener('mouseleave', () => { document.getElementById('messagesPhone').style.transform=''; });
}

/* ════ IRIS COMMAND WINDOW ════ */
const cmdPairs = [
  {
    q: 'What do I need to focus on today?',
    a: 'I scanned your calendar and hard deadlines. Google OA closes in 38 hours. That\'s the only immovable thing today, so I pushed everything else to tomorrow.',
    icon: 'pri', glyph: '◎', meta: 'Priority', activity: 'Scanning calendar…'
  },
  {
    q: 'Should I skip my 11am lecture?',
    a: 'I cross checked Canvas and your midterm topics. Prof. Rodriguez is covering confidence intervals today. It\'s on the exam and there\'s no recording. Go.',
    icon: 'cal', glyph: '◷', meta: 'Schedule', activity: 'Reading syllabus…'
  },
  {
    q: 'What\'s eating my time this week?',
    a: 'I mapped your week against your interview prep blocks. Three club meetings land in that window. I\'d cancel ACM Tuesday and keep research lab Thursday.',
    icon: 'time', glyph: '◌', meta: 'Audit', activity: 'Auditing your week…'
  },
  {
    q: 'Am I on track this semester?',
    a: 'I pulled your goals and what you\'ve actually done this week. GPA\'s holding. Two recruiting windows close soon and you haven\'t touched either. Want me to block prep time?',
    icon: 'track', glyph: '◆', meta: 'Track', activity: 'Reviewing goals…'
  },
  {
    q: 'What should I do with my free hour at 2pm?',
    a: 'I checked your calendar and what\'s coming due. Google technical interview is in 3 days. Use 2pm for system design. I\'ll pull your notes when you start.',
    icon: 'block', glyph: '▣', meta: 'Block', activity: 'Finding open slot…'
  },
];

let cmdIdx = 0, cmdPhase = 'idle', cmdChar = 0, cmdWordI = 0, cmdTimer = null, cmdUserPicked = false;
const cmdSearchEl   = document.getElementById('icwSearchText');
const cmdRespEl     = document.getElementById('icwIrisResp');
const cmdRespWrapEl = document.getElementById('icwRespWrap');
const cmdDemoPanel  = document.getElementById('icwDemoPanel');
const cmdSuggestions = document.getElementById('icwSuggestions');
const cmdActivityEl = document.getElementById('icwActivity');
const cmdActivityText = document.getElementById('icwActivityText');
const icwCardEl     = document.getElementById('icwCard');

function setCmdActivity(text, busy) {
  if (!cmdActivityText) return;
  cmdActivityText.textContent = text;
  if (cmdActivityEl) cmdActivityEl.classList.toggle('busy', !!busy);
}

function highlightCmdRow(idx) {
  if (!cmdSuggestions) return;
  cmdSuggestions.querySelectorAll('.icw-row').forEach((row, i) => {
    row.classList.toggle('active', i === idx);
  });
}

function buildCmdRows() {
  if (!cmdSuggestions) return;
  cmdSuggestions.innerHTML = cmdPairs.map((p, i) =>
    `<button type="button" class="icw-row" data-idx="${i}">
      <span class="icw-row-icon ${p.icon}">${p.glyph}</span>
      <span class="icw-row-main">${p.q}</span>
      <span class="icw-row-meta">${p.meta}</span>
    </button>`
  ).join('');
  cmdSuggestions.querySelectorAll('.icw-row').forEach(row => {
    row.addEventListener('click', () => {
      cmdUserPicked = true;
      playCmdAt(parseInt(row.dataset.idx, 10));
    });
  });
}

function clearCmdTimer() {
  if (cmdTimer) { clearTimeout(cmdTimer); cmdTimer = null; }
}

function scheduleCmd(fn, ms) {
  clearCmdTimer();
  cmdTimer = setTimeout(fn, ms);
}

function playCmdAt(idx) {
  clearCmdTimer();
  cmdIdx = idx;
  cmdChar = 0;
  cmdPhase = 'typing';
  if (cmdDemoPanel) cmdDemoPanel.classList.remove('show');
  if (cmdRespWrapEl) cmdRespWrapEl.classList.remove('active');
  if (cmdRespEl) cmdRespEl.textContent = '';
  highlightCmdRow(idx);
  runCmd();
}

function runCmd() {
  if (!cmdSearchEl) return;
  const pair = cmdPairs[cmdIdx];

  if (cmdPhase === 'idle') {
    setCmdActivity('Ready', false);
    cmdSearchEl.textContent = 'Ask Iris anything…';
    cmdSearchEl.classList.add('placeholder');
    highlightCmdRow(-1);
    scheduleCmd(() => {
      cmdIdx = (cmdIdx + 1) % cmdPairs.length;
      cmdPhase = 'typing';
      cmdChar = 0;
      highlightCmdRow(cmdIdx);
      runCmd();
    }, 2200);
    return;
  }

  if (cmdPhase === 'typing') {
    setCmdActivity('Listening…', true);
    cmdSearchEl.classList.remove('placeholder');
    cmdChar++;
    const typed = pair.q.slice(0, cmdChar);
    cmdSearchEl.innerHTML = typed + '<span class="icw-cursor"></span>';
    if (cmdChar < pair.q.length) {
      scheduleCmd(runCmd, 38 + Math.random() * 22);
    } else {
      cmdPhase = 'thinking';
      scheduleCmd(runCmd, 420);
    }
    return;
  }

  if (cmdPhase === 'thinking') {
    setCmdActivity(pair.activity, true);
    cmdSearchEl.innerHTML = pair.q;
    if (cmdDemoPanel) cmdDemoPanel.classList.add('show');
    if (cmdRespWrapEl) cmdRespWrapEl.classList.add('active');
    cmdPhase = 'resp';
    cmdWordI = 0;
    cmdRespEl.textContent = '';
    scheduleCmd(runCmd, 280);
    return;
  }

  if (cmdPhase === 'resp') {
    setCmdActivity('Thinking…', true);
    const words = pair.a.split(' ');
    if (cmdWordI < words.length) {
      cmdRespEl.textContent += (cmdWordI > 0 ? ' ' : '') + words[cmdWordI++];
      scheduleCmd(runCmd, 58 + Math.random() * 32);
    } else {
      setCmdActivity('Done', false);
      cmdPhase = 'hold';
      scheduleCmd(runCmd, cmdUserPicked ? 4200 : 3600);
    }
    return;
  }

  if (cmdPhase === 'hold') {
    cmdPhase = 'clearing';
    runCmd();
    return;
  }

  if (cmdPhase === 'clearing') {
    if (cmdDemoPanel) cmdDemoPanel.classList.remove('show');
    if (cmdRespWrapEl) cmdRespWrapEl.classList.remove('active');
    cmdRespEl.style.transition = 'opacity .25s';
    cmdRespEl.style.opacity = '0';
    scheduleCmd(() => {
      cmdRespEl.textContent = '';
      cmdRespEl.style.opacity = '1';
      cmdRespEl.style.transition = '';
      cmdChar = pair.q.length;
      cmdPhase = 'erasing';
      cmdUserPicked = false;
      runCmd();
    }, 320);
    return;
  }

  if (cmdPhase === 'erasing') {
    setCmdActivity('Listening…', true);
    cmdChar--;
    if (cmdChar > 0) {
      cmdSearchEl.innerHTML = pair.q.slice(0, cmdChar) + '<span class="icw-cursor"></span>';
      scheduleCmd(runCmd, 14);
    } else {
      cmdPhase = 'idle';
      cmdIdx = (cmdIdx + 1) % cmdPairs.length;
      runCmd();
    }
  }
}

buildCmdRows();

/* ════ HERO ANSWER SEQUENCE ════ */
const HERO_CHIPS = [
  { label: 'Canvas', badge: '4 due', dot: '#e44e3f' },
  { label: 'Gmail', badge: '12', dot: '#ea4335' },
  { label: 'Calendar', badge: '2 conflicts', dot: '#2997ff' },
  { label: 'Handshake', badge: '3', dot: '#5645d4' },
  { label: 'Discord', badge: '6', dot: '#5865f2' },
];
const HERO_LEAD = 'It\'s all piling up.';
const HERO_BEFORE = 'You ';
const HERO_OLD = 'don\'t know';
const HERO_NEW = 'know';
const HERO_AFTER = 'what to do first.';
const HERO_BREATHE = 600;
const HERO_SLIDE_MS = 720;
const HERO_REEL_SPIN_MS = 2350;
const HERO_REEL_LOGOS = [
  { id: 'google', logo: BRAND.google.logo, bg: BRAND.google.bg },
  { id: 'gmail', logo: APP.gmail.logo, bg: APP.gmail.bg },
  { id: 'canvas', logo: APP.canvas.logo, bg: APP.canvas.bg },
  { id: 'discord', logo: APP.discord.logo, bg: APP.discord.bg },
  { id: 'handshake', logo: APP.handshake.logo, bg: APP.handshake.bg },
  { id: 'iris', logo: 'iris-logo-tile.png', bg: 'rgba(86,69,212,.1)' },
];

let heroAnswerTimer = null;
let heroAnswerDone = false;
let cmdDemoStarted = false;

function scheduleHero(fn, ms) {
  if (heroAnswerTimer) clearTimeout(heroAnswerTimer);
  heroAnswerTimer = setTimeout(fn, ms);
}

function setHeroStep(step) {
  const proc = document.getElementById('heroProcess');
  if (!proc) return;
  const order = ['scan', 'sort', 'hub'];
  const idx = order.indexOf(step);
  proc.querySelectorAll('.hero-step').forEach((el, i) => {
    el.classList.toggle('active', el.dataset.step === step);
    el.classList.toggle('done', i < idx);
  });
  proc.querySelectorAll('.hero-step-line').forEach((el, i) => {
    el.classList.toggle('fill', i < idx);
  });
}

function buildHeroChips() {
  const rail = document.getElementById('heroChaosRail');
  if (!rail) return;
  rail.innerHTML = HERO_CHIPS.map(c =>
    `<span class="hero-chip"><span class="hero-chip-dot" style="background:${c.dot}"></span><span>${c.label}</span><span class="hero-chip-badge">${c.badge}</span></span>`
  ).join('');
}

function showHeroChips(done) {
  const chips = document.querySelectorAll('.hero-chip');
  let i = 0;
  function next() {
    if (i < chips.length) {
      chips[i++].classList.add('show');
      scheduleHero(next, 120);
    } else if (done) scheduleHero(done, 280);
  }
  next();
}

function typeHeroLine(el, text, i, speed, done) {
  if (!el) { if (done) done(); return; }
  el.innerHTML = text.slice(0, i) + '<span class="hero-cursor"></span>';
  if (i < text.length) {
    scheduleHero(() => typeHeroLine(el, text, i + 1, speed, done), speed + Math.random() * 14);
  } else {
    el.textContent = text;
    if (done) done();
  }
}

function buildHeroSentence() {
  const el = document.getElementById('heroSentence');
  if (!el || el.dataset.built) return;
  el.dataset.built = '1';
  el.innerHTML =
    `<span class="headline-line">` +
      `<span class="headline-before">${HERO_BEFORE}</span>` +
      `<span class="headline-slot" id="heroSlot">` +
        `<span class="headline-slot-track" id="heroSlotTrack">` +
          `<span class="headline-slot-word">${HERO_OLD}</span>` +
          `<span class="headline-slot-word is-accent">${HERO_NEW}</span>` +
        `</span>` +
      `</span>` +
    `</span>` +
    `<span class="headline-line headline-line-2">${HERO_AFTER}</span>`;
  if (document.fonts?.ready) {
    document.fonts.ready.then(lockSlotWidth);
  } else {
    lockSlotWidth();
  }
}

function measureSlotWordWidth(sentence, text) {
  const probe = document.createElement('span');
  probe.className = 'headline-slot-word';
  probe.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;pointer-events:none;';
  sentence.appendChild(probe);
  const cs = getComputedStyle(sentence);
  probe.style.fontSize = cs.fontSize;
  probe.style.fontWeight = cs.fontWeight;
  probe.style.fontFamily = cs.fontFamily;
  probe.style.letterSpacing = cs.letterSpacing;
  probe.textContent = text;
  const w = probe.offsetWidth;
  probe.remove();
  return w;
}

function lockSlotWidth(useNew) {
  const slot = document.getElementById('heroSlot');
  const sentence = document.getElementById('heroSentence');
  if (!slot || !sentence) return;
  const wOld = measureSlotWordWidth(sentence, HERO_OLD);
  const wNew = measureSlotWordWidth(sentence, HERO_NEW);
  slot.dataset.wOld = String(wOld);
  slot.dataset.wNew = String(wNew);
  slot.style.width = (useNew ? wNew : wOld) + 'px';
}

function shrinkSlotToKnow() {
  const slot = document.getElementById('heroSlot');
  if (!slot?.dataset.wNew) return;
  slot.style.width = slot.dataset.wNew + 'px';
}

function revealHeroSentence(onDone) {
  buildHeroSentence();
  const el = document.getElementById('heroSentence');
  if (!el) { if (onDone) onDone(); return; }
  requestAnimationFrame(() => el.classList.add('show'));
  scheduleHero(() => { if (onDone) onDone(); }, 460);
}

function setHeroSentenceResolved() {
  const lead = document.getElementById('heroLead');
  if (lead) lead.textContent = HERO_LEAD;
  buildHeroSentence();
  const slot = document.getElementById('heroSlot');
  const el = document.getElementById('heroSentence');
  if (slot) {
    slot.classList.add('slid');
    shrinkSlotToKnow();
  }
  if (el) el.classList.add('resolved', 'show');
  setHeroReelResolved();
}

function buildHeroReel() {
  const track = document.getElementById('heroReelTrack');
  if (!track || track.dataset.built) return;
  track.dataset.built = '1';
  const spinSet = HERO_REEL_LOGOS.slice(0, -1);
  const iris = HERO_REEL_LOGOS[HERO_REEL_LOGOS.length - 1];
  const faces = [...spinSet, ...spinSet, iris];
  track.innerHTML = faces.map(face => {
    const img = face.id === 'iris'
      ? `<img src="${face.logo}" alt="Iris" draggable="false">`
      : `<img src="${face.logo}" alt="" draggable="false">`;
    return `<div class="hero-reel-face${face.id === 'iris' ? ' is-iris' : ''}" style="background:${face.bg}">${img}</div>`;
  }).join('');
}

function setHeroReelOffset(track, viewport, index) {
  if (!track || !viewport) return;
  const faceSize = viewport.offsetWidth;
  track.style.transform = `translate3d(-${index * faceSize}px,0,0)`;
}

function setHeroReelResolved() {
  buildHeroReel();
  const wrap = document.getElementById('heroReelWrap');
  const track = document.getElementById('heroReelTrack');
  const viewport = document.getElementById('heroReelViewport');
  const faces = track?.querySelectorAll('.hero-reel-face');
  if (!wrap || !track || !viewport || !faces?.length) return;
  setHeroReelOffset(track, viewport, faces.length - 1);
  wrap.classList.add('show', 'landed');
}

function spinHeroReel(onDone) {
  buildHeroReel();
  const wrap = document.getElementById('heroReelWrap');
  const prism = document.getElementById('heroReelPrism');
  const track = document.getElementById('heroReelTrack');
  const viewport = document.getElementById('heroReelViewport');
  const faces = track?.querySelectorAll('.hero-reel-face');
  if (!wrap || !track || !viewport || !faces?.length) { if (onDone) onDone(); return; }

  const irisIdx = faces.length - 1;
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    prism?.classList.remove('spinning');
    track.style.removeProperty('will-change');
    wrap.classList.add('landed');
    scheduleHero(() => { if (onDone) onDone(); }, 320);
  };

  requestAnimationFrame(() => {
    wrap.classList.add('show');
    prism?.classList.add('spinning');
    track.style.transition = `transform ${HERO_REEL_SPIN_MS}ms cubic-bezier(.14,.92,.18,1)`;
    track.style.willChange = 'transform';
    requestAnimationFrame(() => setHeroReelOffset(track, viewport, irisIdx));
  });

  const fallback = setTimeout(finish, HERO_REEL_SPIN_MS + 180);
  track.addEventListener('transitionend', (e) => {
    if (e.propertyName !== 'transform') return;
    clearTimeout(fallback);
    finish();
  }, { once: true });
}

function flipHeroWord(onDone) {
  const slot = document.getElementById('heroSlot');
  const track = document.getElementById('heroSlotTrack');
  const el = document.getElementById('heroSentence');
  if (!slot) { if (onDone) onDone(); return; }
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    track?.style.removeProperty('will-change');
    if (onDone) onDone();
  };
  track?.style.setProperty('will-change', 'transform');
  requestAnimationFrame(() => {
    slot.classList.add('slid');
    shrinkSlotToKnow();
  });
  el?.classList.add('resolved');
  const fallback = setTimeout(finish, HERO_SLIDE_MS + 120);
  track?.addEventListener('transitionend', (e) => {
    if (e.propertyName !== 'transform') return;
    clearTimeout(fallback);
    finish();
  }, { once: true });
}

function runHeroAnswerInstant(onDone) {
  buildHeroChips();
  document.querySelectorAll('.hero-chip').forEach(c => c.classList.add('show'));
  setHeroStep('hub');
  document.getElementById('heroProcess')?.querySelectorAll('.hero-step-line').forEach(l => l.classList.add('fill'));
  setHeroSentenceResolved();
  heroAnswerDone = true;
  if (onDone) onDone();
}

function runHeroAnswer(onDone) {
  if (heroAnswerDone) { if (onDone) onDone(); return; }
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    runHeroAnswerInstant(onDone);
    return;
  }

  buildHeroChips();
  const rail = document.getElementById('heroChaosRail');
  const lead = document.getElementById('heroLead');
  const sentence = document.getElementById('heroSentence');
  if (!rail || !lead || !sentence) return;

  buildHeroSentence();
  setHeroStep('scan');
  showHeroChips(() => {
    typeHeroLine(lead, HERO_LEAD, 0, 32, () => {
      scheduleHero(() => {
        revealHeroSentence(() => {
          setHeroStep('sort');
          scheduleHero(() => {
            rail.classList.add('collapsed');
            flipHeroWord(() => {
              setHeroStep('hub');
              spinHeroReel(() => {
                heroAnswerDone = true;
                if (onDone) onDone();
              });
            });
          }, HERO_BREATHE);
        });
      }, 450);
    });
  });
}

function startCmdDemo() {
  if (cmdDemoStarted) return;
  cmdDemoStarted = true;
  scheduleCmd(() => { cmdPhase = 'typing'; cmdChar = 0; highlightCmdRow(cmdIdx); runCmd(); }, 400);
}

function onIrisOpen() {
  const site = document.getElementById('create-iris');
  if (!site || site.dataset.heroStarted) return;
  site.dataset.heroStarted = '1';
  runHeroAnswer(startCmdDemo);
}

if (icwCardEl) {
  const stage = icwCardEl.closest('.create-product-stage');
  if (stage) {
    stage.addEventListener('mousemove', e => {
      const r = stage.getBoundingClientRect();
      const dx = (e.clientX - r.left) / r.width - .5;
      const dy = (e.clientY - r.top) / r.height - .5;
      icwCardEl.style.transform = `perspective(1200px) rotateX(${-dy * 5}deg) rotateY(${dx * 5}deg) scale(1.01)`;
    });
    stage.addEventListener('mouseleave', () => { icwCardEl.style.transform = ''; });
  }
}

initLanding();

/* ════ BENTO SPOTLIGHT STYLE ════ */
const s=document.createElement('style');
s.textContent='.spotlight-active::after{content:"";position:absolute;width:380px;height:380px;border-radius:50%;background:radial-gradient(circle,var(--spotlight,rgba(255,255,255,.05)) 0%,transparent 70%);left:var(--sx,50%);top:var(--sy,50%);transform:translate(-50%,-50%);pointer-events:none;}';
document.head.appendChild(s);