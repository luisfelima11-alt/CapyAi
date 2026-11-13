#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════════════════════
// Gera os dados da página de Preparação (preparacao.html) — piloto: francês.
//   node scripts/build-preparacao.mjs          → escreve data/preparacao/*.json
//   node scripts/build-preparacao.mjs --check  → só confere (falha se mudou)
//
// De cada aula (fr-lessons-part1/2.mjs, já sem pronúncia escrita) saem o
// diálogo, 8 palavras e 3 frases para repetir; de fr-preparacao.mjs saem as
// perguntas de compreensão, os "repare" (noticing) e a pergunta da aula.
// Mudou o conteúdo de uma aula de francês? Rode este script de novo e troque
// a etiqueta ?v= do fetch em preparacao-core.js.
// ══════════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FR_LESSONS_1_6 } from './fr-lessons-part1.mjs';
import { FR_LESSONS_7_12 } from './fr-lessons-part2.mjs';
import { semPronuncia } from './fr-sem-pronuncia.mjs';
import { FR_PREPARACAO } from './fr-preparacao.mjs';

const RAIZ = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SAIDA = path.join(RAIZ, 'data', 'preparacao');
const PALAVRAS = 8;
const REPETIR = 3;

// "Enchanté(e)" → "enchanté"; "S'il vous plaît" → "s'il vous plaît"
const paraBusca = t => String(t || '').toLowerCase().replace(/\([^)]*\)/g, '').replace(/[’]/g, "'").replace(/\s+/g, ' ').trim();
const contaPalavras = t => String(t || '').split(/\s+/).filter(Boolean).length;

// 8 palavras da aula, primeiro as que aparecem no diálogo (o aluno vai ouvi-las).
function escolherPalavras(l) {
  const texto = paraBusca(l.dialogueLines.map(d => d.fr).join(' '));
  const todas = l.vocab.map((v, i) => ({ v, i, noDialogo: texto.includes(paraBusca(v.en)) }));
  const escolhidas = [...todas.filter(x => x.noDialogo), ...todas.filter(x => !x.noDialogo)]
    .slice(0, PALAVRAS)
    .sort((a, b) => a.i - b.i);
  return escolhidas.map(({ v }) => ({ fr: v.en, pt: v.pt, ex: v.ex || '', emoji: v.emoji || '' }));
}

// 3 frases curtas do diálogo (4 a 11 palavras), espalhadas do começo ao fim.
function escolherFrases(l) {
  const candidatas = l.dialogueLines.filter(d => { const n = contaPalavras(d.fr); return n >= 4 && n <= 11; });
  const fonte = candidatas.length >= REPETIR ? candidatas : l.dialogueLines;
  const idx = fonte.length <= REPETIR ? fonte.map((_, i) => i)
    : [0, Math.floor((fonte.length - 1) / 2), fonte.length - 1];
  return idx.map(i => ({ fr: fonte[i].fr, pt: fonte[i].pt }));
}

export function montarAula(l, extra) {
  return {
    aula: l.slug,
    curso: 'francais',
    idioma: 'fr',
    num: l.num,
    titulo: l.title,
    subtitulo: l.subtitle,
    emoji: l.emoji,
    minutos: 12,
    dialogo: {
      titulo: l.dialogueTitle,
      contexto: l.dialogueSub,
      linhas: l.dialogueLines.map(d => ({ quem: d.speaker, fr: d.fr, pt: d.pt })),
    },
    compreensao: extra.compreensao.map(c => ({ q: c.q, opts: c.opts, a: c.opts[0] })),
    palavras: escolherPalavras(l),
    perceber: extra.perceber.map(p => ({ linha: p.linha, trecho: p.trecho, pergunta: p.pergunta, opts: p.opts, a: p.opts[0], explica: p.explica })),
    repetir: escolherFrases(l),
    pergunta: extra.pergunta,
  };
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
    if (!linha || !linha.fr.includes(p.trecho)) erros.push(`${onde}: o trecho "${p.trecho}" não está na linha ${p.linha} do diálogo`);
  }
  if (!a.pergunta || !a.pergunta.fr || !a.pergunta.pt || !a.pergunta.exemplo) erros.push(`${onde}: falta a pergunta da aula`);
  return erros;
}

export function gerar() {
  const aulas = semPronuncia([...FR_LESSONS_1_6, ...FR_LESSONS_7_12]);
  const arquivos = {};
  const erros = [];
  const lista = [];
  for (const l of aulas) {
    const extra = FR_PREPARACAO[l.num];
    if (!extra) { erros.push(`${l.slug}: sem conteúdo em fr-preparacao.mjs`); continue; }
    const a = montarAula(l, extra);
    erros.push(...conferirAula(a));
    arquivos[`${a.aula}.json`] = JSON.stringify(a, null, 1) + '\n';
    lista.push({ num: a.num, aula: a.aula, titulo: a.titulo, subtitulo: a.subtitulo, emoji: a.emoji, minutos: a.minutos });
  }
  arquivos['cursos.json'] = JSON.stringify({
    cursos: [{ id: 'francais', nome: 'Francês', bandeira: '🇫🇷', idioma: 'fr', concluidas: 'capyFrCompleted', pagina: 'classes_fr.html', aulas: lista }],
  }, null, 1) + '\n';
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
