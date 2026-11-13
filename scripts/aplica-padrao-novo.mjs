#!/usr/bin/env node
// ════════════════════════════════════════════════════════════════════════════
// aplica-padrao-novo.mjs — leva o padrão de 12/nov/2026 às aulas do molde novo
// ════════════════════════════════════════════════════════════════════════════
// As aulas do molde (GPS 09+, Agro, Entrevista, Medical, Intermediate refeitas)
// ganham as Key Expressions em slides sem regerar: basta carregar o
// aula-molde.js, que monta o deck a partir do EXPR_DATA da própria aula.
// Na mesma passada, a tag do gramatica-slides.js sobe de versão em toda página
// (o motor agora serve mais de um deck por página).
//
//   node scripts/aplica-padrao-novo.mjs          aplica (idempotente)
//   node scripts/aplica-padrao-novo.mjs --checar só confere, sai com 1 se faltar algo
// ════════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
import { VERSAO_JS } from './lib/gramatica-slides.mjs';

const RAIZ = path.resolve(new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
export const VERSAO_MOLDE = 'am1';
export const TAG_MOLDE = `<script src="aula-molde.js?v=${VERSAO_MOLDE}"></script>`;
const checar = process.argv.includes('--checar');

/** Aula no molde novo: grade de expressões + percurso linear (ROTA/índice). */
export const ehMolde = html => html.includes('id="expr-grid"') && html.includes('id="rota-indice-lista"') && html.includes('proximoPasso()');

function aplicar(html) {
    let t = html.replace(/gramatica-slides\.js\?v=gs\d+/g, `gramatica-slides.js?v=${VERSAO_JS}`);
    if (ehMolde(t) && !t.includes('aula-molde.js')) {
        if ((t.match(/<\/body>/g) || []).length !== 1) throw new Error('</body> ambíguo');
        const folha = t.indexOf('<script src="folha-da-aula.js');
        t = folha >= 0
            ? t.slice(0, folha) + TAG_MOLDE + '\n' + t.slice(folha)
            : t.replace('</body>', `${TAG_MOLDE}\n</body>`);
    }
    return t;
}

let mudou = 0, molde = 0, falhas = 0;
for (const arq of fs.readdirSync(RAIZ).filter(n => n.endsWith('.html')).sort()) {
    const abs = path.join(RAIZ, arq);
    const antes = fs.readFileSync(abs, 'utf8');
    let depois;
    try { depois = aplicar(antes); } catch (e) { falhas++; console.error(`✗ ${arq}: ${e.message}`); continue; }
    if (ehMolde(depois)) molde++;
    if (depois === antes) continue;
    mudou++;
    if (checar) { console.log(`  falta em ${arq}`); continue; }
    fs.writeFileSync(abs, depois);
}
console.log(`${molde} aulas no molde novo · ${mudou} arquivo(s) ${checar ? 'por aplicar' : 'atualizados'}${falhas ? ` · ${falhas} falha(s)` : ''}`);
process.exitCode = falhas || (checar && mudou) ? 1 : 0;
