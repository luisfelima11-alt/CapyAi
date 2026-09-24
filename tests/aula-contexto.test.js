// O catalogo de material das aulas (api/aulas-contexto.json) que a Yara usa
// na ligacao guiada e no chat de dentro da aula.
//
// Tres garantias:
//   1. o JSON commitado e EXATAMENTE o que o gerador produz hoje — aula nova ou
//      editada sem `npm run aulas:contexto` vira teste vermelho, nao uma Yara
//      falando da versao antiga da aula;
//   2. toda aula de curso tem titulo e algum material;
//   3. toda familia de aula tem persona no servidor.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const gerador = require('../scripts/gera-contexto-aulas');

function catalogoDoServidor() {
  const fonte = fs.readFileSync(path.join(ROOT, 'api/index.js'), 'utf8');
  const i = fonte.indexOf('function textoParaPrompt(valor, limite) {');
  const j = fonte.indexOf('function sanitizeStoredJson(', i);
  assert.ok(i > 0 && j > i);
  return new Function(fonte.slice(i, j) + '\nreturn { AULA_FAMILIAS, PERSONAS, aulaDe };')();
}

test('o api/aulas-contexto.json esta em dia com as paginas das aulas', () => {
  const esperado = gerador.serializar(gerador.gerar());
  const commitado = fs.readFileSync(gerador.SAIDA, 'utf8').replace(/\r\n/g, '\n');
  assert.ok(commitado === esperado,
    'api/aulas-contexto.json esta desatualizado: rode `npm run aulas:contexto` e commite o resultado.');
});

test('toda aula de curso da raiz esta no catalogo, com titulo e material', () => {
  const cat = require('../api/aulas-contexto.json');
  const paginas = fs.readdirSync(ROOT).filter(f => /^([a-z]+_)?aula_\d+\.html$/.test(f));
  assert.ok(paginas.length >= 152, 'sumiram aulas: ' + paginas.length);
  const porFamilia = {};
  for (const f of paginas) {
    const id = f.replace('.html', '');
    const a = cat[id];
    assert.ok(a, id + ' fora do catalogo');
    assert.ok(a.titulo && a.titulo.length >= 3, id + ' sem titulo');
    const baldes = ['palavras', 'falas', 'frases', 'pratica', 'perguntas'].filter(b => a[b].length);
    assert.ok(baldes.length, id + ' sem material nenhum');
    porFamilia[a.familia] = (porFamilia[a.familia] || 0) + 1;
    // Titulo sem HTML nem entidade escapando da limpeza.
    assert.doesNotMatch(a.titulo + JSON.stringify(a.falas), /&amp;|&#|<\/?[a-z]/i, id);
  }
  console.log('aulas por familia:', JSON.stringify(porFamilia));
});

test('os tetos de tamanho valem para todas as aulas', () => {
  const cat = require('../api/aulas-contexto.json');
  const T = gerador.TETO;
  for (const [id, a] of Object.entries(cat)) {
    assert.ok(a.titulo.length <= T.titulo, id);
    for (const b of ['palavras', 'frases', 'pratica', 'perguntas']) {
      assert.ok(a[b].length <= T[b][0], id + ' ' + b + ': ' + a[b].length);
      for (const s of a[b]) assert.ok(s.length <= T[b][1], id + ' ' + b + ': ' + s);
    }
    assert.ok(a.falas.length <= T.falas[0], id);
    for (const f of a.falas) {
      assert.ok(['A', 'B', 'C'].includes(f.q), id);
      assert.ok(f.t.length <= T.falas[1], id);
    }
    assert.ok(JSON.stringify(a).length <= 6000, id + ' passou de 6 KB');
  }
});

test('toda familia de aula aponta para uma persona que existe', () => {
  const { AULA_FAMILIAS, PERSONAS } = catalogoDoServidor();
  const cat = require('../api/aulas-contexto.json');
  const familias = new Set(Object.values(cat).map(a => a.familia));
  for (const f of familias) {
    assert.ok(Object.prototype.hasOwnProperty.call(AULA_FAMILIAS, f), 'familia sem persona: ' + f);
  }
  for (const [f, def] of Object.entries(AULA_FAMILIAS)) {
    assert.ok(Object.prototype.hasOwnProperty.call(PERSONAS, def.persona), f + ' -> ' + def.persona + ' nao existe');
  }
  // E o prefixo de todo arquivo *_aula_NN.html da raiz vira uma familia conhecida.
  const prefixos = new Set(fs.readdirSync(ROOT)
    .map(f => (f.match(/^(?:([a-z]+)_)?aula_\d+\.html$/) || [])).filter(m => m.length)
    .map(m => (m[1] ? m[1] + '_aula' : 'aula')));
  for (const p of prefixos) assert.ok(AULA_FAMILIAS[p], 'prefixo sem familia: ' + p);
});
