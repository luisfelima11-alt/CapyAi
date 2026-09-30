'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { execFileSync } = require('node:child_process');
const { EventEmitter } = require('node:events');

const ROOT = path.resolve(__dirname, '..');
const Security = require('../api/security');
const apiHandler = require('../api/index');

function mockResponse() {
  const res = new EventEmitter();
  res.statusCode = 200;
  res.headers = {};
  res.body = '';
  res.headersSent = false;
  res.writableEnded = false;
  res.setHeader = (key, value) => { res.headers[String(key).toLowerCase()] = value; };
  res.getHeader = key => res.headers[String(key).toLowerCase()];
  res.status = code => { res.statusCode = code; return res; };
  res.json = value => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(value)); return res; };
  res.end = value => {
    if (value) res.body += Buffer.isBuffer(value) ? value.toString('utf8') : String(value);
    res.headersSent = true;
    res.writableEnded = true;
    res.emit('finish');
    return res;
  };
  return res;
}

async function callApi({ method = 'GET', url = '/', headers = {}, body = '' }) {
  const req = new EventEmitter();
  req.method = method;
  req.url = url;
  req.headers = headers;
  req.socket = { remoteAddress: '127.0.0.1' };
  req.destroy = () => {};
  const res = mockResponse();
  const pending = apiHandler(req, res);
  process.nextTick(() => {
    if (body) req.emit('data', Buffer.from(body));
    req.emit('end');
  });
  await pending;
  return res;
}

test('constant-time comparison and cookie parsing reject malformed values safely', () => {
  assert.equal(Security.safeEqual('same', 'same'), true);
  assert.equal(Security.safeEqual('same', 'different'), false);
  assert.deepEqual(Security.parseCookies({ headers: { cookie: 'a=1; encoded=hello%20world' } }), { a: '1', encoded: 'hello world' });
});

test('legacy account dump is retired and arbitrary userId cannot read private state', async () => {
  const accounts = await callApi({ url: '/api/db/accounts' });
  assert.equal(accounts.statusCode, 410);
  const magicLink = await callApi({
    method: 'POST', url: '/api/auth/magic-link',
    headers: { origin: 'https://www.capyenglish.com.br', 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'student@example.com' }),
  });
  // Passwordless sign-in was restored using Supabase Auth. Its uniform reply
  // must never disclose a token, a sign-in URL, or whether the account exists.
  assert.equal(magicLink.statusCode, 200);
  assert.deepEqual(JSON.parse(magicLink.body), { ok: true });
  const state = await callApi({ url: '/api/db?type=state&userId=victim' });
  assert.equal(state.statusCode, 401);
  assert.doesNotMatch(state.body, /victim|password/i);
});

test('oversized JSON is rejected before authentication work', async () => {
  const body = JSON.stringify({ email: 'a@example.com', password: 'x'.repeat(300 * 1024) });
  const response = await callApi({
    method: 'POST', url: '/api/auth/login',
    headers: { origin: 'https://www.capyenglish.com.br', 'content-type': 'application/json' }, body,
  });
  assert.equal(response.statusCode, 413);
});

test('signed guest mutations reject a missing CSRF token', async () => {
  const origin = 'https://www.capyenglish.com.br';
  const guest = await callApi({
    method: 'POST', url: '/api/auth/guest',
    headers: { origin, 'content-type': 'application/json' }, body: '{}',
  });
  assert.equal(guest.statusCode, 201);
  const cookies = (Array.isArray(guest.headers['set-cookie']) ? guest.headers['set-cookie'] : [guest.headers['set-cookie']])
    .filter(Boolean).map(value => value.split(';')[0]).join('; ');
  const restored = await callApi({ url: '/api/auth/session', headers: { cookie: cookies } });
  assert.equal(restored.statusCode, 200);
  assert.equal(JSON.parse(restored.body).user.role, 'guest');
  assert.equal(JSON.parse(restored.body).user.id, JSON.parse(guest.body).user.id);
  const privateState = await callApi({ url: '/api/db?type=state', headers: { cookie: cookies } });
  assert.equal(privateState.statusCode, 401);
  const chat = await callApi({
    method: 'POST', url: '/api/chat',
    headers: { origin, cookie: cookies, 'content-type': 'application/json' },
    body: JSON.stringify({ message: 'hello', history: [], userId: 'victim' }),
  });
  assert.equal(chat.statusCode, 403);
  assert.match(chat.body, /invalid_csrf/);
});

test('deployment config exposes only the JSON allowlist and sends defensive headers', () => {
  const config = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));
  assert.equal(config.builds.some(build => build.src === '*.json'), false);
  assert.equal(config.builds.some(build => build.src === 'manifest.json'), true);
  const headers = config.headers.flatMap(group => group.headers || []);
  for (const name of ['Strict-Transport-Security', 'Content-Security-Policy', 'X-Content-Type-Options', 'Permissions-Policy']) {
    assert.equal(headers.some(header => header.key === name), true, `${name} is missing`);
  }
  const strictPages = config.headers.find(group => String(group.source).includes('4_Login_Capy_Yara_Welcomes_You'));
  const strictCsp = strictPages?.headers?.find(header => header.key === 'Content-Security-Policy')?.value || '';
  assert.match(strictCsp, /script-src 'self';/);
  assert.match(strictCsp, /script-src-attr 'none'/);
  assert.doesNotMatch(strictCsp, /script-src[^;]*unsafe-inline/);
});

test('security-sensitive source does not restore wildcard CORS, shared admin keys, or public prompt override', () => {
  const api = fs.readFileSync(path.join(ROOT, 'api', 'index.js'), 'utf8');
  const admin = fs.readFileSync(path.join(ROOT, 'admin.html'), 'utf8');
  const adminScript = fs.readFileSync(path.join(ROOT, 'assets', 'js', 'pages', 'admin-1.js'), 'utf8');
  assert.doesNotMatch(api, /Access-Control-Allow-Origin['"],\s*['"]\*['"]/);
  assert.doesNotMatch(api, /const\s*\{[^}]*systemOverride/);
  assert.doesNotMatch(admin, /ADMIN_KEY|capyAdminKey|Authorization['"]:\s*['"]Bearer/);
  assert.match(adminScript, /function escapeHtml\(/);
  // O admin novo monta a tela só por textContent: nome de aluno, fato da
  // memória e anotação nunca viram HTML.
  const adminNovo = fs.readFileSync(path.join(ROOT, 'assets', 'js', 'pages', 'admin-v2.js'), 'utf8');
  assert.doesNotMatch(adminNovo, /innerHTML|outerHTML|insertAdjacentHTML/);
});

test('sensitive pages use local scripts and contain no executable inline handlers', () => {
  const pages = [
    '4_Login_Capy_Yara_Welcomes_You.html', 'set-password.html', 'account.html',
    'admin.html', 'admin-antigo.html', 'admin-metrics.html', 'teacher_homework.html',
  ];
  for (const page of pages) {
    const source = fs.readFileSync(path.join(ROOT, page), 'utf8');
    assert.doesNotMatch(source, /<script\b(?![^>]*\bsrc=)[^>]*>[\s\S]*?<\/script>/i, `${page} has an inline script`);
    assert.doesNotMatch(source, /\son(?:click|change|submit|input|load)=/i, `${page} has an inline event`);
    assert.doesNotMatch(source, /cdn\.tailwindcss\.com|cdn\.jsdelivr\.net/i, `${page} loads an executable CDN`);
  }
});

test('local server blocks traversal and private files', async t => {
  const devHandler = require('../scripts/dev-server');
  const server = http.createServer(devHandler);
  await new Promise((resolve, reject) => server.listen(0, '127.0.0.1', resolve).once('error', reject));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const { port } = server.address();
  for (const target of ['/database.json', '/.env', '/auth.js', '/%2e%2e/.env']) {
    const response = await fetch(`http://127.0.0.1:${port}${target}`);
    assert.equal(response.status, 404, target);
  }
});

// IS_PRODUCTION, the cookie names and the Preview origins are read when the API
// loads, so a test that needs another environment runs the handler in a child
// process. `corpo` calls chamar(method, url, headers, body) and prints one JSON line.
function rodarApiEm(env, corpo) {
  const script = `
    const { EventEmitter } = require('events');
    const api = require('./api/index');
    function res() {
      const r = new EventEmitter(); r.statusCode = 200; r.headers = {}; r.body = ''; r.headersSent = false;
      r.setHeader = (k, v) => { r.headers[String(k).toLowerCase()] = v; }; r.getHeader = k => r.headers[String(k).toLowerCase()];
      r.status = c => { r.statusCode = c; return r; };
      r.json = v => { r.setHeader('Content-Type', 'application/json'); return r.end(JSON.stringify(v)); };
      r.end = v => { if (v) r.body += String(v); r.headersSent = true; r.emit('finish'); return r; };
      return r;
    }
    async function chamar(method, url, headers, body) {
      const req = new EventEmitter(); req.method = method; req.url = url; req.headers = headers;
      req.socket = { remoteAddress: '127.0.0.1' }; req.destroy = () => {};
      const r = res(); const p = api(req, r);
      process.nextTick(() => { if (body) req.emit('data', Buffer.from(body)); req.emit('end'); });
      await p; let erro = ''; try { erro = JSON.parse(r.body).error || ''; } catch (e) {}
      return { status: r.statusCode, erro };
    }
    ${corpo}
  `;
  const saida = execFileSync(process.execPath, ['-e', script], { cwd: ROOT, env, encoding: 'utf8' });
  return JSON.parse(saida.trim().split('\n').pop());
}
const SEM_CHAVES = { OPENAI_API_KEY: '', OPENROUTER_API_KEY: '', SUPABASE_URL: '', SUPABASE_SECRET_KEY: '', SUPABASE_KEY: '' };

test('in production, reads from our own pages pass the AI gate with cookies; other sites and unsigned writes do not', () => {
  // Production refuses a missing Origin, and a same-origin fetch GET sends none.
  // The gate used assertCsrf for every AI route, so every signed-in student and
  // guest got 403 on the Music Lab search, lyrics, TTS and daily challenge (28/set).
  const saida = rodarApiEm({ ...process.env, NODE_ENV: 'production', ...SEM_CHAVES }, `
    (async () => {
      const guest = '__Host-capy-guest=qualquer';
      console.log(JSON.stringify({
        mesmoSite: await chamar('GET', '/api/daily-challenge', { cookie: guest, 'sec-fetch-site': 'same-origin' }),
        outroSite: await chamar('GET', '/api/daily-challenge', { cookie: guest, 'sec-fetch-site': 'cross-site' }),
        escritaSemCsrf: await chamar('POST', '/api/chat', { cookie: guest, origin: 'https://www.capyenglish.com.br', 'content-type': 'application/json' }, '{"message":"hi"}'),
      }));
    })();
  `);
  assert.notEqual(saida.mesmoSite.status, 403, JSON.stringify(saida.mesmoSite));
  assert.equal(saida.mesmoSite.status, 503);          // got past the gate: only the missing AI key stops it
  assert.equal(saida.outroSite.status, 403);
  assert.equal(saida.outroSite.erro, 'invalid_origin');
  assert.equal(saida.escritaSemCsrf.status, 403);
  assert.equal(saida.escritaSemCsrf.erro, 'invalid_csrf');
});

test('a Vercel Preview accepts sign-in from its own URLs; production still accepts only APP_ORIGIN', () => {
  // A Preview runs in production mode from *.vercel.app. With APP_ORIGIN alone,
  // login and "Entrar como visitante" got 403 invalid_origin there, so no PR
  // could be tested signed in before going live (28/set).
  const env = {
    ...process.env, ...SEM_CHAVES, VERCEL: '1', SESSION_COOKIE_SECRET: 'x'.repeat(40),
    VERCEL_URL: 'capy-abc123-time.vercel.app', VERCEL_BRANCH_URL: 'capy-git-minha-branch-time.vercel.app',
  };
  delete env.APP_ORIGIN;
  const corpo = `
    (async () => {
      const visitante = async origin => (await chamar('POST', '/api/auth/guest', { origin, 'content-type': 'application/json' }, '{}')).status;
      console.log(JSON.stringify({
        deploy: await visitante('https://capy-abc123-time.vercel.app'),
        branch: await visitante('https://capy-git-minha-branch-time.vercel.app/'),
        outroPreview: await visitante('https://capy-git-outra-branch-time.vercel.app'),
        site: await visitante('https://www.capyenglish.com.br'),
      }));
    })();
  `;
  assert.deepEqual(rodarApiEm({ ...env, VERCEL_ENV: 'preview' }, corpo), { deploy: 201, branch: 201, outroPreview: 403, site: 201 });
  assert.deepEqual(rodarApiEm({ ...env, VERCEL_ENV: 'production' }, corpo), { deploy: 403, branch: 403, outroPreview: 403, site: 201 });
});

test('a silent session refresh keeps the tab\'s CSRF token, so the next POST still passes', () => {
  // Access tokens last about an hour; the next request renews them in
  // getAuthenticatedSession. setSessionCookies issued a NEW CSRF cookie there,
  // while the page had read its token once, at load: every later POST from that
  // tab got 403 invalid_csrf until a reload (the mic in lessons.html, 29/set).
  const saida = execFileSync(process.execPath, ['-e', `
    global.fetch = async url => {
      const r = (status, obj) => ({ ok: status < 400, status, text: async () => JSON.stringify(obj) });
      if (String(url).endsWith('/auth/v1/user')) return r(401, { msg: 'JWT expired' });
      if (String(url).includes('grant_type=refresh_token')) {
        return r(200, { access_token: 'a2', refresh_token: 'r2', expires_in: 3600, user: { id: 'u1' } });
      }
      return r(404, {});
    };
    const S = require('./api/security');
    const C = S.COOKIE_NAMES;
    const resposta = () => ({ h: {}, setHeader(k, v) { this.h[k.toLowerCase()] = v; }, getHeader(k) { return this.h[k.toLowerCase()]; } });
    const tokenDaAba = 'A'.repeat(43);
    (async () => {
      // "Ouvir exemplo": a GET with the expired access cookie renews the session.
      const res = resposta();
      await S.getAuthenticatedSession({ headers: { cookie: C.refresh + '=r1; ' + C.csrf + '=' + tokenDaAba } }, res);
      const novo = [].concat(res.getHeader('set-cookie') || []).find(c => c.startsWith(C.csrf + '='));
      const cookieCsrf = novo ? novo.split(';')[0].slice(C.csrf.length + 1) : null;
      // The mic: a POST with the tab's token and the cookie the browser now holds.
      let post = 'passa';
      try {
        S.assertCsrf({ headers: { origin: 'https://www.capyenglish.com.br', 'x-csrf-token': tokenDaAba,
          cookie: C.access + '=a2; ' + C.csrf + '=' + cookieCsrf } });
      } catch (e) { post = e.code; }
      const noLogin = S.setSessionCookies(resposta(), { access_token: 'a3', refresh_token: 'r3', expires_in: 3600 });
      console.log(JSON.stringify({ cookieCsrf, post, loginTrocou: noLogin !== tokenDaAba && /^[A-Za-z0-9_-]{43}$/.test(noLogin) }));
    })();
  `], {
    cwd: ROOT, encoding: 'utf8',
    env: { ...process.env, ...SEM_CHAVES, NODE_ENV: 'production', APP_ORIGIN: 'https://www.capyenglish.com.br',
      SUPABASE_URL: 'https://supabase.invalid', SUPABASE_PUBLISHABLE_KEY: 'pk' },
  });
  const r = JSON.parse(saida.trim().split('\n').pop());
  assert.equal(r.cookieCsrf, 'A'.repeat(43), 'the renewal must keep the CSRF token the tab holds');
  assert.equal(r.post, 'passa');
  assert.equal(r.loginTrocou, true, 'a new session (login) still gets a new token');
});
