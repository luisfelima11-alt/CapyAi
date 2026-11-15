'use strict';

// O limite diário de IA do servidor vira no dia de BRASÍLIA, como o contador
// do navegador (store.js, capyHojeBR). Até 13/nov/2026 o servidor usava o dia
// UTC, que vira às 21h de Brasília: o visitante que usava os 3 usos às 22h
// gastava a cota do dia SEGUINTE. Na manhã seguinte o navegador mostrava
// "3 chats left today", mas o servidor respondia 429 até as 21h.
//
// Sem Supabase no teste: o checkRateLimit cai no contador em memória, que usa a
// mesma chave (balde) do caminho de produção.

const test = require('node:test');
const assert = require('node:assert/strict');

delete process.env.SUPABASE_URL;
global.fetch = () => Promise.reject(new Error('sem rede no teste'));

// Relógio falso no processo inteiro: a API lê `new Date()` e `Date.now()`.
const RelogioReal = Date;
const relogio = { agora: '2026-09-04T01:00:00Z' };
class RelogioFake extends RelogioReal {
  constructor(...args) { if (args.length === 0) super(relogio.agora); else super(...args); }
  static now() { return new RelogioReal(relogio.agora).getTime(); }
}
global.Date = RelogioFake;

const { checkRateLimit } = require('../api/index')._internos;

let n = 0;
function visitante(id) {
  return {
    headers: { 'x-forwarded-for': '198.51.100.' + id },
    socket: { remoteAddress: '198.51.100.' + id },
    _securityIdentity: { kind: 'guest', guestId: 'limite-dia-br-' + id },
  };
}

test('usar os 3 usos de IA as 22h nao bloqueia o visitante na manha seguinte', async () => {
  const id = ++n;
  relogio.agora = '2026-09-04T01:00:00Z';   // 03/set, 22h em Brasília
  const noite = [];
  for (let i = 0; i < 4; i++) noite.push((await checkRateLimit(visitante(id), 'chat')).ok);
  assert.deepEqual(noite, [true, true, true, false], 'premissa: 3 usos por dia para visitante');

  relogio.agora = '2026-09-04T12:00:00Z';   // 04/set, 9h em Brasília: dia novo
  assert.equal((await checkRateLimit(visitante(id), 'chat')).ok, true,
    'dia novo em Brasília, cota nova (o navegador já mostra 3 restantes)');
});

test('as 21h de Brasilia o limite ainda NAO renovou (o dia so vira a meia-noite)', async () => {
  const id = ++n;
  relogio.agora = '2026-09-03T15:00:00Z';   // 03/set, 12h em Brasília
  for (let i = 0; i < 3; i++) assert.equal((await checkRateLimit(visitante(id), 'chat')).ok, true);
  relogio.agora = '2026-09-04T00:30:00Z';   // 03/set, 21h30 em Brasília (já é dia 4 em UTC)
  assert.equal((await checkRateLimit(visitante(id), 'chat')).ok, false, 'mesmo dia em Brasília');
});

test('quem bate no limite recebe o tempo ate a meia-noite de Brasilia', async () => {
  const id = ++n;
  relogio.agora = '2026-09-03T15:00:00Z';   // 12h em Brasília
  for (let i = 0; i < 3; i++) await checkRateLimit(visitante(id), 'chat');
  const r = await checkRateLimit(visitante(id), 'chat');
  assert.equal(r.ok, false);
  assert.equal(r.retryAfter, 12 * 3600, 'faltam 12h para a meia-noite de Brasília (03h UTC)');
});
