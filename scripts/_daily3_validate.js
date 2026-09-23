// Validação da rotina diária (arquitetura atual: data/lessons/<id>.json +
// data/lessons-index.json + TRAIL/CHAPTERS em learn.html + TRAIL_GAMES em lessons.html).
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

let failures = [];
function ok(msg) { console.log('OK   - ' + msg); }
function fail(msg, detail) { failures.push(msg + (detail ? ' :: ' + detail : '')); console.log('FAIL - ' + msg + (detail ? ' :: ' + detail : '')); }

const NEW_IDS = [109, 110];

// ── 1. Extract & syntax-check TRAIL / CHAPTERS from learn.html ─────────────
function extractBalanced(src, marker) {
  const i = src.indexOf(marker);
  if (i < 0) throw new Error('marker not found: ' + marker);
  const open = src.indexOf('[', i);
  let level = 0, end = -1, inStr = false, q = '';
  for (let k = open; k < src.length; k++) {
    const c = src[k];
    if (inStr) { if (c === '\\') { k++; continue; } if (c === q) inStr = false; continue; }
    if (c === '"' || c === "'") { inStr = true; q = c; continue; }
    if (c === '[') level++;
    else if (c === ']') { level--; if (level === 0) { end = k + 1; break; } }
  }
  if (end < 0) throw new Error('unterminated array: ' + marker);
  return src.slice(open, end);
}

const learnHtml = fs.readFileSync(path.join(ROOT, 'learn.html'), 'utf8');
const lessonsHtml = fs.readFileSync(path.join(ROOT, 'lessons.html'), 'utf8');

let TRAIL, CHAPTERS, TRAIL_GAMES;
try {
  TRAIL = new Function('return ' + extractBalanced(learnHtml, 'const TRAIL = ['))();
  ok('learn.html TRAIL array — sintaxe válida (' + TRAIL.length + ' lições)');
} catch (e) { fail('learn.html TRAIL syntax', e.message); }

try {
  CHAPTERS = new Function('return ' + extractBalanced(learnHtml, 'const CHAPTERS = ['))();
  ok('learn.html CHAPTERS array — sintaxe válida (' + CHAPTERS.length + ' capítulos)');
} catch (e) { fail('learn.html CHAPTERS syntax', e.message); }

try {
  const i = lessonsHtml.indexOf('const TRAIL_GAMES = {');
  const open = lessonsHtml.indexOf('{', i);
  let level = 0, end = -1, inStr = false, q = '';
  for (let k = open; k < lessonsHtml.length; k++) {
    const c = lessonsHtml[k];
    if (inStr) { if (c === '\\') { k++; continue; } if (c === q) inStr = false; continue; }
    if (c === '"' || c === "'") { inStr = true; q = c; continue; }
    if (c === '{') level++;
    else if (c === '}') { level--; if (level === 0) { end = k + 1; break; } }
  }
  TRAIL_GAMES = new Function('return ' + lessonsHtml.slice(open, end))();
  ok('lessons.html TRAIL_GAMES object — sintaxe válida (' + Object.keys(TRAIL_GAMES).length + ' entradas)');
} catch (e) { fail('lessons.html TRAIL_GAMES syntax', e.message); }

// ── 2. New lesson JSON files parse ──────────────────────────────────────────
const lessonObjs = {};
for (const id of NEW_IDS) {
  try {
    const p = path.join(ROOT, 'data', 'lessons', id + '.json');
    lessonObjs[id] = JSON.parse(fs.readFileSync(p, 'utf8'));
    ok('data/lessons/' + id + '.json — JSON válido');
  } catch (e) { fail('data/lessons/' + id + '.json parse', e.message); }
}

// ── 3. ID uniqueness — no collisions with FR(201+)/TR(301-336)/GPS(501-508) or existing EN ──
if (TRAIL) {
  const allIds = TRAIL.map(l => l.id);
  const dupes = allIds.filter((id, i) => allIds.indexOf(id) !== i);
  if (dupes.length) fail('IDs duplicados em TRAIL', JSON.stringify([...new Set(dupes)]));
  else ok('Nenhum ID duplicado em TRAIL (' + allIds.length + ' lições)');

  for (const id of NEW_IDS) {
    const count = allIds.filter(x => x === id).length;
    if (count !== 1) fail('ID ' + id + ' não aparece exatamente 1x em TRAIL', 'aparece ' + count + 'x');
  }
}

// ── 4. Parity EN(<200): TRAIL <-> data/lessons/<id>.json <-> lessons-index.json ──
if (TRAIL) {
  const enIds = TRAIL.filter(l => l.id < 200).map(l => l.id).sort((a, b) => a - b);
  const lessonsDir = fs.readdirSync(path.join(ROOT, 'data', 'lessons')).filter(f => /^\d+\.json$/.test(f)).map(f => Number(f.replace('.json', '')));
  const enOnDisk = lessonsDir.filter(id => id < 200).sort((a, b) => a - b);
  const missingOnDisk = enIds.filter(id => !enOnDisk.includes(id));
  const extraOnDisk = enOnDisk.filter(id => !enIds.includes(id));
  if (missingOnDisk.length) fail('EN ids em TRAIL sem data/lessons/<id>.json', JSON.stringify(missingOnDisk));
  if (extraOnDisk.length) fail('data/lessons/<id>.json sem entrada em TRAIL (EN)', JSON.stringify(extraOnDisk));
  if (!missingOnDisk.length && !extraOnDisk.length) ok('Paridade 1:1 TRAIL(EN) <-> data/lessons/*.json (' + enIds.length + ' lições)');

  const index = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'lessons-index.json'), 'utf8'));
  const indexIds = new Set(index.map(l => l.id));
  const missingInIndex = enIds.filter(id => !indexIds.has(id));
  if (missingInIndex.length) fail('EN ids ausentes em data/lessons-index.json', JSON.stringify(missingInIndex));
  else ok('Todos os EN ids presentes em data/lessons-index.json');

  for (const id of NEW_IDS) {
    const entry = index.find(l => l.id === id);
    if (!entry) fail('id ' + id + ' ausente do índice');
    else if (entry.title !== lessonObjs[id].title) fail('título divergente no índice para id ' + id, entry.title + ' != ' + lessonObjs[id].title);
  }
}

// ── 5. TRAIL_GAMES covers new ids ───────────────────────────────────────────
if (TRAIL_GAMES) {
  for (const id of NEW_IDS) {
    if (!TRAIL_GAMES[String(id)]) fail('TRAIL_GAMES não cobre id ' + id);
    else ok('TRAIL_GAMES cobre id ' + id + ' (' + TRAIL_GAMES[String(id)] + ')');
  }
}

// ── 6. Chapter check — new chapter id must not collide, lessons must exist ──
if (CHAPTERS) {
  const chapterIds = CHAPTERS.map(c => c.id);
  const dupeChapters = chapterIds.filter((id, i) => chapterIds.indexOf(id) !== i);
  if (dupeChapters.length) fail('IDs de capítulo duplicados', JSON.stringify([...new Set(dupeChapters)]));
  else ok('Nenhum ID de capítulo duplicado (' + chapterIds.length + ' capítulos)');

  const newChapter = CHAPTERS.find(c => c.lessons && NEW_IDS.every(id => c.lessons.includes(id)));
  if (!newChapter) fail('Nenhum capítulo novo contém exatamente os ids ' + NEW_IDS.join(','));
  else ok('Capítulo novo encontrado: id ' + newChapter.id + ' "' + newChapter.name + '" com lições ' + JSON.stringify(newChapter.lessons));
}

// ── 7. Schema shape for each new lesson ─────────────────────────────────────
for (const id of NEW_IDS) {
  const l = lessonObjs[id];
  if (!l) continue;
  const checks = [
    [Array.isArray(l.verbs) && l.verbs.length === 4, 'verbs.length === 4', l.verbs && l.verbs.length],
    [Array.isArray(l.vocab) && l.vocab.length === 30, 'vocab.length === 30', l.vocab && l.vocab.length],
    [Array.isArray(l.expressions) && l.expressions.length === 4, 'expressions.length === 4', l.expressions && l.expressions.length],
    [Array.isArray(l.sentences) && l.sentences.length === 8, 'sentences.length === 8', l.sentences && l.sentences.length],
    [l.grammar && Array.isArray(l.grammar.rules) && l.grammar.rules.length === 4, 'grammar.rules.length === 4', l.grammar && l.grammar.rules && l.grammar.rules.length],
    [l.grammar && l.grammar.table && Array.isArray(l.grammar.table.rows) && l.grammar.table.rows.length === 4, 'grammar.table.rows.length === 4', l.grammar && l.grammar.table && l.grammar.table.rows && l.grammar.table.rows.length],
    [Array.isArray(l.quiz) && l.quiz.length === 5, 'quiz.length === 5', l.quiz && l.quiz.length],
    [Array.isArray(l.speak) && l.speak.length === 5, 'speak.length === 5', l.speak && l.speak.length],
  ];
  let allPass = true;
  for (const [cond, label, actual] of checks) {
    if (!cond) { fail('id ' + id + ' schema: ' + label, 'valor real: ' + actual); allPass = false; }
  }
  // vocab en/pt pairs and quiz opts sanity
  if (l.vocab && l.vocab.some(v => !v.en || !v.pt)) { fail('id ' + id + ' vocab com par en/pt incompleto'); allPass = false; }
  if (l.quiz && l.quiz.some(q => !q.opts || q.opts.length !== 4 || !q.opts.includes(q.a))) { fail('id ' + id + ' quiz com opts inválidas (precisa 4 opts incluindo a resposta a)'); allPass = false; }
  if (allPass) ok('id ' + id + ' — schema completo e correto');
}

// ── 8. Duplicate titles across all EN lessons ───────────────────────────────
if (TRAIL) {
  const enTitles = TRAIL.filter(l => l.id < 200).map(l => l.title);
  const dupeTitles = enTitles.filter((t, i) => enTitles.indexOf(t) !== i);
  if (dupeTitles.length) fail('Títulos EN duplicados', JSON.stringify([...new Set(dupeTitles)]));
  else ok('Nenhum título EN duplicado (' + enTitles.length + ' lições)');
}

// ── 9. Mojibake scan ─────────────────────────────────────────────────────────
const mojibakeMarkers = ['â€', 'ðŸ', 'Ã©', 'Ã§', 'Ã£', 'Ã‚', 'Â '];
for (const [name, content] of [
  ['learn.html', learnHtml],
  ['lessons.html', lessonsHtml],
  ['data/lessons/109.json', fs.readFileSync(path.join(ROOT, 'data', 'lessons', '109.json'), 'utf8')],
  ['data/lessons/110.json', fs.readFileSync(path.join(ROOT, 'data', 'lessons', '110.json'), 'utf8')],
  ['data/lessons-index.json', fs.readFileSync(path.join(ROOT, 'data', 'lessons-index.json'), 'utf8')],
]) {
  const found = mojibakeMarkers.filter(m => content.includes(m));
  if (found.length) fail('Mojibake em ' + name, JSON.stringify(found));
  else ok('Zero mojibake em ' + name);
}

console.log('\n========================================');
if (failures.length) {
  console.log('RESULTADO: FALHOU (' + failures.length + ' erro(s))');
  failures.forEach(f => console.log(' - ' + f));
  process.exit(1);
} else {
  console.log('RESULTADO: TODAS AS VALIDAÇÕES PASSARAM');
  process.exit(0);
}
