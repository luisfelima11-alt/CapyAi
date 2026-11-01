'use strict';
// Home nova (PR 3): semana, cartão da ligação, "Continuar o curso" e o menu.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const ler = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const puro = v => JSON.parse(JSON.stringify(v));   // objetos de outro realm (vm)

function carregarHome() {
  const window = {};
  const ctx = vm.createContext({ window, document: { getElementById: () => null }, localStorage: { getItem: () => null }, Date, Number, String, Math, JSON });
  // As mesmas funções de data do store.js / components.js.
  vm.runInContext(ler('components.js').split('const Components = {')[0].replace(/globalThis/g, 'window'), ctx);
  ctx.capyDiaBR = window.capyDiaBR; ctx.capyDiasEntre = window.capyDiasEntre;
  vm.runInContext(ler('assets/js/pages/home.js'), ctx);
  return window.CapyHome;
}

test('week strip: Monday to Sunday, done days come from the current streak', () => {
  const H = carregarHome();
  // Quarta, 29/out/2026. Sequência de 3 terminando hoje: seg, ter e qua feitos.
  let s = puro(H.semana('2026-10-29', 3, '2026-10-29'));
  assert.deepEqual(s.map(d => d.letra).join(''), 'STQQSSD');
  assert.deepEqual(s.map(d => d.n), [26, 27, 28, 29, 30, 31, 1]);
  assert.deepEqual(s.map(d => d.feito), [false, true, true, true, false, false, false]);
  assert.equal(s.find(d => d.hoje).dia, '2026-10-29');
  // Estudou até ontem (ainda não hoje): ontem e anteontem feitos, hoje não.
  s = puro(H.semana('2026-10-29', 2, '2026-10-28'));
  assert.deepEqual(s.map(d => d.feito), [false, true, true, false, false, false, false]);
  // Sem sequência: nada feito.
  assert.ok(puro(H.semana('2026-10-29', 0, '2026-10-20')).every(d => !d.feito));
  // Domingo é o último dia da semana dele, não o primeiro da próxima.
  assert.deepEqual(puro(H.semana('2026-11-01', 1, '2026-11-01')).map(d => d.feito), [false, false, false, false, false, false, true]);
});

test('call card: free trial, Super, and the Super invite after the trial', () => {
  const H = carregarHome();
  assert.equal(H.estadoLigacao('free', 'disponivel'), 'teste');
  assert.equal(H.estadoLigacao('pro', 'disponivel'), 'teste');
  assert.equal(H.estadoLigacao('free', 'usado'), 'convite');
  assert.equal(H.estadoLigacao('super', null), 'super');
  assert.equal(H.estadoLigacao('free', undefined), 'normal');   // visitante ou /api/me fora do ar
  assert.match(H.CARTAO.teste.sub, /3 min grátis/);
  assert.equal(H.CARTAO.teste.href, 'ai_chat.html#ligar');
  assert.equal(H.CARTAO.convite.href, 'landing.html#pricing');
  // O Super tem teto mensal (VOZ_MINUTOS_MES): o convite não promete "sem limite".
  for (const c of Object.values(H.CARTAO)) assert.doesNotMatch(`${c.titulo} ${c.texto} ${c.sub}`, /sem limite|ilimitad/i);
});

test('continue card: last opened lesson, paywall respected, bad records ignored', () => {
  const H = carregarHome();
  const r = { n: 14, title: 'Daily Routine', href: 'aula_14.html' };
  assert.deepEqual(puro(H.cursoAtual(r, 'pro')), { sub: 'Continuar o curso de inglês · Aula 14 de 44', titulo: 'Aula 14 — Daily Routine', pct: 32, href: 'aula_14.html' });
  assert.equal(H.cursoAtual(r, 'free').href, 'classes.html');                     // aula paga: paywall do classes
  assert.equal(H.cursoAtual({ ...r, n: 3, href: 'aula_03.html' }, 'free').href, 'aula_03.html');
  for (const ruim of [null, {}, { ...r, href: 'javascript:alert(1)' }, { ...r, n: 99 }, { ...r, title: 5 }]) {
    assert.equal(H.cursoAtual(ruim, 'super').href, 'classes.html');
  }
});

test('greeting by Brazil time and first name only', () => {
  const H = carregarHome();
  assert.equal(H.saudacao(new Date('2026-10-29T11:00:00Z')), 'Bom dia');     // 8h em Brasília
  assert.equal(H.saudacao(new Date('2026-10-29T17:00:00Z')), 'Boa tarde');   // 14h
  assert.equal(H.saudacao(new Date('2026-10-29T23:30:00Z')), 'Boa noite');   // 20h30
  assert.equal(H.saudacao(new Date('2026-10-29T06:00:00Z')), 'Boa noite');   // 3h
  assert.equal(H.primeiroNome({ name: '  Luis Felipe Lima ' }, ''), 'Luis');
  assert.equal(H.primeiroNome(null, 'Ana'), 'Ana');
  assert.equal(H.primeiroNome(null, ''), '');
});

test('home page wiring: no HTML from data, plan card after the home script', () => {
  const html = ler('6_Home_Forest_Expedition.html');
  assert.doesNotMatch(ler('assets/js/pages/home.js'), /innerHTML|outerHTML|insertAdjacentHTML/);
  const ordem = ['components.js?v=', 'assets/js/pages/home.js', 'plano-hoje.js', 'assets/js/plano-hoje-cartao.js'].map(s => html.indexOf(`<script src="${s}`));
  assert.ok(ordem.every(i => i > 0), 'all scripts present');
  assert.deepEqual([...ordem].sort((a, b) => a - b), ordem, 'home.js listens before the plan card fires capyPlanoHoje');
  assert.match(ler('assets/js/plano-hoje-cartao.js'), /capyPlanoHoje/);
  for (const id of ['home-ligar', 'home-semana', 'plano-hoje', 'ph-itens', 'home-curso']) assert.match(html, new RegExp(`id="${id}"`));
});

test('the home events are accepted by /api/track and classes.html records the last lesson', () => {
  const api = ler('api/index.js');
  for (const ev of ['home_ligar', 'home_super', 'home_chat', 'home_curso', 'home_plano']) assert.match(api, new RegExp(`'${ev}'`));
  assert.match(ler('classes.html'), /localStorage\.setItem\('capyUltimaAula'/);
  assert.match(ler('ai_chat.html'), /location\.hash === '#ligar'/);
});

test('bottom menu: Início · Trilha · Cursos · Jogos · Mais', () => {
  const src = ler('components.js');
  const nav = src.slice(src.indexOf('renderMobileNav('), src.indexOf('<!-- More Sheet Overlay -->'));
  const rotulos = [...nav.matchAll(/<span class="text-\[10px\] font-black">([^<]+)<\/span>/g)].map(m => m[1]);
  assert.deepEqual(rotulos, ['Início', 'Trilha', 'Cursos', 'Jogos', 'Mais']);
  const mais = src.slice(src.indexOf('id="more-sheet"'), src.indexOf('initMoreSheet()'));
  assert.match(mais, /ai_chat\.html/, 'Yara AI moved into Mais');
});
