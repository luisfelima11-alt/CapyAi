/* Presentation only: no microphone, network conversation, quota or auth changes. */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const video = $('yara-video'), stage = $('palco'), motion = $('presence-motion');
  if (!video || !stage || !motion) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = window.matchMedia('(max-width: 767px)');
  const defaultArt = 'yara-quadrado-v1.jpg';
  const clips = { idle: 'yara-presence-idle.mp4', listen: 'yara-presence-listen.mp4', speak: 'yara-chat.mp4' };
  let art = defaultArt, enabled = !reduced.matches && !navigator.connection?.saveData;
  let active = '', revision = 0, interacted = false;
  const failed = new Set();
  try { if (localStorage.getItem('capyPresenceMotion') === 'off') enabled = false; } catch (_) {}
  function pause() { try { video.pause(); } catch (_) {} }
  function reset() { revision++; pause(); active = ''; video.removeAttribute('src'); video.load(); }
  function sync() {
    const allowed = enabled && !reduced.matches;
    motion.setAttribute('aria-pressed', String(allowed));
    motion.textContent = reduced.matches ? 'Movimento reduzido' : allowed ? 'Pausar movimento' : 'Animar Capy';
    motion.disabled = reduced.matches;
    document.body.dataset.presencePaused = String(!allowed);
    if (!allowed || document.hidden || art !== defaultArt || !interacted) { pause(); return; }
    const state = stage.dataset.estado;
    const clip = clips[state === 'ia_falando' ? 'speak' : ['ouvindo', 'falando'].includes(state) ? 'listen' : 'idle'];
    if (failed.has(clip)) { pause(); return; }
    if (active !== clip) { revision++; pause(); active = clip; video.src = clip; video.load(); }
    const version = revision;
    const promise = video.play();
    if (promise?.catch) promise.catch(() => { if (version === revision) pause(); });
  }
  video.addEventListener('error', () => { if (active) failed.add(active); reset(); });
  motion.addEventListener('click', () => {
    enabled = !enabled; interacted = true;
    try { localStorage.setItem('capyPresenceMotion', enabled ? 'on' : 'off'); } catch (_) {}
    sync();
  });
  // Lazy clips: zero video bytes until the learner interacts with the page.
  function activate(event) {
    if (event.target.closest('#presence-motion')) return;
    interacted = true; sync();
    document.removeEventListener('pointerdown', activate);
    document.removeEventListener('keydown', activate);
  }
  document.addEventListener('pointerdown', activate);
  document.addEventListener('keydown', activate);
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('pagehide', pause);
  reduced.addEventListener('change', sync);
  const toggle = $('presence-history-toggle');
  function history(open) {
    document.body.dataset.historyOpen = String(open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Voltar à Capy' : 'Ver histórico';
    $('fio').inert = mobile.matches && !open;
    if (open) $('fio').scrollTop = $('fio').scrollHeight;
  }
  toggle.addEventListener('click', () => history(document.body.dataset.historyOpen !== 'true'));
  mobile.addEventListener('change', () => history(document.body.dataset.historyOpen === 'true'));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && document.body.dataset.historyOpen === 'true') { history(false); toggle.focus(); } });
  window.CapyPresence = Object.freeze({
    sync,
    setPersona(nextArt) {
      if (nextArt !== art) { reset(); art = nextArt; }
      sync();
    },
    caption(who, text, name) {
      if (who !== 'eu' && who !== 'ia') return;
      $('presence-speaker').textContent = who === 'eu' ? 'Você' : name || 'Yara AI';
      $('presence-caption').textContent = text;
    },
  });
  history(false); sync();
})();
