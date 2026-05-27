/**
 * lesson-engine.js — Shared interactive lesson engine for Capy Yara Adventures
 * Powers all aula_XX.html pages with flip cards, expressions, practice quiz, speak, tabs.
 */

// ── STATE ────────────────────────────────────────────────────────────────────
let _pracIdx = 0, _pracScore = 0, _pracStreak = 0, _shuffledQs = [];
let _sectionsDone = 0, _totalSections = 5;
const _learnedSets = {};
const _speakDone = new Set();
const _exprShown = new Set();
let _SPEAK_DATA = [];

// ── TTS ──────────────────────────────────────────────────────────────────────
function speak(text, lang = 'en-US') {
  if (!window.speechSynthesis) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang; u.rate = 0.9;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}
function speakRaw(i) {
  const plain = _SPEAK_DATA[i].text.replace(/<[^>]+>/g, '');
  speak(plain);
}
window.speak = speak;
window.speakRaw = speakRaw;

// ── SECTION PROGRESS ─────────────────────────────────────────────────────────
function markSection() {
  _sectionsDone++;
  buildSectionDots();
}
window.markSection = markSection;

function buildSectionDots() {
  const c = document.getElementById('section-dots');
  const lbl = document.getElementById('section-label');
  if (!c) return;
  c.innerHTML = '';
  for (let i = 0; i < _totalSections; i++) {
    const d = document.createElement('div');
    d.className = `prog-dot ${i < _sectionsDone ? 'bg-violet-400' : 'bg-white/20'}`;
    c.appendChild(d);
  }
  if (lbl) lbl.textContent = `${_sectionsDone} / ${_totalSections} sections done`;
}

// ── FLIP CARDS ────────────────────────────────────────────────────────────────
function buildFlipCards(data, gridId, countId, barId, setKey, sectionCb) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  if (!_learnedSets[setKey]) _learnedSets[setKey] = new Set();
  const learnedSet = _learnedSets[setKey];
  grid.innerHTML = '';
  data.forEach((item, i) => {
    const bg = item.bg || 'bg-slate-50 border-slate-200';
    const dot = item.dot || 'bg-slate-300';
    const ex = item.ex || item.comp || '';
    const exLabel = item.comp ? 'Comparative' : 'Example';
    const card = document.createElement('div');
    card.className = 'flip-card h-32';
    card.innerHTML = `
      <div class="flip-card-inner">
        <div class="flip-front border-2 ${bg} flex flex-col items-center justify-center p-2 gap-1">
          <div class="text-2xl">${item.emoji || '📚'}</div>
          <div class="font-black text-navy text-xs text-center leading-tight">${item.en}</div>
          <button class="mt-1 text-slate-400 hover:text-violet-500 transition-colors" onclick="event.stopPropagation();speak('${item.en.replace(/'/g,"\\'")}')">
            <span class="material-symbols-outlined text-sm" style="font-variation-settings:'FILL' 1">volume_up</span>
          </button>
        </div>
        <div class="flip-back border-2 ${bg} flex flex-col items-center justify-center p-2 gap-0.5">
          <div class="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Portuguese</div>
          <div class="font-black text-navy text-xs text-center leading-tight">${item.pt}</div>
          ${ex ? `<div class="text-[9px] text-slate-500 text-center leading-tight px-1 mt-0.5">${exLabel}: ${ex}</div>` : ''}
          <div class="w-4 h-1 rounded-full ${dot} mt-0.5"></div>
        </div>
      </div>`;
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
      if (card.classList.contains('flipped') && !learnedSet.has(i)) {
        learnedSet.add(i);
        updateFlipProgress(learnedSet, countId, barId, data.length, sectionCb);
      }
    });
    grid.appendChild(card);
  });
  updateFlipProgress(learnedSet, countId, barId, data.length, null);
}
window.buildFlipCards = buildFlipCards;

function updateFlipProgress(set, countId, barId, total, cb) {
  const n = set.size;
  const countEl = document.getElementById(countId);
  const barEl = document.getElementById(barId);
  if (countEl) countEl.innerHTML = `${n}<span class="text-sm text-slate-400">/${total}</span>`;
  if (barEl) barEl.style.width = `${(n / total) * 100}%`;
  if (cb) cb(n === total);
}

// ── EXPRESSIONS ───────────────────────────────────────────────────────────────
function buildExpressions(data, gridId, accentColor) {
  const grid = document.getElementById(gridId);
  if (!grid || !data) return;
  const ac = accentColor || 'violet';
  data.forEach((e, i) => {
    const card = document.createElement('div');
    card.className = `rounded-2xl border-2 border-slate-200 bg-white overflow-hidden hover:border-${ac}-300 transition-colors`;
    card.innerHTML = `
      <div class="flex items-start gap-5 p-6">
        <div class="text-5xl flex-shrink-0 opacity-80">${e.emoji}</div>
        <div class="flex-1 min-w-0">
          <h3 class="text-xl font-black text-navy mb-1">"${e.expr}"</h3>
          <button onclick="toggleExpr(${i})" class="inline-flex items-center gap-1.5 text-${ac}-600 hover:text-${ac}-800 text-sm font-bold mb-3 transition-colors">
            <span class="material-symbols-outlined text-sm">translate</span>
            <span id="expr-btn-${i}">Show Translation</span>
          </button>
          <div id="expr-trans-${i}" class="hidden">
            <div class="bg-${ac}-50 border border-${ac}-200 rounded-xl px-4 py-2 mb-3">
              <span class="text-${ac}-700 font-black">🇧🇷 ${e.pt}</span>
            </div>
          </div>
          <p class="text-slate-500 text-sm"><span class="font-bold text-slate-700">Example:</span> "${e.example}"</p>
          <p class="text-slate-400 text-xs mt-1 italic">${e.meaning}</p>
        </div>
        <button onclick="speak('${e.expr.replace(/['"]/g, ' ')}')" class="text-slate-300 hover:text-${ac}-500 transition-colors flex-shrink-0">
          <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1">volume_up</span>
        </button>
      </div>`;
    grid.appendChild(card);
  });
}
window.buildExpressions = buildExpressions;

function toggleExpr(i) {
  const el = document.getElementById(`expr-trans-${i}`);
  const btn = document.getElementById(`expr-btn-${i}`);
  if (!el) return;
  const hidden = el.classList.toggle('hidden');
  btn.textContent = hidden ? 'Show Translation' : 'Hide Translation';
  if (!hidden && !_exprShown.has(i)) {
    _exprShown.add(i);
    if (_exprShown.size >= (window._EXPR_TOTAL || 4)) markSection();
  }
}
window.toggleExpr = toggleExpr;

// ── ACCORDION ─────────────────────────────────────────────────────────────────
function toggleAccordion(id) {
  const el = document.getElementById(id);
  const arrow = document.getElementById(id + '-arrow');
  if (!el) return;
  el.classList.toggle('hidden');
  if (arrow) arrow.style.transform = el.classList.contains('hidden') ? '' : 'rotate(180deg)';
}
window.toggleAccordion = toggleAccordion;

// ── PRACTICE ──────────────────────────────────────────────────────────────────
function shuffle(a) { return [...a].sort(() => Math.random() - .5); }

function buildPractice(data) {
  _shuffledQs = shuffle(data);
  _pracIdx = 0; _pracScore = 0; _pracStreak = 0;
  updatePracStats();
  renderQuestion();
}
window.buildPractice = buildPractice;

function updatePracStats() {
  const scoreEl = document.getElementById('prac-score');
  const streakEl = document.getElementById('prac-streak');
  const barEl = document.getElementById('prac-bar');
  if (scoreEl) scoreEl.innerHTML = `${_pracScore}<span class="text-sm text-slate-400">/10</span>`;
  if (streakEl) streakEl.textContent = `🔥 ${_pracStreak}`;
  if (barEl) barEl.style.width = `${(_pracIdx / 10) * 100}%`;
}

function renderQuestion() {
  if (_pracIdx >= 10) { showResult(); return; }
  const q = _shuffledQs[_pracIdx];
  const opts = shuffle(q.opts);
  const area = document.getElementById('practice-area');
  if (!area) return;
  area.innerHTML = `
    <div class="fade-in">
      <div class="text-xs font-black text-violet-400 uppercase tracking-widest mb-2">Question ${_pracIdx + 1} of 10</div>
      <div class="bg-white border-2 border-slate-200 rounded-2xl p-6 mb-4 shadow-sm">
        <p class="text-lg font-bold text-navy">${q.q}</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        ${opts.map(o => { const safeO = JSON.stringify(o).replace(/'/g,"&#39;"); const safeA = JSON.stringify(q.a).replace(/'/g,"&#39;"); return `<button onclick='answerPrac(${safeO},${safeA},this)' class="opt-btn text-left bg-white border-2 border-slate-200 rounded-2xl px-5 py-4 font-bold text-slate-700 hover:border-violet-400 hover:bg-violet-50 transition-all active:scale-95">${o}</button>`; }).join('')}
      </div>
      <div id="prac-feedback" class="mt-4 hidden"></div>
    </div>`;
}

function answerPrac(chosen, correct, btn) {
  document.querySelectorAll('.opt-btn').forEach(b => b.disabled = true);
  const ok = chosen === correct;
  const fb = document.getElementById('prac-feedback');
  if (ok) {
    btn.className = btn.className.replace('border-slate-200', 'border-emerald-400') + ' bg-emerald-50 text-emerald-700';
    btn.classList.add('correct');
    _pracScore++; _pracStreak++;
    _showXpPop();
    if (fb) fb.innerHTML = `<div class="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-2 font-bold text-sm">✅ Correct! ${_shuffledQs[_pracIdx].rule}</div>`;
  } else {
    btn.className = btn.className.replace('border-slate-200', 'border-red-400') + ' bg-red-50 text-red-700';
    btn.classList.add('shake');
    _pracStreak = 0;
    document.querySelectorAll('.opt-btn').forEach(b => { if (b.textContent.trim() === correct) b.className = b.className.replace('border-slate-200', 'border-emerald-400') + ' bg-emerald-50 text-emerald-700'; });
    if (fb) fb.innerHTML = `<div class="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-2 font-bold text-sm">❌ Correct: <strong>${correct}</strong></div>`;
  }
  if (fb) fb.classList.remove('hidden');
  _pracIdx++;
  updatePracStats();
  setTimeout(renderQuestion, 1200);
}
window.answerPrac = answerPrac;

function _showXpPop() {
  const pop = document.createElement('div');
  pop.className = 'xp-pop fixed text-sm font-black text-violet-600 bg-white border border-violet-200 rounded-full px-3 py-1 shadow z-50';
  pop.style.cssText = 'left:50%;top:60%;transform:translateX(-50%)';
  pop.textContent = '+5 XP 🔥';
  document.body.appendChild(pop);
  setTimeout(() => pop.remove(), 800);
}

function showResult() {
  const overlay = document.getElementById('result-overlay');
  if (!overlay) return;
  const emoji = document.getElementById('result-emoji');
  const title = document.getElementById('result-title');
  const msg = document.getElementById('result-msg');
  if (emoji) emoji.textContent = _pracScore >= 8 ? '🏆' : _pracScore >= 6 ? '🎉' : '💪';
  if (title) title.textContent = _pracScore >= 8 ? 'Excellent!' : _pracScore >= 6 ? 'Well done!' : 'Keep going!';
  if (msg) msg.textContent = `You scored ${_pracScore} out of 10.${_pracScore >= 8 ? ' Outstanding! 🌟' : _pracScore >= 6 ? ' Keep it up!' : ' Keep practising!'}`;
  overlay.classList.remove('hidden');
  markSection();
  if (typeof Store !== 'undefined') Store.addXP(50);
}

function restartPractice() {
  const overlay = document.getElementById('result-overlay');
  if (overlay) overlay.classList.add('hidden');
  buildPractice(window._PRACTICE_DATA || []);
}
window.restartPractice = restartPractice;

// ── SPEAK ─────────────────────────────────────────────────────────────────────
function buildSpeak(data, gridId) {
  _SPEAK_DATA = data;
  const grid = document.getElementById(gridId || 'speak-grid');
  if (!grid) return;
  grid.innerHTML = '';
  data.forEach((s, i) => {
    const div = document.createElement('div');
    div.className = 'bg-white border-2 border-slate-200 rounded-2xl p-5 flex items-center gap-4 hover:border-violet-300 transition-colors';
    div.innerHTML = `
      <button onclick="speakRaw(${i})" class="flex-shrink-0 w-12 h-12 rounded-full bg-violet-100 hover:bg-violet-200 text-violet-600 flex items-center justify-center transition-all hover:scale-105 active:scale-95">
        <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1">play_arrow</span>
      </button>
      <p class="flex-1 text-navy font-semibold text-sm leading-relaxed">${s.text}</p>
      <label class="flex-shrink-0 flex flex-col items-center gap-1 cursor-pointer">
        <input type="checkbox" class="speak-check w-5 h-5 accent-violet-500" onchange="markSpeak(${i},this)"/>
        <span class="text-[10px] text-slate-400 font-bold">Done</span>
      </label>`;
    grid.appendChild(div);
  });
}
window.buildSpeak = buildSpeak;

function markSpeak(i, chk) {
  if (chk.checked) _speakDone.add(i); else _speakDone.delete(i);
  if (_speakDone.size >= Math.min(6, _SPEAK_DATA.length)) markSection();
}
window.markSpeak = markSpeak;

// ── TABS ──────────────────────────────────────────────────────────────────────
function initTabs(tabNames) {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      tabNames.forEach(t => {
        const el = document.getElementById('tab-' + t);
        if (el) el.classList.toggle('hidden', t !== tab);
      });
    });
  });
}
window.initTabs = initTabs;

// ── HOMEWORK SAVE ─────────────────────────────────────────────────────────────
/**
 * saveHomework(lessonId, lessonTitle, xp)
 * Collects all input/textarea values inside #tab-homework and POSTs to /api/homework.
 * Call this inside each lesson's submitHomeworkXX() before the local UI updates.
 */
async function saveHomework(lessonId, lessonTitle, xp) {
  const hwTab = document.getElementById('tab-homework');
  const answers = {};
  if (hwTab) {
    hwTab.querySelectorAll('input[type="text"], textarea').forEach((el, i) => {
      const key = el.id || el.placeholder?.slice(0, 30) || `field_${i}`;
      answers[key] = el.value || '';
    });
  }
  let userId = 'guest', studentName = 'Estudante';
  try {
    const s = JSON.parse(localStorage.getItem('capySession') || '{}');
    userId = s.id || 'guest';
    studentName = s.name || s.playerName || 'Estudante';
  } catch(e) {}
  // Also check Store for name
  if (studentName === 'Estudante' && typeof Store !== 'undefined') {
    try { studentName = Store.state?.playerName || studentName; } catch(e) {}
  }
  try {
    await fetch('/api/homework', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, studentName, lessonId: String(lessonId), lessonTitle: lessonTitle || '', answers, xp: xp || 0 }),
    });
  } catch(e) { console.warn('[homework] save failed:', e); }
}
window.saveHomework = saveHomework;

// ── INIT ──────────────────────────────────────────────────────────────────────
function initLesson(config) {
  _totalSections = config.totalSections || 5;
  _sectionsDone = 0;
  buildSectionDots();
  initTabs(config.tabs);

  if (config.vocab) {
    buildFlipCards(config.vocab, 'vocab-grid', 'vocab-count', 'vocab-bar', 'vocab', done => { if (done) markSection(); });
  }
  if (config.expressions) {
    window._EXPR_TOTAL = config.expressions.length;
    buildExpressions(config.expressions, 'expr-grid', config.accentColor || 'violet');
  }
  if (config.practice) {
    window._PRACTICE_DATA = config.practice;
    buildPractice(config.practice);
  }
  if (config.speak) {
    buildSpeak(config.speak, 'speak-grid');
  }
}
window.initLesson = initLesson;
