// Cotas de IA (caça aos bugs, 13/nov/2026). Roda o api/index.js de verdade
// contra um Supabase falso que CONTA os usos (consume_rate_limit com limite de
// verdade) e uma OpenAI falsa (https.request). Nada vai para a rede.
//
// O portão de IA (o bloco que conta antes de cada rota de IA) gastava o balde
// `transcribe` (grátis: 3 por dia) em toda gravação, inclusive nas da página de
// Preparação, que depois gastava também o balde próprio `transcribe-prep`
// (grátis: 40). Resultado: na 4ª gravação do dia o aluno grátis levava 429, e
// quem paga gastava duas cotas por gravação.
'use strict';

process.env.SUPABASE_URL = 'https://supabase.invalid';
process.env.SUPABASE_SECRET_KEY = 'sk-teste';
process.env.SUPABASE_PUBLISHABLE_KEY = 'pk-teste';
process.env.SESSION_COOKIE_SECRET = 'segredo-de-teste-das-cotas';
process.env.OPENAI_API_KEY = 'sk-openai-teste';
delete process.env.OPENROUTER_API_KEY;
delete process.env.VERCEL;

const test = require('node:test');
const assert = require('node:assert/strict');
const https = require('node:https');
const { EventEmitter } = require('node:events');

// ── Supabase falso: conta cada balde e respeita o limite pedido ─────────────
const SESSAO_PRO = 'access-do-pro';
let contagem = new Map();      // p_bucket → usos
let baldesGastos = [];         // nome do balde diário de cada consumo (sem identidade e data)
const resposta = (status, corpo) => ({ ok: status < 400, status, text: async () => JSON.stringify(corpo), json: async () => corpo });
global.fetch = async (url, opts = {}) => {
  const u = new URL(String(url));
  if (u.pathname === '/auth/v1/user') {
    const ok = String(opts.headers?.Authorization || '') === `Bearer ${SESSAO_PRO}`;
    return ok ? resposta(200, { id: 'auth-pro', email: 'pro@example.test', email_confirmed_at: '2026-01-01' }) : resposta(401, { message: 'invalid' });
  }
  const tabela = u.pathname.replace('/rest/v1/', '');
  if (tabela === 'rpc/consume_rate_limit') {
    const { p_bucket, p_limit } = JSON.parse(opts.body);
    const usado = (contagem.get(p_bucket) || 0) + 1;
    contagem.set(p_bucket, usado);
    if (!p_bucket.includes('|minute:')) baldesGastos.push(p_bucket.split('|').slice(-2, -1)[0]);
    return resposta(200, [{ allowed: usado <= p_limit, used: usado, retry_after: 60 }]);
  }
  if (tabela === 'accounts') return resposta(200, [{ id: 'acc-pro', name: 'Pro', email: 'pro@example.test', auth_user_id: 'auth-pro' }]);
  if (tabela === 'user_profiles') return resposta(200, [{ plan: 'pro', plan_expires_at: null }]);
  return resposta(200, []);
};

// ── OpenAI falsa: o Whisper responde "hello" ───────────────────────────────
let pedidosIa = 0;
https.request = (opcoes, aoResponder) => {
  const req = new EventEmitter();
  req.write = () => {};
  req.setTimeout = () => {};
  req.destroy = () => {};
  req.end = () => setImmediate(() => {
    pedidosIa++;
    const res = new EventEmitter();
    res.statusCode = 200;
    aoResponder(res);
    res.emit('data', JSON.stringify({ text: 'hello' }));
    res.emit('end');
  });
  return req;
};

const api = require('../api/index');

function mockRes() {
  const res = new EventEmitter();
  Object.assign(res, { statusCode: 200, headers: {}, body: '', headersSent: false, writableEnded: false });
  res.setHeader = (k, v) => { res.headers[String(k).toLowerCase()] = v; };
  res.getHeader = k => res.headers[String(k).toLowerCase()];
  res.status = c => { res.statusCode = c; return res; };
  res.json = v => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(v)); return res; };
  res.end = v => { if (v) res.body += String(v); res.headersSent = true; res.writableEnded = true; res.emit('finish'); return res; };
  return res;
}

async function chamar(url, body, headers = {}) {
  const req = new EventEmitter();
  Object.assign(req, {
    method: 'POST', url, socket: { remoteAddress: '10.0.0.7' }, destroy() {},
    headers: { origin: 'http://localhost:8765', 'content-type': 'application/json', ...headers },
  });
  // O corpo sai quando a rota começa a ler (o portão espera o Supabase antes).
  const on = req.on.bind(req);
  let enviado = false;
  req.on = (evento, fn) => {
    on(evento, fn);
    if (evento === 'end' && !enviado) {
      enviado = true;
      setImmediate(() => { req.emit('data', Buffer.from(JSON.stringify(body))); req.emit('end'); });
    }
    return req;
  };
  const res = mockRes();
  await api(req, res);
  if (!res.writableEnded) await new Promise(r => res.once('finish', r));
  let json = null;
  try { json = JSON.parse(res.body); } catch {}
  return { status: res.statusCode, json };
}

const AUDIO = Buffer.alloc(600, 7).toString('base64');
const zerar = () => { contagem = new Map(); baldesGastos = []; pedidosIa = 0; };

test('Preparação: o aluno grátis grava mais de 3 vezes no dia (balde transcribe-prep, não o transcribe)', async () => {
  zerar();
  for (let i = 1; i <= 4; i++) {
    const r = await chamar('/api/transcribe', { audioBase64: AUDIO, mimeType: 'audio/webm', lang: 'en', uso: 'preparacao' });
    assert.equal(r.status, 200, `gravação ${i} da Preparação: ${JSON.stringify(r.json)}`);
    assert.equal(r.json.text, 'hello');
  }
  assert.equal(pedidosIa, 4);
  assert.deepEqual(baldesGastos, ['transcribe-prep', 'transcribe-prep', 'transcribe-prep', 'transcribe-prep'],
    'cada gravação gasta uma vez, e só do balde da Preparação');
});

test('Preparação: quem paga gasta uma cota por gravação, não duas', async () => {
  zerar();
  const cookie = { cookie: `capy-access=${SESSAO_PRO}; capy-csrf=csrf-pro`, 'x-csrf-token': 'csrf-pro' };
  const r = await chamar('/api/transcribe', { audioBase64: AUDIO, lang: 'en', uso: 'preparacao' }, cookie);
  assert.equal(r.status, 200, JSON.stringify(r.json));
  assert.deepEqual(baldesGastos, ['transcribe-prep']);
});

test('as outras gravações continuam no balde transcribe (3 por dia no grátis), uma cota cada', async () => {
  zerar();
  for (let i = 1; i <= 3; i++) {
    const r = await chamar('/api/transcribe', { audioBase64: AUDIO, lang: 'en' });
    assert.equal(r.status, 200, `gravação ${i}: ${JSON.stringify(r.json)}`);
  }
  assert.deepEqual(baldesGastos, ['transcribe', 'transcribe', 'transcribe']);
  const quarta = await chamar('/api/transcribe', { audioBase64: AUDIO, lang: 'en' });
  assert.equal(quarta.status, 429);
  assert.equal(pedidosIa, 3, 'a 4ª não chega à IA');
  // `uso` desconhecido não abre balde novo.
  const outroUso = await chamar('/api/transcribe', { audioBase64: AUDIO, lang: 'en', uso: 'qualquer-coisa' });
  assert.equal(outroUso.status, 429);
});

test('o portão continua de pé no transcribe: cookie de sessão sem CSRF é recusado sem gastar cota', async () => {
  zerar();
  const r = await chamar('/api/transcribe', { audioBase64: AUDIO, uso: 'preparacao' }, { cookie: `capy-access=${SESSAO_PRO}; capy-csrf=csrf-pro` });
  assert.equal(r.status, 403);
  assert.equal(baldesGastos.length, 0);
  assert.equal(pedidosIa, 0);
});
