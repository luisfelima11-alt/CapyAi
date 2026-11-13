#!/usr/bin/env node
/**
 * build-intermediate-aula.mjs — monta intermediate_aula_NN.html no molde novo.
 *
 *   node scripts/build-intermediate-aula.mjs 19 20
 *
 * Pedido do Luis (12/nov/2026): o curso Intermediate é refeito no molde das
 * aulas do GPS Tronic e do Agro English, a começar pelas aulas 19 e 20. Irmão
 * do build-agro-aula.mjs, com o padrão novo de 12/nov:
 *   - as seções "How do you say it in English?" (tab-traducao, depois do
 *     Patterns) e "Complete the text" (tab-lacunas, depois do Practice),
 *     montadas pelo aula-molde.js a partir de TRAD_DATA e LACUNAS_DATA;
 *   - as Key Expressions em slides e o Listening com até 15 áudios vêm do
 *     próprio molde (aula-molde.js e listening-lab.js).
 *
 * Molde: gpstronic_aula_09.html. Fontes: scripts/intermediateNN-dialogo.json +
 * scripts/intermediateNN-conteudo.json. Público: adultos B1–B2 (o curso fecha
 * em B2), então as falas podem ser maiores que no Agro (A0).
 *
 * Paleta: o Intermediate é rose/orange (classes_intermediate.html). A troca
 * cobre as classes do Tailwind e os hex soltos do <style> do molde, como no
 * build-med-aula.mjs.
 */

import fs from 'node:fs';
import path from 'node:path';
import { blocoGramaticaSlides, checarSlides } from './lib/gramatica-slides.mjs';
import { aplicarHomework, checarHomework } from './lib/homework-plus.mjs';
import { aplicarPreparacao, checarPreparacao } from './lib/preparacao.mjs';

const RAIZ = path.resolve(new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const MOLDE = path.join(RAIZ, 'gpstronic_aula_09.html');
const TETO_FALA = 16;      // palavras por fala do diálogo (B1–B2)
const TETO_SPEAK = 12;     // palavras por frase do Speak

// emerald → rose · green → orange. Os hex são os mesmos tons do Tailwind.
const PALETA = [
    [/\bemerald-/g, 'rose-'],
    [/\bgreen-/g, 'orange-'],
    [/#059669/gi, '#e11d48'],   // emerald-600 → rose-600
    [/#16a34a/gi, '#ea580c'],   // green-600   → orange-600
    [/#f0fdf4/gi, '#fff7ed'],   // green-50    → orange-50
    [/#ecfdf5/gi, '#fff1f2'],   // emerald-50  → rose-50
    [/#6ee7b7/gi, '#fda4af'],   // emerald-300 → rose-300
    [/#34d399/gi, '#fb7185'],   // emerald-400 → rose-400
];
const repintar = s => PALETA.reduce((acc, [de, para]) => acc.replace(de, para), s);

function entre(t, abre, fecha, novo) {
    const i = t.indexOf(abre);
    if (i < 0) throw new Error(`âncora não encontrada: ${abre.slice(0, 60)}`);
    const k = t.indexOf(fecha, i + abre.length);
    if (k < 0) throw new Error(`fecho não encontrado: ${fecha.slice(0, 60)}`);
    return t.slice(0, i) + novo + t.slice(k);
}

function trocar(t, de, para, rotulo) {
    if (!t.includes(de)) throw new Error(`não achei ${rotulo} no molde`);
    return t.split(de).join(para);
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
const jsonNoScript = v => JSON.stringify(v).replace(/</g, '\\u003c');
const palavras = s => String(s).replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length;
const CONTINUAR = `  <div class="mt-6 pt-6 border-t border-slate-100"><button type="button" onclick="proximoPasso()" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-navy text-white font-black px-7 py-3.5 rounded-2xl hover:opacity-90 transition-opacity">Continuar <span class="material-symbols-outlined text-lg">arrow_forward</span></button></div>`;

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
${CONTINUAR}
</div>

`;
}

// As duas seções do padrão de 12/nov. O conteúdo é montado pelo aula-molde.js.
const SECAO_TRADUCAO = `<!-- HOW DO YOU SAY IT IN ENGLISH? (padrão de 12/nov/2026, montado pelo aula-molde.js) -->
<div id="tab-traducao" class="tab-content fade-in hidden">
  <h2 class="text-2xl font-black text-navy mb-2">🇧🇷 How do you say it in English?</h2>
  <p class="text-slate-500 text-sm mb-5">Leia a frase em português e escreva em inglês, com as palavras e os padrões da aula. Depois de conferir, a resposta certa aparece escrita.</p>
  <div id="trad-area"></div>
${CONTINUAR}
</div>

`;
const SECAO_LACUNAS = `<!-- COMPLETE THE TEXT (padrão de 12/nov/2026, montado pelo aula-molde.js) -->
<div id="tab-lacunas" class="tab-content fade-in hidden">
  <h2 class="text-2xl font-black text-navy mb-2">🔤 Complete the text</h2>
  <p class="text-slate-500 text-sm mb-5">Um texto com partes faltando. Os pedaços estão na caixa: escolha cada um e encaixe no lugar certo.</p>
  <div id="lacunas-area"></div>
${CONTINUAR}
</div>

`;

function construir(n) {
    const nn = String(n).padStart(2, '0');
    const slug = `intermediate${nn}`;
    const d = JSON.parse(fs.readFileSync(path.join(RAIZ, `scripts/${slug}-dialogo.json`), 'utf8'));
    const c = JSON.parse(fs.readFileSync(path.join(RAIZ, `scripts/${slug}-conteudo.json`), 'utf8'));
    // No Windows o checkout pode vir com CRLF, e as âncoras (aqui e nas libs) são com \n.
    let t = fs.readFileSync(MOLDE, 'utf8').replace(/\r\n/g, '\n');
    // O molde traz o cartão da folha dele; o gera-folha-aula.mjs põe o desta aula.
    t = t.replace(/<script src="folha-da-aula\.js[^>]*><\/script>\n?/, '');
    // O botão de tela cheia da aula (tela-cheia.js) é só do GPS Tronic e do Agro (pedido do Luis).
    t = t.replace(/<script src="tela-cheia\.js[^>]*><\/script>\n?/, '');

    // 1. SEO
    t = trocar(t, 'Walk Me Through It — suporte por telefone em inglês — Aula 9 GPS Tronic', c.seo.titulo, 'o título SEO');
    t = trocar(t, 'Guie o cliente por telefone em inglês: imperativo, passo a passo e vocabulário de suporte remoto. Aula 9 do curso GPS Tronic da Capy English, com diálogo em áudio.', c.seo.descricao, 'a descrição SEO');
    t = t.split('https://www.capyenglish.com.br/gpstronic_aula_09.html').join(`https://www.capyenglish.com.br/intermediate_aula_${nn}.html`);

    // 2. Hero
    t = entre(t, '  <div class="absolute inset-0 pointer-events-none select-none">', '  <div class="relative max-w-5xl mx-auto px-6 py-12">', blocoHero(c));
    t = trocar(t, 'Lesson 09 · Curso exclusivo', c.hero.badge, 'o selo do hero');
    t = entre(t, '<h1 class="text-4xl md:text-5xl font-black mb-2 leading-tight">', '</h1>',
        `<h1 class="text-4xl md:text-5xl font-black mb-2 leading-tight">${c.hero.emoji} ${c.hero.titulo1}<br><span class="text-emerald-300">${c.hero.titulo2}</span>`);
    t = entre(t, '<p class="text-white/60 text-base mb-5 max-w-lg">', '</p>',
        `<p class="text-white/60 text-base mb-5 max-w-lg">${c.hero.sub}`);
    t = entre(t, '<div class="flex flex-wrap gap-2 mb-6">', '    </div>',
        '<div class="flex flex-wrap gap-2 mb-6">\n' + c.hero.tags.map(x =>
            `      <span class="bg-white/10 border border-white/20 rounded-full px-3 py-1 text-sm font-bold">${x}</span>`).join('\n') + '\n');

    // 3. Seções com conteúdo
    t = entre(t, '<div id="tab-dialogue" class="tab-content fade-in">', '<!-- VOCAB', blocoDialogo(c, d));
    t = entre(t, '<div id="tab-grammar" class="tab-content fade-in hidden">', '<!-- CONVERSATION',
        blocoGramaticaSlides(c, { slug, raiz: RAIZ }));
    t = trocar(t, 'Frases prontas de quem atende no telefone. Clique para ver o uso.', c.expressoesSub, 'o subtítulo das Expressions');
    t = trocar(t, '<!-- CONVERSATION', SECAO_TRADUCAO + '<!-- CONVERSATION', 'a âncora da Conversation');
    t = trocar(t, '<!-- SPEAK', SECAO_LACUNAS + '<!-- SPEAK', 'a âncora do Speak');
    t = trocar(t, "  {id:'grammar',     rotulo:'🧩 Patterns'},\n", "  {id:'grammar',     rotulo:'🧩 Patterns'},\n  {id:'traducao',    rotulo:'🇧🇷 How do you say it?'},\n", 'o Patterns na ROTA');
    t = trocar(t, "  {id:'practice',    rotulo:'✏️ Practice'},\n", "  {id:'practice',    rotulo:'✏️ Practice'},\n  {id:'lacunas',     rotulo:'🔤 Complete the text'},\n", 'o Practice na ROTA');

    // 4. Homework
    t = trocar(t, 'Lesson 09 — Walk Me Through It', `Lesson ${nn} — ${d.titulo}`, 'o cabeçalho do homework');
    t = entre(t, '      <p class="text-xs font-black text-red-700 mb-1">❌ Frase com erro:</p>', '      <input id=',
        `      <p class="text-xs font-black text-red-700 mb-1">❌ Corrija:</p>\n      <p class="text-sm font-bold text-navy mb-2">${c.homework.erro.enunciado}</p>\n`);

    // 5. Arrays
    t = trocarArray(t, 'DIALOGO', d.linhas.map((l, i) => '  ' + j({
        who: l.who, en: l.en, pt: l.pt, extra: !!l.extra,
        mp3: `/assets/audio/${slug}/s${String(i + 1).padStart(2, '0')}.mp3`,
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

    // 6b. Homework de 8 tarefas e card para o teacher; 6c. 🎯 Prepare no começo da rota.
    t = aplicarHomework(t, { c, d, n, pagina: `intermediate_aula_${nn}`, raiz: RAIZ, curso: 'Intermediate', cor: '#e11d48' });
    t = aplicarPreparacao(t, { c });

    // 6d. Fim do curso (aula 20): o cartão da revisão e da prova final, no fim do Homework.
    if (c.homeworkExtra) {
        const fimHw = '<!-- HOMEWORK -->';
        const iHw = t.indexOf(fimHw);
        const iProx = t.indexOf('\n</div>', t.indexOf('<div id="tab-homework"', iHw));
        if (iHw < 0 || iProx < 0) throw new Error('não achei o fim do Homework');
        t = t.slice(0, iProx) + '\n' + c.homeworkExtra + t.slice(iProx);
    }

    // 6e. Dados das seções novas, lidos pelo aula-molde.js (const de script clássico).
    t = trocar(t, '<script src="aula-molde.js',
        `<script>const TRAD_DATA=${jsonNoScript(c.traducao)};const LACUNAS_DATA=${jsonNoScript(c.lacunas)};</script>\n<script src="aula-molde.js`, 'a tag do aula-molde.js');

    // 7. Curso Intermediate: hub, chave de conclusão e rótulo próprios.
    t = t.split('classes_gpstronic.html').join('classes_intermediate.html');
    t = t.split('← GPS Tronic Course').join('← Intermediate Course');
    t = t.split('capyGpstronicCompleted').join('capyIntermediateCompleted');
    t = t.replace(/arr\.includes\(9\)/, `arr.includes(${n})`).replace(/arr\.push\(9\)/, `arr.push(${n})`);

    // 8. Personagens do diálogo
    t = t.split("'🐾 Yara (GPS Tronic)'").join(j(c.personagens.yara));
    t = t.split("'🙋 Marcos'").join(j(c.personagens.client));

    // 9. Widget
    t = t.replace(/window\.YARA_WIDGET=\{[^}]*\}/,
        `window.YARA_WIDGET={lang:'en',lessonTitle:${j(d.titulo)},lessonNum:${n},course:'intermediate'}`);

    // 10. Identificadores (as chaves com "09" primeiro).
    t = t.split('/assets/audio/gps09/').join(`/assets/audio/${slug}/`);
    t = t.split('capyGps09Done').join(`capyIntermediate${nn}Done`);
    t = t.split('capyGps09Passo').join(`capyIntermediate${nn}Passo`);
    t = t.split('Gps9').join('Int' + n);
    t = t.split('GPS9').join('INT' + n);
    t = t.split('gps9').join(c.sufixo);
    t = t.split("rotulo:'📐 Grammar'").join("rotulo:'🧩 Patterns'");
    if (!c.vocab.some(v => v.verb)) t = t.split("rotulo:'📚 Vocab + Verbos'").join("rotulo:'📚 Vocabulário'");

    // 11. Paleta do curso
    t = repintar(t);

    const destino = path.join(RAIZ, `intermediate_aula_${nn}.html`);
    fs.writeFileSync(destino, t, 'utf8');
    return { destino, t, d, c, n, nn, slug };
}

function validar({ t, d, c, n, nn, slug }) {
    const p = [];
    const ok = (cond, msg) => p.push({ ok: !!cond, msg });
    ok(!/gps9|Gps9|GPS9|gps09|gpstronic|Gpstronic|GPS Tronic/.test(t), 'sem resíduo do curso GPS Tronic');
    ok(!/\bemerald-|\bgreen-/.test(t), 'paleta rose/orange (sem emerald/green)');
    ok(t.includes('capyIntermediateCompleted') && t.includes(`arr.push(${n})`), `grava capyIntermediateCompleted com push(${n})`);
    ok(!/Ã[©¡ªµ§]|â€/.test(t), 'zero mojibake');
    ok((t.match(/id="tab-/g) || []).length === 11, '11 seções tab-* (Prepare + 8 do molde + tradução + lacunas)');
    ok(/\{id:'traducao'/.test(t) && /\{id:'lacunas'/.test(t), 'tradução e lacunas na ROTA');
    ok(t.includes(`/assets/audio/${slug}/s20.mp3`), 'áudio da 20ª fala apontado');
    ok(c.vocab.length === 14 && c.vocab.every(v => v.ex), '14 palavras, todas com exemplo');
    ok(c.vocab.every(v => !v.verb || v.forms), 'todo verbo tem as formas');
    ok(c.expressoes.length === 6 && c.expressoes.every(e => e.expr && e.pt && e.usage && e.example), '6 expressões completas (slides)');
    ok(c.quiz.every(q => q.opts.includes(q.a) && new Set(q.opts).size === q.opts.length), 'quiz: resposta entre as opções, sem repetição');
    ok(d.linhas.filter(x => !x.extra).length === 12 && d.linhas.filter(x => x.extra).length === 8, '12 falas curtas + 8 extras');
    const longas = d.linhas.filter(l => palavras(l.en) > TETO_FALA);
    ok(longas.length === 0, `falas com até ${TETO_FALA} palavras${longas.length ? ` ("${longas[0].en}")` : ''}`);
    const speakLongas = c.speak.filter(s => palavras(s) > TETO_SPEAK);
    ok(c.speak.length === 8 && speakLongas.length === 0, `8 frases de Speak com até ${TETO_SPEAK} palavras`);
    // Padrão de 12/nov: tradução e texto com lacunas.
    const tr = c.traducao || [];
    ok(tr.length === 6 && tr.every(x => x.pt && x.en && !/</.test(x.pt + x.en)), '6 frases de "How do you say it in English?" (pt + en, sem HTML)');
    const lac = c.lacunas || {};
    const pecas = [...String(lac.texto || '').matchAll(/\[\[([^\]]+)\]\]/g)].map(m => m[1]);
    ok(pecas.length >= 6 && pecas.length <= 8, `texto com 6 a 8 lacunas (${pecas.length})`);
    ok(Array.isArray(lac.extras) && lac.extras.length === 2 && lac.extras.every(x => !pecas.includes(x)), '2 pedaços de distração que não são respostas');
    ok(palavras(String(lac.texto || '').replace(/\[\[|\]\]/g, '')) >= 60, 'texto com 60 palavras ou mais');
    ok(t.includes('id="trad-area"') && t.includes('id="lacunas-area"') && (t.match(/aula-molde\.js\?v=/g) || []).length === 1, 'seções novas ligadas ao aula-molde.js');
    const visivel = t.replace(/<!--[\s\S]*?-->/g, '').replace(/tab-grammar|'grammar'|"grammar"|assets\/img\/gramatica\/|gramatica-slides\.js/g, '');
    ok(!/gram[aá]tic|grammar/i.test(visivel), 'sem a palavra proibida gramática/grammar');
    ok(t.includes('id="dialogue-lines"') && t.includes('id="speak-grid"') && t.includes('id="expr-grid"'), 'contrato de DOM (listening-lab, slides de expressões)');
    if (!fs.existsSync(path.join(RAIZ, d.imagem.arquivo))) console.log(`    ⚠ imagem do diálogo ainda não existe: ${d.imagem.arquivo}`);
    checarSlides(c, ok, { teto: TETO_FALA, slug, raiz: RAIZ });
    checarHomework(c, t, ok);
    checarPreparacao(c, t, ok);

    let scripts = 0, quebrados = 0;
    for (const m of t.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)) {
        scripts++;
        try { new Function(m[1]); } catch (e) { quebrados++; console.log('    script quebrado: ' + e.message.slice(0, 90)); }
    }
    ok(quebrados === 0, `${scripts} scripts inline compilam`);
    return p;
}

const alvos = process.argv.slice(2).filter(a => /^\d+$/.test(a)).map(Number);
if (!alvos.length) { console.log('uso: node scripts/build-intermediate-aula.mjs 19 20'); process.exit(1); }
let falhas = 0;
for (const n of alvos) {
    const r = construir(n);
    console.log(`\n── intermediate_aula_${r.nn}.html  (${(r.t.length / 1024).toFixed(0)}KB) ──`);
    for (const { ok, msg } of validar(r)) { console.log(`  ${ok ? '✓' : '✗'} ${msg}`); if (!ok) falhas++; }
}
console.log(falhas ? `\n${falhas} verificação(ões) falharam` : '\ntudo passou');
process.exitCode = falhas ? 1 : 0;
