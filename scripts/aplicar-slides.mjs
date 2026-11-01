#!/usr/bin/env node
/**
 * aplicar-slides.mjs — põe os slides de exemplos na aba Patterns de uma aula feita à mão.
 *
 *   node scripts/aplicar-slides.mjs gps05 [gps06 ...]
 *
 * As aulas com gerador (build-*-aula.mjs) recebem os slides pelo próprio gerador. As antigas,
 * escritas à mão (GPS Tronic 01–09), não têm conteudo.json: o deck fica em
 * scripts/aulaNN-gramatica.json ({ aula, pagina, gramatica }) e este script troca só a
 * <div id="tab-grammar"> da página pelo deck (scripts/lib/gramatica-slides.mjs). O resto da
 * página não muda. Depois rode o gera-folha-aula.mjs na página, para a folha em PDF.
 *
 * Mesmas regras dos geradores: checarSlides (com as imagens), nada de "gramática/grammar"
 * visível (a aba vira 🧩 Patterns) e os scripts inline compilando.
 */

import fs from 'node:fs';
import path from 'node:path';
import { blocoGramaticaSlides, checarSlides } from './lib/gramatica-slides.mjs';

const RAIZ = path.resolve(new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));

const CURSOS = {
    gps: { json: nn => `scripts/aula${nn}-gramatica.json`, pagina: nn => `gpstronic_aula_${nn}.html` },
};

// A <div id="tab-grammar"> inteira, contando as <div> abertas e fechadas.
function trechoDaAba(html) {
    const ini = html.indexOf('<div id="tab-grammar"');
    if (ini < 0) throw new Error('a página não tem <div id="tab-grammar">');
    const tag = /<div\b|<\/div>/g;
    tag.lastIndex = ini;
    let prof = 0, m;
    while ((m = tag.exec(html))) {
        prof += m[0] === '</div>' ? -1 : 1;
        if (prof === 0) return [ini, m.index + m[0].length];
    }
    throw new Error('a <div id="tab-grammar"> não fecha');
}

function aplicar(slug) {
    const m = /^(gps)(\d{2})$/.exec(slug);
    if (!m) throw new Error(`slug inválido: ${slug} (ex.: gps05)`);
    const curso = CURSOS[m[1]], nn = m[2];
    const arqJson = path.join(RAIZ, curso.json(nn));
    if (!fs.existsSync(arqJson)) throw new Error(`não existe: ${curso.json(nn)}`);
    const c = JSON.parse(fs.readFileSync(arqJson, 'utf8'));
    const destino = path.join(RAIZ, c.pagina || curso.pagina(nn));
    let t = fs.readFileSync(destino, 'utf8');

    const p = [];
    const ok = (cond, msg) => p.push({ ok: !!cond, msg });
    checarSlides(c, ok, { teto: c.tetoPalavras || 14, slug, raiz: RAIZ });
    if (p.some(x => !x.ok)) return { destino, p };

    const [ini, fim] = trechoDaAba(t);
    const continuar = /function\s+proximoPasso\s*\(/.test(t);
    t = t.slice(0, ini) + blocoGramaticaSlides(c, { slug, raiz: RAIZ, continuar }).trimEnd() + t.slice(fim);

    // Regra do Luis (12/out/2026): a aba se chama Patterns. O id e a chave 'grammar' ficam.
    t = t.split('data-tab="grammar">📐 Grammar</button>').join('data-tab="grammar">🧩 Patterns</button>');
    t = t.split("rotulo:'📐 Grammar'").join("rotulo:'🧩 Patterns'");

    ok(/function\s+markSectionBtn\s*\(/.test(t), 'a página tem markSectionBtn (o +20 XP do deck)');
    ok(/function\s+speak\s*\(/.test(t), 'a página tem speak() (o 🔊 das frases)');
    ok((t.match(/<div id="tab-grammar"/g) || []).length === 1, 'uma aba tab-grammar só');
    const [i2, f2] = trechoDaAba(t);
    const aba = t.slice(i2, f2).replace(/<!--[\s\S]*?-->/g, '').replace(/tab-grammar|'grammar'|"grammar"|assets\/img\/gramatica\/|gramatica-slides\.js/g, '');
    ok(!/gram[aá]tic|grammar/i.test(aba), 'sem a palavra proibida gramática/grammar na aba');
    ok(!/data-tab="grammar">[^<]*Grammar/.test(t) && !/rotulo:'[^']*Grammar'/.test(t), 'o rótulo da aba é Patterns');
    let scripts = 0, quebrados = 0;
    for (const s of t.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)) {
        scripts++;
        try { new Function(s[1]); } catch (e) { quebrados++; console.log('    script quebrado: ' + e.message.slice(0, 90)); }
    }
    ok(quebrados === 0, `${scripts} scripts inline compilam`);
    if (p.every(x => x.ok)) fs.writeFileSync(destino, t, 'utf8');
    return { destino, p };
}

const alvos = process.argv.slice(2);
if (!alvos.length) { console.log('uso: node scripts/aplicar-slides.mjs gps05 [gps06 ...]'); process.exit(1); }
let falhas = 0;
for (const slug of alvos) {
    try {
        const { destino, p } = aplicar(slug);
        console.log(`\n── ${path.relative(RAIZ, destino)} ──`);
        for (const { ok, msg } of p) { console.log(`  ${ok ? '✓' : '✗'} ${msg}`); if (!ok) falhas++; }
    } catch (e) {
        console.log(`\n── ${slug} ──\n  ✗ ${e.message}`);
        falhas++;
    }
}
console.log(falhas ? `\n${falhas} verificação(ões) falharam (nenhuma página com falha foi gravada)` : '\ntudo passou');
process.exitCode = falhas ? 1 : 0;
