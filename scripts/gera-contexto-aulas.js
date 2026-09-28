#!/usr/bin/env node
// Gera api/aulas-contexto.json: o material de cada aula que a Yara usa para
// conduzir a ligacao guiada e o chat dentro da aula.
//
//   npm run aulas:contexto          -> grava o JSON
//   require('./gera-contexto-aulas').gerar()  -> devolve o objeto (os testes usam)
//
// POR QUE NO SERVIDOR: o navegador manda so o id da aula ('agro_aula_03'),
// igual ja manda so o id da persona. Texto vindo do cliente nunca vira prompt,
// e o widget (carregado por 160 paginas, sob uma CSP sem unsafe-eval) nao
// precisa carregar um parser de JS.
//
// COMO LE: as aulas guardam o conteudo em arrays `const` no <script> inline,
// com mais de 60 nomes diferentes (VOCAB14, DIALOGUE44, SPEAK_SENTENCES...).
// Entao o extrator acha cada `const X = [`, avalia SO o literal num sandbox vm
// (conteudo do proprio repositorio, em tempo de build) e classifica pela
// FORMA dos itens, nao pelo nome. Aulas antigas tem o dialogo so no HTML: ai
// ele le os blocos da aba #tab-dialogue.
//
// Rodar de novo sempre que uma aula for criada ou editada. O teste
// tests/aula-contexto.test.js falha se o JSON commitado ficar desatualizado.
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RAIZ = path.join(__dirname, '..');
const SAIDA = path.join(RAIZ, 'api', 'aulas-contexto.json');

// Tetos: o material entra nas instrucoes de TODA resposta da ligacao, e cada
// token de instrucao e cobrado de novo a cada turno.
const TETO = { titulo: 80, resumo: 160, situacao: 160, palavras: [12, 40], falas: [10, 120], frases: [6, 80], pratica: [4, 120], perguntas: [3, 120] };

const ENTIDADES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', rsquo: "'", lsquo: "'", rdquo: '"', ldquo: '"', hellip: '...', ndash: '-', mdash: '-' };
function decodificar(s) {
    let t = String(s);
    for (let i = 0; i < 2; i++) {        // &amp;amp; existe em 6 aulas
        t = t.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
            if (e[0] === '#') {
                const n = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
                return Number.isFinite(n) ? String.fromCodePoint(n) : m;
            }
            return Object.prototype.hasOwnProperty.call(ENTIDADES, e.toLowerCase()) ? ENTIDADES[e.toLowerCase()] : m;
        });
    }
    return t;
}

// Tag de TEXTO (<strong>avez</strong>-vous) some sem deixar espaco, senao a
// fala vira "avez -vous" e "J' ai". Tag de bloco e <br> viram espaco.
function limpar(s) {
    return decodificar(String(s == null ? '' : s)
        .replace(/<\/?(?:strong|b|em|i|u|span|mark|small|code|sup|sub)\b[^>]*>/gi, '')
        .replace(/<[^>]*>/g, ' '))
        .replace(/[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}‍️⃣]/gu, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function cortar(s, n) {
    s = String(s || '');
    if (s.length <= n) return s;
    const c = s.slice(0, n);
    const espaco = c.lastIndexOf(' ');
    return (espaco > n * 0.6 ? c.slice(0, espaco) : c).trim();
}

// ── Leitura dos arrays do <script> inline ────────────────────────────────────
function fimDoLiteral(txt, i) {
    let prof = 0;
    for (let k = i; k < txt.length; k++) {
        const c = txt[k];
        if (c === '"' || c === "'" || c === '`') {
            const q = c; k++;
            while (k < txt.length && txt[k] !== q) { if (txt[k] === '\\') k++; k++; }
            continue;
        }
        if (c === '/' && txt[k + 1] === '/') { while (k < txt.length && txt[k] !== '\n') k++; continue; }
        if (c === '/' && txt[k + 1] === '*') { k = txt.indexOf('*/', k + 2) + 1; if (k <= 0) return -1; continue; }
        if (c === '[' || c === '{' || c === '(') prof++;
        else if (c === ']' || c === '}' || c === ')') { prof--; if (prof === 0) return k; }
    }
    return -1;
}

function arraysDaPagina(html) {
    const saida = [];
    const scripts = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
    for (const s of scripts) {
        for (const m of s.matchAll(/(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:\/\*[^*]*\*\/\s*)?\[/g)) {
            const ini = m.index + m[0].length - 1;
            const fim = fimDoLiteral(s, ini);
            if (fim < 0) continue;
            let valor;
            // So o literal, sem acesso a nada: variavel de execucao (shuffle,
            // tiles...) referencia outras coisas e simplesmente falha aqui.
            try { valor = vm.runInNewContext('(' + s.slice(ini, fim + 1) + ')', Object.create(null), { timeout: 200 }); }
            catch (e) { continue; }
            if (Array.isArray(valor) && valor.length) saida.push({ nome: m[1], itens: valor });
        }
    }
    return saida;
}

// ── Classificacao pela forma ─────────────────────────────────────────────────
const ehObj = x => x && typeof x === 'object' && !Array.isArray(x);
const tem = (o, ...k) => k.some(c => typeof o[c] === 'string' && o[c].trim());
// Arrays de EXERCICIO tem forma parecida com conteudo (pares l/r, lacunas,
// ordem de palavras). Aqui o nome decide, porque a forma sozinha nao separa.
const EXERCICIO = /^(QUIZ|PRACTICE|PRAC|MP|FILL|fill|ERR|err|WO|wo|TABS|SECTIONS|sections|ROTA|VERBS?_?QUIZ|VERB_QUIZ|HW|BLANKS|DEBATE|WILL_USES|answers|GRAMMAR|ACC|mp\d|tense|checked|accept)/;

function maioria(itens, teste) {
    const n = itens.filter(teste).length;
    return n >= Math.max(1, Math.ceil(itens.length * 0.6));
}

function classificar({ nome, itens }, lang) {
    if (EXERCICIO.test(nome)) return null;
    // Dialogo: quem fala + o que fala.
    if (maioria(itens, x => ehObj(x) && tem(x, 'who', 'sp', 'speaker') && tem(x, 'plain', 'en', 'text', 'msg'))) {
        return { balde: 'falas', valores: itens.filter(ehObj).map(x => ({
            quem: String(x.who || x.sp || x.speaker || ''),
            fala: x.plain || x.en || x.text || x.msg,
            extra: x.extra === true,
        })) };
    }
    // Expressoes.
    if (maioria(itens, x => ehObj(x) && tem(x, 'expr', 'phrase', 'chunk'))) {
        return { balde: 'frases', valores: itens.filter(ehObj).map(x => x.expr || x.phrase || x.chunk) };
    }
    // Perguntas de conversa (nunca as de quiz, que tem alternativas).
    if (maioria(itens, x => ehObj(x) && !('opts' in x) && !('alts' in x) && (tem(x, 'q', 'prompt') ))) {
        const validas = itens.filter(x => ehObj(x) && !('opts' in x) && x.type !== 'comprehension');
        return { balde: 'perguntas', valores: validas.map(x => x.q || x.prompt) };
    }
    if (/Q$/.test(nome) && maioria(itens, x => ehObj(x) && tem(x, 'text') && !tem(x, 'pt'))) {
        return { balde: 'perguntas', valores: itens.map(x => x.text) };
    }
    // Vocabulario: objeto com a palavra e a traducao.
    if (maioria(itens, x => ehObj(x) && tem(x, 'en', 'w', 'word', 'term') && tem(x, 'pt', 't', 'translation'))) {
        return { balde: 'palavras', valores: itens.filter(ehObj).map(x => x.en || x.w || x.word || x.term) };
    }
    // Vocabulario em par: [palavra, traducao(, exemplo)]. No frances o par e
    // [ingles, 'frances [pronuncia]'] — a palavra da aula e a segunda.
    if (maioria(itens, x => Array.isArray(x) && x.length >= 2 && typeof x[0] === 'string' && typeof x[1] === 'string')) {
        const idx = lang === 'fr' ? 1 : 0;
        return { balde: 'palavras', valores: itens.filter(Array.isArray).map(x => String(x[idx]).replace(/\[[^\]]*\]/g, '')) };
    }
    // Frases para falar em voz alta.
    if (/SPEAK/i.test(nome)) {
        if (maioria(itens, x => typeof x === 'string')) return { balde: 'pratica', valores: itens.filter(x => typeof x === 'string') };
        if (maioria(itens, x => ehObj(x) && tem(x, 'text', 'ph'))) return { balde: 'pratica', valores: itens.map(x => ehObj(x) && (x.text || x.ph)) };
    }
    return null;
}

// Aulas antigas: o dialogo so existe como HTML na aba #tab-dialogue.
function falasDoHtml(html) {
    const i = html.search(/id="tab-dialogue"/);
    if (i < 0) return { falas: [], situacao: '' };
    const resto = html.slice(i);
    const fim = resto.slice(20).search(/id="tab-[a-z]+"/);
    const aba = fim > 0 ? resto.slice(0, fim + 20) : resto.slice(0, 20000);
    const falas = [];
    for (const m of aba.matchAll(/<p[^>]*font-bold[^>]*>([\s\S]*?)<\/p>\s*<p[^>]*>([\s\S]*?)<\/p>/g)) {
        falas.push({ quem: limpar(m[1]), fala: m[2], extra: false });
    }
    // A caixa colorida acima do dialogo descreve a cena ("Leo esta nervoso...").
    const cena = aba.match(/<div[^>]*bg-gradient[^>]*>([\s\S]*?)<\/div>/);
    return { falas, situacao: cena ? limpar(cena[1]) : '' };
}

// ── Uma aula ─────────────────────────────────────────────────────────────────
function prefixoDe(arquivo) {
    const m = arquivo.match(/^(?:([a-z]+)_)?aula_\d+$/);
    return m ? (m[1] ? m[1] + '_aula' : 'aula') : null;
}

function montar({ titulo, resumo, situacao, lang, familia, palavras, falas, frases, pratica, perguntas }) {
    const lista = (v, [n, lim]) => {
        const vistos = new Set();
        const out = [];
        for (const x of v || []) {
            const s = cortar(limpar(x), lim);
            if (s && !vistos.has(s.toLowerCase())) { vistos.add(s.toLowerCase()); out.push(s); }
            if (out.length >= n) break;
        }
        return out;
    };
    // Falante vira A/B/C pela ordem em que aparece: o nome de tela engana (no
    // agro, who:'yara' aparece como "Luan"). Tira o "Nome:" do comeco da fala.
    const letras = new Map();
    const falasLimpas = [];
    const ordenadas = [...(falas || []).filter(f => !f.extra), ...(falas || []).filter(f => f.extra)];
    for (const f of ordenadas) {
        const quem = String(f.quem || '').toLowerCase();
        if (!letras.has(quem)) letras.set(quem, 'ABC'[Math.min(2, letras.size)]);
        const texto = cortar(limpar(f.fala).replace(/^[^:.!?]{1,30}:\s+/, ''), TETO.falas[1]);
        if (texto) falasLimpas.push({ q: letras.get(quem), t: texto });
        if (falasLimpas.length >= TETO.falas[0]) break;
    }
    // Das palavras, primeiro as que aparecem no dialogo: sao as que a Yara vai
    // treinar antes da cena.
    const textoDialogo = falasLimpas.map(f => f.t.toLowerCase()).join(' ');
    const todas = lista(palavras, [60, TETO.palavras[1]]);
    const noDialogo = todas.filter(p => textoDialogo.includes(p.toLowerCase()));
    const palavrasOrdenadas = [...noDialogo, ...todas.filter(p => !noDialogo.includes(p))].slice(0, TETO.palavras[0]);
    return {
        titulo: cortar(limpar(titulo), TETO.titulo),
        resumo: cortar(limpar(resumo), TETO.resumo),
        situacao: cortar(limpar(situacao), TETO.situacao),
        lang, familia,
        palavras: palavrasOrdenadas,
        falas: falasLimpas,
        frases: lista(frases, TETO.frases),
        pratica: lista(pratica, TETO.pratica),
        perguntas: lista(perguntas, TETO.perguntas),
    };
}

function aulaDoHtml(arquivo, html) {
    const id = arquivo.replace(/\.html$/, '');
    const familia = prefixoDe(id);
    const lang = familia === 'fr_aula' ? 'fr' : 'en';
    const baldes = { palavras: [], falas: [], frases: [], pratica: [], perguntas: [] };
    for (const arr of arraysDaPagina(html)) {
        const r = classificar(arr, lang);
        if (r) baldes[r.balde].push(...r.valores);
    }
    let situacao = '';
    if (!baldes.falas.length) {
        const doHtml = falasDoHtml(html);
        baldes.falas = doHtml.falas;
        situacao = doHtml.situacao;
    }
    const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || '';
    const doWidget = (html.match(/lessonTitle\s*:\s*(['"])(.*?)\1/) || [])[2] || '';
    const doTitle = (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '';
    let resumo = (html.match(/<meta\s+name="description"\s+content="([^"]*)"/) || [])[1] || '';
    // A maioria das aulas tem a descricao-modelo "Aprenda X em ingles com
    // vocabulario, gramatica, dialogo..." — nao diz nada que o titulo nao diga.
    if (/com vocabul[aá]rio, gram[aá]tica/i.test(decodificar(resumo))) resumo = '';
    return [id, montar({ titulo: limpar(h1) || doWidget || doTitle, resumo, situacao, lang, familia, ...baldes })];
}

// A trilha diaria: JSON estruturado, nao precisa adivinhar forma nenhuma.
function aulaDaTrilha(j) {
    const lang = ['en', 'fr', 'tr'].includes(j.lang) ? j.lang : 'en';
    return ['trilha_' + j.id, montar({
        titulo: j.title, resumo: j.objective || '', situacao: '', lang, familia: 'trilha_' + lang,
        palavras: (j.vocab || []).map(v => v && v.en),
        falas: [],
        frases: (j.expressions || []).map(e => e && e.expr),
        pratica: [...(j.speak || []), ...(j.sentences || [])],
        perguntas: [],
    })];
}

function gerar() {
    const aulas = {};
    const arquivos = fs.readdirSync(RAIZ).filter(f => /^([a-z]+_)?aula_\d+\.html$/.test(f)).sort();
    for (const f of arquivos) {
        const [id, aula] = aulaDoHtml(f, fs.readFileSync(path.join(RAIZ, f), 'utf8'));
        aulas[id] = aula;
    }
    const dir = path.join(RAIZ, 'data', 'lessons');
    const trilha = fs.readdirSync(dir).filter(f => /^\d+\.json$/.test(f))
        .sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
    for (const f of trilha) {
        const [id, aula] = aulaDaTrilha(JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
        aulas[id] = aula;
    }
    return aulas;
}

// Uma aula por linha: o diff do git mostra exatamente qual aula mudou.
function serializar(aulas) {
    const linhas = Object.keys(aulas).map(id => JSON.stringify(id) + ':' + JSON.stringify(aulas[id]));
    return '{\n' + linhas.join(',\n') + '\n}\n';
}

module.exports = { gerar, serializar, SAIDA, TETO, limpar, classificar, arraysDaPagina };

if (require.main === module) {
    const aulas = gerar();
    const texto = serializar(aulas);
    fs.writeFileSync(SAIDA, texto);
    const ids = Object.keys(aulas);
    const vazias = ids.filter(id => !['palavras', 'falas', 'frases', 'pratica', 'perguntas'].some(b => aulas[id][b].length));
    console.log(`${ids.length} aulas -> ${path.relative(RAIZ, SAIDA)} (${(Buffer.byteLength(texto) / 1024).toFixed(0)} KB)`);
    if (vazias.length) console.log('SEM MATERIAL:', vazias.join(', '));
}
