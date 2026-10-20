// Regra do Luis (19/out/2026): o curso de francês não mostra a pronúncia escrita ("Bonjour [bon-JUR]").
// E a voz das aulas é a da OpenAI com sotaque francês, lendo só a frase em francês.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const PRONUNCIA = /(?<![\w\])])\[[^\]\[<>$`'"=(){};\n]{2,45}\]/g; // colchete solto, não índice de array (WO1_DATA[si])
const aulas = fs.readdirSync(ROOT).filter(f => /^fr_aula_\d+\.html$/.test(f)).sort();

function consts(html) {
  const out = {};
  for (const nome of ['VOCAB_DATA', 'VERBS_DATA', 'VERBS_QUIZ_DATA', 'EXPR_DATA', 'DIALOGUE_LINES', 'QUIZ', 'SPEAK_DATA']) {
    const m = html.match(new RegExp('^const ' + nome + ' = (\\[[\\s\\S]*?\\n\\]);', 'm'));
    if (m) out[nome] = JSON.parse(m[1]);
  }
  return out;
}
function textos(x, acc = []) {
  if (typeof x === 'string') acc.push(x);
  else if (Array.isArray(x)) x.forEach(y => textos(y, acc));
  else if (x && typeof x === 'object') Object.values(x).forEach(y => textos(y, acc));
  return acc;
}

test('as 12 aulas de francês não têm pronúncia escrita nos dados nem no texto fixo', () => {
  assert.equal(aulas.length, 12);
  for (const f of aulas) {
    const html = fs.readFileSync(path.join(ROOT, f), 'utf8');
    const d = consts(html);
    for (const [nome, dados] of Object.entries(d)) {
      for (const t of textos(dados)) assert.equal((t.match(PRONUNCIA) || []).length, 0, `${f} ${nome}: ${t.slice(0, 80)}`);
      assert.ok(!JSON.stringify(dados).includes('"phon"'), `${f} ${nome} ainda tem phon`);
    }
    const fixo = html.split('\n').filter(l => /[✅❌💡]/.test(l)).join('\n');
    assert.equal((fixo.match(PRONUNCIA) || []).length, 0, `${f}: texto fixo com pronúncia`);
    assert.ok(!/\$\{[vs]\.phon\}/.test(html), `${f}: ainda desenha o phon`);
    assert.ok(!html.includes('Forma &amp; Pronúncia'), `${f}: cabeçalho antigo da tabela`);
  }
});

test('os quizzes de francês continuam coerentes (resposta entre as alternativas, nenhuma vazia ou repetida)', () => {
  for (const f of aulas) {
    const { QUIZ } = consts(fs.readFileSync(path.join(ROOT, f), 'utf8'));
    assert.ok(QUIZ && QUIZ.length >= 8, f);
    for (const q of QUIZ) {
      if (!q.opts) continue;
      assert.ok(q.opts.includes(q.a), `${f}: resposta fora das alternativas: ${q.q}`);
      assert.ok(q.opts.every(o => o && o.trim() && !/^\s*\(/.test(o)), `${f}: alternativa vazia: ${q.q}`);
      assert.equal(new Set(q.opts).size, q.opts.length, `${f}: alternativas repetidas: ${q.q}`);
    }
  }
});

test('a trilha de francês (lessons_fr_data.js e data/lessons/201..212.json) não tem pronúncia escrita', () => {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'lessons_fr_data.js'), 'utf8') + '\nwindow.__L = LESSONS_FR;', sandbox);
  const lic = sandbox.window.__L;
  assert.equal(lic.length, 12);
  for (const l of lic) {
    for (const t of textos(l)) assert.equal((t.match(PRONUNCIA) || []).filter(x => !/Auxiliar|Particípio/.test(x)).length, 0, `${l.id}: ${t.slice(0, 80)}`);
    for (const q of l.quiz) assert.ok(q.opts.includes(q.a) && q.opts.every(o => o && o.trim()), `${l.id}: quiz incoerente: ${q.q}`);
    const j = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'lessons', l.id + '.json'), 'utf8'));
    assert.deepEqual(j, JSON.parse(JSON.stringify(l)), `data/lessons/${l.id}.json fora de sincronia com lessons_fr_data.js (rode node scripts/build-lesson-data.js)`);
  }
  const horas = lic.find(l => l.id === 208).grammar.table;
  assert.ok(!horas.headers.some(h => /Pron/.test(h)), 'a coluna Pronúncia da tabela de horas saiu');
  assert.ok(horas.rows.every(r => r.length === horas.headers.length));
});

test('os geradores trazem a limpeza: rodar de novo não faz a pronúncia voltar', async () => {
  const { semPronuncia, confere } = await import(path.join(ROOT, 'scripts', 'fr-sem-pronuncia.mjs'));
  const { FR_LESSONS_1_6 } = await import(path.join(ROOT, 'scripts', 'fr-lessons-part1.mjs'));
  const { FR_LESSONS_7_12 } = await import(path.join(ROOT, 'scripts', 'fr-lessons-part2.mjs'));
  const limpas = semPronuncia([...FR_LESSONS_1_6, ...FR_LESSONS_7_12]);
  assert.deepEqual(confere(limpas), []);
});

test('tts-fr.js: voz da OpenAI em francês, lendo só o francês (sem o que está entre parênteses)', async () => {
  const pedidos = [];
  const tocados = [];
  const ctx = {
    window: {},
    fetch: async url => { pedidos.push(url); return { ok: true, blob: async () => ({ size: 2000 }) }; },
    URL: { createObjectURL: () => 'blob:x', revokeObjectURL() {} },
    SpeechSynthesisUtterance: function () {},
    setTimeout, console,
  };
  ctx.window.CapyAudio = {
    stop() {},
    play(src, o) { tocados.push(src); setTimeout(() => o.onended && o.onended(), 5); return Promise.resolve(); },
  };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'tts-fr.js'), 'utf8'), ctx);
  const w = ctx.window;
  assert.equal(typeof w.speak, 'function');
  assert.equal(typeof w.speakFrEnd, 'function');

  const alvo = async t => { pedidos.length = 0; const ok = await w.speakFrEnd(t); return { ok, url: pedidos[0] }; };
  let r = await alvo('Enchanté(e)');
  assert.equal(r.ok, true);
  assert.match(r.url, /lang=fr/);
  assert.match(r.url, /voice=nova/);
  assert.equal(decodeURIComponent(new URL('http://x' + r.url).searchParams.get('text')), 'Enchanté');
  r = await alvo("J'ai vingt ans. (Eu tenho 20 anos)");
  assert.equal(decodeURIComponent(new URL('http://x' + r.url).searchParams.get('text')), "J'ai vingt ans.");
  r = await alvo('<b>Bonjour</b> [bon-JUR] !');
  assert.equal(decodeURIComponent(new URL('http://x' + r.url).searchParams.get('text')), 'Bonjour !');
  assert.equal(await w.speakFrEnd('(só tradução)'), false, 'texto vazio depois de tirar os parênteses não fala');
});

test('as 12 aulas carregam o tts-fr.js novo e o diálogo completo usa a voz da OpenAI', () => {
  for (const f of aulas) {
    const html = fs.readFileSync(path.join(ROOT, f), 'utf8');
    assert.match(html, /tts-fr\.js\?v=fr1/, f);
    assert.ok(html.indexOf('components.js') < html.indexOf('tts-fr.js'), `${f}: components.js tem que vir antes do tts-fr.js`);
    assert.match(html, /speakFrEnd\(DIALOGUE_LINES\[idx\]\.text\)/, f);
    assert.ok(!/new SpeechSynthesisUtterance\(DIALOGUE_LINES/.test(html), `${f}: diálogo ainda usa a voz do navegador`);
  }
});

test('toda página que carrega o tts-fr.js usa a etiqueta nova (o /tts-fr.js?v= fica em cache imutável)', () => {
  const paginas = fs.readdirSync(ROOT).filter(f => f.endsWith('.html') && fs.readFileSync(path.join(ROOT, f), 'utf8').includes('tts-fr.js'));
  assert.ok(paginas.includes('classes_fr.html') && paginas.length >= 13, 'as 12 aulas e o hub carregam o tts-fr.js');
  for (const f of paginas) assert.match(fs.readFileSync(path.join(ROOT, f), 'utf8'), /tts-fr\.js\?v=fr1"/, f);
});
