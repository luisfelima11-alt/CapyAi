/**
 * gramatica-slides.mjs — a aba Grammar das aulas dos cursos em slides de exemplos.
 *
 * O método do Luis (05/out/2026): a gramática passa "entre aspas", por exemplos,
 * exemplos e exemplos. Um padrão por slide, 5 frases ou mais, cada uma com a
 * tradução e o botão de ouvir. O título do slide é só o padrão: sem regra escrita
 * e sem frase errada. O deck abre com a lista dos padrões e fecha com uma revisão
 * (uma frase nova de cada padrão), onde o +20 XP da seção se libera.
 *
 * Usado pelos 4 geradores (scripts/build-*-aula.mjs). No JSON da aula:
 *
 *   "gramatica": {
 *     "titulo": "Grammar: o verbo TO BE",
 *     "slides": [ { "padrao": "I **am** · you **are** · he **is**",
 *                   "frases": [ { "en": "I **am** Luan.", "pt": "Eu sou o Luan." }, ... ] } ],
 *     "revisao": [ { "padrao": 0, "en": "Jack **is** from Iowa.", "pt": "O Jack é de Iowa." } ]
 *   }
 *
 * O trecho entre ** ** sai em destaque; o áudio lê a frase sem os asteriscos.
 * O HTML é estático (o contexto da aula guiada não muda) e o script do deck vai
 * dentro da própria aba, então o molde gpstronic_aula_09.html não precisa mudar.
 */

export const MIN_FRASES = 5;

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

function linhaFrase(f, selo) {
    const texto = puro(f.en);
    return `
        <li class="flex items-start gap-3 rounded-2xl bg-slate-50 px-3 py-3 sm:px-4">
          <button type="button" class="gs-ouvir flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-700 flex items-center justify-center transition-all active:scale-95" data-say="${esc(texto)}" aria-label="Ouvir: ${esc(texto)}">${ICONE_OUVIR}</button>
          <div class="min-w-0">${selo ? `<span class="inline-block mb-1 text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 rounded-full px-2 py-0.5">${selo}</span>` : ''}
            <p class="text-navy font-bold text-base sm:text-lg leading-snug">${destaque(f.en, 'text-emerald-600')}</p>
            <p class="text-slate-500 text-sm mt-0.5">${esc(f.pt)}</p>
          </div>
        </li>`;
}

function slide(i, total, cabecalho, corpo) {
    return `
    <section class="gs-slide rounded-3xl bg-white border-2 border-emerald-100 overflow-hidden" data-i="${i}" aria-label="Slide ${i + 1} de ${total}"${i ? ' hidden' : ''}>
      <div class="bg-navy text-white px-5 py-4 sm:px-6">${cabecalho}</div>
      ${corpo}
    </section>`;
}

/** A aba #tab-grammar inteira, do <div> de abertura até antes do <!-- CONVERSATION. */
export function blocoGramaticaSlides(c) {
    const g = c.gramatica;
    const padroes = g.slides;
    const total = padroes.length + 2;
    const nFrases = padroes.reduce((n, p) => n + p.frases.length, 0) + g.revisao.length;

    const abertura = slide(0, total,
        `<p class="text-[11px] font-black uppercase tracking-widest text-emerald-300">Nesta aula</p>
        <h3 class="text-xl sm:text-2xl font-black leading-snug">${esc(semPrefixo(g.titulo))}</h3>`,
        `<ol class="p-4 sm:p-6 space-y-2">${padroes.map((p, i) => `
        <li class="flex items-center gap-3"><span class="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-500 text-white font-black text-sm flex items-center justify-center">${i + 1}</span><span class="font-black text-navy">${destaque(p.padrao, 'text-emerald-600')}</span></li>`).join('')}
      </ol>
      <p class="px-4 pb-5 sm:px-6 text-slate-500 text-sm">${nFrases} exemplos. Ouça cada frase e repare na parte em destaque.</p>`);

    const doPadrao = padroes.map((p, i) => slide(i + 1, total,
        `<p class="text-[11px] font-black uppercase tracking-widest text-emerald-300">Padrão ${i + 1} de ${padroes.length}</p>
        <h3 class="text-xl sm:text-2xl font-black leading-snug">${destaque(p.padrao, 'text-emerald-300')}</h3>`,
        `<ul class="p-3 sm:p-4 space-y-2">${p.frases.map(f => linhaFrase(f)).join('')}
      </ul>`)).join('');

    const revisao = slide(total - 1, total,
        `<p class="text-[11px] font-black uppercase tracking-widest text-emerald-300">Revisão</p>
        <h3 class="text-xl sm:text-2xl font-black leading-snug">Uma frase nova de cada padrão</h3>`,
        `<ul class="p-3 sm:p-4 space-y-2">${g.revisao.map(f => linhaFrase(f, `Padrão ${f.padrao + 1}`)).join('')}
      </ul>`);

    const bolinhas = Array.from({ length: total }, (_, i) =>
        `<button type="button" class="gs-dot w-2.5 h-2.5 rounded-full ${i ? 'bg-slate-200' : 'bg-emerald-500'}" aria-label="Ir para o slide ${i + 1}" aria-current="${i ? 'false' : 'true'}"></button>`).join('');

    return `<div id="tab-grammar" class="tab-content fade-in hidden">
  <h2 class="text-2xl font-black text-navy mb-1">${esc(g.titulo)}</h2>
  <p class="text-slate-500 text-sm mb-5">${total} slides com ${nFrases} exemplos. Passe com as setas, deslizando ou pelos botões.</p>
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
<script>
(function(){
  var deck=document.getElementById('gs-deck');if(!deck)return;
  var slides=deck.querySelectorAll('.gs-slide'),dots=deck.querySelectorAll('.gs-dot');
  var pos=document.getElementById('gs-pos'),ant=document.getElementById('gs-ant'),prox=document.getElementById('gs-prox'),xp=document.getElementById('gs-xp');
  var atual=0,ultimo=slides.length-1;
  function ir(i){
    i=Math.max(0,Math.min(ultimo,i));atual=i;
    for(var k=0;k<slides.length;k++)slides[k].hidden=(k!==i);
    for(var d=0;d<dots.length;d++){dots[d].setAttribute('aria-current',d===i?'true':'false');dots[d].className='gs-dot w-2.5 h-2.5 rounded-full '+(d===i?'bg-emerald-500':'bg-slate-200');}
    pos.textContent='Slide '+(i+1)+' de '+slides.length;
    ant.disabled=(i===0);prox.disabled=(i===ultimo);
    if(i===ultimo&&xp&&xp.disabled&&!xp.dataset.liberado){xp.dataset.liberado='1';xp.disabled=false;xp.textContent='✓ Vi todos os exemplos! (+20 XP)';}
  }
  ant.addEventListener('click',function(){ir(atual-1);});
  prox.addEventListener('click',function(){ir(atual+1);});
  for(var d=0;d<dots.length;d++)(function(k){dots[k].addEventListener('click',function(){ir(k);});})(d);
  deck.addEventListener('click',function(e){var b=e.target.closest('[data-say]');if(b&&typeof window.speak==='function')window.speak(b.getAttribute('data-say'));});
  var x0=null,y0=null;
  deck.addEventListener('touchstart',function(e){var t=e.changedTouches[0];x0=t.clientX;y0=t.clientY;},{passive:true});
  deck.addEventListener('touchend',function(e){if(x0===null)return;var t=e.changedTouches[0],dx=t.clientX-x0,dy=t.clientY-y0;x0=null;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.5)ir(atual+(dx<0?1:-1));},{passive:true});
  document.addEventListener('keydown',function(e){
    if(e.defaultPrevented||e.altKey||e.ctrlKey||e.metaKey)return;
    var aba=document.getElementById('tab-grammar');if(!aba||aba.classList.contains('hidden'))return;
    var alvo=e.target;if(alvo&&/^(INPUT|TEXTAREA|SELECT)$/.test(alvo.tagName))return;
    if(e.key==='ArrowRight'){e.preventDefault();ir(atual+1);}else if(e.key==='ArrowLeft'){e.preventDefault();ir(atual-1);}
  });
  ir(0);
})();
</script>
</div>

`;
}

/**
 * Confere o deck. `ok(cond, msg)` é o mesmo do validar() de cada gerador.
 * teto: máximo de palavras por frase (o Agro usa o tetoPalavras da aula, A0).
 */
export function checarSlides(c, ok, { teto = 14 } = {}) {
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
}

export const _internos = { esc, destaque, puro, palavras, semPrefixo };
