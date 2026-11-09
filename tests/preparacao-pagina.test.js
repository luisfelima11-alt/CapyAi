// Página de Preparação (piloto: francês): dados gerados e a lógica sem tela.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');

// localStorage de mentira antes de carregar o core.
const guardado = new Map();
globalThis.localStorage = {
  getItem: k => (guardado.has(k) ? guardado.get(k) : null),
  setItem: (k, v) => guardado.set(k, String(v)),
  removeItem: k => guardado.delete(k),
};
const P = require('../preparacao-core.js');

test('data/preparacao está em dia com as aulas e com fr-preparacao.mjs, e passa na conferência', async () => {
  const { gerar } = await import('../scripts/build-preparacao.mjs');
  const { arquivos, erros } = gerar();
  assert.deepEqual(erros, []);
  for (const [nome, conteudo] of Object.entries(arquivos)) {
    assert.equal(fs.readFileSync(path.join(RAIZ, 'data', 'preparacao', nome), 'utf8'), conteudo, `${nome} desatualizado: rode node scripts/build-preparacao.mjs`);
  }
  const cursos = JSON.parse(arquivos['cursos.json']).cursos;
  assert.equal(cursos[0].aulas.length, 12);
});

test('a conferência pega pronúncia escrita, "gramática", trecho fora do diálogo e resposta fora das opções', async () => {
  const { conferirAula } = await import('../scripts/build-preparacao.mjs');
  const boa = JSON.parse(fs.readFileSync(path.join(RAIZ, 'data', 'preparacao', 'fr_aula_01.json'), 'utf8'));
  assert.deepEqual(conferirAula(boa), []);
  const ruim = structuredClone(boa);
  ruim.palavras[0].pt = 'Olá [bon-JUR]';
  ruim.perceber[0].explica = 'Regra de gramática';
  ruim.perceber[1].trecho = 'não existe';
  ruim.compreensao[0].a = 'outra';
  const erros = conferirAula(ruim).join('\n');
  assert.match(erros, /pronúncia escrita/);
  assert.match(erros, /gramática/);
  assert.match(erros, /não está na linha/);
  assert.match(erros, /alternativas erradas/);
});

test('cada aula de francês tem o botão "Preparar esta aula" (e o gerador também)', () => {
  for (let n = 1; n <= 12; n++) {
    const aula = `fr_aula_${String(n).padStart(2, '0')}`;
    assert.ok(fs.readFileSync(path.join(RAIZ, `${aula}.html`), 'utf8').includes(`href="preparacao.html?aula=${aula}"`), aula);
  }
  const gerador = fs.readFileSync(path.join(RAIZ, 'scripts', 'build-fr-aulas.mjs'), 'utf8');
  assert.match(gerador, /preparacao\.html\?aula=\$\{l\.slug\}/);
  assert.match(gerador, /analytics\.js\?v=ga1/, 'o gerador mantém o analytics que antes só entrava depois');
});

test('a nota da fala aceita como o Whisper escreve: sem apóstrofo, número em algarismo, sem acento', () => {
  assert.ok(P.falouBem("J'ai dix-neuf ans.", 'jai 19 ans'));
  assert.ok(P.falouBem('Je fais du 38, ou taille M.', 'je fais du trente-huit ou taille M'));
  assert.ok(P.falouBem("Bonne idée ! Je prends l'écharpe violette.", 'Bonne idee, je prends l’écharpe violette'));
  assert.ok(P.falouBem('Il fait douze degrés aujourd\'hui.', 'il fait 12 degres aujourd hui'));
  assert.ok(!P.falouBem('Bonjour ! Excusez-moi, cette place est libre ?', 'bonjour'));
  assert.equal(P.notaFala('Merci beaucoup', ''), 0);
  assert.deepEqual(P.palavras('Soixante et onze, 71, 80'), ['soixante', 'et', 'onze', 'soixante', 'et', 'onze', 'quatre', 'vingt']);
});

test('próxima aula: a primeira não terminada; preparada oferece a seguinte; curso feito = nada', () => {
  const curso = { concluidas: 'capyFrCompleted', aulas: [1, 2, 3].map(n => ({ num: n, aula: `fr_aula_0${n}` })) };
  assert.equal(P.proxima(curso, [], {}).aula.num, 1);
  assert.equal(P.proxima(curso, [1], {}).aula.num, 2);
  const preparada = P.proxima(curso, [1], { fr_aula_02: { pct: 90 } });
  assert.equal(preparada.preparada.pct, 90);
  assert.equal(preparada.seguinte.num, 3);
  assert.equal(P.proxima(curso, [1, 2, 3], {}), null);
  guardado.set('capyFrCompleted', '[1,"2"]');
  assert.deepEqual(P.concluidas(curso), [1, 2]);
  guardado.set('capyFrCompleted', 'quebrado');
  assert.deepEqual(P.concluidas(curso), []);
});

test('marcarFeita diz se é a primeira vez (o XP sai uma vez só)', () => {
  guardado.delete('capyPrepFeitas');
  assert.equal(P.marcarFeita('fr_aula_05', 77.6), true);
  assert.equal(P.marcarFeita('fr_aula_05', 90), false);
  assert.equal(P.feitas().fr_aula_05.pct, 90);
});

test('palavras para revisar: errou volta amanhã; acertou sobe para 3, 7, 14 dias e depois sai', () => {
  guardado.delete('capyPrepPalavras_fr');
  const agora = 1_000_000_000_000, DIA = 86400000;
  const p = { fr: 'Rouge', pt: 'Vermelho(a)', ex: '', emoji: '🔴' };
  P.anotarPalavra('fr', { fr: 'Bleu', pt: 'Azul' }, true, agora);       // sabia de primeira: nada
  P.anotarPalavra('fr', p, false, agora);
  assert.deepEqual(P.palavrasParaRevisar('fr', agora), []);
  assert.equal(P.palavrasParaRevisar('fr', agora + DIA).length, 1);
  P.anotarPalavra('fr', p, true, agora + DIA);
  assert.equal(P.palavrasParaRevisar('fr', agora + 3 * DIA).length, 0);
  assert.equal(P.palavrasParaRevisar('fr', agora + 4 * DIA).length, 1);
  P.anotarPalavra('fr', p, true, agora + 4 * DIA);
  P.anotarPalavra('fr', p, true, agora + 11 * DIA);
  P.anotarPalavra('fr', p, true, agora + 25 * DIA);
  assert.deepEqual(JSON.parse(guardado.get('capyPrepPalavras_fr')), {}, 'depois de 14 dias, sai da revisão');
});

test('placar: o texto que vai ao teacher', () => {
  const pl = P.placar({ ouvir: [true, false, true], palavras: { sabia: 6, total: 8 }, perceber: [true, true], falar: [true, true, false] });
  assert.equal(pl.texto, 'Ouvir 2/3 · Palavras 6/8 · Reparar 2/2 · Falar 2/3 · Total 75%');
  assert.equal(pl.pct, 75);
});

test('embaralhar é estável e a resposta certa não fica sempre em primeiro', () => {
  assert.deepEqual(P.embaralhar(['a', 'b', 'c'], 'fr_aula_03c1'), P.embaralhar(['a', 'b', 'c'], 'fr_aula_03c1'));
  const posicoes = new Set();
  for (let n = 1; n <= 12; n++) for (let i = 0; i < 3; i++) posicoes.add(P.embaralhar(['certa', 'x', 'y'], `fr_aula_${n}c${i}`).indexOf('certa'));
  assert.deepEqual([...posicoes].sort(), [0, 1, 2]);
});

test('a página não mostra "gramática" e a voz do aluno usa o balde da preparação', () => {
  for (const f of ['preparacao.html', 'preparacao-pagina.js', 'preparacao-atalho.js']) {
    assert.doesNotMatch(fs.readFileSync(path.join(RAIZ, f), 'utf8').replace(/^\s*\/\/.*$/gm, ''), /gram[aá]tic|grammar/i, f);
  }
  const pagina = fs.readFileSync(path.join(RAIZ, 'preparacao-pagina.js'), 'utf8');
  assert.match(pagina, /uso: 'preparacao'/);
  const api = fs.readFileSync(path.join(RAIZ, 'api', 'index.js'), 'utf8');
  assert.match(api, /'transcribe-prep': \{ free: 40/);
  assert.match(api, /uso === 'preparacao' \? 'transcribe-prep' : 'transcribe'/);
});
