// "🎯 Prepare" (07/nov/2026). O fluxo na página está em tests/preparacao.spec.js;
// aqui, as garantias de todas as aulas que os geradores montam.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const RAIZ = path.join(__dirname, '..');
const ler = f => fs.readFileSync(path.join(RAIZ, f), 'utf8');
const geradas = fs.readdirSync(path.join(RAIZ, 'scripts')).map(f => {
  let m = f.match(/^aula(\d+)-conteudo\.json$/);
  if (m) return `gpstronic_aula_${m[1]}.html`;
  m = f.match(/^agro(\d+)-conteudo\.json$/);
  return m ? `agro_aula_${m[1]}.html` : null;
}).filter(Boolean);

test('toda aula gerada começa no 🎯 Prepare, com o painel e o script uma vez', () => {
  assert.ok(geradas.length >= 33, `achei só ${geradas.length} aulas geradas`);
  for (const pagina of geradas) {
    const t = ler(pagina);
    assert.match(t, /const ROTA=\[\n {2}\{id:'prepare', +rotulo:'🎯 Prepare'\},\n {2}\{id:'dialogue'/, `${pagina}: a rota tem que começar no Prepare`);
    assert.equal((t.match(/<div id="tab-prepare"/g) || []).length, 1, `${pagina}: #tab-prepare`);
    assert.equal((t.match(/preparacao\.js\?v=/g) || []).length, 1, `${pagina}: preparacao.js`);
    // O script precisa do vocabulário e do diálogo da aula, declarados antes dele.
    assert.ok(t.indexOf('const VOCAB_DATA=') < t.indexOf('preparacao.js?v='), `${pagina}: VOCAB_DATA antes do script`);
  }
});

test('preparacao.js compila, só manda para /api/homework com "-prep" e não põe texto do aluno em innerHTML', () => {
  const js = ler('preparacao.js');
  assert.doesNotThrow(() => new Function(js));
  assert.match(js, /lessonId: `\$\{pagina\}-prep`/);
  assert.equal((js.match(/fetch\(/g) || []).length, 1);
  assert.match(js, /fetch\('\/api\/homework'/);
  for (const linha of js.split('\n').filter(l => /innerHTML/.test(l))) {
    assert.ok(!/\.value|aquecimento'\)/.test(linha), 'innerHTML com valor de campo: ' + linha.trim());
  }
});
