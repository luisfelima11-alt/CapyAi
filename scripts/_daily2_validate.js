const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const { extractBalanced } = require('./_extract.js');

let errors = [];
let ok = (label) => console.log('OK:', label);
let fail = (label, detail) => { errors.push(label + (detail ? ' :: ' + detail : '')); console.log('FAIL:', label, detail || ''); };

const learnHtml = fs.readFileSync(path.join(root, 'learn.html'), 'utf8');
const lessonsHtml = fs.readFileSync(path.join(root, 'lessons.html'), 'utf8');

// 1. Syntax check: extract every <script> block and run new Function on it
function checkScripts(html, fname) {
  const scriptRe = /<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi;
  let m;
  let count = 0;
  let localErr = 0;
  while ((m = scriptRe.exec(html))) {
    const code = m[1];
    if (!code.trim()) continue;
    if (m[0].includes('src=')) continue;
    count++;
    try {
      new Function(code);
    } catch (e) {
      fail('Syntax error in ' + fname + ' script block #' + count, e.message);
      localErr++;
    }
  }
  if (localErr === 0) ok(fname + ': all ' + count + ' script blocks parse (new Function)');
}
checkScripts(learnHtml, 'learn.html');
checkScripts(lessonsHtml, 'lessons.html');

// 2. Load data structures
const TRAIL = new Function('return ' + extractBalanced(learnHtml, 'TRAIL'))();
const CHAPTERS = new Function('return ' + extractBalanced(learnHtml, 'CHAPTERS'))();
const JADSON_LESSONS = new Function('return ' + extractBalanced(lessonsHtml, 'JADSON_LESSONS'))();
const TRAIL_GAMES = new Function('return ' + extractBalanced(lessonsHtml, 'TRAIL_GAMES'))();

const NEW_IDS = [103, 104];
const NEW_CHAPTER_ID = 23;

// 3. Unique IDs check (TRAIL ids across EN/FR/GPS, no collisions)
const idCounts = {};
TRAIL.forEach(l => { idCounts[l.id] = (idCounts[l.id] || 0) + 1; });
const dupes = Object.entries(idCounts).filter(([id, c]) => c > 1);
if (dupes.length) fail('Duplicate TRAIL ids', JSON.stringify(dupes));
else ok('No duplicate TRAIL ids (' + TRAIL.length + ' total)');

NEW_IDS.forEach(id => {
  const matches = TRAIL.filter(l => l.id === id);
  if (matches.length !== 1) fail('TRAIL id ' + id + ' count != 1', matches.length);
});
if (!errors.some(e => e.includes('TRAIL id'))) ok('New ids ' + NEW_IDS.join(', ') + ' present exactly once, no collision with fr(201+)/gps(301+)');

// 4. Chapter id uniqueness + new chapter present
const chIdCounts = {};
CHAPTERS.forEach(c => { chIdCounts[c.id] = (chIdCounts[c.id] || 0) + 1; });
const chDupes = Object.entries(chIdCounts).filter(([id, c]) => c > 1);
if (chDupes.length) fail('Duplicate CHAPTERS ids', JSON.stringify(chDupes));
else ok('No duplicate CHAPTERS ids (' + CHAPTERS.length + ' total)');
const newCh = CHAPTERS.find(c => c.id === NEW_CHAPTER_ID);
if (!newCh) fail('New chapter ' + NEW_CHAPTER_ID + ' missing');
else if (newCh.lessons.join(',') !== NEW_IDS.join(',')) fail('New chapter ' + NEW_CHAPTER_ID + ' lessons mismatch', JSON.stringify(newCh.lessons));
else ok('New chapter ' + NEW_CHAPTER_ID + ' present with lessons [' + NEW_IDS.join(',') + ']');

// Chapter color collision check vs last-3-before-new CHAPTERS entries
const idxNew = CHAPTERS.findIndex(c => c.id === NEW_CHAPTER_ID);
const prevThree = CHAPTERS.slice(Math.max(0, idxNew - 3), idxNew);
const colorClash = prevThree.filter(c => c.color === newCh.color);
if (colorClash.length) fail('New chapter color collides with a recent chapter', JSON.stringify(colorClash));
else ok('New chapter color (' + newCh.color + ') does not collide with previous 3 chapters (' + prevThree.map(c => c.color).join(' | ') + ')');

// 5. Parity: every EN id (<200) in TRAIL <-> JADSON_LESSONS
const enIds = TRAIL.filter(l => l.id < 200).map(l => l.id).sort((a, b) => a - b);
const jadsonIds = JADSON_LESSONS.map(l => l.id).sort((a, b) => a - b);
const missingInJadson = enIds.filter(id => !jadsonIds.includes(id));
const extraInJadson = jadsonIds.filter(id => !enIds.includes(id));
if (missingInJadson.length) fail('EN ids missing from JADSON_LESSONS', JSON.stringify(missingInJadson));
if (extraInJadson.length) fail('JADSON_LESSONS ids not in TRAIL EN', JSON.stringify(extraInJadson));
if (!missingInJadson.length && !extraInJadson.length) ok('1:1 parity TRAIL(EN) <-> JADSON_LESSONS (' + enIds.length + ' lessons)');

// 6. TRAIL_GAMES covers new ids
NEW_IDS.forEach(id => {
  if (!TRAIL_GAMES[id]) fail('TRAIL_GAMES missing entry for id ' + id);
});
if (NEW_IDS.every(id => TRAIL_GAMES[id])) ok('TRAIL_GAMES covers new ids ' + NEW_IDS.map(id => id + '=' + TRAIL_GAMES[id]).join(', '));

// 7. Schema count checks for new lessons
function checkSchema(lesson) {
  const label = 'Lesson ' + lesson.id + ' (' + lesson.title + ')';
  const checks = [
    ['verbs', 4], ['vocab', 30], ['expressions', 4], ['sentences', 8], ['quiz', 5], ['speak', 5]
  ];
  checks.forEach(([field, expected]) => {
    const actual = lesson[field] ? lesson[field].length : 0;
    if (actual !== expected) fail(label + ': ' + field + ' count', 'expected ' + expected + ' got ' + actual);
  });
  if (!lesson.grammar || !Array.isArray(lesson.grammar.rules) || lesson.grammar.rules.length !== 4) {
    fail(label + ': grammar.rules count', lesson.grammar ? lesson.grammar.rules.length : 'missing grammar');
  }
  if (!lesson.grammar || !lesson.grammar.table || !Array.isArray(lesson.grammar.table.rows) || lesson.grammar.table.rows.length !== 4) {
    fail(label + ': grammar.table.rows count', lesson.grammar && lesson.grammar.table ? lesson.grammar.table.rows.length : 'missing');
  }
  lesson.quiz.forEach((q, i) => {
    if (!Array.isArray(q.opts) || q.opts.length !== 4) fail(label + ': quiz[' + i + '].opts count', q.opts ? q.opts.length : 'missing');
    if (!q.opts.includes(q.a)) fail(label + ': quiz[' + i + '].a not in opts', JSON.stringify(q));
  });
  console.log('Schema check for', label, '-> verbs:' + lesson.verbs.length, 'vocab:' + lesson.vocab.length, 'expressions:' + lesson.expressions.length, 'sentences:' + lesson.sentences.length, 'quiz:' + lesson.quiz.length, 'speak:' + lesson.speak.length);
}
NEW_IDS.forEach(id => {
  const l = JADSON_LESSONS.find(x => x.id === id);
  if (!l) { fail('Lesson ' + id + ' not found in JADSON_LESSONS'); return; }
  checkSchema(l);
});

// 8. Title uniqueness (no repeated theme) across ALL EN lessons
const titles = TRAIL.filter(l => l.id < 200).map(l => l.title.toLowerCase());
const titleCounts = {};
titles.forEach(t => titleCounts[t] = (titleCounts[t] || 0) + 1);
const dupTitles = Object.entries(titleCounts).filter(([t, c]) => c > 1);
if (dupTitles.length) fail('Duplicate lesson titles', JSON.stringify(dupTitles));
else ok('No duplicate lesson titles (' + titles.length + ' total)');

// 9. Mojibake scan
const mojibakePatterns = ['â€', 'ðŸ', 'Ã©', 'Ã§', 'Ã£'];
function scanMojibake(html, fname) {
  mojibakePatterns.forEach(p => {
    if (html.includes(p)) fail('Mojibake pattern found in ' + fname, p);
  });
}
scanMojibake(learnHtml, 'learn.html');
scanMojibake(lessonsHtml, 'lessons.html');
if (!errors.some(e => e.includes('Mojibake'))) ok('No mojibake markers found in learn.html or lessons.html');

console.log('\n=== VALIDATION SUMMARY ===');
if (errors.length === 0) {
  console.log('ALL CHECKS PASSED');
  process.exit(0);
} else {
  console.log(errors.length + ' FAILURE(S):');
  errors.forEach(e => console.log(' - ' + e));
  process.exit(1);
}
