const http    = require('http');
const https   = require('https');
const fs      = require('fs');
const path    = require('path');
const crypto  = require('crypto');
// Root of the project (one level up from scripts/)
const ROOT    = path.join(__dirname, '..');

// ── Load .env (zero-dependency parser) ────────────────────────────────────────
(function loadEnv() {
    const envPath = path.join(ROOT, '.env');
    if (!fs.existsSync(envPath)) return;
    const lines = fs.readFileSync(envPath, 'utf-8').split(/\r?\n/);
    for (const raw of lines) {
        const line = raw.trim();
        if (!line || line.startsWith('#')) continue;
        const idx = line.indexOf('=');
        if (idx === -1) continue;
        const key = line.slice(0, idx).trim();
        let val = line.slice(idx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
        }
        if (!(key in process.env)) process.env[key] = val;
    }
})();

// One shared API implementation for local development and Vercel.
const apiHandler = require('../api/index.js');

const PORT    = process.env.PORT || 8765;
const API_KEY = process.env.OPENAI_API_KEY;
const MODEL   = process.env.OPENAI_MODEL || 'gpt-4o-mini';

// Provedor de chat (texto): OpenRouter quando OPENROUTER_API_KEY existe, senao
// OpenAI. Audio (TTS/Whisper) segue sempre na OpenAI. Espelha api/index.js.
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const USE_OPENROUTER = !!OPENROUTER_API_KEY;
const CHAT_KEY   = USE_OPENROUTER ? OPENROUTER_API_KEY : API_KEY;
const CHAT_HOST  = USE_OPENROUTER ? 'openrouter.ai' : 'api.openai.com';
const CHAT_PATH  = USE_OPENROUTER ? '/api/v1/chat/completions' : '/v1/chat/completions';
const CHAT_MODEL = USE_OPENROUTER ? (process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini') : MODEL;

function chatHeaders(contentLength) {
    const h = {
        'Content-Type':   'application/json',
        'Authorization':  `Bearer ${CHAT_KEY}`,
        'Content-Length': contentLength
    };
    if (USE_OPENROUTER) {
        h['HTTP-Referer'] = process.env.APP_ORIGIN || 'http://127.0.0.1:8765';
        h['X-Title']      = 'Capy Yara English (dev)';
    }
    return h;
}

if (!API_KEY) {
    console.warn('⚠️  OPENAI_API_KEY is not set — AI features will return a friendly error. Static pages will still work.');
}

// ── Supabase (mirrors api/index.js) ─────────────────────────────────────────
const SB_URL = process.env.SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_KEY;
async function sb(p, opts = {}) {
    if (!SB_URL || !SB_KEY) return null;
    try {
        const r = await fetch(`${SB_URL}/rest/v1${p}`, {
            ...opts,
            headers: {
                'apikey': SB_KEY,
                'Authorization': `Bearer ${SB_KEY}`,
                'Content-Type': 'application/json',
                ...(opts.headers || {}),
            },
        });
        if (r.status === 204) return null;
        const text = await r.text();
        return text ? JSON.parse(text) : null;
    } catch (e) { return null; }
}

// ── Admin auth (mirrors api/index.js) ───────────────────────────────────────
function isAdminReq(req) {
    const auth = req.headers['authorization'] || '';
    const key = auth.replace(/^Bearer\s+/i, '').trim();
    if (!key) return false;
    if (process.env.ADMIN_KEY && key === process.env.ADMIN_KEY) return true;
    if (process.env.CRON_SECRET && key === process.env.CRON_SECRET) return true;
    return false;
}

function readJsonBody(req) {
    return new Promise((resolve) => {
        let raw = '';
        req.on('data', c => raw += c);
        req.on('end', () => { try { resolve(JSON.parse(raw || '{}')); } catch (e) { resolve({}); } });
        req.on('error', () => resolve({}));
    });
}

// ── GET with redirect following (Google News RSS 302s on some hl/gl combos) ─
function httpsGetFollow(urlStr, maxRedirects = 3) {
    return new Promise((resolve, reject) => {
        const attempt = (u, hopsLeft) => {
            https.get(u, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; CapyEnglish/1.0)' } }, r => {
                if ([301, 302, 303, 307, 308].includes(r.statusCode) && r.headers.location && hopsLeft > 0) {
                    r.resume();
                    attempt(new URL(r.headers.location, u).toString(), hopsLeft - 1);
                    return;
                }
                let d = ''; r.on('data', c => d += c); r.on('end', () => resolve(d));
            }).on('error', reject);
        };
        attempt(urlStr, maxRedirects);
    });
}

// ── Google News RSS parser (zero-dependency, regex-based; mirrors api/index.js) ──
function parseNewsRSS(xml, limit) {
    const stripCDATA = s => { const m = (s || '').match(/^<!\[CDATA\[([\s\S]*)\]\]>$/); return m ? m[1] : (s || ''); };
    const decodeXML  = s => (s || '')
        .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'").replace(/&apos;/g, "'").replace(/&amp;/g, '&');
    const stripTags  = s => (s || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

    const items = [];
    const itemRe = /<item>([\s\S]*?)<\/item>/g;
    let m;
    while ((m = itemRe.exec(xml)) && items.length < limit) {
        const block = m[1];
        const title       = decodeXML(stripCDATA((block.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || ''));
        const link        = decodeXML((block.match(/<link>([\s\S]*?)<\/link>/) || [])[1] || '');
        const pubDate     = (block.match(/<pubDate>([\s\S]*?)<\/pubDate>/) || [])[1] || '';
        const source      = decodeXML(stripCDATA((block.match(/<source[^>]*>([\s\S]*?)<\/source>/) || [])[1] || ''));
        const description = stripTags(decodeXML(stripCDATA((block.match(/<description>([\s\S]*?)<\/description>/) || [])[1] || '')));
        if (title) items.push({ title, link, pubDate, source, description });
    }
    return items;
}

const MIME_TYPES = {
    '.html': 'text/html',
    '.css':  'text/css',
    '.js':   'text/javascript',
    '.png':  'image/png',
    '.jpg':  'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif':  'image/gif',
    '.svg':  'image/svg+xml',
    '.json': 'application/json',
    '.md':   'text/markdown',
    '.ico':  'image/x-icon'
};

// ── OpenAI API helper ─────────────────────────────────────────────────────────
// Calls OpenAI chat/completions and returns the response wrapped in the same
// Gemini-compatible envelope { candidates:[{content:{parts:[{text}]}}] }
// so all existing client-side parsers continue to work unchanged.
function callOpenAI(messages, maxTokens, temperature, res) {
    if (!CHAT_KEY) {
        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({ error: { code: 503, message: 'AI features require OPENAI_API_KEY to be configured.', status: 'UNAVAILABLE' } }));
        return;
    }
    const postData = JSON.stringify({
        model:       CHAT_MODEL,
        messages,
        max_tokens:  maxTokens,
        temperature
    });

    const options = {
        hostname: CHAT_HOST,
        path:     CHAT_PATH,
        method:   'POST',
        headers:  chatHeaders(Buffer.byteLength(postData))
    };

    const apiReq = https.request(options, apiRes => {
        let data = '';
        apiRes.on('data', chunk => data += chunk);
        apiRes.on('end', () => {
            if (apiRes.statusCode !== 200) {
                console.error('[OpenAI Error]', apiRes.statusCode, data);
                // Forward the error in a Gemini-shaped envelope so clients handle it
                let errBody;
                try { errBody = JSON.parse(data); } catch { errBody = { error: { message: data } }; }
                res.writeHead(200, {
                    'Content-Type':                'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                // Map to Gemini-style error so existing client error checks still fire
                res.end(JSON.stringify({ error: { code: apiRes.statusCode, message: errBody?.error?.message || data, status: errBody?.error?.type || 'API_ERROR' } }));
                return;
            }

            try {
                const parsed = JSON.parse(data);
                const text   = parsed?.choices?.[0]?.message?.content || '';
                // Wrap in Gemini-compatible envelope
                const envelope = {
                    candidates: [{ content: { parts: [{ text }] } }]
                };
                res.writeHead(200, {
                    'Content-Type':                'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify(envelope));
            } catch (e) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: { code: 500, message: 'Failed to parse OpenAI response' } }));
            }
        });
    });

    apiReq.on('error', err => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: { code: 500, message: err.message } }));
    });

    apiReq.write(postData);
    apiReq.end();
}

// ── Request handler (exported for Vercel, also used locally) ─────────────────
const handler = async (req, res) => {

    const requestPath = req.url.split('?')[0];
    if (requestPath.startsWith('/api/')) {
        res.status = code => { res.statusCode = code; return res; };
        res.json = payload => {
            if (!res.headersSent) res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify(payload));
            return res;
        };
        await apiHandler(req, res);
        return;
    }

    // ── CORS pre-flight ───────────────────────────────────────────────────────
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin':  '*',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end();
        return;
    }

    // ── Admin API (mirrors api/index.js) ──────────────────────────────────────
    const _adminPath = req.url.split('?')[0];
    if (_adminPath.startsWith('/api/admin/') && _adminPath !== '/api/admin/grant-plan') {
        const sendJson = (code, obj) => {
            res.writeHead(code, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            res.end(JSON.stringify(obj));
        };
        if (!isAdminReq(req)) { sendJson(401, { error: 'unauthorized' }); return; }

        (async () => {
            // GET /api/admin/overview
            if (req.method === 'GET' && _adminPath === '/api/admin/overview') {
                const now = new Date();
                const d7  = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();
                const d30 = new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString();
                const [accounts, profiles] = await Promise.all([
                    sb('/accounts?select=id,created_at'),
                    sb('/user_profiles?select=id,plan,plan_expires_at,kiwify_subscription_id'),
                ]);
                const accts = accounts || [];
                const profs = profiles || [];
                const totalStudents = accts.length;
                const new7d  = accts.filter(a => a.created_at && a.created_at >= d7).length;
                const new30d = accts.filter(a => a.created_at && a.created_at >= d30).length;
                const isActive = p => p.plan && p.plan !== 'free' && (!p.plan_expires_at || new Date(p.plan_expires_at) > now);
                const plans = { free: 0, pro: 0, super: 0 };
                let courtesies = 0;
                for (const p of profs) {
                    if (isActive(p)) {
                        plans[p.plan] = (plans[p.plan] || 0) + 1;
                        if (!p.kiwify_subscription_id) courtesies++;
                    } else {
                        plans.free++;
                    }
                }
                plans.free += Math.max(0, totalStudents - profs.length);
                let aiToday = null;
                try {
                    const today = now.toISOString().slice(0, 10);
                    const metrics = await sb(`/api_metrics_daily?day=eq.${today}&endpoint=eq.${encodeURIComponent('/api/chat')}&select=requests`);
                    if (metrics) aiToday = metrics.reduce((s, r) => s + (r.requests || 0), 0);
                } catch (e) {}
                const signupsByDay = [];
                {
                    const counts = {};
                    for (const a of accts) {
                        if (!a.created_at || a.created_at < d30) continue;
                        const day = new Date(a.created_at).toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
                        counts[day] = (counts[day] || 0) + 1;
                    }
                    for (let i = 29; i >= 0; i--) {
                        const dt = new Date(now - i * 24 * 60 * 60 * 1000);
                        const day = dt.toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
                        signupsByDay.push({ date: day, count: counts[day] || 0 });
                    }
                }
                sendJson(200, { totalStudents, new7d, new30d, plans, courtesies, aiToday, signupsByDay });
                return;
            }

            // GET /api/admin/courtesies
            if (req.method === 'GET' && _adminPath === '/api/admin/courtesies') {
                const [accounts, profiles] = await Promise.all([
                    sb('/accounts?select=id,name,email'),
                    sb('/user_profiles?select=id,plan,plan_expires_at,kiwify_subscription_id'),
                ]);
                const accById = Object.fromEntries((accounts || []).map(a => [a.id, a]));
                const now = new Date();
                const list = (profiles || [])
                    .filter(p => (p.plan === 'pro' || p.plan === 'super') && !p.kiwify_subscription_id
                        && (!p.plan_expires_at || new Date(p.plan_expires_at) > now))
                    .map(p => {
                        const acc = accById[p.id] || {};
                        return { email: acc.email || null, name: acc.name || null, plan: p.plan, expiresAt: p.plan_expires_at };
                    });
                sendJson(200, { courtesies: list });
                return;
            }

            // POST /api/admin/revoke-plan
            if (req.method === 'POST' && _adminPath === '/api/admin/revoke-plan') {
                const { email } = await readJsonBody(req);
                const norm = (email || '').toLowerCase().trim();
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(norm)) { sendJson(400, { error: 'invalid_email' }); return; }
                const found = await sb(`/accounts?email=eq.${encodeURIComponent(norm)}&select=id`);
                const userId = found?.[0]?.id;
                if (!userId) { sendJson(404, { error: 'not_found' }); return; }
                await sb('/user_profiles?on_conflict=id', {
                    method: 'POST',
                    headers: { 'Prefer': 'resolution=merge-duplicates,return=minimal' },
                    body: JSON.stringify({ id: userId, plan: 'free', plan_expires_at: null }),
                });
                sendJson(200, { ok: true });
                return;
            }

            // GET/POST /api/admin/goals
            if ((req.method === 'GET' || req.method === 'POST') && _adminPath === '/api/admin/goals') {
                const ADMIN_GOALS_ID = '__admin_goals';
                if (req.method === 'GET') {
                    const rows = await sb(`/user_state?user_id=eq.${ADMIN_GOALS_ID}&select=data`);
                    sendJson(200, rows?.[0]?.data || { monthlyRevenueTarget: 0, studentsTarget: 0, manualRevenue: [], updatedAt: null });
                    return;
                }
                const body = await readJsonBody(req);
                const data = { monthlyRevenueTarget: 0, studentsTarget: 0, manualRevenue: [], ...body, updatedAt: new Date().toISOString() };
                await sb('/user_state', {
                    method: 'POST',
                    headers: { 'Prefer': 'resolution=merge-duplicates,return=minimal' },
                    body: JSON.stringify({ user_id: ADMIN_GOALS_ID, data, updated_at: new Date().toISOString() }),
                });
                sendJson(200, { ok: true, data });
                return;
            }

            // GET/POST/DELETE /api/admin/leads
            if ((req.method === 'GET' || req.method === 'POST' || req.method === 'DELETE') && _adminPath === '/api/admin/leads') {
                const ADMIN_LEADS_ID = '__admin_leads';
                const loadLeads = async () => {
                    const rows = await sb(`/user_state?user_id=eq.${ADMIN_LEADS_ID}&select=data`);
                    return rows?.[0]?.data?.leads || [];
                };
                const saveLeads = async (leads) => {
                    await sb('/user_state', {
                        method: 'POST',
                        headers: { 'Prefer': 'resolution=merge-duplicates,return=minimal' },
                        body: JSON.stringify({ user_id: ADMIN_LEADS_ID, data: { leads }, updated_at: new Date().toISOString() }),
                    });
                };
                if (req.method === 'GET') { sendJson(200, { leads: await loadLeads() }); return; }
                if (req.method === 'POST') {
                    const lead = await readJsonBody(req);
                    let leads = await loadLeads();
                    if (!lead.id) lead.id = 'lead_' + crypto.randomBytes(6).toString('hex');
                    if (!lead.createdAt) lead.createdAt = new Date().toISOString();
                    const idx = leads.findIndex(l => l.id === lead.id);
                    if (idx >= 0) leads[idx] = { ...leads[idx], ...lead };
                    else leads.push(lead);
                    await saveLeads(leads);
                    sendJson(200, { ok: true, leads });
                    return;
                }
                if (req.method === 'DELETE') {
                    const qs = new URL(req.url, 'http://localhost').searchParams;
                    const id = qs.get('id');
                    let leads = await loadLeads();
                    leads = leads.filter(l => l.id !== id);
                    await saveLeads(leads);
                    sendJson(200, { ok: true, leads });
                    return;
                }
            }

            // GET /api/admin/gpstronic-results
            if (req.method === 'GET' && _adminPath === '/api/admin/gpstronic-results') {
                const rows = await sb('/user_state?user_id=ilike.gpstronic_test_*&select=user_id,data,updated_at') || [];
                const results = rows.map(r => ({
                    name: r.data?.name || String(r.user_id).replace('gpstronic_test_', ''),
                    completedAt: r.data?.completedAt || r.updated_at,
                    score: r.data?.score ?? null,
                    byBand: r.data?.byBand || {},
                }));
                sendJson(200, { results });
                return;
            }

            // POST /api/admin/broadcast {title, body, url?} → {sent, failed}
            if (req.method === 'POST' && _adminPath === '/api/admin/broadcast') {
                const { title, body, url: targetUrl } = await readJsonBody(req);
                const t = String(title || '').slice(0, 60).trim();
                const b = String(body || '').slice(0, 160).trim();
                if (!t || !b) { sendJson(400, { error: 'title_and_body_required' }); return; }

                let webpush = null;
                try { webpush = require('web-push'); } catch (e) {}
                const canPush = webpush && process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY;
                if (!canPush) { sendJson(200, { sent: 0, failed: 0, error: 'push_not_configured' }); return; }
                webpush.setVapidDetails(
                    process.env.VAPID_SUBJECT || 'mailto:contato@capyenglish.com.br',
                    process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY
                );

                const states = await sb('/user_state?select=user_id,data') || [];
                const payload = JSON.stringify({ title: t, body: b, url: targetUrl || '/learn.html', tag: 'capy-broadcast' });
                let sent = 0, failed = 0;
                for (const row of states) {
                    const d = row.data || {};
                    if (!d.pushSub || !d.pushSub.endpoint) continue;
                    try {
                        await webpush.sendNotification(d.pushSub, payload);
                        sent++;
                    } catch (e) { failed++; }
                }
                sendJson(200, { sent, failed });
                return;
            }

            sendJson(404, { error: 'not_found' });
        })();
        return;
    }

    // POST /api/admin/grant-plan {email, plan?, expiresAt?} · Auth: Bearer ADMIN_KEY or CRON_SECRET
    if (req.method === 'POST' && req.url === '/api/admin/grant-plan') {
        const sendJson = (code, obj) => {
            res.writeHead(code, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            res.end(JSON.stringify(obj));
        };
        if (!isAdminReq(req)) { sendJson(401, { error: 'unauthorized' }); return; }
        (async () => {
            const { email, plan, expiresAt } = await readJsonBody(req);
            const norm = (email || '').toLowerCase().trim();
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(norm)) { sendJson(400, { error: 'invalid_email' }); return; }
            const newPlan = (plan === 'super') ? 'super' : 'pro';
            const exp = expiresAt || '2099-12-31T23:59:59Z';
            const found = await sb(`/accounts?email=eq.${encodeURIComponent(norm)}&select=id,name`);
            let userId = found?.[0]?.id;
            let created = false;
            if (!userId) {
                userId = 'magic-' + crypto.randomBytes(8).toString('hex');
                await sb('/accounts', {
                    method: 'POST',
                    headers: { 'Prefer': 'resolution=merge-duplicates,return=minimal' },
                    body: JSON.stringify({
                        id: userId, name: norm.split('@')[0], email: norm,
                        password: '__magic__' + crypto.randomBytes(8).toString('hex'),
                        avatar: '🐾', pending_setup: false,
                        created_at: new Date().toISOString(),
                    }),
                });
                created = true;
            }
            await sb('/user_profiles?on_conflict=id', {
                method: 'POST',
                headers: { 'Prefer': 'resolution=merge-duplicates,return=minimal' },
                body: JSON.stringify({ id: userId, plan: newPlan, plan_expires_at: exp }),
            });
            const check = await sb(`/user_profiles?id=eq.${encodeURIComponent(userId)}&select=plan,plan_expires_at`);
            sendJson(200, { ok: true, userId, accountCreated: created, profile: check?.[0] || null });
        })();
        return;
    }

    // ── POST /api/transcribe  (Whisper: Speak step + AI Chat por voz) ────────
    if (req.method === 'POST' && req.url === '/api/transcribe') {
        let raw = '';
        req.on('data', c => raw += c);
        req.on('end', () => {
            let body = {};
            try { body = JSON.parse(raw || '{}'); } catch {}
            const sendJson = (code, obj) => {
                res.writeHead(code, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                res.end(JSON.stringify(obj));
            };
            if (!body.audioBase64) { sendJson(400, { error: 'audioBase64 obrigatório' }); return; }
            if (!API_KEY) { sendJson(503, { error: 'AI features require OPENAI_API_KEY.' }); return; }

            let audioBuf;
            try { audioBuf = Buffer.from(body.audioBase64, 'base64'); } catch (e) { sendJson(400, { error: 'audioBase64 inválido' }); return; }
            if (audioBuf.length < 200) { sendJson(400, { error: 'Áudio vazio ou muito curto.' }); return; }
            if (audioBuf.length > 15 * 1024 * 1024) { sendJson(413, { error: 'Áudio muito grande (máx 15MB).' }); return; }

            const ct = body.mimeType || 'audio/webm';
            const ext = ct.includes('mp4') ? 'mp4' : ct.includes('ogg') ? 'ogg' : ct.includes('wav') ? 'wav' : 'webm';
            const boundary = '----CapyBoundary' + crypto.randomBytes(12).toString('hex');
            const parts = [
                Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="model"\r\n\r\nwhisper-1\r\n`),
            ];
            if (body.lang) parts.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="language"\r\n\r\n${body.lang}\r\n`));
            parts.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="audio.${ext}"\r\nContent-Type: ${ct}\r\n\r\n`));
            parts.push(audioBuf);
            parts.push(Buffer.from(`\r\n--${boundary}--\r\n`));
            const postData = Buffer.concat(parts);

            const opts = {
                hostname: 'api.openai.com', path: '/v1/audio/transcriptions', method: 'POST',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': `multipart/form-data; boundary=${boundary}`,
                    'Content-Length': postData.length,
                },
            };
            const apiReq = https.request(opts, apiRes => {
                let data = '';
                apiRes.on('data', c => data += c);
                apiRes.on('end', () => {
                    try {
                        const parsed = JSON.parse(data);
                        if (parsed.error) { sendJson(502, { error: parsed.error.message || 'Erro na transcrição.' }); return; }
                        sendJson(200, { text: (parsed.text || '').trim() });
                    } catch (e) { sendJson(500, { error: 'Erro ao processar a transcrição.' }); }
                });
            });
            apiReq.on('error', () => sendJson(500, { error: 'Erro de conexão com a IA.' }));
            apiReq.write(postData); apiReq.end();
        });
        return;
    }

    // ── POST /api/correct-writing  (Yara Writing Coach) ──────────────────────
    // Mirrors api/index.js — returns RAW JSON (not the Gemini envelope).
    if (req.method === 'POST' && req.url === '/api/correct-writing') {
        let raw = '';
        req.on('data', c => raw += c);
        req.on('end', () => {
            let body = {};
            try { body = JSON.parse(raw || '{}'); } catch {}
            const student = String(body.text || '').slice(0, 2000).trim();
            const sendJson = (code, obj) => {
                res.writeHead(code, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                res.end(JSON.stringify(obj));
            };
            if (!student || student.split(/\s+/).length < 3) {
                sendJson(400, { error: 'Escreva pelo menos uma frase para a Yara corrigir.' }); return;
            }
            if (!CHAT_KEY) { sendJson(503, { error: 'AI features require OPENAI_API_KEY or OPENROUTER_API_KEY.' }); return; }

            // Espelha api/index.js: o curso de francês usa o mesmo corretor.
            const TARGET = String(body.lang || 'en').toLowerCase() === 'fr' ? 'French' : 'English';

            const prompt = `You are Yara, a warm and encouraging capybara ${TARGET} teacher for Brazilian learners. A student completed a free-writing exercise. Correct it like a caring teacher: celebrate what they got right, fix what is wrong, and explain IN BRAZILIAN PORTUGUESE so they truly understand.

Lesson: ${String(body.lessonTitle || TARGET + ' practice').slice(0, 120)} (course: ${String(body.course || 'english').slice(0, 40)})
Writing task: ${String(body.task || 'free writing practice').slice(0, 300)}

Student's text:
"""
${student}
"""

Rules:
- Find REAL errors only (grammar, word choice, spelling, unnatural phrasing). Do not invent errors.
- If the text is not in ${TARGET} (e.g. written in Portuguese), set "score" to 1 and explain gently in "praise" that the exercise must be written in ${TARGET}, with "errors" empty and "improved" as a ${TARGET} example of what they could write.
- Explanations in PT-BR, simple and friendly, max 20 words each.
- "improved" keeps the student's ideas and level — natural ${TARGET}, not fancy rewriting.
- Score: 5=perfect/near perfect, 4=minor slips, 3=understandable with several errors, 2=hard to understand, 1=not ${TARGET}/off-task.
- Max 6 errors (pick the most important ones).
- Respond ONLY with valid JSON (no markdown):

{
  "score": 4,
  "praise": "Elogio curto e específico em português sobre o que o aluno acertou",
  "errors": [
    {"original": "trecho errado do aluno", "fixed": "versão correta", "why": "explicação curta em PT-BR"}
  ],
  "improved": "The student's full text, corrected, in natural ${TARGET}.",
  "tip": "Uma dica prática em PT-BR baseada no erro mais frequente do aluno"
}`;

            const postData = JSON.stringify({ model: CHAT_MODEL, messages: [{ role: 'user', content: prompt }], max_tokens: 900, temperature: 0.3, response_format: { type: 'json_object' } });
            const opts = { hostname: CHAT_HOST, path: CHAT_PATH, method: 'POST', headers: chatHeaders(Buffer.byteLength(postData)) };
            const apiReq = https.request(opts, apiRes => {
                let data = '';
                apiRes.on('data', c => data += c);
                apiRes.on('end', () => {
                    try {
                        const parsed = JSON.parse(data);
                        const content = parsed?.choices?.[0]?.message?.content || '{}';
                        const out = JSON.parse(content);
                        out.score = Math.min(5, Math.max(1, parseInt(out.score, 10) || 3));
                        out.errors = Array.isArray(out.errors) ? out.errors.slice(0, 6) : [];
                        sendJson(200, out);
                    } catch (e) { sendJson(500, { error: 'Erro ao corrigir o texto. Tente de novo!' }); }
                });
            });
            apiReq.on('error', () => sendJson(500, { error: 'Erro de conexão com a IA.' }));
            apiReq.write(postData); apiReq.end();
        });
        return;
    }

    // ── POST /api/chat  (Yara free-chat) ──────────────────────────────────────
    if (req.method === 'POST' && req.url === '/api/chat') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { history, message, systemOverride } = JSON.parse(body);

                const systemPrompt = systemOverride ||
                    `You are Yara, a friendly and cheerful capybara who teaches English to young children aged 5-8.
Rules:
- Always respond in very simple English (A1 level).
- Keep every reply to 1-3 short sentences maximum.
- Be warm, playful and encouraging. Use 1-2 emojis per reply.
- If the child makes a grammar mistake, gently correct it once, then continue.
- If the child writes in another language, reply in English and kindly ask them to try in English.
- Never discuss anything outside English learning or child-friendly topics.
- Always end with a simple question or encouragement to keep the conversation going.`;

                const messages = [{ role: 'system', content: systemPrompt }];

                // Append conversation history
                (history || []).forEach(m => {
                    messages.push({
                        role:    m.role === 'model' ? 'assistant' : 'user',
                        content: m.text
                    });
                });

                messages.push({ role: 'user', content: message });

                callOpenAI(messages, 120, 0.85, res);
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Bad request' }));
            }
        });
        return;
    }

    // ── POST /api/quiz  (AI quiz generation) ─────────────────────────────────
    if (req.method === 'POST' && req.url === '/api/quiz') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { words, deckLabel } = JSON.parse(body);

                const prompt = `You are creating a fun English quiz for children aged 5-8.
The child just studied these words from the "${deckLabel}" deck: ${words.join(', ')}.

Generate exactly 4 multiple-choice questions to test those words.
Each question must have exactly 4 answer options (A, B, C, D) with only one correct answer.

Respond ONLY with a valid JSON array — no explanation, no markdown, no code block.
Format:
[
  {
    "question": "What is this? 🍎",
    "image_hint": "Apple",
    "options": ["Apple", "River", "Bird", "Tree"],
    "correct": "Apple"
  }
]

Keep questions very simple. Use emojis in questions. Vary question types (What is this? / Which word means...? / Fill in the blank).`;

                callOpenAI([{ role: 'user', content: prompt }], 600, 0.7, res);
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Bad request' }));
            }
        });
        return;
    }

    // ── POST /api/translate  (word translation) ──────────────────────────────
    if (req.method === 'POST' && req.url === '/api/translate') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { word, targetLang, context } = JSON.parse(body);
                const ctxLine = context ? `\nUse this sentence for context (the word may be inflected there): "${context}"` : '';
                const prompt = `Translate the word "${word}" into ${targetLang}.${ctxLine}
Respond ONLY with valid JSON — no markdown, no explanation.
Format: {"translation": "...", "example": "A simple sentence using the translation (in ${targetLang})."}`;

                callOpenAI([{ role: 'user', content: prompt }], 80, 0.3, res);
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Bad request' }));
            }
        });
        return;
    }

    // ── POST /api/newsline  (real news headlines rewritten at student level) ──
    // Body: {topic, lang:'en'|'fr', level?:'easy'|'medium'}
    if (req.method === 'POST' && req.url === '/api/newsline') {
        (async () => {
            const sendJson = (code, obj) => {
                res.writeHead(code, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                res.end(JSON.stringify(obj));
            };
            try {
                const { topic, lang, level } = await readJsonBody(req);
                const t = (topic || '').trim().slice(0, 80);
                if (!t) { sendJson(400, { error: 'Digite um tema para buscar notícias.' }); return; }
                const targetLang = lang === 'fr' ? 'fr' : 'en';
                const lvl = level === 'medium' ? 'medium' : 'easy';

                const hl   = targetLang === 'fr' ? 'fr' : 'en-US';
                const gl   = targetLang === 'fr' ? 'FR' : 'US';
                const ceid = targetLang === 'fr' ? 'FR:fr' : 'US:en';
                const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(t)}&hl=${hl}&gl=${gl}&ceid=${ceid}`;

                let items = [];
                try {
                    const xml = await httpsGetFollow(rssUrl);
                    items = parseNewsRSS(xml, 3);
                } catch (e) {
                    sendJson(502, { error: 'Não foi possível buscar notícias agora. Tente novamente em instantes.' }); return;
                }

                if (!items.length) { sendJson(200, { articles: [] }); return; }
                if (!CHAT_KEY) { sendJson(503, { error: 'AI features require OPENAI_API_KEY or OPENROUTER_API_KEY.' }); return; }

                const langName   = targetLang === 'fr' ? 'French' : 'English';
                const levelDesc  = lvl === 'easy' ? 'A2/B1' : 'B1/B2';
                const itemsBlock = items.map((it, i) => `${i + 1}. TITLE: ${it.title}\nSOURCE: ${it.source || 'News'}\nDESCRIPTION: ${it.description || '(no description available)'}`).join('\n\n');

                const prompt = `You are Yara, a friendly capybara teacher creating a "Newsline" reading exercise for a Brazilian student learning ${langName}.
Below are ${items.length} REAL news headlines with short descriptions. For EACH one, write a simplified, didactic version in ${langName} at ${levelDesc} level.

STRICT RULES:
- Do NOT invent facts, numbers, names, or details beyond what is given in the TITLE and DESCRIPTION below.
- If the description is thin, keep the body short and general rather than inventing specifics.
- Body: a FULL article of 4 to 6 paragraphs (18 to 25 natural sentences total) in ${langName}, ${levelDesc} level, written like a real news article for a language learner. Structure: (1) lead paragraph — what happened; (2) development — details from the title/description explained simply; (3) background/context paragraph(s) — general knowledge the reader needs to understand the topic (history, how things usually work, definitions of key terms); (4) closing — why it matters / what may come next, phrased carefully (may, could, experts say in general). Separate paragraphs with 

.
- The specific FACTS of this story must come ONLY from the given title/description; the background paragraphs may use general world knowledge about the TOPIC, never invented specifics about this particular story.
- Title: a simplified version of the original title in ${langName}, still accurate.
- Keep the tone neutral and factual.

NEWS ITEMS:
${itemsBlock}

Respond ONLY with valid JSON, no markdown:
{"articles":[{"title":"...","body":"..."}]}
Return exactly ${items.length} articles, in the same order as the items above.`;

                const postData = JSON.stringify({ model: CHAT_MODEL, messages: [{ role: 'user', content: prompt }], max_tokens: 5000, temperature: 0.5, response_format: { type: 'json_object' } });
                const opts = { hostname: CHAT_HOST, path: CHAT_PATH, method: 'POST', headers: chatHeaders(Buffer.byteLength(postData)) };
                const apiReq = https.request(opts, apiRes => {
                    let data = '';
                    apiRes.on('data', c => data += c);
                    apiRes.on('end', () => {
                        try {
                            const parsed = JSON.parse(data);
                            const content = parsed?.choices?.[0]?.message?.content || '{}';
                            const obj = JSON.parse(content);
                            const aiArticles = Array.isArray(obj.articles) ? obj.articles : [];
                            const articles = items.map((it, i) => ({
                                title:     (aiArticles[i] && aiArticles[i].title) || it.title,
                                body:      (aiArticles[i] && aiArticles[i].body)  || it.description || '',
                                source:    it.source || 'News',
                                link:      it.link || '',
                                published: it.pubDate || '',
                            }));
                            sendJson(200, { articles });
                        } catch (e) { sendJson(500, { error: 'Erro ao gerar as notícias adaptadas.' }); }
                    });
                });
                apiReq.on('error', () => sendJson(500, { error: 'Erro de conexão com a IA.' }));
                apiReq.write(postData); apiReq.end();
            } catch (e) {
                sendJson(500, { error: 'Erro inesperado no servidor.' });
            }
        })();
        return;
    }

    // ── POST /api/historyline  (AI-narrated history, no RSS anchor — mirrors api/index.js) ──
    // Body: {topic, lang:'en'|'fr', level?:'easy'|'medium'}
    if (req.method === 'POST' && req.url === '/api/historyline') {
        (async () => {
            const sendJson = (code, obj) => {
                res.writeHead(code, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                res.end(JSON.stringify(obj));
            };
            try {
                const { topic, lang, level } = await readJsonBody(req);
                const t = (topic || '').trim().slice(0, 80);
                if (!t) { sendJson(400, { error: 'Digite um tema histórico para começar.' }); return; }
                if (!CHAT_KEY) { sendJson(503, { error: 'AI features require OPENAI_API_KEY or OPENROUTER_API_KEY.' }); return; }

                const targetLang = lang === 'fr' ? 'fr' : 'en';
                const lvl = level === 'medium' ? 'medium' : 'easy';
                const langName  = targetLang === 'fr' ? 'French' : 'English';
                const levelDesc = lvl === 'easy' ? 'A2/B1' : 'B1/B2';

                const prompt = `You are Yara, a friendly capybara teacher creating a "Historyline" reading exercise for a Brazilian student learning ${langName}.
The student chose this historical topic: "${t}" (place, event, period, or historical figure).

Write ONE long narrative text in ${langName} at ${levelDesc} level, telling the story of this topic like an engaging but didactic storyteller.

STRICT RULES ABOUT ACCURACY:
- Use ONLY widely established, consolidated historical facts that appear in mainstream textbooks and encyclopedias. Do not use controversial or disputed interpretations.
- Avoid very specific dates, numbers, or statistics unless they are extremely well-known and uncontroversial (e.g. well-known years). When unsure of an exact detail, generalize instead of inventing ("in the late 18th century" instead of a precise disputed date).
- Never invent names, quotes, numbers, or events. If you are not confident about a detail, leave it out or generalize.

STRUCTURE (4 to 6 paragraphs, 18 to 25 natural sentences total, separated by double line break):
1. Context/era — set the scene: when and where, what the world was like.
2. What happened — the core story of the topic, told clearly and engagingly.
3. Why it matters — the significance at the time.
4. Legacy/consequences — how it shaped what came after, or its relevance today.

Style: engaging like a storyteller, but clear and didactic, ${levelDesc} level ${langName}, natural sentences a Brazilian learner can follow.

Title: a short, simple title for the topic in ${langName}.

Respond ONLY with valid JSON, no markdown:
{"title":"...","body":"..."}`;

                const postData = JSON.stringify({ model: CHAT_MODEL, messages: [{ role: 'user', content: prompt }], max_tokens: 1600, temperature: 0.6, response_format: { type: 'json_object' } });
                const opts = { hostname: CHAT_HOST, path: CHAT_PATH, method: 'POST', headers: chatHeaders(Buffer.byteLength(postData)) };
                const apiReq = https.request(opts, apiRes => {
                    let data = '';
                    apiRes.on('data', c => data += c);
                    apiRes.on('end', () => {
                        try {
                            const parsed = JSON.parse(data);
                            const content = parsed?.choices?.[0]?.message?.content || '{}';
                            const obj = JSON.parse(content);
                            const article = { title: obj.title || t, body: obj.body || '', topic: t };
                            if (!article.body) { sendJson(500, { error: 'Erro ao gerar a história. Tente outro tema.' }); return; }
                            sendJson(200, { article });
                        } catch (e) { sendJson(500, { error: 'Erro ao gerar a história adaptada.' }); }
                    });
                });
                apiReq.on('error', () => sendJson(500, { error: 'Erro de conexão com a IA.' }));
                apiReq.write(postData); apiReq.end();
            } catch (e) {
                sendJson(500, { error: 'Erro inesperado no servidor.' });
            }
        })();
        return;
    }

    // ── POST /api/story  (AI Story Time) ─────────────────────────────────────
    if (req.method === 'POST' && req.url === '/api/story') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { words, name } = JSON.parse(body);
                const childName = name || 'Explorer';
                const wordList  = (words || ['apple','tree','bird']).join(', ');

                const prompt = `Write a short, fun English story for a child named ${childName}, aged 5-8.
The story MUST use these words naturally: ${wordList}.

Rules:
- Maximum 5 sentences. Very simple English (A1 level).
- Make it fun, warm, and set in a magical forest.
- Feature a friendly capybara named Yara as a character.
- End with a happy, positive message.
- Add 1-2 emojis per sentence.

Respond ONLY with valid JSON — no markdown, no code block.
Format:
{
  "title": "The Magic Apple Tree",
  "sentences": [
    "Yara the capybara found a big apple tree in the forest. 🌳🍎",
    "..."
  ],
  "moral": "Always share with your friends!"
}`;

                callOpenAI([{ role: 'user', content: prompt }], 400, 0.85, res);
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Bad request' }));
            }
        });
        return;
    }

    // ── GET /api/word-of-day  (AI Word of the Day) ────────────────────────────
    if (req.method === 'GET' && req.url === '/api/word-of-day') {
        const today = new Date().toISOString().slice(0, 10);
        const prompt = `Today is ${today}. Pick ONE interesting English word that a child aged 5-8 would find fun and useful.

Respond ONLY with valid JSON — no markdown, no code block, no explanation.
Format:
{
  "word": "Butterfly",
  "emoji": "🦋",
  "pronunciation": "/ˈbʌt.ə.flaɪ/",
  "partOfSpeech": "noun",
  "simpleMeaning": "A beautiful insect with big colourful wings.",
  "exampleSentence": "I saw a butterfly in the garden today.",
  "funFact": "Butterflies taste with their feet!"
}`;

        callOpenAI([{ role: 'user', content: prompt }], 200, 0.9, res);
        return;
    }

    // ── GET /api/daily-challenge  (AI Daily Challenge) ───────────────────────
    if (req.method === 'GET' && req.url === '/api/daily-challenge') {
        const today = new Date().toISOString().slice(0, 10);
        const prompt = `Today is ${today}. Create ONE fun English challenge for a child aged 5-8.

Respond ONLY with valid JSON — no markdown, no code block, no explanation.
Format exactly:
{"type":"sentence","emoji":"🦁","title":"Use a Brave Word!","instruction":"Use the word 'brave' in a sentence about an animal.","hint":"Think about what a brave animal might do.","example":"The brave lion protected its cubs.","xp":20}

Types allowed: sentence (use a given word in a sentence), describe (describe something using adjectives), translate (translate simple words to English).
Make it fun, simple, and educational. XP should be 20 or 30.`;

        callOpenAI([{ role: 'user', content: prompt }], 150, 1.0, res);
        return;
    }

    // ── POST /api/flashcard-deck  (AI Flashcard Deck) ────────────────────────
    if (req.method === 'POST' && req.url === '/api/flashcard-deck') {
        let body = '';
        req.on('data', c => body += c);
        req.on('end', () => {
            let topic = 'animals';
            try { topic = JSON.parse(body).topic || 'animals'; } catch {}
            const messages = [{
                role: 'user',
                content: `Create 10 English vocabulary flashcards for the topic "${topic}" for children aged 5-8.
Respond ONLY with a valid JSON array — no markdown, no code block, no explanation.
Format exactly:
[{"word":"Sun","emoji":"☀️","pronunciation":"/sʌn/","hint":"It shines in the sky","example":"The sun is bright today."}]
Words should be common, age-appropriate, and varied.`
            }];
            callOpenAI(messages, 600, 0.8, res);
        });
        return;
    }

    // ── POST /api/dialogue-scene  (AI Dialogue Scene) ────────────────────────
    if (req.method === 'POST' && req.url === '/api/dialogue-scene') {
        let body = '';
        req.on('data', c => body += c);
        req.on('end', () => {
            let topic = 'pets';
            try { topic = JSON.parse(body).topic || 'pets'; } catch {}
            const messages = [{
                role: 'user',
                content: `Create a short English grammar dialogue scene for children aged 5-8 about the topic "${topic}".
Respond ONLY with valid JSON — no markdown, no code block, no explanation.
Format exactly:
{"emoji":"🐶","scene":"Yara and a friend are at the park with their pets.","intro":"Let's talk about our pets! Can you help me?","grammarFocus":"possessive pronouns","questions":[{"prompt":"___ dog is fluffy and brown.","choices":["My","Me","I"],"answer":"My","explanation":"We use 'My' to show the dog belongs to me."}]}
Provide exactly 6 questions. Keep language very simple. Each question has exactly 3 choices.`
            }];
            callOpenAI(messages, 700, 0.8, res);
        });
        return;
    }

    // ── POST /api/parent-report  (AI Progress Analysis) ──────────────────────
    if (req.method === 'POST' && req.url === '/api/parent-report') {
        let body = '';
        req.on('data', c => body += c);
        req.on('end', () => {
            try {
                const { name, xp, badges, lessons, recentDate } = JSON.parse(body);
                const prompt = `Act as an encouraging, professional educational analyst for a children's language app.
Review this child's progress data:
- Name: ${name || 'The student'}
- Total XP: ${xp || 0}
- Badges Earned: ${badges ? badges.length : 0}
- Flashcards/Decks completed: ${lessons ? lessons.length : 0}
- Last active: ${recentDate || 'Recently'}

Write a 2-3 paragraph summary for the parents.
Focus on:
1. Celebrating their effort and consistency.
2. Highlighting their engagement with the app.
3. Providing one constructive, practical tip for the parent to practice English with them offline this week (e.g. at the dinner table).

Keep the tone extremely warm, positive, and concise.
Respond ONLY with valid JSON — no markdown, no code block.
Format exactly:
{"title":"Weekly Progress Report for ${name || 'Your Child'}","summary":"[Paragraph 1]\\n\\n[Paragraph 2]","parentTip":"[The tip]"}
`;
                callOpenAI([{ role: 'user', content: prompt }], 500, 0.7, res);
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Bad request' }));
            }
        });
        return;
    }

    // ── POST /api/lesson-quiz  (AI quiz questions for a lesson topic) ─────────
    if (req.method === 'POST' && req.url === '/api/lesson-quiz') {
        let body = '';
        req.on('data', c => body += c);
        req.on('end', () => {
            try {
                const { topic, vocab, level } = JSON.parse(body);
                const messages = [{
                    role: 'user',
                    content: `Create 5 multiple-choice English quiz questions for children learning about "${topic}" at ${level || 'beginner'} level.
Key vocabulary to test: ${(vocab || []).join(', ')}.
Return ONLY valid JSON array (no markdown, no code block):
[{"q":"question text","opts":["option A","option B","option C","option D"],"a":"exact correct option text","explain":"one short sentence why"}]
Keep questions simple, fun, and age-appropriate for 8-12 year olds. Each question must have exactly 4 options.`
                }];
                callOpenAI(messages, 700, 0.7, res);
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Bad request' }));
            }
        });
        return;
    }

    // ── POST /api/lesson-chat  (Yara AI conversation for lesson practice) ────
    if (req.method === 'POST' && req.url === '/api/lesson-chat') {
        let body = '';
        req.on('data', c => body += c);
        req.on('end', () => {
            try {
                const { history, message, lessonTopic, vocab, lang = 'en' } = JSON.parse(body);
                const targetLanguage = lang === 'tr' ? 'Turkish' : lang === 'fr' ? 'French' : 'English';
                const system = `You are Yara, a friendly capybara who teaches ${targetLanguage} to Brazilian students.
The lesson topic is "${lessonTopic}". Key vocabulary: ${(vocab || []).join(', ')}.
Rules: keep every reply under 2 sentences; use beginner ${targetLanguage}; always end with a short question; explain doubts in Brazilian Portuguese, then invite the student to try again in ${targetLanguage}; be warm, playful, and encouraging.`;
                const messages = [{ role: 'system', content: system }];
                (history || []).forEach(m => messages.push({
                    role: m.role === 'model' ? 'assistant' : 'user',
                    content: m.text
                }));
                messages.push({ role: 'user', content: message });
                callOpenAI(messages, 120, 0.85, res);
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Bad request' }));
            }
        });
        return;
    }

    // ── GET /api/tts?text=hello&voice=nova&lang=en  (mirrors api/index.js) ────
    if (req.method === 'GET' && req.url.split('?')[0] === '/api/tts') {
        const sendJson = (code, obj) => {
            res.writeHead(code, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            res.end(JSON.stringify(obj));
        };
        if (!API_KEY) { sendJson(503, { error: 'OPENAI_API_KEY not set' }); return; }
        const qs2 = new URL(req.url, 'http://localhost').searchParams;
        const text = (qs2.get('text') || '').slice(0, 500);
        if (!text.trim()) { sendJson(400, { error: 'text required' }); return; }
        const voice = qs2.get('voice') || 'nova';
        const lang  = qs2.get('lang')  || 'en';
        const isFr  = lang === 'fr';
        const isTr  = lang === 'tr';

        function doOpenAiTts() {
            const ttsModel = (isFr || isTr) ? 'gpt-4o-mini-tts' : 'tts-1';
            const bodyObj = { model: ttsModel, input: text, voice, response_format: 'mp3' };
            if (isFr) {
                bodyObj.instructions = 'You are a native French speaker. Pronounce every word with a perfect, authentic French accent — no English influence. Speak clearly and naturally like a French teacher.';
            }
            if (isTr) {
                bodyObj.instructions = 'You are a native Turkish speaker from Istanbul. Pronounce Turkish letters, vowels and suffixes clearly and naturally for a Brazilian beginner. Do not use an English accent.';
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
                        let detail = d;
                        try { detail = JSON.parse(d)?.error?.message || d; } catch (e) {}
                        sendJson(502, { error: 'OpenAI TTS error', detail: String(detail).slice(0, 400) });
                    });
                    return;
                }
                res.writeHead(200, {
                    'Content-Type': 'audio/mpeg',
                    'Cache-Control': 'public, max-age=86400',
                    'Access-Control-Allow-Origin': '*',
                });
                ttsRes.pipe(res);
            });
            ttsReq.on('error', e => sendJson(502, { error: e.message }));
            ttsReq.write(body);
            ttsReq.end();
        }

        doOpenAiTts();
        return;
    }

    // ── DATABASE ENDPOINTS (Local JSON Store) ────────────────────────────────
    const DB_FILE = path.join(ROOT, 'database.json');
    const readDB = () => { try { return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8')); } catch { return { accounts: [], users: {}, settings: {} }; } };
    const writeDB = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

    if (req.method === 'GET' && req.url.startsWith('/api/db/leaderboard')) {
        let db = readDB();
        let board = [];
        const accounts = db.accounts || [];
        for (const act of accounts) {
            const st = db.users[act.id] || {};
            const set = db.settings[act.id] || {};
            board.push({
                id: act.id,
                name: act.name,
                avatar: set.avatar || act.avatar || '🐾',
                xp: st.xp || 0,
                badgesCount: (st.badges || []).length
            });
        }
        board.sort((a, b) => b.xp - a.xp);
        board = board.slice(0, 20); // Top 20

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(board));
        return;
    }

    if (req.method === 'GET' && req.url.startsWith('/api/db/accounts')) {
        let db = readDB();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ accounts: db.accounts }));
        return;
    }

    if (req.method === 'POST' && req.url === '/api/db/accounts') {
        let body = '';
        req.on('data', c => body += c);
        req.on('end', () => {
            try {
                const { accounts } = JSON.parse(body);
                let db = readDB();
                db.accounts = accounts;
                writeDB(db);
                res.writeHead(200); res.end(JSON.stringify({ success: true }));
            } catch(e) { res.writeHead(400); res.end(JSON.stringify({ error: true })); }
        });
        return;
    }

    if (req.method === 'GET' && req.url.startsWith('/api/db')) {
        const urlParams = new URL(req.url, `http://${req.headers.host}`).searchParams;
        const type = urlParams.get('type'); // 'state' or 'settings'
        const userId = urlParams.get('userId');
        
        let db = readDB();
        let payload = null;
        if (type === 'state' && userId) payload = db.users[userId] || null;
        if (type === 'settings' && userId) payload = db.settings[userId] || null;
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(payload));
        return;
    }

    if (req.method === 'POST' && req.url === '/api/db') {
        let body = '';
        req.on('data', c => body += c);
        req.on('end', () => {
            try {
                const { type, userId, payload } = JSON.parse(body);
                if (userId && payload) {
                    let db = readDB();
                    if (type === 'state') db.users[userId] = payload;
                    else if (type === 'settings') db.settings[userId] = payload;
                    writeDB(db);
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Save failed' }));
            }
        });
        return;
    }

    // ── Static file serving ───────────────────────────────────────────────────
    if (!['GET', 'HEAD'].includes(req.method)) {
        res.writeHead(405, { 'Content-Type': 'text/plain', 'Allow': 'GET, HEAD' });
        res.end('Method Not Allowed');
        return;
    }
    let urlPathname;
    try { urlPathname = decodeURIComponent(req.url.split('?')[0]).replace(/\\/g, '/'); }
    catch {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Bad Request');
        return;
    }
    // Espelha a rota "^/$" do vercel.json — a raiz serve a página de vendas.
    const relativePath = urlPathname === '/' ? 'landing.html' : urlPathname.replace(/^\/+/, '');
    const segments = relativePath.split('/').filter(Boolean);
    const blockedTopLevel = new Set(['api', 'scripts', 'supabase', 'node_modules', 'security-audit-private']);
    const blockedFiles = new Set(['database.json', 'auth.js', 'package.json', 'package-lock.json', 'vercel.json']);
    if (segments.some(segment => segment.startsWith('.')) || blockedTopLevel.has(segments[0]) || blockedFiles.has(relativePath.toLowerCase())) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
    }
    const rootResolved = path.resolve(ROOT);
    const filePath = path.resolve(rootResolved, relativePath);
    const prefix = rootResolved.endsWith(path.sep) ? rootResolved : rootResolved + path.sep;
    if (!filePath.toLowerCase().startsWith(prefix.toLowerCase())) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
    }
    const extname     = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found', 'utf-8');
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Server Error: ' + error.code, 'utf-8');
            }
        } else {
            res.writeHead(200, {
                'Content-Type': contentType,
                'X-Content-Type-Options': 'nosniff',
                'X-Frame-Options': 'DENY',
                'Referrer-Policy': 'no-referrer',
                'Cache-Control': extname === '.html' ? 'no-store' : 'no-cache'
            });
            res.end(req.method === 'HEAD' ? undefined : content, 'utf-8');
        }
    });
};

// ── Export for Vercel serverless ──────────────────────────────────────────────
module.exports = handler;

// ── Local dev: start HTTP server only when run directly ───────────────────────
if (require.main === module) {
    const server = http.createServer(handler);
    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error(`❌ Port ${PORT} is already in use.`);
        } else {
            console.error('❌ Server error:', err);
        }
        process.exit(1);
    });
    server.listen(PORT, '127.0.0.1', () => {
        console.log(`✅ Capy Yara Adventures running at http://localhost:${PORT}/`);
        console.log(`🤖 AI endpoints ready (powered by OpenAI ${MODEL}):`);
        console.log(`   POST http://localhost:${PORT}/api/chat`);
        console.log(`   POST http://localhost:${PORT}/api/quiz`);
        console.log(`   POST http://localhost:${PORT}/api/translate`);
        console.log(`   POST http://localhost:${PORT}/api/story`);
        console.log(`   POST http://localhost:${PORT}/api/newsline`);
        console.log(`   GET  http://localhost:${PORT}/api/word-of-day`);
        console.log(`   GET  http://localhost:${PORT}/api/daily-challenge`);
    });
}
