// Página de Preparação (francês e Agro English 11–15): dados gerados e a lógica sem tela.
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
  assert.deepEqual(cursos.map(c => [c.id, c.idioma, c.aulas.length]), [['francais', 'fr', 12], ['agro', 'en', 5]]);
  assert.deepEqual(cursos[1].aulas.map(a => a.num), [11, 12, 13, 14, 15]);
});

test('Agro: só as falas principais, cada uma com a voz do personagem, e o passo da aula para marcar', async () => {
  const { gerar, conferirAula } = await import('../scripts/build-preparacao.mjs');
  const { arquivos } = gerar();
  for (let n = 11; n <= 15; n++) {
    const a = JSON.parse(arquivos[`agro_aula_${n}.json`]);
    const d = JSON.parse(fs.readFileSync(path.join(RAIZ, 'scripts', `agro${n}-dialogo.json`), 'utf8'));
    assert.deepEqual(a.dialogo.linhas.map(l => l.txt), d.linhas.filter(l => !l.extra).map(l => l.en), `aula ${n}: falas principais`);
    assert.ok(a.dialogo.linhas.every(l => ['onyx', 'echo'].includes(l.voz)), `aula ${n}: vozes`);
    // O mp3 só entra se o arquivo existir (hoje as aulas 11 a 15 não têm áudio gravado).
    for (const l of a.dialogo.linhas) if (l.mp3) assert.ok(fs.existsSync(path.join(RAIZ, l.mp3)), l.mp3);
    assert.deepEqual(a.aulaFeito, { chave: `capyAgro${n}Done`, secao: 'prepare' });
    assert.equal(a.idioma, 'en');
    assert.deepEqual(conferirAula(a), []);
    // As frases para repetir são falas do aluno (Luan).
    const doAluno = d.linhas.filter(l => l.who === 'yara').map(l => l.en);
    assert.ok(a.repetir.every(r => doAluno.includes(r.txt)), `aula ${n}: repetir`);
  }
  const ruim = JSON.parse(arquivos['agro_aula_15.json']);
  ruim.perceber[0].explica = 'Uma regra de grammar';
  ruim.perceber[1].trecho = 'não existe';
  assert.match(conferirAula(ruim).join('\n'), /gramática[\s\S]*não está na linha/);
});

test('o passo Prepare das aulas 11 a 15 do Agro abre a página; as 1 a 10 e o GPS seguem com o Prepare da aula', () => {
  const temModoPagina = f => /window\.PREP=\{[^<]*"paginaNova":true/.test(fs.readFileSync(path.join(RAIZ, f), 'utf8'));
  for (let n = 1; n <= 15; n++) assert.equal(temModoPagina(`agro_aula_${String(n).padStart(2, '0')}.html`), n >= 11, `agro ${n}`);
  assert.equal(temModoPagina('gpstronic_aula_25.html'), false);
  const curso = fs.readFileSync(path.join(RAIZ, 'classes_agro.html'), 'utf8');
  assert.match(curso, /id="prep-atalho" data-curso="agro"/);
  assert.match(fs.readFileSync(path.join(RAIZ, 'classes_fr.html'), 'utf8'), /id="prep-atalho" data-curso="francais"/);
});

test('nota da fala em inglês: contração, número e "okay" contam como a mesma coisa', () => {
  assert.ok(P.falouBem("Hi, Jack! I'm checking the soybean field.", 'Hi Jack, I am checking the soybean field', 'en'));
  assert.ok(P.falouBem("OK, Jack. We're waiting for you!", 'okay jack we are waiting for you', 'en'));
  assert.ok(P.falouBem('We loaded six trucks yesterday.', 'we loaded 6 trucks yesterday', 'en'));
  assert.ok(P.falouBem("Sure, I'll send it by email today.", 'sure i will send it by e-mail today', 'en'));
  assert.ok(!P.falouBem("Tiago is driving it. He's preparing the soil.", 'Tiago is driving', 'en'));
  assert.equal(P.notaFala('Call the vet', '', 'en'), 0);
  // O francês não muda de régua.
  assert.ok(P.falouBem("J'ai dix-neuf ans.", 'jai 19 ans', 'fr'));
});

test('curso preferido: o último aberto; senão o da preparação mais recente; senão o que o aluno estuda', () => {
  const cursos = [
    { id: 'francais', concluidas: 'capyFrCompleted', aulas: [{ num: 1, aula: 'fr_aula_01' }] },
    { id: 'agro', concluidas: 'capyAgroCompleted', aulas: [{ num: 11, aula: 'agro_aula_11' }, { num: 12, aula: 'agro_aula_12' }] },
  ];
  for (const k of ['capyPrepCurso', 'capyPrepFeitas', 'capyFrCompleted', 'capyAgroCompleted']) guardado.delete(k);
  assert.equal(P.cursoPreferido(cursos).id, 'francais');           // nada: o primeiro
  assert.equal(P.sabeAProxima(cursos[0]), true);
  assert.equal(P.sabeAProxima(cursos[1]), false);                  // ainda não chegou na aula 11
  guardado.set('capyAgroCompleted', '[9,10]');
  assert.equal(P.cursoPreferido(cursos).id, 'agro');
  assert.equal(P.estuda(cursos[1]), true);
  assert.equal(P.estuda(cursos[0]), false);
  assert.equal(P.sabeAProxima(cursos[1]), true);                   // terminou a 10
  guardado.set('capyPrepFeitas', JSON.stringify({ fr_aula_01: { em: '2026-11-14T10:00:00.000Z', pct: 80 } }));
  assert.equal(P.cursoPreferido(cursos).id, 'francais');
  P.lembrarCurso('agro');
  assert.equal(P.cursoPreferido(cursos).id, 'agro');
});

test('terminar a Preparação marca o passo na aula uma vez, e só em chave de aula', () => {
  guardado.delete('capyAgro15Done');
  assert.equal(P.marcarPassoDaAula({ chave: 'capyAgro15Done', secao: 'prepare' }), true);
  assert.equal(P.marcarPassoDaAula({ chave: 'capyAgro15Done', secao: 'prepare' }), false);
  assert.deepEqual(JSON.parse(guardado.get('capyAgro15Done')), ['prepare']);
  guardado.set('capyAgro14Done', '["dialogue"]');
  P.marcarPassoDaAula({ chave: 'capyAgro14Done', secao: 'prepare' });
  assert.deepEqual(JSON.parse(guardado.get('capyAgro14Done')), ['dialogue', 'prepare']);
  assert.equal(P.marcarPassoDaAula({ chave: 'capyYaraState', secao: 'prepare' }), false);
  assert.equal(P.marcarPassoDaAula(null), false);
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
  const p = { txt: 'Rouge', pt: 'Vermelho(a)', ex: '', emoji: '🔴' };
  P.anotarPalavra('fr', { txt: 'Bleu', pt: 'Azul' }, true, agora);       // sabia de primeira: nada
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
