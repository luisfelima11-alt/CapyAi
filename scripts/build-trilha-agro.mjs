#!/usr/bin/env node
/**
 * build-trilha-agro.mjs — monta lessons_agro_data.js e valida o schema.
 *
 *   node scripts/build-trilha-agro.mjs
 *
 * Fontes: scripts/agro-trilha-a.json (701-706) e -b.json (707-712).
 * Irmão do build-trilha-interview.mjs.
 *
 * Por que validar aqui e não depois: o `scripts/build-lesson-data.js` DESCARTA
 * em silêncio (só um console.warn) uma lição com id duplicado, e a página quebra
 * no spread se faltar `vocab`, `sentences` ou `speak`. Erro de schema neste
 * arquivo não aparece como erro — aparece como lição que simplesmente sumiu.
 *
 * ── A regra do mix 50-50 (Luis, 15/set/2026) ──────────────────────────────
 * O Luan é do agro, mas está aprendendo INGLÊS, não jargão. Cada palavra do
 * vocabulário carrega um campo `tema`: "geral" ou "agro". O construtor exige
 * que o curso inteiro fique perto de 50-50 e que nenhuma lição passe de 70%
 * de um lado só — senão a trilha vira glossário técnico sem o inglês que ele
 * usa fora do trabalho (ou o contrário: inglês genérico que não gruda nele).
 *
 * O campo `tema` é só para esta validação: ele é REMOVIDO do .js gerado,
 * porque o app espera vocab {en, pt}.
 */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const RAIZ = path.resolve(new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const FAIXA = [701, 712];
const N_LICOES = 12;

const licoes = [
    ...JSON.parse(fs.readFileSync(path.join(RAIZ, 'scripts/agro-trilha-a.json'), 'utf8')),
    ...JSON.parse(fs.readFileSync(path.join(RAIZ, 'scripts/agro-trilha-b.json'), 'utf8')),
];

// ── ids já usados por qualquer outro curso ─────────────────────────────────
// Não confio em tabela escrita: leio o índice compilado, que é o que o app serve.
function idsOcupados() {
    const p = path.join(RAIZ, 'data/lessons-index.json');
    if (!fs.existsSync(p)) return new Set();
    const i = JSON.parse(fs.readFileSync(p, 'utf8'));
    return new Set((i.lessons || i).map(l => l.id));
}

const problemas = [];
const erro = (id, msg) => problemas.push(`  ✗ ${id}: ${msg}`);

const ocupados = idsOcupados();
const idsVistos = new Set();
const vocabGlobal = new Map();
let nGeral = 0, nAgro = 0;

const ESPERADO = { verbs: 4, vocab: 30, expressions: 4, sentences: 8, quiz: 5, speak: 5 };

for (const l of licoes) {
    const id = l.id;
    if (typeof id !== 'number') { erro('?', 'id não é número'); continue; }
    if (id < FAIXA[0] || id > FAIXA[1]) erro(id, `fora da faixa ${FAIXA[0]}-${FAIXA[1]} reservada para este curso`);
    if (idsVistos.has(id)) erro(id, 'id duplicado — o build descartaria esta lição EM SILÊNCIO');
    if (ocupados.has(id)) erro(id, `id JÁ EXISTE em outro curso (data/lessons-index.json) — foi assim que o GPS serviu turco por 8 dias`);
    idsVistos.add(id);

    if (!l.title) erro(id, 'sem title');
    if (!l.emoji) erro(id, 'sem emoji');

    for (const [campo, n] of Object.entries(ESPERADO)) {
        const v = l[campo];
        if (!Array.isArray(v)) { erro(id, `${campo} não é array`); continue; }
        if (v.length !== n) erro(id, `${campo}: ${v.length} itens, esperado ${n}`);
    }

    // vocab + mix 50-50
    const vistosNaLicao = new Set();
    let g = 0, a = 0;
    for (const v of l.vocab || []) {
        if (!v.en || !v.pt) { erro(id, `vocab sem en/pt: ${JSON.stringify(v)}`); continue; }
        if (v.tema !== 'geral' && v.tema !== 'agro') { erro(id, `"${v.en}" sem tema "geral"/"agro"`); continue; }
        v.tema === 'agro' ? a++ : g++;
        const k = v.en.toLowerCase().trim();
        if (vistosNaLicao.has(k)) erro(id, `vocab repetido dentro da lição: "${v.en}"`);
        vistosNaLicao.add(k);
        if (!vocabGlobal.has(k)) vocabGlobal.set(k, []);
        vocabGlobal.get(k).push(id);
    }
    nGeral += g; nAgro += a;
    const tot = g + a;
    if (tot && (g / tot > 0.7 || a / tot > 0.7))
        erro(id, `mix desequilibrado: ${g} geral / ${a} agro (nenhum lado pode passar de 70%)`);

    for (const e of l.expressions || [])
        if (!e.expr || !e.meaning || !e.example) erro(id, `expression incompleta: ${JSON.stringify(e).slice(0, 60)}`);

    const gr = l.grammar;
    if (!gr || !gr.title || !Array.isArray(gr.rules) || !gr.table) erro(id, 'grammar incompleta');
    else {
        if (gr.rules.length < 3) erro(id, `grammar.rules: ${gr.rules.length}, esperado 3+`);
        if (!Array.isArray(gr.table.headers) || !Array.isArray(gr.table.rows)) erro(id, 'grammar.table malformada');
        else for (const r of gr.table.rows)
            if (r.length !== gr.table.headers.length)
                erro(id, `linha da tabela com ${r.length} células, cabeçalho tem ${gr.table.headers.length}`);
    }

    for (const q of l.quiz || []) {
        if (!q.q || !q.a || !Array.isArray(q.opts)) { erro(id, `quiz malformado: ${JSON.stringify(q).slice(0, 60)}`); continue; }
        if (q.opts.length !== 4) erro(id, `quiz com ${q.opts.length} opções, esperado 4: "${q.q}"`);
        if (!q.opts.includes(q.a)) erro(id, `resposta "${q.a}" não está entre as opções: "${q.q}"`);
        if (new Set(q.opts).size !== q.opts.length) erro(id, `opção repetida em: "${q.q}"`);
        // O erro tem que ensinar, não só reprovar (regra do Luis, 13/set).
        if (!q.why) erro(id, `quiz sem "why" (a linha que explica no erro): "${q.q}"`);
    }

    if (/Ã[©¡ªµ§]|â€/.test(JSON.stringify(l))) erro(id, 'mojibake');
}

if (idsVistos.size !== N_LICOES) erro('geral', `${idsVistos.size} lições, esperado ${N_LICOES}`);

const totalVocab = nGeral + nAgro;
const pctAgro = totalVocab ? nAgro / totalVocab : 0;
if (totalVocab && (pctAgro < 0.40 || pctAgro > 0.60))
    erro('geral', `mix do curso: ${nGeral} geral / ${nAgro} agro (${(pctAgro * 100).toFixed(0)}% agro) — o alvo é 50%, tolerância 40-60%`);

if (problemas.length) {
    console.log('PROBLEMAS:\n' + problemas.join('\n'));
    console.log(`\n${problemas.length} problema(s) — arquivo NÃO gerado.`);
    process.exit(1);
}

// `tema` é andaime de validação: o app espera vocab {en, pt}.
const paraOApp = licoes.map(l => ({ ...l, vocab: l.vocab.map(({ en, pt }) => ({ en, pt })) }));

const cabecalho = `// ════════════════════════════════════════════════════════════════════════════
// lessons_agro_data.js — Trilha Diária do curso Agro English
// ════════════════════════════════════════════════════════════════════════════
// GERADO por scripts/build-trilha-agro.mjs a partir de
// scripts/agro-trilha-a.json e -b.json. Não edite este arquivo à mão:
// edite os JSON e rode o construtor de novo.
//
// Faixa de ids: 701-712 (en 1-110 · fr 201-212 · tr 301-336 · int 401-440 ·
// gps 501-508 · interview 601-612 já estão ocupadas).
//
// Mix 50-50 entre vocabulário geral e vocabulário do agro é regra do curso e
// está validada no construtor — o campo "tema" vive nos JSON de origem e é
// removido aqui, porque o app espera vocab {en, pt}.
//
// ⚠️  Este arquivo é FONTE DE COMPILAÇÃO, não é lido pelo navegador. Depois de
//     mudar qualquer coisa aqui é obrigatório rodar:
//         node scripts/build-lesson-data.js
//     senão a lição não existe para o app — sem erro nenhum.
// ════════════════════════════════════════════════════════════════════════════

const LESSONS_AGRO = `;

const destino = path.join(RAIZ, 'lessons_agro_data.js');
fs.writeFileSync(destino, cabecalho + JSON.stringify(paraOApp, null, 2) + `;\n\nwindow.LESSONS_AGRO = LESSONS_AGRO;\n`, 'utf8');

const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(destino, 'utf8'), sandbox);
const carregadas = sandbox.window.LESSONS_AGRO;

console.log(`lessons_agro_data.js — ${(fs.statSync(destino).size / 1024).toFixed(0)}KB`);
console.log(`  ✓ ${carregadas.length} lições, ids ${carregadas[0].id}-${carregadas[carregadas.length - 1].id}`);
console.log(`  ✓ nenhum id colide com os ${ocupados.size} já compilados`);
console.log(`  ✓ window.LESSONS_AGRO exposta (é assim que o build enxerga)`);
console.log(`  ✓ schema completo: 4 verbs · 30 vocab · 4 expressions · 8 sentences · grammar · 5 quiz (com why) · 5 speak`);
console.log(`  ✓ mix: ${nGeral} geral / ${nAgro} agro (${(pctAgro * 100).toFixed(0)}% agro)`);

const repetidas = [...vocabGlobal.entries()].filter(([, ids]) => ids.length > 1);
console.log(`  · vocabulário distinto: ${vocabGlobal.size} de ${N_LICOES * 30} (${repetidas.length} palavras em mais de uma lição)`);
if (repetidas.length) console.log('    ' + repetidas.slice(0, 12).map(([p, ids]) => `${p} (${ids.join(',')})`).join(' · '));
