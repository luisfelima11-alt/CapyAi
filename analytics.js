/**
 * analytics.js — product analytics (PostHog)
 * ───────────────────────────────────────────────────────────────────────────
 * Everything is a no-op until CAPY_ANALYTICS.posthogKey is filled in.
 *
 *   capyTrack('lesson_completed', { lesson_id: 'aula_07' })
 *
 * Privacy (LGPD): no analytics cookies/localStorage until the visitor accepts
 * the banner (before that, PostHog keeps its IDs in memory only). "Agora não"
 * turns analytics off. Logged-in users are identified by their internal id
 * only (no name/e-mail). Autocapture and session recording are off.
 */
(function () {
    const CAPY_ANALYTICS = Object.assign({
        posthogKey: '',                          // PostHog project API key (public, starts with "phc_")
        apiHost: 'https://us.i.posthog.com',     // or 'https://eu.i.posthog.com'
    }, window.CAPY_ANALYTICS_CONFIG || {});

    const CONSENT_KEY = 'capyAnalyticsConsent';  // 'yes' | 'no'
    const enabled = !!CAPY_ANALYTICS.posthogKey;
    let consent = null;
    try { consent = localStorage.getItem(CONSENT_KEY); } catch (e) {}

    const isLocal = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);

    // Public API — safe to call even when analytics is disabled.
    window.capyTrack = function (event, props) {
        if (isLocal) console.debug('[capyTrack]', event, props || {});
        if (!enabled || consent === 'no' || !window.posthog) return;
        try { window.posthog.capture(event, props || {}); } catch (e) {}
    };
    window.capyIdentify = function (userId) {
        if (!enabled || consent === 'no' || !window.posthog || !userId || userId === 'guest') return;
        try { window.posthog.identify(String(userId)); } catch (e) {}
    };
    window.capyResetAnalytics = function () {
        if (!enabled || !window.posthog) return;
        try { window.posthog.reset(); } catch (e) {}
    };

    if (!enabled || consent === 'no') return;

    // ── PostHog loader (same queue contract as the official snippet) ────────
    const ph = window.posthog = window.posthog || [];
    if (!ph.__SV) {
        ph._i = [];
        ph.init = function (key, cfg, name) { ph._i.push([key, cfg, name]); };
        ['capture', 'identify', 'reset', 'register', 'set_config', 'opt_in_capturing',
         'opt_out_capturing', 'get_distinct_id'].forEach(m => {
            ph[m] = function () { ph.push([m].concat(Array.prototype.slice.call(arguments))); };
        });
        ph.__SV = 1;
        const s = document.createElement('script');
        s.async = true;
        s.crossOrigin = 'anonymous';
        s.src = CAPY_ANALYTICS.apiHost.replace('.i.posthog.com', '-assets.i.posthog.com') + '/static/array.js';
        (document.head || document.documentElement).appendChild(s);
    }

    // Never send login tokens or e-mails that may appear in URLs.
    function scrubUrl(u) {
        return typeof u === 'string' ? u.replace(/([?&](token|email)=)[^&#]*/gi, '$1[redacted]') : u;
    }

    ph.init(CAPY_ANALYTICS.posthogKey, {
        api_host: CAPY_ANALYTICS.apiHost,
        person_profiles: 'identified_only',
        persistence: consent === 'yes' ? 'localStorage+cookie' : 'memory',
        autocapture: false,
        capture_pageview: true,
        capture_pageleave: true,
        disable_session_recording: true,
        sanitize_properties: function (props) {
            ['$current_url', '$referrer', '$initial_current_url', '$initial_referrer'].forEach(k => {
                if (props && props[k]) props[k] = scrubUrl(props[k]);
            });
            return props;
        },
    });

    // Identify the logged-in user (internal id only).
    try {
        const s = JSON.parse(localStorage.getItem('capySession') || 'null');
        if (s && s.id && s.id !== 'guest') window.capyIdentify(s.id);
    } catch (e) {}

    // Events queued by pages that do not load analytics (e.g. verify.html).
    try {
        const pending = JSON.parse(sessionStorage.getItem('capyPendingTrack') || '[]');
        sessionStorage.removeItem('capyPendingTrack');
        pending.forEach(p => p && p.event && window.capyTrack(p.event, p.props));
    } catch (e) {}

    // Checkout clicks (Kiwify links anywhere on the site).
    const CHECKOUT = {
        '7HYhJgk': { plan: 'pro', period: 'monthly' },
        'gfRhn8u': { plan: 'pro', period: 'annual' },
        'lIBOlgZ': { plan: 'super', period: 'monthly' },
        'hlqrYma': { plan: 'super', period: 'annual' },
    };
    document.addEventListener('click', e => {
        const a = e.target && e.target.closest && e.target.closest('a[href*="pay.kiwify.com.br"]');
        if (!a) return;
        const code = (a.getAttribute('href').split('/').pop() || '').split('?')[0];
        window.capyTrack('checkout_clicked', Object.assign({ page: location.pathname }, CHECKOUT[code] || { code }));
    }, true);

    // ── Consent banner (only when analytics is configured) ───────────────────
    if (consent !== null) return;
    function showBanner() {
        if (document.getElementById('capy-consent')) return;
        const bar = document.createElement('div');
        bar.id = 'capy-consent';
        bar.setAttribute('role', 'dialog');
        bar.setAttribute('aria-label', 'Cookies de análise');
        bar.style.cssText = 'position:fixed;left:16px;right:16px;bottom:16px;z-index:10001;max-width:560px;margin:0 auto;background:#0f172a;color:#e2e8f0;border-radius:16px;padding:14px 16px;box-shadow:0 10px 40px rgba(0,0,0,.35);font:500 13px/1.5 system-ui,sans-serif;display:flex;flex-wrap:wrap;gap:10px;align-items:center;';
        bar.innerHTML = '<span style="flex:1 1 260px">Usamos cookies de análise para entender o uso do app e melhorar as aulas. <a href="privacidade.html" style="color:#f9a8d4">Saiba mais</a></span>'
            + '<button type="button" data-v="no" style="background:transparent;color:#cbd5e1;border:0;font-weight:800;cursor:pointer;padding:8px 10px">Agora não</button>'
            + '<button type="button" data-v="yes" style="background:#ec4899;color:#fff;border:0;border-radius:9999px;font-weight:800;cursor:pointer;padding:8px 16px">Aceitar</button>';
        bar.addEventListener('click', ev => {
            const v = ev.target && ev.target.getAttribute && ev.target.getAttribute('data-v');
            if (!v) return;
            try { localStorage.setItem(CONSENT_KEY, v); } catch (e) {}
            consent = v;
            if (v === 'yes') ph.set_config({ persistence: 'localStorage+cookie' });
            else ph.opt_out_capturing();
            bar.remove();
        });
        document.body.appendChild(bar);
    }
    if (document.body) showBanner();
    else document.addEventListener('DOMContentLoaded', showBanner);
})();
