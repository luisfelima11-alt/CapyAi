// Trilha de francês, blocos 4–6 (213–242, nov/2026): revisão com être & avoir e as
// conjugações dos dois. Confere que as 30 unidades novas estão completas e ligadas
// em todas as páginas que listam a trilha.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const ler = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const sandbox = { window: {} };
vm.runInNewContext(ler('lessons_fr_data.js') + '\nwindow.__L = LESSONS_FR;', sandbox);
const NOVAS = sandbox.window.__L.filter(l => l.id >= 213);
const IDS = Array.from({ length: 30 }, (_, i) => 213 + i);

test('as 30 unidades novas existem, em ordem, com o formato da trilha', () => {
  assert.deepEqual(NOVAS.map(l => l.id), IDS);
  for (const l of NOVAS) {
    assert.equal(l.lang, 'fr');
    assert.equal(l.verbs.length, 5, `${l.id} verbs`);
    assert.equal(l.vocab.length, 18, `${l.id} vocab`);
    assert.equal(l.expressions.length, 6, `${l.id} expressions`);
    assert.equal(l.sentences.length, 10, `${l.id} sentences`);
    assert.equal(l.quiz.length, 10, `${l.id} quiz`);
    assert.equal(l.speak.length, 8, `${l.id} speak`);
    assert.equal(l.grammar.rules.length, 3, `${l.id} rules`);
    for (const r of l.grammar.table.rows) assert.equal(r.length, l.grammar.table.headers.length, `${l.id} tabela`);
    for (const q of l.quiz) {
      assert.equal(q.opts.length, 4, `${l.id} ${q.q}`);
      assert.equal(new Set(q.opts).size, 4, `${l.id} opções repetidas: ${q.q}`);
      assert.ok(q.opts.includes(q.a), `${l.id} sem a resposta certa: ${q.q}`);
    }
    // A resposta certa não pode ficar sempre na mesma posição.
    assert.ok(new Set(l.quiz.map(q => q.opts.indexOf(q.a))).size >= 3, `${l.id}: resposta certa sempre no mesmo lugar`);
  }
});

test('nada visível para o aluno fala em "gramática" nem escreve a pronúncia', () => {
  for (const l of NOVAS) {
    const visivel = JSON.stringify({ ...l, grammar: { title: l.grammar.title, rules: l.grammar.rules, table: l.grammar.table } }).replace(/"grammar":/g, '');
    assert.doesNotMatch(visivel, /gram[aá]tica|grammar/i, `${l.id}`);
    assert.doesNotMatch(visivel, /\b(il|vu|nu)-z[a-zõ]+|il-son\b/i, `${l.id}: pronúncia escrita`);
  }
});

test('as páginas que listam a trilha conhecem as 30 unidades', () => {
  const learnFr = ler('learn_fr.html');
  for (const id of IDS) assert.match(learnFr, new RegExp(`\\{ id:${id}, num:${id - 200}, block:'b[456]'`), `learn_fr.html sem ${id}`);
  for (const b of ['b4', 'b5', 'b6']) assert.match(learnFr, new RegExp(`id: '${b}'`), `bloco ${b}`);
  assert.match(learnFr, /label: 'Todas \(42\)'/);

  const learn = ler('learn.html');
  const cap = learn.slice(learn.indexOf('"name": "Français 🇫🇷"'));
  const lista = JSON.parse(cap.slice(cap.indexOf('['), cap.indexOf(']') + 1));
  assert.deepEqual(lista, Array.from({ length: 42 }, (_, i) => 201 + i));
  for (const id of IDS) assert.match(learn, new RegExp(`"id": ${id},\\s*"emoji"`), `learn.html sem a entrada ${id}`);

  const lessons = ler('lessons.html');
  for (const id of IDS) {
    const m = lessons.match(new RegExp(`"${id}": "([a-z_]+\\.html)"`));
    assert.ok(m, `lessons.html sem jogo para ${id}`);
    assert.ok(fs.existsSync(path.join(ROOT, m[1])), `${id}: o jogo ${m[1]} não existe`);
  }
  assert.match(ler('quadro.html'), /nome: '🥐 Français', ini: 201, fim: 242 \}/);
});

test('cada unidade de revisão leva à aula do mesmo tema', () => {
  const learnFr = ler('learn_fr.html');
  for (let n = 13; n <= 24; n++) {
    const aula = `fr_aula_${String(n - 12).padStart(2, '0')}.html`;
    assert.match(learnFr, new RegExp(`\\{ id:${200 + n}, [^\\n]*aula:'${aula}'`), `${200 + n} deveria levar a ${aula}`);
    assert.ok(fs.existsSync(path.join(ROOT, aula)));
  }
});
