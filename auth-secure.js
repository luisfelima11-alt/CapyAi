/**
 * Server-verified authentication facade.
 * Supabase tokens stay in HttpOnly cookies; localStorage is display-only.
 */
(function () {
  'use strict';
  const nativeFetch = window.fetch.bind(window);

  const Auth = {
    SESSION_KEY: 'capySession',
    CSRF_KEY: 'capyCsrf',
    _session: null,
    _readyPromise: null,

    _readDisplayCache() {
      try { return JSON.parse(localStorage.getItem(this.SESSION_KEY) || 'null'); }
      catch { return null; }
    },
    _saveDisplayCache(user) {
      const safe = user ? {
        id: String(user.id || ''), name: String(user.name || ''),
        email: String(user.email || ''), avatar: String(user.avatar || '🐾'),
        role: String(user.role || 'student'),
      } : null;
      this._session = safe;
      if (safe) localStorage.setItem(this.SESSION_KEY, JSON.stringify(safe));
      else localStorage.removeItem(this.SESSION_KEY);
    },
    _setCsrf(token) {
      if (token) sessionStorage.setItem(this.CSRF_KEY, token);
      else sessionStorage.removeItem(this.CSRF_KEY);
    },
    getCsrfToken() { return sessionStorage.getItem(this.CSRF_KEY) || ''; },

    async _request(path, options = {}) {
      const method = String(options.method || 'GET').toUpperCase();
      const headers = new Headers(options.headers || {});
      if (!headers.has('Content-Type') && options.body && !(options.body instanceof FormData)) headers.set('Content-Type', 'application/json');
      if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
        const csrf = this.getCsrfToken();
        if (csrf) headers.set('X-CSRF-Token', csrf);
      }
      const response = await nativeFetch(path, { ...options, method, headers, credentials: 'same-origin' });
      let data = null;
      if ((response.headers.get('content-type') || '').includes('application/json')) {
        try { data = await response.json(); } catch { data = null; }
      }
      if (!response.ok) {
        const error = new Error(data?.message || data?.error || `Request failed (${response.status})`);
        error.status = response.status;
        error.code = data?.error || 'request_failed';
        throw error;
      }
      return data;
    },

    getSession() { return this._session || this._readDisplayCache(); },
    isLoggedIn() { return Boolean(this.getSession()); },

    async refreshSession() {
      try {
        const data = await this._request('/api/auth/session');
        this._saveDisplayCache(data.user);
        this._setCsrf(data.csrfToken);
        return data.user;
      } catch (error) {
        if (error.status === 401) {
          this._saveDisplayCache(null);
          this._setCsrf('');
        }
        return null;
      }
    },
    ready() {
      if (!this._readyPromise) this._readyPromise = this.refreshSession();
      return this._readyPromise;
    },

    async login(email, password) {
      try {
        await this.ready();
        const data = await this._request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
        this._saveDisplayCache(data.user);
        this._setCsrf(data.csrfToken);
        this._readyPromise = Promise.resolve(data.user);
        return { ok: true, user: data.user };
      } catch (error) {
        return { ok: false, field: error.code === 'invalid_credentials' ? 'email' : 'password', error: error.message };
      }
    },
    async signUp(name, email, password, avatar = '🐾') {
      try {
        await this.ready();
        const data = await this._request('/api/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, password, avatar }) });
        if (data.user) {
          this._saveDisplayCache(data.user);
          this._setCsrf(data.csrfToken);
          this._readyPromise = Promise.resolve(data.user);
        }
        return { ok: true, user: data.user || null, verificationRequired: Boolean(data.verificationRequired) };
      } catch (error) {
        const field = error.code === 'invalid_name' ? 'name' : error.code === 'invalid_email' ? 'email' : 'password';
        return { ok: false, field, error: error.message };
      }
    },
    async requestPasswordReset(email) {
      await this._request('/api/auth/request-reset', { method: 'POST', body: JSON.stringify({ email }) });
      return true;
    },
    async setPassword(password) {
      await this._request('/api/auth/set-password', { method: 'POST', body: JSON.stringify({ password }) });
      return true;
    },
    async continueAsGuest() {
      try {
        await this.ready();
        const data = await this._request('/api/auth/guest', { method: 'POST', body: '{}' });
        this._saveDisplayCache(data.user);
        this._setCsrf(data.csrfToken);
        this._readyPromise = Promise.resolve(data.user);
        return { ok: true, user: data.user };
      } catch (error) {
        return { ok: false, error: error.message };
      }
    },
    async logout() {
      try { await this._request('/api/auth/logout', { method: 'POST', body: '{}' }); } catch {}
      this._saveDisplayCache(null);
      this._setCsrf('');
      window.location.href = '4_Login_Capy_Yara_Welcomes_You.html';
    },
    requireAuth() {
      if (!this.isLoggedIn()) {
        this.ready().then(user => { if (!user) window.location.href = '4_Login_Capy_Yara_Welcomes_You.html'; });
        return false;
      }
      this.ready().then(user => { if (!user) window.location.href = '4_Login_Capy_Yara_Welcomes_You.html'; });
      return true;
    },
    async fetchProfile() {
      try { return await this._request('/api/profile'); } catch { return null; }
    },
    async saveProfile(_userId, profileData) {
      try {
        await this._request('/api/profile', { method: 'POST', body: JSON.stringify(profileData || {}) });
        return true;
      } catch { return false; }
    },
    async checkOnboarding() {
      const session = await this.ready();
      if (!session || session.role === 'guest') return true;
      const profile = await this.fetchProfile();
      if (!profile?.onboarding_complete) {
        window.location.href = 'onboarding.html';
        return false;
      }
      if (window.Store) {
        Store.state.englishLevel = profile.english_level || null;
        Store.state.goals = profile.goals || [];
        Store.state.interests = profile.interests || [];
        Store.state.dailyGoalMinutes = profile.daily_goal_minutes || 10;
        Store.state.onboardingComplete = true;
      }
      return true;
    },
  };

  // Legacy pages use fetch directly. Inject credentials and CSRF centrally.
  window.fetch = function capySecureFetch(input, init = {}) {
    const url = typeof input === 'string' ? input : input?.url || '';
    const sameOrigin = url.startsWith('/') || !/^https?:\/\//i.test(url) || new URL(url, location.href).origin === location.origin;
    if (!sameOrigin) return nativeFetch(input, init);
    const method = String(init.method || 'GET').toUpperCase();
    const headers = new Headers(init.headers || (typeof input !== 'string' ? input.headers : undefined) || {});
    if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
      const csrf = Auth.getCsrfToken();
      if (csrf) headers.set('X-CSRF-Token', csrf);
    }
    return nativeFetch(input, { ...init, headers, credentials: 'same-origin' });
  };

  Auth._session = Auth._readDisplayCache();
  Auth.ready();
  window.Auth = Auth;
})();
