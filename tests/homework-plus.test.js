// Homework das aulas geradas do GPS Tronic e do Agro (07/nov/2026).
// O comportamento na página está em tests/homework-plus.spec.js; aqui ficam as
// garantias estáticas de todas as aulas que os geradores montam.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const RAIZ = path.join(__dirname, '..');
const ler = f => fs.readFileSync(path.join(RAIZ, f), 'utf8');

// As aulas que os geradores montam: as que têm conteudo.json em scripts/.
const geradas = fs.readdirSync(path.join(RAIZ, 'scripts')).map(f => {
  let m = f.match(/^aula(\d+)-conteudo\.json$/);
  if (m) return { pagina: `gpstronic_aula_${m[1]}.html`, json: `scripts/${f}` };
  m = f.match(/^agro(\d+)-conteudo\.json$/);
  return m ? { pagina: `agro_aula_${m[1]}.html`, json: `scripts/${f}` } : null;
}).filter(Boolean);

test('nenhuma aula gerada carrega a tarefa de escrita nem a dica de imperativo da aula 09', () => {
  assert.ok(geradas.length >= 33, `achei só ${geradas.length} aulas geradas`);
  for (const { pagina } of geradas) {
    const t = ler(pagina);
    assert.ok(!t.includes('Escreva 5 passos para o cliente reiniciar o monitor'), `${pagina}: escrita da aula 09`);
    assert.ok(!t.includes('forma certa do imperativo'), `${pagina}: dica de imperativo da aula 09`);
    assert.equal((t.match(/id="texto-guiado"/g) || []).length, 1, `${pagina}: a escrita precisa de um id para o professor`);
  }
});

test('as aulas com o homework novo têm as 8 tarefas ligadas e o placar como primeiro campo', () => {
  const piloto = geradas.filter(g => Array.isArray(JSON.parse(ler(g.json)).homework.completar));
  assert.ok(piloto.length >= 10, `achei só ${piloto.length} aulas com o homework novo`);
  for (const { pagina, json } of piloto) {
    const t = ler(pagina), c = JSON.parse(ler(json));
    assert.equal((t.match(/homework-plus\.js\?v=/g) || []).length, 1, `${pagina}: homework-plus.js uma vez`);
    const aba = t.slice(t.indexOf('<div id="tab-homework"'));
    const campos = [...aba.matchAll(/<(?:input|textarea)\b[^>]*\bid="([^"]+)"/g)].map(m => m[1]);
    assert.equal(campos[0], 'placar', `${pagina}: o placar tem que ser o primeiro campo da entrega`);
    const dados = JSON.parse(t.match(/window\.HW_PLUS=(\{.*?\});window\.HW_ESTADO/)[1]);
    assert.equal(dados.completar.length, 4);
    assert.deepEqual(dados.voz, c.homework.voz);
    assert.ok(!/<\/script/i.test(t.match(/window\.HW_PLUS=.*?<\/script>/)[0].slice(0, -9)), `${pagina}: JSON sem </script>`);
    assert.match(t, /São 8 tarefas, uns 20 minutos/);
  }
});

test('homework-plus.js compila e não põe texto do aluno em innerHTML', () => {
  const js = ler('homework-plus.js');
  assert.doesNotThrow(() => new Function(js));
  // Os innerHTML do arquivo montam só conteúdo da aula (passado por esc()) e o card fixo.
  for (const linha of js.split('\n').filter(l => /innerHTML/.test(l))) {
    assert.ok(!/\.value/.test(linha), 'innerHTML com valor de campo: ' + linha.trim());
  }
});
