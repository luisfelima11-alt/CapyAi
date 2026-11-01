// Mini-provas (mini_prova.html): toda prova tem 15 questões que dão para acertar,
// e todo card de checkpoint dos cursos aponta para uma prova que existe.
// Sem isso, uma prova nova com a resposta fora das opções vira questão impossível,
// e um card com bloco errado abre a prova do Intermediate (o fallback da página).
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RAIZ = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(RAIZ, 'mini_prova.html'), 'utf8');
const m = html.match(/const MINI_EXAMS = (\{[\s\S]*?\n\});/);
const PROVAS = m ? vm.runInNewContext('(' + m[1].replace(/;$/, '') + ')') : {};

test('mini_prova.html tem o objeto MINI_EXAMS', () => {
    assert.ok(m, 'não achei "const MINI_EXAMS = {...};"');
    assert.ok(Object.keys(PROVAS).length >= 7);
});

test('cada prova: chave curso_bloco, 15 questões, resposta entre as opções, sem opção repetida', () => {
    const SECOES = new Set(['expressoes', 'contexto', 'listening', 'speaking']);
    for (const [chave, p] of Object.entries(PROVAS)) {
        assert.equal(chave, `${p.course}_${p.bloco}`, `${chave}: course/bloco não batem com a chave`);
        assert.equal(p.questions.length, 15, `${chave}: ${p.questions.length} questões`);
        p.questions.forEach((q, i) => {
            const onde = `${chave} questão ${i + 1}`;
            assert.ok(SECOES.has(q.section), `${onde}: seção ${q.section}`);
            assert.ok(q.opts.includes(q.ans), `${onde}: a resposta "${q.ans}" não está nas opções`);
            assert.equal(new Set(q.opts).size, q.opts.length, `${onde}: opção repetida`);
            assert.ok(q.sentence.includes('___'), `${onde}: frase sem lacuna`);
            if (q.section === 'listening') assert.ok(q.audioText, `${onde}: listening sem áudio`);
            if (q.section === 'speaking') assert.ok(q.fullTarget, `${onde}: speaking sem frase completa`);
        });
    }
});

test('nenhuma prova mostra "gramática"/"grammar" (regra de 12/out)', () => {
    for (const [chave, p] of Object.entries(PROVAS)) {
        assert.ok(!/gram[aá]tic|grammar/i.test(JSON.stringify(p)), chave);
    }
});

test('a Mini-Prova 3 do GPS Tronic cobre as aulas 15 a 22', () => {
    const p = PROVAS.gpstronic_3;
    assert.ok(p, 'falta gpstronic_3');
    const citadas = new Set(p.questions.flatMap(q => [...(q.promptPt + ' ' + q.rule).matchAll(/Aula (\d+)/g)].map(x => Number(x[1]))));
    for (let n = 15; n <= 22; n++) assert.ok(citadas.has(n), `nenhuma questão cita a Aula ${n}`);
});

test('todo card de checkpoint dos cursos abre uma prova que existe', () => {
    for (const arq of fs.readdirSync(RAIZ).filter(f => /^classes.*\.html$/.test(f))) {
        const t = fs.readFileSync(path.join(RAIZ, arq), 'utf8');
        for (const [, curso, bloco] of t.matchAll(/mini_prova\.html\?curso=([a-z]+)&bloco=(\d+)/g)) {
            assert.ok(PROVAS[`${curso}_${bloco}`], `${arq}: mini_prova ${curso} bloco ${bloco} não existe`);
        }
    }
    const gps = fs.readFileSync(path.join(RAIZ, 'classes_gpstronic.html'), 'utf8');
    const cp = gps.match(/const CHECKPOINTS = (\{[^\n]*\});/);
    assert.ok(cp, 'classes_gpstronic.html sem CHECKPOINTS');
    for (const [, [bloco]] of Object.entries(vm.runInNewContext('(' + cp[1] + ')'))) {
        assert.ok(PROVAS[`gpstronic_${bloco}`], `checkpoint do GPS aponta para o bloco ${bloco}, que não existe`);
    }
});
