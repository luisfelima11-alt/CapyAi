'use strict';

// Lembrete diário (/api/send-reminders, 19h de Brasília): só fala da sequência
// de quem ainda TEM sequência para salvar hoje.
//
// O servidor guarda o estado do jeito que o aluno o deixou. Quem parou há duas
// semanas com 12 dias seguidos continua com `streakDays: 12` no banco, porque a
// sequência só é recalculada no navegador. Até 13/nov/2026 o lembrete lia esse
// número cru e mandava, todo dia, "Sua streak de 12 dias expira à meia-noite!".
// Ao voltar, o aluno via 0: o e-mail tinha prometido uma coisa que já não existia.

process.env.SUPABASE_URL = 'https://supabase.invalid';
process.env.SUPABASE_SECRET_KEY = 'sk-teste';
process.env.SUPABASE_PUBLISHABLE_KEY = 'pk-teste';
process.env.CRON_SECRET = 'cron-segredo-de-teste-1234567890';   // gitleaks:allow (fixture)
process.env.RESEND_API_KEY = 're-teste';
delete process.env.VAPID_PUBLIC_KEY;
delete process.env.VAPID_PRIVATE_KEY;
delete process.env.VERCEL;

const test = require('node:test');
const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');

// Relógio falso: 10/set/2026, 19h em Brasília (a hora do cron).
const RelogioReal = Date;
const AGORA = '2026-09-10T22:00:00Z';
class RelogioFake extends RelogioReal {
  constructor(...args) { if (args.length === 0) super(AGORA); else super(...args); }
  static now() { return new RelogioReal(AGORA).getTime(); }
}
global.Date = RelogioFake;

const ALUNOS = [
  // parou em 26/ago: a sequência de 12 já morreu
  { id: 'sumida', name: 'Sumida', email: 'sumida@example.test', data: { xp: 900, streakDays: 12, lastPracticeDate: '2026-08-26' } },
  // praticou ontem: a sequência de 5 acaba hoje à meia-noite se não estudar
  { id: 'ontem', name: 'Ontem', email: 'ontem@example.test', data: { xp: 300, streakDays: 5, lastPracticeDate: '2026-09-09' } },
  // faltou ontem, mas tem 🧊: o freeze cobre ontem quando ela abrir o app
  { id: 'gelo', name: 'Gelo', email: 'gelo@example.test', data: { xp: 300, streakDays: 7, lastPracticeDate: '2026-09-08', streakFreezes: 1 } },
  // faltou ontem, sem freeze: já perdeu
  { id: 'semgelo', name: 'Sem Gelo', email: 'semgelo@example.test', data: { xp: 300, streakDays: 7, lastPracticeDate: '2026-09-08', streakFreezes: 0 } },
];

const emails = [];
global.fetch = async (url, opcoes = {}) => {
  const u = new URL(String(url));
  let corpo = [];
  if (u.hostname === 'api.resend.com') {
    emails.push(JSON.parse(opcoes.body));
    corpo = { id: 'email-teste' };
  } else if (u.pathname.endsWith('/user_state') && (opcoes.method || 'GET') === 'GET') {
    corpo = ALUNOS.map(a => ({ user_id: a.id, data: a.data }));
  } else if (u.pathname.endsWith('/accounts')) {
    corpo = ALUNOS.map(a => ({ id: a.id, name: a.name, email: a.email }));
  }
  return { ok: true, status: 200, text: async () => JSON.stringify(corpo), json: async () => corpo };
};

const api = require('../api/index');

async function rodarCron() {
  const req = new EventEmitter();
  Object.assign(req, {
    method: 'GET', url: '/api/send-reminders', socket: { remoteAddress: '127.0.0.1' }, destroy() {},
    headers: { authorization: `Bearer ${process.env.CRON_SECRET}` },
  });
  const res = new EventEmitter();
  Object.assign(res, { statusCode: 200, headers: {}, body: '', headersSent: false, writableEnded: false });
  res.setHeader = (k, v) => { res.headers[String(k).toLowerCase()] = v; };
  res.getHeader = k => res.headers[String(k).toLowerCase()];
  res.status = c => { res.statusCode = c; return res; };
  res.json = v => { res.end(JSON.stringify(v)); return res; };
  res.end = v => { if (v) res.body += String(v); res.headersSent = true; res.writableEnded = true; res.emit('finish'); return res; };
  setImmediate(() => req.emit('end'));
  await api(req, res);
  return res;
}

const emailDe = id => emails.find(e => e.to === ALUNOS.find(a => a.id === id).email);

test('o lembrete so promete salvar a sequencia de quem ainda tem uma', async () => {
  // A mensagem é sorteada entre três: várias rodadas cobrem o sorteio.
  for (let rodada = 0; rodada < 8; rodada++) {
    emails.length = 0;
    const res = await rodarCron();
    assert.equal(res.statusCode, 200, res.body);
    assert.equal(emails.length, 4, 'os quatro não praticaram hoje: todos recebem o lembrete');
    for (const id of ['sumida', 'semgelo']) {
      const e = emailDe(id);
      assert.doesNotMatch(e.subject, /streak/i, `${id}: a sequência já acabou`);
      assert.doesNotMatch(e.html, /streak|expira/i, `${id}: não promete salvar o que já perdeu`);
    }
  }

  const ontem = emailDe('ontem');
  assert.match(ontem.subject, /streak de 5 dias/, 'praticou ontem: a sequência está viva');
  assert.match(ontem.html, /Sua streak de 5 dias expira à meia-noite!/);

  const gelo = emailDe('gelo');
  assert.match(gelo.subject, /streak de 7 dias/, 'o freeze segura ontem: ainda dá para salvar hoje');
  assert.match(gelo.html, /expira à meia-noite/);
});
