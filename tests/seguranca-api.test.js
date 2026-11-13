// Caça aos bugs de 13/nov/2026, área "segurança e abuso da API".
// Roda o api/index.js de verdade contra um Supabase falso em memória (fetch),
// uma OpenAI falsa (https.request) e um lyrics.ovh falso (https.get). Cada
// teste é um abuso que passava: limite pulado, custo forjado, dado de outro
// aluno, ranking forjado.
'use strict';

process.env.SUPABASE_URL = 'https://supabase.invalid';
process.env.SUPABASE_SECRET_KEY = 'sk-teste';
process.env.SUPABASE_PUBLISHABLE_KEY = 'pk-teste';
process.env.SESSION_COOKIE_SECRET = 'segredo-de-teste-da-seguranca';
process.env.OPENAI_API_KEY = 'sk-openai-teste';
delete process.env.OPENROUTER_API_KEY;
delete process.env.VERCEL;
delete process.env.VERCEL_ENV;
delete process.env.NODE_ENV;
delete process.env.ADMIN_REQUIRE_MFA;

const test = require('node:test');
const assert = require('node:assert/strict');
const https = require('node:https');
const { EventEmitter } = require('node:events');

// ── Supabase falso ────────────────────────────────────────────────────────
const USUARIOS = {
  'tk-ana': { id: 'auth-ana', email: 'ana@example.test', email_confirmed_at: '2026-01-01', app_metadata: {} },
  'tk-bia': { id: 'auth-bia', email: 'bia@example.test', email_confirmed_at: '2026-01-01', app_metadata: {} },
  'tk-prof': { id: 'auth-prof', email: 'prof@example.test', email_confirmed_at: '2026-01-01', app_metadata: { role: 'teacher' } },
  'tk-admin': { id: 'auth-admin', email: 'admin@example.test', email_confirmed_at: '2026-01-01', app_metadata: { role: 'admin' } },
};
const banco = {};
function zerarBanco() {
  banco.accounts = [
    { id: 'acc-ana', name: 'Ana', email: 'ana@example.test', avatar: '🌿', auth_user_id: 'auth-ana' },
    { id: 'acc-bia', name: 'Bia', email: 'bia@example.test', avatar: '🌿', auth_user_id: 'auth-bia' },
    { id: 'acc-prof', name: 'Prof', email: 'prof@example.test', avatar: '🌿', auth_user_id: 'auth-prof' },
    { id: 'acc-admin', name: 'Admin', email: 'admin@example.test', avatar: '🌿', auth_user_id: 'auth-admin' },
  ];
  banco.user_profiles = [{ id: 'acc-bia', plan: 'super', plan_expires_at: null }];
  banco.user_state = new Map();
  banco.homework_submissions = [];
  banco.turma_alunos = [];
  banco.atividade_diaria = new Map();
  banco.limites = new Map();
  banco.negarLimites = false;
}
zerarBanco();

const resposta = (status, corpo) => ({ ok: status < 400, status, text: async () => (corpo === undefined ? '' : JSON.stringify(corpo)) });
// LIKE do PostgREST: `*` é `%`, e `_` é um caractere qualquer.
const likeParaRegex = p => new RegExp('^' + p.split('').map(c => (c === '*' ? '.*' : c === '_' ? '.' : c.replace(/[.+?^${}()|[\]\\]/g, '\\$&'))).join('') + '$');
const listaIn = v => v.replace(/^in\.\(/, '').replace(/\)$/, '').split(',').map(s => s.replace(/^"|"$/g, ''));
function filtrar(linhas, u) {
  let out = linhas;
  for (const [campo, valor] of u.searchParams) {
    if (['select', 'order', 'limit'].includes(campo)) continue;
    if (campo === 'data->>reserva') { out = out.filter(l => String(l.data?.reserva) === valor.replace(/^eq\./, '')); continue; }
    if (valor.startsWith('eq.')) out = out.filter(l => String(l[campo]) === valor.slice(3));
    else if (valor.startsWith('like.')) out = out.filter(l => likeParaRegex(valor.slice(5)).test(String(l[campo])));
    else if (valor.startsWith('in.(')) { const ok = listaIn(valor); out = out.filter(l => ok.includes(String(l[campo]))); }
    else if (valor.startsWith('gte.')) out = out.filter(l => String(l[campo]) >= valor.slice(4));
  }
  const ordem = u.searchParams.get('order');
  if (ordem) {
    const [campo, sentido] = ordem.split(',')[0].split('.');
    out = [...out].sort((a, b) => (String(a[campo]) < String(b[campo]) ? -1 : 1) * (sentido === 'desc' ? -1 : 1));
  }
  const limite = Number(u.searchParams.get('limit'));
  return limite ? out.slice(0, limite) : out;
}

global.fetch = async (url, opts = {}) => {
  const u = new URL(String(url));
  const metodo = String(opts.method || 'GET').toUpperCase();
  const prefer = String(opts.headers?.Prefer || '');
  if (u.pathname === '/auth/v1/user') {
    const token = String(opts.headers?.Authorization || '').replace(/^Bearer /, '');
    return USUARIOS[token] ? resposta(200, USUARIOS[token]) : resposta(401, { message: 'invalid' });
  }
  const tabela = u.pathname.replace('/rest/v1/', '');
  if (tabela === 'rpc/consume_rate_limit') {
    const { p_bucket, p_limit } = JSON.parse(opts.body);
    const usado = (banco.limites.get(p_bucket) || 0) + 1;
    banco.limites.set(p_bucket, usado);
    const allowed = !banco.negarLimites && usado <= p_limit;
    return resposta(200, [{ allowed, used: usado, retry_after: allowed ? 0 : 60 }]);
  }
  if (tabela === 'rpc/somar_atividade') {
    const { p_user, p_dia, p_minis, p_xp } = JSON.parse(opts.body);
    const k = `${p_user}|${p_dia}`;
    const a = banco.atividade_diaria.get(k) || { user_id: p_user, dia: p_dia, minis: 0, xp: 0 };
    a.minis += p_minis; a.xp += p_xp;
    banco.atividade_diaria.set(k, a);
    return resposta(204);
  }
  if (tabela === 'accounts') return resposta(200, filtrar(banco.accounts, u));
  if (tabela === 'user_profiles') return resposta(200, metodo === 'GET' ? filtrar(banco.user_profiles, u) : undefined);
  if (tabela === 'turma_alunos') return resposta(200, filtrar(banco.turma_alunos, u));
  if (tabela === 'atividade_diaria') return resposta(200, filtrar([...banco.atividade_diaria.values()], u));
  if (tabela === 'homework_submissions') {
    if (metodo === 'GET') return resposta(200, filtrar(banco.homework_submissions, u));
    const linha = { id: `hw-${banco.homework_submissions.length + 1}`, ...JSON.parse(opts.body) };
    banco.homework_submissions.push(linha);
    return resposta(201, [linha]);
  }
  if (tabela === 'user_state') {
    const linhas = [...banco.user_state.values()];
    if (metodo === 'GET') return resposta(200, filtrar(linhas, u));
    if (metodo === 'POST') {
      const corpo = JSON.parse(opts.body);
      const existe = banco.user_state.has(corpo.user_id);
      if (existe && prefer.includes('ignore-duplicates')) return resposta(201, []);
      banco.user_state.set(corpo.user_id, { ...(banco.user_state.get(corpo.user_id) || {}), ...corpo });
      return resposta(201, prefer.includes('return=representation') ? [corpo] : undefined);
    }
    if (metodo === 'PATCH') {
      for (const l of filtrar(linhas, u)) banco.user_state.set(l.user_id, { ...l, ...JSON.parse(opts.body) });
      return resposta(204);
    }
  }
  return resposta(200, []);
};

// ── OpenAI e lyrics.ovh falsos ────────────────────────────────────────────
const chamadasIa = [];
const chamadasLetras = [];
let iaTravada = false;
let iaStatus = 200;
https.request = (opcoes, aoResponder) => {
  const req = new EventEmitter();
  let corpo = '';
  req.write = c => { corpo += c; };
  req.setTimeout = () => req;
  req.destroy = erro => { req.destruida = true; if (erro) process.nextTick(() => req.emit('error', erro)); };
  req.end = () => {
    chamadasIa.push({ path: opcoes.path, timeout: opcoes.timeout, req });
    if (iaTravada) return;
    process.nextTick(() => {
      const res = new EventEmitter();
      res.setEncoding = () => {};
      res.destroy = () => {};
      if (opcoes.path === '/v1/realtime/client_secrets') {
        res.statusCode = 201;
        aoResponder(res);
        res.emit('data', JSON.stringify({ value: 'ek_teste', expires_at: 2_000_000_000 }));
      } else {
        res.statusCode = iaStatus;
        aoResponder(res);
        const texto = JSON.stringify({ destaques: ['ok'], travou: [], frases: [], proxima: 'treinar' });
        res.emit('data', iaStatus === 200 ? JSON.stringify({ choices: [{ message: { content: texto } }], usage: { total_tokens: 10 } }) : '{"error":{"message":"org-123 quota"}}');
      }
      res.emit('end');
    });
  };
  return req;
};
https.get = (alvo, opcoes, aoResponder) => {
  chamadasLetras.push(String(alvo));
  const req = new EventEmitter();
  req.destroy = () => {};
  process.nextTick(() => {
    const res = new EventEmitter();
    res.statusCode = 200;
    res.setEncoding = () => {};
    aoResponder(res);
    res.emit('data', JSON.stringify({ data: [{ title: 'x' }], lyrics: 'la la' }));
    res.emit('end');
  });
  return req;
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
async function chamar(method, url, headers = {}, body) {
  const req = require('node:stream').Readable.from(body === undefined ? [] : [Buffer.from(JSON.stringify(body))]);
  Object.assign(req, { method, url, headers, socket: { remoteAddress: '127.0.0.1' } });
  const res = mockRes();
  const fim = new Promise(ok => res.once('finish', ok));
  await api(req, res);
  await fim;
  let json = null;
  try { json = JSON.parse(res.body); } catch {}
  return { status: res.statusCode, json, headers: res.headers, body: res.body };
}
const ORIGEM = 'http://localhost:8765';
const comSessao = token => ({ origin: ORIGEM, cookie: `capy-access=${token}; capy-csrf=csrf-${token}`, 'x-csrf-token': `csrf-${token}`, 'content-type': 'application/json' });
const somaVoz = () => [...banco.user_state.values()]
  .filter(l => /^__voz_/.test(l.user_id)).reduce((s, l) => s + (Number(l.data?.custo?.usd) || 0), 0);
const minutosVoz = aluno => [...banco.user_state.values()]
  .filter(l => l.user_id.startsWith(`__voz_${aluno}_`)).reduce((s, l) => s + (Number(l.data?.custo?.segundos) || 0), 0) / 60;

test.beforeEach(() => { zerarBanco(); chamadasIa.length = 0; chamadasLetras.length = 0; iaTravada = false; iaStatus = 200; });

// ── 1. Letras de música: o limite valia só para a URL exata ────────────────
test('lyrics: no path variant reaches lyrics.ovh without passing the rate limit', async () => {
  banco.negarLimites = true;   // todo balde já estourou
  const exato = await chamar('GET', '/api/lyrics-search?q=abba');
  assert.equal(exato.status, 429, 'the exact route is limited');
  for (const caminho of ['/api/lyrics-search/?q=abba', '/api/lyrics-searchX?q=abba', '/api/lyrics/?artist=a&title=b', '/api/lyricsX?artist=a&title=b']) {
    const r = await chamar('GET', caminho);
    assert.notEqual(r.status, 200, `${caminho} answered ${r.status} past the limit`);
  }
  assert.deepEqual(chamadasLetras, [], 'lyrics.ovh was called past the rate limit');
});

// ── 2. Voz: custo informado pelo navegador sem teto ────────────────────────
test('voice: a forged usage report cannot trip the site-wide monthly brake', async () => {
  const forjado = { cenario: 'conversa', duracaoMs: 7_200_000, uso: { audioIn: 5e6, audioOut: 5e6, cache: 5e6, textoIn: 5e6, textoOut: 5e6 } };
  // Ana (grátis, nunca ligou) manda o relato inventado, com e sem reserva aberta.
  const r = await chamar('POST', '/api/conversa-uso', comSessao('tk-ana'), forjado);
  assert.equal(r.status, 204);
  assert.ok(somaVoz() < 5, `one report without any call booked US$ ${somaVoz().toFixed(2)}`);
  // Com uma reserva de 3 minutos (a ligação de teste), o relato não passa do que cabe nela.
  const agora = new Date().toISOString();
  banco.user_state.set(`__voz_acc-ana_${agora}_reserva`, {
    user_id: `__voz_acc-ana_${agora}_reserva`, updated_at: agora,
    data: { cenario: 'conversa', reserva: true, emitidoEm: Date.now() - 60_000, em: agora, custo: { segundos: 180, usd: 0.06 } },
  });
  await chamar('POST', '/api/conversa-uso', comSessao('tk-ana'), forjado);
  assert.ok(somaVoz() < 5, `a 3-minute reservation was settled at US$ ${somaVoz().toFixed(2)}`);
  assert.ok(minutosVoz('acc-ana') <= 3, `a 3-minute reservation was settled as ${minutosVoz('acc-ana')} minutes`);
  // E a Bia, que paga o Super, continua ligando.
  const bia = await chamar('POST', '/api/realtime-token', comSessao('tk-bia'), { cenario: 'conversa' });
  assert.notEqual(bia.json?.error, 'teto_de_gasto', 'one student switched voice off for the whole site');
  assert.equal(bia.status, 200, JSON.stringify(bia.json));
});

test('voice: the interview feedback does not count the same call a second time', async () => {
  // A Bia (Super) liga: o token reserva os minutos.
  const token = await chamar('POST', '/api/realtime-token', comSessao('tk-bia'), { cenario: 'entrevista' });
  assert.equal(token.status, 200, JSON.stringify(token.json));
  // Desliga depois de 2 minutos: entrevista.html manda o relato (sendBeacon)...
  const uso = { cenario: 'entrevista', duracaoMs: 120_000, uso: { audioIn: 2000, audioOut: 4000, cache: 0, textoIn: 500, textoOut: 300 } };
  for (const l of banco.user_state.values()) if (l.data?.reserva) l.data.emitidoEm = Date.now() - 125_000;
  await chamar('POST', '/api/conversa-uso', comSessao('tk-bia'), uso);
  // ...e pede a devolutiva com o mesmo uso.
  const fb = await chamar('POST', '/api/conversa-feedback', comSessao('tk-bia'), {
    ...uso, cargo: 'dev', transcricao: [{ quem: 'eu', texto: 'Hi, I am Bia' }, { quem: 'ia', texto: 'Tell me' }, { quem: 'eu', texto: 'I code' }],
  });
  assert.equal(fb.status, 200, JSON.stringify(fb.json));
  const minutos = minutosVoz('acc-bia');
  assert.ok(minutos > 1.9 && minutos < 2.5, `a 2-minute interview counted ${minutos.toFixed(2)} minutes of the monthly quota`);
  // A devolutiva também gravava o custo que o navegador mandasse, sem ligação nenhuma.
  const antes = somaVoz();
  await chamar('POST', '/api/conversa-feedback', comSessao('tk-ana'), {
    cenario: 'entrevista', duracaoMs: 7_200_000, uso: { audioIn: 5e6, audioOut: 5e6, cache: 5e6, textoIn: 5e6, textoOut: 5e6 },
    transcricao: [{ quem: 'eu', texto: 'a' }, { quem: 'eu', texto: 'b' }],
  });
  assert.equal(somaVoz(), antes, 'the feedback route stored a cost for a call that never happened');
});

// ── 3. Lição de casa: o professor via a de todos os alunos ─────────────────
test('homework list: a teacher sees only the students of their own class; admin sees all', async () => {
  banco.turma_alunos.push({ professor_id: 'acc-prof', aluno_id: 'acc-ana' });
  banco.homework_submissions.push(
    { id: 'h1', user_id: 'acc-ana', student_name: 'Ana', lesson_id: 'aula_01', answers: { a: 'minha' }, submitted_at: '2026-11-10T10:00:00Z' },
    { id: 'h2', user_id: 'acc-bia', student_name: 'Bia', lesson_id: 'aula_01', answers: { a: 'segredo da Bia' }, submitted_at: '2026-11-11T10:00:00Z' },
  );
  const prof = await chamar('GET', '/api/homework', comSessao('tk-prof'));
  assert.equal(prof.status, 200, JSON.stringify(prof.json));
  assert.deepEqual(prof.json.map(h => h.user_id), ['acc-ana'], 'the teacher read homework of a student outside the class');
  const pedindoOutro = await chamar('GET', '/api/homework?userId=acc-bia', comSessao('tk-prof'));
  assert.deepEqual(pedindoOutro.json, [], 'asking by userId opened another student');
  const admin = await chamar('GET', '/api/homework', comSessao('tk-admin'));
  assert.equal(admin.json.length, 2);
  const aluno = await chamar('GET', '/api/homework', comSessao('tk-ana'));
  assert.equal(aluno.status, 403);
});

// ── 4. Ranking: XP do navegador entrava inteiro ────────────────────────────
test('ranking: a forged XP total cannot jump to the top in one save, nor climb without end in a day', async () => {
  const salvar = xp => chamar('POST', '/api/db', comSessao('tk-ana'), { type: 'state', payload: { xp, completedMinis: [] } });
  const xpGuardado = () => banco.user_state.get('acc-ana')?.data?.xp;
  await salvar(120);
  assert.equal(xpGuardado(), 120, 'a normal save keeps the XP');
  await salvar(10_000_000);
  assert.ok(xpGuardado() <= 120 + 2000, `one save took the XP to ${xpGuardado()}`);
  for (let i = 0; i < 40; i++) await salvar(10_000_000);
  assert.ok(xpGuardado() <= 120 + 20000, `40 saves in one day took the XP to ${xpGuardado()}`);
  // Perder XP (recomeçar o progresso) continua valendo.
  await salvar(0);
  assert.equal(xpGuardado(), 0);
});

// ── 5. Lição de casa: o balde `homework` existia e ninguém usava ───────────
test('homework submit uses its own rate limit', async () => {
  banco.negarLimites = true;
  const r = await chamar('POST', '/api/homework', comSessao('tk-ana'), { lessonId: 'aula_01', lessonTitle: 'x', answers: { a: 'b' }, xp: 75 });
  assert.equal(r.status, 429, JSON.stringify(r.json));
  assert.equal(banco.homework_submissions.length, 0, 'the submission was stored past the limit');
  banco.negarLimites = false;
  const ok = await chamar('POST', '/api/homework', comSessao('tk-ana'), { lessonId: 'aula_01', lessonTitle: 'x', answers: { a: 'b' }, xp: 75 });
  assert.equal(ok.status, 200, JSON.stringify(ok.json));
  assert.ok([...banco.limites.keys()].some(b => b.startsWith('u:auth-ana|homework|')), 'counted per student, not per IP');
});

