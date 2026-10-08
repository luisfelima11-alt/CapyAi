/**
 * gramatica-slides.mjs — a aba Grammar das aulas dos cursos em slides de exemplos.
 *
 * O método do Luis (05/out/2026): a gramática passa "entre aspas", por exemplos,
 * exemplos e exemplos. Um padrão por slide, 5 frases ou mais, cada uma com a
 * tradução e o botão de ouvir. O título do slide é só o padrão: sem regra escrita
 * e sem frase errada. O deck abre com a lista dos padrões e fecha com uma revisão
 * (uma frase nova de cada padrão), onde o +20 XP da seção se libera. Cada slide
 * tem uma imagem gerada e abre em tela cheia ao clicar, como o vocabulário.
 *
 * Usado pelos 4 geradores (scripts/build-*-aula.mjs). No JSON da aula:
 *
 *   "gramatica": {
 *     "titulo": "Grammar: o verbo TO BE",
 *     "personagens": { "LUAN": "a young Brazilian man (early twenties, ...)" },
 *     "cenaAbertura": "Wide view inside a small workshop ... {LUAN} ...",
 *     "slides": [ { "padrao": "I **am** · you **are** · he **is**",
 *                   "cena": "{LUAN} places one hand on his chest ...",
 *                   "frases": [ { "en": "I **am** Luan.", "pt": "Eu sou o Luan." }, ... ] } ],
 *     "revisao": [ { "padrao": 0, "en": "Jack **is** from Iowa.", "pt": "O Jack é de Iowa." } ],
 *     "cenaRevisao": "Late afternoon on a farm ..."
 *   }
 *
 * O trecho entre ** ** sai em destaque; o áudio lê a frase sem os asteriscos.
 * O HTML é estático (o contexto da aula guiada não muda). O comportamento (setas,
 * áudio, XP e a tela cheia) fica em gramatica-slides.js, na raiz: corrigir lá
 * vale para todas as aulas sem regerar nenhuma.
 */

import fs from 'node:fs';
import path from 'node:path';

export const MIN_FRASES = 5;

/** A versão do gramatica-slides.js na tag <script>. Mudou o arquivo, muda aqui e regera as aulas. */
export const VERSAO_JS = 'gs1';

// ── Imagens dos slides ────────────────────────────────────────────────────
// Uma imagem por slide (pedido do Luis, 05/out/2026), gerada na Higgsfield com o
// Z Image em 4:3, o modelo mais barato. O estilo é o mesmo das imagens do
// diálogo (scripts/*-dialogo.json). Cada slide tem a sua "cena" no JSON, e os
// personagens da aula são descritos uma vez só em gramatica.personagens: a cena
// escreve {LUAN} e o prompt leva a descrição inteira, para ele sair parecido em
// todas as imagens (o Z Image não aceita imagem de referência).
// O passo a passo está em scripts/gramatica-imagens.mjs.
export const ESTILO_IMAGEM = {
    antes: 'Warm, friendly 2D vector illustration, flat modern style with soft shading.',
    depois: 'Limited palette of emerald green, warm amber and deep navy. Clean shapes, soft shadows. No text, no letters, no words, no numbers anywhere in the image.',
};
export const PASTA_IMAGENS = 'assets/img/gramatica';
export const MAX_KB_IMAGEM = 200;

/** O arquivo da imagem do slide k (0 = abertura, o último = revisão). */
export const imagemDoSlide = (slug, k) => `${PASTA_IMAGENS}/${slug}-${k}.webp`;

/** As cenas na ordem dos slides: abertura, uma por padrão, revisão. */
export const cenasDoDeck = g => [g.cenaAbertura, ...(g.slides || []).map(p => p.cena), g.cenaRevisao];

/** Troca {NOME} pela descrição do personagem. */
export const resolverCena = (cena, personagens = {}) =>
    String(cena || '').replace(/\{([A-Z][A-Z0-9_]*)\}/g, (m, nome) => (Object.hasOwn(personagens, nome) ? personagens[nome] : m));

/** O prompt que vai para a Higgsfield (a cena começa com {NOME}, então a frase volta com maiúscula). */
export const promptDaImagem = (g, cena) => {
    const texto = resolverCena(cena, g.personagens).replace(/(^|[.!?]\s+)([a-z])/g, (_, antes, letra) => antes + letra.toUpperCase());
    return `${ESTILO_IMAGEM.antes} ${texto} ${ESTILO_IMAGEM.depois}`;
};

// ── HTML ──────────────────────────────────────────────────────────────────
const esc = s => String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const destaque = (s, classe) => esc(s).replace(/\*\*(.+?)\*\*/g, `<strong class="${classe}">$1</strong>`);
const puro = s => String(s).replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();
const palavras = s => puro(s).split(/\s+/).filter(Boolean).length;
const semPrefixo = t => {
    const s = String(t).replace(/^\s*grammar\s*:\s*/i, '');
    return s.charAt(0).toUpperCase() + s.slice(1);
};

const ICONE_OUVIR = '<svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05A4.5 4.5 0 0 0 16.5 12zM14 3.23v2.06a7 7 0 0 1 0 13.42v2.06A9 9 0 0 0 14 3.23z"/></svg>';
const ICONE_TELA_CHEIA = '<svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M4 4h6v2H6v4H4V4zm10 0h6v6h-2V6h-4V4zM4 14h2v4h4v2H4v-6zm14 0h2v6h-6v-2h4v-4z"/></svg>';

function linhaFrase(f, selo) {
    const texto = puro(f.en);
    return `
            <li class="gs-item flex items-start gap-3 rounded-2xl bg-slate-50 px-3 py-3 sm:px-4">
              <button type="button" class="gs-ouvir flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-700 flex items-center justify-center transition-all active:scale-95" data-say="${esc(texto)}" aria-label="Ouvir: ${esc(texto)}">${ICONE_OUVIR}</button>
              <div class="min-w-0">${selo ? `<span class="gs-selo inline-block mb-1 text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 rounded-full px-2 py-0.5">${selo}</span>` : ''}
                <p class="gs-en text-navy font-bold text-base sm:text-lg leading-snug">${destaque(f.en, 'text-emerald-600')}</p>
                <p class="gs-pt text-slate-500 text-sm mt-0.5">${esc(f.pt)}</p>
              </div>
            </li>`;
}

// No celular a imagem fica em cima; do sm para cima, numa coluna à esquerda.
// As classes gs-* são os ganchos que a tela cheia (gramatica-slides.js) usa
// para aumentar o mesmo slide.
function slide(i, total, imagem, rotulo, titulo, corpo) {
    return `
    <section class="gs-slide rounded-3xl bg-white border-2 border-emerald-100 overflow-hidden cursor-zoom-in" data-i="${i}" aria-label="Slide ${i + 1} de ${total}"${i ? ' hidden' : ''}>
      <div class="gs-cab bg-navy text-white px-5 py-4 sm:px-6 flex items-start justify-between gap-3">
        <div class="min-w-0">
          <p class="gs-rotulo text-[11px] font-black uppercase tracking-widest text-emerald-300">${rotulo}</p>
          <h3 class="gs-titulo text-xl sm:text-2xl font-black leading-snug">${titulo}</h3>
        </div>
        <button type="button" class="gs-expandir flex-shrink-0 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-all active:scale-95" aria-label="Ver o slide ${i + 1} em tela cheia" title="Tela cheia">${ICONE_TELA_CHEIA}</button>
      </div>
      <div class="gs-corpo p-3 sm:p-4 sm:grid sm:grid-cols-5 sm:gap-4 sm:items-start">
        <img class="gs-img block w-full h-auto rounded-2xl bg-emerald-50 sm:col-span-2" src="${esc(imagem)}" alt="" width="1024" height="768" loading="lazy" decoding="async">
        <div class="gs-texto mt-3 sm:mt-0 sm:col-span-3">${corpo}
        </div>
      </div>
    </section>`;
}

/**
 * A aba #tab-grammar inteira, do <div> de abertura até antes do <!-- CONVERSATION.
 * slug: o nome da aula nas imagens (gps14, agro01, med05, interview03).
 */
export function blocoGramaticaSlides(c, { slug } = {}) {
    if (!slug) throw new Error('blocoGramaticaSlides: falta o slug da aula (ex.: agro01), que dá o nome das imagens');
    const g = c.gramatica;
    const padroes = g.slides;
    const total = padroes.length + 2;
    const nFrases = padroes.reduce((n, p) => n + p.frases.length, 0) + g.revisao.length;
    const img = k => imagemDoSlide(slug, k);

    const abertura = slide(0, total, img(0), 'Nesta aula', esc(semPrefixo(g.titulo)),
        `
          <ol class="gs-lista space-y-2">${padroes.map((p, i) => `
            <li class="flex items-center gap-3"><span class="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-500 text-white font-black text-sm flex items-center justify-center">${i + 1}</span><span class="gs-en font-black text-navy">${destaque(p.padrao, 'text-emerald-600')}</span></li>`).join('')}
          </ol>
          <p class="gs-nota mt-4 text-slate-500 text-sm">${nFrases} exemplos. Ouça cada frase e repare na parte em destaque.</p>`);

    const doPadrao = padroes.map((p, i) => slide(i + 1, total, img(i + 1), `Padrão ${i + 1} de ${padroes.length}`,
        destaque(p.padrao, 'text-emerald-300'),
        `
          <ul class="gs-lista space-y-2">${p.frases.map(f => linhaFrase(f)).join('')}
          </ul>`)).join('');

    const revisao = slide(total - 1, total, img(total - 1), 'Revisão', 'Uma frase nova de cada padrão',
        `
          <ul class="gs-lista space-y-2">${g.revisao.map(f => linhaFrase(f, `Padrão ${f.padrao + 1}`)).join('')}
          </ul>`);

    const bolinhas = Array.from({ length: total }, (_, i) =>
        `<button type="button" class="gs-dot w-2.5 h-2.5 rounded-full ${i ? 'bg-slate-200' : 'bg-emerald-500'}" aria-label="Ir para o slide ${i + 1}" aria-current="${i ? 'false' : 'true'}"></button>`).join('');

    return `<div id="tab-grammar" class="tab-content fade-in hidden">
  <h2 class="text-2xl font-black text-navy mb-1">${esc(g.titulo)}</h2>
  <p class="text-slate-500 text-sm mb-5">${total} slides com ${nFrases} exemplos. Toque no slide para ver em tela cheia; passe com as setas, deslizando ou pelos botões.</p>
  <div id="gs-deck" role="region" aria-roledescription="carrossel" aria-label="Slides da gramática">
    <div class="flex items-center justify-between gap-3 mb-3">
      <span id="gs-pos" class="text-xs font-black text-slate-400" style="font-variant-numeric:tabular-nums" aria-live="polite">Slide 1 de ${total}</span>
      <div class="flex flex-wrap gap-1.5">${bolinhas}</div>
    </div>${abertura}${doPadrao}${revisao}
    <div class="flex items-center gap-3 mt-4">
      <button type="button" id="gs-ant" class="flex-shrink-0 inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-navy font-black px-5 py-3 rounded-2xl transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed" disabled>← Anterior</button>
      <button type="button" id="gs-prox" class="flex-1 inline-flex items-center justify-center gap-1 bg-navy hover:opacity-90 text-white font-black px-5 py-3 rounded-2xl transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed">Próximo →</button>
    </div>
  </div>
  <button type="button" id="gs-xp" onclick="markSectionBtn(this,'grammar')" class="mt-5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black px-6 py-3 rounded-2xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100" disabled>
    Veja os ${total} slides para ganhar +20 XP
  </button>
  <div class="mt-6 pt-6 border-t border-slate-100"><button type="button" onclick="proximoPasso()" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-navy text-white font-black px-7 py-3.5 rounded-2xl hover:opacity-90 transition-opacity">Continuar <span class="material-symbols-outlined text-lg">arrow_forward</span></button></div>
<script src="gramatica-slides.js?v=${VERSAO_JS}"></script>
</div>

`;
}

/**
 * Confere o deck. `ok(cond, msg)` é o mesmo do validar() de cada gerador.
 * teto: máximo de palavras por frase (o Agro usa o tetoPalavras da aula, A0).
 * slug + raiz: confere também se a imagem de cada slide existe e cabe no teto.
 */
export function checarSlides(c, ok, { teto = 14, slug, raiz } = {}) {
    const g = c.gramatica || {};
    const temSlides = Array.isArray(g.slides) && g.slides.length > 0;
    ok(temSlides, 'gramática em slides (padrão desde 05/10/2026)');
    if (!temSlides) return;
    ok(g.slides.length >= 3, `pelo menos 3 padrões (${g.slides.length}), para o deck ter 5 slides ou mais`);
    const curtos = g.slides.filter(p => !Array.isArray(p.frases) || p.frases.length < MIN_FRASES);
    ok(curtos.length === 0, `${MIN_FRASES} frases ou mais em cada padrão${curtos.length ? ` (faltam em: ${curtos.map(p => puro(p.padrao)).join('; ')})` : ''}`);
    const todas = g.slides.flatMap(p => p.frases || []).concat(g.revisao || []);
    ok(todas.every(f => f && String(f.en || '').trim() && String(f.pt || '').trim()), 'toda frase tem inglês e tradução');
    const semDestaque = todas.filter(f => !/\*\*.+?\*\*/.test(String(f.en || '')));
    ok(semDestaque.length === 0, `toda frase destaca a parte do padrão com **…**${semDestaque.length ? ` (sem destaque: "${puro(semDestaque[0].en)}")` : ''}`);
    const longas = todas.filter(f => palavras(f.en || '') > teto);
    ok(longas.length === 0, `frases com até ${teto} palavras${longas.length ? ` (${longas.length} passaram: "${puro(longas[0].en)}")` : ''}`);
    ok(g.slides.every(p => !/[❌✅]/.test(p.padrao) && puro(p.padrao).length <= 60), 'título do slide é só o padrão (curto, sem ✅/❌)');
    const rev = Array.isArray(g.revisao) ? g.revisao : [];
    const cobertos = new Set(rev.map(f => f.padrao));
    ok(rev.length === g.slides.length && g.slides.every((_, i) => cobertos.has(i)), `revisão com uma frase de cada padrão (${rev.length}/${g.slides.length})`);
    const vistas = new Set(g.slides.flatMap(p => (p.frases || []).map(f => puro(f.en).toLowerCase())));
    ok(rev.every(f => !vistas.has(puro(f.en).toLowerCase())), 'a revisão traz frases novas, que não estão nos slides');
    ok(!('blocos' in g) && !('tabela' in g), 'sem o acordeão antigo (blocos/tabela) no JSON');

    // Imagens: uma cena por slide, personagens conhecidos e o arquivo no lugar.
    const cenas = cenasDoDeck(g);
    const semCena = cenas.map((cena, k) => (String(cena || '').trim() ? -1 : k)).filter(k => k >= 0);
    ok(semCena.length === 0, `todo slide tem a cena da imagem (cenaAbertura, slides[].cena, cenaRevisao)${semCena.length ? ` (faltam nos slides ${semCena.join(', ')})` : ''}`);
    const soltos = [...new Set(cenas.flatMap(cena => resolverCena(cena, g.personagens || {}).match(/\{[A-Z][A-Z0-9_]*\}/g) || []))];
    ok(soltos.length === 0, `todo {PERSONAGEM} das cenas está em gramatica.personagens${soltos.length ? ` (${soltos.join(', ')})` : ''}`);
    if (slug && raiz) {
        const faltando = [], pesadas = [];
        cenas.forEach((_, k) => {
            const rel = imagemDoSlide(slug, k);
            const abs = path.join(raiz, rel);
            if (!fs.existsSync(abs)) faltando.push(rel);
            else if (fs.statSync(abs).size > MAX_KB_IMAGEM * 1024) pesadas.push(rel);
        });
        ok(faltando.length === 0, `a imagem de cada slide existe (node scripts/gramatica-imagens.mjs --lista ${slug})${faltando.length ? ` (faltam: ${faltando.join(', ')})` : ''}`);
        ok(pesadas.length === 0, `imagens com até ${MAX_KB_IMAGEM} KB${pesadas.length ? ` (${pesadas.join(', ')})` : ''}`);
    }
}

export const _internos = { esc, destaque, puro, palavras, semPrefixo };
