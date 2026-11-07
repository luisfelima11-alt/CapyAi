// Extensão do navegador (07/nov/2026): as rotas /api/extensao/*.
// Roda o api/index.js de verdade contra um Supabase falso em memória (fetch) e
// uma IA falsa (https.request). Cobre: gerar a chave com sessão + CSRF, usar a
// chave de chrome-extension://, salvar na revisão sem apagar as palavras das
// aulas, traduzir, desconectar (a chave antiga para de valer) e as recusas.
'use strict';

process.env.SUPABASE_URL = 'https://supabase.invalid';
process.env.SUPABASE_SECRET_KEY = 'sk-teste';
process.env.SUPABASE_PUBLISHABLE_KEY = 'pk-teste';
process.env.SESSION_COOKIE_SECRET = 'segredo-de-teste-da-extensao';
process.env.OPENAI_API_KEY = 'sk-openai-teste';
delete process.env.VERCEL;
delete process.env.EXTENSION_IDS;

const test = require('node:test');
const assert = require('node:assert/strict');
const https = require('node:https');
const { EventEmitter } = require('node:events');

// ── Supabase falso ────────────────────────────────────────────────────────
const banco = {
  user_state: new Map(),
  accounts: [{ id: 'acc-ana', name: 'Ana <b>Souza</b>', email: 'ana@example.test', avatar: '🌿', auth_user_id: 'auth-ana' }],
};
const SESSAO_ANA = 'access-da-ana';
const resposta = (status, corpo) => ({ ok: status < 400, status, text: async () => (corpo === undefined ? '' : JSON.stringify(corpo)) });
global.fetch = async (url, opts = {}) => {
  const u = new URL(String(url));
  const metodo = String(opts.method || 'GET').toUpperCase();
  if (u.pathname === '/auth/v1/user') {
    const ok = String(opts.headers?.Authorization || '') === `Bearer ${SESSAO_ANA}`;
    return ok ? resposta(200, { id: 'auth-ana', email: 'ana@example.test', email_confirmed_at: '2026-01-01' }) : resposta(401, { message: 'invalid' });
  }
  const tabela = u.pathname.replace('/rest/v1/', '');
  const eq = campo => (u.searchParams.get(campo) || '').replace(/^eq\./, '');
  if (tabela === 'rpc/consume_rate_limit') return resposta(200, [{ allowed: true, used: 1, retry_after: 0 }]);
  if (tabela === 'user_profiles') return resposta(200, []);
  if (tabela === 'accounts') {
    const porId = eq('id'), porAuth = eq('auth_user_id');
    return resposta(200, banco.accounts.filter(a => (porId && a.id === porId) || (porAuth && a.auth_user_id === porAuth)));
  }
  if (tabela === 'user_state' && metodo === 'GET') {
    const linha = banco.user_state.get(eq('user_id'));
    return resposta(200, linha ? [linha] : []);
  }
  if (tabela === 'user_state' && metodo === 'POST') {
    const corpo = JSON.parse(opts.body);
    banco.user_state.set(corpo.user_id, { data: corpo.data, updated_at: corpo.updated_at });
    return resposta(201);
  }
  return resposta(200, []);
};

// ── IA falsa ──────────────────────────────────────────────────────────────
let pedidosIa = [];
https.request = (opcoes, aoResponder) => {
  const req = new EventEmitter();
  let corpo = '';
  req.write = c => { corpo += c; };
  req.end = () => {
    pedidosIa.push(JSON.parse(corpo));
    const res = new EventEmitter();
    res.statusCode = 200;
    aoResponder(res);
    const texto = JSON.stringify({ traducao: 'aguentar <script>', explicacao: 'Aqui significa suportar uma situação.' });
    res.emit('data', JSON.stringify({ choices: [{ message: { content: texto } }], usage: { total_tokens: 50 } }));
    res.emit('end');
  };
  req.destroy = () => {};
  return req;
};

const api = require('../api/index');
const Security = require('../api/security');

function mockRes() {
  const res = new EventEmitter();
  res.statusCode = 200; res.headers = {}; res.body = ''; res.headersSent = false; res.writableEnded = false;
  res.setHeader = (k, v) => { res.headers[String(k).toLowerCase()] = v; };
  res.getHeader = k => res.headers[String(k).toLowerCase()];
  res.status = c => { res.statusCode = c; return res; };
  res.json = v => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(v)); return res; };
  res.end = v => { if (v) res.body += String(v); res.headersSent = true; res.writableEnded = true; res.emit('finish'); return res; };
  return res;
}
async function chamar(method, url, headers = {}, body) {
  const req = new EventEmitter();
  Object.assign(req, { method, url, headers, socket: { remoteAddress: '127.0.0.1' }, destroy() {} });
  const res = mockRes();
  const p = api(req, res);
  process.nextTick(() => { if (body !== undefined) req.emit('data', Buffer.from(JSON.stringify(body))); req.emit('end'); });
  await p;
  let json = null;
  try { json = JSON.parse(res.body); } catch {}
  return { status: res.statusCode, json, headers: res.headers };
}
const EXT = 'chrome-extension://abcdefghijklmnopabcdefghijklmnop';
const comChave = (token, extra = {}) => ({ origin: EXT, authorization: `Bearer ${token}`, 'content-type': 'application/json', ...extra });
const SITE = { origin: 'http://localhost:8765', cookie: `capy-access=${SESSAO_ANA}; capy-csrf=csrf-ana`, 'x-csrf-token': 'csrf-ana', 'content-type': 'application/json' };

test('o fluxo inteiro: conectar no site, usar na extensão, desconectar', async () => {
  // A chave só sai com sessão E CSRF.
  assert.equal((await chamar('POST', '/api/extensao/conectar', { ...SITE, 'x-csrf-token': 'errado' }, {})).status, 403);
  const semSessao = await chamar('POST', '/api/extensao/conectar', { origin: SITE.origin, cookie: 'capy-csrf=x', 'x-csrf-token': 'x' }, {});
  assert.equal(semSessao.status, 401);
  const c = await chamar('POST', '/api/extensao/conectar', SITE, {});
  assert.equal(c.status, 200, JSON.stringify(c.json));
  assert.match(c.json.token, /^cx1\.[\w-]+\.[\w-]+$/);
  assert.equal(c.json.nome, 'Ana', 'só o primeiro nome, sem marcação');
  const token = c.json.token;

  // Quem sou eu, da extensão. Sem CORS: nenhuma página da web lê a resposta.
  const eu = await chamar('GET', '/api/extensao/eu', comChave(token));
  assert.equal(eu.status, 200);
  assert.deepEqual(eu.json, { nome: 'Ana', plano: 'free' });
  assert.equal(eu.headers['access-control-allow-origin'], undefined);

  // Salvar entra na memória das aulas, sem apagar o que já estava lá.
  banco.user_state.set('mem_acc-ana', { data: { words: [{ en: 'achieve', pt: 'alcançar', source: 'aula_20', lessonId: 20, mastered: false, srs: { streak: 2, nextDue: 5 } }] } });
  const s1 = await chamar('POST', '/api/extensao/salvar', comChave(token), { palavra: '  Put up with ', traducao: 'aguentar' });
  assert.equal(s1.status, 200, JSON.stringify(s1.json));
  await chamar('POST', '/api/extensao/salvar', comChave(token), { palavra: 'put up with', traducao: 'tolerar' });
  const mem = banco.user_state.get('mem_acc-ana').data.words;
  assert.equal(mem.length, 2, 'a mesma palavra não duplica (sem diferença de maiúsculas)');
  assert.ok(mem.some(w => w.en === 'achieve' && w.source === 'aula_20'), 'a palavra da aula continua');
  const yt = mem.find(w => w.source === 'youtube');
  assert.equal(yt.en, 'Put up with');
  assert.equal(yt.pt, 'aguentar', 'a primeira tradução fica');
  const lista = await chamar('GET', '/api/extensao/palavras', comChave(token));
  assert.deepEqual(lista.json.palavras, [{ en: 'Put up with', pt: 'aguentar' }]);

  // A revisão monta botões com innerHTML e onclick="…'palavra'…": texto vindo
  // de legenda de terceiros (e da IA) não pode carregar aspas duplas, crase,
  // & nem < >. Sem isso, uma aspa vira atributo novo (XSS sem tag).
  await chamar('POST', '/api/extensao/salvar', comChave(token), {
    palavra: 'x" autofocus onfocus="alert(1)',
    traducao: 'legal" onmouseover="fetch(`//mal.example`)&amp; <b>',
  });
  const atacada = banco.user_state.get('mem_acc-ana').data.words.find(w => /autofocus/.test(w.en));
  assert.equal(atacada.en, 'x autofocus onfocus alert 1');
  assert.doesNotMatch(atacada.pt, /["`&<>\/=]/);
  await chamar('POST', '/api/extensao/salvar', comChave(token), { palavra: 'don’t   give up', traducao: "não desista d'água" });
  const apostrofo = banco.user_state.get('mem_acc-ana').data.words.find(w => w.en.startsWith('don'));
  assert.equal(apostrofo.en, "don't give up", 'o apóstrofo da palavra fica (a revisão já o escapa)');
  assert.equal(apostrofo.pt, 'não desista d’água', 'na tradução, vira apóstrofo tipográfico');

  // Traduzir: a IA recebe a palavra e a frase; a resposta sai sem marcação.
  pedidosIa = [];
  const t = await chamar('POST', '/api/extensao/traduzir', comChave(token), { palavra: 'put up with', frase: 'I can\'t put up with this noise.' });
  assert.equal(t.status, 200, JSON.stringify(t.json));
  assert.equal(t.json.traducao, 'aguentar script');
  assert.doesNotMatch(t.json.traducao + t.json.explicacao, /[<>"`&]/);
  assert.match(t.json.explicacao, /suportar/);
  assert.equal(pedidosIa.length, 1);
  assert.match(pedidosIa[0].messages[0].content, /put up with/);

  // Desconectar no site: a chave antiga para de valer na hora.
  assert.equal((await chamar('POST', '/api/extensao/desconectar', SITE, {})).status, 200);
  const depois = await chamar('GET', '/api/extensao/eu', comChave(token));
  assert.equal(depois.status, 401);
  assert.equal(depois.json.error, 'extensao_desconectada');
  // Uma chave nova volta a funcionar.
  const nova = await chamar('POST', '/api/extensao/conectar', SITE, {});
  assert.equal((await chamar('GET', '/api/extensao/eu', comChave(nova.json.token))).status, 200);
});

test('recusas: sem chave, chave adulterada, chave de outra conta, origem de site', async () => {
  const { token } = Security.signExtensao({ appUserId: 'acc-ana', authUserId: 'auth-ana', rev: 1 });
  assert.equal((await chamar('GET', '/api/extensao/eu', { origin: EXT })).status, 401);
  assert.equal((await chamar('GET', '/api/extensao/eu', comChave('cx1.abc.def'))).status, 401);
  const [pre, corpo, assin] = token.split('.');
  const outra = Buffer.from(JSON.stringify({ ...JSON.parse(Buffer.from(corpo, 'base64url')), u: 'acc-outra' })).toString('base64url');
  assert.equal((await chamar('GET', '/api/extensao/eu', comChave([pre, outra, assin].join('.')))).status, 401, 'payload trocado não passa');
  // Assinada certinho, mas o auth_user_id não é o da conta.
  const trocada = Security.signExtensao({ appUserId: 'acc-ana', authUserId: 'auth-outro', rev: 1 }).token;
  assert.equal((await chamar('GET', '/api/extensao/eu', comChave(trocada))).status, 401);
  // A chave certa vinda de uma página da web (não da extensão) é recusada.
  const valida = (await chamar('POST', '/api/extensao/conectar', SITE, {})).json.token;
  assert.equal((await chamar('GET', '/api/extensao/eu', comChave(valida, { origin: 'https://evil.example' }))).status, 403);
  assert.equal((await chamar('GET', '/api/extensao/eu', comChave(valida, { origin: 'https://www.capyenglish.com.br' }))).status, 403);
  // Sem palavra não salva nem traduz.
  assert.equal((await chamar('POST', '/api/extensao/salvar', comChave(valida), { palavra: '  ' })).status, 400);
  assert.equal((await chamar('POST', '/api/extensao/traduzir', comChave(valida), {})).status, 400);
  // EXTENSION_IDS fixa os ids aceitos depois da publicação.
  process.env.EXTENSION_IDS = 'outroidoutroidoutroidoutroidoutro';
  assert.equal((await chamar('GET', '/api/extensao/eu', comChave(valida))).status, 403);
  process.env.EXTENSION_IDS = 'abcdefghijklmnopabcdefghijklmnop';
  assert.equal((await chamar('GET', '/api/extensao/eu', comChave(valida))).status, 200);
  delete process.env.EXTENSION_IDS;
});

test('o /api/memory das aulas continua igual depois de virar função compartilhada', async () => {
  banco.user_state.set('mem_acc-ana', { data: { words: [{ en: 'deal', pt: 'acordo', source: 'aula_3', lessonId: 3, mastered: false, srs: { streak: 1, nextDue: 10 } }] } });
  const r = await chamar('POST', '/api/memory', SITE, { words: [
    { en: 'DEAL', pt: null, source: 'aula_3', lessonId: 3, mastered: true, srs: { streak: 0, nextDue: 0 } },
    { en: 'goal', pt: 'meta', source: 'aula_4', lessonId: 4, srs: { streak: 3, nextDue: 99 } },
  ] });
  assert.equal(r.status, 200, JSON.stringify(r.json));
  const deal = r.json.words.find(w => w.en.toLowerCase() === 'deal');
  assert.equal(deal.mastered, true, 'domínio é fato positivo');
  assert.equal(deal.pt, 'acordo', 'a tradução antiga fica');
  assert.equal(deal.srs.streak, 1, 'vence o maior streak');
  assert.equal(r.json.words.length, 2);
  const g = await chamar('GET', '/api/memory', { cookie: SITE.cookie });
  assert.equal(g.json.words.length, 2);
});
