#!/usr/bin/env node
// ════════════════════════════════════════════════════════════════════════════
// vocab-do-curso.mjs — o que UM curso já ensinou
// ════════════════════════════════════════════════════════════════════════════
// Ferramenta de autor. Não é deployada (o vercel.json bloqueia /scripts/*).
//
// Existe porque escolher o vocabulário de uma aula nova "de cabeça" repete
// palavra sem querer e deixa buraco sem querer. Aqui a lista é extraída dos
// arquivos, não lembrada.
//
//   node scripts/vocab-do-curso.mjs gpstronic
//   node scripts/vocab-do-curso.mjs gpstronic --para-aula 9
//   node scripts/vocab-do-curso.mjs --todos
//
// REGRA QUE NÃO SE QUEBRA: um curso nunca enxerga outro. GPS Tronic é B2B de
// reparo de GPS agrícola; Travel é turismo. Misturar os dois estraga os dois.
// ════════════════════════════════════════════════════════════════════════════

import fs from 'node:fs';
import path from 'node:path';

const RAIZ = path.resolve(new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));

// Só o prefixo dos arquivos e o idioma ENSINADO. Nada de nome de array aqui:
// a descoberta é por forma (ver extrairVocabulario), porque nome não serve.
const CURSOS = {
    'gpstronic':    { re: /^gpstronic_aula_(\d+)\.html$/,    idioma: 'en' },
    'travel':       { re: /^travel_aula_(\d+)\.html$/,       idioma: 'en' },
    'business':     { re: /^business_aula_(\d+)\.html$/,     idioma: 'en' },
    'intermediate': { re: /^intermediate_aula_(\d+)\.html$/, idioma: 'en' },
    'advanced':     { re: /^advanced_aula_(\d+)\.html$/,     idioma: 'en' },
    'ingles-base':  { re: /^aula_(\d+)\.html$/,              idioma: 'en' },
    'interview':    { re: /^interview_aula_(\d+)\.html$/,     idioma: 'en' },
    // `idioma` é a língua ENSINADA, e decide qual metade do par é a palavra:
    // no francês, `['Monday','lundi']` ensina "lundi", não "Monday".
    'frances':      { re: /^fr_aula_(\d+)\.html$/,           idioma: 'fr' },
};

// Casa os colchetes a partir de `[`. Regex sozinho não serve: os exemplos
// contêm `[` e `]` dentro de string.
function fatiarArray(texto, inicio) {
    let i = inicio, prof = 0, dentro = null, escapa = false;
    for (; i < texto.length; i++) {
        const c = texto[i];
        if (escapa) { escapa = false; continue; }
        if (dentro) {
            if (c === '\\') escapa = true;
            else if (c === dentro) dentro = null;
            continue;
        }
        if (c === '"' || c === "'" || c === '`') { dentro = c; continue; }
        if (c === '[') prof++;
        else if (c === ']') { prof--; if (prof === 0) return texto.slice(inicio, i + 1); }
    }
    return null;
}

// Arrays que NÃO são vocabulário, mesmo tendo pares palavra/tradução.
const NOMES_PROIBIDOS = /^(TABS|EXPRS?|EXPRESSIONS?\d*|QUIZ\d*|SPEAK\d*|DIALOGUE\d*|GRAMMAR\w*|WO\d+_DATA|MP\d+|FILL\d+|VERBS?_?\w*|CONV\w*|SECTIONS?|ROUTE)$/i;

// Descoberta POR FORMA, não por nome — foi o único jeito que funcionou. Os
// nomes, medidos: `VOCAB_DATA` nos cursos temáticos; `VOCAB` no inglês base,
// mas `VOCAB14`/`VOCAB38`… em várias aulas, com o número colado; e no francês
// o nome muda com o TEMA — `DAYS`/`MONTHS` na 07, `WEATHER`/`SEASONS` na 09,
// `TIME`/`PAST` na 12. Nenhuma lista de nomes cobriria isso.
//
// Os TRÊS formatos de item que existem no projeto, medidos:
//   {en:'weekend', pt:'fim de semana', ex:'...'}   cursos temáticos
//   {w:'smartphone', t:'celular inteligente'}      várias aulas do inglês base
//   ['Monday', 'lundi [lun-DEE]']                  francês — par, nem objeto é
// No francês a palavra ENSINADA é o índice 1 (o 0 é o inglês de apoio).
const PALAVRA = { en: ['en', 'w', 'word', 'term'], fr: ['fr', 'w', 'word', 'term'] };
const TRADUCAO = ['pt', 't', 'translation'];

function palavraDoItem(item, idioma) {
    if (Array.isArray(item)) {
        if (item.length < 2 || typeof item[0] !== 'string' || typeof item[1] !== 'string') return null;
        const bruta = idioma === 'fr' ? item[1] : item[0];
        return limpar(bruta);
    }
    if (!item || typeof item !== 'object') return null;
    if (!TRADUCAO.some(c => typeof item[c] === 'string' && item[c].trim())) return null;
    for (const c of PALAVRA[idioma]) {
        if (typeof item[c] === 'string' && item[c].trim()) return limpar(item[c]);
    }
    return null;
}

// Tira guia de pronúncia — `lundi [lun-DEE]` é uma palavra só, não duas.
const limpar = s => s.replace(/\[[^\]]*\]/g, '').replace(/\s+/g, ' ').trim();

function extrairVocabulario(texto, idioma) {
    const achados = [];
    for (const m of texto.matchAll(/(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*\[/g)) {
        const nome = m[1];
        if (NOMES_PROIBIDOS.test(nome)) continue;
        const bruto = fatiarArray(texto, m.index + m[0].length - 1);
        if (!bruto) continue;
        let itens;
        try { itens = new Function(`return ${bruto}`)(); }   // dados puros, sem chamada
        catch { continue; }
        if (!Array.isArray(itens) || itens.length < 3) continue;

        const palavras = itens.map(it => palavraDoItem(it, idioma));
        const bons = palavras.filter(Boolean);
        if (bons.length / itens.length < 0.7) continue;   // é outra coisa
        achados.push({ nome, palavras: bons });
    }
    if (!achados.length) return { erro: 'nenhum array com forma de vocabulário' };
    // Uma aula pode ter mais de um (francês: DAYS + MONTHS). Junta todos.
    return { nomes: achados.map(a => a.nome), achados };
}

function lerCurso(chave) {
    const cfg = CURSOS[chave];
    if (!cfg) throw new Error(`curso desconhecido: ${chave}. Conhecidos: ${Object.keys(CURSOS).join(', ')}`);

    const arquivos = fs.readdirSync(RAIZ)
        .map(f => ({ f, m: cfg.re.exec(f) }))
        .filter(x => x.m)
        .map(x => ({ arquivo: x.f, n: Number(x.m[1]) }))
        .sort((a, b) => a.n - b.n);

    const porPalavra = new Map();   // palavra normalizada → {palavra, aulas:Set}
    const semVocab = [];
    let totalItens = 0;

    const fontes = [];
    for (const { arquivo, n } of arquivos) {
        const texto = fs.readFileSync(path.join(RAIZ, arquivo), 'utf8');
        const r = extrairVocabulario(texto, cfg.idioma);
        if (r.erro) { semVocab.push({ aula: n, arquivo, motivo: r.erro }); continue; }
        fontes.push({ aula: n, arrays: r.nomes });
        for (const { palavras } of r.achados) {
            for (const p of palavras) {
                totalItens++;
                const chaveP = p.trim().toLowerCase().replace(/^(to|the|a|an|le|la|les|un|une)\s+/, '');
                if (!porPalavra.has(chaveP)) porPalavra.set(chaveP, { palavra: p.trim(), aulas: new Set() });
                porPalavra.get(chaveP).aulas.add(n);
            }
        }
    }

    const palavras = [...porPalavra.values()]
        .map(v => ({ palavra: v.palavra, aulas: [...v.aulas].sort((a, b) => a - b), vezes: v.aulas.size }))
        .sort((a, b) => b.vezes - a.vezes || a.palavra.localeCompare(b.palavra));

    return { curso: chave, aulas: arquivos.length, comVocab: arquivos.length - semVocab.length,
             semVocab, fontes, totalItens, unicas: palavras.length, palavras };
}

// Candidatas a revisão, com a regra do Luis: pouquíssimas, e nunca da aula
// imediatamente anterior — repetir a última aula é redundância, não revisão.
// O script oferece um POOL; quem escolhe as 3 é o agente, por encaixe no tema
// da aula. Um corte automático em 3 aqui devolveria sempre as três primeiras da
// aula 1 na ordem do arquivo — que é ordenação alfabética disfarçada de critério.
function candidatasDeRevisao(dados, paraAula, pool = 25) {
    const distanciaMinima = 2;
    const elegiveis = dados.palavras.filter(p => {
        const maisRecente = Math.max(...p.aulas);
        return (paraAula - maisRecente) >= distanciaMinima;
    });
    // Vistas UMA vez só vêm primeiro: são as que provavelmente não pegaram.
    // Entre elas, as mais antigas primeiro.
    elegiveis.sort((a, b) => a.vezes - b.vezes || Math.max(...a.aulas) - Math.max(...b.aulas));
    return elegiveis.slice(0, pool).map(p => ({
        ...p,
        porque: p.vezes === 1
            ? `apareceu uma vez só, na aula ${p.aulas[0]} — ${paraAula - p.aulas[0]} aulas atrás`
            : `vista ${p.vezes}x (aulas ${p.aulas.join(', ')}), a última há ${paraAula - Math.max(...p.aulas)} aulas`,
    }));
}

function imprimir(dados, paraAula) {
    console.log(`\n═══ ${dados.curso} ═══`);
    console.log(`${dados.aulas} aulas · ${dados.comVocab} com vocabulário · ${dados.totalItens} entradas · ${dados.unicas} palavras distintas`);

    if (dados.semVocab.length) {
        console.log(`\n⚠️  ${dados.semVocab.length} aula(s) SEM vocabulário extraível — não são zero, são desconhecidas:`);
        for (const s of dados.semVocab) console.log(`   aula ${String(s.aula).padStart(2)} · ${s.arquivo} · ${s.motivo}`);
    }

    // `--fontes` mostra de QUAL array de cada aula a palavra saiu. É a única
    // forma de perceber que o detector capturou um array que não é vocabulário
    // — um total alto e uma lista plausível escondem esse erro muito bem.
    if (process.argv.includes('--fontes')) {
        console.log('\n── De onde saiu cada lista ──');
        for (const f of dados.fontes) console.log(`   aula ${String(f.aula).padStart(2)} · ${f.arrays.join(', ')}`);
    }

    const repetidas = dados.palavras.filter(p => p.vezes > 1);
    console.log(`\n── Já repetidas no curso (${repetidas.length}) ──`);
    for (const p of repetidas.slice(0, 20)) console.log(`   ${p.vezes}x  ${p.palavra.padEnd(22)} aulas ${p.aulas.join(', ')}`);
    if (repetidas.length > 20) console.log(`   ... e mais ${repetidas.length - 20}`);

    const umaVez = dados.palavras.filter(p => p.vezes === 1);
    console.log(`\n── Vistas uma vez só (${umaVez.length}) — as que provavelmente não pegaram ──`);
    console.log('   ' + umaVez.map(p => p.palavra).join(', '));

    if (paraAula) {
        const c = candidatasDeRevisao(dados, paraAula);
        console.log(`\n── POOL de revisão para a aula ${paraAula} (distância mínima: 2 aulas) ──`);
        if (!c.length) console.log('   nenhuma elegível — todas as palavras são recentes demais');
        for (const p of c) console.log(`   ${p.palavra.padEnd(22)} ${p.porque}`);
        console.log(`\n   Este é o pool, NÃO a escolha. Escolha no máximo 3 de ~14, por encaixe`);
        console.log(`   no tema da aula nova. Reciclada entra em contexto NOVO, nunca com o mesmo exemplo.`);
    }
}

// ── main ───────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const paraAula = args.includes('--para-aula') ? Number(args[args.indexOf('--para-aula') + 1]) : null;
const alvos = args.includes('--todos') ? Object.keys(CURSOS) : args.filter(a => !a.startsWith('--') && a !== String(paraAula));

if (!alvos.length) {
    console.log('uso: node scripts/vocab-do-curso.mjs <curso> [--para-aula N]');
    console.log('     node scripts/vocab-do-curso.mjs --todos');
    console.log('cursos:', Object.keys(CURSOS).join(', '));
    process.exit(1);
}

let houveFalha = false;
for (const alvo of alvos) {
    const dados = lerCurso(alvo);
    imprimir(dados, alvos.length === 1 ? paraAula : null);
    if (dados.semVocab.length) houveFalha = true;
    if (args.includes('--json')) fs.writeFileSync(`vocab-${alvo}.json`, JSON.stringify(dados, null, 2));
}

// Sai 1 se alguma aula não deu para ler: quem chamar sabe que a lista está
// incompleta, em vez de tratar o silêncio como "curso limpo".
process.exit(houveFalha ? 1 : 0);
