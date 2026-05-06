/**
 * auth.js — Capy Yara Adventures
 * Lightweight localStorage-based auth. Not production security — prototype only.
 */
const Auth = {
    USERS_KEY:   'capyUsers',
    SESSION_KEY: 'capySession',

    /* ── helpers ─────────────────────────────────────── */
    async _getUsers() {
        try {
            const res = await fetch('/api/db/accounts');
            if (res.ok) {
                const data = await res.json();
                localStorage.setItem(this.USERS_KEY, JSON.stringify(data.accounts));
                return data.accounts;
            }
        } catch(e) {}
        return JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
    },
    async _saveUsers(u) {
        localStorage.setItem(this.USERS_KEY, JSON.stringify(u));
        try {
            await fetch('/api/db/accounts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accounts: u })
            });
        } catch(e) {}
    },
    _encode(pw)       { return btoa(unescape(encodeURIComponent(pw)));                        },

    /* ── session ─────────────────────────────────────── */
    getSession()      { return JSON.parse(localStorage.getItem(this.SESSION_KEY) || 'null'); },
    isLoggedIn()      { return !!this.getSession();                                           },

    saveSession(user) {
        const s = { id: user.id, name: user.name, email: user.email, avatar: user.avatar };
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(s));
    },

    logout() {
        localStorage.removeItem(this.SESSION_KEY);
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
    async signUp(name, email, password, avatar = '🦫') {
        const users = await this._getUsers();
        const norm  = email.toLowerCase().trim();

        if (!name || name.trim().length < 2)
            return { ok: false, field: 'name', error: 'Name must be at least 2 characters.' };
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(norm))
            return { ok: false, field: 'email', error: 'Please enter a valid email address.' };
        if (password.length < 6)
            return { ok: false, field: 'password', error: 'Password must be at least 6 characters.' };
        if (users.find(u => u.email === norm))
            return { ok: false, field: 'email', error: 'An account with that email already exists.' };

        const user = {
            id:        Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
            name:      name.trim(),
            email:     norm,
            password:  this._encode(password),
            avatar,
            createdAt: new Date().toISOString(),
        };
        users.push(user);
        await this._saveUsers(users);
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
        const users = await this._getUsers();
        const norm  = email.toLowerCase().trim();
        const user  = users.find(u => u.email === norm);

        if (!user)
            return { ok: false, field: 'email', error: 'No account found with that email.' };
        if (user.password !== this._encode(password))
            return { ok: false, field: 'password', error: 'Incorrect password. Try again.' };

        this.saveSession(user);
        return { ok: true, user };
    },

    /* guest session (no account needed) */
    continueAsGuest() {
        const guest = { id: 'guest', name: 'Explorer', email: '', avatar: '🌿' };
        this.saveSession(guest);
    },
};
