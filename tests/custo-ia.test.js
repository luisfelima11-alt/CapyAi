'use strict';

// AI cost (29/set). Every AI call now records what it cost (tokens x price of
// the model that answered, TTS by character, transcription by minute), and the
// answers that are the same for everyone (word of the day, daily challenge,
// lesson quiz, translation) are generated once and kept. Supabase is a small
// fake server here and OpenAI a fake https.request: nothing leaves the machine.
const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const https = require('node:https');
const { EventEmitter } = require('node:events');
const { Readable } = require('node:stream');

// ── Fake Supabase (PostgREST) ────────────────────────────────────────────────
const banco = { cache: new Map(), metricas: new Map(), semColunaDeCusto: false, pedidos: [] };
const chaveMetrica = (dia, rota) => `${dia}|${rota}`;

const servidor = http.createServer((req, res) => {
  const u = new URL(req.url, 'http://x');
  const tabela = u.pathname.replace('/rest/v1/', '');
  banco.pedidos.push(`${req.method} ${u.pathname.replace('/rest/v1', '')}${u.search}`);
  const filtro = (campo, op = 'eq') => {
    const v = u.searchParams.get(campo);
    return v && v.startsWith(`${op}.`) ? v.slice(op.length + 1) : null;
  };
  const responder = (status, corpo) => {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(corpo === undefined ? '' : JSON.stringify(corpo));
  };
  let bruto = '';
  req.on('data', c => { bruto += c; });
  req.on('end', () => {
    const corpo = bruto ? JSON.parse(bruto) : null;
    if (tabela === 'ai_cache') {
      if (req.method === 'GET') {
        const linha = banco.cache.get(filtro('cache_key'));
        const desde = filtro('created_at', 'gte');
        const valida = linha && (!desde || linha.created_at >= desde);
        return responder(200, valida ? [{ answer: linha.answer }] : []);
      }
      if (req.method === 'POST') { banco.cache.set(corpo.cache_key, corpo); return responder(201); }
      if (req.method === 'DELETE') return responder(204);
    }
    if (tabela === 'api_metrics_daily') {
      const selecionaCusto = String(u.searchParams.get('select') || '').includes('cost_usd');
      if (req.method === 'GET' && filtro('endpoint')) {
        const linha = banco.metricas.get(chaveMetrica(filtro('day'), filtro('endpoint')));
        return responder(200, linha ? [linha] : []);
      }
      if (req.method === 'GET') {
        if (banco.semColunaDeCusto && selecionaCusto) {
          return responder(400, { code: '42703', message: 'column api_metrics_daily.cost_usd does not exist' });
        }
        // The month summary asks only for the AI rows. Like Supabase, never
        // more than 1000 rows per read, whatever the limit asked.
        const soIa = u.searchParams.get('or') === '(cost_usd.gt.0,cache_hits.gt.0)';
        const linhas = [...banco.metricas.values()].filter(l => !soIa || l.cost_usd > 0 || l.cache_hits > 0);
        const inicio = Number(u.searchParams.get('offset')) || 0;
        const limite = Math.min(Number(u.searchParams.get('limit')) || Infinity, 1000);
        return responder(200, linhas.slice(inicio, inicio + limite));
      }
      if (req.method === 'POST') {
        if (banco.semColunaDeCusto && ('cost_usd' in corpo || 'cache_hits' in corpo)) {
          return responder(400, { code: 'PGRST204', message: "Could not find the 'cost_usd' column" });
        }
        banco.metricas.set(chaveMetrica(corpo.day, corpo.endpoint), corpo);
        return responder(201);
      }
    }
    responder(404, { message: 'not found' });   // rpc/consume_rate_limit: the API falls back to memory
  });
});

// ── Fake OpenAI (https.request) ──────────────────────────────────────────────
const chamadasIa = [];
let respostaIa = null;   // { status, corpo } for the next calls
const httpsOriginal = https.request;
https.request = (opcoes, cb) => {
  const pedido = new EventEmitter();
  let enviado = '';
  pedido.write = pedaco => { enviado += pedaco; };
  pedido.destroy = () => {};
  pedido.end = () => {
    chamadasIa.push({ caminho: opcoes.path, corpo: enviado });
    setImmediate(() => {
      const r = new EventEmitter();
      r.statusCode = respostaIa.status;
      r.pipe = destino => destino.end(Buffer.from('ID3-audio-falso'));
      cb(r);
      if (typeof respostaIa.corpo === 'string') { r.emit('data', respostaIa.corpo); r.emit('end'); }
    });
  };
  return pedido;
};

const respostaDoChat = (texto, usage = { prompt_tokens: 1000, completion_tokens: 500 }) => ({
  status: 200,
  corpo: JSON.stringify({ model: 'gpt-4o-mini-2024-07-18', usage, choices: [{ message: { content: texto } }] }),
});

// ── API under test (env read at load time) ───────────────────────────────────
let api, I;
test.before(async () => {
  await new Promise(resolve => servidor.listen(0, '127.0.0.1', resolve));
  process.env.SUPABASE_URL = `http://127.0.0.1:${servidor.address().port}`;
  process.env.SUPABASE_SECRET_KEY = 'x'.repeat(24);
  process.env.OPENAI_API_KEY = 'x'.repeat(24);
  delete process.env.OPENROUTER_API_KEY;
  api = require('../api/index');
  I = api._internos;
});
test.after(() => { https.request = httpsOriginal; servidor.close(); });

function respostaFalsa() {
  const res = new EventEmitter();
  res.statusCode = 200; res.headers = {}; res.body = ''; res.headersSent = false;
  res.setHeader = (k, v) => { res.headers[String(k).toLowerCase()] = v; };
  res.getHeader = k => res.headers[String(k).toLowerCase()];
  res.removeHeader = k => { delete res.headers[String(k).toLowerCase()]; };
  res.status = c => { res.statusCode = c; return res; };
  res.json = v => { res.setHeader('Content-Type', 'application/json'); return res.end(JSON.stringify(v)); };
  res.end = v => {
    if (v) res.body += Buffer.isBuffer(v) ? v.toString('utf8') : String(v);
    res.headersSent = true; res.emit('finish'); return res;
  };
  return res;
}

async function chamar(metodo, url, corpo, preparar) {
  // A real stream keeps the body until the API reads it: the API does I/O
  // (the rate limit) before readBody, and an event emitted earlier would be lost.
  const req = Readable.from(corpo ? [Buffer.from(JSON.stringify(corpo))] : []);
  req.method = metodo; req.url = url; req.headers = corpo ? { 'content-type': 'application/json' } : {};
  req.socket = { remoteAddress: '198.51.100.7' };
  const res = respostaFalsa();
  if (preparar) preparar(res);
  const terminou = new Promise(resolve => res.once('finish', resolve));
  await api(req, res);
  await terminou;
  let json = null; try { json = JSON.parse(res.body); } catch (e) { /* audio */ }
  return { status: res.statusCode, headers: res.headers, body: res.body, json };
}
const textoDa = r => r.json && r.json.candidates && r.json.candidates[0].content.parts[0].text;

// ── Price and cost ───────────────────────────────────────────────────────────
test('price: alias, dated id and OpenRouter id share a price; an unknown model has none', () => {
  assert.deepEqual(I.precoDoModelo('gpt-4o-mini'), { entrada: 0.15, saida: 0.60 });
  assert.deepEqual(I.precoDoModelo('gpt-4o-mini-2024-07-18'), { entrada: 0.15, saida: 0.60 });
  assert.deepEqual(I.precoDoModelo('openai/gpt-4o-mini'), { entrada: 0.15, saida: 0.60 });
  assert.equal(I.precoDoModelo('gpt-4o-mini-tts'), null);   // audio is priced elsewhere, not as text
  assert.equal(I.precoDoModelo('modelo-que-nao-existe'), null);
});

test('cost: tokens x list price, and OpenRouter\'s reported cost wins', () => {
  // 1000 in x 0.15 + 500 out x 0.60, per million
  assert.equal(I.custoDaChamada('gpt-4o-mini', { prompt_tokens: 1000, completion_tokens: 500 }).toFixed(8), '0.00045000');
  assert.equal(I.custoDaChamada('openai/gpt-4o-mini', { prompt_tokens: 1000, completion_tokens: 500, cost: 0.0009 }), 0.0009);
  assert.equal(I.custoDaChamada('modelo-que-nao-existe', { prompt_tokens: 1000 }), null);
  assert.equal(I.custoDaChamada('gpt-4o-mini', null), null);
});

test('metrics: the cost is saved with the counts, and without the column the counts still land', async () => {
  const dia = new Date().toISOString().slice(0, 10);
  I.bumpTokens('/api/teste-custo', { prompt_tokens: 2000, completion_tokens: 1000 }, 'gpt-4o-mini');
  I.bumpCustoIa('/api/teste-custo', 0.001);
  I.bumpCacheIa('/api/teste-custo');
  await I.persistMetrics();
  const linha = banco.metricas.get(chaveMetrica(dia, '/api/teste-custo'));
  assert.equal(linha.tokens_in, 2000);
  assert.equal(linha.tokens_out, 1000);
  assert.equal(Number(linha.cost_usd).toFixed(6), '0.001900');   // 0.0003 + 0.0006 + 0.001
  assert.equal(linha.cache_hits, 1);

  banco.semColunaDeCusto = true;
  try {
    I.bumpTokens('/api/teste-sem-coluna', { prompt_tokens: 10, completion_tokens: 5 }, 'gpt-4o-mini');
    await I.persistMetrics();
    const semCusto = banco.metricas.get(chaveMetrica(dia, '/api/teste-sem-coluna'));
    assert.ok(semCusto, 'the row must be saved without cost_usd');
    assert.equal(semCusto.tokens_in, 10);
    assert.equal('cost_usd' in semCusto, false);
    assert.equal('cache_hits' in semCusto, false);
    assert.deepEqual(await I.custoIaDoMes(), { faltaMigration: true });
  } finally { banco.semColunaDeCusto = false; }
});

// ── Shared cache ─────────────────────────────────────────────────────────────
test('word of the day: generated once, then the same word for everyone without calling the AI', async () => {
  chamadasIa.length = 0;
  respostaIa = respostaDoChat('{"word":"reliable","emoji":"🤝"}');
  const primeira = await chamar('GET', '/api/word-of-day');
  assert.equal(primeira.status, 200);
  assert.equal(textoDa(primeira), '{"word":"reliable","emoji":"🤝"}');
  assert.equal(chamadasIa.length, 1);

  respostaIa = respostaDoChat('{"word":"outra palavra"}');
  const segunda = await chamar('GET', '/api/word-of-day');
  assert.equal(textoDa(segunda), '{"word":"reliable","emoji":"🤝"}');
  assert.equal(chamadasIa.length, 1, 'the second visit must not call the AI');

  // Both visits are requests of the route; the cache answered one of them.
  await I.persistMetrics();
  const linha = banco.metricas.get(chaveMetrica(new Date().toISOString().slice(0, 10), '/api/word-of-day'));
  assert.equal(linha.requests, 2);
  assert.equal(linha.cache_hits, 1);
  // The entry names the route and holds the answer, nothing about who asked.
  const [guardada] = [...banco.cache.values()];
  assert.deepEqual(Object.keys(guardada).sort(), ['answer', 'cache_key', 'created_at', 'route']);
  assert.equal(guardada.route, '/api/word-of-day');

  // Past its validity (36 h for the routes of the day) the entry is generated again.
  guardada.created_at = new Date(Date.now() - 37 * 3600 * 1000).toISOString();
  respostaIa = respostaDoChat('{"word":"curious"}');
  const depois = await chamar('GET', '/api/word-of-day');
  assert.equal(textoDa(depois), '{"word":"curious"}');
  assert.equal(chamadasIa.length, 2);
});

test('a broken answer is not cached: the next request tries the AI again', async () => {
  chamadasIa.length = 0;
  respostaIa = respostaDoChat('isto não é JSON');
  await chamar('POST', '/api/translate', { word: 'bridge', targetLang: 'Portuguese' });
  respostaIa = respostaDoChat('{"translation":"ponte","example":"A ponte é nova."}');
  const r = await chamar('POST', '/api/translate', { word: 'bridge', targetLang: 'Portuguese' });
  assert.equal(chamadasIa.length, 2);
  assert.equal(textoDa(r), '{"translation":"ponte","example":"A ponte é nova."}');
  await chamar('POST', '/api/translate', { word: 'bridge', targetLang: 'Portuguese' });
  assert.equal(chamadasIa.length, 2, 'the good answer is served from the cache');
});

test('an object answer is cached only with the fields its page shows', () => {
  const palavra = I.objetoComCampos('word');
  assert.equal(palavra('{"word":"reliable","emoji":"🤝"}'), true);
  assert.equal(palavra('{"word":"  "}'), false);
  assert.equal(palavra('{"emoji":"🤝"}'), false);
  assert.equal(palavra('["reliable"]'), false);
  assert.equal(palavra('isto não é JSON'), false);
});

test('lesson quiz: only a quiz the page can use is cached', () => {
  const quiz = [1, 2, 3, 4, 5].map(i => ({ q: `Pergunta ${i}`, opts: ['go', 'went', 'gone', 'going'], a: 'went', explain: 'passado' }));
  assert.equal(I.ehQuizDaLicao(JSON.stringify(quiz)), true);
  assert.equal(I.ehQuizDaLicao('```json\n' + JSON.stringify(quiz) + '\n```'), true);   // the page strips fences
  assert.equal(I.ehQuizDaLicao(JSON.stringify(quiz.map(p => ({ ...p, a: 'A' })))), false);  // answer outside the options
  assert.equal(I.ehQuizDaLicao(JSON.stringify(quiz.slice(0, 2))), false);
  assert.equal(I.ehQuizDaLicao('{"q":"x"}'), false);
});

test('the cache key changes with the prompt and the model', () => {
  const base = { model: 'gpt-4o-mini', messages: [{ role: 'user', content: 'A' }], max_tokens: 80, temperature: 0.3 };
  const k = I.chaveDoCacheIa('/api/translate', base);
  assert.match(k, /^[0-9a-f]{64}$/);
  assert.notEqual(k, I.chaveDoCacheIa('/api/translate', { ...base, messages: [{ role: 'user', content: 'B' }] }));
  assert.notEqual(k, I.chaveDoCacheIa('/api/translate', { ...base, model: 'google/gemini-2.5-flash-lite' }));
  assert.notEqual(k, I.chaveDoCacheIa('/api/lesson-quiz', base));
});

test('month summary: cost per route, requests the cache answered and what they saved', async () => {
  banco.metricas.clear();
  const dia = new Date().toISOString().slice(0, 10);
  const linha = (endpoint, requests, cost_usd, cache_hits = 0) =>
    banco.metricas.set(chaveMetrica(dia, endpoint), { day: dia, endpoint, requests, cost_usd, cache_hits });
  linha('/api/chat', 10, 0.02);
  linha('/api/word-of-day', 5, 0.001, 4);       // 5 requests: 4 came from the cache, 1 reached the AI
  linha('/api/db', 50, 0);
  // More AI rows than one Supabase read returns (1000): all of them count.
  for (let i = 0; i < 1100; i++) linha(`/api/rota-${i}`, 1, 0.0001);
  const r = await I.custoIaDoMes();
  assert.equal(r.usd, 0.131);                   // 0.02 + 0.001 + 1100 x 0.0001
  assert.deepEqual(r.rotas.slice(0, 2).map(x => x.rota), ['/api/chat', '/api/word-of-day']);
  assert.equal(r.rotas.length, 8);
  assert.equal(r.evitadas, 4);
  assert.equal(r.economiaUsd, 0.004);           // 4 x (0.001 / 1)
  banco.metricas.clear();
});

// ── Voz Nova (TTS) ───────────────────────────────────────────────────────────
test('TTS: the CDN may keep the audio for everyone, but never a response carrying a cookie', async () => {
  respostaIa = { status: 200, corpo: null };
  const semCookie = await chamar('GET', '/api/tts?text=Good%20morning&voice=nova&lang=en');
  assert.equal(semCookie.status, 200);
  assert.equal(semCookie.headers['content-type'], 'audio/mpeg');
  assert.equal(semCookie.headers['vercel-cdn-cache-control'], 'max-age=31536000');
  assert.equal(semCookie.headers.pragma, undefined);

  const comCookie = await chamar('GET', '/api/tts?text=Good%20night&voice=nova&lang=en',
    null, res => res.setHeader('Set-Cookie', ['capy-access=renovado; HttpOnly']));
  assert.equal(comCookie.status, 200);
  assert.equal(comCookie.headers['vercel-cdn-cache-control'], undefined);
});
