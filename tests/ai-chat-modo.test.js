// A pagina da IA depois de 28/set: a capivara no TOPO (botao maior, que pulsa
// ate o aluno descobrir o menu) e, no compositor, a DIFICULDADE e o ESTILO da
// conversa. Pedido do Luis. Roda a pagina de verdade no Chromium, com o
// /api/personas respondendo o catalogo REAL recortado do api/index.js.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const http = require('http');
const path = require('path');
const { installBrowserVoiceMocks } = require('./helpers/voz-mock');

const ROOT = path.join(__dirname, '..');

function catalogoPublico() {
  const fonte = fs.readFileSync(path.join(ROOT, 'api/index.js'), 'utf8');
  const i = fonte.indexOf('function textoParaPrompt(valor, limite) {');
  const j = fonte.indexOf('function sanitizeStoredJson(', i);
  const C = new Function(fonte.slice(i, j) + '\nreturn { personasPublicas, catalogoDeModos };')();
  return JSON.parse(JSON.stringify({ personas: C.personasPublicas(), ...C.catalogoDeModos() }));
}

test('ai_chat: capivara no topo, dificuldade e estilo no compositor', { timeout: 300_000 }, async () => {
  const { chromium } = require('playwright');
  const server = http.createServer(require('../scripts/dev-server'));
  await new Promise((resolve, reject) => server.listen(0, '127.0.0.1', resolve).once('error', reject));
  const base = 'http://127.0.0.1:' + server.address().port;
  const catalogo = catalogoPublico();
  const shots = path.join(ROOT, 'test-results', 'ai-chat-modo', String(process.pid));
  fs.mkdirSync(shots, { recursive: true });
  console.log('Screenshots: ' + shots);
  let browser;
  try {
    browser = await chromium.launch({ headless: true });

    async function abrir(caminho, width, opcoes = {}) {
      const context = await browser.newContext({ viewport: { width, height: 800 }, reducedMotion: opcoes.movimento ? 'no-preference' : 'reduce' });
      await context.addInitScript(installBrowserVoiceMocks);
      if (opcoes.vistas) {
        await context.addInitScript(ids => localStorage.setItem('capyCapivarasVistas', JSON.stringify({ ids, em: 1 })), opcoes.vistas);
      }
      const pedidos = { chat: [], token: [] };
      await context.route('**/*', async route => {
        const req = route.request();
        const url = new URL(req.url());
        if (url.hostname === 'api.openai.com') return route.fulfill({ status: 201, contentType: 'application/sdp', body: 'mock-answer' });
        if (url.origin !== base) return route.abort();
        if (url.pathname === '/api/personas') return route.fulfill({ json: catalogo });
        if (url.pathname === '/api/auth/session') return route.fulfill({ json: { user: { id: 'aluno-1', role: 'student' }, csrfToken: 'mock-csrf' } });
        if (url.pathname === '/api/chat') {
          pedidos.chat.push(JSON.parse(req.postData() || '{}'));
          return route.fulfill({ json: { candidates: [{ content: { parts: [{ text: 'Resposta da Yara' }] } }] } });
        }
        if (url.pathname === '/api/realtime-token') { pedidos.token.push(JSON.parse(req.postData() || '{}')); return route.fulfill({ json: { value: 'mock-secret', expiresAt: 2_000 } }); }
        if (url.pathname.startsWith('/api/')) return route.fulfill({ json: {} });
        return route.continue();
      });
      const page = await context.newPage();
      const erros = [];
      page.on('pageerror', e => erros.push(e.message));
      await page.goto(base + '/' + caminho, { waitUntil: 'domcontentloaded' });
      await page.locator('#btn-modo:not([hidden])').waitFor();
      return { context, page, pedidos, erros };
    }
    const semRolagem = async (page, onde) => {
      const d = await page.evaluate(() => ({ w: innerWidth, s: document.documentElement.scrollWidth }));
      assert.ok(d.s <= d.w + 1, onde + ': rolagem lateral ' + JSON.stringify(d));
    };
    // O Luis nao quer emoji na interface ("fica infantil"; no Windows a bandeira
    // vira letra). Confere topo, pilula, menus, dica, linha "Agora:" e saudacao.
    // Devolve os trechos com emoji (vazio = ok).
    const semEmoji = page => page.evaluate(() => {
      const re = /\p{Extended_Pictographic}|\p{Regional_Indicator}/u;
      const alvos = ['#topo', '#btn-modo', '#menu-persona', '#menu-modo', '.dica', '#fio p[data-quem="sistema"]', '#fio p[data-quem="ia"]'];
      return alvos.flatMap(sel => Array.from(document.querySelectorAll(sel)))
        .map(el => el.textContent).filter(t => re.test(t)).map(t => t.trim().slice(0, 60));
    });

    for (const width of [320, 390, 768, 1440]) {
      const onde = '@' + width;
      const { context, page, pedidos, erros } = await abrir('ai_chat.html', width);
      try {
        // ── Topo: botao grande, pulsando ate o 1o clique ──
        const capi = page.locator('#btn-capivara');
        const alto = await capi.evaluate(b => b.getBoundingClientRect().height);
        assert.ok(alto >= 44, onde + ': botao da capivara com ' + alto + 'px');
        assert.equal(await capi.evaluate(b => b.classList.contains('chamar')), true, onde + ': nao pulsa para quem nunca abriu');
        await semRolagem(page, onde);
        if (width === 390 || width === 1440) await page.screenshot({ path: path.join(shots, 'inicio-' + width + '.png') });

        await capi.click();
        await page.locator('#menu-persona:not([hidden])').waitFor();
        assert.equal(await page.locator('#menu-persona [data-id="iniciante"]').count(), 0, onde + ': capivara de iniciantes ainda no menu');
        assert.ok(await page.locator('#menu-persona [data-id="travel"]').count() === 1);
        assert.equal(await capi.evaluate(b => b.classList.contains('chamar')), false, onde + ': continua pulsando com o menu aberto');
        await semRolagem(page, onde + ' menu capivara');
        if (width === 390 || width === 1440) await page.screenshot({ path: path.join(shots, 'menu-capivara-' + width + '.png') });
        await page.keyboard.press('Escape');
        assert.equal(await capi.evaluate(b => b.classList.contains('chamar')), false, onde + ': voltou a pulsar depois de visto');

        // ── Compositor: dificuldade e estilo ──
        await page.locator('#btn-modo').click();
        await page.locator('#menu-modo:not([hidden])').waitFor();
        const grupos = page.locator('#menu-modo [role="radiogroup"]');
        assert.equal(await grupos.count(), 2);
        assert.equal(await grupos.nth(0).locator('[role="radio"]').count(), 5, onde + ': niveis');
        assert.equal(await grupos.nth(1).locator('[role="radio"]').count(), 7, onde + ': estilos');
        await page.locator('#menu-modo [data-tipo="nivel"][data-id="intensivo"]').click();
        await page.locator('#menu-modo [data-tipo="estilo"][data-id="encenacao"]').click();
        assert.equal(await page.locator('#menu-modo:not([hidden])').count(), 1, onde + ': escolher fechou o menu');
        await semRolagem(page, onde + ' menu modo');
        if (width === 390 || width === 1440) await page.screenshot({ path: path.join(shots, 'menu-modo-' + width + '.png') });
        await page.locator('#modo-pronto').click();
        await page.locator('#fio p[data-quem="sistema"]', { hasText: 'Agora:' }).waitFor();
        assert.match(page.url(), /nivel=intensivo/);
        assert.match(page.url(), /estilo=encenacao/);
        // Icones de linha no lugar dos emojis (8/out).
        assert.equal(await page.locator('#btn-modo [data-icone="nivel-4"]').count(), 1, onde + ': icone do intensivo');
        assert.equal(await page.locator('#btn-modo [data-icone="mascaras"]').count(), 1, onde + ': icone da encenacao');
        assert.deepEqual(await semEmoji(page), [], onde + ': emoji na interface');

        // ── A mensagem seguinte leva nivel e estilo; o aviso nao vai no historico ──
        await page.locator('#entrada').fill('Hello!');
        await page.locator('#btn-enviar').click();
        await page.getByText('Resposta da Yara').waitFor();
        const corpo = pedidos.chat[pedidos.chat.length - 1];
        assert.equal(corpo.nivel, 'intensivo');
        assert.equal(corpo.estilo, 'encenacao');
        assert.ok(!JSON.stringify(corpo.history).includes('Agora:'), onde + ': o aviso da pagina foi para a IA');

        // ── Ligacao: leva nivel e estilo, e trava os dois botoes ──
        await page.locator('#ligar').click();
        await page.waitForFunction(() => document.getElementById('ligar').classList.contains('desligar'));
        for (let i = 0; i < 100 && !pedidos.token.length; i++) await page.waitForTimeout(50);
        assert.equal(pedidos.token[0].nivel, 'intensivo');
        assert.equal(pedidos.token[0].estilo, 'encenacao');
        assert.equal(await page.locator('#btn-modo').isDisabled(), true, onde + ': modo liberado na ligacao');
        assert.equal(await capi.getAttribute('aria-disabled'), 'true', onde + ': capivara liberada na ligacao');
        await page.locator('#ligar').click();
        await page.waitForFunction(() => !document.getElementById('ligar').classList.contains('desligar'));

        // ── Maia: o jeito dela ──
        await capi.click();
        await page.locator('#menu-persona [data-id="maia"]').click();
        // textContent: abaixo de 360px o texto some de proposito (so o icone).
        assert.match(await page.locator('#btn-modo').textContent(), /Do jeito dela/);
        assert.equal(await page.locator('#btn-modo [data-icone="jeito"]').count(), 1, onde + ': icone do jeito dela');
        await page.locator('#btn-modo').click();
        assert.equal(await page.locator('#menu-modo [role="radio"]:not(:disabled)').count(), 0, onde + ': Maia aceitou nivel/estilo');
        assert.match(await page.locator('#menu-modo').innerText(), /jeito dela/);
        await page.locator('#modo-pronto').click();

        await semRolagem(page, onde + ' fim');
        assert.deepEqual(erros, [], onde + ': erros no navegador');
      } finally { await context.close(); }
    }

    // ── Depois de visto, nao pulsa; capivara nova faz voltar ──
    {
      const todas = catalogo.personas.map(p => p.id);
      const vista = await abrir('ai_chat.html', 390, { vistas: todas });
      assert.equal(await vista.page.locator('#btn-capivara').evaluate(b => b.classList.contains('chamar')), false, 'pulsa para quem ja viu todas');
      await vista.context.close();
      const nova = await abrir('ai_chat.html', 390, { vistas: todas.filter(id => id !== 'travel') });
      assert.equal(await nova.page.locator('#btn-capivara').evaluate(b => b.classList.contains('chamar')), true, 'capivara nova nao fez pulsar');
      await nova.context.close();
      // O pulso tem que ANIMAR de verdade: a outra sessao (7/out) tinha posto
      // `animation:none` nele e a classe continuava la, sem efeito nenhum.
      const viva = await abrir('ai_chat.html', 390, { movimento: true });
      assert.equal(await viva.page.locator('#btn-capivara').evaluate(b => getComputedStyle(b).animationName), 'chamaCapivara', 'o botao da capivara nao pulsa');
      await viva.context.close();
    }

    // ── Link antigo da capivara de iniciantes: Yara + Total iniciante ──
    {
      const { context, page, pedidos, erros } = await abrir('ai_chat.html?persona=iniciante', 390);
      try {
        await page.waitForFunction(() => /nivel=zero/.test(location.search));
        assert.doesNotMatch(page.url(), /persona=iniciante/);
        assert.equal(await page.locator('#btn-modo [data-icone="nivel-1"]').count(), 1, 'icone do total iniciante');
        assert.match(await page.locator('#titulo').innerText(), /Yara/);
        await page.locator('#entrada').fill('oi');
        await page.locator('#btn-enviar').click();
        await page.getByText('Resposta da Yara').waitFor();
        assert.equal(pedidos.chat[0].nivel, 'zero');
        assert.equal(pedidos.chat[0].persona, 'conversa');
        assert.deepEqual(erros, []);
      } finally { await context.close(); }
    }
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
});
