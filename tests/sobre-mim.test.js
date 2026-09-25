// "Sobre mim" (24/set): o aluno edita o que a Yara sabe dele — nivel, objetivo,
// gostos e um texto livre — e a Yara usa isso para abrir as conversas com uma
// pergunta concreta em vez de "tudo bem?".
//
// Antes: o link "Refazer onboarding" da conta mandava o aluno para a home (o
// onboarding expulsava quem ja tinha feito), o teste de nivelamento guardava o
// nivel so no navegador, e o POST /api/profile regravava as seis colunas —
// salvar so o nivel apagaria os gostos.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const http = require('http');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');

function profileHarness(corpo) {
  const Security = require('../api/security');
  const source = fs.readFileSync(path.join(ROOT, 'api/index.js'), 'utf8');
  const start = source.indexOf("    if (req.method === 'POST' && url === '/api/profile') {");
  const end = source.indexOf('    // ── Passwordless sign-in link', start);
  assert.ok(start > 0 && end > start, 'a rota POST /api/profile precisa continuar existindo');
  const gravados = [];
  const res = { statusCode: 200, body: null, status(c) { this.statusCode = c; return this; }, json(b) { this.body = b; return this; } };
  const context = vm.createContext({
    req: { method: 'POST', headers: {} }, res, url: '/api/profile', JSON, String, Array, Math, Number, Boolean, Object, Date,
    assertCsrf: () => {},
    requireAppUser: async () => ({ appUserId: 'aluno-1' }),
    readBody: async () => corpo,
    sanitizeStoredJson: v => (typeof v === 'string' ? v.replace(/[<>]/g, '') : v),
    sbUser: async (identity, caminho, opcoes) => { gravados.push(JSON.parse(opcoes.body)); return []; },
  });
  vm.runInContext('async function runRoute() {\n' + source.slice(start, end) + '\n}', context);
  return { run: () => context.runRoute(), res, gravados };
}

test('POST /api/profile parcial: salvar so o nivel nao apaga os gostos', async () => {
  const h = profileHarness({ english_level: 'Intermediate' });
  await h.run();
  assert.equal(h.res.statusCode, 200);
  const linha = JSON.parse(JSON.stringify(h.gravados[0]));
  assert.deepEqual(Object.keys(linha).sort(), ['english_level', 'id', 'updated_at']);
  assert.equal(linha.english_level, 'intermediate');
  assert.equal(linha.id, 'aluno-1');
});

test('POST /api/profile so aceita nivel da lista, e corpo vazio nao grava nada', async () => {
  const lixo = profileHarness({ english_level: 'hacker"; drop' });
  await lixo.run();
  assert.equal(lixo.res.statusCode, 400);
  assert.equal(lixo.gravados.length, 0);
  const vazio = profileHarness({});
  await vazio.run();
  assert.equal(vazio.res.statusCode, 400);
  // Nivel apagado de proposito continua possivel.
  const limpa = profileHarness({ english_level: '' });
  await limpa.run();
  assert.equal(limpa.gravados[0].english_level, null);
});

test('o onboarding completo continua gravando as seis colunas', async () => {
  const h = profileHarness({
    english_level: 'beginner', goals: ['travel', 'work'], interests: ['music'],
    interests_detail: 'BTS <script>', daily_goal_minutes: 20, onboarding_complete: true,
  });
  await h.run();
  const linha = h.gravados[0];
  assert.deepEqual(Object.keys(linha).sort(), ['daily_goal_minutes', 'english_level', 'goals', 'id', 'interests', 'interests_detail', 'onboarding_complete', 'updated_at']);
  assert.equal(linha.onboarding_complete, true);
  assert.doesNotMatch(linha.interests_detail, /[<>]/);
});

function cspDe(fonte) {
  const v = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));
  const bloco = (v.headers || []).find(h => h.source === fonte || h.source.includes(fonte));
  const csp = bloco && bloco.headers.find(h => /content-security-policy/i.test(h.key));
  assert.ok(csp, 'CSP de ' + fonte + ' sumiu do vercel.json');
  return csp.value;
}

const PERFIL = {
  english_level: 'intermediate', goals: ['travel'], interests: ['sports', 'series'],
  interests_detail: 'Flamengo <img src=x onerror=alert(1)>', daily_goal_minutes: 20, onboarding_complete: true,
};

test('Sobre mim no navegador: editar sem ser expulso, cartao na conta e nivel do teste no servidor', { timeout: 180_000 }, async () => {
  const { chromium } = require('playwright');
  const server = http.createServer(require('../scripts/dev-server'));
  await new Promise((resolve, reject) => server.listen(0, '127.0.0.1', resolve).once('error', reject));
  const base = 'http://127.0.0.1:' + server.address().port;
  const cspConta = cspDe('account.html');
  const cspGeral = cspDe('/(.*)');
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    async function abrir(arquivo, perfil, width = 390) {
      const context = await browser.newContext({ viewport: { width, height: 844 }, reducedMotion: 'reduce' });
      await context.addInitScript(() => {
        localStorage.setItem('capySession', JSON.stringify({ id: 'aluno-1', name: 'Ana Clara', email: 'ana@x.com', avatar: '🐾', role: 'student' }));
      });
      const posts = [];
      const erros = [];
      await context.route('**/*', async route => {
        const req = route.request();
        const url = new URL(req.url());
        if (url.hostname === 'cdn.tailwindcss.com') return route.fulfill({ contentType: 'application/javascript', body: 'window.tailwind = window.tailwind || {};' });
        if (url.origin !== base) return route.abort();
        if (url.pathname === '/api/auth/session') return route.fulfill({ json: { user: { id: 'aluno-1', name: 'Ana Clara', email: 'ana@x.com', role: 'student' }, csrfToken: 'mock-csrf' } });
        if (url.pathname === '/api/profile' && req.method() === 'GET') return route.fulfill({ json: perfil });
        if (url.pathname === '/api/profile' && req.method() === 'POST') { posts.push(JSON.parse(req.postData() || '{}')); return route.fulfill({ json: { success: true } }); }
        if (url.pathname.startsWith('/api/')) return route.fulfill({ json: {} });
        if (req.resourceType() === 'document') {
          const r = await route.fetch();
          const csp = /account\.html/.test(url.pathname) ? cspConta : cspGeral;
          return route.fulfill({ response: r, headers: { ...r.headers(), 'content-security-policy': csp } });
        }
        return route.continue();
      });
      const page = await context.newPage();
      page.on('pageerror', e => erros.push(e.message));
      page.on('console', m => { if (/Content Security Policy|Refused to/i.test(m.text())) erros.push('CSP: ' + m.text()); });
      await page.goto(base + '/' + arquivo, { waitUntil: 'domcontentloaded' });
      return { context, page, posts, erros };
    }

    // 1. Onboarding em modo edicao: nao expulsa, vem preenchido, salva e volta.
    {
      const { context, page, posts, erros } = await abrir('onboarding.html?editar=1', PERFIL);
      try {
        await page.locator('#onb-titulo', { hasText: 'O que a Yara sabe de você' }).waitFor();
        await page.waitForFunction(() => document.querySelector('.level-btn[data-value="intermediate"]').classList.contains('selected'));
        await page.waitForTimeout(800);
        assert.match(page.url(), /onboarding\.html\?editar=1/, 'quem ja fez o onboarding foi expulso do modo edicao');
        for (let i = 0; i < 4; i++) {
          await page.locator('#btn-next').click();
        }
        assert.match(await page.locator('#interests-detail-input').inputValue(), /Flamengo/);
        await page.locator('#btn-save').click();
        await page.waitForURL(/account\.html\?salvo=1/);
        assert.equal(posts.length, 1);
        assert.equal(posts[0].english_level, 'intermediate');
        assert.deepEqual(posts[0].interests, ['sports', 'series']);
        assert.equal(posts[0].daily_goal_minutes, 20);
        assert.equal(posts[0].onboarding_complete, true);
      } finally { await context.close(); }
      assert.deepEqual(erros.filter(e => !/account/.test(e)), [], 'erros no onboarding');
    }

    // 2. Onboarding SEM editar=1 continua mandando quem ja fez para a home.
    {
      const { context, page } = await abrir('onboarding.html', PERFIL);
      try {
        await page.waitForURL(/6_Home_Forest_Expedition\.html/, { timeout: 10_000 });
      } finally { await context.close(); }
    }

    // 3. Cartao na conta, sob a CSP estrita da pagina: texto literal.
    {
      const { context, page, erros } = await abrir('account.html?salvo=1', PERFIL);
      try {
        const card = page.locator('#sobre-mim');
        await card.getByText('Intermediário').waitFor();
        const texto = await card.innerText();
        assert.match(texto, /Salvo!/);
        assert.match(texto, /Gosta de: esportes, séries e filmes/);
        assert.match(texto, /Aprende inglês para: viajar/);
        assert.match(texto, /<img src=x onerror=alert\(1\)>/, 'o detalhe tem que aparecer como texto');
        assert.equal(await page.locator('#sobre-mim img').count(), 0, 'o detalhe do aluno virou HTML');
        assert.equal(await page.locator('a[href="onboarding.html?editar=1"]').count() >= 2, true);
        assert.deepEqual(erros, [], 'erros na conta');
      } finally { await context.close(); }
    }
    {
      const { context, page } = await abrir('account.html', {});
      try {
        await page.locator('#sobre-mim').getByText('A Yara ainda não sabe nada sobre você').waitFor();
      } finally { await context.close(); }
    }

    // 4. Teste de nivelamento: manda SO o nivel.
    {
      const { context, page, posts, erros } = await abrir('placement_test.html', PERFIL);
      try {
        await page.waitForFunction(() => typeof showResult === 'function' && window.Auth);
        await page.evaluate(() => { score = 9; showResult(); });
        await page.waitForFunction(() => true);
        await page.waitForTimeout(400);
        assert.deepEqual(posts, [{ english_level: 'intermediate' }]);
        assert.deepEqual(erros, [], 'erros no teste de nivelamento');
      } finally { await context.close(); }
    }
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
});
