/**
 * progress.js — saves progress inside lesson pages (aula_XX / fr_aula_XX)
 * ───────────────────────────────────────────────────────────────────────────
 * Loaded last on every lesson page. It works with every lesson template
 * because it only relies on what they all share:
 *   • markSection(id?) — called when a section is finished (id, or the open tab)
 *   • Store.addXP(n)   — every XP reward on the page
 *
 * 1. Restores finished sections (dots, ✓ on tabs) and opens the first pending tab
 *    (or the tab in the URL hash, e.g. aula_07.html#grammar).
 * 2. Grants each XP reward of a tab only once per user — reloading no longer farms XP.
 * 3. Saves to /api/progress (logged in) or localStorage (guests); new sections
 *    count as a study day on the server (streak + daily goal).
 * 4. Sends analytics: lesson_started, lesson_section_completed, lesson_completed.
 */
(function () {
    const match = location.pathname.match(/((?:fr_)?aula_\d{2})\.html$/);
    if (!match || typeof window.Store === 'undefined' || typeof window.markSection !== 'function') return;

    const LESSON = match[1];
    const IS_EN = LESSON.indexOf('fr_') !== 0;
    let session = null;
    try { session = JSON.parse(localStorage.getItem('capySession') || 'null'); } catch (e) {}
    const LOGGED_IN = !!(session && session.id && session.id !== 'guest');
    const LOCAL_KEY = 'capyLesson_' + (LOGGED_IN ? session.id : 'guest') + '_' + LESSON;

    const items = new Set();            // 'section:<tab>' | 'xp:<tab>:<amount>#<n>'
    const sessionSections = new Set();  // sections finished during this page view
    const xpSeen = {};                  // '<tab>:<amount>' → rewards seen in this page view
    const deferredXP = [];              // XP granted before saved progress had loaded
    const deferredSections = [];
    const pending = [];                 // items not yet sent to the server
    let ready = false, restoring = false, completed = false;
    let flushTimer = null, flushing = false, failures = 0;

    const origMark = window.markSection;
    const origAddXP = Store.addXP.bind(Store);

    const style = document.createElement('style');
    style.textContent = '.capy-restoring .xp-pop{display:none!important}'
        + '.tab-btn .capy-done{margin-left:4px;color:#10b981;font-weight:900}';
    document.head.appendChild(style);

    function activeTab() {
        const b = document.querySelector('.tab-btn.active[data-tab]');
        return b ? b.dataset.tab : 'page';
    }
    function lessonTabs() {
        return [...document.querySelectorAll('.tab-btn[data-tab]')]
            .map(b => b.dataset.tab).filter(t => t !== 'personalizada');
    }
    function tabButton(t) {
        return [...document.querySelectorAll('.tab-btn[data-tab]')].find(b => b.dataset.tab === t) || null;
    }
    function markTabDone(t) {
        const b = tabButton(t);
        if (!b || b.querySelector('.capy-done')) return;
        const s = document.createElement('span');
        s.className = 'capy-done';
        s.textContent = '✓';
        s.setAttribute('aria-label', 'concluída');
        b.appendChild(s);
    }

    // ── XP: each reward once per user ─────────────────────────────────────
    Store.addXP = function (amount) {
        if (restoring) return;
        const tab = activeTab();
        if (!ready) { deferredXP.push({ amount, tab }); return; }
        grantXP(amount, tab);
    };
    function grantXP(amount, tab) {
        const key = tab + ':' + amount;
        xpSeen[key] = (xpSeen[key] || 0) + 1;
        const item = 'xp:' + tab + ':' + amount + '#' + xpSeen[key];
        if (items.has(item)) return;           // already earned on an earlier visit
        remember(item);
        origAddXP(amount);
    }

    // ── Sections ──────────────────────────────────────────────────────────
    window.markSection = function (id) {
        const hasId = typeof id === 'string' && id.length > 0;
        const section = hasId ? id : activeTab();
        // Templates without ids only count calls: never count the same tab twice.
        if (!restoring && !hasId && (items.has('section:' + section) || sessionSections.has(section))) return;
        const out = origMark.apply(this, arguments);
        if (!restoring) recordSection(section);
        return out;
    };

    function recordSection(section) {
        sessionSections.add(section);
        markTabDone(section);
        if (!ready) { deferredSections.push(section); return; }
        const item = 'section:' + section;
        if (items.has(item)) return;
        remember(item);
        window.capyTrack?.('lesson_section_completed', { lesson_id: LESSON, section });
        if (!LOGGED_IN) Store.activateStreak('aula');   // logged-in users: the server counts it
        checkCompleted(false, false);
    }

    function checkCompleted(silent, serverSaysDone) {
        if (completed) return;
        const tabs = lessonTabs();
        const done = serverSaysDone || items.has('section:homework')
            || (tabs.length > 0 && tabs.every(t => items.has('section:' + t)));
        if (!done) return;
        completed = true;
        if (IS_EN) markCompletedInStore();
        if (!silent) window.capyTrack?.('lesson_completed', { lesson_id: LESSON });
    }

    // classes.html shows ✓ by display number (e.g. aula_43 is lesson #33).
    async function markCompletedInStore() {
        try {
            const c = await (await fetch('curriculum.json')).json();
            const l = (c.en || []).find(x => x.id === LESSON);
            if (l) Store.completeLesson(l.n);
        } catch (e) {}
    }

    // ── Saving ────────────────────────────────────────────────────────────
    function saveLocal() {
        try { localStorage.setItem(LOCAL_KEY, JSON.stringify([...items])); } catch (e) {}
    }
    function loadLocal() {
        try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]'); } catch (e) { return []; }
    }
    function remember(item) {
        items.add(item);
        saveLocal();
        if (!LOGGED_IN) return;
        pending.push(item);
        clearTimeout(flushTimer);
        flushTimer = setTimeout(() => flush(false), 600);
    }

    async function flush(keepalive) {
        if (!pending.length || (flushing && !keepalive)) return;
        flushing = true;
        const batch = pending.splice(0, 20);
        try {
            const r = await fetch('/api/progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                keepalive: !!keepalive,
                body: JSON.stringify({ lessonId: LESSON, items: batch }),
            });
            if (r.ok) {
                failures = 0;
                const data = await r.json();
                if (data.streak) Store.applyServerStreak(data.streak, data.today);
                if (data.lessonCompleted) checkCompleted(false, true);
            } else if (r.status >= 500 || r.status === 429) {
                pending.unshift(...batch);
                failures++;
            }
        } catch (e) {
            pending.unshift(...batch);
            failures++;
        }
        flushing = false;
        if (pending.length && !keepalive && failures < 3) {
            clearTimeout(flushTimer);
            flushTimer = setTimeout(() => flush(false), failures ? 4000 : 0);
        }
    }
    window.addEventListener('pagehide', () => flush(true));

    // ── Restore on load ───────────────────────────────────────────────────
    function restore(saved) {
        saved.forEach(i => items.add(i));
        const done = saved.filter(i => i.indexOf('section:') === 0).map(i => i.slice(8))
            .filter(s => !sessionSections.has(s));
        if (done.length) {
            restoring = true;
            document.documentElement.classList.add('capy-restoring');
            try { done.forEach(s => { try { origMark(s); } catch (e) {} }); }
            finally {
                restoring = false;
                setTimeout(() => document.documentElement.classList.remove('capy-restoring'), 1500);
            }
        }
        [...items].filter(i => i.indexOf('section:') === 0).forEach(i => markTabDone(i.slice(8)));
        checkCompleted(true, false);
        openStartTab();
    }

    function openStartTab() {
        const tabs = lessonTabs();
        let wanted = '';
        try { wanted = decodeURIComponent((location.hash || '').slice(1)); } catch (e) {}
        let target = tabs.includes(wanted) ? wanted : null;
        if (!target && !completed && sessionSections.size === 0) {
            target = tabs.find(t => !items.has('section:' + t)) || null;
        }
        const b = target && tabButton(target);
        if (b && !b.classList.contains('active')) b.click();
    }

    async function load() {
        const local = loadLocal();
        let saved = local;
        if (LOGGED_IN) {
            try {
                const r = await fetch('/api/progress?lessonId=' + LESSON, { cache: 'no-store' });
                if (r.ok) {
                    const server = (await r.json()).items || [];
                    // Anything saved only on this device (e.g. offline) is sent again.
                    const onlyLocal = local.filter(i => server.indexOf(i) < 0);
                    saved = server.concat(onlyLocal);
                    onlyLocal.forEach(i => pending.push(i));
                }
            } catch (e) { /* offline: keep the local copy */ }
        }
        restore(saved);
        ready = true;
        deferredSections.splice(0).forEach(recordSection);
        deferredXP.splice(0).forEach(x => grantXP(x.amount, x.tab));
        if (pending.length) flush(false);
        window.capyTrack?.('lesson_started', { lesson_id: LESSON, resumed: items.size > 0 });
    }

    load();
})();
