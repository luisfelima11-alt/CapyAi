const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');

const learnHtml = fs.readFileSync(path.join(root, 'learn.html'), 'utf8');
const lessonsHtml = fs.readFileSync(path.join(root, 'lessons.html'), 'utf8');

function extractConst(src, name) {
  const re = new RegExp('const\\s+' + name + '\\s*=\\s*(\\[[\\s\\S]*?\\]);\\s*\\n');
  const m = src.match(re);
  if (!m) throw new Error('not found: ' + name);
  return m[1];
}

function extractConstObj(src, name) {
  const re = new RegExp('const\\s+' + name + '\\s*=\\s*(\\{[\\s\\S]*?\\n\\});\\s*\\n');
  const m = src.match(re);
  if (!m) throw new Error('not found: ' + name);
  return m[1];
}

const trailSrc = extractConst(learnHtml, 'TRAIL');
const chaptersSrc = extractConst(learnHtml, 'CHAPTERS');

const TRAIL = new Function('return ' + trailSrc)();
const CHAPTERS = new Function('return ' + chaptersSrc)();

console.log('TRAIL length:', TRAIL.length);
console.log('CHAPTERS length:', CHAPTERS.length);

const enLessons = TRAIL.filter(l => l.id < 200);
const maxEnId = Math.max(...enLessons.map(l => l.id));
console.log('Max EN id (<200):', maxEnId);
console.log('Next EN id:', maxEnId + 1);

console.log('\\nAll chapter ids:', CHAPTERS.map(c => c.id));
const maxChapterId = Math.max(...CHAPTERS.map(c => c.id));
console.log('Max chapter id:', maxChapterId);
console.log('Next chapter id (need to skip 5 and 6 if not already used... check):', maxChapterId + 1);

console.log('\\n--- Existing chapters detail ---');
CHAPTERS.forEach(c => {
  console.log(c.id, JSON.stringify(c.title || c.name || c), '| lessons:', c.lessons ? c.lessons.length : (c.lessonIds ? c.lessonIds.length : '?'));
});

console.log('\\n--- All EN lesson titles ---');
enLessons.sort((a,b)=>a.id-b.id).forEach(l => console.log(l.id, l.title));

fs.writeFileSync(path.join(root, 'scripts', '_trail_snapshot.json'), JSON.stringify({TRAIL, CHAPTERS}, null, 2), 'utf8');
console.log('\\nSnapshot written.');
