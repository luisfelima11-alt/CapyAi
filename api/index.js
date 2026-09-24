const https  = require('https');
const crypto = require('crypto');
const { sb, sbRequest, sbRows } = require('./_lib/supabase');
const session = require('./_lib/session');
const { buildChat, clip, clipList, cleanHistory } = require('./_lib/prompts');
const { todayBRT, secondsUntilBrtMidnight } = require('./_lib/dates');
const progress = require('./_lib/progress');

// ── Kiwify product → plan mapping ──────────────────────────────────────────
// Product IDs from Kiwify dashboard URLs (.../products/edit/<UUID>).
const KIWIFY_PRODUCT_TO_PLAN = {
    '5c8bbc90-5b7c-11f1-a87a-a7adeb9e851c': 'pro',    // Capy English Pro
    'fcdb2a50-5b7c-11f1-9be1-a7a72938329d': 'super',  // Capy English Super
};

function planFromKiwifyProduct({ productId, productName }) {
    if (productId && KIWIFY_PRODUCT_TO_PLAN[productId]) return KIWIFY_PRODUCT_TO_PLAN[productId];
    // Fallback: regex on product NAME ("Pro" or "Super") — covers test webhooks
    // and any future product whose ID isn't yet mapped.
    const name = (productName || '').toLowerCase();
    if (name.includes('super')) return 'super';
    if (name.includes('pro'))   return 'pro';
    return null;
}

// Detect if subscription is annual (so we set plan_expires_at +400d vs +35d).
// Kiwify payload exposes plan info in Subscription.plan or similar field.
function isAnnualSubscription(payload) {
    const candidates = [
        payload.Subscription?.plan?.name,
        payload.Subscription?.plan?.frequency,
        payload.Subscription?.charge_frequency,
        payload.Subscription?.frequency,
        payload.Subscription?.next_payment,  // long gap suggests annual
        payload.subscription_plan,
        payload.plan_name,
        payload.charge_frequency,
        payload.Product?.product_name, // last-resort: name "Anual" in some setups
    ].filter(Boolean).map(String).join(' ').toLowerCase();
    return /anual|annual|yearly|ano(?!\w)|year/i.test(candidates);
}

// ── Small helpers ───────────────────────────────────────────────────────────
const nowIso = () => new Date().toISOString();
const enc = encodeURIComponent;

function escapeHtml(s) {
    return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// Plain text for names/avatars: strips characters that could become HTML.
function cleanText(v, max) {
    return clip(String(v == null ? '' : v).replace(/[<>"'`&]/g, '').trim(), max);
}

function normEmail(email) { return String(email || '').toLowerCase().trim(); }
function isValidEmail(email) { return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }

function publicUser(acc) {
    return { id: acc.id, name: acc.name, email: acc.email, avatar: acc.avatar || '🐾' };
}

// Read raw body with a size cap (returns null if the cap is exceeded).
function readRawBody(req, maxBytes = 256 * 1024) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        let size = 0;
        let overflow = false;
        req.on('data', c => {
            if (overflow) return;
            size += c.length;
            if (size > maxBytes) { overflow = true; chunks.length = 0; return; }
            chunks.push(Buffer.from(c));
        });
        req.on('end',  () => resolve(overflow ? null : Buffer.concat(chunks).toString('utf8')));
        req.on('error', reject);
    });
}

async function readBody(req, maxBytes) {
    let raw = null;
    try { raw = await readRawBody(req, maxBytes); } catch (e) { return {}; }
    if (!raw) return {};
    try {
        const v = JSON.parse(raw);
        return v && typeof v === 'object' && !Array.isArray(v) ? v : {};
    } catch (e) { return {}; }
}

function clientIp(req) {
    const xff = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
    return xff || String(req.headers['x-real-ip'] || '') || (req.socket && req.socket.remoteAddress) || 'unknown';
}

// ── Allowed origins (CSRF defense for cookie-authenticated POSTs) ──────────
function isAllowedOrigin(origin) {
    if (!origin) return true; // same-origin navigations / non-browser clients
    let u;
    try { u = new URL(origin); } catch (e) { return false; }
    const host = u.hostname;
    if (host === 'localhost' || host === '127.0.0.1') return true;
    if (u.protocol !== 'https:') return false;
    if (host === 'capyenglish.com.br' || host === 'www.capyenglish.com.br') return true;
    if (/^capy-yara-adventures[a-z0-9-]*\.vercel\.app$/.test(host)) return true;
    const extra = [
        process.env.APP_URL,
        process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
        process.env.VERCEL_BRANCH_URL && `https://${process.env.VERCEL_BRANCH_URL}`,
        process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
        ...(process.env.ALLOWED_ORIGINS || '').split(','),
    ].map(s => (s || '').trim()).filter(Boolean);
    return extra.some(o => { try { return new URL(o).origin === u.origin; } catch (e) { return false; } });
}

// ── Admin / teacher key (header X-Admin-Key, never a default) ──────────────
function adminAuth(req) {
    const expected = process.env.TEACHER_KEY || '';
    if (expected.length < 8) return 'not_configured';
    const given = String(req.headers['x-admin-key'] || '');
    return given && session.safeEqual(given, expected) ? 'ok' : 'forbidden';
}

function rejectAdmin(res, status) {
    if (status === 'not_configured') res.status(503).json({ error: 'admin_not_configured', message: 'Configure TEACHER_KEY (8+ caracteres) nas variáveis de ambiente.' });
    else res.status(403).json({ error: 'forbidden' });
}

// ── Rate limiting ───────────────────────────────────────────────────────────
// Daily quotas (reset 00:00 BRT). `guest` = no session (counted per IP).
const RATE_LIMITS = {
    chat:         { guest:  10, free:  20, pro: 200, super: 500 },
    'ai-gen':     { guest:  15, free:  40, pro: 200, super: 500 },  // quiz, translate, story, flashcards, dialogue, reports
    daily:        { guest:  10, free:  10, pro:  20, super:  20 },  // word-of-day / daily-challenge (cache miss only)
    music:        { guest:   1, free:   3, pro:  50, super: 150 },
    'study-plan': { guest:   1, free:   2, pro:  20, super:  60 },
    personalize:  { guest:   1, free:   2, pro:  30, super:  90 },
    youtube:      { guest:   1, free:   3, pro:  30, super:  90 },
    lyrics:       { guest:  10, free:  10, pro: 100, super: 300 },
    tts:          { guest: 300, free: 300, pro:1000, super:2000 },
    'magic-link': { guest:   5, free:   5, pro:   5, super:   5 },  // per IP
    'magic-link-email': { guest: 5 },                                // per e-mail address
    signup:       { guest:  10 },                                    // per IP
    login:        { guest:  30 },                                    // per IP
    'login-email':{ guest:  15 },                                    // per e-mail address
    password:     { guest:  10, free:  10, pro:  10, super:  10 },
    activity:     { free: 300, pro: 300, super: 300 },          // study activity reports (games, trail...)
    progress:     { free: 600, pro: 600, super: 600 },          // lesson progress saves
};

async function getUserPlan(userId) {
    if (!userId) return 'guest';
    const rows = await sbRows(`/user_profiles?id=eq.${enc(userId)}&select=plan,plan_expires_at`);
    const row = rows[0];
    if (!row) return 'free';
    if (row.plan_expires_at && new Date(row.plan_expires_at) < new Date()) return 'free';
    return (row.plan === 'pro' || row.plan === 'super') ? row.plan : 'free';
}

// identity: explicit bucket owner (e.g. 'e:<email>'); default = user or IP.
async function checkRateLimit(req, key, userId, identity) {
    const today = todayBRT();
    const who = identity || (userId ? ('u:' + userId) : ('ip:' + clientIp(req)));
    const bucket = `${who}|${key}|${today}`;
    const plan = identity ? 'guest' : await getUserPlan(userId);
    const table = RATE_LIMITS[key] || RATE_LIMITS.chat;
    const limit = table[plan] ?? table.free ?? table.guest ?? 10;

    const existing = await sbRows(`/rate_limit_log?bucket=eq.${enc(bucket)}&select=count`);
    const used = existing[0]?.count || 0;
    if (used >= limit) {
        return { ok: false, retryAfter: secondsUntilBrtMidnight(), limit, used, plan, key };
    }
    await sb('/rate_limit_log', {
        method: 'POST',
        headers: { 'Prefer': 'resolution=merge-duplicates,return=minimal' },
        body: JSON.stringify({ bucket, count: used + 1, updated_at: nowIso() }),
    });
    return { ok: true, limit, used: used + 1, plan, key };
}

const AUTH_LIMIT_KEYS = new Set(['signup', 'login', 'login-email', 'magic-link', 'magic-link-email', 'password']);

function rateLimitedResponse(res, info) {
    res.setHeader('Retry-After', String(info.retryAfter));
    res.setHeader('X-RateLimit-Limit', String(info.limit));
    res.setHeader('X-RateLimit-Used',  String(info.used));
    res.setHeader('X-RateLimit-Plan',  info.plan);
    const message = AUTH_LIMIT_KEYS.has(info.key)
        ? 'Muitas tentativas por hoje. Tente novamente mais tarde.'
        : info.plan === 'guest'
            ? 'Limite diário para visitantes atingido. Crie sua conta grátis para continuar.'
            : info.plan === 'free'
                ? 'Limite diário do plano grátis atingido. Assine Pro para ter mais usos.'
                : 'Limite diário do seu plano atingido. Tente novamente amanhã.';
    res.status(429).json({
        error: 'rate_limited', message,
        limit: info.limit, used: info.used, plan: info.plan, retryAfter: info.retryAfter,
    });
}

// ── In-memory metrics (per cold start) + debounced persist ──────────────────
const _metrics = {}; // key: 'YYYY-MM-DD|/api/chat' → { requests, errors, total_ms }
let _persistTimer = null;
function bumpMetrics(url, status, ms) {
    const day = new Date().toISOString().slice(0, 10);
    const key = `${day}|${url}`;
    const m = _metrics[key] = _metrics[key] || { requests: 0, errors: 0, total_ms: 0 };
    m.requests++;
    if (status >= 500) m.errors++;
    m.total_ms += ms;
    if (!_persistTimer) _persistTimer = setTimeout(persistMetrics, 60000);
}
async function persistMetrics() {
    _persistTimer = null;
    const snapshot = Object.entries(_metrics).map(([k, v]) => {
        const [day, endpoint] = k.split('|');
        return { day, endpoint, ...v };
    });
    for (const row of snapshot) {
        try {
            const existing = await sbRows(`/api_metrics_daily?day=eq.${row.day}&endpoint=eq.${enc(row.endpoint)}&select=*`);
            const prev = existing[0];
            const merged = prev ? {
                day: row.day, endpoint: row.endpoint,
                requests: prev.requests + row.requests,
                errors:   prev.errors   + row.errors,
                total_ms: prev.total_ms + row.total_ms,
            } : row;
            await sb('/api_metrics_daily', {
                method: 'POST',
                headers: { 'Prefer': 'resolution=merge-duplicates,return=minimal' },
                body: JSON.stringify(merged),
            });
        } catch (e) { /* swallow — metrics are best-effort */ }
    }
    Object.keys(_metrics).forEach(k => delete _metrics[k]);
}

// ── OpenAI ────────────────────────────────────────────────────────────────────
const API_KEY = process.env.OPENAI_API_KEY;
const MODEL   = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const AI_UNAVAILABLE = 'A Yara está indisponível no momento. Tente de novo em instantes.';

// Resolves to { ok:true, text } or { ok:false, status, error } — never rejects.
function openaiChat({ messages, maxTokens, temperature, json, timeoutMs = 25000 }) {
    return new Promise(resolve => {
        if (!API_KEY) return resolve({ ok: false, status: 503, error: 'AI features require OPENAI_API_KEY.' });
        const payload = { model: MODEL, messages, max_tokens: maxTokens, temperature };
        if (json) payload.response_format = { type: 'json_object' };
        const postData = JSON.stringify(payload);
        let settled = false;
        const finish = r => { if (!settled) { settled = true; resolve(r); } };
        const apiReq = https.request({
            hostname: 'api.openai.com',
            path:     '/v1/chat/completions',
            method:   'POST',
            headers: {
                'Content-Type':   'application/json',
                'Authorization':  `Bearer ${API_KEY}`,
                'Content-Length': Buffer.byteLength(postData),
            },
        }, apiRes => {
            let data = '';
            apiRes.on('data', chunk => data += chunk);
            apiRes.on('end', () => {
                if (apiRes.statusCode !== 200) {
                    let msg = data;
                    try { msg = JSON.parse(data)?.error?.message || data; } catch (e) {}
                    console.error('[openai]', apiRes.statusCode, String(msg).slice(0, 200));
                    finish({ ok: false, status: 502, error: 'upstream_error' });
                    return;
                }
                try { finish({ ok: true, text: JSON.parse(data)?.choices?.[0]?.message?.content || '' }); }
                catch (e) { finish({ ok: false, status: 502, error: 'Failed to parse OpenAI response' }); }
            });
        });
        apiReq.setTimeout(timeoutMs, () => apiReq.destroy(new Error('timeout')));
        apiReq.on('error', err => {
            console.error('[openai]', err.message);
            finish({ ok: false, status: err.message === 'timeout' ? 504 : 502, error: err.message });
        });
        apiReq.write(postData);
        apiReq.end();
    });
}

// Chat-style endpoints reply with the legacy Gemini-shaped envelope that all
// client parsers expect: { candidates:[{ content:{ parts:[{ text }] } }] }.
async function callOpenAI(messages, maxTokens, temperature, res, opts = {}) {
    const r = await openaiChat({ messages, maxTokens, temperature, json: opts.json });
    if (!r.ok) {
        const message = r.status === 503 ? 'AI features require OPENAI_API_KEY.' : AI_UNAVAILABLE;
        res.status(r.status).json({ error: { code: r.status, message } });
        return;
    }
    res.status(200).json({ candidates: [{ content: { parts: [{ text: r.text }] } }] });
}

// JSON-generating endpoints (YouTube Lab, personalize, study plan, music).
async function sendOpenAIJson(res, prompt, { maxTokens, temperature, errorMessage, extra }) {
    const r = await openaiChat({ messages: [{ role: 'user', content: prompt }], maxTokens, temperature, json: true, timeoutMs: 45000 });
    if (!r.ok) {
        res.status(r.status).json({ error: r.status === 503 ? 'AI features require OPENAI_API_KEY.' : 'Erro de conexão com a IA.' });
        return;
    }
    try { res.status(200).json({ ...(extra || {}), ...JSON.parse(r.text || '{}') }); }
    catch (e) { res.status(502).json({ error: errorMessage }); }
}

// Daily content: one generation per day per warm instance, same for everyone.
const _dailyCache = {};
async function sendDailyContent(req, res, key, prompt, maxTokens, temperature, userId) {
    const day = todayBRT();
    const hit = _dailyCache[key];
    if (hit && hit.day === day) { res.status(200).json(hit.body); return; }
    const _rl = await checkRateLimit(req, 'daily', userId);
    if (!_rl.ok) { rateLimitedResponse(res, _rl); return; }
    const r = await openaiChat({ messages: [{ role: 'user', content: prompt(day) }], maxTokens, temperature });
    if (!r.ok) {
        res.status(r.status).json({ error: { code: r.status, message: r.status === 503 ? 'AI features require OPENAI_API_KEY.' : AI_UNAVAILABLE } });
        return;
    }
    const body = { candidates: [{ content: { parts: [{ text: r.text }] } }] };
    _dailyCache[key] = { day, body };
    res.status(200).json(body);
}

// ── Profile fields a user may edit (plan/billing fields are server-only) ────
const PROFILE_FIELDS = {
    english_level:       v => (typeof v === 'string' ? clip(v, 20) : null),
    goals:               v => clipList(v, 10, 40),
    interests:           v => clipList(v, 12, 40),
    interests_detail:    v => (v == null ? null : clip(v, 300)),
    daily_goal_minutes:  v => { const n = Number(v); return Number.isFinite(n) && n >= 1 && n <= 120 ? Math.round(n) : 10; },
    onboarding_complete: v => !!v,
};

function pickProfile(body) {
    const out = {};
    Object.keys(PROFILE_FIELDS).forEach(k => {
        if (Object.prototype.hasOwnProperty.call(body, k)) out[k] = PROFILE_FIELDS[k](body[k]);
    });
    return out;
}

async function sendMagicLinkEmail({ to, userName, verifyUrl }) {
    const html = `<!DOCTYPE html><html lang="pt-BR"><body style="font-family:system-ui,Segoe UI,Helvetica,Arial,sans-serif;background:#f8fafc;padding:24px;margin:0">
<div style="max-width:520px;margin:0 auto;background:#fff;border-radius:20px;padding:32px;box-shadow:0 8px 30px rgba(0,0,0,.06)">
  <div style="text-align:center;font-size:48px;margin-bottom:8px">🦫</div>
  <h1 style="color:#001f3f;font-weight:900;font-size:22px;margin:0 0 12px;text-align:center">Seu link de acesso</h1>
  <p style="font-size:15px;color:#475569;line-height:1.6;text-align:center;margin:0 0 24px">Olá, <strong>${escapeHtml(userName)}</strong>! Clique no botão abaixo para entrar na Capy English. O link expira em 15 minutos.</p>
  <div style="text-align:center;margin:28px 0">
    <a href="${escapeHtml(verifyUrl)}" style="display:inline-block;background:linear-gradient(135deg,#FF9F1C,#fb923c);color:#fff;font-weight:900;padding:15px 32px;border-radius:14px;text-decoration:none;font-size:15px;box-shadow:0 8px 20px rgba(249,115,22,.3)">⚡ Entrar agora</a>
  </div>
  <p style="font-size:12px;color:#94a3b8;line-height:1.6;text-align:center;margin:24px 0 8px">Se você não solicitou esse link, é só ignorar.</p>
  <p style="font-size:11px;color:#cbd5e1;line-height:1.5;text-align:center;word-break:break-all;margin:0">Ou copie e cole no navegador:<br>${escapeHtml(verifyUrl)}</p>
  <hr style="border:none;border-top:1px solid #f1f5f9;margin:24px 0">
  <p style="font-size:11px;color:#94a3b8;text-align:center;margin:0">Capy English · Aprenda inglês com a Yara 🌿</p>
</div></body></html>`;

    const sendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + process.env.RESEND_API_KEY,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            from: process.env.EMAIL_FROM || 'Capy English <onboarding@resend.dev>',
            to: [to],
            subject: '🦫 Seu link de acesso · Capy English',
            html,
        }),
    });
    if (!sendRes.ok) {
        const errText = await sendRes.text();
        console.error('[magic-link] Resend error:', sendRes.status, errText.slice(0, 300));
        return false;
    }
    return true;
}


module.exports = async (req, res) => {
    const url = req.url.split('?')[0];

    // Light identity (signature only, no DB) — used for rate limits and logs.
    const sess    = session.readSession(req);
    const sessUid = sess ? sess.uid : null;

    // ── Logging middleware ────────────────────────────────────────────────
    const _t0 = Date.now();
    const _origStatus = res.status.bind(res);
    let _capturedStatus = 200;
    res.status = (code) => { _capturedStatus = code; return _origStatus(code); };
    const _logRequest = () => {
        if (res._capyLogged) return; res._capyLogged = true;
        const ms = Date.now() - _t0;
        const user = (sessUid || '-').slice(0, 12);
        console.log(`[${new Date().toISOString()}] ${req.method} ${url} ${_capturedStatus} ${ms}ms user=${user}`);
        if (url.startsWith('/api/')) bumpMetrics(url, _capturedStatus, ms);
    };
    res.on('finish', _logRequest);
    res.on('close',  _logRequest);

    // ── Kiwify webhook (must be handled BEFORE body parsing) ─────────────────
    // POST /api/kiwify-webhook?signature=<hmac>
    // Kiwify sends order.approved, subscription.canceled, subscription.expired,
    // subscription.renewed events. Each contains Customer.email + Product info.
    // Maps Customer.email → accounts.id → user_profiles.plan.
    if (req.method === 'POST' && url === '/api/kiwify-webhook') {
        try {
            const rawBody = await readRawBody(req, 1024 * 1024);
            if (rawBody == null) { res.status(413).end('payload too large'); return; }
            const qs = new URL(req.url, 'http://localhost').searchParams;
            const signature = String(qs.get('signature') || req.headers['x-kiwify-signature'] || '');
            const secret = process.env.KIWIFY_WEBHOOK_SECRET || '';
            // Validate signature (HMAC-SHA1 per Kiwify docs)
            if (!secret) {
                console.error('[kiwify-webhook] KIWIFY_WEBHOOK_SECRET not set');
                res.status(503).end('webhook secret not configured');
                return;
            }
            const expected = crypto.createHmac('sha1', secret).update(rawBody).digest('hex');
            if (!signature || !session.safeEqual(signature, expected)) {
                console.error('[kiwify-webhook] invalid signature');
                res.status(401).end('invalid signature');
                return;
            }
            let payload;
            try { payload = JSON.parse(rawBody); }
            catch (e) { res.status(400).end('bad json'); return; }

            const event = payload.webhook_event_type || payload.event || '';
            const email = normEmail(payload.Customer?.email || payload.customer?.email);
            const productId   = payload.Product?.product_id || payload.product_id || '';
            const productName = payload.Product?.product_name || payload.product_name || '';
            const subscriptionId = payload.Subscription?.id || payload.subscription_id
                                || payload.order_id || payload.order_ref || null;

            console.log(`[kiwify-webhook] event=${event} product=${productName} sub=${subscriptionId}`);

            if (!email) {
                res.status(400).end('missing customer email');
                return;
            }

            // Determine the new plan based on event type
            let newPlan = null;
            let expiresAt = null;
            if (event.includes('approved') || event.includes('paid') || event.includes('renewed')) {
                newPlan = planFromKiwifyProduct({ productId, productName });
                if (!newPlan) { res.status(400).end('unknown product'); return; }
                // Set expiry: +35 days monthly buffer, +400 days annual buffer (loose; refreshed on renewal)
                const isAnnual = isAnnualSubscription(payload);
                expiresAt = new Date(Date.now() + (isAnnual ? 400 : 35) * 24 * 60 * 60 * 1000).toISOString();
            } else if (event.includes('canceled') || event.includes('expired') || event.includes('refunded') || event.includes('chargeback')) {
                newPlan = 'free';
                expiresAt = null;
            } else {
                // Unhandled event type — log and 200 OK so Kiwify doesn't retry
                console.log(`[kiwify-webhook] ignoring event: ${event}`);
                res.status(200).end('ignored');
                return;
            }

            // Find user by email
            const accountRows = await sbRows(`/accounts?email=eq.${enc(email)}&select=id,name`);
            let userId = accountRows[0]?.id;
            if (!userId) {
                // Create pending account (user hasn't signed up yet — will claim it later via email magic link)
                const newAccount = {
                    id: crypto.randomUUID(),
                    name: cleanText(payload.Customer?.first_name || payload.Customer?.full_name || email.split('@')[0], 60),
                    email,
                    avatar: '🐾',
                    pending_setup: true,
                    created_at: nowIso(),
                };
                const created = await sbRequest('/accounts', {
                    method: 'POST',
                    headers: { 'Prefer': 'return=representation' },
                    body: JSON.stringify(newAccount),
                });
                userId = created.ok && Array.isArray(created.data) ? created.data[0]?.id : null;
                console.log(`[kiwify-webhook] created pending account → ${userId}`);
            }

            if (!userId) {
                console.error('[kiwify-webhook] failed to resolve userId');
                res.status(500).end('user resolution failed');
                return;
            }

            // Upsert user_profiles row with plan
            await sb('/user_profiles', {
                method: 'POST',
                headers: { 'Prefer': 'resolution=merge-duplicates,return=minimal' },
                body: JSON.stringify({
                    id: userId,
                    plan: newPlan,
                    plan_expires_at: expiresAt,
                    kiwify_subscription_id: subscriptionId,
                    updated_at: nowIso(),
                }),
            });

            console.log(`[kiwify-webhook] ✅ user=${userId} → plan=${newPlan}, expires=${expiresAt}`);
            res.status(200).end('ok');
            return;
        } catch (e) {
            console.error('[kiwify-webhook] error:', e.message);
            res.status(500).end('internal error');
            return;
        }
    }

    // The app and its API share one origin: no CORS headers are sent, so other
    // sites cannot read API responses. Cross-site POSTs are rejected outright.
    if (req.method === 'OPTIONS') { res.status(204).end(); return; }
    if (req.method === 'POST' && !isAllowedOrigin(req.headers.origin)) {
        res.status(403).json({ error: 'forbidden_origin' });
        return;
    }

    // ── Auth ─────────────────────────────────────────────────────────────────
    if (url.startsWith('/api/auth/') && !session.isConfigured()) {
        console.error('[auth] SESSION_SECRET not set (min 16 chars)');
        res.status(503).json({ error: 'session_not_configured', message: 'Login temporariamente indisponível.' });
        return;
    }

    // POST /api/auth/signup  body: { name, email, password, avatar }
    if (req.method === 'POST' && url === '/api/auth/signup') {
        const { name, email, password, avatar } = await readBody(req, 16 * 1024);
        const cleanName = cleanText(name, 60);
        const norm = normEmail(email);
        if (cleanName.length < 2) { res.status(400).json({ error: 'invalid_name', field: 'name', message: 'O nome precisa ter pelo menos 2 letras.' }); return; }
        if (!isValidEmail(norm)) { res.status(400).json({ error: 'invalid_email', field: 'email', message: 'Digite um e-mail válido.' }); return; }
        if (typeof password !== 'string' || password.length < 8 || password.length > 200) {
            res.status(400).json({ error: 'weak_password', field: 'password', message: 'A senha precisa ter pelo menos 8 caracteres.' }); return;
        }
        const _rl = await checkRateLimit(req, 'signup', null);
        if (!_rl.ok) { rateLimitedResponse(res, _rl); return; }

        const existing = await sbRows(`/accounts?email=eq.${enc(norm)}&select=id`);
        if (existing.length) {
            res.status(409).json({ error: 'email_taken', field: 'email', message: 'Já existe uma conta com esse e-mail. Entre com sua senha ou receba um link por e-mail.' });
            return;
        }
        const account = {
            id: crypto.randomUUID(),
            name: cleanName,
            email: norm,
            password_hash: await session.hashPassword(password),
            avatar: cleanText(avatar, 16) || '🐾',
            session_version: 1,
            email_verified_at: null,
            created_at: nowIso(),
        };
        const ins = await sbRequest('/accounts', {
            method: 'POST',
            headers: { 'Prefer': 'return=minimal' },
            body: JSON.stringify(account),
        });
        if (!ins.ok) {
            if (ins.status === 409) { res.status(409).json({ error: 'email_taken', field: 'email', message: 'Já existe uma conta com esse e-mail.' }); return; }
            console.error('[auth/signup] insert failed', ins.status, JSON.stringify(ins.data || '').slice(0, 200));
            res.status(500).json({ error: 'signup_failed', message: 'Não foi possível criar sua conta agora. Tente de novo.' });
            return;
        }
        session.setSessionCookie(req, res, account.id, 1, 'signup');
        res.status(200).json({ ok: true, user: publicUser(account) });
        return;
    }

    // POST /api/auth/login  body: { email, password }
    if (req.method === 'POST' && url === '/api/auth/login') {
        const { email, password } = await readBody(req, 16 * 1024);
        const norm = normEmail(email);
        const invalid = { error: 'invalid_credentials', field: 'password', message: 'E-mail ou senha incorretos.' };
        if (!isValidEmail(norm) || typeof password !== 'string' || !password || password.length > 200) {
            res.status(400).json(invalid); return;
        }
        const _rlIp = await checkRateLimit(req, 'login', null);
        if (!_rlIp.ok) { rateLimitedResponse(res, _rlIp); return; }
        const _rlEmail = await checkRateLimit(req, 'login-email', null, 'e:' + norm);
        if (!_rlEmail.ok) { rateLimitedResponse(res, _rlEmail); return; }

        const rows = await sbRows(`/accounts?email=eq.${enc(norm)}&select=id,name,email,avatar,password_hash,session_version`);
        const acc = rows[0];
        if (!acc) { res.status(401).json(invalid); return; }
        if (!acc.password_hash) {
            // Legacy account (old base64 password was exposed) or passwordless
            // account: must prove e-mail ownership via magic link first.
            res.status(403).json({
                error: 'password_reset_required', field: 'password',
                message: 'Por segurança, enviamos o acesso por e-mail: use o link e depois crie uma nova senha.',
            });
            return;
        }
        if (!(await session.verifyPassword(password, acc.password_hash))) { res.status(401).json(invalid); return; }
        session.setSessionCookie(req, res, acc.id, acc.session_version || 1, 'pw');
        res.status(200).json({ ok: true, user: publicUser(acc) });
        return;
    }

    // POST /api/auth/logout
    if (req.method === 'POST' && url === '/api/auth/logout') {
        session.clearSessionCookie(req, res);
        res.status(200).json({ ok: true });
        return;
    }

    // GET /api/auth/session → current user (or 401)
    if (req.method === 'GET' && url === '/api/auth/session') {
        const acc = await session.requireUser(req, res);
        if (!acc) { res.status(401).json({ error: 'unauthenticated' }); return; }
        const extra = await sbRows(`/accounts?id=eq.${enc(acc.id)}&select=password_hash`);
        res.setHeader('Cache-Control', 'no-store');
        res.status(200).json({ user: publicUser(acc), hasPassword: !!extra[0]?.password_hash });
        return;
    }

    // POST /api/auth/password  body: { password, currentPassword? }
    // currentPassword is required unless the session came from a magic link
    // in the last 30 minutes (that is the "forgot password" flow).
    if (req.method === 'POST' && url === '/api/auth/password') {
        const acc = await session.requireUser(req, res);
        if (!acc) { res.status(401).json({ error: 'unauthenticated' }); return; }
        const { password, currentPassword } = await readBody(req, 16 * 1024);
        if (typeof password !== 'string' || password.length < 8 || password.length > 200) {
            res.status(400).json({ error: 'weak_password', field: 'password', message: 'A senha precisa ter pelo menos 8 caracteres.' }); return;
        }
        const _rl = await checkRateLimit(req, 'password', acc.id);
        if (!_rl.ok) { rateLimitedResponse(res, _rl); return; }
        const row = (await sbRows(`/accounts?id=eq.${enc(acc.id)}&select=password_hash,session_version`))[0] || {};
        const recentLink = sess && sess.m === 'link' && (Date.now() / 1000 - (sess.iat || 0)) < 30 * 60;
        if (row.password_hash && !recentLink) {
            const okCurrent = typeof currentPassword === 'string' && await session.verifyPassword(currentPassword, row.password_hash);
            if (!okCurrent) { res.status(401).json({ error: 'wrong_password', field: 'currentPassword', message: 'Senha atual incorreta.' }); return; }
        }
        const newVersion = (row.session_version || 1) + 1;   // logs out other devices
        const upd = await sbRequest(`/accounts?id=eq.${enc(acc.id)}`, {
            method: 'PATCH',
            headers: { 'Prefer': 'return=minimal' },
            body: JSON.stringify({ password_hash: await session.hashPassword(password), password: null, session_version: newVersion }),
        });
        if (!upd.ok) { res.status(500).json({ error: 'password_update_failed' }); return; }
        session.setSessionCookie(req, res, acc.id, newVersion, 'pw');
        res.status(200).json({ ok: true });
        return;
    }

    // POST /api/auth/magic-link  body: { email }
    // Creates account if needed, generates 15-min token, sends email via Resend.
    if (req.method === 'POST' && url === '/api/auth/magic-link') {
        const { email } = await readBody(req, 16 * 1024);
        const norm = normEmail(email);
        if (!isValidEmail(norm)) { res.status(400).json({ error: 'invalid_email' }); return; }
        const devMode = process.env.CAPY_DEV === '1';
        if (!process.env.RESEND_API_KEY && !devMode) {
            console.error('[magic-link] RESEND_API_KEY not set');
            res.status(503).json({ error: 'email_not_configured', message: 'Envio de e-mail indisponível no momento.' });
            return;
        }
        // Abuse limits: per IP and per destination address
        const _rl = await checkRateLimit(req, 'magic-link', null);
        if (!_rl.ok) { rateLimitedResponse(res, _rl); return; }
        const _rlEmail = await checkRateLimit(req, 'magic-link-email', null, 'e:' + norm);
        if (!_rlEmail.ok) { rateLimitedResponse(res, _rlEmail); return; }

        // Find or create account
        const found = await sbRows(`/accounts?email=eq.${enc(norm)}&select=id,name`);
        let userId   = found[0]?.id;
        let userName = found[0]?.name;
        let isNewUser = false;
        if (!userId) {
            userId   = crypto.randomUUID();
            userName = cleanText(norm.split('@')[0], 60) || 'Explorer';
            const created = await sbRequest('/accounts', {
                method: 'POST',
                headers: { 'Prefer': 'return=minimal' },
                body: JSON.stringify({
                    id: userId, name: userName, email: norm,
                    avatar: '🐾', pending_setup: false, session_version: 1,
                    created_at: nowIso(),
                }),
            });
            if (!created.ok) {
                console.error('[magic-link] account insert failed', created.status);
                res.status(500).json({ error: 'account_create_failed' }); return;
            }
            isNewUser = true;
        }

        // Generate token (15-min expiry)
        const token = crypto.randomBytes(24).toString('base64url');
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
        const saved = await sbRequest('/magic_link_tokens', {
            method: 'POST',
            headers: { 'Prefer': 'return=minimal' },
            body: JSON.stringify({ token, email: norm, user_id: userId, expires_at: expiresAt }),
        });
        if (!saved.ok) { res.status(500).json({ error: 'token_save_failed' }); return; }

        const appUrl = (process.env.APP_URL || 'https://www.capyenglish.com.br').replace(/\/+$/, '');
        const verifyUrl = `${appUrl}/verify.html?token=${token}`;

        // Local development only: return the link instead of e-mailing it.
        if (devMode && !process.env.RESEND_API_KEY) {
            res.status(200).json({ ok: true, isNewUser, devLink: verifyUrl, warning: 'DEV MODE: link returned in the response.' });
            return;
        }

        try {
            const sent = await sendMagicLinkEmail({ to: norm, userName, verifyUrl });
            if (!sent) { res.status(502).json({ error: 'email_send_failed' }); return; }
            console.log(`[magic-link] ✅ sent (new=${isNewUser})`);
            res.status(200).json({ ok: true, isNewUser });
        } catch (e) {
            console.error('[magic-link] fetch error:', e.message);
            res.status(502).json({ error: 'email_send_failed' });
        }
        return;
    }

    // POST /api/auth/verify  body: { token }
    // Validates token, marks it used (atomically), sets the session cookie.
    if (req.method === 'POST' && url === '/api/auth/verify') {
        const { token } = await readBody(req, 16 * 1024);
        if (!token || typeof token !== 'string' || token.length > 100) { res.status(400).json({ error: 'token_required' }); return; }
        const rows = await sbRows(`/magic_link_tokens?token=eq.${enc(token)}&select=email,user_id,expires_at,used_at`);
        const row = rows[0];
        if (!row) { res.status(404).json({ error: 'token_not_found' }); return; }
        if (row.used_at) { res.status(410).json({ error: 'token_used' }); return; }
        if (new Date(row.expires_at) < new Date()) { res.status(410).json({ error: 'token_expired' }); return; }
        // Mark used only if still unused → a token can never be redeemed twice.
        const marked = await sbRequest(`/magic_link_tokens?token=eq.${enc(token)}&used_at=is.null`, {
            method: 'PATCH',
            headers: { 'Prefer': 'return=representation' },
            body: JSON.stringify({ used_at: nowIso() }),
        });
        if (!marked.ok || !Array.isArray(marked.data) || marked.data.length === 0) { res.status(410).json({ error: 'token_used' }); return; }

        const acc = (await sbRows(`/accounts?id=eq.${enc(row.user_id)}&select=id,name,email,avatar,password_hash,session_version,email_verified_at`))[0];
        if (!acc) { res.status(404).json({ error: 'user_not_found' }); return; }
        if (!acc.email_verified_at) {
            await sb(`/accounts?id=eq.${enc(acc.id)}`, {
                method: 'PATCH',
                headers: { 'Prefer': 'return=minimal' },
                body: JSON.stringify({ email_verified_at: nowIso(), pending_setup: false }),
            });
        }
        session.setSessionCookie(req, res, acc.id, acc.session_version || 1, 'link');
        res.status(200).json({ ok: true, user: publicUser(acc), needsPassword: !acc.password_hash });
        return;
    }

    // ── AI endpoints (all rate limited; identity = session user or IP) ──────

    // POST /api/chat  body: { mode, message, history, context }
    // Modes and their system prompts are defined server-side (api/_lib/prompts.js).
    if (req.method === 'POST' && url === '/api/chat') {
        const body = await readBody(req, 64 * 1024);
        const mode = typeof body.mode === 'string' ? body.mode : 'tutor';
        if (mode !== 'reading-story' && !String(body.message || '').trim()) {
            res.status(400).json({ error: { code: 400, message: 'message required' } }); return;
        }
        const _rl = await checkRateLimit(req, mode === 'reading-story' ? 'ai-gen' : 'chat', sessUid);
        if (!_rl.ok) { rateLimitedResponse(res, _rl); return; }

        // Personalize Yara's free chat with the student's profile
        let profileContext = '';
        if (mode === 'tutor' && sessUid) {
            const p = (await sbRows(`/user_profiles?id=eq.${enc(sessUid)}&select=english_level,goals,interests,interests_detail,daily_goal_minutes`))[0];
            if (p) {
                const detail = p.interests_detail ? `\n- Favorite specifics: ${clip(p.interests_detail, 300)}` : '';
                profileContext = `\n\nStudent profile:\n- English level: ${p.english_level || 'beginner'}\n- Learning goals: ${(p.goals || []).join(', ') || 'general'}\n- Interests: ${(p.interests || []).join(', ') || 'various'}${detail}\n- Daily study goal: ${p.daily_goal_minutes || 10} minutes\nTailor your language complexity and vocabulary to their level. When relevant, reference their specific favorites naturally in examples or conversation.`;
            }
        }
        const chat = buildChat({ mode, message: body.message, history: body.history, context: body.context, profileContext });
        await callOpenAI(chat.messages, chat.maxTokens, chat.temperature, res, { json: chat.json });
        return;
    }

    if (req.method === 'POST' && url === '/api/quiz') {
        const { words, deckLabel } = await readBody(req, 16 * 1024);
        const _rl = await checkRateLimit(req, 'ai-gen', sessUid);
        if (!_rl.ok) { rateLimitedResponse(res, _rl); return; }
        const prompt = `You are creating a fun English quiz for children aged 5-8.\nThe child just studied these words from the "${clip(deckLabel, 60)}" deck: ${clipList(words, 20, 40).join(', ')}.\nGenerate exactly 4 multiple-choice questions. Each has 4 options, one correct answer.\nRespond ONLY with a valid JSON array:\n[{"question":"What is this? 🍎","image_hint":"Apple","options":["Apple","River","Bird","Tree"],"correct":"Apple"}]`;
        await callOpenAI([{ role: 'user', content: prompt }], 600, 0.7, res); return;
    }

    if (req.method === 'POST' && url === '/api/translate') {
        const { word, targetLang } = await readBody(req, 16 * 1024);
        const _rl = await checkRateLimit(req, 'ai-gen', sessUid);
        if (!_rl.ok) { rateLimitedResponse(res, _rl); return; }
        const lang = clip(targetLang, 30) || 'Portuguese';
        const prompt = `Translate the English word "${clip(word, 60)}" into ${lang}.\nRespond ONLY with valid JSON:\n{"translation": "...", "example": "A simple sentence using the translation (in ${lang})."}`;
        await callOpenAI([{ role: 'user', content: prompt }], 80, 0.3, res); return;
    }

    if (req.method === 'POST' && url === '/api/story') {
        const { words, name } = await readBody(req, 16 * 1024);
        const _rl = await checkRateLimit(req, 'ai-gen', sessUid);
        if (!_rl.ok) { rateLimitedResponse(res, _rl); return; }
        const childName = cleanText(name, 40) || 'Explorer';
        const list = clipList(words, 12, 30);
        const wordList  = (list.length ? list : ['apple', 'tree', 'bird']).join(', ');
        const prompt = `Write a short fun English story for a child named ${childName} aged 5-8.\nMUST use these words: ${wordList}.\nMax 5 sentences. Simple English. Feature capybara Yara. Happy ending. 1-2 emojis per sentence.\nRespond ONLY with valid JSON:\n{"title":"...","sentences":["..."],"moral":"..."}`;
        await callOpenAI([{ role: 'user', content: prompt }], 400, 0.85, res); return;
    }

    if (req.method === 'GET' && url === '/api/word-of-day') {
        await sendDailyContent(req, res, 'word-of-day',
            day => `Today is ${day}. Pick ONE interesting English word for a child aged 5-8.\nRespond ONLY with valid JSON:\n{"word":"Butterfly","emoji":"🦋","pronunciation":"/ˈbʌt.ə.flaɪ/","partOfSpeech":"noun","simpleMeaning":"A beautiful insect with big colourful wings.","exampleSentence":"I saw a butterfly in the garden today.","funFact":"Butterflies taste with their feet!"}`,
            200, 0.9, sessUid);
        return;
    }

    if (req.method === 'GET' && url === '/api/daily-challenge') {
        await sendDailyContent(req, res, 'daily-challenge',
            day => `Today is ${day}. Create ONE fun English challenge for a child aged 5-8.\nRespond ONLY with valid JSON:\n{"type":"sentence","emoji":"🦁","title":"Use a Brave Word!","instruction":"Use the word 'brave' in a sentence about an animal.","hint":"Think about what a brave animal might do.","example":"The brave lion protected its cubs.","xp":20}`,
            150, 1.0, sessUid);
        return;
    }

    if (req.method === 'POST' && url === '/api/flashcard-deck') {
        const { topic } = await readBody(req, 16 * 1024);
        const _rl = await checkRateLimit(req, 'ai-gen', sessUid);
        if (!_rl.ok) { rateLimitedResponse(res, _rl); return; }
        const t = clip(topic, 60) || 'animals';
        const prompt = `Create 10 English vocabulary flashcards for "${t}" for children aged 5-8.\nRespond ONLY with a valid JSON array:\n[{"word":"Sun","emoji":"☀️","pronunciation":"/sʌn/","hint":"It shines in the sky","example":"The sun is bright today."}]`;
        await callOpenAI([{ role: 'user', content: prompt }], 600, 0.8, res); return;
    }

    if (req.method === 'POST' && url === '/api/dialogue-scene') {
        const { topic } = await readBody(req, 16 * 1024);
        const _rl = await checkRateLimit(req, 'ai-gen', sessUid);
        if (!_rl.ok) { rateLimitedResponse(res, _rl); return; }
        const t = clip(topic, 60) || 'pets';
        const prompt = `Create a short English grammar dialogue for children aged 5-8 about "${t}".\nRespond ONLY with valid JSON:\n{"emoji":"🐶","scene":"...","intro":"...","grammarFocus":"...","questions":[{"prompt":"___ dog is fluffy.","choices":["My","Me","I"],"answer":"My","explanation":"We use My to show the dog belongs to me."}]}\nProvide exactly 6 questions, each with 3 choices.`;
        await callOpenAI([{ role: 'user', content: prompt }], 700, 0.8, res); return;
    }

    if (req.method === 'POST' && url === '/api/parent-report') {
        const { name, xp, badges, lessons, recentDate } = await readBody(req, 64 * 1024);
        const _rl = await checkRateLimit(req, 'ai-gen', sessUid);
        if (!_rl.ok) { rateLimitedResponse(res, _rl); return; }
        const n = cleanText(name, 40) || 'Student';
        const prompt = `Act as an educational analyst for a children's language app.\nChild: ${n}, XP: ${Number(xp) || 0}, Badges: ${Array.isArray(badges) ? badges.length : 0}, Lessons: ${Array.isArray(lessons) ? lessons.length : 0}, Last active: ${clip(recentDate, 20) || 'Recently'}.\nWrite a warm 2-3 paragraph summary for parents celebrating effort and giving one practical offline tip.\nRespond ONLY with valid JSON:\n{"title":"Weekly Progress Report for ${n}","summary":"[Paragraph 1]\\n\\n[Paragraph 2]","parentTip":"[The tip]"}`;
        await callOpenAI([{ role: 'user', content: prompt }], 500, 0.7, res); return;
    }

    if (req.method === 'POST' && url === '/api/lesson-quiz') {
        const { topic, vocab, level } = await readBody(req, 16 * 1024);
        const _rl = await checkRateLimit(req, 'ai-gen', sessUid);
        if (!_rl.ok) { rateLimitedResponse(res, _rl); return; }
        const prompt = `Create 5 multiple-choice English quiz questions about "${clip(topic, 80)}" at ${clip(level, 20) || 'beginner'} level for children.\nVocabulary: ${clipList(vocab, 20, 40).join(', ')}.\nReturn ONLY valid JSON array:\n[{"q":"...","opts":["A","B","C","D"],"a":"correct option","explain":"why"}]`;
        await callOpenAI([{ role: 'user', content: prompt }], 700, 0.7, res); return;
    }

    if (req.method === 'POST' && url === '/api/lesson-chat') {
        const { history, message, lessonTopic, vocab } = await readBody(req, 64 * 1024);
        if (!String(message || '').trim()) { res.status(400).json({ error: { code: 400, message: 'message required' } }); return; }
        const _rl = await checkRateLimit(req, 'chat', sessUid);
        if (!_rl.ok) { rateLimitedResponse(res, _rl); return; }
        const system = `You are Yara, a friendly capybara teaching English to children aged 8-12.\nLesson: "${clip(lessonTopic, 80)}". Vocabulary: ${clipList(vocab, 20, 40).join(', ')}.\nRules: under 2 sentences per reply; simple English; end with a question; warm and encouraging.`;
        const messages = [{ role: 'system', content: system }, ...cleanHistory(history), { role: 'user', content: clip(message, 600) }];
        await callOpenAI(messages, 120, 0.85, res); return;
    }

    // ── DB endpoints (Supabase) ───────────────────────────────────────────────

    // Leaderboard: top 20 by XP (public; names are HTML-escaped for safe rendering)
    if (req.method === 'GET' && url.startsWith('/api/db/leaderboard')) {
        const [accounts, states] = await Promise.all([
            sbRows('/accounts?select=id,name,avatar'),
            sbRows('/user_state?select=user_id,data'),
        ]);
        const stateMap = {};
        states.forEach(s => { stateMap[s.user_id] = s.data || {}; });
        const board = accounts.map(a => ({
            id: a.id, name: escapeHtml(a.name), avatar: escapeHtml(a.avatar || '🐾'),
            xp: Number(stateMap[a.id]?.xp) || 0,
            badgesCount: (stateMap[a.id]?.badges || []).length,
        })).sort((a, b) => b.xp - a.xp).slice(0, 20);
        res.status(200).json(board); return;
    }

    // The old account-list endpoints leaked every user's e-mail and password.
    if (url.startsWith('/api/db/accounts')) {
        res.status(410).json({ error: 'gone', message: 'Use /api/auth/*' });
        return;
    }

    // GET /api/db?type=state → the logged-in user's saved progress
    if (req.method === 'GET' && (url === '/api/db' || url === '/api/db/')) {
        const acc = await session.requireUser(req, res);
        if (!acc) { res.status(401).json({ error: 'unauthenticated' }); return; }
        const type = new URL(req.url, 'http://localhost').searchParams.get('type');
        res.setHeader('Cache-Control', 'no-store');
        if (type === 'state') {
            const rows = await sbRows(`/user_state?user_id=eq.${enc(acc.id)}&select=data`);
            res.status(200).json(rows[0]?.data || null);
        } else {
            res.status(200).json(null);
        }
        return;
    }

    // POST /api/db  body: { type:'state', payload } → saves the logged-in user's progress
    if (req.method === 'POST' && url === '/api/db') {
        const acc = await session.requireUser(req, res);
        if (!acc) { res.status(401).json({ error: 'unauthenticated' }); return; }
        const { type, payload } = await readBody(req, 256 * 1024);
        if (type === 'state' && payload && typeof payload === 'object' && !Array.isArray(payload)) {
            const saved = await sbRequest('/user_state', {
                method: 'POST',
                headers: { 'Prefer': 'resolution=merge-duplicates,return=minimal' },
                body: JSON.stringify({ user_id: acc.id, data: payload, updated_at: nowIso() }),
            });
            if (!saved.ok) { res.status(502).json({ error: 'save_failed' }); return; }
        }
        res.status(200).json({ success: true }); return;
    }

    // ── User Profile ──────────────────────────────────────────────────────────

    // GET /api/profile → the logged-in user's user_profiles row
    if (req.method === 'GET' && url === '/api/profile') {
        const acc = await session.requireUser(req, res);
        if (!acc) { res.status(401).json({ error: 'unauthenticated' }); return; }
        const rows = await sbRows(`/user_profiles?id=eq.${enc(acc.id)}&select=*`);
        res.setHeader('Cache-Control', 'no-store');
        res.status(200).json(rows[0] || null); return;
    }

    // POST /api/profile → upserts editable profile fields only (never plan/billing)
    if (req.method === 'POST' && url === '/api/profile') {
        const acc = await session.requireUser(req, res);
        if (!acc) { res.status(401).json({ error: 'unauthenticated' }); return; }
        const fields = pickProfile(await readBody(req, 16 * 1024));
        const saved = await sbRequest('/user_profiles', {
            method: 'POST',
            headers: { 'Prefer': 'resolution=merge-duplicates,return=minimal' },
            body: JSON.stringify({ id: acc.id, ...fields, updated_at: nowIso() }),
        });
        if (!saved.ok) { res.status(502).json({ error: 'save_failed' }); return; }
        res.status(200).json({ success: true }); return;
    }

    // GET /api/me → plan info for the logged-in user (used to gate Pro/Super UI)
    if (req.method === 'GET' && url === '/api/me') {
        const acc = await session.requireUser(req, res);
        if (!acc) { res.status(401).json({ error: 'unauthenticated' }); return; }
        const row = (await sbRows(`/user_profiles?id=eq.${enc(acc.id)}&select=plan,plan_expires_at,kiwify_subscription_id`))[0] || {};
        const plan = (row.plan === 'pro' || row.plan === 'super') ? row.plan : 'free';
        let effectivePlan = plan;
        if (plan !== 'free' && row.plan_expires_at && new Date(row.plan_expires_at) < new Date()) effectivePlan = 'free';
        res.setHeader('Cache-Control', 'private, no-store');
        res.status(200).json({
            plan: effectivePlan,
            planExpiresAt: row.plan_expires_at || null,
            kiwifySubscriptionId: row.kiwify_subscription_id || null,
        });
        return;
    }

    // ── Lesson progress & streaks (api/_lib/progress.js) ─────────────────────

    // GET /api/progress?lessonId=aula_12 → items saved for that lesson
    if (req.method === 'GET' && url === '/api/progress') {
        const acc = await session.requireUser(req, res);
        if (!acc) { res.status(401).json({ error: 'unauthenticated' }); return; }
        const lessonId = new URL(req.url, 'http://localhost').searchParams.get('lessonId') || '';
        if (!progress.LESSON_ID_RE.test(lessonId)) { res.status(400).json({ error: 'invalid_lesson' }); return; }
        res.setHeader('Cache-Control', 'no-store');
        res.status(200).json({ lessonId, items: await progress.getLessonItems(acc.id, lessonId) });
        return;
    }

    // POST /api/progress  body: { lessonId, items: ['section:vocab', 'xp:vocab:20#1'] }
    // New sections count as a study activity (streak + daily goal).
    if (req.method === 'POST' && url === '/api/progress') {
        const acc = await session.requireUser(req, res);
        if (!acc) { res.status(401).json({ error: 'unauthenticated' }); return; }
        const { lessonId, items } = await readBody(req, 16 * 1024);
        if (!progress.LESSON_ID_RE.test(String(lessonId || ''))) { res.status(400).json({ error: 'invalid_lesson' }); return; }
        const _rl = await checkRateLimit(req, 'progress', acc.id);
        if (!_rl.ok) { rateLimitedResponse(res, _rl); return; }
        const r = await progress.saveLessonItems(acc.id, lessonId, items);
        if (r.error) { res.status(502).json({ error: r.error }); return; }
        res.status(200).json({ ok: true, inserted: r.inserted, lessonCompleted: r.lessonCompleted,
            streak: r.study ? r.study.streak : null, today: r.study ? r.study.today : null });
        return;
    }

    // POST /api/activity  body: { kind } → counts a study activity outside lesson pages
    // (games, trail mini-lessons, daily challenge…) for the streak and daily goal.
    if (req.method === 'POST' && url === '/api/activity') {
        const acc = await session.requireUser(req, res);
        if (!acc) { res.status(401).json({ error: 'unauthenticated' }); return; }
        const _rl = await checkRateLimit(req, 'activity', acc.id);
        if (!_rl.ok) { rateLimitedResponse(res, _rl); return; }
        const r = await progress.recordStudyDay(acc.id);
        res.status(200).json({ ok: true, streak: r.streak, today: r.today });
        return;
    }

    // GET /api/me/summary → streak, today's goal and "continue where you left off"
    if (req.method === 'GET' && url === '/api/me/summary') {
        const acc = await session.requireUser(req, res);
        if (!acc) { res.status(401).json({ error: 'unauthenticated' }); return; }
        res.setHeader('Cache-Control', 'private, no-store');
        res.status(200).json(await progress.getSummary(acc.id));
        return;
    }

    // ── YouTube Learning Lab ───────────────────────────────────────────────────

    // POST /api/youtube → fetch transcript + generate learning content
    if (req.method === 'POST' && url === '/api/youtube') {
        const { videoUrl } = await readBody(req, 16 * 1024);

        // Extract video ID
        const videoIdMatch = String(videoUrl || '').match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
        if (!videoIdMatch) {
            res.status(400).json({ error: 'URL do YouTube inválida. Verifique o link e tente novamente.' }); return;
        }
        const videoId = videoIdMatch[1];

        const _rl = await checkRateLimit(req, 'youtube', sessUid);
        if (!_rl.ok) { rateLimitedResponse(res, _rl); return; }

        // ── httpsFetch: uses native https module (avoids fetch availability issues) ──
        function httpsFetch(urlStr, opts = {}) {
            return new Promise((resolve, reject) => {
                try {
                    const u = new URL(urlStr);
                    const reqOpts = {
                        hostname: u.hostname,
                        path: u.pathname + u.search,
                        method: opts.method || 'GET',
                        headers: { 'Accept-Encoding': 'identity', ...(opts.headers || {}) },
                        timeout: 8000,
                    };
                    const r0 = https.request(reqOpts, r => {
                        const chunks = [];
                        r.on('data', c => chunks.push(c));
                        r.on('end', () => {
                            const body = Buffer.concat(chunks).toString('utf8');
                            resolve({ ok: r.statusCode >= 200 && r.statusCode < 300, status: r.statusCode,
                                text: () => body, json: () => JSON.parse(body) });
                        });
                    });
                    r0.on('error', reject);
                    r0.on('timeout', () => { r0.destroy(); reject(new Error('timeout')); });
                    if (opts.body) r0.write(opts.body);
                    r0.end();
                } catch(e) { reject(e); }
            });
        }

        function parseCaptionEvents(data) {
            try {
                const obj = typeof data === 'string' ? JSON.parse(data) : data;
                return (obj.events || [])
                    .filter(e => e.segs?.length)
                    .map(e => e.segs.map(s => s.utf8 || '').join(''))
                    .join(' ').replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
            } catch(e) { return null; }
        }

        async function fetchCaptionUrl(baseUrl) {
            try {
                const capUrl = baseUrl.replace(/\\u0026/g, '&') + '&fmt=json3';
                const r = await httpsFetch(capUrl);
                if (r.ok) return parseCaptionEvents(r.json());
            } catch(e) {}
            return null;
        }

        async function tryInnerTube(clientName, clientVersion, extraCtx = {}) {
            try {
                const body = JSON.stringify({
                    context: { client: { clientName, clientVersion, hl: 'en', gl: 'US', ...extraCtx } },
                    videoId
                });
                const r = await httpsFetch('https://www.youtube.com/youtubei/v1/player', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-Youtube-Client-Name': clientName === 'ANDROID' ? '3' : clientName === 'IOS' ? '5' : '1', 'X-Youtube-Client-Version': clientVersion },
                    body
                });
                if (!r.ok) return null;
                const data = r.json();
                const tracks = data?.captions?.playerCaptionsTracklistRenderer?.captionTracks || [];
                const track = tracks.find(t => t.languageCode === 'en' && !t.kind)
                           || tracks.find(t => t.languageCode === 'en')
                           || tracks.find(t => t.languageCode?.startsWith('en'))
                           || tracks[0];
                if (track?.baseUrl) return fetchCaptionUrl(track.baseUrl);
            } catch(e) { console.error('[YT InnerTube]', clientName, e.message); }
            return null;
        }

        // Fetch transcript — try 4 strategies in order
        let transcript = null;

        // Strategy 1: ANDROID client (least restricted by YouTube)
        if (!transcript) transcript = await tryInnerTube('ANDROID', '19.09.37', {
            androidSdkVersion: 30,
            userAgent: 'com.google.android.youtube/19.09.37 (Linux; U; Android 11) gzip'
        });

        // Strategy 2: IOS client
        if (!transcript) transcript = await tryInnerTube('IOS', '19.09.3', {
            deviceModel: 'iPhone16,2',
            userAgent: 'com.google.ios.youtube/19.09.3 (iPhone16,2; U; CPU iOS 17_1_2 like Mac OS X;)'
        });

        // Strategy 3: WEB client
        if (!transcript) transcript = await tryInnerTube('WEB', '2.20240101.00.00', {
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36'
        });

        // Strategy 4: HTML scraping
        if (!transcript || transcript.length < 50) {
            try {
                const r = await httpsFetch(`https://www.youtube.com/watch?v=${videoId}&hl=en`, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
                        'Accept-Language': 'en-US,en;q=0.9',
                        'Accept': 'text/html,application/xhtml+xml',
                    }
                });
                if (r.ok) {
                    const html = r.text();
                    const match = html.match(/"captionTracks":(\[[\s\S]+?\])/);
                    if (match) {
                        const tracks = JSON.parse(match[1].replace(/\\u0026/g, '&'));
                        const track = tracks.find(t => t.languageCode === 'en' || t.languageCode?.startsWith('en')) || tracks[0];
                        if (track?.baseUrl) transcript = await fetchCaptionUrl(track.baseUrl);
                    }
                }
            } catch(e) { console.error('[YT scrape]', e.message); }
        }

        if (!transcript || transcript.length < 50) {
            res.status(422).json({ error: 'Não consegui encontrar legendas para este vídeo. Tente um vídeo em inglês com legendas automáticas ativadas.' }); return;
        }

        // Limit transcript to ~3000 chars for the AI call
        const transcriptSnippet = transcript.length > 3000 ? transcript.slice(0, 3000) + '...' : transcript;

        // Call OpenAI to generate learning content
        const prompt = `You are an English teacher. Analyze this YouTube video transcript and create learning material for a Brazilian student.

Transcript: "${transcriptSnippet}"

Respond ONLY with valid JSON in this exact format:
{
  "vocabulary": [
    {"word": "example", "phonetic": "/ɪɡˈzæmpəl/", "definition": "Simple definition in English", "ptTranslation": "Tradução em português", "example": "A short example sentence."}
  ],
  "questions": [
    {"question": "Comprehension question?", "options": ["A", "B", "C", "D"], "correct": "A", "explanation": "Why A is correct."}
  ],
  "summary": "A 2-3 sentence summary of the video in English.",
  "summaryPt": "Resumo em 2-3 frases em português.",
  "conversationStarter": "An engaging question Yara would ask the student about this video."
}

Rules:
- vocabulary: exactly 8 useful words/phrases from the transcript, sorted easiest to hardest
- questions: exactly 5 multiple choice questions with 4 options each
- Keep everything appropriate for language learning`;

        await sendOpenAIJson(res, prompt, {
            maxTokens: 1800, temperature: 0.3,
            errorMessage: 'Erro ao processar o conteúdo do vídeo.',
            extra: { videoId, transcript: transcriptSnippet },
        });
        return;
    }

    // ── Personalized Lesson Tab ───────────────────────────────────────────────

    // POST /api/personalize → AI mini-lesson themed around user interests
    if (req.method === 'POST' && url === '/api/personalize') {
        const body = await readBody(req, 16 * 1024);
        const topic = clip(body.topic, 100);
        const vocab = clipList(body.vocab, 12, 40);
        const _rl = await checkRateLimit(req, 'personalize', sessUid);
        if (!_rl.ok) { rateLimitedResponse(res, _rl); return; }

        let interests = 'various topics', detail = '', level = 'beginner';
        if (sessUid) {
            const p = (await sbRows(`/user_profiles?id=eq.${enc(sessUid)}&select=interests,interests_detail,english_level`))[0];
            if (p) {
                interests = (p.interests || []).join(', ') || interests;
                detail    = clip(p.interests_detail || '', 300);
                level     = p.english_level    || level;
            }
        }

        const favorites = detail ? `Their specific favorites: ${detail}.` : '';
        const prompt = `You are Yara, a friendly capybara English teacher for Brazilian students. Create a short personalized bonus lesson.

Lesson topic: "${topic}"
Key vocabulary from today's lesson: ${vocab.join(', ')}
Student interests: ${interests}
${favorites}
Student English level: ${level}

Create 4-6 example sentences that use TODAY'S vocabulary BUT are themed around the student's actual interests.
Example: if they like BTS and the lesson teaches HAVE/WANT/NEED/LIKE → "BTS have millions of fans worldwide. I want to go to their concert someday!"

Rules:
- Use the lesson vocabulary naturally in the examples (bold the key word concept in your mind)
- Theme the examples around the student's specific interests (music artists, teams, shows, etc.)
- Keep sentences appropriate for the student's level (${level})
- The mini_quiz must use the lesson's vocabulary in interest-themed sentences
- Respond ONLY with valid JSON (no markdown, no code blocks):

{
  "intro": "Uma frase curta e animada sobre o que você vai personalizar, ex: 'Já que você ama [interesse], aqui vão seus exemplos especiais!'",
  "examples": [
    {"en": "sentence in English", "pt": "tradução em português", "highlight": "key_vocab_word_used"}
  ],
  "mini_quiz": [
    {"q": "Fill-in sentence with ___ blank", "opts": ["option1", "option2", "option3"], "ans": 0}
  ],
  "tip": "One short practical grammar tip based on these examples, in Portuguese."
}`;

        await sendOpenAIJson(res, prompt, { maxTokens: 700, temperature: 0.85, errorMessage: 'Erro ao gerar aula personalizada.' });
        return;
    }

    // ── Study Plan ────────────────────────────────────────────────────────────

    // POST /api/study-plan → AI-generated weekly study schedule
    if (req.method === 'POST' && url === '/api/study-plan') {
        const { currentLesson, dailyGoalMinutes, interests, level } = await readBody(req, 16 * 1024);
        const _rl = await checkRateLimit(req, 'study-plan', sessUid);
        if (!_rl.ok) { rateLimitedResponse(res, _rl); return; }

        const minsNum = Number(dailyGoalMinutes);
        const mins    = Number.isFinite(minsNum) && minsNum > 0 && minsNum <= 120 ? Math.round(minsNum) : 10;
        const intList = clipList(interests, 12, 40).join(', ') || 'various';
        const lvl     = clip(level, 20) || 'beginner';
        const lessonNum = Number(currentLesson);
        const lesson  = Number.isInteger(lessonNum) && lessonNum >= 1 && lessonNum <= 44 ? lessonNum : 1;

        const prompt = `You are an expert English study planner for Brazilian learners. Create a 7-day personalized weekly study schedule.

Student profile:
- Level: ${lvl}
- Daily goal: ${mins} minutes
- Interests: ${intList}
- Next lesson in sequence: aula_${String(lesson).padStart(2,'0')}.html

Activity types to mix:
- "aula": structured lessons from the course (aula_01.html through aula_44.html in order)
- "youtube": YouTube Lab sessions (youtube_lab.html) — suggest a YouTube search topic related to their interests
- "music": Music Lab sessions (music_lab.html) — suggest a specific artist/song related to their interests
- "review": Review of previous lesson concepts (link to the previous aula)

Rules:
- Each day's total activity duration must NOT exceed ${mins} minutes
- On rest days (suggest 1-2 per week), use light activities only (music or review, max 5 min)
- Vary the activity types across the week
- Include specific YouTube topic suggestions and music artist suggestions based on their interests
- Lesson days: use sequential aula files starting from aula_${String(lesson).padStart(2,'0')}.html
- Respond ONLY with valid JSON (no markdown, no code blocks):

{
  "weeklyGoal": "Short motivational message about the week's goal in Portuguese",
  "weeklyPlan": [
    {
      "day": "Segunda",
      "dayEn": "Monday",
      "isRestDay": false,
      "activities": [
        {"type": "aula", "title": "Aula XX — Topic Name", "duration": 15, "link": "aula_XX.html", "icon": "📖", "description": "Short description in Portuguese"},
        {"type": "music", "title": "Música: Artist Name — Song", "duration": 5, "link": "music_lab.html", "icon": "🎵", "description": "Cole a letra desta música no Music Lab"}
      ]
    }
  ]
}`;

        await sendOpenAIJson(res, prompt, { maxTokens: 1200, temperature: 0.75, errorMessage: 'Erro ao gerar cronograma.' });
        return;
    }

    // ── Music Lab ─────────────────────────────────────────────────────────────

    // POST /api/music → analyze song lyrics, generate vocab/chunks/quiz
    if (req.method === 'POST' && url === '/api/music') {
        const { lyrics, artist } = await readBody(req, 64 * 1024);
        const snippet = String(lyrics || '').slice(0, 1000);
        if (snippet.length < 20) { res.status(400).json({ error: 'Cole a letra da música antes de analisar!' }); return; }

        const _rl = await checkRateLimit(req, 'music', sessUid);
        if (!_rl.ok) { rateLimitedResponse(res, _rl); return; }

        let level = 'beginner';
        if (sessUid) {
            level = (await sbRows(`/user_profiles?id=eq.${enc(sessUid)}&select=english_level`))[0]?.english_level || level;
        }

        const prompt = `You are Yara, a friendly capybara English teacher. Analyze these song lyrics and create a music-based English lesson for a Brazilian ${level}-level student.

Artist: ${clip(artist, 80) || 'Unknown Artist'}
Lyrics:
"""
${snippet}
"""

Rules:
- Find 5-7 useful vocabulary words OR natural expressions from the lyrics
- For each vocab item, explain simply in Portuguese and give the lyric line as example
- Find 2-3 interesting "chunks" (natural phrases, idioms, or expressions worth learning)
- Create 3 quiz questions about the lyrics (comprehension or vocabulary)
- Keep everything positive and encouraging
- Respond ONLY with valid JSON (no markdown, no code blocks):

{
  "artistNote": "One fun fact or context about this artist/song in Portuguese (1 sentence)",
  "vocab": [
    {"word": "dream", "phonetic": "/driːm/", "pt": "sonho", "example": "The exact lyric line using this word", "tip": "Dica rápida em português sobre como usar esta palavra"}
  ],
  "chunks": [
    {"phrase": "I can't stop the feeling", "meaning": "Explicação em português do que significa e como usar", "type": "expressão", "example": "How to use it in a new sentence"}
  ],
  "quiz": [
    {"q": "Question about the lyrics?", "opts": ["option A", "option B", "option C"], "ans": 0, "explain": "Explicação em português da resposta"}
  ]
}`;

        await sendOpenAIJson(res, prompt, { maxTokens: 1400, temperature: 0.75, errorMessage: 'Erro ao analisar a letra.' });
        return;
    }

    // ── Lyrics Proxy ──────────────────────────────────────────────────────────
    // GET /api/lyrics-search?q=query  → suggest songs via lyrics.ovh
    if (req.method === 'GET' && url === '/api/lyrics-search') {
        const q = clip(new URL(req.url, 'http://localhost').searchParams.get('q') || '', 100);
        if (!q) { res.status(400).json({ error: 'q required' }); return; }
        const _rl = await checkRateLimit(req, 'lyrics', sessUid);
        if (!_rl.ok) { rateLimitedResponse(res, _rl); return; }
        const target = `https://api.lyrics.ovh/suggest/${enc(q)}`;
        https.get(target, { headers: { 'User-Agent': 'CapyEnglish/1.0' }, timeout: 8000 }, (r) => {
            let d = '';
            r.on('data', c => d += c);
            r.on('end', () => {
                res.setHeader('Content-Type', 'application/json');
                res.status(r.statusCode).end(d);
            });
        }).on('error', () => res.status(502).json({ error: 'lyrics search failed' }));
        return;
    }

    // GET /api/lyrics?artist=...&title=...  → fetch full lyrics via lyrics.ovh
    if (req.method === 'GET' && url === '/api/lyrics') {
        const p = new URL(req.url, 'http://localhost').searchParams;
        const artist = clip(p.get('artist') || '', 100);
        const title  = clip(p.get('title')  || '', 100);
        if (!artist || !title) { res.status(400).json({ error: 'artist and title required' }); return; }
        const _rl = await checkRateLimit(req, 'lyrics', sessUid);
        if (!_rl.ok) { rateLimitedResponse(res, _rl); return; }
        const target = `https://api.lyrics.ovh/v1/${enc(artist)}/${enc(title)}`;
        https.get(target, { headers: { 'User-Agent': 'CapyEnglish/1.0' }, timeout: 8000 }, (r) => {
            let d = '';
            r.on('data', c => d += c);
            r.on('end', () => {
                res.setHeader('Content-Type', 'application/json');
                res.status(r.statusCode).end(d);
            });
        }).on('error', () => res.status(502).json({ error: 'lyrics fetch failed' }));
        return;
    }

    // ── OpenAI TTS ───────────────────────────────────────────────────────────
    // GET /api/tts?text=hello&voice=nova&lang=en  → streams MP3 from OpenAI TTS
    // lang=fr uses gpt-4o-mini-tts with native French accent instructions
    if (req.method === 'GET' && url === '/api/tts') {
        if (!API_KEY) { res.status(503).json({ error: 'OPENAI_API_KEY not set' }); return; }
        const qs2 = new URL(req.url, 'http://localhost').searchParams;
        const text = (qs2.get('text') || '').slice(0, 500);
        if (!text.trim()) { res.status(400).json({ error: 'text required' }); return; }
        const VOICES = ['nova', 'alloy', 'echo', 'fable', 'onyx', 'shimmer'];
        const voice = VOICES.includes(qs2.get('voice')) ? qs2.get('voice') : 'nova';
        const lang  = qs2.get('lang') === 'fr' ? 'fr' : 'en';
        const _rl = await checkRateLimit(req, 'tts', sessUid);
        if (!_rl.ok) { rateLimitedResponse(res, _rl); return; }

        // French: use gpt-4o-mini-tts with native accent instructions
        const isFr = lang === 'fr';
        const ttsModel = isFr ? 'gpt-4o-mini-tts' : 'tts-1';
        const bodyObj = { model: ttsModel, input: text, voice, response_format: 'mp3' };
        if (isFr) {
            bodyObj.instructions = 'You are a native French speaker. Pronounce every word with a perfect, authentic French accent — no English influence. Speak clearly and naturally like a French teacher.';
        }
        const body = JSON.stringify(bodyObj);

        const ttsReq = https.request({
            hostname: 'api.openai.com',
            path: '/v1/audio/speech',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body),
            },
        }, ttsRes => {
            if (ttsRes.statusCode !== 200) {
                let d = '';
                ttsRes.on('data', c => d += c);
                ttsRes.on('end', () => {
                    console.error('[tts]', ttsRes.statusCode, d.slice(0, 200));
                    res.status(502).json({ error: 'tts_failed' });
                });
                return;
            }
            res.setHeader('Content-Type', 'audio/mpeg');
            // Same text → same audio: let the browser and Vercel's CDN reuse it.
            res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=2592000');
            ttsRes.pipe(res);
        });
        ttsReq.setTimeout(20000, () => ttsReq.destroy(new Error('timeout')));
        ttsReq.on('error', e => { if (!res.headersSent) res.status(502).json({ error: 'tts_failed' }); });
        ttsReq.write(body);
        ttsReq.end();
        return;
    }

    // ── Homework Submissions ──────────────────────────────────────────────────

    // POST /api/homework → save the logged-in student's homework submission
    if (req.method === 'POST' && url === '/api/homework') {
        const acc = await session.requireUser(req, res);
        if (!acc) { res.status(401).json({ error: 'unauthenticated' }); return; }
        const { lessonId, lessonTitle, answers, xp } = await readBody(req, 64 * 1024);
        if (!lessonId) { res.status(400).json({ error: 'lessonId required' }); return; }
        const result = await sbRequest('/homework_submissions', {
            method: 'POST',
            headers: { 'Prefer': 'return=representation' },
            body: JSON.stringify({
                user_id:       acc.id,
                student_name:  acc.name || 'Unknown',
                lesson_id:     clip(lessonId, 20),
                lesson_title:  clip(lessonTitle, 120),
                answers:       answers && typeof answers === 'object' ? answers : {},
                xp_earned:     Math.max(0, Math.min(200, Number(xp) || 0)),
                submitted_at:  nowIso(),
            }),
        });
        const id = result.ok && Array.isArray(result.data) ? result.data[0]?.id || null : null;
        res.status(result.ok ? 200 : 502).json({ success: result.ok, id }); return;
    }

    // GET /api/homework (header X-Admin-Key) → list submissions (teacher only)
    //   ?lessonId=32 → filter by lesson · ?userId=xxx → filter by student
    if (req.method === 'GET' && url === '/api/homework') {
        const auth = adminAuth(req);
        if (auth !== 'ok') { rejectAdmin(res, auth); return; }
        const p = new URL(req.url, 'http://localhost').searchParams;
        const lessonId = p.get('lessonId');
        const userId   = p.get('userId');
        let filter = '';
        if (lessonId) filter += `&lesson_id=eq.${enc(lessonId)}`;
        if (userId)   filter += `&user_id=eq.${enc(userId)}`;
        const rows = await sbRows(`/homework_submissions?select=*&order=submitted_at.desc${filter}`);
        res.setHeader('Cache-Control', 'no-store');
        res.status(200).json(rows); return;
    }

    // ── Admin stats ───────────────────────────────────────────────────────────
    // GET /api/admin/stats (header X-Admin-Key) → metrics for /admin.html dashboard
    if (req.method === 'GET' && url === '/api/admin/stats') {
        const auth = adminAuth(req);
        if (auth !== 'ok') { rejectAdmin(res, auth); return; }
        const since = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
        const metricsRaw = await sb(`/api_metrics_daily?day=gte.${since}&order=day.desc,requests.desc&limit=200`);
        // sb() returns Supabase error object if table doesn't exist — coerce to array
        const metrics = Array.isArray(metricsRaw) ? metricsRaw : [];
        const tableMissing = metricsRaw && !Array.isArray(metricsRaw);
        res.setHeader('Cache-Control', 'no-store');
        res.status(200).json({
            metrics,
            live: Object.entries(_metrics).map(([k, v]) => {
                const [day, endpoint] = k.split('|');
                return { day, endpoint, ...v, note: 'in-memory (not yet persisted)' };
            }),
            generatedAt: nowIso(),
            warning: tableMissing
                ? 'api_metrics_daily table not found in Supabase — run the SQL migration to start persisting metrics.'
                : undefined,
        });
        return;
    }

    res.status(404).json({ error: 'Not found' });
};
