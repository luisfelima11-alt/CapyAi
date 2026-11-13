// Prova final do Intermediate: partes no estilo TOEIC (pedido do Luis, 12/nov/2026).
// "listening somente com áudio sem nada escrito e perguntas de interpretação de imagem,
// texto e respostas tipo o TOEIC". Fonte: scripts/prova-intermediate-toeic.json,
// montado por scripts/build-prova-toeic.mjs.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const ler = f => fs.readFileSync(path.join(RAIZ, f), 'utf8');
const html = ler('intermediate_prova.html');

function questoesToeic() {
    const a = html.indexOf('const TOEIC_QUESTIONS = ');
    const b = html.indexOf('];\n', a) >= 0 ? html.indexOf('];\n', a) : html.indexOf('];\r\n', a);
    assert.ok(a > 0 && b > a, 'bloco TOEIC_QUESTIONS na prova');
    return JSON.parse(html.slice(a + 'const TOEIC_QUESTIONS = '.length, b + 1));
}

test('a prova tem as 4 partes TOEIC, entre os marcadores e antes do speaking', () => {
    assert.equal((html.match(/\/\* TOEIC:inicio/g) || []).length, 1);
    assert.equal((html.match(/\/\* TOEIC:fim \*\//g) || []).length, 1);
    assert.ok(html.indexOf('/* TOEIC:fim */') < html.indexOf('const EXAM_DURATION_SEC'));
    assert.match(html, /findIndex\(q => q\.section === 'speaking'\)/);
    const qs = questoesToeic();
    const por = qs.reduce((m, q) => ({ ...m, [q.section]: (m[q.section] || 0) + 1 }), {});
    assert.deepEqual(por, { foto: 5, resposta: 6, conversa: 6, leitura: 6 });
});

test('cada questão tem a resposta entre as opções e uma explicação', () => {
    for (const q of questoesToeic()) {
        assert.ok(q.opts.includes(q.ans), q.section + ': ' + q.ans);
        assert.equal(new Set(q.opts).size, q.opts.length, 'opções repetidas');
        assert.ok(q.rule && q.rule.length > 10, 'explicação');
        assert.equal(q.opts.length, q.section === 'resposta' ? 3 : 4);
    }
});

test('fotos e pergunta e resposta: só áudio, nada escrito antes de responder', () => {
    for (const q of questoesToeic().filter(q => q.section === 'foto' || q.section === 'resposta')) {
        assert.equal(q.audioOpts, true);
        assert.equal(q.sentence, '', 'sem frase escrita');
        for (const o of q.opts) assert.ok(q.mp3[o], 'mp3 de cada opção: ' + o);
        if (q.section === 'resposta') assert.ok(q.mp3Pergunta);
        if (q.section === 'foto') assert.ok(q.img && q.imgAlt);
    }
    // O motor esconde o texto da opção até a resposta e só mostra a pergunta depois.
    assert.match(html, /respondida \? escapeHtml\(opt\) : `Frase \$\{letters\[oi\]\}`/);
    assert.match(html, /\$\{respondida \? `<p class="mt-3 pt-3 border-t border-violet-200/);
    assert.match(html, /\$\{q\.sentence \? `<div class="bg-slate-50/, 'sem caixa de frase vazia');
});

test('conversas sem transcrição até responder; leitura com o texto e a imagem', () => {
    const qs = questoesToeic();
    for (const q of qs.filter(q => q.section === 'conversa')) {
        assert.ok(q.dialogo.length >= 3 && q.dialogo.every(f => f.mp3 && f.text));
        assert.ok(q.sentence.endsWith('?'));
    }
    assert.match(html, /A transcrição aparece depois que você responder/);
    const leituras = qs.filter(q => q.section === 'leitura');
    assert.ok(leituras.some(q => q.passagem.img), 'ao menos uma leitura com imagem');
    for (const q of leituras) assert.ok(q.passagem.texto.length > 150 && q.passagem.titulo);
});

test('todo áudio e toda imagem usados existem no disco', () => {
    const arquivos = new Set();
    for (const q of questoesToeic()) {
        for (const src of Object.values(q.mp3 || {})) arquivos.add(src);
        if (q.mp3Pergunta) arquivos.add(q.mp3Pergunta);
        for (const f of q.dialogo || []) arquivos.add(f.mp3);
        if (q.img) arquivos.add(q.img);
        if (q.passagem && q.passagem.img) arquivos.add(q.passagem.img);
    }
    assert.ok(arquivos.size >= 60);
    for (const a of arquivos) {
        const p = path.join(RAIZ, a.replace(/^\//, ''));
        assert.ok(fs.existsSync(p) && fs.statSync(p).size > 1000, a);
    }
});

test('a capa da prova bate com o total: 63 questões, 50 min, 45 para passar', () => {
    assert.match(html, /const EXAM_DURATION_SEC = 50 \* 60;/);
    assert.ok(html.includes('📋 63 questões') && html.includes('70% (45/63)') && html.includes('⏱️ 50 min'));
    assert.ok(!/📋 40 questões|28\/40|30 minutos/i.test(html), 'nada da capa antiga');
    for (const k of ['foto', 'resposta', 'conversa', 'leitura']) {
        assert.ok(html.includes(`{ key: '${k}'`), 'nota por parte: ' + k);
        assert.match(html, new RegExp(`\\b${k}: 'bg-`), 'cor da etiqueta: ' + k);
    }
    for (const m of html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)) new Function(m[1]);
});
