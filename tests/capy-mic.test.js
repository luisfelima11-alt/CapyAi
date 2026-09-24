'use strict';

// CapyMic (components.js) — o gravador do Speak step de 57 páginas.
//
// A trava de 15s chamava stopAndTranscribe() sozinha e jogava o resultado fora:
// quem falava mais de 15s pagava a transcrição, perdia a fala e, ao tocar em
// "parar", recebia { empty:true } — a página dizia "Não ouvi nada". Agora a
// trava só PARA o gravador; o texto chega ao chamador, transcrito uma vez só.

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const http = require('node:http');
const crypto = require('node:crypto');
const { EventEmitter } = require('node:events');
const ROOT = path.resolve(__dirname, '..');
const FALA = 'I can hear you but I cannot see you';

// Microfone e MediaRecorder de mentira. Como no navegador (sem timeslice), o
// áudio inteiro chega num único dataavailable, logo antes do onstop. Com
// holdStop, o onstop fica preso até release() — para testar a corrida entre a
// trava e o toque do aluno.
function installMicMocks() {
  const mock = window.__mic = { tracks: [], holdStop: false, release: null };
  Object.defineProperty(navigator, 'mediaDevices', { configurable: true, value: { getUserMedia: async () => {
    const track = { stopped: false, stop() { this.stopped = true; } };
    mock.tracks.push(track);
    return { getTracks: () => [track], getAudioTracks: () => [track] };
  } } });
  window.MediaRecorder = class {
    static isTypeSupported(type) { return type === 'audio/webm'; }
    constructor(stream, opts) { this.mimeType = (opts && opts.mimeType) || ''; this.state = 'inactive'; }
    start() { this.state = 'recording'; }
    stop() {
      if (this.state === 'inactive') throw new DOMException('not recording', 'InvalidStateError');
      this.state = 'inactive';
      const finish = () => {
        if (this.ondataavailable) this.ondataavailable({ data: new Blob(['x'.repeat(400)], { type: this.mimeType }) });
        if (this.onstop) this.onstop();
      };
      if (mock.holdStop) mock.release = finish; else setTimeout(finish, 0);
    }
  };
}

async function withPage(filename, fn) {
  const { chromium } = require('playwright');
  const server = http.createServer(require('../scripts/dev-server'));
  await new Promise((resolve, reject) => server.listen(0, '127.0.0.1', resolve).once('error', reject));
  const base = 'http://127.0.0.1:' + server.address().port;
  const browser = await chromium.launch({ headless: true });
  const transcricoes = [], erros = [];
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 900 } });
    await context.addInitScript(installMicMocks);
    await context.route('**/*', async route => {
      const url = new URL(route.request().url());
      if (url.pathname === '/api/transcribe') {
        const body = JSON.parse(route.request().postData() || '{}');
        transcricoes.push({ lang: body.lang, bytes: Buffer.from(body.audioBase64 || '', 'base64').length });
        return route.fulfill({ json: { text: FALA } });
      }
      if (url.pathname === '/api/auth/session') return route.fulfill({ json: { user: { id: 'aluno-teste', role: 'student' }, csrfToken: 'csrf' } });
      if (url.pathname.startsWith('/api/')) return route.fulfill({ json: {} });
      if (url.origin !== base) return route.abort();
      return route.continue();
    });
    const page = await context.newPage();
    page.on('pageerror', e => erros.push(e.message));
    await page.clock.install();
    const resp = await page.goto(base + '/' + filename, { waitUntil: 'load' });
    assert.equal(resp.status(), 200);
    await page.waitForFunction(() => !!window.CapyMic);
    await fn({ page, transcricoes });
    // Erros de JS vindos do gravador ou dos chamadores dele reprovam o teste.
    assert.deepEqual(erros.filter(e => /CapyMic|MediaRecorder|onAutoStop|convMic|toggleMic|gravar|_stop/.test(e)), []);
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
}

const texto = (page, sel) => page.evaluate(s => document.querySelector(s).textContent, sel);
const micsAbertos = page => page.evaluate(() => window.__mic.tracks.filter(t => !t.stopped).length);

test('aula de curso: falar 15s+ no "Falar resposta" põe a fala na caixa, sem 2º toque', { timeout: 60_000 }, async () => {
  await withPage('agro_aula_01.html', async ({ page, transcricoes }) => {
    await page.locator('#conv-mic-0').dispatchEvent('click');
    await page.waitForFunction(() => document.getElementById('conv-mic-0').textContent.includes('Parar'));

    await page.clock.runFor(15_000);
    await page.waitForFunction(f => document.getElementById('conv-ta-0').value.includes(f), FALA);
    assert.equal(await texto(page, '#conv-mic-0'), '🎤 Falar resposta');
    assert.deepEqual(transcricoes.map(t => t.lang), ['en'], 'uma transcrição, entregue — não uma jogada fora');
    assert.ok(transcricoes[0].bytes > 0);
    assert.equal(await micsAbertos(page), 0);

    // Continuar a resposta num 2º toque, parando antes dos 15s, ACRESCENTA.
    await page.locator('#conv-mic-0').dispatchEvent('click');
    await page.waitForFunction(() => document.getElementById('conv-mic-0').textContent.includes('Parar'));
    await page.clock.runFor(3_000);
    await page.locator('#conv-mic-0').dispatchEvent('click');
    await page.waitForFunction(() => document.getElementById('conv-mic-0').textContent === '🎤 Falar resposta');
    assert.equal(await page.inputValue('#conv-ta-0'), FALA + ' ' + FALA);
    await page.clock.runFor(20_000);
    assert.equal(transcricoes.length, 2, 'a trava de uma gravação já parada não pode transcrever de novo');
  });
});

test('self-study: pronúncia com 15s+ mostra o que foi ouvido, não "Não ouvi nada"', { timeout: 60_000 }, async () => {
  await withPage('agro_aula_01.html', async ({ page, transcricoes }) => {
    const btn = page.locator('#speak-grid button', { hasText: '🎤 Falar' }).first();
    await btn.waitFor({ state: 'attached' });
    await btn.dispatchEvent('click');
    await page.waitForFunction(() => [...document.querySelectorAll('#speak-grid button')].some(b => b.textContent === '⏹ Parar'));

    await page.clock.runFor(15_000);
    await page.waitForFunction(f => document.body.innerText.includes(f), FALA);
    const pagina = await page.evaluate(() => document.body.innerText);
    assert.match(pagina, /Ouvi: "I can hear you/);
    assert.doesNotMatch(pagina, /Não ouvi nada/);
    assert.equal(transcricoes.length, 1);
    assert.equal(await micsAbertos(page), 0);
  });
});

test('trilha (lessons.html): a trava de 15s leva a fala para a correção, no idioma da trilha', { timeout: 60_000 }, async () => {
  await withPage('lessons.html', async ({ page, transcricoes }) => {
    const feedback = await page.evaluate(() => {
      // Só o pedaço do Speak step que o toggleMic usa.
      document.body.insertAdjacentHTML('beforeend', '<button id="mic-btn"></button><span id="mic-hint"></span><div id="speak-feedback" class="hidden"></div>');
      CUR_TTS_LANG = 'fr-FR';
      window.__feedback = [];
      showSpeakFeedback = (ok, falado) => window.__feedback.push(falado);
      toggleMic('Je t\'entends mais je ne te vois pas');
      return true;
    });
    assert.ok(feedback);
    await page.waitForFunction(() => isListening === true && window.CapyMic.isRecording());

    await page.clock.runFor(15_000);
    await page.waitForFunction(() => window.__feedback.length > 0);
    assert.deepEqual(await page.evaluate(() => window.__feedback), [FALA], 'antes: "(nada foi ouvido)"');
    assert.deepEqual(transcricoes.map(t => t.lang), ['fr']);
    assert.equal(await page.evaluate(() => isListening), false);
    assert.equal(await texto(page, '#mic-hint'), 'Toque para falar');
  });
});

test('contrato do CapyMic: trava guarda o áudio, transcreve uma vez, respeita cancel e a corrida com o toque', { timeout: 60_000 }, async () => {
  await withPage('agro_aula_01.html', async ({ page, transcricoes }) => {
    assert.equal(await page.evaluate(() => CapyMic.MAX_MS), 15_000);

    // Chamador antigo, sem onAutoStop: a trava para, NÃO transcreve sozinha, e o
    // próximo stopAndTranscribe entrega o áudio guardado — com o idioma dele.
    await page.evaluate(() => CapyMic.start());
    await page.clock.runFor(15_000);
    assert.equal(await page.evaluate(() => CapyMic.isRecording()), false);
    assert.equal(await micsAbertos(page), 0, 'a trava solta o microfone');
    await new Promise(r => setTimeout(r, 500)); // tempo real para um fetch que saísse chegar à rota
    assert.equal(transcricoes.length, 0, 'ninguém pediu o texto ainda: nada é cobrado');
    assert.deepEqual(await page.evaluate(() => CapyMic.stopAndTranscribe({ lang: 'fr' })), { text: FALA, empty: false });
    assert.deepEqual(transcricoes.map(t => t.lang), ['fr']);

    // Dois pedidos para a mesma gravação: uma transcrição só.
    await page.evaluate(() => CapyMic.start());
    const [a, b] = await page.evaluate(() => Promise.all([CapyMic.stopAndTranscribe({ lang: 'en' }), CapyMic.stopAndTranscribe({ lang: 'en' })]));
    assert.deepEqual(a, { text: FALA, empty: false });
    assert.deepEqual(b, { text: '', empty: true });
    assert.equal(transcricoes.length, 2);

    // cancel depois da trava: o áudio guardado é descartado sem ir ao Whisper.
    await page.evaluate(() => CapyMic.start());
    await page.clock.runFor(15_000);
    await page.evaluate(() => CapyMic.cancel());
    assert.deepEqual(await page.evaluate(() => CapyMic.stopAndTranscribe({ lang: 'en' })), { text: '', empty: true });
    assert.equal(transcricoes.length, 2);

    // Parar antes dos 15s desarma a trava: nada de onAutoStop depois.
    await page.evaluate(() => { window.__auto = 0; return CapyMic.start({ onAutoStop: () => window.__auto++ }); });
    await page.clock.runFor(5_000);
    assert.equal((await page.evaluate(() => CapyMic.stopAndTranscribe({ lang: 'en' }))).text, FALA);
    await page.clock.runFor(20_000);
    assert.equal(await page.evaluate(() => window.__auto), 0);
    assert.equal(transcricoes.length, 3);

    // Corrida: a trava disparou e o gravador ainda está parando quando o aluno
    // toca em "parar". O toque leva o texto; o onAutoStop não roda.
    await page.evaluate(() => { window.__mic.holdStop = true; window.__auto = 0; return CapyMic.start({ onAutoStop: () => window.__auto++ }); });
    await page.clock.runFor(15_000);
    const pedido = page.evaluate(() => CapyMic.stopAndTranscribe({ lang: 'en' }));
    await page.evaluate(() => window.__mic.release());
    assert.deepEqual(await pedido, { text: FALA, empty: false });
    assert.equal(await page.evaluate(() => window.__auto), 0);
    assert.equal(transcricoes.length, 4);
    assert.equal(await micsAbertos(page), 0);
  });
});

// ── /api/transcribe: o `lang` do cliente vai cru para o corpo multipart ─────

function transcribeHarness(body) {
  const source = fs.readFileSync(path.join(ROOT, 'api/index.js'), 'utf8');
  const start = source.indexOf("    if (req.method === 'POST' && url === '/api/transcribe') {");
  const end = source.indexOf('// ── Admin: conceder plano por e-mail', start);
  assert.ok(start > 0 && end > start, 'a rota /api/transcribe tem que existir');
  const langs = source.match(/^const TRANSCRIBE_LANGS = (\[[^\]]*\]);/m);
  assert.ok(langs, 'TRANSCRIBE_LANGS tem que existir no topo do api/index.js');
  const enviados = [];
  const res = { statusCode: 200, body: null, setHeader() {}, status(c) { this.statusCode = c; return this; }, json(b) { this.body = b; return this; } };
  const https = { request(opts, cb) {
    const out = new EventEmitter();
    const pedido = { opts, partes: [] };
    enviados.push(pedido);
    out.write = d => pedido.partes.push(Buffer.from(d));
    out.end = () => queueMicrotask(() => { const inc = new EventEmitter(); cb(inc); inc.emit('data', JSON.stringify({ text: ' ok ' })); inc.emit('end'); });
    return out;
  } };
  const context = vm.createContext({
    req: { method: 'POST' }, res, url: '/api/transcribe', origin: null, https, crypto, Buffer, JSON, Math,
    readBody: async () => body, checkRateLimit: async () => ({ ok: true }), rateLimitedResponse() {},
    MAX_AUDIO_BODY: 8 * 1024 * 1024, CHAT_KEY: 'k', API_KEY: 'k',
    TRANSCRIBE_LANGS: vm.runInNewContext(langs[1]),
  });
  vm.runInContext('async function rota() {\n' + source.slice(start, end) + '\n}', context);
  return { run: () => context.rota(), res, corpo: () => Buffer.concat(enviados[0].partes).toString('latin1') };
}

test('/api/transcribe só repassa idioma da lista; o resto não entra no corpo multipart', async () => {
  const audioBase64 = Buffer.alloc(400, 1).toString('base64');
  for (const lang of ['en', 'fr', 'tr', 'pt']) {
    const h = transcribeHarness({ audioBase64, mimeType: 'audio/webm', lang });
    await h.run();
    assert.equal(h.res.statusCode, 200);
    assert.ok(h.corpo().includes(`name="language"\r\n\r\n${lang}\r\n`), lang + ' tem que chegar ao Whisper');
  }
  const forjado = 'en\r\n--x\r\nContent-Disposition: form-data; name="model"\r\n\r\ngpt-4o-transcribe';
  for (const lang of [forjado, 'xx', 'EN', '', undefined, 42, ['en']]) {
    const h = transcribeHarness({ audioBase64, mimeType: 'audio/webm', lang });
    await h.run();
    assert.equal(h.res.statusCode, 200);
    const corpo = h.corpo();
    assert.ok(!corpo.includes('name="language"'), JSON.stringify(lang) + ' não pode virar campo language');
    assert.ok(!corpo.includes('gpt-4o-transcribe'));
    assert.equal(corpo.split('name="model"').length - 1, 1);
  }
});
