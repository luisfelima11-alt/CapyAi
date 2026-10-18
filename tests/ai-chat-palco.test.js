// O palco da pagina da IA depois de 8/out: "chamada de video". A capivara
// ocupa a tela, as falas flutuam por cima da parte de baixo (em pe) ou num
// painel ao lado (deitado), e TODA capivara se mexe com os clipes dela. Pedido
// do Luis: "a do agro so tem uma foto".
//
// O Chromium do Playwright nao toca H.264, entao a prova do video e a REDE:
// qual .mp4 a pagina pediu, e quando. Roda com o catalogo REAL do api/index.js.
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

test('ai_chat: palco de chamada de video, com clipe para cada capivara', { timeout: 300_000 }, async () => {
  const { chromium } = require('playwright');
  const server = http.createServer(require('../scripts/dev-server'));
  await new Promise((resolve, reject) => server.listen(0, '127.0.0.1', resolve).once('error', reject));
  const base = 'http://127.0.0.1:' + server.address().port;
  const catalogo = catalogoPublico();
  const shots = path.join(ROOT, 'test-results', 'ai-chat-palco', String(process.pid));
  fs.mkdirSync(shots, { recursive: true });
  console.log('Screenshots: ' + shots);
  let browser;
  try {
    browser = await chromium.launch({ headless: true });

    async function abrir(caminho, viewport, opcoes = {}) {
      const context = await browser.newContext({ viewport, reducedMotion: opcoes.reduzido ? 'reduce' : 'no-preference' });
      await context.addInitScript(installBrowserVoiceMocks);
      // Todas vistas: o pulso do botao nao interessa aqui.
      await context.addInitScript(ids => localStorage.setItem('capyCapivarasVistas', JSON.stringify({ ids, em: 1 })), catalogo.personas.map(p => p.id));
      if (opcoes.semMovimento) await context.addInitScript(() => localStorage.setItem('capyPresenceMotion', 'off'));
      if (opcoes.economia) {
        await context.addInitScript(() => Object.defineProperty(navigator, 'connection', {
          configurable: true, value: { saveData: true, effectiveType: '4g', addEventListener() {} },
        }));
      }
      await context.route('**/*', async route => {
        const req = route.request();
        const url = new URL(req.url());
        if (url.hostname === 'api.openai.com') return route.fulfill({ status: 201, contentType: 'application/sdp', body: 'mock-answer' });
        if (url.origin !== base) return route.abort();
        if (url.pathname === '/api/personas') return route.fulfill({ json: catalogo });
        if (url.pathname === '/api/auth/session') return route.fulfill({ json: { user: { id: 'aluno-1', role: 'student' }, csrfToken: 'mock-csrf' } });
        if (url.pathname === '/api/chat') return route.fulfill({ json: { reply: 'Great! Tell me more about the harvest this year.' } });
        if (url.pathname === '/api/realtime-token') return route.fulfill({ json: { value: 'mock-secret', expiresAt: 2_000 } });
        if (url.pathname.startsWith('/api/')) return route.fulfill({ json: {} });
        return route.continue();
      });
      const page = await context.newPage();
      const erros = [], mp4 = [];
      page.on('pageerror', e => erros.push(e.message));
      page.on('request', r => { if (/\.mp4(\?|$)/.test(r.url())) mp4.push(new URL(r.url()).pathname.slice(1)); });
      await page.goto(base + '/' + caminho, { waitUntil: 'domcontentloaded' });
      await page.locator('#btn-modo:not([hidden])').waitFor();
      await page.locator('#fio p[data-quem="ia"]').first().waitFor();
      return { context, page, erros, mp4 };
    }
    const esperarPedido = async (mp4, nome) => {
      for (let i = 0; i < 60 && !mp4.includes(nome); i++) await new Promise(r => setTimeout(r, 50));
      assert.ok(mp4.includes(nome), 'nao pediu ' + nome + ' (pediu: ' + mp4.join(', ') + ')');
    };

    for (const viewport of [{ width: 320, height: 640 }, { width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 1440, height: 900 }]) {
      const onde = '@' + viewport.width + 'x' + viewport.height;
      const { context, page, erros, mp4 } = await abrir('ai_chat.html', viewport);
      try {
        // ── Rede: zero video antes do 1o toque; depois, o parada da Yara ──
        await page.waitForTimeout(400);
        assert.deepEqual(mp4, [], onde + ': baixou video antes de o aluno tocar na pagina');
        if (viewport.width === 390 || viewport.width === 1440) await page.screenshot({ path: path.join(shots, 'inicio-' + viewport.width + '.png') });
        await page.locator('#entrada').click();
        await esperarPedido(mp4, 'yara-parada-v1.mp4');
        assert.equal(await page.locator('#btn-movimento').isVisible(), true, onde + ': sem o botao de movimento');

        // ── Layout ──
        const m = await page.evaluate(() => {
          const r = id => document.querySelector(id).getBoundingClientRect();
          const caixa = r('.caixa'), quadro = r('#palco .quadro'), fio = r('#fio'), chamada = r('#chamada'), capi = r('#btn-capivara');
          return { w: innerWidth, h: innerHeight, sw: document.documentElement.scrollWidth,
            caixa: { l: caixa.left, r: caixa.right, b: caixa.bottom }, quadroDir: quadro.right, fioTopo: fio.top,
            chamadaEsq: chamada.left, capi: capi.height };
        });
        assert.ok(m.sw <= m.w + 1, onde + ': rolagem lateral ' + m.sw);
        assert.ok(m.caixa.l >= 8 && m.caixa.r <= m.w - 8 && m.caixa.b <= m.h - 8, onde + ': caixa de texto colada na borda ' + JSON.stringify(m.caixa));
        assert.ok(m.capi >= 44, onde + ': botao da capivara com ' + m.capi + 'px');
        if (m.w > m.h) assert.ok(m.chamadaEsq >= m.quadroDir - 1, onde + ': a conversa cobre a capivara');
        else assert.ok(m.fioTopo >= m.h * 0.45 - 1, onde + ': as falas comecam em cima do rosto (' + Math.round(m.fioTopo) + 'px)');

        // ── Trocar para o agro: os clipes DELE, o poster dele, sem repetir o pedido ──
        await page.locator('#btn-capivara').click();
        await page.locator('#menu-persona [data-id="agro"]').click();
        await esperarPedido(mp4, 'persona-agro-parada-v1.mp4');
        await page.waitForFunction(() => document.getElementById('yara-video').getAttribute('poster') === 'yara-agro-v1.jpg');
        await page.waitForTimeout(800);
        const pedidosAgro = mp4.filter(n => n === 'persona-agro-parada-v1.mp4').length;
        assert.ok(pedidosAgro <= 2, onde + ': pediu o clipe do agro ' + pedidosAgro + ' vezes (laco?)');

        // ── Resposta escrita: ela "fala" no palco ──
        await page.locator('#entrada').fill('We planted soybeans.');
        await page.locator('#btn-enviar').click();
        await page.getByText('Great! Tell me more').waitFor();
        await esperarPedido(mp4, 'persona-agro-fala-v1.mp4');
        if (viewport.width === 390 || viewport.width === 1440) await page.screenshot({ path: path.join(shots, 'agro-' + viewport.width + '.png') });

        // ── Ligacao: as ondas rosa aparecem quando ela fala ──
        await page.evaluate(() => { document.getElementById('palco').dataset.estado = 'ia_falando'; });
        assert.equal(await page.locator('#palco .ondas').evaluate(e => getComputedStyle(e).display), 'flex', onde + ': sem as ondas quando ela fala');
        await page.evaluate(() => { document.getElementById('palco').dataset.estado = 'desconectado'; });

        assert.deepEqual(erros, [], onde + ': erros no navegador');
      } finally { await context.close(); }
    }

    // ── Quem pediu menos movimento ou menos dados: nenhum video, nunca ──
    for (const [nome, opcoes] of [['movimento reduzido', { reduzido: true }], ['economia de dados', { economia: true }], ['movimento desligado', { semMovimento: true }]]) {
      const { context, page, erros, mp4 } = await abrir('ai_chat.html?persona=agro', { width: 390, height: 844 }, opcoes);
      try {
        await page.locator('#entrada').click();
        await page.locator('#entrada').fill('Hello');
        await page.locator('#btn-enviar').click();
        await page.getByText('Great! Tell me more').waitFor();
        await page.waitForTimeout(500);
        assert.deepEqual(mp4, [], nome + ': baixou video');
        if (opcoes.semMovimento) {
          assert.equal(await page.locator('#btn-movimento').getAttribute('aria-pressed'), 'false', nome + ': botao nao mostra o estado');
          // E o aluno consegue religar.
          await page.locator('#btn-movimento').click();
          await esperarPedido(mp4, 'persona-agro-parada-v1.mp4');
        } else {
          assert.equal(await page.locator('#btn-movimento').isHidden(), true, nome + ': botao de movimento aparece sem video possivel');
        }
        assert.deepEqual(erros, [], nome + ': erros no navegador');
      } finally { await context.close(); }
    }
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
});
