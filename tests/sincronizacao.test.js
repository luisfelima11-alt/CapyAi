// ════════════════════════════════════════════════════════════════════════════
// Sincronização do progresso: nada some, nada volta atrás, nada vaza de conta
// ════════════════════════════════════════════════════════════════════════════
// O progresso do aluno mora em dois lugares: no aparelho (`capyYaraState`) e
// no servidor (`POST /api/db`, que grava o estado INTEIRO). Cada teste aqui é
// um jeito que existia de perder, desfazer ou misturar esse progresso.
//
// Parte 1: o `api/index.js` de verdade contra um Supabase falso em memória.
// Parte 2: o `store.js` de verdade num sandbox (vm), com uma API falsa.
// Parte 3: o `auth-secure.js` de verdade (sair da conta).
// ════════════════════════════════════════════════════════════════════════════
'use strict';

process.env.SUPABASE_URL = 'https://supabase.invalid';
process.env.SUPABASE_SECRET_KEY = 'sk-teste';
process.env.SUPABASE_PUBLISHABLE_KEY = 'pk-teste';
process.env.SESSION_COOKIE_SECRET = 'segredo-de-teste-da-sincronizacao';
delete process.env.VERCEL;

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { EventEmitter } = require('node:events');

const RAIZ = path.resolve(__dirname, '..');

// ── Parte 1: servidor ───────────────────────────────────────────────────────
const banco = {
  user_state: new Map(),
  accounts: [{ id: 'acc-ana', name: 'Ana', email: 'ana@example.test', avatar: '🌿', auth_user_id: 'auth-ana' }],
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

const api = require('../api/index');

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
async function chamar(method, url, body) {
  const req = new EventEmitter();
  const headers = { origin: 'http://localhost:8765', cookie: `capy-access=${SESSAO_ANA}; capy-csrf=csrf-ana`, 'x-csrf-token': 'csrf-ana', 'content-type': 'application/json' };
  Object.assign(req, { method, url, headers, socket: { remoteAddress: '127.0.0.1' }, destroy() {} });
  const res = mockRes();
  const p = api(req, res);
  process.nextTick(() => { if (body !== undefined) req.emit('data', Buffer.from(JSON.stringify(body))); req.emit('end'); });
  await p;
  let json = null;
  try { json = JSON.parse(res.body); } catch {}
  return { status: res.statusCode, json };
}
const salvo = () => banco.user_state.get('acc-ana')?.data;

// ── Parte 2: store.js no navegador ──────────────────────────────────────────
const fonteStore = fs.readFileSync(path.join(RAIZ, 'store.js'), 'utf8');
const codigoStore = fonteStore.replace(/Store\.init\(\);\s*$/, '') + '\n;globalThis.Store = Store;';

// Um "navegador" com localStorage compartilhável entre páginas e uma API falsa.
// `servidor.estado` é o que o GET /api/db devolve; `servidor.posts` guarda o
// que cada POST mandou. `auth` simula o Auth.ready() do auth-secure.js: a
// sessão verificada, que pode ser diferente do cache `capySession`.
function abrirPagina({ loja, servidor, auth, agora = '2026-11-13T15:00:00Z' }) {
  const RelogioReal = Date;
  class RelogioFake extends RelogioReal {
    constructor(...args) { if (args.length === 0) super(agora); else super(...args); }
    static now() { return new RelogioReal(agora).getTime(); }
  }
  const respostaJson = (status, corpo) => Promise.resolve({ ok: status < 400, status, json: async () => corpo });
  const ctx = {
    Date: RelogioFake,
    localStorage: {
      getItem: k => (loja.has(k) ? loja.get(k) : null),
      setItem: (k, v) => loja.set(k, String(v)),
      removeItem: k => loja.delete(k),
      key: i => [...loja.keys()][i] ?? null,
      get length() { return loja.size; },
    },
    document: { dispatchEvent() {}, addEventListener() {} },
    Event: class { constructor(t) { this.type = t; } },
    CustomEvent: class { constructor(t, o) { this.type = t; Object.assign(this, o); } },
    fetch: (url, opts = {}) => {
      const metodo = String(opts.method || 'GET').toUpperCase();
      if (url.startsWith('/api/db') && metodo === 'GET') {
        servidor.gets = (servidor.gets || 0) + 1;
        return respostaJson(200, servidor.estado ? JSON.parse(JSON.stringify(servidor.estado)) : null);
      }
      if (url === '/api/db' && metodo === 'POST') {
        const corpo = JSON.parse(opts.body);
        servidor.posts.push(corpo);
        servidor.estado = corpo.payload;   // o servidor antigo trocava o estado inteiro
        return respostaJson(200, { success: true });
      }
      if (url.startsWith('/api/me')) return respostaJson(200, { plan: servidor.plano || 'free' });
      return respostaJson(404, null);
    },
    URLSearchParams,
    setTimeout, clearTimeout,
    console,
    Number, Math, JSON, Object, Array, String, Boolean, RegExp, Set, Map, Promise, Error, isNaN,
  };
  ctx.window = ctx;
  ctx.location = { search: '' };
  if (auth) {
    ctx.Auth = {
      ready: async () => {
        await new Promise(r => setTimeout(r, 5));
        if (auth.usuario) loja.set('capySession', JSON.stringify(auth.usuario));
        else loja.delete('capySession');
        return auth.usuario;
      },
      getSession: () => JSON.parse(loja.get('capySession') || 'null'),
    };
  }
  vm.createContext(ctx);
  new vm.Script(codigoStore, { filename: 'store.js' }).runInContext(ctx);
  return ctx.Store;
}
const esperar = (ms = 40) => new Promise(r => setTimeout(r, ms));
const ANA = { id: 'acc-ana', name: 'Ana', email: 'ana@example.test', avatar: '🌿', role: 'student' };
const BIA = { id: 'acc-bia', name: 'Bia', email: 'bia@example.test', avatar: '🐾', role: 'student' };

// A Ana já usava este aparelho: estado salvo e plano sincronizado há pouco.
const aparelhoDaAna = () => new Map([
  ['capySession', JSON.stringify(ANA)],
  ['capyYaraState', JSON.stringify({ xp: 700, completedLessons: ['a1', 'a2'], badges: ['week_warrior'], lastQuestDate: '2026-11-13' })],
  ['capyPlanSyncedAt', String(Date.parse('2026-11-13T14:59:00Z'))],
]);

// ── Os casos ────────────────────────────────────────────────────────────────

test('servidor: lista de progresso com mais de 100 itens chega inteira', async () => {
  banco.user_state.clear();
  // 40 aulas da trilha = 160 mini-aulas. O sanitizador cortava toda lista em
  // 100: da aula 26 em diante, nada mais chegava ao servidor.
  const minis = [];
  for (let aula = 1; aula <= 40; aula++) for (let dia = 1; dia <= 4; dia++) minis.push(`${aula}_${dia}`);
  const licoes = [];
  for (let aula = 1; aula <= 60; aula++) licoes.push(aula, 'j' + aula);
  const r = await chamar('POST', '/api/db', { type: 'state', payload: { xp: 4000, completedMinis: minis, completedLessons: licoes } });
  assert.equal(r.status, 200);
  assert.equal(salvo().completedMinis.length, 160, 'as 160 mini-aulas ficam salvas');
  assert.equal(salvo().completedLessons.length, 120);
  assert.equal(salvo().completedMinis.at(-1), '40_4');
});

test('servidor: um aparelho atrasado não apaga o progresso salvo', async () => {
  banco.user_state.clear();
  await chamar('POST', '/api/db', { type: 'state', payload: { xp: 900, completedLessons: [1, 2, 3], completedMinis: ['1_1', '1_2'], badges: ['first'], starBerries: 120 } });
  // A aba velha (ou o aparelho que não leu o servidor) manda o estado dela.
  const r = await chamar('POST', '/api/db', { type: 'state', payload: { xp: 40, completedLessons: [1], completedMinis: [], badges: [], starBerries: 70 } });
  assert.equal(r.status, 200);
  assert.equal(salvo().xp, 900, 'XP não volta atrás');
  assert.deepEqual([...salvo().completedLessons].sort(), [1, 2, 3]);
  assert.deepEqual([...salvo().completedMinis].sort(), ['1_1', '1_2']);
  assert.deepEqual(salvo().badges, ['first']);
  assert.equal(salvo().starBerries, 70, 'frutinhas são saldo: o último gasto vale');
});

test('servidor: um estado zerado não apaga o progresso, mas "zerar progresso" explícito zera', async () => {
  banco.user_state.clear();
  await chamar('POST', '/api/db', { type: 'state', payload: { xp: 900, completedLessons: [1, 2, 3] } });
  await chamar('POST', '/api/db', { type: 'state', payload: { xp: 0, completedLessons: [] } });
  assert.equal(salvo().xp, 900);
  assert.equal(salvo().completedLessons.length, 3);

  const r = await chamar('POST', '/api/db', { type: 'state', reset: true, payload: { xp: 0, completedLessons: [] } });
  assert.equal(r.status, 200);
  assert.equal(salvo().xp, 0);
  assert.deepEqual(salvo().completedLessons, []);
});

test('store: aparelho sem estado salvo não manda um estado zerado antes de ler o servidor', async () => {
  const loja = new Map([['capySession', JSON.stringify(ANA)]]);
  const servidor = { estado: { xp: 900, completedLessons: [1, 2, 3], starBerries: 400, customLessons: [{ id: 100, title: 'Minha aula' }] }, posts: [] };
  const Store = abrirPagina({ loja, servidor, auth: { usuario: ANA } });
  Store.init();
  await esperar();
  for (const p of servidor.posts) {
    assert.ok(p.payload.xp >= 900, `um POST mandou xp=${p.payload.xp} e apagou o progresso do servidor`);
  }
  assert.equal(Store.state.xp, 900);
  assert.equal(servidor.estado.starBerries, 400, 'as frutinhas do servidor continuam');
  assert.equal(servidor.estado.customLessons.length, 1, 'as aulas criadas pelo aluno continuam');
});
