// "YYYY-MM-DD" in the browser's timezone, shifted by `offset` days.
function capyLocalDay(offset) {
    const d = new Date();
    if (offset) d.setDate(d.getDate() + offset);
    return d.toLocaleDateString('en-CA');
}

// Fresh default state (a function, so arrays/objects are never shared).
function capyDefaultState() {
    return {
        xp: 0,
        streakActive: false,    // studied today
        streakDays: 0,          // consecutive study days (server value for logged-in users)
        longestStreak: 0,
        lastStudyDay: '',       // 'YYYY-MM-DD' of the last study activity
        badges: [],
        completedActivities: {},
        completedLessons: [],
        completedMinis: [],
        customLessons: [],
        playerName: '',
        lastQuestDate: '',
        starBerries: 50, // Start with a little bonus!
        purchasedItems: [],
        planType: 'free',       // 'free' | 'pro' | 'super' — synced from /api/me
        aiUsageToday: 0,        // resets daily
        aiUsageLimit: 3,        // 3=free, 200=pro, 500=super
        aiCreditsExtra: 0,      // top-up credits (one-time purchase)
        // ── User profile / personalization ────────────────────────
        englishLevel: null,           // 'beginner'|'elementary'|'intermediate'|'advanced'
        goals: [],                    // ['travel','work','entertainment',...]
        interests: [],                // ['music','sports','food',...]
        dailyGoalMinutes: 10,         // 5|10|20|30
        onboardingComplete: false
    };
}

// Progress lives in localStorage under a per-user key (capyYaraState_<id>;
// guests use capyYaraState) and, for logged-in users, is synced to the
// server (/api/db) with a debounce. The server copy is never overwritten
// before it has been loaded on this device.
const Store = {
    state: capyDefaultState(),
    _key: 'capyYaraState',
    _userId: null,
    _remoteReady: false,   // true once it is safe to push this device's state to the server
    _dirty: false,
    _saveTimer: null,

    init() {
        try { localStorage.removeItem('capyUsers'); } catch (e) {}   // old account cache (had passwords)
        let session = null;
        try { session = JSON.parse(localStorage.getItem('capySession') || 'null'); } catch (e) {}
        this._userId = session && session.id && session.id !== 'guest' ? session.id : null;
        this._key = this._userId ? 'capyYaraState_' + this._userId : 'capyYaraState';
        this._remoteReady = !this._userId;   // guests never sync

        this.state = capyDefaultState();
        let saved = null;
        try { saved = localStorage.getItem(this._key); } catch (e) {}
        const hadLocal = !!saved;
        if (saved) {
            try { this.state = { ...this.state, ...JSON.parse(saved) }; } catch (e) {}
        } else {
            this._writeLocal();
        }
        this._migrateStreakFields();
        this.checkDailyReset();
        if (this._userId) this._syncWithServer(hadLocal);
    },

    async _syncWithServer(hadLocal) {
        const uid = this._userId;
        // 1) Is the server session still valid? (checked once per browser tab session)
        try {
            if (sessionStorage.getItem('capySessOk') !== uid) {
                const r = await fetch('/api/auth/session', { cache: 'no-store' });
                if (r.status === 401) { this._sessionExpired(); return; }
                if (r.ok) sessionStorage.setItem('capySessOk', uid);
            }
        } catch (e) { /* offline — keep working locally */ }

        // 2) First visit on this device: pull the saved progress before pushing anything.
        if (!hadLocal) {
            try {
                const r = await fetch('/api/db?type=state', { cache: 'no-store' });
                if (r.status === 401) { this._sessionExpired(); return; }
                if (!r.ok) return;            // unknown server state → never overwrite it
                const remote = await r.json();
                if (remote && typeof remote === 'object') {
                    this.state = { ...capyDefaultState(), ...remote };
                    this.checkDailyReset();
                    this._writeLocal();
                    document.dispatchEvent(new Event('stateChanged'));
                }
            } catch (e) { return; }
        }
        this._remoteReady = true;
        if (this._dirty) this._scheduleRemoteSave(0);

        // 3) Plan sync (fresh after Kiwify webhook updates it).
        // Forces immediate sync if URL has ?refresh=1 (used after Kiwify checkout return).
        const forceSync = new URLSearchParams(window.location.search).get('refresh') === '1';
        this.syncPlanFromServer({ force: forceSync });

        // 4) Streak, daily goal and "continue" come from the server.
        this.refreshSummary();
    },

    // Old saves had no lastStudyDay (and a streak that never reset): infer it once.
    _migrateStreakFields() {
        if (this.state.lastStudyDay !== undefined && this.state.lastStudyDay !== '') return;
        if (!(this.state.streakDays > 0)) { this.state.lastStudyDay = ''; return; }
        const today = capyLocalDay(), yesterday = capyLocalDay(-1);
        const q = this.state.lastQuestDate || '';
        // Studied today → today; seen recently → give the benefit of the doubt (yesterday).
        this.state.lastStudyDay = this.state.streakActive && q === today ? today
            : (q >= yesterday ? yesterday : q);
    },

    // Latest server summary ({streak, today, lessons}); cached for 2 minutes per tab.
    summary: null,
    async refreshSummary({ force = false } = {}) {
        if (!this._userId) return null;
        try {
            const cached = JSON.parse(sessionStorage.getItem('capySummary') || 'null');
            if (!force && cached && cached.uid === this._userId && Date.now() - cached.at < 120000) {
                this._applySummary(cached.data);
                return cached.data;
            }
            const r = await fetch('/api/me/summary', { cache: 'no-store' });
            if (!r.ok) return null;
            const data = await r.json();
            sessionStorage.setItem('capySummary', JSON.stringify({ uid: this._userId, at: Date.now(), data }));
            this._applySummary(data);
            return data;
        } catch (e) { return null; }
    },

    _applySummary(data) {
        if (!data) return;
        this.summary = data;
        this.applyServerStreak(data.streak, null, { silent: true });
        document.dispatchEvent(new CustomEvent('summaryLoaded', { detail: data }));
    },

    // Server streak → local state. `today` = {count, goal, reached, justReached}.
    applyServerStreak(streak, today, { silent = false } = {}) {
        if (!streak) return;
        const before = this.state.streakDays;
        const next = {
            streakDays: streak.current || 0,
            longestStreak: Math.max(streak.longest || 0, this.state.longestStreak || 0),
            streakActive: !!streak.activeToday,
            lastStudyDay: streak.activeToday ? capyLocalDay() : this.state.lastStudyDay,
        };
        if (Object.keys(next).some(k => this.state[k] !== next[k])) {
            Object.assign(this.state, next);
            this.save();
        }
        if (silent) return;
        try { sessionStorage.removeItem('capySummary'); } catch (e) {}   // numbers changed on the server
        if (streak.extended) {
            window.capyTrack?.('streak_extended', { days: streak.current });
            document.dispatchEvent(new CustomEvent('streakExtended', { detail: { days: streak.current, before } }));
            if (streak.milestone) this.checkStreakMilestone();
        }
        if (today && today.justReached) {
            window.capyTrack?.('daily_goal_reached', { goal: today.goal });
            document.dispatchEvent(new CustomEvent('dailyGoalReached', { detail: today }));
        }
    },

    // Tells the server a study activity happened (games, trail, challenge...).
    async reportActivity(kind) {
        if (!this._userId) return null;
        try {
            const r = await fetch('/api/activity', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ kind: kind || 'other' }),
            });
            if (!r.ok) return null;
            const data = await r.json();
            this.applyServerStreak(data.streak, data.today);
            return data;
        } catch (e) { return null; }
    },

    _sessionExpired() {
        try {
            localStorage.removeItem('capySession');
            localStorage.removeItem('capyPlanSyncedAt');
            sessionStorage.removeItem('capySessOk');
        } catch (e) {}
        window.location.href = '4_Login_Capy_Yara_Welcomes_You.html?reason=session';
    },

    // ── Plan helpers ───────────────────────────────────────────────────────────
    isPro()   { return this.state.planType === 'pro' || this.state.planType === 'super'; },
    isSuper() { return this.state.planType === 'super'; },
    isFree()  { return !this.isPro(); },

    // Fetch /api/me and merge plan/planExpiresAt into state.
    // Throttled: only re-fetches if last sync > 1h ago (unless force=true).
    async syncPlanFromServer({ force = false } = {}) {
        try {
            if (!this._userId) return;
            const lastSync = parseInt(localStorage.getItem('capyPlanSyncedAt') || '0', 10);
            const oneHour = 60 * 60 * 1000;
            if (!force && (Date.now() - lastSync) < oneHour) return;
            const r = await fetch('/api/me', { cache: 'no-store' });
            if (!r.ok) return;
            const data = await r.json();
            const before = this.state.planType;
            this.state.planType = data.plan || 'free';
            this.state.planExpiresAt = data.planExpiresAt || null;
            this.state.kiwifySubscriptionId = data.kiwifySubscriptionId || null;
            // Update AI usage limit to match new plan
            this.state.aiUsageLimit = data.plan === 'super' ? 500 : data.plan === 'pro' ? 200 : 3;
            localStorage.setItem('capyPlanSyncedAt', String(Date.now()));
            this.save();
            if (before !== this.state.planType) {
                document.dispatchEvent(new CustomEvent('planChanged', {
                    detail: { from: before, to: this.state.planType }
                }));
            }
        } catch (e) { /* offline / api down — keep cached plan */ }
    },

    checkDailyReset() {
        const today = capyLocalDay();
        if (this.state.lastQuestDate !== today) {
            this.state.completedActivities = {};   // clear ALL daily activities
            this.state.streakActive = this.state.lastStudyDay === today;
            this.state.aiUsageToday = 0;           // reset AI counter daily
            this.state.lastQuestDate = today;
            // A missed day breaks the streak (logged-in users get the server value later).
            if (this.state.lastStudyDay && this.state.lastStudyDay < capyLocalDay(-1)) this.state.streakDays = 0;
            this.save();
        }
    },

    save() {
        this._writeLocal();
        document.dispatchEvent(new Event('stateChanged'));
        if (this._userId) {
            this._dirty = true;
            this._scheduleRemoteSave(2000);
        }
    },

    _writeLocal() {
        try { localStorage.setItem(this._key, JSON.stringify(this.state)); } catch (e) {}
    },

    _scheduleRemoteSave(delay) {
        if (!this._remoteReady) return;   // wait until the server copy was loaded
        clearTimeout(this._saveTimer);
        this._saveTimer = setTimeout(() => this._flush(false), delay);
    },

    // Sends pending changes now. keepalive=true lets it finish while the page unloads.
    _flush(keepalive) {
        if (!this._dirty || !this._remoteReady || !this._userId) return;
        this._dirty = false;
        clearTimeout(this._saveTimer);
        const body = JSON.stringify({ type: 'state', payload: this.state });
        fetch('/api/db', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            keepalive: !!keepalive && body.length < 60000,
            body,
        }).then(r => { if (!r.ok) this._dirty = true; })
          .catch(() => { this._dirty = true; });
    },

    // Wipes progress on this device AND on the server ("Reset progress" buttons).
    resetProgress() {
        const playerName = this.state.playerName;
        this.state = capyDefaultState();
        this.state.playerName = playerName;
        this.state.lastQuestDate = new Date().toISOString().slice(0, 10);
        this._writeLocal();
        document.dispatchEvent(new Event('stateChanged'));
        if (this._userId) {
            this._remoteReady = true;   // explicit user intent: overwrite the server copy
            this._dirty = true;
            this._flush(true);
        }
    },

    addXP(amount) {
        const levelBefore = this.getLevel();
        this.state.xp += amount;
        this.state.starBerries += Math.ceil(amount / 2); // Earn berries alongside XP
        this.save();
        const levelAfter = this.getLevel();
        if (levelAfter > levelBefore) {
            document.dispatchEvent(new CustomEvent('levelUp', { detail: { level: levelAfter } }));
        }
    },

    getLevel() {
        // Linear scaling for prototype
        return Math.floor(this.state.xp / 100) + 1;
    },

    getXPForNextLevel() {
        return this.getLevel() * 100;
    },

    // Call after any real study activity (game won, trail mini-lesson, challenge...).
    // Counts at most once per day locally; logged-in users also report it to the
    // server, whose answer (streak, daily goal) replaces the local numbers.
    activateStreak(kind) {
        const today = capyLocalDay();
        if (this.state.lastStudyDay !== today) {
            this.state.streakDays = this.state.lastStudyDay === capyLocalDay(-1) ? (this.state.streakDays || 0) + 1 : 1;
            this.state.longestStreak = Math.max(this.state.longestStreak || 0, this.state.streakDays);
            this.state.lastStudyDay = today;
            this.state.streakActive = true;
            this.save();
            if (!this._userId) {
                window.capyTrack?.('streak_extended', { days: this.state.streakDays });
                this.checkStreakMilestone();
            }
        }
        if (this._userId) this.reportActivity(kind || this._pageKind());
    },

    _pageKind() {
        const p = location.pathname;
        if (/_game\.html$|Game_Pavilion|flappy|tictactoe/i.test(p)) return 'game';
        if (/lessons\.html|lesson_runner|learn\.html/.test(p)) return 'trail';
        if (/daily_challenge|6_Home/.test(p)) return 'challenge';
        return 'other';
    },

    checkStreakMilestone() {
        const milestones = {
            3:  { xp: 20,  badge: null,           msg: '🔥 3-day streak! +20 bonus XP!' },
            7:  { xp: 50,  badge: 'week_warrior',  msg: '🏅 7-day streak! Week Warrior badge!' },
            14: { xp: 100, badge: 'fortnight_hero', msg: '🏆 14-day streak! Incredible!' },
            30: { xp: 250, badge: 'legend',         msg: '👑 30-day streak! You are a Legend!' },
        };
        const m = milestones[this.state.streakDays];
        if (m) {
            this.addXP(m.xp);
            if (m.badge) this.unlockBadge(m.badge);
            document.dispatchEvent(new CustomEvent('streakMilestone', { detail: { days: this.state.streakDays, msg: m.msg } }));
        }
    },

    unlockBadge(badgeId) {
        if (!this.state.badges.includes(badgeId)) {
            this.state.badges.push(badgeId);
            this.save();
            // Fire event so badge-toast.js can show the popup
            document.dispatchEvent(new CustomEvent('badgeUnlocked', { detail: { badgeId } }));
        }
    },

    completeActivity(activityId) {
        if (!this.state.completedActivities[activityId]) {
            this.state.completedActivities[activityId] = true;
            this.save();
        }
    },

    saveCustomLesson(lesson) {
        if (!this.state.customLessons) this.state.customLessons = [];
        const idx = this.state.customLessons.findIndex(l => l.id === lesson.id);
        if (idx >= 0) this.state.customLessons[idx] = lesson;
        else this.state.customLessons.push(lesson);
        this.save();
    },

    deleteCustomLesson(id) {
        if (!this.state.customLessons) return;
        this.state.customLessons = this.state.customLessons.filter(l => l.id !== id);
        this.save();
    },

    getNextCustomLessonId() {
        if (!this.state.customLessons || this.state.customLessons.length === 0) return 100;
        return Math.max(...this.state.customLessons.map(l => l.id)) + 1;
    },

    completeMini(lessonId, miniNum) {
        const key = `${lessonId}_${miniNum}`;
        if (!this.state.completedMinis) this.state.completedMinis = [];
        if (!this.state.completedMinis.includes(key)) {
            this.state.completedMinis.push(key);
            this.save();
        }
        // Each mini-lesson is a day of study; the last one also completes the lesson.
        if (miniNum === 4) this.completeLesson(lessonId);
        this.activateStreak('trail');
    },

    isMiniDone(lessonId, miniNum) {
        if (!this.state.completedMinis) return false;
        return this.state.completedMinis.includes(`${lessonId}_${miniNum}`);
    },

    completeLesson(lessonId) {
        if (!this.state.completedLessons) this.state.completedLessons = [];
        if (!this.state.completedLessons.includes(lessonId)) {
            this.state.completedLessons.push(lessonId);
            this.save();
        }
    },

    setPlayerName(name) {
        this.state.playerName = name.trim();
        this.save();
    },

    addBerries(amount) {
        this.state.starBerries += amount;
        this.save();
    },

    spendBerries(amount) {
        if (this.state.starBerries >= amount) {
            this.state.starBerries -= amount;
            this.save();
            return true;
        }
        return false;
    },

    unlockItem(itemId) {
        if (!this.state.purchasedItems) this.state.purchasedItems = [];
        if (!this.state.purchasedItems.includes(itemId)) {
            this.state.purchasedItems.push(itemId);
            this.save();
        }
    },

    // ── Plan & AI gating ──────────────────────────────────────
    consumeAI() {
        // Returns true if AI interaction is allowed; false if limit hit
        const limit = this.state.aiUsageLimit || 3;
        if ((this.state.aiUsageToday || 0) < limit) {
            this.state.aiUsageToday = (this.state.aiUsageToday || 0) + 1;
            this.save();
            return true;
        }
        // Fall back to top-up credits
        if ((this.state.aiCreditsExtra || 0) > 0) {
            this.state.aiCreditsExtra -= 1;
            this.save();
            return true;
        }
        return false;
    },

    getRemainingAI() {
        const base = (this.state.aiUsageLimit || 3) - (this.state.aiUsageToday || 0);
        return Math.max(0, base) + (this.state.aiCreditsExtra || 0);
    },

    addCredits(amount) {
        this.state.aiCreditsExtra = (this.state.aiCreditsExtra || 0) + amount;
        this.save();
    },

    setPlan(type) {
        const limits = { free: 3, plus: 15, pro: 50 };
        this.state.planType = type;
        this.state.aiUsageLimit = limits[type] || 3;
        this.save();
    },

    isPlusPlan() {
        return this.state.planType === 'plus' || this.state.planType === 'pro';
    },

    // Used by aula_43 / aula_44: get the state, mutate it, save it back.
    get()      { return this.state; },
    _save(st)  { if (st && typeof st === 'object') this.state = st; this.save(); }
};

// Many pages check `if (window.Store)`; a top-level const is not a window
// property, so expose it explicitly (without this, game XP was never saved).
window.Store = Store;

// Push pending changes when the tab is hidden or closed.
window.addEventListener('pagehide', () => Store._flush(true));
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') Store._flush(true);
});

// Immediately initialize
Store.init();
