'use strict';

// Jev "observando" (30/set). The OpenRouter key alone turns on only Jev: the text
// routes stay on OpenAI. Jev grades the daily challenge and the free writing next
// to the AI; the pair goes to jev_decisions and the student sees only the AI.
// Supabase is a small fake server here, and OpenAI/OpenRouter a fake https.request.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const https = require('node:https');
const { EventEmitter } = require('node:events');
const { Readable } = require('node:stream');

const ROOT = path.resolve(__dirname, '..');

// ── Fake Supabase (PostgREST) ────────────────────────────────────────────────
const banco = { decisoes: [], semTabela: false };
const servidor = http.createServer((req, res) => {
  const u = new URL(req.url, 'http://x');
  const tabela = u.pathname.replace('/rest/v1/', '');
  const responder = (status, corpo) => {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(corpo === undefined ? '' : JSON.stringify(corpo));
  };
  let bruto = '';
  req.on('data', c => { bruto += c; });
  req.on('end', () => {
    if (tabela === 'jev_decisions') {
      if (banco.semTabela) return responder(404, { code: 'PGRST205', message: "Could not find the table 'public.jev_decisions'" });
      if (req.method === 'POST') { banco.decisoes.push(JSON.parse(bruto)); return responder(201); }
      if (req.method === 'GET') {
        const inicio = Number(u.searchParams.get('offset')) || 0;
        return responder(200, banco.decisoes.slice(inicio, inicio + Math.min(Number(u.searchParams.get('limit')) || 1000, 1000)));
      }
    }
    if (req.method === 'GET') return responder(200, []);
    if (req.method === 'POST' && tabela !== 'rpc/consume_rate_limit') return responder(201);
    responder(404, { message: 'not found' });   // rpc/consume_rate_limit: the API falls back to memory
  });
});

// ── Fake OpenAI and OpenRouter (https.request) ───────────────────────────────
const chamadas = [];
const respostas = { chat: null, jev: null };   // { status, corpo } or 'nunca' (never answers)
const httpsOriginal = https.request;
https.request = (opcoes, cb) => {
  const pedido = new EventEmitter();
  let enviado = '';
  pedido.write = pedaco => { enviado += pedaco; };
  pedido.destroy = erro => { if (erro) setImmediate(() => pedido.emit('error', erro)); };
  pedido.end = () => {
    const ehJev = opcoes.hostname === 'openrouter.ai' && opcoes.path === '/api/alpha/decisions';
    chamadas.push({ host: opcoes.hostname, caminho: opcoes.path, headers: opcoes.headers, corpo: enviado ? JSON.parse(enviado) : null });
    const resposta = ehJev ? respostas.jev : respostas.chat;
    if (resposta === 'nunca') return;
    setImmediate(() => {
      const r = new EventEmitter();
      r.statusCode = resposta.status;
      cb(r);
      r.emit('data', resposta.corpo);
      r.emit('end');
      pedido.emit('close');
    });
  };
  return pedido;
};

const doChat = texto => ({ status: 200, corpo: JSON.stringify({ model: 'gpt-4o-mini-2024-07-18', usage: { prompt_tokens: 300, completion_tokens: 60 }, choices: [{ message: { content: texto } }] }) });
const doJev = (nota, extra = {}) => ({ status: 200, corpo: JSON.stringify({ model: 'typesafe/jev-1.13', answers: { nota }, usage: { prompt_tokens: 200 }, ...extra }) });

// ── API under test (env read at load time) ───────────────────────────────────
let api, I;
test.before(async () => {
  await new Promise(resolve => servidor.listen(0, '127.0.0.1', resolve));
  process.env.SUPABASE_URL = `http://127.0.0.1:${servidor.address().port}`;
  process.env.SUPABASE_SECRET_KEY = 's'.repeat(24);
  process.env.OPENAI_API_KEY = 'o'.repeat(24);
  process.env.OPENROUTER_API_KEY = 'r'.repeat(24);
  delete process.env.OPENROUTER_TEXTO;
  delete process.env.JEV_NOTAS;
  process.env.JEV_PRAZO_MS = '300';
  api = require('../api/index');
  I = api._internos;
});
test.after(() => { https.request = httpsOriginal; servidor.close(); });

let ip = 10;
async function chamar(metodo, url, corpo) {
  // A real stream keeps the body until the API reads it (the rate limit runs first).
  const req = Readable.from(corpo ? [Buffer.from(JSON.stringify(corpo))] : []);
  req.method = metodo; req.url = url;
  req.headers = { 'content-type': 'application/json', 'x-forwarded-for': `198.51.100.${ip++}` };
  req.socket = { remoteAddress: '198.51.100.1' };
  const res = new EventEmitter();
  res.statusCode = 200; res.headers = {}; res.body = ''; res.headersSent = false;
  res.setHeader = (k, v) => { res.headers[String(k).toLowerCase()] = v; };
  res.getHeader = k => res.headers[String(k).toLowerCase()];
  res.status = c => { res.statusCode = c; return res; };
  res.json = v => { res.setHeader('Content-Type', 'application/json'); return res.end(JSON.stringify(v)); };
  res.end = v => { if (v) res.body += String(v); res.headersSent = true; res.emit('finish'); return res; };
  const terminou = new Promise(resolve => res.once('finish', resolve));
  await api(req, res);
  await terminou;
  let json = null; try { json = JSON.parse(res.body); } catch (e) { /* not JSON */ }
  return { status: res.statusCode, json };
}
const jevChamadas = () => chamadas.filter(c => c.host === 'openrouter.ai');
function limpar() { chamadas.length = 0; banco.decisoes.length = 0; }

// ── The key turns on only Jev ────────────────────────────────────────────────
test('the OpenRouter key alone keeps the text routes on OpenAI; OPENROUTER_TEXTO=1 moves them', async () => {
  assert.equal(I.textoPelaOpenRouter({ OPENROUTER_API_KEY: 'k', OPENAI_API_KEY: 'o' }), false);
  assert.equal(I.textoPelaOpenRouter({ OPENROUTER_API_KEY: 'k', OPENAI_API_KEY: 'o', OPENROUTER_TEXTO: '1' }), true);
  assert.equal(I.textoPelaOpenRouter({ OPENROUTER_API_KEY: 'k' }), true);   // no OpenAI key: nothing else to use
  assert.equal(I.textoPelaOpenRouter({ OPENAI_API_KEY: 'o', OPENROUTER_TEXTO: '1' }), false);

  limpar();
  respostas.chat = doChat('{"translation":"ponte","example":"A ponte é nova."}');
  await chamar('POST', '/api/translate', { word: 'bridge-jev', targetLang: 'Portuguese' });
  assert.deepEqual(chamadas.map(c => c.host), ['api.openai.com']);
});

// ── Daily challenge: the AI grades, Jev grades alongside ─────────────────────
test('daily challenge: the AI grade reaches the student and Jev\'s grade is recorded next to it', async () => {
  limpar();
  respostas.chat = doChat('{"stars":3,"feedback":"Great sentence! Clear and correct."}');
  respostas.jev = doJev({ score: 2, probabilities: [0.05, 0.15, 0.8], confidence: 0.92 });
  const r = await chamar('POST', '/api/daily-challenge/avaliar', {
    instruction: 'Describe your morning routine in one sentence.',
    answer: 'I wake up at 6 and <b>drink</b> coffee\nbefore work.',
  });
  assert.equal(r.status, 200);
  assert.deepEqual(r.json, { stars: 3, feedback: 'Great sentence! Clear and correct.' });

  const [jev] = jevChamadas();
  assert.equal(jev.caminho, '/api/alpha/decisions');
  assert.equal(jev.headers.Authorization, `Bearer ${'r'.repeat(24)}`);
  assert.equal(jev.corpo.model, '~typesafe/jev-latest');
  assert.deepEqual(jev.corpo.state, {
    challenge: 'Describe your morning routine in one sentence.',
    answer: 'I wake up at 6 and b drink /b coffee before work.',   // student text passes the prompt filter
  });
  assert.equal(jev.corpo.questions.nota.type, 'score');
  assert.deepEqual(jev.corpo.questions.nota.criteria, I.RUBRICA_DESAFIO);

  assert.equal(banco.decisoes.length, 1);
  const d = banco.decisoes[0];
  assert.equal(d.use_case, 'desafio');
  assert.equal(d.levels, 3);
  assert.equal(d.jev_level, 2.75);            // 0.05 x 1 + 0.15 x 2 + 0.8 x 3
  assert.equal(d.jev_confidence, 0.92);
  assert.equal(d.ai_level, 3);
  assert.equal(d.error, null);
  assert.equal(d.cost_usd, 0.0000084);        // 200 input tokens x US$ 0.042 per million
  assert.equal(Object.keys(d).some(k => /text|answer|user|student/i.test(k)), false, 'no text and no student in the row');
});

test('daily challenge: Jev failing or late never changes what the student gets', async () => {
  for (const [jev, erro] of [[{ status: 500, corpo: '{"error":"x"}' }, 'http_500'], ['nunca', 'prazo'], [doJev(null, { answers: {} }), 'formato']]) {
    limpar();
    respostas.chat = doChat('{"stars":2,"feedback":"Good try. Say: I go to work by bus."}');
    respostas.jev = jev;
    const r = await chamar('POST', '/api/daily-challenge/avaliar', { instruction: 'How do you get to work?', answer: 'I go to work with bus.' });
    assert.equal(r.status, 200, erro);
    assert.deepEqual(r.json, { stars: 2, feedback: 'Good try. Say: I go to work by bus.' }, erro);
    assert.equal(banco.decisoes.length, 1, erro);
    assert.equal(banco.decisoes[0].error, erro);
    assert.equal(banco.decisoes[0].jev_level, null, erro);
    assert.equal(banco.decisoes[0].ai_level, 2, erro);
  }
});

test('daily challenge: a missing answer is refused before any AI call; an AI failure is a clear 502', async () => {
  limpar();
  const vazia = await chamar('POST', '/api/daily-challenge/avaliar', { instruction: 'Describe your city.', answer: 'hi' });
  assert.equal(vazia.status, 400);
  assert.equal(vazia.json.error, 'invalid_answer');
  assert.equal(chamadas.length, 0);

  respostas.chat = { status: 500, corpo: '{"error":{"message":"down"}}' };
  respostas.jev = doJev({ probabilities: [0.1, 0.8, 0.1], confidence: 0.7 });
  const falha = await chamar('POST', '/api/daily-challenge/avaliar', { instruction: 'Describe your city.', answer: 'My city is small and calm.' });
  assert.equal(falha.status, 502);
  assert.equal(falha.json.error, 'ai_unavailable');
  assert.equal(banco.decisoes[0].ai_level, null, 'Jev\'s grade is kept, with no AI grade to compare');
});

test('daily challenge page asks the grading route, not /api/chat with a prompt the server ignores', () => {
  const pagina = fs.readFileSync(path.join(ROOT, 'daily_challenge.html'), 'utf8');
  assert.match(pagina, /fetch\('\/api\/daily-challenge\/avaliar'/);
  assert.doesNotMatch(pagina, /systemOverride|young children/);
  assert.match(fs.readFileSync(path.join(ROOT, 'api', 'index.js'), 'utf8'), /\['\/api\/daily-challenge\/avaliar', 'chat'\]/);
});

// ── Free writing: same answer, Jev alongside (English only) ──────────────────
test('writing correction: the student gets the AI correction; Jev grades English texts only', async () => {
  const correcao = { score: 4, praise: 'Bom texto!', errors: [{ original: 'I goed', fixed: 'I went', why: 'passado irregular' }], improved: 'I went to the beach.', tip: 'Revise os verbos irregulares.' };
  limpar();
  respostas.chat = doChat(JSON.stringify(correcao));
  respostas.jev = doJev({ probabilities: [0, 0, 0.1, 0.7, 0.2], confidence: 0.81 });
  const r = await chamar('POST', '/api/correct-writing', { text: 'Yesterday I goed to the beach with my family.', task: 'Write about your weekend.', lang: 'en' });
  assert.equal(r.status, 200);
  assert.deepEqual(r.json, correcao);
  assert.deepEqual(jevChamadas()[0].corpo.questions.nota.criteria, I.RUBRICA_REDACAO);
  assert.equal(banco.decisoes[0].use_case, 'redacao');
  assert.equal(banco.decisoes[0].levels, 5);
  assert.equal(banco.decisoes[0].ai_level, 4);
  assert.equal(banco.decisoes[0].jev_level, 4.1);

  limpar();
  respostas.chat = doChat(JSON.stringify({ ...correcao, improved: 'Hier, je suis allé à la plage.' }));
  const frances = await chamar('POST', '/api/correct-writing', { text: 'Hier je suis allé a la plage.', task: 'Écrivez sur votre week-end.', lang: 'fr' });
  assert.equal(frances.status, 200);
  assert.equal(jevChamadas().length, 0, 'Jev is English-first: French stays with the AI alone');
  assert.equal(banco.decisoes.length, 0);
});

// ── Reading Jev's answer ─────────────────────────────────────────────────────
test('Jev\'s answer is read from the plausible places, by probabilities first', () => {
  const niveis = ['baixo', 'medio', 'alto'];
  assert.deepEqual(I.respostaDoJev({ results: { nota: { score: 1 } } }, 'nota'), { score: 1 });
  assert.deepEqual(I.respostaDoJev({ nota: { score: 1 } }, 'nota'), { score: 1 });
  assert.equal(I.respostaDoJev({ answers: {} }, 'nota'), null);
  assert.deepEqual(I.nivelDoScore({ probabilities: { baixo: 0, medio: 0.5, alto: 0.5 } }, niveis), { nivel: 2.5, pelasProbabilidades: true });
  assert.deepEqual(I.nivelDoScore({ probabilities: [{ probability: 1 }, { probability: 0 }, { probability: 0 }] }, niveis), { nivel: 1, pelasProbabilidades: true });
  assert.deepEqual(I.nivelDoScore({ score: 1.5 }, niveis), { nivel: 2.5, pelasProbabilidades: false });
  assert.equal(I.nivelDoScore({ score: 7 }, niveis), null);
  assert.equal(I.nivelDoScore({ probabilities: [0.5, 0.5] }, niveis), null);
});

// ── What the admin shows ─────────────────────────────────────────────────────
test('month summary: how often Jev agrees with the AI, overall and when confident', async () => {
  limpar();
  const linha = (use_case, jev_level, jev_confidence, ai_level, error = null) =>
    banco.decisoes.push({ use_case, jev_level, jev_confidence, ai_level, cost_usd: 0.00001, error });
  linha('desafio', 2.9, 0.95, 3);     // agrees, confident
  linha('desafio', 2.2, 0.60, 3);     // disagrees
  linha('desafio', 1.1, 0.92, 2);     // disagrees, confident
  linha('desafio', null, null, 3, 'prazo');
  linha('redacao', 4.3, 0.91, 4);     // agrees, confident
  linha('redacao', 3.0, 0.5, null);   // no AI grade to compare
  const r = await I.jevDoMes();
  assert.equal(r.modo, 'sombra');
  assert.deepEqual(r.usos.desafio, { notas: 4, falhas: 1, comparadas: 3, concorda: 1, confiantes: 2, concordaConfiantes: 1 });
  assert.deepEqual(r.usos.redacao, { notas: 2, falhas: 0, comparadas: 1, concorda: 1, confiantes: 1, concordaConfiantes: 1 });
  assert.equal(r.usd, 0.00006);

  banco.semTabela = true;
  try { assert.deepEqual(await I.jevDoMes(), { modo: 'sombra', faltaMigration: true }); }
  finally { banco.semTabela = false; limpar(); }
});

test('the Jev table is server-only and its rows carry no text', () => {
  const sql = fs.readFileSync(path.join(ROOT, 'supabase', 'migrations', '202609300001_jev.sql'), 'utf8');
  assert.match(sql, /create table if not exists public\.jev_decisions/);
  assert.match(sql, /alter table public\.jev_decisions enable row level security;/);
  assert.match(sql, /revoke all on public\.jev_decisions from anon, authenticated;/);
  const colunas = sql.slice(sql.indexOf('('), sql.indexOf(');')).split('\n').map(l => l.trim().split(/\s+/)[0]).filter(Boolean);
  assert.equal(colunas.some(c => /text|answer|user|student|email|name/i.test(c)), false, colunas.join(','));
});
