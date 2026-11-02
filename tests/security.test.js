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
    'professor.html', 'turma.html',
  ];
  for (const page of pages) {
    const source = fs.readFileSync(path.join(ROOT, page), 'utf8');
    assert.doesNotMatch(source, /<script\b(?![^>]*\bsrc=)[^>]*>[\s\S]*?<\/script>/i, `${page} has an inline script`);
    assert.doesNotMatch(source, /\son(?:click|change|submit|input|load)=/i, `${page} has an inline event`);
    assert.doesNotMatch(source, /cdn\.tailwindcss\.com|cdn\.jsdelivr\.net/i, `${page} loads an executable CDN`);
  }
});

test('the prebuilt CSS of the hardened pages covers every file that renders on them, and is up to date', t => {
  // As páginas da CSP estrita não carregam o Tailwind do CDN: usam o
  // security-pages.css, gerado só a partir dos arquivos do `content`. Em 15/10
  // a "Minha Conta" abriu com a Capy de 324 px e o menu do usuário sempre
  // aberto, porque a barra de cima (components.js) não estava na lista.
  const config = require('../tailwind.security.config.js');
  const content = new Set(config.content.map(entry => entry.replace(/^\.\//, '')));
  const pages = fs.readdirSync(ROOT).filter(name => name.endsWith('.html'))
    .filter(name => /assets\/css\/security-pages\.css/.test(fs.readFileSync(path.join(ROOT, name), 'utf8')));
  assert.ok(pages.includes('account.html'), 'account.html should use the prebuilt CSS');
  for (const page of pages) {
    assert.ok(content.has(page), `${page} uses security-pages.css but is not in tailwind.security.config.js`);
    const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
    const scripts = [...html.matchAll(/<script\b[^>]*\bsrc="([^"?#]+)/gi)].map(match => match[1])
      .filter(src => !/^(https?:)?\/\//.test(src) && !src.includes('/'));
    for (const script of scripts) {
      assert.ok(content.has(script), `${page} loads ${script}, which is not in tailwind.security.config.js`);
    }
  }
  const cli = path.join(ROOT, 'node_modules', '.bin', 'tailwindcss');
  if (!fs.existsSync(cli)) return t.skip('tailwindcss is not installed');
  const fresh = path.join(require('node:os').tmpdir(), `security-pages-${process.pid}.css`);
  require('node:child_process').execFileSync(cli, [
    '-c', 'tailwind.security.config.js', '-i', 'assets/css/security-pages.input.css', '-o', fresh, '--minify',
  ], { cwd: ROOT, stdio: 'ignore' });
  const committed = fs.readFileSync(path.join(ROOT, 'assets', 'css', 'security-pages.css'), 'utf8');
  const rebuilt = fs.readFileSync(fresh, 'utf8');
  fs.rmSync(fresh, { force: true });
  assert.equal(committed, rebuilt, 'assets/css/security-pages.css is stale: run the tailwindcss step of npm run build:security-assets');
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

test('npm audit gate: production gets no exception; a dev-only one holds only until its date', () => {
  // 04/out: a high advisory for braces (no fixed release) reached us only through
  // tailwindcss 3, a dev tool, and failed every CI run. scripts/audit.js keeps
  // npm audit at high, with dated exceptions for what only the dev tools reach.
  const { avaliar } = require('../scripts/audit.js')._internos;
  const relatorio = (...avisos) => ({ vulnerabilities: Object.fromEntries(avisos.map(([pacote, id, gravidade = 'high'], i) =>
    [`${pacote}${i}`, { via: [{ name: pacote, title: `${pacote} issue`, url: `https://github.com/advisories/${id}`, severity: gravidade }, 'quem-usa'] }])) });
  const nada = relatorio();
  const excecoes = [{ id: 'GHSA-aaaa', pacote: 'braces', ate: '2026-12-31', motivo: 'dev only' }];
  const motivos = (completo, producao, hoje) => avaliar(completo, producao, hoje, excecoes).map(f => f.porque);

  assert.deepEqual(motivos(relatorio(['braces', 'GHSA-aaaa']), nada, '2026-10-04'), []);
  assert.deepEqual(motivos(relatorio(['braces', 'GHSA-aaaa']), relatorio(['braces', 'GHSA-aaaa']), '2026-10-04'),
    ['it reaches the production dependencies']);
  assert.deepEqual(motivos(relatorio(['braces', 'GHSA-aaaa']), nada, '2027-01-01'), ['the exception ended on 2026-12-31']);
  assert.deepEqual(motivos(relatorio(['outro', 'GHSA-aaaa']), nada, '2026-10-04'), ['no exception'], 'the exception names one package');
  assert.deepEqual(motivos(relatorio(['x', 'GHSA-bbbb', 'critical']), nada, '2026-10-04'), ['no exception']);
  assert.deepEqual(motivos(relatorio(['x', 'GHSA-cccc', 'moderate']), nada, '2026-10-04'), []);
  // An audit that could not run (registry down) fails instead of passing empty.
  assert.deepEqual(motivos({ error: { summary: 'registry unreachable' } }, nada, '2026-10-04'), ['registry unreachable']);
  assert.equal(avaliar(nada, undefined, '2026-10-04', excecoes).length, 1);
});

test('the CI and npm run security:check run the audit gate; every exception has a package, a date and a reason', () => {
  const { EXCECOES } = require('../scripts/audit.js')._internos;
  const workflow = fs.readFileSync(path.join(ROOT, '.github/workflows/security.yml'), 'utf8');
  assert.match(workflow, /- run: node scripts\/audit\.js\n/);
  assert.doesNotMatch(workflow, /npm audit/);
  assert.match(require('../package.json').scripts['security:check'], /^node scripts\/audit\.js && /);
  for (const ex of EXCECOES) {
    assert.match(ex.id, /^GHSA(-[0-9a-z]{4}){3}$/);
    assert.ok(ex.pacote && ex.motivo.length > 40, ex.id);
    assert.match(ex.ate, /^\d{4}-\d{2}-\d{2}$/, ex.id);
  }
});

test('homework: every lesson with a Homework tab reaches the teacher through the components.js hook', () => {
  // 18/out: only aula_32 sent its homework, to a table that did not exist. Now
  // components.js (autoEnviarLicaoDeCasa) sends it from every lesson, and only
  // after the lesson accepts it: its submit…() button disables itself.
  const paginas = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));
  let comLicao = 0;
  for (const pagina of paginas) {
    const source = fs.readFileSync(path.join(ROOT, pagina), 'utf8');
    assert.doesNotMatch(source, /saveHomework\(|fetch\(\s*['"`]\/api\/homework/, `${pagina} sends homework on its own`);
    const inicio = source.indexOf('id="tab-homework"');
    if (inicio < 0) continue;
    comLicao++;
    assert.match(pagina.replace(/\.html$/, ''), /^[a-z0-9_-]{1,64}$/, `${pagina}: its name is the lesson_id the table accepts`);
    assert.match(source, /<script[^>]+src="components\.js/, `${pagina} does not load components.js`);
    const botao = source.slice(inicio).match(/onclick="(submit\w*)\(/);
    assert.ok(botao, `${pagina} has no submit…() button in the Homework tab`);
    const corpo = source.slice(source.search(new RegExp(`function\\s+${botao[1]}\\s*\\(`)));
    assert.match(corpo.slice(0, 3000), /disabled\s*=\s*true/, `${pagina}: ${botao[1]} never disables the button, so nothing is sent`);
  }
  assert.ok(comLicao >= 150, `only ${comLicao} lessons with a Homework tab`);

  const components = fs.readFileSync(path.join(ROOT, 'components.js'), 'utf8');
  const gancho = components.slice(components.indexOf('autoEnviarLicaoDeCasa() {'), components.indexOf('autoInjectWritingCoach() {'));
  assert.match(gancho, /fetch\('\/api\/homework'/);
  assert.match(gancho, /if \(enviada \|\| !btn\.disabled\) return;/);
  assert.doesNotMatch(gancho, /innerHTML|outerHTML|insertAdjacentHTML/);
  assert.match(components, /Components\.autoEnviarLicaoDeCasa\(\);/);
  assert.doesNotMatch(fs.readFileSync(path.join(ROOT, 'lesson-engine.js'), 'utf8'), /saveHomework|\/api\/homework/);
});

test('homework: the table keeps each student to their own rows and the teacher panel escapes what students wrote', () => {
  const sql = fs.readFileSync(path.join(ROOT, 'supabase', 'migrations', '202611010003_licao_de_casa.sql'), 'utf8');
  assert.match(sql, /alter table public\.homework_submissions enable row level security;/);
  assert.match(sql, /revoke all on public\.homework_submissions from anon, authenticated;/);
  assert.doesNotMatch(sql, /grant [^;]* to [^;]*\banon\b/);
  assert.doesNotMatch(sql, /grant (update|delete|all)[^;]*homework_submissions/i);
  assert.match(sql, /for select to authenticated\s+using \(user_id = private\.current_account_id\(\)\)/);
  assert.match(sql, /for insert to authenticated\s+with check \(\s+user_id = private\.current_account_id\(\)/);
  assert.match(sql, /xp_earned between 0 and 500/);

  const api = fs.readFileSync(path.join(ROOT, 'api', 'index.js'), 'utf8');
  const rota = api.slice(api.indexOf("url === '/api/homework'"), api.indexOf('// ── Admin stats'));
  assert.match(rota, /user_id:\s+identity\.appUserId,/, 'the student comes from the session, never from the body');
  assert.match(rota, /\/\^\[a-z0-9_-\]\{1,64\}\$\/\.test\(licao\)/);
  assert.match(rota, /if \(!Array\.isArray\(rows\)\)/, 'a database error is not an empty list');

  const painel = fs.readFileSync(path.join(ROOT, 'assets', 'js', 'pages', 'teacher_homework-1.js'), 'utf8');
  for (const [, expr] of painel.matchAll(/\$\{([^{}]*)\}/g)) {
    if (/\b(s|e)\.|^\s*[kv]\s*$/.test(expr)) assert.match(expr.trim(), /^(escHtml|Number)\(/, `teacher panel: \${${expr}} is not escaped`);
  }
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

test('Google Analytics: only the compatibility CSP allows Google, and only public pages load analytics.js', () => {
  // The hardened pages (login, account, admin, teacher) never load Google; every other page
  // loads analytics.js, which asks for consent before anything from Google is fetched.
  const config = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));
  const strict = config.headers.find(group => String(group.source).includes('4_Login_Capy_Yara_Welcomes_You'));
  const strictCsp = strict.headers.find(header => header.key === 'Content-Security-Policy').value;
  const compat = config.headers.find(group => group.source === '/(.*)').headers.find(header => header.key === 'Content-Security-Policy').value;
  const landing = config.routes.find(route => route.src === '^/$').headers['Content-Security-Policy'];
  assert.doesNotMatch(strictCsp, /google-analytics|googletagmanager/);
  for (const csp of [compat, landing]) {
    assert.match(csp, /script-src [^;]*https:\/\/www\.googletagmanager\.com/);
    assert.match(csp, /connect-src [^;]*https:\/\/\*\.google-analytics\.com/);
  }
  const hardened = String(strict.source).match(/\(([^)]*)\)/)[1].split('|');
  const pages = fs.readdirSync(ROOT).filter(file => file.endsWith('.html'));
  for (const page of hardened) {
    assert.doesNotMatch(fs.readFileSync(path.join(ROOT, page), 'utf8'), /analytics\.js/, `${page} is hardened and must not load analytics.js`);
  }
  const sem = pages.filter(page => !hardened.includes(page) && !['offline.html', 'voice-test.html', 'pixel_preview.html'].includes(page))
    .filter(page => !/<script src="\/?analytics\.js\?v=[^"]+" defer><\/script>/.test(fs.readFileSync(path.join(ROOT, page), 'utf8')));
  // 404.html usa /analytics.js: ela é servida em qualquer caminho, então só aceita endereço absoluto.
  assert.deepEqual(sem, [], 'public pages without analytics.js');
  const source = fs.readFileSync(path.join(ROOT, 'analytics.js'), 'utf8');
  assert.doesNotThrow(() => new Function(source));
  assert.match(source, /DOMINIOS\.includes\(location\.hostname\)/, 'analytics.js must stay off on Previews and localhost');
});

test('the Super voice minutes on the sales pages match the server quota', () => {
  const api = fs.readFileSync(path.join(ROOT, 'api', 'index.js'), 'utf8');
  const minutos = Number(api.match(/const VOZ_MINUTOS_MES = \{[^}]*super:\s*(\d+)/)[1]);
  assert.ok(minutos > 0);
  for (const f of ['landing.html', 'assets/js/pages/account-1.js']) {
    const texto = fs.readFileSync(path.join(ROOT, f), 'utf8');
    const citados = [...texto.matchAll(/(\d+) min(?:utos)?(?:\/| por )mês/g)].map(m => Number(m[1]));
    assert.ok(citados.length > 0, `${f} mentions the voice minutes`);
    assert.deepEqual([...new Set(citados)], [minutos], `${f} must say ${minutos} min/mês`);
  }
});

test('every page in the sitemap has its own search description, without the forbidden words', () => {
  const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
  const paginas = [...sitemap.matchAll(/<loc>https:\/\/www\.capyenglish\.com\.br\/([^<]*)<\/loc>/g)].map(m => m[1] || 'landing.html');
  assert.ok(paginas.length > 100);
  const vistas = new Map();
  for (const p of paginas) {
    const cabeca = fs.readFileSync(path.join(ROOT, p), 'utf8').split('</head>')[0];
    const tag = (cabeca.match(/<meta\s[^>]*name="description"[^>]*>/) || [''])[0];
    assert.ok(tag, `${p}: no meta description`);
    // Só atributos bem formados: uma aspa solta dentro do texto cortava a descrição.
    assert.match(tag.replace(/\s[\w:-]+="[^"]*"/g, ''), /^<meta\s*\/?>$/, `${p}: broken meta description`);
    const d = tag.match(/content="([^"]*)"/)[1];
    assert.ok(d.length >= 50, `${p}: description too short`);
    assert.doesNotMatch(d, /gram[aá]tic|grammar/i, `${p}: "gramática" in the description (CLAUDE.md)`);
    assert.ok(!vistas.has(d), `${p}: same description as ${vistas.get(d)}`);
    vistas.set(d, p);
  }
});

test('no page escapes & twice in its meta tags', () => {
  for (const f of fs.readdirSync(ROOT).filter(n => n.endsWith('.html'))) {
    const cabeca = fs.readFileSync(path.join(ROOT, f), 'utf8').split('</head>')[0];
    for (const tag of cabeca.match(/<meta\s[^>]*>/g) || []) assert.ok(!tag.includes('&amp;amp;'), `${f}: ${tag.slice(0, 80)}`);
  }
});

test('unknown addresses get the branded 404 page, which is not indexed', () => {
  const config = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));
  assert.deepEqual(config.routes.slice(-2), [{ handle: 'filesystem' }, { src: '/(.*)', status: 404, dest: '/404.html' }]);
  const pagina = fs.readFileSync(path.join(ROOT, '404.html'), 'utf8');
  assert.match(pagina, /<meta name="robots" content="noindex"\/>/);
  // Servida em qualquer caminho (/a/b/c): links e imagens só com caminho absoluto.
  for (const [, url] of pagina.matchAll(/(?:href|src)="([^"]*)"/g)) assert.match(url, /^(\/|https:\/\/)/, url);
});

test('the old "Grammar Lab" name is gone: the page is the Laboratório de Padrões', () => {
  for (const f of fs.readdirSync(ROOT).filter(n => n.endsWith('.html') || n.endsWith('.js'))) {
    assert.ok(!fs.readFileSync(path.join(ROOT, f), 'utf8').includes('Grammar Lab'), `${f} still says "Grammar Lab"`);
  }
  const lab = fs.readFileSync(path.join(ROOT, 'grammar_lab.html'), 'utf8');
  assert.match(lab, /<title>Laboratório de Padrões — /);
  // Os ids internos (grammarDone, grammar_star, data-filter="grammar") continuam; o aluno não os vê.
  assert.doesNotMatch(lab, /gramátic|Grammar/);
});
