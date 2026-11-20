// Regra do Luis (12/out/2026, CLAUDE.md): "gramática", "gramatical" e "grammar"
// não aparecem em nada que o aluno vê. Até 20/nov/2026 ~100 aulas feitas à mão
// (aula_01–44, Advanced, Business, Travel, Intermediate 01–18) ainda tinham a aba
// "📐 Grammar", o botão "Grammar understood!", títulos "Grammar: …" etc.
// Os ids internos (tab-grammar, 'grammar' na ROTA/TABS, data-tab="grammar"...)
// continuam: o aluno não os vê.
// Fora daqui por enquanto: med_aula_* e interview_aula_* (geradas por script;
// o gerador ainda não passa na própria validação de slides — ver BUGS-APRENDIDOS).
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const AULAS = fs.readdirSync(ROOT).filter(f =>
  /^(aula|advanced_aula|business_aula|travel_aula|intermediate_aula)_\d+\.html$/.test(f));

// Tudo o que é nome interno (não aparece na tela).
const INTERNO = [
  /<!--[\s\S]*?-->/g, /<style[\s\S]*?<\/style>/g, /(?<![:\\'"])\/\/[^\n]*/g, /\/\*[\s\S]*?\*\//g,
  /data-[\w-]+="grammar"/g, /\b(tab|acc)-grammar\b/g, /'grammar'|"grammar"|`grammar`/g,
  /grammar[A-Z_\-][\w-]*/g, /[\w$]+Grammar\w*/g, /\.grammar\b/g, /([{,]\s*)grammar\s*:/g,
  /gramatica-slides(\.js)?/g, /assets\/img\/gramatica\//g, /CapyGramatica\w*/g, /grammar_lab/g,
];
const visivel = s => INTERNO.reduce((t, r) => t.replace(r, ' '), s);

test('as aulas feitas à mão não mostram "gramática"/"grammar" ao aluno', () => {
  assert.ok(AULAS.length > 90, 'achou as aulas');
  const achados = [];
  for (const f of AULAS) {
    const v = visivel(fs.readFileSync(path.join(ROOT, f), 'utf8'));
    for (const m of v.matchAll(/.{0,40}(gramm?[aá]tic\w*|grammar)\b.{0,30}/gi)) achados.push(`${f}: ${m[0].trim()}`);
  }
  assert.deepStrictEqual(achados.slice(0, 15), [], `${achados.length} ocorrências`);
});

// Os dados das lições do lessons.html (lessons_*data.js) viram texto na tela:
// o "GPS Tronic Master Review" (id 524) mostrava a coluna "Foco gramatical".
test('os dados das lições (lessons_*data.js) não mostram a palavra', () => {
  const dados = fs.readdirSync(ROOT).filter(f => /^lessons_\w*data\.js$/.test(f));
  assert.ok(dados.length >= 3, 'achou os arquivos de dados');
  const achados = [];
  for (const f of dados) {
    const v = visivel(fs.readFileSync(path.join(ROOT, f), 'utf8'));
    for (const m of v.matchAll(/.{0,40}(gramm?[aá]tic\w*|grammar)\b.{0,30}/gi)) achados.push(`${f}: ${m[0].trim()}`);
  }
  assert.deepStrictEqual(achados, []);
});

// As bolinhas de progresso usavam o id da seção como dica (title="${s}"): passar o
// mouse na bolinha da seção de padrões mostrava "grammar".
test('a dica das bolinhas de progresso não é o id interno da seção', () => {
  const com = AULAS.filter(f => fs.readFileSync(path.join(ROOT, f), 'utf8').includes('title="${s}"'));
  assert.deepStrictEqual(com, []);
});
