'use strict';
// Plano de hoje (home nova, PR 2): a próxima mini-lição, o evento diário da agenda
// e o link do Google Agenda.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
process.env.SUPABASE_URL = process.env.SUPABASE_URL || 'https://supabase.invalid';
const { icsDaAgenda } = require('../api/index.js')._internos;

function carregarPlano() {
  const window = {};
  const store = new Map();
  const ctx = vm.createContext({ window, localStorage: { getItem: k => store.get(k) ?? null, setItem: (k, v) => store.set(k, String(v)) }, URLSearchParams, Date, Set, JSON, Number, String, Math, Promise });
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'plano-hoje.js'), 'utf8'), ctx);
  return window.CapyPlano;
}

test('proximaMini continues where the student stopped, else the first unfinished mini', () => {
  const P = carregarPlano();
  const indice = [{ id: 1, lang: 'en' }, { id: 2, lang: 'en' }, { id: 3, lang: 'en' }, { id: 201, lang: 'fr' }];
  assert.deepEqual(JSON.parse(JSON.stringify(P._proximaMini(indice, [], null))), { lessonId: 1, mini: 1 });
  assert.deepEqual(JSON.parse(JSON.stringify(P._proximaMini(indice, ['1_1', '1_2'], null))), { lessonId: 1, mini: 3 });
  assert.deepEqual(JSON.parse(JSON.stringify(P._proximaMini(indice, ['1_1', '1_2', '1_3', '1_4'], null))), { lessonId: 2, mini: 1 });
  // Picked up lesson 3 last time: continue there even if lesson 2 is unfinished.
  assert.deepEqual(JSON.parse(JSON.stringify(P._proximaMini(indice, ['3_1'], { lessonId: 3, mini: 1 }))), { lessonId: 3, mini: 2 });
  // Lesson 3 done: wraps around to what is left earlier.
  assert.deepEqual(JSON.parse(JSON.stringify(P._proximaMini(indice, ['3_1', '3_2', '3_3', '3_4'], { lessonId: 3 }))), { lessonId: 1, mini: 1 });
  assert.equal(P._proximaMini([{ id: 1 }], ['1_1', '1_2', '1_3', '1_4'], null), null);
});

test('Google Calendar link: daily, in Brazil time, 15 minutes at the chosen hour', () => {
  const P = carregarPlano();
  const u = new URL(P.linkGoogle('19:00', '2026-10-29'));
  assert.equal(u.origin + u.pathname, 'https://calendar.google.com/calendar/render');
  assert.equal(u.searchParams.get('action'), 'TEMPLATE');
  assert.equal(u.searchParams.get('dates'), '20261029T190000/20261029T191500');
  assert.equal(u.searchParams.get('ctz'), 'America/Sao_Paulo');
  assert.equal(u.searchParams.get('recur'), 'RRULE:FREQ=DAILY');
  assert.equal(new URL(P.linkGoogle('23:50', '2026-10-29')).searchParams.get('dates'), '20261029T235000/20261029T000500');
  assert.equal(P.linkIcs('07:30'), '/api/agenda.ics?hora=07%3A30');
  assert.equal(P.salvarHorario('25:00'), false);
  assert.equal(P.salvarHorario('07:30'), true);
  assert.equal(P.horario(), '07:30');
});

test('agenda .ics: valid daily event with an alarm, and only HH:MM accepted', () => {
  const ics = icsDaAgenda('19:30', new Date('2026-10-29T12:00:00Z'));
  assert.ok(ics.startsWith('BEGIN:VCALENDAR\r\n') && ics.endsWith('END:VCALENDAR\r\n'));
  for (const linha of ['VERSION:2.0', 'TZID:America/Sao_Paulo', 'DTSTART;TZID=America/Sao_Paulo:20261029T193000',
    'DURATION:PT15M', 'RRULE:FREQ=DAILY', 'BEGIN:VALARM', 'TRIGGER:PT0M', 'UID:capy-ingles-1930@capyenglish.com.br']) {
    assert.ok(ics.split('\r\n').includes(linha), `missing ${linha}`);
  }
  assert.doesNotMatch(ics, /(?<!\r)\n/, 'CRLF line endings only');
  for (const ruim of ['24:00', '7:30', '19:30\r\nX-EVIL:1', '', null, '19:3']) assert.equal(icsDaAgenda(ruim), null);
});

test('the plan card builds the list without HTML from data', () => {
  const fonte = fs.readFileSync(path.join(ROOT, 'assets', 'js', 'plano-hoje-cartao.js'), 'utf8');
  assert.doesNotMatch(fonte, /innerHTML|outerHTML|insertAdjacentHTML/);
});
