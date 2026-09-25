// O painel da Yara dentro das aulas (yara-widget.js): o chat que sabe a aula e
// a ligacao guiada. Roda as paginas de verdade no Chromium, com microfone e
// WebRTC falsos (helpers/voz-mock) e a CSP DE PRODUCAO injetada — o
// dev-server nao aplica CSP, e um eval no widget so quebraria em producao.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const http = require('http');
const path = require('path');
const { installBrowserVoiceMocks } = require('./helpers/voz-mock');

const ROOT = path.join(__dirname, '..');

function cspDeProducao() {
  const v = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));
  const bloco = (v.headers || []).find(h => h.source === '/(.*)');
  const csp = bloco && bloco.headers.find(h => /content-security-policy/i.test(h.key));
  assert.ok(csp, 'a CSP global sumiu do vercel.json');
  return csp.value;
}

test('o widget nao usa eval nem handler inline, e a versao dele e a mesma em todas as paginas', () => {
  const w = fs.readFileSync(path.join(ROOT, 'yara-widget.js'), 'utf8');
  assert.doesNotMatch(w, /\beval\(|new Function\b/, 'a CSP de producao nao tem unsafe-eval');
  assert.doesNotMatch(w, /\bon(click|error|load)\s*=\s*["']/, 'handler inline no HTML do widget');
  assert.doesNotMatch(w, /systemOverride/, 'o prompt nao sai mais do navegador');
  const versoes = new Map();
  for (const f of fs.readdirSync(ROOT).filter(n => n.endsWith('.html'))) {
    for (const m of fs.readFileSync(path.join(ROOT, f), 'utf8').matchAll(/yara-widget\.js\?v=([\w.-]+)/g)) {
      versoes.set(m[1], (versoes.get(m[1]) || 0) + 1);
    }
  }
  assert.equal(versoes.size, 1, 'versoes diferentes do widget: ' + JSON.stringify([...versoes]));
  assert.ok([...versoes.values()][0] >= 160);
});

test('o motor de voz tem a MESMA versao no widget, na ai_chat e na entrevista', () => {
  const doWidget = (fs.readFileSync(path.join(ROOT, 'yara-widget.js'), 'utf8').match(/CORE_SRC = 'conversa-core\.js\?v=([\w.-]+)'/) || [])[1];
  assert.ok(doWidget, 'CORE_SRC sumiu do widget');
  for (const f of ['ai_chat.html', 'entrevista.html']) {
    const v = (fs.readFileSync(path.join(ROOT, f), 'utf8').match(/conversa-core\.js\?v=([\w.-]+)/) || [])[1];
    assert.equal(v, doWidget, f + ' carrega outra versao do motor de voz');
  }
});

const PAGINAS = [
  { arquivo: 'agro_aula_01.html', aula: 'agro_aula_01' },
  { arquivo: 'aula_01.html', aula: 'aula_01' },
  { arquivo: 'fr_aula_01.html', aula: 'fr_aula_01' },
  { arquivo: 'intermediate_aula_05.html', aula: 'intermediate_aula_05' },
  { arquivo: 'lessons.html?lesson=1', aula: 'trilha_1' },
];

test('dentro das aulas: o chat manda a aula, a ligacao conduz a aula, e o layout cabe', { timeout: 300_000 }, async () => {
  const { chromium } = require('playwright');
  const server = http.createServer(require('../scripts/dev-server'));
  await new Promise((resolve, reject) => server.listen(0, '127.0.0.1', resolve).once('error', reject));
  const base = 'http://127.0.0.1:' + server.address().port;
  const csp = cspDeProducao();
  const shots = path.join(ROOT, 'test-results', 'yara-widget', String(process.pid));
  fs.mkdirSync(shots, { recursive: true });
  console.log('Widget screenshots: ' + shots);
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    for (const { arquivo, aula } of PAGINAS) {
      for (const width of [320, 768, 1440]) {
        const onde = arquivo + ' @' + width;
        const context = await browser.newContext({ viewport: { width, height: 800 }, reducedMotion: 'reduce' });
        try {
          await context.addInitScript(installBrowserVoiceMocks);
          const pedidos = { chat: [], token: [], uso: [] };
          let respostaToken = { json: { value: 'mock-browser-secret', model: 'gpt-realtime', expiresAt: 2_000 } };
          await context.route('**/*', async route => {
            const req = route.request();
            const url = new URL(req.url());
            if (url.hostname === 'cdn.tailwindcss.com') return route.fulfill({ contentType: 'application/javascript', body: 'window.tailwind = window.tailwind || {};' });
            if (url.hostname === 'api.openai.com') return route.fulfill({ status: 201, contentType: 'application/sdp', body: 'mock-browser-answer' });
            if (url.origin !== base) return route.abort();
            if (url.pathname === '/api/auth/session') return route.fulfill({ json: { user: { id: 'mock-student', role: 'student' }, csrfToken: 'mock-csrf' } });
            if (url.pathname === '/api/chat') {
              pedidos.chat.push(JSON.parse(req.postData() || '{}'));
              return route.fulfill({ json: { candidates: [{ content: { parts: [{ text: 'Resposta da Yara' }] } }] } });
            }
            if (url.pathname === '/api/realtime-token') { pedidos.token.push(JSON.parse(req.postData() || '{}')); return route.fulfill(respostaToken); }
            if (url.pathname === '/api/conversa-uso') { pedidos.uso.push(req.postData() || ''); return route.fulfill({ json: { ok: true } }); }
            if (url.pathname.startsWith('/api/')) return route.fulfill({ json: {} });
            // HTML com a CSP de producao, como a Vercel entrega.
            if (req.resourceType() === 'document') {
              const r = await route.fetch();
              return route.fulfill({ response: r, headers: { ...r.headers(), 'content-security-policy': csp } });
            }
            return route.continue();
          });
          const page = await context.newPage();
          const erros = [];
          page.on('pageerror', e => erros.push('pageerror: ' + e.message));
          page.on('console', m => {
            const t = m.text();
            if (/Refused to evaluate|unsafe-eval/i.test(t)) erros.push('CSP: ' + t);
            if (m.type() === 'error' && /yara-widget|conversa-core|yw-/.test(t)) erros.push('console: ' + t);
          });
          // domcontentloaded: algumas aulas tem midia que nunca termina de
          // carregar no sandbox (o `load` nao vem); o widget nao depende dela.
          const resp = await page.goto(base + '/' + arquivo, { waitUntil: 'domcontentloaded' });
          assert.equal(resp.status(), 200, onde);
          await page.locator('#yw-fab').waitFor({ state: 'visible' });
          if (arquivo.startsWith('lessons')) await page.waitForFunction(() => typeof currentLesson !== 'undefined' && currentLesson && currentLesson.id);
          await page.waitForTimeout(450);  // o widget reposiciona depois do menu montar
          assert.equal(await page.evaluate(() => window.CapyYaraWidget.aula()), aula, onde + ': id da aula');
          // A largura da pagina ANTES do painel: a barra de cima do site ja passa
          // de 320px sozinha (components.js, fora deste teste). O que se testa
          // aqui e que o widget nao piora isso.
          const larguraAntes = await page.evaluate(() => document.documentElement.scrollWidth);

          // Plano Super: o chat e a ligacao liberados no cliente (quem decide de
          // verdade e o servidor; aqui o 403 e testado a parte).
          await page.evaluate(() => { Store.state.planType = 'super'; });
          await page.locator('#yw-fab').click();
          await page.waitForFunction(() => document.getElementById('yw-panel').classList.contains('open'));
          const sub = (await page.locator('#yw-sub').innerText()).trim();
          assert.ok(sub.length >= 3 && !/&amp;/.test(sub), onde + ': subtitulo "' + sub + '"');

          // Layout: painel inteiro na tela, sem rolagem horizontal.
          const box = await page.evaluate(() => {
            const p = document.getElementById('yw-panel').getBoundingClientRect();
            const f = document.getElementById('yw-fab');
            const fr = f.getBoundingClientRect();
            return { p: { l: p.left, r: p.right, t: p.top, b: p.bottom }, f: { t: fr.top, op: getComputedStyle(f).opacity },
              w: innerWidth, h: innerHeight, scroll: document.documentElement.scrollWidth };
          });
          assert.ok(box.p.l >= 0 && box.p.r <= box.w + 1 && box.p.t >= 0 && box.p.b <= box.h + 1, onde + ': painel fora da tela ' + JSON.stringify(box));
          assert.ok(box.scroll <= Math.max(box.w, larguraAntes) + 1, onde + ': o painel criou rolagem horizontal');
          if (width <= 640) assert.equal(box.f.op, '0', onde + ': no celular o FAB some com o painel aberto');
          else assert.ok(box.p.b <= box.f.t + 1, onde + ': o painel cobre o FAB ' + JSON.stringify(box));

          // Chat escrito: vai o id da aula, nunca um prompt.
          await page.locator('#yw-input').fill('como escreve isso?');
          await page.locator('#yw-send').click();
          await page.getByText('Resposta da Yara').waitFor();
          assert.equal(pedidos.chat.length, 1, onde);
          assert.equal(pedidos.chat[0].aula, aula, onde + ': o chat nao mandou a aula');
          assert.ok(!('systemOverride' in pedidos.chat[0]) && !('userId' in pedidos.chat[0]), onde);

          // Ligacao.
          await page.locator('#yw-call').click();
          await page.waitForFunction(() => !document.getElementById('yw-callbar').hidden);
          await page.waitForFunction(() => window.__voiceMock.peers.length && document.getElementById('yw-mute').disabled === false);
          assert.equal(pedidos.token.length, 1, onde);
          assert.deepEqual(pedidos.token[0], { aula }, onde + ': o token deve receber SO o id da aula');
          assert.equal(await page.locator('#yw-input').isDisabled(), true, onde + ': digitar durante a ligacao');

          await page.evaluate(() => window.__voiceMock.peers[0].channel.message({ type: 'conversation.item.input_audio_transcription.completed', item_id: 'u1', transcript: '<img src=x onerror=alert(1)> hello' }));
          await page.locator('#yw-messages').getByText('<img src=x', { exact: false }).waitFor();
          assert.equal(await page.locator('#yw-messages img').count(), 0, onde + ': transcricao virou HTML');

          await page.locator('#yw-mute').click();
          assert.equal(await page.locator('#yw-mute').getAttribute('aria-pressed'), 'true', onde);
          assert.equal(await page.evaluate(() => window.__voiceMock.tracks.every(t => !t.enabled)), true, onde);
          await page.locator('#yw-mute').click();

          // Clicar fora NAO fecha durante a ligacao; o X minimiza e o FAB avisa.
          await page.mouse.click(5, 5);
          assert.equal(await page.evaluate(() => document.getElementById('yw-panel').classList.contains('open')), true, onde + ': clique fora fechou a ligacao');
          await page.locator('#yw-close').click();
          assert.equal(await page.evaluate(() => document.getElementById('yw-fab').classList.contains('yw-emchamada')), true, onde);
          await page.locator('#yw-fab').click();
          await page.waitForFunction(() => document.getElementById('yw-panel').classList.contains('open'));

          await page.screenshot({ path: path.join(shots, aula + '-' + width + '.png'), animations: 'disabled' });
          await page.locator('#yw-hangup').click();
          await page.waitForFunction(() => document.getElementById('yw-callbar').hidden);
          assert.equal(await page.evaluate(() => window.__voiceMock.tracks.every(t => t.stopped)), true, onde + ': microfone ficou ligado');
          await page.waitForFunction(() => true);
          await page.waitForTimeout(100);
          assert.equal(pedidos.uso.length, 1, onde + ': o uso da ligacao nao foi registrado');
          assert.match(pedidos.uso[0], new RegExp('"cenario":"aula:' + aula + '"'), onde);
          assert.equal(await page.locator('#yw-input').isDisabled(), false, onde);

          // Plano sem voz: mensagem certa, com link para os planos.
          respostaToken = { status: 403, json: { error: 'plano_sem_voz', message: 'A conversa por voz faz parte do plano Super.' } };
          await page.locator('#yw-call').click();
          await page.locator('.yw-aviso', { hasText: 'plano Super' }).waitFor();
          assert.equal(await page.locator('.yw-aviso a[href="account.html"]').count(), 1, onde);
          // Sem login.
          respostaToken = { status: 401, json: { error: 'login_necessario' } };
          await page.locator('#yw-call').click();
          await page.locator('.yw-aviso', { hasText: 'Entre na sua conta' }).waitFor();

          assert.deepEqual(erros, [], onde + ': erros no navegador');
        } finally {
          await context.close();
        }
      }
    }
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
});
