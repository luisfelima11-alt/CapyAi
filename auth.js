/**
 * auth.js — Capy English
 * The real session is an HttpOnly cookie set by the server (/api/auth/*).
 * localStorage.capySession only caches {id, name, email, avatar} for display.
 */
const Auth = {
    SESSION_KEY: 'capySession',

    /* ── helpers ─────────────────────────────────────── */
    async _post(path, body) {
        try {
            const res = await fetch(path, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body || {}),
            });
            let data = {};
            try { data = await res.json(); } catch (e) {}
            return { ok: res.ok, status: res.status, data: data || {} };
        } catch (e) {
            return { ok: false, status: 0, data: { message: 'Sem conexão. Verifique sua internet e tente de novo.' } };
        }
    },

    /* ── session ─────────────────────────────────────── */
    getSession() {
        try { return JSON.parse(localStorage.getItem(this.SESSION_KEY) || 'null'); } catch (e) { return null; }
    },
    isLoggedIn()      { return !!this.getSession(); },

    saveSession(user) {
        const s = { id: user.id, name: user.name, email: user.email, avatar: user.avatar };
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(s));
        try { sessionStorage.setItem('capySessOk', user.id); } catch (e) {}
    },

    // Removes everything this device knows about the current user.
    clearLocal(userId) {
        try {
            localStorage.removeItem(this.SESSION_KEY);
            localStorage.removeItem('capyPlanSyncedAt');
            localStorage.removeItem('capyYaraState');
            if (userId && userId !== 'guest') localStorage.removeItem('capyYaraState_' + userId);
            sessionStorage.removeItem('capySessOk');
        } catch (e) {}
    },

    // The server no longer accepts this device's session (expired, logged out
    // elsewhere, or created before the security update): ask to log in again.
    // Local progress is kept; it is refreshed from the server after login.
    sessionExpired() {
        try {
            localStorage.removeItem(this.SESSION_KEY);
            localStorage.removeItem('capyPlanSyncedAt');
            sessionStorage.removeItem('capySessOk');
        } catch (e) {}
        window.location.href = '4_Login_Capy_Yara_Welcomes_You.html?reason=session';
    },

    async logout() {
        const s = this.getSession();
        try { if (window.Store && Store._flush) Store._flush(true); } catch (e) {}
        try { await fetch('/api/auth/logout', { method: 'POST' }); } catch (e) {}
        this.clearLocal(s && s.id);
        window.location.href = '4_Login_Capy_Yara_Welcomes_You.html';
    },

    /* redirect to login if not authenticated */
    requireAuth() {
        if (!this.isLoggedIn()) {
            window.location.href = '4_Login_Capy_Yara_Welcomes_You.html';
            return false;
        }
        return true;
    },

    /* ── sign up ─────────────────────────────────────── */
    async signUp(name, email, password, avatar = '🐾') {
        if (!name || name.trim().length < 2)
            return { ok: false, field: 'name', error: 'O nome precisa ter pelo menos 2 letras.' };
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim()))
            return { ok: false, field: 'email', error: 'Digite um e-mail válido.' };
        if (!password || password.length < 8)
            return { ok: false, field: 'password', error: 'A senha precisa ter pelo menos 8 caracteres.' };

        const r = await this._post('/api/auth/signup', { name, email, password, avatar });
        if (!r.ok) {
            return { ok: false, field: r.data.field || 'email', error: r.data.message || 'Não foi possível criar sua conta agora.' };
        }
        const user = r.data.user;
        this.saveSession(user);

        // Seed a fresh Store state for this user
        const storeKey = 'capyYaraState_' + user.id;
        if (!localStorage.getItem(storeKey)) {
            localStorage.setItem(storeKey, JSON.stringify({
                xp: 0, streakActive: false, streakDays: 0,
                badges: [], completedActivities: {},
                playerName: user.name, lastQuestDate: ''
            }));
        }
        return { ok: true, user };
    },

    /* ── login ───────────────────────────────────────── */
    async login(email, password) {
        const r = await this._post('/api/auth/login', { email, password });
        if (!r.ok) {
            return {
                ok: false,
                code: r.data.error,
                field: r.data.field || 'password',
                error: r.data.message || 'E-mail ou senha incorretos.',
            };
        }
        this.saveSession(r.data.user);
        await this.loadRemoteState(r.data.user.id);
        return { ok: true, user: r.data.user };
    },

    // Copies the progress saved on the server to this device. Call right after
    // login, before any page runs Store.save(), so nothing overwrites it.
    async loadRemoteState(userId) {
        try {
            const res = await fetch('/api/db?type=state', { cache: 'no-store' });
            if (!res.ok) return false;
            const data = await res.json();
            if (data && typeof data === 'object') {
                localStorage.setItem('capyYaraState_' + userId, JSON.stringify(data));
            }
            return true;
        } catch (e) { return false; }
    },

    /* guest session (no account needed) */
    continueAsGuest() {
        const guest = { id: 'guest', name: 'Explorer', email: '', avatar: '🌿' };
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(guest));
    },

    /* ── Profile / Onboarding ────────────────────────── */

    /** Fetch the logged-in user's profile. Returns null for guests or on error. */
    async fetchProfile(userId) {
        if (!userId || userId === 'guest') return null;
        try {
            const res = await fetch('/api/profile', { cache: 'no-store' });
            if (res.ok) return await res.json();
        } catch(e) {}
        return null;
    },

    /** Save (upsert) the logged-in user's profile. */
    async saveProfile(userId, profileData) {
        if (!userId || userId === 'guest') return false;
        try {
            const res = await fetch('/api/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileData)
            });
            return res.ok;
        } catch(e) {}
        return false;
    },

    /**
     * Check if the current user has completed onboarding.
     * If not → redirect to onboarding.html.
     * Call this at the top of main pages (learn.html, classes.html, etc.)
     * Returns true if onboarding is done (or user is guest), false if redirected.
     */
    async checkOnboarding() {
        const session = this.getSession();
        if (!session || session.id === 'guest') return true; // guests skip onboarding
        let res;
        try { res = await fetch('/api/profile', { cache: 'no-store' }); }
        catch (e) { return true; }                          // offline: don't block the page
        if (res.status === 401) { this.sessionExpired(); return false; }
        if (!res.ok) return true;                           // server hiccup: don't force onboarding
        let profile = null;
        try { profile = await res.json(); } catch (e) {}
        if (!profile || !profile.onboarding_complete) {
            window.location.href = 'onboarding.html';
            return false;
        }
        // Cache profile in Store for instant reads
        try {
            if (window.Store) {
                Store.state.englishLevel     = profile.english_level    || null;
                Store.state.goals            = profile.goals            || [];
                Store.state.interests        = profile.interests        || [];
                Store.state.dailyGoalMinutes = profile.daily_goal_minutes || 10;
                Store.state.onboardingComplete = true;
            }
        } catch(e) {}
        return true;
    },
};

// Pages check `window.Auth`; a top-level const is not a window property.
window.Auth = Auth;

// Old versions cached every account (including passwords) on the device.
try { localStorage.removeItem('capyUsers'); } catch (e) {}
