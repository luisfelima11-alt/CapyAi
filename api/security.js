'use strict';

const crypto = require('crypto');

const SUPABASE_URL = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
const SUPABASE_PUBLIC_KEY = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || '';
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_KEY || '';
const APP_ORIGIN = (process.env.APP_ORIGIN || 'https://www.capyenglish.com.br').replace(/\/$/, '');
const IS_PRODUCTION = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

const COOKIE_NAMES = IS_PRODUCTION
  ? {
      access: '__Host-capy-access',
      refresh: '__Host-capy-refresh',
      csrf: '__Host-capy-csrf',
      guest: '__Host-capy-guest',
      pkce: '__Host-capy-pkce',
    }
  : {
      access: 'capy-access',
      refresh: 'capy-refresh',
      csrf: 'capy-csrf',
      guest: 'capy-guest',
      pkce: 'capy-pkce',
    };

class HttpError extends Error {
  constructor(status, code, message) {
    super(message || code);
    this.name = 'HttpError';
    this.status = status;
    this.code = code;
  }
}

function parseCookies(req) {
  const out = {};
  const raw = req.headers?.cookie || '';
  for (const pair of raw.split(';')) {
    const idx = pair.indexOf('=');
    if (idx < 0) continue;
    const key = pair.slice(0, idx).trim();
    const value = pair.slice(idx + 1).trim();
    if (!key) continue;
    try { out[key] = decodeURIComponent(value); }
    catch { out[key] = value; }
  }
  return out;
}

function cookie(name, value, options = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`, 'Path=/'];
  if (options.maxAge !== undefined) parts.push(`Max-Age=${Math.max(0, Math.floor(options.maxAge))}`);
  if (options.httpOnly !== false) parts.push('HttpOnly');
  if (IS_PRODUCTION) parts.push('Secure');
  parts.push(`SameSite=${options.sameSite || 'Lax'}`);
  return parts.join('; ');
}

function appendSetCookie(res, value) {
  const current = res.getHeader?.('Set-Cookie');
  const list = current ? (Array.isArray(current) ? current : [current]) : [];
  res.setHeader('Set-Cookie', [...list, value]);
}

function clearCookie(res, name, httpOnly = true) {
  appendSetCookie(res, cookie(name, '', { maxAge: 0, httpOnly }));
}

function setCsrfCookie(res, token) {
  appendSetCookie(res, cookie(COOKIE_NAMES.csrf, token, {
    maxAge: 30 * 24 * 60 * 60,
    httpOnly: false,
    sameSite: 'Strict',
  }));
}

function setSessionCookies(res, session) {
  if (!session?.access_token || !session?.refresh_token) {
    throw new HttpError(502, 'invalid_auth_response', 'Authentication provider returned an invalid session.');
  }
  const accessMaxAge = Math.max(60, Number(session.expires_in) || 3600);
  appendSetCookie(res, cookie(COOKIE_NAMES.access, session.access_token, { maxAge: accessMaxAge }));
  appendSetCookie(res, cookie(COOKIE_NAMES.refresh, session.refresh_token, { maxAge: 30 * 24 * 60 * 60 }));
  clearCookie(res, COOKIE_NAMES.guest);
  const csrfToken = crypto.randomBytes(32).toString('base64url');
  setCsrfCookie(res, csrfToken);
  return csrfToken;
}

function clearSessionCookies(res) {
  clearCookie(res, COOKIE_NAMES.access);
  clearCookie(res, COOKIE_NAMES.refresh);
  clearCookie(res, COOKIE_NAMES.guest);
  clearCookie(res, COOKIE_NAMES.csrf, false);
  clearCookie(res, COOKIE_NAMES.pkce);
}

function createPkceChallenge(res) {
  const verifier = crypto.randomBytes(48).toString('base64url');
  const challenge = crypto.createHash('sha256').update(verifier).digest('base64url');
  appendSetCookie(res, cookie(COOKIE_NAMES.pkce, verifier, { maxAge: 60 * 60, sameSite: 'Lax' }));
  return challenge;
}

function clearPkceCookie(res) {
  clearCookie(res, COOKIE_NAMES.pkce);
}

function safeEqual(a, b) {
  const aa = Buffer.from(String(a || ''));
  const bb = Buffer.from(String(b || ''));
  return aa.length === bb.length && aa.length > 0 && crypto.timingSafeEqual(aa, bb);
}

function isAllowedOrigin(origin) {
  if (!origin) return !IS_PRODUCTION;
  if (origin.replace(/\/$/, '') === APP_ORIGIN) return true;
  if (!IS_PRODUCTION && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)) return true;
  return false;
}

function assertOrigin(req) {
  const origin = req.headers?.origin || '';
  if (!isAllowedOrigin(origin)) throw new HttpError(403, 'invalid_origin', 'Request origin is not allowed.');
}

function assertCsrf(req) {
  assertOrigin(req);
  const cookies = parseCookies(req);
  const header = req.headers?.['x-csrf-token'];
  if (!safeEqual(cookies[COOKIE_NAMES.csrf], header)) {
    throw new HttpError(403, 'invalid_csrf', 'CSRF validation failed.');
  }
}

async function authRequest(path, options = {}, useSecret = false) {
  if (!SUPABASE_URL) throw new HttpError(503, 'auth_not_configured', 'SUPABASE_URL is not configured.');
  const key = useSecret ? SUPABASE_SECRET_KEY : SUPABASE_PUBLIC_KEY;
  if (!key) {
    throw new HttpError(503, 'auth_not_configured', useSecret
      ? 'SUPABASE_SECRET_KEY is not configured.'
      : 'SUPABASE_PUBLISHABLE_KEY is not configured.');
  }
  const response = await fetch(`${SUPABASE_URL}${path}`, {
    ...options,
    headers: {
      apikey: key,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; }
  catch { data = { message: text || 'Invalid authentication response.' }; }
  if (!response.ok) {
    const message = data?.msg || data?.message || data?.error_description || 'Authentication failed.';
    const status = response.status === 400 ? 400 : response.status;
    throw new HttpError(status, data?.error_code || data?.code || 'auth_error', message);
  }
  return data;
}

async function signInWithPassword(email, password) {
  return authRequest('/auth/v1/token?grant_type=password', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

async function signUpWithPassword(email, password, data = {}, codeChallenge = '') {
  const redirectTo = `${APP_ORIGIN}/api/auth/callback?next=${encodeURIComponent('/onboarding.html')}`;
  return authRequest(`/auth/v1/signup?redirect_to=${encodeURIComponent(redirectTo)}`, {
    method: 'POST',
    body: JSON.stringify({ email, password, data, ...(codeChallenge ? { code_challenge: codeChallenge, code_challenge_method: 's256' } : {}) }),
  });
}

async function requestPasswordReset(email, codeChallenge = '') {
  const redirectTo = `${APP_ORIGIN}/api/auth/callback?next=${encodeURIComponent('/set-password.html')}`;
  return authRequest(`/auth/v1/recover?redirect_to=${encodeURIComponent(redirectTo)}`, {
    method: 'POST',
    body: JSON.stringify({ email, ...(codeChallenge ? { code_challenge: codeChallenge, code_challenge_method: 's256' } : {}) }),
  });
}

async function exchangePkceCode(code, verifier) {
  return authRequest('/auth/v1/token?grant_type=pkce', {
    method: 'POST',
    body: JSON.stringify({ auth_code: code, code_verifier: verifier }),
  });
}

async function verifyEmailToken(tokenHash, type) {
  return authRequest('/auth/v1/verify', {
    method: 'POST',
    body: JSON.stringify({ token_hash: tokenHash, type }),
  });
}

async function updatePassword(accessToken, password) {
  return authRequest('/auth/v1/user', {
    method: 'PUT',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ password }),
  });
}

async function signOut(accessToken) {
  if (!accessToken) return;
  await authRequest('/auth/v1/logout', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

async function getUser(accessToken) {
  if (!accessToken) return null;
  try {
    return await authRequest('/auth/v1/user', {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  } catch (error) {
    if (error.status === 401 || error.status === 403) return null;
    throw error;
  }
}

async function refreshSession(refreshToken) {
  if (!refreshToken) return null;
  try {
    return await authRequest('/auth/v1/token?grant_type=refresh_token', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  } catch (error) {
    if (error.status === 400 || error.status === 401) return null;
    throw error;
  }
}

function decodeJwtPayload(token) {
  try {
    const part = String(token).split('.')[1];
    return JSON.parse(Buffer.from(part, 'base64url').toString('utf8'));
  } catch { return {}; }
}

async function getAuthenticatedSession(req, res) {
  if (req._capyAuthSession !== undefined) return req._capyAuthSession;
  const cookies = parseCookies(req);
  let accessToken = cookies[COOKIE_NAMES.access] || '';
  let user = await getUser(accessToken);
  if (!user && cookies[COOKIE_NAMES.refresh]) {
    const refreshed = await refreshSession(cookies[COOKIE_NAMES.refresh]);
    if (refreshed?.access_token) {
      req._capyCsrfToken = setSessionCookies(res, refreshed);
      accessToken = refreshed.access_token;
      user = refreshed.user || await getUser(accessToken);
    }
  }
  if (!user) {
    req._capyAuthSession = null;
    return null;
  }
  const jwt = decodeJwtPayload(accessToken);
  req._capyAuthSession = { user, accessToken, jwt };
  return req._capyAuthSession;
}

function guestSecret() {
  return process.env.SESSION_COOKIE_SECRET || process.env.GUEST_SESSION_SECRET || (!IS_PRODUCTION ? 'local-development-guest-secret-change-me' : '');
}

function signGuest(payload) {
  const secret = guestSecret();
  if (!secret) throw new HttpError(503, 'guest_not_configured', 'Guest sessions are not configured.');
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(encoded).digest('base64url');
  return `${encoded}.${signature}`;
}

function verifyGuest(token) {
  const secret = guestSecret();
  if (!secret || !token) return null;
  const [encoded, signature] = String(token).split('.');
  if (!encoded || !signature) return null;
  const expected = crypto.createHmac('sha256', secret).update(encoded).digest('base64url');
  if (!safeEqual(signature, expected)) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    if (!payload.id || !payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch { return null; }
}

function createGuestSession(res) {
  const payload = {
    id: `guest_${crypto.randomBytes(16).toString('hex')}`,
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
  };
  appendSetCookie(res, cookie(COOKIE_NAMES.guest, signGuest(payload), { maxAge: 24 * 60 * 60 }));
  clearCookie(res, COOKIE_NAMES.access);
  clearCookie(res, COOKIE_NAMES.refresh);
  const csrfToken = crypto.randomBytes(32).toString('base64url');
  setCsrfCookie(res, csrfToken);
  return { guest: payload, csrfToken };
}

async function getRequestIdentity(req, res, options = {}) {
  if (req._capyIdentity) return req._capyIdentity;
  const session = await getAuthenticatedSession(req, res);
  if (session) {
    req._capyIdentity = { kind: 'user', authUserId: session.user.id, session };
    return req._capyIdentity;
  }
  if (options.allowGuest !== false) {
    const guest = verifyGuest(parseCookies(req)[COOKIE_NAMES.guest]);
    if (guest) {
      req._capyIdentity = { kind: 'guest', guestId: guest.id, guest };
      return req._capyIdentity;
    }
  }
  return null;
}

async function requireIdentity(req, res, options = {}) {
  const identity = await getRequestIdentity(req, res, options);
  if (!identity) throw new HttpError(401, 'authentication_required', 'Authentication is required.');
  return identity;
}

async function requireRole(req, res, allowedRoles) {
  const identity = await requireIdentity(req, res, { allowGuest: false });
  const role = identity.session.user?.app_metadata?.role || 'student';
  if (!allowedRoles.includes(role)) throw new HttpError(403, 'forbidden', 'Insufficient permissions.');
  const requireMfa = process.env.ADMIN_REQUIRE_MFA !== 'false';
  if (requireMfa && IS_PRODUCTION && identity.session.jwt?.aal !== 'aal2') {
    throw new HttpError(403, 'mfa_required', 'Multi-factor authentication is required.');
  }
  return { ...identity, role };
}

function publicUser(user, appUser = null) {
  return {
    id: appUser?.id || user?.id,
    authUserId: user?.id,
    name: appUser?.name || user?.user_metadata?.name || '',
    email: user?.email || '',
    avatar: appUser?.avatar || user?.user_metadata?.avatar || '🐾',
    role: user?.app_metadata?.role || 'student',
  };
}

function applyApiHeaders(res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
}

module.exports = {
  APP_ORIGIN,
  COOKIE_NAMES,
  HttpError,
  applyApiHeaders,
  assertCsrf,
  assertOrigin,
  authRequest,
  clearPkceCookie,
  clearSessionCookies,
  createPkceChallenge,
  createGuestSession,
  getAuthenticatedSession,
  getRequestIdentity,
  exchangePkceCode,
  parseCookies,
  publicUser,
  requestPasswordReset,
  requireIdentity,
  requireRole,
  safeEqual,
  setSessionCookies,
  signInWithPassword,
  signOut,
  signUpWithPassword,
  updatePassword,
  verifyEmailToken,
};
