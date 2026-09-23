'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const { EventEmitter } = require('node:events');
const ROOT = path.resolve(__dirname, '..');
const ORIGIN = 'https://www.capyenglish.com.br';
const EMAIL = 'student@example.test';
const USER = { id: 'auth-mock-student', email: EMAIL, user_metadata: { name: 'Student' }, app_metadata: { role: 'student' } };
const ACCOUNT = { id: 'app-mock-student', auth_user_id: USER.id, email: EMAIL, name: 'Student', avatar: '🐾' };
const SESSION = { access_token: 'mock-access-token', refresh_token: 'mock-refresh-token', expires_in: 3600, user: USER };

function response(status, data) {
  return { ok: status >= 200 && status < 300, status, text: async () => JSON.stringify(data), json: async () => data };
}

function harness(options = {}) {
  // Separate CommonJS VM contexts avoid require-cache and process.env cross-test
  // contamination. Env is configured before either real module is evaluated.
  const env = {
    NODE_ENV: 'production', APP_ORIGIN: ORIGIN,
    SUPABASE_URL: 'https://mock-auth.supabase.test',
    SUPABASE_PUBLISHABLE_KEY: 'mock-public-key', SUPABASE_SECRET_KEY: 'mock-secret-key',
    SESSION_COOKIE_SECRET: 'mock-cookie-signing-secret',
    ...(options.resendKey === false ? {} : { RESEND_API_KEY: 'mock-resend-key' }),
  };
  const calls = [], unexpected = [], logs = [];
  async function mockFetch(input, init = {}) {
    const url = new URL(String(input));
    const body = init.body ? JSON.parse(init.body) : null;
    calls.push({ url, init, body });
    if (url.hostname === 'api.resend.com' && url.pathname === '/emails') {
      if (options.resendThrows) throw new Error('mock email transport unavailable');
      return response(options.resendStatus || 200, { id: 'mock-email' });
    }
    if (url.hostname !== 'mock-auth.supabase.test') {
      unexpected.push(String(input)); throw new Error('Unexpected network destination');
    }
    if (url.pathname === '/auth/v1/admin/generate_link') {
      if (options.generateFailure) return response(503, { error_code: 'mock_auth_unavailable' });
      return response(200, options.nestedHash
        ? { properties: { hashed_token: 'mock-hashed-token', user: USER } }
        : { hashed_token: 'mock-hashed-token', user: USER });
    }
    if (url.pathname === '/auth/v1/otp') return response(options.otpFailure ? 503 : 200, options.otpFailure ? { error_code: 'mock_otp_unavailable' } : {});
    if (url.pathname === '/auth/v1/verify') return response(200, SESSION);
    if (url.pathname === '/auth/v1/token' && url.searchParams.get('grant_type') === 'pkce') return response(200, SESSION);
    if (url.pathname === '/auth/v1/token' && url.searchParams.get('grant_type') === 'refresh_token') return response(200, { ...SESSION, access_token: 'mock-refreshed-access', refresh_token: 'mock-refreshed-refresh' });
    if (url.pathname === '/auth/v1/user') {
      if (init.headers.Authorization === 'Bearer mock-stale-access') return response(401, { error_code: 'bad_jwt' });
      return response(200, USER);
    }
    if (url.pathname === '/rest/v1/rpc/consume_rate_limit') return response(200, [{ allowed: true, used: 1, retry_after: 60 }]);
    if (url.pathname === '/rest/v1/accounts' && String(init.method || 'GET').toUpperCase() === 'GET') return response(200, [ACCOUNT]);
    // Any unplanned write is a regression, including the unreachable legacy
    // home-made magic-link token/account implementation.
    unexpected.push(url.pathname + ' ' + (init.method || 'GET'));
    throw new Error('Unexpected database/network operation');
  }
  const common = {
    Buffer, URL, URLSearchParams, TextEncoder, AbortController,
    process: { env, nextTick: process.nextTick.bind(process) }, fetch: mockFetch,
    console: Object.fromEntries(['log', 'warn', 'error'].map(name => [name, (...args) => logs.push(args.join(' '))])),
    setTimeout: () => ({ unref() {} }), clearTimeout() {},
  };
  function load(filename, security) {
    const module = { exports: {} };
    const context = vm.createContext({ ...common, module, exports: module.exports,
      require(name) {
        if (name === 'crypto') return crypto;
        if (name === './security' && security) return security;
        if (name === 'https') return { request() { unexpected.push('https.request'); throw new Error('Unexpected HTTPS request'); } };
        throw new Error('Unexpected module dependency: ' + name);
      },
    });
    vm.runInContext(fs.readFileSync(path.join(ROOT, filename), 'utf8'), context, { filename });
    return module.exports;
  }
  const security = load('api/security.js');
  const handler = load('api/index.js', security);
  async function call({ method = 'POST', url = '/api/auth/magic-link', headers = {}, body = { email: EMAIL } } = {}) {
    const req = new EventEmitter();
    req.method = method; req.url = url;
    req.headers = { origin: ORIGIN, 'content-type': 'application/json', ...headers };
    req.socket = { remoteAddress: '127.0.0.1' }; req.destroy = () => {};
    const res = new EventEmitter();
    res.statusCode = 200; res.headers = {}; res.body = ''; res.headersSent = false; res.writableEnded = false;
    res.setHeader = (name, value) => { res.headers[name.toLowerCase()] = value; };
    res.getHeader = name => res.headers[name.toLowerCase()];
    res.status = code => { res.statusCode = code; return res; };
    res.end = value => { if (value) res.body += String(value); res.headersSent = res.writableEnded = true; res.emit('finish'); return res; };
    res.json = value => { res.setHeader('Content-Type', 'application/json'); return res.end(JSON.stringify(value)); };
    const pending = handler(req, res);
    process.nextTick(() => { if (method !== 'GET' && body !== null) req.emit('data', Buffer.from(JSON.stringify(body))); req.emit('end'); });
    await pending;
    assert.deepEqual(unexpected, [], 'all email, auth and database operations must be explicitly mocked');
    return res;
  }
  return { call, calls, logs, names: security.COOKIE_NAMES };
}

function cookies(res) { return Array.from(res.headers['set-cookie'] || []); }
function cookieValue(res, name) {
  const values = cookies(res).filter(item => item.startsWith(name + '='));
  return values.length ? decodeURIComponent(values[values.length - 1].split(';')[0].slice(name.length + 1)) : '';
}
function uniformSuccess(res) {
  assert.equal(res.statusCode, 200);
  assert.deepEqual(JSON.parse(res.body), { ok: true });
  assert.doesNotMatch(res.body, /token|secret|verify|https?:|mock-hashed/i);
  assert.match(res.headers['cache-control'], /no-store/);
}
function assertOtpPkce(h, res) {
  const otp = h.calls.find(call => call.url.pathname === '/auth/v1/otp');
  assert.ok(otp, 'Supabase email fallback must be requested');
  assert.equal(otp.body.email, EMAIL);
  assert.equal(otp.body.create_user, false);
  assert.equal(otp.body.code_challenge_method, 's256');
  const verifier = cookieValue(res, h.names.pkce);
  assert.ok(verifier.length >= 43, 'PKCE verifier must be stored for callback');
  assert.equal(otp.body.code_challenge, crypto.createHash('sha256').update(verifier).digest('base64url'));
  const pkceCookie = cookies(res).find(value => value.startsWith(h.names.pkce + '='));
  assert.match(pkceCookie, /HttpOnly/); assert.match(pkceCookie, /Secure/); assert.match(pkceCookie, /SameSite=Lax/);
  const redirect = new URL(otp.url.searchParams.get('redirect_to'));
  assert.equal(redirect.origin, ORIGIN);
  assert.equal(redirect.pathname, '/api/auth/callback');
  assert.equal(redirect.searchParams.get('next'), '/learn.html');
  return verifier;
}

test('missing Resend key falls back to PKCE Supabase OTP with a uniform private response', { timeout: 5_000 }, async () => {
  const h = harness({ resendKey: false }); const res = await h.call();
  uniformSuccess(res); assertOtpPkce(h, res);
  assert.equal(h.calls.some(call => call.url.hostname === 'api.resend.com'), false);
});

test('Resend 403 falls back exactly once to PKCE Supabase OTP', { timeout: 5_000 }, async () => {
  const h = harness({ resendStatus: 403 }); const res = await h.call();
  uniformSuccess(res); assertOtpPkce(h, res);
  assert.equal(h.calls.filter(call => call.url.pathname === '/auth/v1/otp').length, 1);
  assert.equal(h.calls.filter(call => call.url.hostname === 'api.resend.com').length, 1);
});

test('primary generation or mail transport failure falls back, while total provider failure remains uniform', { timeout: 5_000 }, async t => {
  for (const options of [{ generateFailure: true }, { resendThrows: true }, { resendKey: false, otpFailure: true }]) {
    await t.test(JSON.stringify(options), async () => {
      const h = harness(options); const res = await h.call();
      uniformSuccess(res); assertOtpPkce(h, res);
      assert.equal(h.calls.filter(call => call.url.pathname === '/auth/v1/otp').length, 1);
    });
  }
});

test('custom Resend success sends only a hashed-token callback link and never exposes it in the HTTP response', { timeout: 5_000 }, async t => {
  for (const nestedHash of [false, true]) {
    await t.test('nested hash: ' + nestedHash, async () => {
      const h = harness({ nestedHash }); const res = await h.call({ body: { email: '  STUDENT@example.test  ' } });
      uniformSuccess(res);
      assert.equal(h.calls.some(call => call.url.pathname === '/auth/v1/otp'), false);
      assert.equal(cookieValue(res, h.names.pkce), '');
      const generate = h.calls.find(call => call.url.pathname === '/auth/v1/admin/generate_link');
      assert.equal(generate.init.headers.apikey, 'mock-secret-key');
      assert.equal(generate.body.type, 'magiclink'); assert.equal(generate.body.email, EMAIL);
      const mail = h.calls.find(call => call.url.hostname === 'api.resend.com');
      assert.deepEqual(mail.body.to, [EMAIL]);
      const link = new URL(mail.body.html.match(/href="([^"]+)"/)[1]);
      assert.equal(link.origin, ORIGIN); assert.equal(link.pathname, '/api/auth/callback');
      assert.equal(link.searchParams.get('token_hash'), 'mock-hashed-token');
      assert.equal(link.searchParams.get('type'), 'magiclink'); assert.equal(link.searchParams.get('next'), '/learn.html');
      assert.equal(link.hash, '');
      assert.doesNotMatch(mail.body.html, /mock-secret-key|mock-access-token|mock-refresh-token/);
    });
  }
});

test('PKCE callback exchanges the exact fallback verifier and returns HttpOnly session cookies plus learn redirect', { timeout: 5_000 }, async () => {
  const h = harness({ resendKey: false }); const issued = await h.call();
  const verifier = assertOtpPkce(h, issued);
  const callback = await h.call({ method: 'GET', url: '/api/auth/callback?code=mock-auth-code&next=%2Flearn.html', headers: { cookie: h.names.pkce + '=' + encodeURIComponent(verifier) }, body: null });
  const exchange = h.calls.find(call => call.url.searchParams.get('grant_type') === 'pkce');
  assert.deepEqual(exchange.body, { auth_code: 'mock-auth-code', code_verifier: verifier });
  assert.equal(exchange.init.headers.apikey, 'mock-public-key');
  assert.equal(callback.statusCode, 302); assert.equal(callback.headers.location, '/learn.html');
  assert.equal(callback.body, ''); assert.equal(cookieValue(callback, h.names.access), SESSION.access_token);
  assert.equal(cookieValue(callback, h.names.refresh), SESSION.refresh_token);
  assert.match(cookies(callback).find(value => value.startsWith(h.names.access + '=')), /HttpOnly; Secure/);
  assert.match(cookies(callback).find(value => value.startsWith(h.names.pkce + '=')), /Max-Age=0/);
});

test('hashed-token callback verifies the server hash and establishes a session without a PKCE verifier', { timeout: 5_000 }, async () => {
  const h = harness();
  const callback = await h.call({ method: 'GET', url: '/api/auth/callback?token_hash=mock-hashed-token&type=magiclink&next=%2Flearn.html', body: null });
  const verify = h.calls.find(call => call.url.pathname === '/auth/v1/verify');
  assert.deepEqual(verify.body, { token_hash: 'mock-hashed-token', type: 'magiclink' });
  assert.equal(callback.statusCode, 302); assert.equal(callback.headers.location, '/learn.html');
  assert.equal(callback.body, ''); assert.equal(cookieValue(callback, h.names.access), SESSION.access_token);
});

test('PKCE callback without its verifier fails before token exchange and does not issue a session', { timeout: 5_000 }, async () => {
  const h = harness(); const callback = await h.call({ method: 'GET', url: '/api/auth/callback?code=mock-auth-code&next=%2Flearn.html', body: null });
  assert.equal(callback.statusCode, 400); assert.equal(JSON.parse(callback.body).error, 'missing_pkce_verifier');
  assert.equal(h.calls.some(call => call.url.pathname === '/auth/v1/token'), false);
  assert.equal(cookieValue(callback, h.names.access), '');
});

test('refreshing a stale session returns the newly issued CSRF cookie rather than the stale incoming token', { timeout: 5_000 }, async () => {
  const h = harness();
  const res = await h.call({ method: 'GET', url: '/api/auth/session', body: null, headers: { cookie: h.names.access + '=mock-stale-access; ' + h.names.refresh + '=mock-old-refresh; ' + h.names.csrf + '=mock-stale-csrf' } });
  assert.equal(res.statusCode, 200);
  const data = JSON.parse(res.body);
  assert.equal(data.user.id, ACCOUNT.id); assert.equal(data.user.role, 'student');
  assert.equal(data.csrfToken, cookieValue(res, h.names.csrf));
  assert.notEqual(data.csrfToken, 'mock-stale-csrf'); assert.ok(data.csrfToken.length >= 32);
  assert.equal(cookieValue(res, h.names.access), 'mock-refreshed-access');
  assert.equal(cookieValue(res, h.names.refresh), 'mock-refreshed-refresh');
  const refresh = h.calls.find(call => call.url.searchParams.get('grant_type') === 'refresh_token');
  assert.deepEqual(refresh.body, { refresh_token: 'mock-old-refresh' });
  assert.doesNotMatch(res.body, /mock-refreshed-access|mock-refreshed-refresh|mock-secret-key/);
});
