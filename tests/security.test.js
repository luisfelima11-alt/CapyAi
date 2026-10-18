'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
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
  const sql = fs.readFileSync(path.join(ROOT, 'supabase', 'migrations', '202610180001_licao_de_casa.sql'), 'utf8');
  assert.match(sql, /alter table public\.homework_submissions enable row level security;/);
  assert.match(sql, /revoke all on public\.homework_submissions from anon, authenticated;/);
  assert.doesNotMatch(sql, /grant [^;]* to [^;]*\banon\b/);
  assert.doesNotMatch(sql, /grant (update|delete|all)[^;]*homework_submissions/i);
  assert.match(sql, /for select to authenticated\s+using \(user_id = public\.current_account_id\(\)\)/);
  assert.match(sql, /for insert to authenticated\s+with check \(\s+user_id = public\.current_account_id\(\)/);
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
