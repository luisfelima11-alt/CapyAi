#!/usr/bin/env node
/**
 * build-trilha-interview.mjs — monta lessons_interview_data.js e valida o schema.
 *
 *   node scripts/build-trilha-interview.mjs
 *
 * Fontes: scripts/interview-trilha-a.json (601-606) e -b.json (607-612).
 *
 * Por que validar aqui e não depois: o `scripts/build-lesson-data.js` DESCARTA
 * em silêncio (só um console.warn) uma lição com id duplicado, e a página quebra
 * no spread se faltar `vocab`, `sentences` ou `speak`. Erro de schema neste
 * arquivo não aparece como erro — aparece como lição que simplesmente sumiu.
 *
 * A checagem contra a lição 419 (`Work & Career Words`, do curso Intermediate)
 * existe porque ela já ensina resume/CV, interview, salary, deadline, benefits e
 * contract. Repetir aqui faria o aluno pagar duas vezes pela mesma palavra.
 */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const RAIZ = path.resolve(new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));

const licoes = [
    ...JSON.parse(fs.readFileSync(path.join(RAIZ, 'scripts/interview-trilha-a.json'), 'utf8')),
    ...JSON.parse(fs.readFileSync(path.join(RAIZ, 'scripts/interview-trilha-b.json'), 'utf8')),
];

// ── vocabulário já ensinado pela lição 419 (curso Intermediate) ────────────
function vocab419() {
    const p = path.join(RAIZ, 'lessons_int_data.js');
    if (!fs.existsSync(p)) return [];
    const sandbox = { window: {} };
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(p, 'utf8'), sandbox);
    const l = (sandbox.window.LESSONS_INT || []).find(x => x.id === 419);
    return l ? l.vocab.map(v => v.en.toLowerCase().trim()) : [];
}

// ── validação ──────────────────────────────────────────────────────────────
const problemas = [];
const erro = (id, msg) => problemas.push(`  ✗ ${id}: ${msg}`);

const proibidas = new Set(vocab419());
const idsVistos = new Set();
const vocabGlobal = new Map();

const ESPERADO = { verbs: 4, vocab: 30, expressions: 4, sentences: 8, quiz: 5, speak: 5 };

for (const l of licoes) {
    const id = l.id;
    if (typeof id !== 'number') { erro('?', 'id não é número'); continue; }
    if (id < 601 || id > 612) erro(id, `fora da faixa 601-612 reservada para este curso`);
    if (idsVistos.has(id)) erro(id, 'id duplicado — o build descartaria esta lição EM SILÊNCIO');
    idsVistos.add(id);

    if (!l.title) erro(id, 'sem title');
    if (!l.emoji) erro(id, 'sem emoji');

    for (const [campo, n] of Object.entries(ESPERADO)) {
        const v = l[campo];
        if (!Array.isArray(v)) { erro(id, `${campo} não é array`); continue; }
        if (v.length !== n) erro(id, `${campo}: ${v.length} itens, esperado ${n}`);
    }

    // vocab
    const vistosNaLicao = new Set();
    for (const v of l.vocab || []) {
        if (!v.en || !v.pt) { erro(id, `vocab sem en/pt: ${JSON.stringify(v)}`); continue; }
        const k = v.en.toLowerCase().trim();
        if (vistosNaLicao.has(k)) erro(id, `vocab repetido dentro da lição: "${v.en}"`);
        vistosNaLicao.add(k);
        if (proibidas.has(k)) erro(id, `"${v.en}" já é ensinada pela lição 419 (Work & Career Words)`);
        if (!vocabGlobal.has(k)) vocabGlobal.set(k, []);
        vocabGlobal.get(k).push(id);
    }

    // expressions
    for (const e of l.expressions || [])
        if (!e.expr || !e.meaning || !e.example) erro(id, `expression incompleta: ${JSON.stringify(e).slice(0, 60)}`);

    // grammar
    const g = l.grammar;
    if (!g || !g.title || !Array.isArray(g.rules) || !g.table) erro(id, 'grammar incompleta');
    else {
        if (g.rules.length < 3) erro(id, `grammar.rules: ${g.rules.length}, esperado 3+`);
        if (!Array.isArray(g.table.headers) || !Array.isArray(g.table.rows)) erro(id, 'grammar.table malformada');
        else for (const r of g.table.rows)
            if (r.length !== g.table.headers.length)
                erro(id, `linha da tabela com ${r.length} células, cabeçalho tem ${g.table.headers.length}`);
    }

    // quiz
    for (const q of l.quiz || []) {
        if (!q.q || !q.a || !Array.isArray(q.opts)) { erro(id, `quiz malformado: ${JSON.stringify(q).slice(0, 60)}`); continue; }
        if (q.opts.length !== 4) erro(id, `quiz com ${q.opts.length} opções, esperado 4: "${q.q}"`);
        if (!q.opts.includes(q.a)) erro(id, `resposta "${q.a}" não está entre as opções: "${q.q}"`);
        if (new Set(q.opts).size !== q.opts.length) erro(id, `opção repetida em: "${q.q}"`);
    }

    // mojibake
    const txt = JSON.stringify(l);
    if (/Ã[©¡ªµ§]|â€/.test(txt)) erro(id, 'mojibake');
}

if (idsVistos.size !== 12) erro('geral', `${idsVistos.size} lições, esperado 12`);

// ── saída ──────────────────────────────────────────────────────────────────
if (problemas.length) {
    console.log('PROBLEMAS:\n' + problemas.join('\n'));
    console.log(`\n${problemas.length} problema(s) — arquivo NÃO gerado.`);
    process.exit(1);
}

const cabecalho = `// ════════════════════════════════════════════════════════════════════════════
// lessons_interview_data.js — Trilha Diária do curso de Entrevista de Emprego
// ════════════════════════════════════════════════════════════════════════════
// GERADO por scripts/build-trilha-interview.mjs a partir de
// scripts/interview-trilha-a.json e -b.json. Não edite este arquivo à mão:
// edite os JSON e rode o construtor de novo.
//
// Faixa de ids: 601-612 (en 1-110 · fr 201-212 · tr 301-336 · int 401-440 ·
// gps 501-508 já estão ocupadas).
//
// ⚠️  Este arquivo é FONTE DE COMPILAÇÃO, não é lido pelo navegador. Depois de
//     mudar qualquer coisa aqui é obrigatório rodar:
//         node scripts/build-lesson-data.js
//     senão a lição não existe para o app — sem erro nenhum.
// ════════════════════════════════════════════════════════════════════════════

const LESSONS_INTERVIEW = `;

const corpo = JSON.stringify(licoes, null, 2);
const rodape = `;\n\nwindow.LESSONS_INTERVIEW = LESSONS_INTERVIEW;\n`;

const destino = path.join(RAIZ, 'lessons_interview_data.js');
fs.writeFileSync(destino, cabecalho + corpo + rodape, 'utf8');

// confere que o arquivo gerado realmente carrega e expõe a variável
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(destino, 'utf8'), sandbox);
const carregadas = sandbox.window.LESSONS_INTERVIEW;

console.log(`lessons_interview_data.js — ${(fs.statSync(destino).size / 1024).toFixed(0)}KB`);
console.log(`  ✓ ${carregadas.length} lições, ids ${carregadas[0].id}-${carregadas[carregadas.length - 1].id}`);
console.log(`  ✓ window.LESSONS_INTERVIEW exposta (é assim que o build enxerga)`);
console.log(`  ✓ schema completo: 4 verbs · 30 vocab · 4 expressions · 8 sentences · grammar · 5 quiz · 5 speak`);
console.log(`  ✓ nenhuma palavra repetida da lição 419`);

const repetidas = [...vocabGlobal.entries()].filter(([, ids]) => ids.length > 1);
console.log(`  · vocabulário distinto: ${vocabGlobal.size} de ${12 * 30} (${repetidas.length} palavras aparecem em mais de uma lição)`);
if (repetidas.length) console.log('    ' + repetidas.slice(0, 12).map(([p, ids]) => `${p} (${ids.join(',')})`).join(' · '));
