/* ════ CHAOS EXPERIENCE ════ */
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

const NOTIFS = [
  {id:'n0',app:'canvas',name:'Canvas',time:'just now',title:'CSE 101: Problem Set 4',body:'Due Thursday 11:59 PM · 8 problems · 5% of grade',action:'Open',badge:'5% grade',pos:{l:22,t:28},scale:1,unread:1,deadlines:1,platforms:1},
  {id:'n1',app:'calendar',name:'Google Calendar',time:'2 min ago',title:'ACM Board Meeting',body:'Tuesday 6 PM · Knight Engineering G10',action:'View',pos:{l:52,t:24},scale:1,unread:2,deadlines:1,platforms:2},
  {id:'n2',app:'canvas',name:'Canvas',time:'5 min ago',title:'Senior Design: Milestone 2',body:'Due Friday · Team deliverable · 20% of project grade',action:'Open',badge:'20%',pos:{l:30,t:42},scale:1,unread:3,deadlines:2,platforms:2},
  {id:'n3',app:'handshake',brand:'google',name:'Handshake · Google',time:'8 min ago',title:'Google Campus Recruiting',body:'Info session tonight 5 PM · Resume recommended',action:'RSVP',badge:'Tonight',pos:{l:58,t:38},scale:1,unread:4,deadlines:2,platforms:3},
  {id:'n4',app:'gradescope',name:'Gradescope',time:'12 min ago',title:'PA5: Web Server is Now Live',body:'Due Friday 11:59 PM · Est. 12–15 hours of work',action:'View',badge:'~15 hrs',pos:{l:8,t:18},scale:1.08,unread:5,deadlines:3,platforms:4},
  {id:'n5',app:'gmail',name:'Gmail · Prof. Kim',time:'18 min ago',title:'Undergrad RA Opening, Fall 2026',body:'Email CV + transcript by November 1st',action:'Reply',badge:'Nov 1',pos:{l:62,t:52},scale:1.08,unread:6,deadlines:4,platforms:5},
  {id:'n8',app:'slack',name:'Slack · #acm-general',time:'32 min ago',title:'ACM Meeting moved, conflicts with study block',body:'@everyone Tuesday 6 PM demos required. Overlaps your focus time.',action:'Reply',badge:'Conflict',pos:{l:38,t:28},scale:1.18,unread:10,deadlines:6,platforms:6},
  {id:'n9',app:'canvas',name:'Canvas',time:'36 min ago',title:'CSE 110: Quiz 3 opens tomorrow',body:'30-minute timed · No second attempts · Lectures 8–11',action:'Review',pos:{l:48,t:48},scale:1.18,unread:11,deadlines:7,platforms:6},
  {id:'n10',app:'discord',name:'Discord · HackUCSD',time:'40 min ago',title:'Team formation closes in 3 hours',body:'Find your hackathon team or get auto-assigned',action:'Join',pos:{l:4,t:18},scale:1.22,unread:13,deadlines:7,platforms:7},
  {id:'n11',app:'calendar',name:'Google Calendar',time:'48 min ago',title:'Office Hours with CSE TA',body:'Monday 11 AM · Engineering 2106',action:'Add',pos:{l:68,t:22},scale:1.22,unread:14,deadlines:7,platforms:7},
  {id:'n12',app:'linkedin',name:'LinkedIn',time:'1h ago',title:'6 new internship matches',body:'Spotify, Figma, Rippling, Vercel, Notion + 1 more',action:'View',pos:{l:30,t:8},scale:1.26,unread:16,deadlines:8,platforms:8},
  {id:'n13',app:'handshake',name:'Handshake',time:'1.2h ago',title:'Career Fair RSVP closes Wednesday',body:'200+ companies · Bring resume · Limited walk-ins',action:'RSVP',pos:{l:55,t:62},scale:1.28,unread:17,deadlines:9,platforms:8},
  {id:'n14',app:'gmail',brand:'stripe',name:'Gmail · Stripe',time:'1.5h ago',title:'Technical Interview: confirm by Wednesday',body:'48 hour window to schedule your technical screen',action:'Reply',badge:'48hr',pos:{l:72,t:45},scale:1.3,unread:19,deadlines:10,platforms:8},
  {id:'n15',app:'slack',name:'Slack · #research-lab',time:'2h ago',title:'Lab meeting, mandatory Thursday 4 PM',body:'Attendance required · Conflicts with interview prep',action:'Reply',badge:'Conflict',pos:{l:14,t:30},scale:1.32,unread:21,deadlines:10,platforms:8},
  {id:'n16',app:'gmail',brand:'github',name:'GitHub · Senior Design',time:'2.5h ago',title:'Team PR needs your review',body:'Senior Design · 3 requested changes · Due tomorrow',action:'Review',pos:{l:60,t:64},scale:1.35,unread:22,deadlines:11,platforms:9},
  {id:'n17',app:'imessage',name:'iMessage · Study Group',time:'3h ago',title:'ECE 35 study session tonight 8 PM',body:'Zoom link in thread · Bring lab report questions',action:'Reply',pos:{l:60,t:12},scale:1.38,unread:25,deadlines:11,platforms:9},
  {id:'n18',app:'calendar',name:'Google Calendar',time:'3.2h ago',title:'Prof. Martinez Office Hours',body:'Thursday 2–4 PM · CS Building 120 · Walk-ins welcome',action:'Add',badge:'Thu 2PM',pos:{l:8,t:58},scale:1.4,unread:26,deadlines:11,platforms:9},
  {id:'n19',app:'gmail',brand:'research',name:'Gmail · Prof. Chen Lab',time:'3.5h ago',title:'Research lab interview, Thursday 3 PM',body:'Prof. Chen lab · Bring CV and a one-page research summary',action:'Reply',badge:'Thu 3PM',pos:{l:14,t:52},scale:1.42,unread:27,deadlines:12,platforms:9},
];

const GAPS = [100,700,650,650,650,200,380,380,380,380,380,180,180,180,180,180,180,180,180,200];

let chaosPhase = 'calm';
let captionLocked = false;
let chaosComplete = false;
let chaosTimers = [];
let driftId = null;
let driftT = 0;
const cardMotion = new Map();
let dragAttempts = 0;
const spawnedCards = [];

function schedule(fn, ms) {
  const t = setTimeout(fn, ms);
  chaosTimers.push(t);
  return t;
}

function setCaption(l1, l2, cls, l2Bold, l2Cls) {
  if (captionLocked) return;
  const line1 = document.getElementById('ciLine1');
  const line2 = document.getElementById('ciLine2');
  line1.classList.remove('show');
  line2.classList.remove('show');
  const cap = document.querySelector('.ci-caption');
  setTimeout(() => {
    if (captionLocked) return;
    line1.textContent = l1 || '';
    line2.textContent = l2 || '';
    line1.className = 'ci-caption-line' + (cls ? ' ' + cls : '');
    line2.className = l2Bold ? 'ci-caption-line' : ('ci-caption-sub' + (l2Cls ? ' ' + l2Cls : ''));
    if (cap) {
      cap.classList.remove('iris-reveal', 'fade-out');
      cap.classList.toggle('hero-mode', !!(cls && cls.indexOf('hero') !== -1));
    }
    if (l1) line1.classList.add('show');
    if (l2) line2.classList.add('show');
  }, 200);
}

const IRIS_WORD = 'IRIS';
const IRIS_LETTER_MS = [220, 170, 170, 190];
const BUDDY_TYPING_MS = 1100;
const BUDDY_CHAR_MS = 72;
const USER_TYPE_MS = 88;
const MSG_PAUSE_MS = 520;
const CARDS_AFTER_QUESTION_MS = 450;
const IRIS_QUESTION_HOLD_MS = 900;
const IRIS_HANDOFF_MS = 700;
const IRIS_BEAT_MS = 200;
const IRIS_PRE_DOT_MS = 900;
const IRIS_SPARKLE_BEAT_MS = 380;
const IRIS_BLINK_MS = 1050;
const CARD_EXIT_MS = 1200;
const CARD_EXIT_PAUSE = 350;
const USER_SEND_PAUSE_MS = 480;

const INTRO_PRE_CARDS = [
  { who: 'buddy', text: 'Yo you coming to the party tonight?' },
  { who: 'me', text: 'Can\'t, I got work to do' },
  { who: 'buddy', text: 'What work?' },
];

const INTRO_POST_CARDS = [
  { who: 'me', text: 'A lot man. I lowkey got so much stuff piling up right now. I don\'t even know where to start.', blur: true },
  { who: 'buddy', text: 'Ya I was like that too. Just use Iris.' },
  { who: 'me', text: 'Iris?' },
];

function fadeOutChaos(onDone) {
  captionLocked = true;
  const veil = document.getElementById('chaosVeil');
  const intro = document.getElementById('chaos-intro');

  if (intro) intro.classList.remove('thread-focus');

  spawnedCards.forEach(el => {
    el.style.transition = 'opacity 1.45s var(--iris-ease), transform 1.45s var(--iris-ease)';
    const i = NOTIFS.findIndex(n => n.id === el.dataset.id);
    const s = i >= 0 ? NOTIFS[i].scale : 1;
    el.style.opacity = '0';
    el.style.transform = `scale(${s * 0.94})`;
    el.style.filter = 'none';
  });

  veil.classList.add('show', 'chaos-clear');

  schedule(() => {
    veil.classList.remove('chaos-clear');
    veil.classList.add('iris-blur');
    if (onDone) onDone();
  }, CARD_EXIT_MS + CARD_EXIT_PAUSE);
}

function transitionHandoff(onDone) {
  const thread = document.getElementById('ciThread');
  const compose = document.getElementById('ciThreadCompose');
  const intro = document.getElementById('chaos-intro');
  const veil = document.getElementById('chaosVeil');

  if (compose) compose.classList.remove('show', 'ready', 'sent');

  if (thread) {
    const mine = thread.querySelectorAll('.ci-msg.from-me');
    const last = mine[mine.length - 1];
    if (last) last.classList.add('iris-handoff');
  }
  if (intro) intro.classList.add('iris-handoff');
  if (veil) veil.classList.add('show');

  schedule(() => {
    if (thread) {
      thread.classList.add('handoff-out');
      thread.classList.remove('replying');
    }
    schedule(onDone, IRIS_HANDOFF_MS);
  }, 480);
}

function irisCharHtml(str) {
  return [...str].map(c => '<span class="iris-char">' + c + '</span>').join('');
}

const IRIS_SPARKLE_HTML = '<span class="iris-sparkle in" id="irisSparkle" aria-hidden="true"></span>';

function triggerSparkleFlash(onDone) {
  const sparkle = document.getElementById('irisSparkle');
  const flash = document.getElementById('irisSparkFlash');
  const cap = document.querySelector('.ci-caption');
  const intro = document.getElementById('chaos-intro');
  const reduced = reducedMotion();

  if (reduced) {
    schedule(onDone, 400);
    return;
  }

  let fx = 50;
  let fy = 50;
  if (sparkle && intro) {
    const ir = intro.getBoundingClientRect();
    const sr = sparkle.getBoundingClientRect();
    fx = ((sr.left + sr.width / 2 - ir.left) / ir.width) * 100;
    fy = ((sr.top + sr.height / 2 - ir.top) / ir.height) * 100;
  }

  if (flash) {
    flash.style.setProperty('--fx', fx + '%');
    flash.style.setProperty('--fy', fy + '%');
    flash.classList.remove('burst');
    void flash.offsetWidth;
    flash.classList.add('burst');
  }
  if (sparkle) sparkle.classList.add('blink');
  if (cap) cap.classList.add('iris-flash-out');
  if (intro) intro.classList.add('spark-to-site');

  schedule(onDone, IRIS_BLINK_MS);
}

function typeIrisWord(el, text, delays, onDone) {
  el.textContent = '';
  el.classList.add('typing');
  let i = 0;
  const tick = () => {
    if (chaosComplete) return;
    el.textContent = text.slice(0, i + 1);
    i++;
    if (i < text.length) schedule(tick, delays[i - 1] || 140);
    else {
      el.classList.remove('typing');
      el.classList.add('done');
      if (onDone) onDone();
    }
  };
  tick();
}

function showIrisReveal(onDone) {
  const cap = document.querySelector('.ci-caption');
  const line1 = document.getElementById('ciLine1');
  const line2 = document.getElementById('ciLine2');
  const thread = document.getElementById('ciThread');
  const reduced = reducedMotion();

  if (thread) {
    thread.classList.add('fade-out');
    thread.style.display = 'none';
  }

  line1.classList.remove('show');
  line2.classList.remove('show');

  cap.classList.add('hero-mode', 'iris-reveal');
  cap.classList.remove('fade-out', 'cooked-mode');
  cap.style.opacity = '1';
  cap.style.zIndex = '50';
  cap.style.visibility = 'visible';
  line1.textContent = '';
  line1.className = 'ci-caption-line iris-type';
  line2.textContent = '';
  line2.className = 'ci-caption-sub';

  function finishIrisReveal() {
    schedule(() => {
      line1.classList.remove('typing');
      line1.classList.add('done', 'has-dot');
      line1.innerHTML = irisCharHtml(IRIS_WORD) + IRIS_SPARKLE_HTML;
      schedule(() => triggerSparkleFlash(onDone), IRIS_SPARKLE_BEAT_MS);
    }, IRIS_PRE_DOT_MS);
  }

  const startTyping = () => {
    line1.classList.add('show');
    if (reduced) {
      line1.textContent = IRIS_WORD;
      line1.classList.add('done');
      finishIrisReveal();
    } else {
      typeIrisWord(line1, IRIS_WORD, IRIS_LETTER_MS, finishIrisReveal);
    }
  };

  requestAnimationFrame(() => requestAnimationFrame(startTyping));
}

function setHUD(n, d, p) {
  const hu = document.getElementById('hdUnread');
  const hd = document.getElementById('hdDeadlines');
  const hp = document.getElementById('hdPlatforms');
  if (!hu) return;
  hu.textContent = n;
  hd.textContent = d;
  hp.textContent = p;
  hu.className = 'ch-hud-num' + (n > 18 ? ' crit' : n > 8 ? ' warn' : '');
  hd.className = 'ch-hud-num' + (d > 8 ? ' crit' : d > 5 ? ' warn' : '');
}

function makeDraggable(el) {
  let sx, sy, sl, st, on = false;
  const down = e => {
    if (chaosPhase === 'frozen') return;
    e.preventDefault();
    const t = e.touches ? e.touches[0] : e;
    on = true;
    sx = t.clientX;
    sy = t.clientY;
    const r = el.getBoundingClientRect();
    const p = el.offsetParent.getBoundingClientRect();
    sl = r.left - p.left;
    st = r.top - p.top;
    el.style.left = sl + 'px';
    el.style.top = st + 'px';
    el.classList.add('drag');
    dragAttempts++;
  };
  const move = e => {
    if (!on) return;
    e.preventDefault();
    const t = e.touches ? e.touches[0] : e;
    el.style.left = (sl + t.clientX - sx) + 'px';
    el.style.top = (st + t.clientY - sy) + 'px';
  };
  const up = () => { if (!on) return; on = false; el.classList.remove('drag'); };
  el.addEventListener('mousedown', down);
  el.addEventListener('touchstart', down, {passive:false});
  window.addEventListener('mousemove', move);
  window.addEventListener('touchmove', move, {passive:false});
  window.addEventListener('mouseup', up);
  window.addEventListener('touchend', up);
}

function spawnCard(n, i) {
  const d = NOTIFS[i];
  const vis = cardVisual(d);
  const a = APP[d.app];
  const el = document.createElement('div');
  el.className = 'cn-card';
  el.dataset.id = d.id;
  el.style.left = d.pos.l + '%';
  el.style.top = d.pos.t + '%';
  el.style.zIndex = 10 + i;
  el.style.transform = `scale(${d.scale})`;
  el.innerHTML = `
    <div class="cn-header">
      <div class="cn-icon" style="background:${vis.bg}">${logoImg(vis.logo, 28)}</div>
      <div class="cn-app">${d.name}</div>
      <div class="cn-time-label">${d.time}</div>
    </div>
    <div class="cn-title">${d.title}</div>
    <div class="cn-body">${d.body}</div>
    <div class="cn-footer">
      <div class="cn-action">${d.action}</div>
      ${d.badge ? `<div class="cn-badge" style="background:${a.bg};color:${a.bc}">${d.badge}</div>` : ''}
    </div>`;
  document.getElementById('ciCards').appendChild(el);
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('in')));
  makeDraggable(el);
  spawnedCards.push(el);

  if (i >= 4) document.getElementById('chaosHUD').classList.add('show');
  setHUD(d.unread, d.deadlines, d.platforms);
  if (chaosPhase === 'calm') chaosPhase = 'busy';
  if (i >= 5) chaosPhase = 'chaos';
  initCardMotion(el, i);
  el.classList.add('bouncing');
  startDrift();
}

function initCardMotion(el, i) {
  if (cardMotion.has(el)) return;
  const layer = Math.min(i, 14);
  cardMotion.set(el, {
    phaseX: Math.random() * Math.PI * 2,
    phaseY: Math.random() * Math.PI * 2,
    ampX: 12 + layer * 0.9 + Math.random() * 10,
    ampY: 12 + layer * 0.9 + Math.random() * 10,
    speedX: 0.014 + Math.random() * 0.022,
    speedY: 0.011 + Math.random() * 0.018,
    rot: (Math.random() - 0.5) * 1.6,
  });
}

function applyCardBounce(el, i, t) {
  const m = cardMotion.get(el);
  if (!m || el.classList.contains('drag') || el.classList.contains('frozen')) return;
  const intensity = chaosPhase === 'chaos' ? 1 : chaosPhase === 'busy' ? 0.72 : 0;
  if (!intensity) return;
  const jx = Math.sin(t * m.speedX + m.phaseX) * m.ampX * intensity;
  const jy = Math.cos(t * m.speedY + m.phaseY) * m.ampY * intensity;
  const r = Math.sin(t * 0.008 + m.phaseX) * m.rot * intensity;
  const s = NOTIFS[i]?.scale || 1;
  el.style.transform = `scale(${s}) translate(${jx}px,${jy}px) rotate(${r}deg)`;
}

function startDrift() {
  spawnedCards.forEach((el, i) => initCardMotion(el, i));
  if (driftId) return;
  function drift() {
    if (chaosPhase !== 'chaos' && chaosPhase !== 'busy') return;
    driftT++;
    spawnedCards.forEach((el, i) => applyCardBounce(el, i, driftT));
    driftId = requestAnimationFrame(drift);
  };
  driftId = requestAnimationFrame(drift);
}

function stopDrift() {
  if (driftId) { cancelAnimationFrame(driftId); driftId = null; }
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function beginRecognition() {
  chaosPhase = 'frozen';
  stopDrift();
  spawnedCards.forEach(el => {
    el.classList.add('frozen');
    const i = NOTIFS.findIndex(n => n.id === el.dataset.id);
    const s = i >= 0 ? NOTIFS[i].scale : 1;
    el.style.transform = `scale(${s})`;
  });
  document.getElementById('chaosHUD').style.opacity = '0';
}

function scrollThread() {
  const msgs = document.getElementById('ciThreadMsgs');
  if (msgs) msgs.scrollTop = msgs.scrollHeight;
}

function typeInto(el, text, ms, onDone) {
  let i = 0;
  const tick = () => {
    el.textContent = text.slice(0, i + 1);
    scrollThread();
    i++;
    if (i < text.length) schedule(tick, ms);
    else if (onDone) onDone();
  };
  tick();
}

function buddySay(text, onDone) {
  const msgs = document.getElementById('ciThreadMsgs');
  const reduced = reducedMotion();
  if (!msgs) { if (onDone) onDone(); return; }

  const typing = document.createElement('div');
  typing.className = 'ci-msg from-buddy';
  typing.innerHTML = '<div class="ci-typing-bubble"><span></span><span></span><span></span></div>';
  msgs.appendChild(typing);
  requestAnimationFrame(() => typing.classList.add('show'));
  scrollThread();

  const deliver = () => {
    typing.remove();
    const wrap = document.createElement('div');
    wrap.className = 'ci-msg from-buddy';
    const bubble = document.createElement('div');
    bubble.className = 'ci-bubble from-buddy';
    wrap.appendChild(bubble);
    msgs.appendChild(wrap);
    requestAnimationFrame(() => wrap.classList.add('show'));
    scrollThread();
    if (reduced) {
      bubble.textContent = text;
      if (onDone) onDone();
    } else {
      typeInto(bubble, text, BUDDY_CHAR_MS, onDone);
    }
  };

  if (reduced) deliver();
  else schedule(deliver, BUDDY_TYPING_MS);
}

function userSay(text, onDone, opts) {
  const thread = document.getElementById('ciThread');
  const compose = document.getElementById('ciThreadCompose');
  const field = document.getElementById('ciComposeField');
  const cursor = document.getElementById('ciComposeCursor');
  const msgs = document.getElementById('ciThreadMsgs');
  const intro = document.getElementById('chaos-intro');
  const reduced = reducedMotion();

  if (!compose || !field || !msgs) { if (onDone) onDone(); return; }

  const setDraft = (draft) => {
    field.classList.remove('empty');
    field.textContent = draft;
    if (cursor) field.appendChild(cursor);
  };

  if (opts && opts.blur && intro) intro.classList.add('thread-focus');
  if (thread) thread.classList.add('replying');
  compose.classList.add('show');

  const sendBubble = () => {
    compose.classList.add('sent');
    schedule(() => {
      compose.classList.remove('show', 'ready', 'sent');
      field.textContent = '';
      field.classList.add('empty');
      if (cursor) field.appendChild(cursor);
      const wrap = document.createElement('div');
      wrap.className = 'ci-msg from-me';
      wrap.innerHTML = '<div class="ci-bubble from-me">' + text + '</div>';
      msgs.appendChild(wrap);
      requestAnimationFrame(() => wrap.classList.add('show'));
      scrollThread();
      if (thread) thread.classList.remove('replying');
      if (onDone) onDone();
    }, USER_SEND_PAUSE_MS);
  };

  if (reduced) {
    setDraft(text);
    compose.classList.add('ready');
    sendBubble();
    return;
  }

  setDraft('');
  let i = 0;
  const tick = () => {
    setDraft(text.slice(0, i + 1));
    i++;
    if (i < text.length) schedule(tick, USER_TYPE_MS);
    else {
      compose.classList.add('ready');
      schedule(sendBubble, 420);
    }
  };
  tick();
}

function runDialogueSteps(steps, index, onComplete) {
  if (index >= steps.length) {
    if (onComplete) onComplete();
    return;
  }
  const step = steps[index];
  const next = () => schedule(() => runDialogueSteps(steps, index + 1, onComplete), step.pause != null ? step.pause : MSG_PAUSE_MS);
  if (step.who === 'buddy') buddySay(step.text, next);
  else userSay(step.text, next, { blur: !!step.blur });
}

function spawnChaosCards(onAllSpawned) {
  chaosPhase = 'busy';
  let cumulative = CARDS_AFTER_QUESTION_MS;
  NOTIFS.forEach((_, idx) => {
    cumulative += GAPS[idx] || 400;
    schedule(() => {
      if (chaosPhase === 'frozen') return;
      spawnCard(null, idx);
      if (idx === NOTIFS.length - 1) schedule(onAllSpawned, 700);
    }, cumulative);
  });
}

function runIrisTransition() {
  const reduced = reducedMotion();
  schedule(() => {
    transitionHandoff(() => {
      beginRecognition();
      captionLocked = true;
      const veil = document.getElementById('chaosVeil');
      if (veil) {
        veil.classList.add('show');
        veil.classList.remove('chaos-clear');
      }
      showIrisReveal(() => schedule(() => runCinematicSequence(reduced), reduced ? 250 : 450));
    });
  }, IRIS_QUESTION_HOLD_MS);
}

function runPostCardDialogue() {
  runDialogueSteps(INTRO_POST_CARDS, 0, runIrisTransition);
}

function runChaosIntro() {
  const thread = document.getElementById('ciThread');
  if (thread) thread.classList.add('show');

  if (reducedMotion()) {
    runDialogueSteps(INTRO_PRE_CARDS, 0, () => {
      NOTIFS.forEach((_, i) => spawnCard(null, i));
      schedule(runPostCardDialogue, 500);
    });
    return;
  }

  runDialogueSteps(INTRO_PRE_CARDS, 0, () => {
    spawnChaosCards(runPostCardDialogue);
  });
}

const SEQ = { rec: 1400, org: 0, collapse: 0, morph: 2200, morphHold: 0 };
const T_ORG = 0;
const T_ORG_END = T_ORG + SEQ.org;
const T_COLLAPSE_END = T_ORG_END + SEQ.collapse;
const T_MORPH_START = T_COLLAPSE_END + SEQ.morphHold;
const T_TOTAL = T_MORPH_START + SEQ.morph;

const CLUSTER_KEYS = ['academic', 'recruiting', 'events', 'communication'];
const EXTRA_LINKS = [['n14', 'n1'], ['n8', 'n14'], ['n14', 'n5']];

let sequenceRafId = null;
let seqNodes = [];
let seqParticles = [];
let seqStarted = false;
let morphOnly = false;
let seqBox = null;
let seqCx = 0;
let seqCy = 0;

const fluidEase = (function() {
  const x1 = 0.16, y1 = 1, x2 = 0.3, y2 = 1;
  return function(x) {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const t2 = t * t, t3 = t2 * t, omt = 1 - t, omt2 = omt * omt;
      const bx = 3 * omt2 * t * x1 + 3 * omt * t2 * x2 + t3;
      const dbx = 3 * omt2 * x1 + 6 * omt * t * (x2 - x1) + 3 * t2 * (1 - x2);
      if (Math.abs(dbx) < 1e-6) break;
      t -= (bx - x) / dbx;
    }
    const t2 = t * t, t3 = t2 * t, omt = 1 - t;
    return 3 * omt * omt * t * y1 + 3 * omt * t * t2 * y2 + t3;
  };
})();

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function cardCluster(notif) {
  const id = notif.id;
  const app = notif.app;
  if (['canvas', 'gradescope'].includes(app)) return 'academic';
  if (['handshake', 'linkedin'].includes(app)) return 'recruiting';
  if (['n14', 'n12', 'n13'].includes(id)) return 'recruiting';
  if (['calendar', 'discord'].includes(app)) return 'events';
  return 'communication';
}

function clusterCentroids(cx, cy, w, h) {
  const ox = w * 0.22;
  const oy = h * 0.17;
  return {
    academic: { x: cx - ox, y: cy - oy },
    recruiting: { x: cx + ox, y: cy - oy },
    events: { x: cx - ox, y: cy + oy },
    communication: { x: cx + ox, y: cy + oy },
  };
}

function getNotif(el) {
  const i = NOTIFS.findIndex(n => n.id === el.dataset.id);
  return i >= 0 ? NOTIFS[i] : { id: el.dataset.id, app: 'gmail', scale: 1 };
}

function buildSequenceNodes() {
  const container = document.getElementById('ciCards');
  seqBox = container.getBoundingClientRect();
  seqCx = seqBox.width / 2;
  seqCy = seqBox.height / 2;
  const cards = spawnedCards.filter(el => !el.classList.contains('buried'));
  return cards.map((el, i) => {
    const notif = getNotif(el);
    const rect = el.getBoundingClientRect();
    const x = rect.left + rect.width / 2 - seqBox.left;
    const y = rect.top + rect.height / 2 - seqBox.top;
    const scale = notif.scale || 1;
    el.style.transition = 'none';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.transform = `translate(-50%,-50%) scale(${scale})`;
    el.classList.add('seq-card', 'frozen');
    return {
      el,
      id: notif.id,
      cluster: cardCluster(notif),
      origX: x,
      origY: y,
      x,
      y,
      baseScale: scale,
      scale,
      opacity: 1,
      angle: Math.atan2(y - seqCy, x - seqCx),
      radius: Math.hypot(x - seqCx, y - seqCy),
      spinDir: i % 2 === 0 ? 1 : -1,
      reactPhase: i * 0.65,
      collapseInit: false,
      isParticle: false,
      vx: 0,
      vy: 0,
      trail: [],
    };
  });
}

function nodeById(id) {
  return seqNodes.find(n => n.id === id);
}

function convertToParticle(node) {
  if (node.isParticle) return;
  node.isParticle = true;
  node.radius = Math.hypot(node.x - seqCx, node.y - seqCy) || 24;
  node.angle = Math.atan2(node.y - seqCy, node.x - seqCx);
  node.trail = [{ x: node.x, y: node.y }];
  node.el.style.opacity = '0';
  const p = document.createElement('div');
  p.className = 'seq-particle';
  p.style.left = node.x + 'px';
  p.style.top = node.y + 'px';
  p.style.transform = 'translate(-50%,-50%)';
  document.getElementById('sequenceParticles').appendChild(p);
  node.particleEl = p;
  seqParticles.push(node);
}

function pushTrail(node) {
  if (!node.trail) node.trail = [];
  const last = node.trail[node.trail.length - 1];
  if (!last || Math.hypot(node.x - last.x, node.y - last.y) > 3) {
    node.trail.push({ x: node.x, y: node.y });
    if (node.trail.length > 8) node.trail.shift();
  }
}

function drawSequenceSvg(t) {
  const svg = document.getElementById('sequenceSvg');
  if (!seqBox) return;
  svg.setAttribute('viewBox', `0 0 ${seqBox.width} ${seqBox.height}`);
  svg.innerHTML = '';
}

function updateSequenceFrame(t, dt) {
  const core = document.getElementById('sequenceCore');
  const beat = document.getElementById('sequenceBeat');
  const intro = document.getElementById('chaos-intro');
  const site = document.getElementById('create-iris');
  const morphActive = t >= T_MORPH_START;

  if (!morphActive && !morphOnly) {
    const coreIn = clamp(t / 500, 0, 1);
    const pulse = 0.5 + 0.5 * Math.sin(t * 0.0055);
    core.style.opacity = fluidEase(coreIn) * pulse * 0.32;

    const beatIn = clamp((t - 250) / 450, 0, 1);
    const beatOut = t > T_ORG ? clamp((t - T_ORG) / 550, 0, 1) : 0;
    const beatOp = fluidEase(beatIn) * (1 - fluidEase(beatOut));
    beat.style.opacity = beatOp;
    beat.style.transform = `translate(-50%, calc(-50% + ${(1 - beatOp) * -10}px))`;
  } else if (morphOnly && !morphActive) {
    core.style.opacity = '0';
    beat.style.opacity = '0';
  }

  if (!morphActive) {
    seqNodes.forEach(node => {
      node.el.style.opacity = '0';
    });
  }

  if (morphActive) {
    morphToSite(t - T_MORPH_START, intro, site, core, beat);
  }

  drawSequenceSvg(t);
}

function morphToSite(morphT, intro, site, core, beat) {
  const morphP = clamp(morphT / SEQ.morph, 0, 1);
  const ease = fluidEase(morphP);

  intro.classList.add('morphing');
  intro.style.opacity = String(1 - ease);

  const siteIn = fluidEase(clamp((morphP - 0.15) / 0.85, 0, 1));
  site.style.opacity = siteIn;
  site.classList.add('iris-open');

  const gridBg = site.querySelector('.ci-grid-bg');
  if (gridBg) gridBg.style.opacity = siteIn;

  const inner = site.querySelector('.create-inner');
  if (inner) {
    const innerP = fluidEase(clamp((morphP - 0.2) / 0.6, 0, 1));
    inner.style.transform = `scale(${lerp(0.98, 1, innerP)})`;
    inner.style.transformOrigin = 'center center';
  }

  if (morphP > 0.85) triggerCmdHandoffPulse(site);

  site.querySelectorAll('.create-inner .ci-enter').forEach((el, i) => {
    el.classList.add('morph-driven');
    const threshold = 0.4 + i * 0.09;
    const localP = fluidEase(clamp((morphP - threshold) / 0.35, 0, 1));
    el.style.opacity = localP;
    el.style.transform = `scale(${lerp(0.98, 1, localP)}) translateY(${lerp(28, 0, localP)}px)`;
    el.style.filter = `blur(${lerp(10, 0, localP)}px)`;
  });

  if (beat) beat.style.opacity = Math.max(0, 1 - ease);
  core.style.opacity = Math.max(0, (parseFloat(core.style.opacity) || 0.25) * (1 - ease));

  const flash = document.getElementById('irisSparkFlash');
  if (flash) {
    const flashOut = fluidEase(clamp((morphP - 0.25) / 0.55, 0, 1));
    flash.style.opacity = String(Math.max(0, 1 - flashOut));
  }

  seqParticles.forEach(node => {
    if (node.particleEl) node.particleEl.style.opacity = (1 - ease) * 0.35;
  });

  if (morphP >= 1 && !chaosComplete) finishSite();
}

function stopSequenceRaf() {
  if (sequenceRafId) cancelAnimationFrame(sequenceRafId);
  sequenceRafId = null;
}

function finishSite() {
  if (chaosComplete) return;
  chaosComplete = true;
  stopSequenceRaf();

  const overlay = document.getElementById('chaos-intro');
  const site = document.getElementById('create-iris');
  const flash = document.getElementById('irisSparkFlash');
  if (flash) {
    flash.classList.remove('burst');
    flash.style.opacity = '0';
  }
  overlay.style.pointerEvents = 'none';
  overlay.style.display = 'none';
  overlay.classList.add('done');
  site.classList.add('iris-open');
  site.style.opacity = '1';
  triggerCmdHandoffPulse(site);
  onIrisOpen();
  site.querySelectorAll('.ci-enter').forEach(el => {
    el.classList.remove('morph-driven');
    el.style.opacity = '';
    el.style.transform = '';
    el.style.filter = '';
  });
  const inner = site.querySelector('.create-inner');
  if (inner) inner.style.transform = '';
  applySiteLive();
}

function applySiteLive() {
  document.body.classList.add('site-live');
  document.body.style.background = '#fff';
  document.body.style.color = '#1d1d1f';
  const nav = document.getElementById('main-nav');
  nav.querySelector('.nav-logo').style.color = '#1d1d1f';
  nav.querySelectorAll('.nav-links a').forEach(a => { a.style.color = 'rgba(0,0,0,.55)'; });
  nav.classList.remove('scrolled');
  nav.style.background = 'rgba(255,255,255,.8)';
  nav.style.backdropFilter = 'blur(12px)';
  const site = document.getElementById('create-iris');
  site.classList.add('iris-open');
  site.style.opacity = '1';
  triggerCmdHandoffPulse(site);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function triggerCmdHandoffPulse(site) {
  if (site.dataset.pulseDone) return;
  site.dataset.pulseDone = '1';
  const cmdWin = site.querySelector('.iris-cmd-window');
  if (cmdWin) cmdWin.classList.add('handoff-pulse');
}

function runCinematicSequence(reduced) {
  if (seqStarted) return;
  seqStarted = true;
  morphOnly = true;

  document.getElementById('chaos-intro').classList.add('sequence-active');

  if (reduced) {
    const intro = document.getElementById('chaos-intro');
    const site = document.getElementById('create-iris');
    const beat = document.getElementById('sequenceBeat');
    beat.style.opacity = '0';
    document.getElementById('sequenceCore').style.opacity = '0';
    schedule(() => {
      morphToSite(SEQ.morph, intro, site, document.getElementById('sequenceCore'), beat);
    }, 400);
    return;
  }

  seqNodes = buildSequenceNodes();
  seqParticles = [];
  document.getElementById('sequenceParticles').innerHTML = '';

  let lastNow = performance.now();
  const start = lastNow;

  function tick(now) {
    const t = now - start;
    const dt = Math.min(now - lastNow, 32);
    lastNow = now;
    updateSequenceFrame(t, dt);
    if (t >= T_TOTAL) {
      finishSite();
      return;
    }
    sequenceRafId = requestAnimationFrame(tick);
  }
  sequenceRafId = requestAnimationFrame(tick);
}

function skipIntro() {
  if (chaosComplete) return;
  chaosTimers.forEach(clearTimeout);
  chaosTimers = [];
  stopSequenceRaf();
  stopDrift();
  if (!seqStarted) {
    seqStarted = true;
    beginRecognition();
  }
  spawnedCards.forEach(el => { el.style.opacity = '0'; });
  const intro = document.getElementById('chaos-intro');
  const site = document.getElementById('create-iris');
  morphToSite(SEQ.morph, intro, site, document.getElementById('sequenceCore'), document.getElementById('sequenceBeat'));
}

document.getElementById('ciSkip').addEventListener('click', skipIntro);
runChaosIntro();

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

new MutationObserver((mutations, obs) => {
  for (const m of mutations) {
    if (m.type === 'attributes' &&
        document.getElementById('create-iris').classList.contains('iris-open')) {
      obs.disconnect();
      onIrisOpen();
      return;
    }
  }
}).observe(document.getElementById('create-iris'), {attributes:true, attributeFilter:['class']});

if (document.getElementById('create-iris').classList.contains('iris-open')) {
  onIrisOpen();
}

/* ════ BENTO SPOTLIGHT STYLE ════ */
const s=document.createElement('style');
s.textContent='.spotlight-active::after{content:"";position:absolute;width:380px;height:380px;border-radius:50%;background:radial-gradient(circle,var(--spotlight,rgba(255,255,255,.05)) 0%,transparent 70%);left:var(--sx,50%);top:var(--sy,50%);transform:translate(-50%,-50%);pointer-events:none;}';
document.head.appendChild(s);