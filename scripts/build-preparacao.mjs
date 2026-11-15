#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════════════════════
// Gera os dados da página de Preparação (preparacao.html): francês e Agro English.
//   node scripts/build-preparacao.mjs          → escreve data/preparacao/*.json
//   node scripts/build-preparacao.mjs --check  → só confere (falha se mudou)
//
// De cada aula saem o diálogo, 8 palavras e 3 frases para repetir (francês:
// fr-lessons-part1/2.mjs, já sem pronúncia escrita; Agro: scripts/agroNN-*.json).
// De fr-preparacao.mjs e agro-preparacao.mjs saem as perguntas de compreensão,
// os "repare" (noticing) e a pergunta da aula.
// Mudou o conteúdo de uma aula? Rode este script de novo e troque VERSAO_DADOS
// em preparacao-core.js.
// Curso novo: uma fonte como aulasAgro() e uma entrada em CURSOS.
// ══════════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FR_LESSONS_1_6 } from './fr-lessons-part1.mjs';
import { FR_LESSONS_7_12 } from './fr-lessons-part2.mjs';
import { semPronuncia } from './fr-sem-pronuncia.mjs';
import { FR_PREPARACAO } from './fr-preparacao.mjs';
import { AGRO_PREPARACAO } from './agro-preparacao.mjs';

const RAIZ = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SAIDA = path.join(RAIZ, 'data', 'preparacao');
const PALAVRAS = 8;
const REPETIR = 3;

// "Enchanté(e)" → "enchanté"; "S'il vous plaît" → "s'il vous plaît"
const paraBusca = t => String(t || '').toLowerCase().replace(/\([^)]*\)/g, '').replace(/[’]/g, "'").replace(/\s+/g, ' ').trim();
const contaPalavras = t => String(t || '').split(/\s+/).filter(Boolean).length;
const lerJson = f => JSON.parse(fs.readFileSync(path.join(RAIZ, f), 'utf8'));

// ── Fontes ────────────────────────────────────────────────────────────────────
// Cada curso entrega as aulas na mesma forma: { aula, curso, idioma, num, titulo,
// subtitulo, emoji, dialogoTitulo, contexto, linhas[{quem, txt, pt, …}],
// vocab[{txt, pt, ex, emoji}], extra }. `txt` é sempre o texto no idioma do curso.

function aulasFrances() {
  return semPronuncia([...FR_LESSONS_1_6, ...FR_LESSONS_7_12]).map(l => ({
    aula: l.slug, curso: 'francais', idioma: 'fr', idiomaNome: 'francês', num: l.num,
    titulo: l.title, subtitulo: l.subtitle, emoji: l.emoji,
    dialogoTitulo: l.dialogueTitle, contexto: l.dialogueSub,
    linhas: l.dialogueLines.map(d => ({ quem: d.speaker, txt: d.fr, pt: d.pt })),
    vocab: l.vocab.map(v => ({ txt: v.en, pt: v.pt, ex: v.ex || '', emoji: v.emoji || '' })),
    extra: FR_PREPARACAO[l.num] ? { ...FR_PREPARACAO[l.num], pergunta: { txt: FR_PREPARACAO[l.num].pergunta.fr, pt: FR_PREPARACAO[l.num].pergunta.pt, exemplo: FR_PREPARACAO[l.num].pergunta.exemplo } } : null,
    semConteudo: `${l.slug}: sem conteúdo em fr-preparacao.mjs`,
  }));
}

// Agro English: scripts/agroNN-dialogo.json + agroNN-conteudo.json. Só as falas
// principais (as `extra` ficam para a aula): 12 falas cabem nos 10 a 15 minutos.
// Cada fala leva a voz do personagem; o mp3 gravado entra só se o arquivo existir
// (gerou o áudio da aula? rode este script de novo).
function aulasAgro() {
  return Object.keys(AGRO_PREPARACAO).map(Number).sort((a, b) => a - b).map(num => {
    const nn = String(num).padStart(2, '0');
    const d = lerJson(`scripts/agro${nn}-dialogo.json`);
    const c = lerJson(`scripts/agro${nn}-conteudo.json`);
    const nome = papel => String((c.personagens || {})[papel] || papel).replace(/^[^\p{L}]+/u, '').trim();
    const linhas = d.linhas.map((l, i) => ({ l, i })).filter(x => !x.l.extra).map(({ l, i }) => {
      const mp3 = `assets/audio/agro${nn}/s${String(i + 1).padStart(2, '0')}.mp3`;
      const linha = { quem: nome(l.who), txt: l.en, pt: l.pt, voz: (d.vozes || {})[l.who] || 'nova', doAluno: l.who === 'yara' };
      if (fs.existsSync(path.join(RAIZ, mp3))) linha.mp3 = '/' + mp3;
      return linha;
    });
    const bruto = AGRO_PREPARACAO[num];
    const sub = String((c.seo.titulo || '').split(' — ')[1] || '').replace(/ em inglês$/, '');
    return {
      aula: `agro_aula_${nn}`, curso: 'agro', idioma: 'en', idiomaNome: 'inglês', num,
      titulo: d.titulo, subtitulo: sub.charAt(0).toUpperCase() + sub.slice(1), emoji: c.hero.emoji,
      dialogoTitulo: d.titulo, contexto: String(c.dialogo.sub || '').replace(/\s*Ouça antes de ler a tradução\.\s*$/, ''),
      linhas,
      vocab: c.vocab.map(v => ({ txt: v.en, pt: v.pt, ex: v.ex || '', emoji: v.emoji || '' })),
      extra: {
        compreensao: bruto.compreensao,
        // A fala do "repare" é achada pelo trecho (a primeira fala principal que o tem).
        perceber: bruto.perceber.map(p => ({ ...p, linha: linhas.findIndex(l => l.txt.includes(p.trecho)) })),
        pergunta: { txt: bruto.pergunta.en, pt: bruto.pergunta.pt, exemplo: bruto.pergunta.exemplo },
      },
      // A aula tem o passo "🎯 Prepare": terminar aqui marca o passo lá, sem XP repetido.
      aulaFeito: { chave: `capyAgro${nn}Done`, secao: 'prepare' },
    };
  });
}

const CURSOS = [
  { curso: { id: 'francais', nome: 'Francês', bandeira: '🇫🇷', idioma: 'fr', idiomaNome: 'francês', naFrase: 'de francês', concluidas: 'capyFrCompleted', pagina: 'classes_fr.html' }, aulas: aulasFrances },
  { curso: { id: 'agro', nome: 'Agro English', bandeira: '🚜', idioma: 'en', idiomaNome: 'inglês', naFrase: 'do Agro English', concluidas: 'capyAgroCompleted', pagina: 'classes_agro.html' }, aulas: aulasAgro },
];

// 8 palavras da aula, primeiro as que aparecem no diálogo (o aluno vai ouvi-las).
// Em inglês o vocabulário vem como "to check" e "leaf / leaves": cada pedaço conta.
function escolherPalavras(n) {
  const texto = paraBusca(n.linhas.map(d => d.txt).join(' '));
  const termos = v => n.idioma === 'en'
    ? paraBusca(v.txt).split('/').map(t => t.trim().replace(/^to /, '')).filter(Boolean)
    : [paraBusca(v.txt)];
  const todas = n.vocab.map((v, i) => ({ v, i, noDialogo: termos(v).some(t => texto.includes(t)) }));
  const escolhidas = [...todas.filter(x => x.noDialogo), ...todas.filter(x => !x.noDialogo)]
    .slice(0, PALAVRAS)
    .sort((a, b) => a.i - b.i);
  return escolhidas.map(({ v }) => ({ txt: v.txt, pt: v.pt, ex: v.ex || '', emoji: v.emoji || '' }));
}

// 3 frases curtas do diálogo (4 a 11 palavras), espalhadas do começo ao fim.
// Quando o diálogo marca as falas do aluno (Agro), são elas que ele repete.
function escolherFrases(n) {
  const curtas = n.linhas.filter(d => { const k = contaPalavras(d.txt); return k >= 4 && k <= 11; });
  const doAluno = curtas.filter(d => d.doAluno);
  const candidatas = doAluno.length >= REPETIR ? doAluno : curtas;
  const fonte = candidatas.length >= REPETIR ? candidatas : n.linhas;
  const idx = fonte.length <= REPETIR ? fonte.map((_, i) => i)
    : [0, Math.floor((fonte.length - 1) / 2), fonte.length - 1];
  return idx.map(i => ({ txt: fonte[i].txt, pt: fonte[i].pt }));
}

export function montarAula(n) {
  const extra = n.extra;
  const a = {
    aula: n.aula,
    curso: n.curso,
    idioma: n.idioma,
    idiomaNome: n.idiomaNome,
    num: n.num,
    titulo: n.titulo,
    subtitulo: n.subtitulo,
    emoji: n.emoji,
    minutos: 12,
    dialogo: {
      titulo: n.dialogoTitulo,
      contexto: n.contexto,
      linhas: n.linhas.map(d => {
        const linha = { quem: d.quem, txt: d.txt, pt: d.pt };
        if (d.voz) linha.voz = d.voz;
        if (d.mp3) linha.mp3 = d.mp3;
        return linha;
      }),
    },
    compreensao: extra.compreensao.map(c => ({ q: c.q, opts: c.opts, a: c.opts[0] })),
    palavras: escolherPalavras(n),
    perceber: extra.perceber.map(p => ({ linha: p.linha, trecho: p.trecho, pergunta: p.pergunta, opts: p.opts, a: p.opts[0], explica: p.explica })),
    repetir: escolherFrases(n),
    pergunta: extra.pergunta,
  };
  if (n.aulaFeito) a.aulaFeito = n.aulaFeito;
  return a;
}

// O que a página não pode mostrar ao aluno, e o que precisa fechar.
export function conferirAula(a) {
  const erros = [];
  const onde = a.aula;
  const textos = [];
  const walk = x => {
    if (typeof x === 'string') textos.push(x);
    else if (Array.isArray(x)) x.forEach(walk);
    else if (x && typeof x === 'object') Object.values(x).forEach(walk);
  };
  walk(a);
  for (const t of textos) {
    if (/\[[^\]\[]{2,60}\]/.test(t)) erros.push(`${onde}: pronúncia escrita: ${t.slice(0, 60)}`);
    if (/gram[aá]tic|grammar/i.test(t)) erros.push(`${onde}: "gramática" para o aluno: ${t.slice(0, 60)}`);
  }
  if (a.compreensao.length !== 3) erros.push(`${onde}: são 3 perguntas de compreensão`);
  if (a.perceber.length !== 2) erros.push(`${onde}: são 2 "repare"`);
  if (a.palavras.length !== PALAVRAS) erros.push(`${onde}: são ${PALAVRAS} palavras`);
  if (a.repetir.length !== REPETIR) erros.push(`${onde}: são ${REPETIR} frases para repetir`);
  for (const q of [...a.compreensao, ...a.perceber]) {
    if (!q.opts.includes(q.a) || new Set(q.opts).size !== q.opts.length || q.opts.length < 3) erros.push(`${onde}: alternativas erradas em "${q.q || q.pergunta}"`);
  }
  for (const p of a.perceber) {
    const linha = a.dialogo.linhas[p.linha];
    if (!linha || !linha.txt.includes(p.trecho)) erros.push(`${onde}: o trecho "${p.trecho}" não está na linha ${p.linha} do diálogo`);
  }
  if (!a.pergunta || !a.pergunta.txt || !a.pergunta.pt || !a.pergunta.exemplo) erros.push(`${onde}: falta a pergunta da aula`);
  if (a.dialogo.linhas.some(l => !l.quem || !l.txt || !l.pt)) erros.push(`${onde}: fala do diálogo sem personagem, texto ou tradução`);
  return erros;
}

export function gerar() {
  const arquivos = {};
  const erros = [];
  const cursos = [];
  for (const { curso, aulas } of CURSOS) {
    const lista = [];
    for (const n of aulas()) {
      if (!n.extra) { erros.push(n.semConteudo || `${n.aula}: sem conteúdo de preparação`); continue; }
      const a = montarAula(n);
      erros.push(...conferirAula(a));
      arquivos[`${a.aula}.json`] = JSON.stringify(a, null, 1) + '\n';
      lista.push({ num: a.num, aula: a.aula, titulo: a.titulo, subtitulo: a.subtitulo, emoji: a.emoji, minutos: a.minutos });
    }
    cursos.push({ ...curso, aulas: lista });
  }
  arquivos['cursos.json'] = JSON.stringify({ cursos }, null, 1) + '\n';
  return { arquivos, erros };
}

function main() {
  const { arquivos, erros } = gerar();
  if (erros.length) { console.error('✗ Preparação:\n  - ' + erros.join('\n  - ')); process.exit(1); }
  if (process.argv.includes('--check')) {
    const diferentes = Object.entries(arquivos).filter(([n, c]) => {
      const f = path.join(SAIDA, n);
      return !fs.existsSync(f) || fs.readFileSync(f, 'utf8') !== c;
    }).map(([n]) => n);
    if (diferentes.length) { console.error('✗ data/preparacao desatualizado: ' + diferentes.join(', ') + ' — rode node scripts/build-preparacao.mjs'); process.exit(1); }
    console.log(`✓ data/preparacao em dia (${Object.keys(arquivos).length} arquivos)`);
    return;
  }
  fs.mkdirSync(SAIDA, { recursive: true });
  for (const [n, c] of Object.entries(arquivos)) fs.writeFileSync(path.join(SAIDA, n), c);
  console.log(`✓ data/preparacao: ${Object.keys(arquivos).length} arquivos`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
