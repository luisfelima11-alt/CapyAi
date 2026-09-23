#!/usr/bin/env node
/**
 * build-gpstronic-aula.mjs — monta gpstronic_aula_NN.html a partir do molde.
 *
 *   node scripts/build-gpstronic-aula.mjs 10
 *
 * Irmão do scripts/build-interview-aula.mjs. É um arquivo separado de propósito:
 * o curso de entrevista troca a paleta e a chave de conclusão, o GPS Tronic não.
 * Juntar os dois num script com muitos "se" daria mais chance de errar do que a
 * duplicação custa — e as aulas do curso de entrevista já estão publicadas.
 *
 * Molde: gpstronic_aula_09.html (mesmo curso, mesmo desenho).
 * Fontes: scripts/aulaNN-dialogo.json + scripts/aulaNN-conteudo.json
 */

import fs from 'node:fs';
import path from 'node:path';

const RAIZ = path.resolve(new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const MOLDE = path.join(RAIZ, 'gpstronic_aula_09.html');

function entre(t, abre, fecha, novo) {
    const i = t.indexOf(abre);
    if (i < 0) throw new Error(`âncora não encontrada: ${abre.slice(0, 60)}`);
    const j = t.indexOf(fecha, i + abre.length);
    if (j < 0) throw new Error(`fecho não encontrado: ${fecha.slice(0, 60)}`);
    return t.slice(0, i) + novo + t.slice(j);
}

function trocarArray(t, nome, corpoNovo) {
    const decl = new RegExp(`const\\s+${nome}\\s*=\\s*(/\\*[^*]*\\*/)?\\s*\\[`);
    const m = decl.exec(t);
    if (!m) throw new Error(`array não encontrado: ${nome}`);
    const inicio = m.index + m[0].length - 1;
    let d = 0, aspas = null, k = inicio;
    for (; k < t.length; k++) {
        const c = t[k];
        if (aspas) { if (c === '\\') { k++; continue; } if (c === aspas) aspas = null; continue; }
        if (c === '"' || c === "'" || c === '`') { aspas = c; continue; }
        if (c === '[') d++; else if (c === ']') { d--; if (d === 0) break; }
    }
    if (d !== 0) throw new Error(`array não fecha: ${nome}`);
    return t.slice(0, inicio) + '[\n' + corpoNovo + '\n]' + t.slice(k + 1);
}

const j = o => JSON.stringify(o);

function blocoHero(c) {
    const f = c.hero.flutuantes;
    const pos = [
        'top:10%;left:3%;animation-delay:0s', 'top:60%;left:7%;animation-delay:.7s',
        'top:20%;left:15%;animation-delay:1.3s', 'top:70%;left:22%;animation-delay:.4s',
        'top:5%;right:22%;animation-delay:.9s', 'top:55%;right:15%;animation-delay:1.6s',
        'top:30%;right:5%;animation-delay:.2s', 'top:75%;right:28%;animation-delay:1s',
    ];
    return '  <div class="absolute inset-0 pointer-events-none select-none">\n' + pos.map((p, i) =>
        `    <span class="absolute text-${i % 2 ? 4 : 5}xl float-emoji opacity-${i % 3 === 2 ? 15 : 20}" style="${p}">${f[i % f.length]}</span>`
    ).join('\n') + '\n  </div>\n';
}

function blocoDialogo(c, d) {
    const achar = c.dialogo.achar.map(a =>
        `      <div class="bg-white rounded-xl p-2 border border-emerald-200">✅ <strong>${a}</strong></div>`).join('\n');
    return `<div id="tab-dialogue" class="tab-content fade-in">
  <h2 class="text-2xl font-black text-navy mb-2">${c.dialogo.h2}</h2>
  <p class="text-slate-500 text-sm mb-5">${c.dialogo.sub}</p>

  <figure class="mb-5">
    <img src="/${d.imagem.arquivo}" width="1200" height="800" loading="eager"
         alt="${d.imagem.alt}"
         class="w-full rounded-2xl border-2 border-emerald-200 shadow-sm"/>
  </figure>

  <div class="flex flex-wrap items-center gap-2 mb-4">
    <button type="button" id="dlg-play" onclick="dlgTocarTudo()" class="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-black px-5 py-3 rounded-2xl hover:scale-105 active:scale-95 transition-transform">
      <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1" id="dlg-play-icone">headphones</span>
      <span id="dlg-play-txt">Ouvir o diálogo</span>
    </button>
    <button type="button" id="dlg-modo" onclick="dlgTrocarModo()" class="border-2 border-slate-200 text-slate-600 font-black text-xs px-4 py-2.5 rounded-2xl hover:border-emerald-300 hover:text-emerald-600 transition-colors">
      ➕ Versão longa
    </button>
    <button type="button" id="dlg-pt" onclick="dlgTrocarTraducao()" class="border-2 border-slate-200 text-slate-600 font-black text-xs px-4 py-2.5 rounded-2xl hover:border-emerald-300 hover:text-emerald-600 transition-colors">
      🇧🇷 Mostrar tradução
    </button>
  </div>

  <div class="space-y-3 mb-6" id="dialogue-lines"></div>

  <div class="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4">
    <p class="font-black text-emerald-800 text-sm mb-2">🎯 Encontre no diálogo:</p>
    <div class="grid grid-cols-2 gap-2 text-xs">
${achar}
    </div>
  </div>
  <button onclick="markSectionBtn(this,'dialogue')" class="mt-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black px-6 py-3 rounded-2xl transition-all hover:scale-105 active:scale-95">
    ✓ Li e ouvi o diálogo! (+20 XP)
  </button>
  <div class="mt-6 pt-6 border-t border-slate-100"><button type="button" onclick="proximoPasso()" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-navy text-white font-black px-7 py-3.5 rounded-2xl hover:opacity-90 transition-opacity">Continuar <span class="material-symbols-outlined text-lg">arrow_forward</span></button></div>
</div>

`;
}

function blocoGramatica(c) {
    const g = c.gramatica;
    const acc = g.blocos.map(b => `
    <div class="rounded-2xl border-2 border-emerald-200 bg-emerald-50 overflow-hidden">
      <button class="w-full flex items-center justify-between p-5 text-left" onclick="toggleAccordion('g${b.n}')">
        <div class="flex items-center gap-3"><span class="w-8 h-8 rounded-full bg-emerald-500 text-white font-black text-sm flex items-center justify-center">${b.n}</span><div><div class="font-black text-navy">${b.t}</div><div class="text-emerald-700 text-sm font-semibold">${b.ex}</div></div></div>
        <span class="material-symbols-outlined text-emerald-400 transition-transform" id="g${b.n}-arrow">expand_more</span>
      </button>
      <div id="g${b.n}" class="px-5 pb-5 hidden"><div class="bg-white rounded-xl p-4 space-y-2 text-sm">${b.corpo}</div></div>
    </div>`).join('\n');

    const tb = g.tabela;
    const tabela = `
    <div class="rounded-2xl border-2 border-slate-200 bg-white overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-slate-50"><tr>${tb.cabecalho.map(h => `<th class="text-left font-black text-navy px-4 py-3 whitespace-nowrap">${h}</th>`).join('')}</tr></thead>
          <tbody>${tb.linhas.map(l => `<tr class="border-t border-slate-100">${l.map((cel, i) => `<td class="px-4 py-2.5 ${i === 0 ? 'font-black text-navy' : 'text-slate-600 font-semibold'}">${cel}</td>`).join('')}</tr>`).join('')}</tbody>
        </table>
      </div>
    </div>`;

    return `<div id="tab-grammar" class="tab-content fade-in hidden">
  <h2 class="text-2xl font-black text-navy mb-2">${g.titulo}</h2>
  <p class="text-slate-500 text-sm mb-6">${g.sub}</p>
  <div class="space-y-4">
${acc}
${tabela}
  </div>
  <button onclick="markSectionBtn(this,'grammar')" class="mt-5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black px-6 py-3 rounded-2xl transition-all hover:scale-105 active:scale-95">
    ✓ Entendi a gramática! (+20 XP)
  </button>
  <div class="mt-6 pt-6 border-t border-slate-100"><button type="button" onclick="proximoPasso()" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-navy text-white font-black px-7 py-3.5 rounded-2xl hover:opacity-90 transition-opacity">Continuar <span class="material-symbols-outlined text-lg">arrow_forward</span></button></div>
</div>

`;
}

function construir(n) {
    const nn = String(n).padStart(2, '0');
    const d = JSON.parse(fs.readFileSync(path.join(RAIZ, `scripts/aula${nn}-dialogo.json`), 'utf8'));
    const c = JSON.parse(fs.readFileSync(path.join(RAIZ, `scripts/aula${nn}-conteudo.json`), 'utf8'));
    let t = fs.readFileSync(MOLDE, 'utf8');
    const sufixo = c.sufixo;                          // gps10
    const pastaAudio = `gps${nn}`;

    // 1. SEO
    t = t.split('Walk Me Through It — suporte por telefone em inglês — Aula 9 GPS Tronic').join(c.seo.titulo);
    t = t.split('Guie o cliente por telefone em inglês: imperativo, passo a passo e vocabulário de suporte remoto. Aula 9 do curso GPS Tronic da Capy English, com diálogo em áudio.').join(c.seo.descricao);
    t = t.split('https://www.capyenglish.com.br/gpstronic_aula_09.html').join(`https://www.capyenglish.com.br/gpstronic_aula_${nn}.html`);

    // 2. Hero (o curso e o link de volta continuam os mesmos — é a mesma turma)
    t = entre(t, '  <div class="absolute inset-0 pointer-events-none select-none">', '  <div class="relative max-w-5xl mx-auto px-6 py-12">', blocoHero(c));
    t = t.split('Lesson 09 · Curso exclusivo').join(c.hero.badge);
    t = entre(t, '<h1 class="text-4xl md:text-5xl font-black mb-2 leading-tight">', '</h1>',
        `<h1 class="text-4xl md:text-5xl font-black mb-2 leading-tight">${c.hero.emoji} ${c.hero.titulo1}<br><span class="text-emerald-300">${c.hero.titulo2}</span>`);
    t = entre(t, '<p class="text-white/60 text-base mb-5 max-w-lg">', '</p>',
        `<p class="text-white/60 text-base mb-5 max-w-lg">${c.hero.sub}`);
    t = entre(t, '<div class="flex flex-wrap gap-2 mb-6">', '    </div>',
        '<div class="flex flex-wrap gap-2 mb-6">\n' + c.hero.tags.map(x =>
            `      <span class="bg-white/10 border border-white/20 rounded-full px-3 py-1 text-sm font-bold">${x}</span>`).join('\n') + '\n');

    // 3. Seções com conteúdo
    t = entre(t, '<div id="tab-dialogue" class="tab-content fade-in">', '<!-- VOCAB', blocoDialogo(c, d));
    t = entre(t, '<div id="tab-grammar" class="tab-content fade-in hidden">', '<!-- CONVERSATION', blocoGramatica(c));

    // 4. Homework
    t = t.split('Lesson 09 — Walk Me Through It').join(`Lesson ${nn} — ${d.titulo}`);
    t = entre(t, '      <p class="text-xs font-black text-red-700 mb-1">❌ Frase com erro:</p>', '      <input id=',
        `      <p class="text-xs font-black text-red-700 mb-1">❌ Corrija:</p>\n      <p class="text-sm font-bold text-navy mb-2">${c.homework.erro.enunciado}</p>\n`);

    // 5. Arrays
    t = trocarArray(t, 'DIALOGO', d.linhas.map((l, i) => '  ' + j({
        who: l.who, en: l.en, pt: l.pt, extra: !!l.extra,
        mp3: `/assets/audio/${pastaAudio}/s${String(i + 1).padStart(2, '0')}.mp3`,
    })).join(',\n'));
    t = trocarArray(t, 'VOCAB_DATA', c.vocab.map(v => {
        const o = { en: v.en, pt: v.pt, ex: v.ex, emoji: v.emoji };
        if (v.verb) { o.verb = true; o.forms = v.forms; }
        if (v.revisao) o.revisao = v.revisao;
        return '  ' + j(o);
    }).join(',\n'));
    t = trocarArray(t, 'EXPR_DATA', c.expressoes.map(e => '  ' + j(e)).join(',\n'));
    t = trocarArray(t, 'CONV_DATA', c.conversation.map(x => '  ' + j(x)).join(',\n'));
    t = trocarArray(t, 'QUIZ', c.quiz.map(x => '  ' + j(x)).join(',\n'));
    t = trocarArray(t, 'VERBS_QUIZ_DATA', c.verbsQuiz.map(x => '  ' + j(x)).join(',\n'));
    t = trocarArray(t, 'SPEAK_DATA', c.speak.map(s =>
        '  ' + j({ text: s.replace(/<b>/g, "<strong class='text-emerald-600'>").replace(/<\/b>/g, '</strong>') })).join(',\n'));
    t = trocarArray(t, 'WO_GPS9_DATA', '  ' + j(c.homework.ordem));
    t = trocarArray(t, 'MP_GPS9', c.homework.pares.map(p => '  ' + j(p)).join(',\n'));

    // 6. Correção de erro por lista de respostas aceitas
    const aceitas = c.homework.erro.aceitas.map(a => a.toLowerCase());
    t = entre(t, 'function checkErrorGps9(){', '\n\nlet hwEntregue=false;',
        `function checkErrorGps9(){const inp=document.getElementById('err-gps9'),fb=document.getElementById('err-gps9-fb');if(!inp||!fb)return;const v=inp.value.toLowerCase().replace(/[?.!,]/g,'').replace(/’/g,"'").trim();if(!v){fb.classList.add('hidden');return;}fb.classList.remove('hidden');if(${j(aceitas)}.includes(v)){fb.textContent='✅ Correto!';fb.className='text-xs font-black text-emerald-600 mt-1';}else{fb.textContent=${j('❌ Quase. ' + c.homework.erro.dica)};fb.className='text-xs font-black text-red-500 mt-1';}}`);

    // 7. A chave do curso é a MESMA (mesmo curso) — só o número da aula muda.
    t = t.replace(/arr\.includes\(9\)/, `arr.includes(${n})`).replace(/arr\.push\(9\)/, `arr.push(${n})`);

    // 8. Widget
    t = t.replace(/window\.YARA_WIDGET=\{[^}]*\}/,
        `window.YARA_WIDGET={lang:'en',lessonTitle:${j(d.titulo)},lessonNum:${n},course:'gpstronic'}`);

    // 9. Identificadores. Ordem importa: as chaves com "09" primeiro, senão
    //    "gps9" não as alcança e elas ficariam apontando para a aula anterior.
    t = t.split('/assets/audio/gps09/').join(`/assets/audio/${pastaAudio}/`);
    t = t.split('capyGps09Done').join(`capyGps${nn}Done`);
    t = t.split('capyGps09Passo').join(`capyGps${nn}Passo`);
    t = t.split('Gps9').join('Gps' + n);
    t = t.split('GPS9').join('GPS' + n);
    t = t.split('gps9').join(sufixo);

    // 10. Aula sem verbo no vocabulário: não anunciar "Verbos"
    if (!c.vocab.some(v => v.verb)) {
        t = t.split("rotulo:'📚 Vocab + Verbos'").join("rotulo:'📚 Vocabulário'");
    }

    const destino = path.join(RAIZ, `gpstronic_aula_${nn}.html`);
    fs.writeFileSync(destino, t, 'utf8');
    return { destino, t, d, c, n, nn };
}

function validar({ t, d, c, n, nn }) {
    const p = [];
    const ok = (cond, msg) => p.push({ ok: !!cond, msg });
    ok(!t.includes('gps9') && !t.includes('Gps9') && !t.includes('GPS9') && !t.includes('gps09'), 'sem resíduo da aula 09');
    ok(t.includes('capyGpstronicCompleted'), 'grava capyGpstronicCompleted');
    ok(t.includes(`arr.push(${n})`), `push(${n}) na chave do curso`);
    ok(!/Ã[©¡ªµ§]|â€/.test(t), 'zero mojibake');
    ok((t.match(/id="tab-/g) || []).length === 8, '8 seções tab-*');
    ok(t.includes(`/assets/audio/gps${nn}/s20.mp3`), 'áudio da 20ª fala apontado');
    ok(fs.existsSync(path.join(RAIZ, d.imagem.arquivo)), 'imagem existe em disco');
    ok(c.vocab.length === 14, '14 palavras de vocabulário');
    ok(c.vocab.every(v => v.ex), 'toda palavra tem exemplo');
    ok(c.vocab.every(v => !v.verb || v.forms), 'todo verbo tem as formas');
    ok(c.vocab.filter(v => v.revisao).length <= 3, `revisão deliberada dentro do teto (${c.vocab.filter(v => v.revisao).length}/3)`);
    ok(c.quiz.every(q => q.opts.includes(q.a)), 'a resposta certa está entre as opções');
    ok(c.quiz.every(q => new Set(q.opts).size === q.opts.length), 'sem opção repetida no quiz');
    ok(d.linhas.filter(x => !x.extra).length === 12, '12 falas na versão curta');
    ok(d.linhas.filter(x => x.extra).length === 8, '8 falas extras');
    ok(t.includes('id="dialogue-lines"') && t.includes('id="speak-grid"'), 'contrato de DOM do listening-lab');
    let scripts = 0, quebrados = 0;
    for (const m of t.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)) {
        scripts++;
        try { new Function(m[1]); } catch (e) { quebrados++; console.log('    script quebrado: ' + e.message.slice(0, 90)); }
    }
    ok(quebrados === 0, `${scripts} scripts inline compilam`);
    return p;
}

const alvos = process.argv.slice(2).filter(a => /^\d+$/.test(a)).map(Number);
if (!alvos.length) { console.log('uso: node scripts/build-gpstronic-aula.mjs 10'); process.exit(1); }
let falhas = 0;
for (const n of alvos) {
    const r = construir(n);
    console.log(`\n── gpstronic_aula_${r.nn}.html  (${(r.t.length / 1024).toFixed(0)}KB) ──`);
    for (const { ok, msg } of validar(r)) { console.log(`  ${ok ? '✓' : '✗'} ${msg}`); if (!ok) falhas++; }
}
console.log(falhas ? `\n${falhas} verificação(ões) falharam` : '\ntudo passou');
process.exitCode = falhas ? 1 : 0;
