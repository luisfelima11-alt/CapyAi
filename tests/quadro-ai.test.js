// Chat da lousa (quadro.html → POST /api/quadro-ai), 07/nov/2026.
// Até aqui a rota respondia no envelope antigo `candidates`, que a lousa não
// lê: o professor pedia "5 frases sobre viagem" e recebia sempre as mesmas
// frases prontas do fallback. A rota agora responde { reply, cards } conferido.
'use strict';

process.env.SUPABASE_URL = 'https://supabase.invalid';
process.env.SUPABASE_SECRET_KEY = 'sk-teste';
process.env.SUPABASE_PUBLISHABLE_KEY = 'pk-teste';
process.env.SESSION_COOKIE_SECRET = 'segredo-de-teste-da-lousa';
process.env.OPENAI_API_KEY = 'sk-openai-teste';
delete process.env.OPENROUTER_API_KEY;
delete process.env.VERCEL;

const test = require('node:test');
const assert = require('node:assert/strict');
const https = require('node:https');
const { EventEmitter } = require('node:events');

// Supabase falso: só o limite de uso (sempre liberado).
global.fetch = async url => {
  const caminho = new URL(String(url)).pathname;
  const corpo = caminho.endsWith('/rpc/consume_rate_limit') ? [{ allowed: true, used: 1, retry_after: 0 }] : [];
  return { ok: true, status: 200, text: async () => JSON.stringify(corpo), json: async () => corpo };
};

// IA falsa: devolve o que o teste mandar (texto do modelo ou erro HTTP).
let respostaDaIa = { status: 200, texto: '{}' };
let pedidosIa = [];
https.request = (opcoes, aoResponder) => {
  const req = new EventEmitter();
  let corpo = '';
  req.write = c => { corpo += c; };
  req.setTimeout = () => {};
  req.destroy = () => {};
  req.end = () => setImmediate(() => {
    pedidosIa.push(JSON.parse(corpo));
    const res = new EventEmitter();
    res.statusCode = respostaDaIa.status;
    aoResponder(res);
    res.emit('data', respostaDaIa.status === 200
      ? JSON.stringify({ choices: [{ message: { content: respostaDaIa.texto } }], usage: { total_tokens: 80 } })
      : JSON.stringify({ error: { message: 'quota da org-segredo' } }));
    res.emit('end');
  });
  return req;
};

const api = require('../api/index');

async function pedir(body) {
  const req = new EventEmitter();
  Object.assign(req, {
    method: 'POST', url: '/api/quadro-ai', socket: { remoteAddress: '127.0.0.1' }, destroy() {},
    headers: { origin: 'http://localhost:8765', 'content-type': 'application/json' },
  });
  // O corpo sai quando a rota começa a ler (ela pode esperar outras coisas antes).
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
  const res = new EventEmitter();
  Object.assign(res, { statusCode: 200, headers: {}, body: '', headersSent: false, writableEnded: false });
  res.setHeader = (k, v) => { res.headers[String(k).toLowerCase()] = v; };
  res.getHeader = k => res.headers[String(k).toLowerCase()];
  res.status = c => { res.statusCode = c; return res; };
  res.json = v => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(v)); return res; };
  res.end = v => { if (v) res.body += String(v); res.headersSent = true; res.writableEnded = true; res.emit('finish'); return res; };
  await api(req, res);
  if (!res.writableEnded) await new Promise(r => res.once('finish', r));
  return { status: res.statusCode, json: JSON.parse(res.body || 'null') };
}

test('a lousa recebe { reply, cards } prontos, não o envelope antigo', async () => {
  pedidosIa = [];
  respostaDaIa = { status: 200, texto: JSON.stringify({
    reply: 'Aqui estão 2 frases sobre viagem!',
    cards: [
      { badge: 'Frase 1', en: 'Where is the boarding gate?', pt: 'Onde fica o portão de embarque?' },
      { badge: 'Frase 2', en: 'I would like a window seat.', pt: 'Eu gostaria de um assento na janela.' },
    ],
  }) };
  const r = await pedir({ sala: 'travel', message: 'Me dê 2 frases sobre viagem', history: [{ role: 'assistant', content: 'Oi!' }] });
  assert.equal(r.status, 200);
  assert.equal(r.json.candidates, undefined, 'nada de envelope antigo');
  assert.equal(r.json.reply, 'Aqui estão 2 frases sobre viagem!');
  assert.deepEqual(r.json.cards[0], { badge: 'Frase 1', en: 'Where is the boarding gate?', pt: 'Onde fica o portão de embarque?' });

  const enviado = pedidosIa[0];
  assert.deepEqual(enviado.response_format, { type: 'json_object' }, 'pede JSON ao modelo');
  assert.match(enviado.messages[0].content, /travel/);
  assert.equal(enviado.messages.at(-1).content, 'Me dê 2 frases sobre viagem');
  assert.equal(enviado.messages.length, 3, 'sistema + histórico + pedido');
});

test('cartões conferidos: até 12, sem marcação, sem cartão vazio, com cerca ```json tolerada', async () => {
  const muitos = Array.from({ length: 15 }, (_, i) => ({ en: `Sentence ${i + 1} <img src=x onerror=alert(1)>`, pt: `Frase ${i + 1}` }));
  muitos.splice(2, 0, { badge: 'Vazio', en: '   ', pt: 'sem frase' });
  respostaDaIa = { status: 200, texto: '```json\n' + JSON.stringify({ reply: 'Pronto <script>', cards: muitos }) + '\n```' };
  const r = await pedir({ sala: 'gpstronic', message: 'Me dê 15 frases' });
  assert.equal(r.status, 200);
  assert.equal(r.json.cards.length, 12);
  assert.equal(r.json.reply, 'Pronto script');
  assert.equal(r.json.cards[0].badge, 'Frase 1', 'sem badge, ganha um');
  for (const c of r.json.cards) assert.doesNotMatch(c.en + c.pt + c.badge, /[<>]/);
  assert.ok(r.json.cards.every(c => c.en.trim()), 'nenhum cartão sem frase');
});

test('IA fora do ar ou resposta inválida: 502 com mensagem, nunca o erro do provedor', async () => {
  respostaDaIa = { status: 429, texto: '' };
  const fora = await pedir({ message: 'Me dê 3 frases' });
  assert.equal(fora.status, 502);
  assert.equal(fora.json.error, 'ia_falhou');
  assert.doesNotMatch(JSON.stringify(fora.json), /org-segredo/);

  respostaDaIa = { status: 200, texto: 'isto não é JSON' };
  const lixo = await pedir({ message: 'Me dê 3 frases' });
  assert.equal(lixo.status, 502);

  respostaDaIa = { status: 200, texto: JSON.stringify({ cards: [] }) };
  const vazia = await pedir({ message: 'Me dê 3 frases' });
  assert.equal(vazia.status, 502, 'sem reply e sem cartões não é resposta');
});

test('pedido vazio não gasta IA', async () => {
  pedidosIa = [];
  const r = await pedir({ message: '   ' });
  assert.equal(r.status, 400);
  assert.equal(r.json.error, 'mensagem_obrigatoria');
  assert.equal(pedidosIa.length, 0);
});
