'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');
const readJson = file => JSON.parse(read(file));

const range = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => from + i);

// Objeto vindo do vm tem outro realm, e deepEqual estrito compara protótipo.
const sameRealm = value => JSON.parse(JSON.stringify(value));

// ── Fonte do curso ──────────────────────────────────────────────────────────
// lessons_tr_data.js continua sendo carregado por learn.html e classes_tr.html,
// e é a entrada de scripts/build-lesson-data.js. O que mudou é que lessons.html
// (o runner) não lê mais daqui — ver loadLessonIndex/loadBuiltLesson abaixo.
function loadTurkishLessons() {
  const source = read('lessons_tr_data.js') + '\nglobalThis.__lessons = LESSONS_TR;';
  const context = { window: {} };
  vm.runInNewContext(source, context);
  return context.__lessons;
}

// ── Saída do build ──────────────────────────────────────────────────────────
// É daqui que a trilha realmente serve a lição: `node scripts/build-lesson-data.js`
// gera data/lessons-index.json (índice de todos os cursos) e um
// data/lessons/<id>.json por lição, e lessons.html busca os dois por fetch.
const loadLessonIndex = () => readJson('data/lessons-index.json');
const loadBuiltLesson = id => readJson('data/lessons/' + id + '.json');

// O contrato de uma lição turca, cobrado tanto na fonte quanto no arquivo
// gerado: se o build deixar de copiar um campo, a trilha abre a lição quebrada.
function assertTurkishLessonShape(lesson, label) {
  assert.equal(lesson.lang, 'tr', `${label}.lang`);
  assert.equal(lesson.course, 'turkish', `${label}.course`);
  for (const field of ['vocab', 'expressions', 'sentences', 'quiz', 'speak']) {
    assert.ok(Array.isArray(lesson[field]) && lesson[field].length >= 3, `${label}.${field}`);
  }
  assert.ok(lesson.grammar?.rules?.length >= 2, `${label}.grammar`);
  assert.ok(lesson.objective, `${label}.objective`);
  assert.ok(lesson.focus, `${label}.focus`);
}

function loadStore() {
  const values = new Map();
  const context = {
    localStorage: {
      getItem: key => values.has(key) ? values.get(key) : null,
      setItem: (key, value) => values.set(key, String(value)),
      removeItem: key => values.delete(key)
    },
    window: { location: { search: '' } },
    document: { dispatchEvent() {} },
    Event: function Event(type) { this.type = type; },
    CustomEvent: function CustomEvent(type, options) { this.type = type; this.detail = options?.detail; },
    URLSearchParams, Date, fetch: async () => ({ ok: false })
  };
  vm.runInNewContext(read('store.js') + '\nglobalThis.__store = Store;', context);
  return context.__store;
}

test('Turkish curriculum has 36 complete and uniquely identified A1-A2 lessons', () => {
  const lessons = loadTurkishLessons();
  assert.equal(lessons.length, 36);
  assert.deepEqual(Array.from(lessons, lesson => lesson.id), range(301, 336));
  for (const lesson of lessons) assertTurkishLessonShape(lesson, `lessons_tr_data.js#${lesson.id}`);
});

test('English, French and Turkish completion keys remain isolated', () => {
  const Store = loadStore();
  Store.completeMini(301, 1, 'tr');
  assert.equal(Store.isMiniDone(301, 1, 'tr'), true);
  assert.equal(Store.isMiniDone(301, 1, 'en'), false);
  assert.equal(Store.isMiniDone(301, 1, 'fr'), false);

  Store.completeLesson(301, 'tr');
  assert.equal(Store.isLessonDone(301, 'tr'), true);
  assert.equal(Store.isLessonDone(301, 'en'), false);
});

test('trail and runner expose Turkish without replacing English or French', () => {
  const trail = read('learn.html');
  const runner = read('lessons.html');
  assert.match(trail, /data-lang="en"/);
  assert.match(trail, /data-lang="fr"/);
  assert.match(trail, /data-lang="tr"/);
  assert.match(trail, /"lang": "tr"/);
  assert.match(trail, /"id": 32/);
  assert.match(runner, /'tr-TR'/);
  assert.match(runner, /Store\.completeMini\(currentLesson\.id, miniNum, _lessonLanguage\(\)\)/);
  assert.match(runner, /startTurkishGame\(\)/);
  assert.match(runner, /function _nextLessonInCurrentLanguage\(\)/);
  assert.doesNotMatch(runner, /next\s*<=\s*24/);
  assert.doesNotMatch(runner, /nextLesson\s*<=\s*24/);
  assert.match(trail, /YARA_WIDGET = \{ lang: currentTrailLang/);

  // O runner não carrega mais nenhum lessons_*_data.js: desde que as lições
  // saíram do HTML, ele busca o índice e a lição pedida em data/. Provar que o
  // turco chega até ele é provar que o índice gerado separa os cursos por
  // `lang` e que as 36 lições turcas existem lá, ao lado de inglês e francês.
  assert.match(runner, /fetch\('data\/lessons-index\.json/);
  assert.match(runner, /fetch\('data\/lessons\/' \+ id \+ '\.json/);
  assert.doesNotMatch(runner, /lessons_[a-z]+_data\.js/);
  assert.match(runner, /LESSON_INDEX\.filter\(lesson => \(lesson\.lang \|\| 'en'\) === language\)/);

  const index = loadLessonIndex();
  const idsOf = lang => index.filter(entry => entry.lang === lang).map(entry => entry.id);

  // Um id serve uma lição só: id repetido significa um curso sobrescrevendo o
  // data/lessons/<id>.json do outro — foi assim que o turco já foi servido no
  // lugar de outro curso.
  const ids = index.map(entry => entry.id);
  assert.equal(new Set(ids).size, ids.length, 'ids duplicados em data/lessons-index.json');

  // As três faixas convivem no mesmo índice: turco inteiro, sem comer nada do
  // inglês base (1-110, antes da faixa francesa) nem do francês (201-212).
  assert.deepEqual(idsOf('tr'), range(301, 336));
  assert.deepEqual(idsOf('fr'), range(201, 212));
  assert.deepEqual(idsOf('en').filter(id => id < 201), range(1, 110));

  // E cada lição turca do índice tem mesmo o arquivo que a trilha vai baixar,
  // com o schema esperado e igual à fonte — build desatualizado é falha.
  for (const lesson of loadTurkishLessons()) {
    const built = loadBuiltLesson(lesson.id);
    assertTurkishLessonShape(built, `data/lessons/${lesson.id}.json`);
    assert.deepEqual(built, sameRealm({ ...lesson, lang: 'tr' }),
      `data/lessons/${lesson.id}.json difere de lessons_tr_data.js — rode node scripts/build-lesson-data.js`);
    assert.deepEqual(index.find(entry => entry.id === lesson.id),
      { id: lesson.id, title: lesson.title, emoji: lesson.emoji, lang: 'tr' });
  }
});

test('course page links to all Turkish lessons and its own daily trail', () => {
  const page = read('classes_tr.html');
  assert.match(page, /learn\.html\?lang=tr/);
  assert.match(page, /144 minilições/);
  assert.match(page, /CHAPTERS_TR/);
  assert.match(page, /Store\.isLessonDone\(l\.id,'tr'\)/);
  assert.match(page, /Material\+Symbols\+Outlined/);
  assert.match(page, /\.hero-pattern\{[^}]*background:radial-gradient/);
  assert.doesNotMatch(page, /bg-\[radial-gradient/);
});
