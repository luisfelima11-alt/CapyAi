// ════════════════════════════════════════════════════════════════════════════
// Server-side sessions + password hashing
// ════════════════════════════════════════════════════════════════════════════
// Session = HttpOnly cookie `capy_sess` holding base64url(JSON{uid,v,exp}) plus
// an HMAC-SHA256 signature (env SESSION_SECRET). Because it is a same-origin
// cookie, every existing fetch('/api/...') call sends it automatically.
//
//   readSession(req)          → payload or null   (signature + expiry, no DB)
//   requireUser(req, res)     → account row or null (also checks session_version)
//   setSessionCookie / clearSessionCookie
//   hashPassword / verifyPassword (scrypt)
// ════════════════════════════════════════════════════════════════════════════
const crypto = require('crypto');
const { sbRows } = require('./supabase');

const COOKIE_NAME   = 'capy_sess';
const SESSION_TTL_S = 30 * 24 * 60 * 60;   // 30 days
const RENEW_BELOW_S = 7 * 24 * 60 * 60;    // sliding renewal when < 7 days left

function getSecret() {
    const s = process.env.SESSION_SECRET || '';
    return s.length >= 16 ? s : '';
}

function isConfigured() { return !!getSecret(); }

function safeEqual(a, b) {
    const ba = Buffer.from(String(a));
    const bb = Buffer.from(String(b));
    return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
}

function hmac(data) {
    return crypto.createHmac('sha256', getSecret()).update(data).digest('base64url');
}

function signToken(payload) {
    const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
    return `${body}.${hmac(body)}`;
}

function verifyToken(token) {
    if (!token || !getSecret()) return null;
    const dot = token.indexOf('.');
    if (dot < 1) return null;
    const body = token.slice(0, dot);
    const sig  = token.slice(dot + 1);
    if (!safeEqual(sig, hmac(body))) return null;
    let p;
    try { p = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')); } catch (e) { return null; }
    if (!p || typeof p.uid !== 'string' || !p.uid || typeof p.exp !== 'number') return null;
    if (p.exp * 1000 <= Date.now()) return null;
    return p;
}

function parseCookies(req) {
    const out = {};
    String(req.headers.cookie || '').split(';').forEach(part => {
        const i = part.indexOf('=');
        if (i < 0) return;
        const k = part.slice(0, i).trim();
        if (!k) return;
        let v = part.slice(i + 1).trim();
        try { v = decodeURIComponent(v); } catch (e) { /* keep raw */ }
        out[k] = v;
    });
    return out;
}

function isHttps(req) {
    const proto = String(req.headers['x-forwarded-proto'] || '').split(',')[0].trim();
    return proto === 'https' || !!(req.socket && req.socket.encrypted);
}

function cookieString(req, value, maxAge) {
    const parts = [`${COOKIE_NAME}=${value}`, 'Path=/', 'HttpOnly', 'SameSite=Lax', `Max-Age=${maxAge}`];
    if (isHttps(req)) parts.push('Secure');
    return parts.join('; ');
}

// method: how the session was created ('pw' | 'signup' | 'link' | 'renew').
// A recent 'link' session may set a new password without the current one.
function setSessionCookie(req, res, uid, version, method) {
    const iat = Math.floor(Date.now() / 1000);
    const token = signToken({ uid, v: version || 1, iat, exp: iat + SESSION_TTL_S, m: method || 'pw' });
    res.setHeader('Set-Cookie', cookieString(req, token, SESSION_TTL_S));
}

function clearSessionCookie(req, res) {
    res.setHeader('Set-Cookie', cookieString(req, '', 0));
}

// Identify the caller without a DB round-trip (used for rate limiting).
function readSession(req) {
    return verifyToken(parseCookies(req)[COOKIE_NAME]);
}

// Full check: valid cookie AND account exists AND session_version matches.
// Returns { id, name, email, avatar, session_version } or null.
async function requireUser(req, res) {
    const s = readSession(req);
    if (!s) return null;
    const rows = await sbRows(`/accounts?id=eq.${encodeURIComponent(s.uid)}&select=id,name,email,avatar,session_version`);
    const acc = rows[0];
    if (!acc) return null;
    if ((acc.session_version || 1) !== (s.v || 1)) return null;
    if (res && s.exp - Date.now() / 1000 < RENEW_BELOW_S) {
        setSessionCookie(req, res, acc.id, acc.session_version || 1, 'renew');
    }
    return acc;
}

// ── Passwords (scrypt) ──────────────────────────────────────────────────────
const SCRYPT = { N: 16384, r: 8, p: 1, keylen: 64 };

function hashPassword(password) {
    return new Promise((resolve, reject) => {
        const salt = crypto.randomBytes(16);
        crypto.scrypt(String(password), salt, SCRYPT.keylen, { N: SCRYPT.N, r: SCRYPT.r, p: SCRYPT.p }, (err, key) => {
            if (err) return reject(err);
            resolve(['scrypt', SCRYPT.N, SCRYPT.r, SCRYPT.p, salt.toString('base64'), key.toString('base64')].join('$'));
        });
    });
}

function verifyPassword(password, stored) {
    return new Promise(resolve => {
        const parts = String(stored || '').split('$');
        if (parts.length !== 6 || parts[0] !== 'scrypt') return resolve(false);
        const [, N, r, p, saltB64, hashB64] = parts;
        const expected = Buffer.from(hashB64, 'base64');
        if (!expected.length) return resolve(false);
        crypto.scrypt(String(password), Buffer.from(saltB64, 'base64'), expected.length,
            { N: Number(N), r: Number(r), p: Number(p) }, (err, key) => {
                if (err) return resolve(false);
                resolve(key.length === expected.length && crypto.timingSafeEqual(key, expected));
            });
    });
}

module.exports = {
    COOKIE_NAME,
    isConfigured,
    safeEqual,
    readSession,
    requireUser,
    setSessionCookie,
    clearSessionCookie,
    hashPassword,
    verifyPassword,
    // exported for tests
    _signToken: signToken,
    _verifyToken: verifyToken,
};
