/* ══════════════════════════════════════════════════════════════════════════
   gramatica-slides.js — os slides da aba Grammar das aulas dos cursos.

   O HTML do deck sai pronto do gerador (scripts/lib/gramatica-slides.mjs):
   um <section class="gs-slide"> por slide, com imagem, padrão e frases.
   Aqui fica o comportamento:
   - na página: setas, bolinhas, deslizar, teclado ← →, o 🔊 de cada frase e
     o +20 XP, que só se libera ao chegar no último slide;
   - a tela cheia, igual à do vocabulário (vocab-focus.js): clicar no slide
     abre o mesmo slide ocupando a tela, para a turma ler de longe quando o
     professor compartilha a tela. ‹ › ✕, Esc/←/→ e deslizar. A tradução
     fica escondida até "Ver tradução" (ou espaço/Enter), e volta a esconder
     ao trocar de slide: a turma tenta entender o inglês primeiro.

   Navegar na tela cheia move o deck da página junto, então quem chega ao
   último slide lá também libera o XP. A tela cheia é um clone do slide, para
   o HTML ter uma fonte só.
   ══════════════════════════════════════════════════════════════════════════ */
(function () {
    'use strict';

    const deck = document.getElementById('gs-deck');
    if (!deck || deck.dataset.gsPronto) return;
    deck.dataset.gsPronto = '1';

    const slides = Array.from(deck.querySelectorAll('.gs-slide'));
    if (!slides.length) return;
    const dots = Array.from(deck.querySelectorAll('.gs-dot'));
    const pos = document.getElementById('gs-pos');
    const ant = document.getElementById('gs-ant');
    const prox = document.getElementById('gs-prox');
    const xp = document.getElementById('gs-xp');
    const ultimo = slides.length - 1;
    let atual = 0;

    // tela cheia
    let overlay = null, palco = null, revelar = null, contador = null, voltar = null, avancar = null;
    let abertoEm = 0;        // para ignorar o clique fantasma do celular
    let revelado = false;
    let origem = null;       // quem abriu, para devolver o foco

    function falar(texto) {
        if (texto && typeof window.speak === 'function') window.speak(texto);
    }

    // A imagem é lazy e o slide escondido não carrega: puxamos a do próximo
    // antes, para ela já estar lá quando a pessoa avançar.
    function preCarregar(i) {
        const img = slides[i] && slides[i].querySelector('img.gs-img');
        if (img && !img.complete) { const p = new Image(); p.src = img.src; }
    }

    function aberto() { return !!overlay && overlay.classList.contains('gs-aberto'); }

    function ir(i) {
        i = Math.max(0, Math.min(ultimo, i));
        atual = i;
        slides.forEach((s, k) => { s.hidden = k !== i; });
        dots.forEach((d, k) => {
            d.setAttribute('aria-current', k === i ? 'true' : 'false');
            d.className = 'gs-dot w-2.5 h-2.5 rounded-full ' + (k === i ? 'bg-emerald-500' : 'bg-slate-200');
        });
        if (pos) pos.textContent = 'Slide ' + (i + 1) + ' de ' + slides.length;
        if (ant) ant.disabled = i === 0;
        if (prox) prox.disabled = i === ultimo;
        if (i === ultimo && xp && xp.disabled && !xp.dataset.liberado) {
            xp.dataset.liberado = '1';
            xp.disabled = false;
            xp.textContent = '✓ Vi todos os exemplos! (+20 XP)';
        }
        preCarregar(i + 1);
        if (aberto()) pintar();
    }

    // ── Tela cheia ────────────────────────────────────────────────────────
    function criarOverlay() {
        const el = document.createElement('div');
        el.id = 'gs-foco';
        el.className = 'gs-foco';
        el.setAttribute('role', 'dialog');
        el.setAttribute('aria-modal', 'true');
        el.tabIndex = -1;
        el.innerHTML = `
      <button class="gs-foco-fechar" type="button" aria-label="Fechar a tela cheia">✕</button>
      <button class="gs-foco-nav gs-foco-prev" type="button" aria-label="Slide anterior">‹</button>
      <button class="gs-foco-nav gs-foco-next" type="button" aria-label="Próximo slide">›</button>
      <div class="gs-foco-palco"></div>
      <div class="gs-foco-rodape">
        <button class="gs-foco-revelar" type="button">👁️ Ver tradução</button>
        <span class="gs-foco-contador"></span>
      </div>`;
        document.body.appendChild(el);
        palco = el.querySelector('.gs-foco-palco');
        revelar = el.querySelector('.gs-foco-revelar');
        contador = el.querySelector('.gs-foco-contador');
        voltar = el.querySelector('.gs-foco-prev');
        avancar = el.querySelector('.gs-foco-next');

        el.querySelector('.gs-foco-fechar').addEventListener('click', fechar);
        voltar.addEventListener('click', e => { e.stopPropagation(); mover(-1); });
        avancar.addEventListener('click', e => { e.stopPropagation(); mover(1); });
        revelar.addEventListener('click', e => { e.stopPropagation(); alternarRevelar(); });
        // Fundo fecha, com carência: o overlay nasce embaixo do dedo e o mesmo
        // toque vira um clique ~300 ms depois no celular.
        el.addEventListener('click', ev => {
            if (ev.target !== el) return;
            if (Date.now() - abertoEm < 400) return;
            fechar();
        });
        // No slide: 🔊 fala; tocar no resto mostra/esconde a tradução.
        palco.addEventListener('click', ev => {
            const b = ev.target.closest('[data-say]');
            if (b) { ev.stopPropagation(); falar(b.getAttribute('data-say')); return; }
            if (ev.target.closest('button, a')) return;
            alternarRevelar();
        });
        let x0 = null, y0 = null;
        el.addEventListener('touchstart', e => { const t = e.changedTouches[0]; x0 = t.clientX; y0 = t.clientY; }, { passive: true });
        el.addEventListener('touchend', e => {
            if (x0 === null) return;
            const t = e.changedTouches[0], dx = t.clientX - x0, dy = t.clientY - y0;
            x0 = null;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) mover(dx < 0 ? 1 : -1);
        }, { passive: true });
        return el;
    }

    function pintar() {
        const c = slides[atual].cloneNode(true);
        c.hidden = false;
        c.removeAttribute('data-i');
        c.querySelectorAll('.gs-expandir').forEach(n => n.remove());
        c.querySelectorAll('img').forEach(img => { img.loading = 'eager'; if (!img.complete) img.addEventListener('load', ajustar, { once: true }); });
        palco.replaceChildren(c);
        const temTraducao = !!c.querySelector('.gs-pt');
        overlay.classList.toggle('gs-revelado', revelado);
        revelar.hidden = !temTraducao;
        revelar.textContent = revelado ? '🙈 Esconder tradução' : '👁️ Ver tradução';
        revelar.setAttribute('aria-pressed', revelado ? 'true' : 'false');
        contador.textContent = (atual + 1) + ' / ' + slides.length;
        voltar.style.visibility = atual === 0 ? 'hidden' : '';
        avancar.style.visibility = atual === ultimo ? 'hidden' : '';
        overlay.setAttribute('aria-label', 'Slide ' + (atual + 1) + ' de ' + slides.length + ' em tela cheia');
        palco.scrollTop = 0;
        ajustar();
    }

    // Projetado, o slide tem que caber inteiro: se as frases passam da tela,
    // a letra encolhe um pouco por vez (até 72%). No celular ela encolhe pouco
    // (até 90%, para continuar legível) e o que sobrar rola.
    function ajustar() {
        if (!aberto()) return;
        const piso = window.matchMedia('(max-width:760px),(orientation:portrait)').matches ? 0.9 : 0.72;
        let e = 1;
        palco.style.setProperty('--gs-e', '1');
        while (palco.scrollHeight > palco.clientHeight + 1 && e > piso) {
            e = Math.round((e - 0.04) * 100) / 100;
            palco.style.setProperty('--gs-e', String(e));
        }
    }
    window.addEventListener('resize', () => { if (aberto()) ajustar(); });

    function abrir(i, quem) {
        if (!overlay) overlay = criarOverlay();
        origem = quem || null;
        revelado = false;
        ir(i);
        pintar();
        abertoEm = Date.now();
        document.body.classList.add('gs-travado');
        overlay.classList.add('gs-aberto');
        // Foco no próprio diálogo (e não no ✕): assim espaço/Enter revelam a
        // tradução logo de cara; o Tab leva aos botões.
        overlay.focus({ preventScroll: true });
    }

    function fechar() {
        if (!aberto()) return;
        overlay.classList.remove('gs-aberto');
        document.body.classList.remove('gs-travado');
        palco.replaceChildren();
        const volta = slides[atual].querySelector('.gs-expandir') || origem;
        if (volta && typeof volta.focus === 'function') volta.focus({ preventScroll: true });
    }

    function mover(passo) {
        const destino = Math.max(0, Math.min(ultimo, atual + passo));
        if (destino === atual) return;
        revelado = false;
        ir(destino);
    }

    function alternarRevelar() {
        if (revelar.hidden) return;
        revelado = !revelado;
        pintar();
    }

    // ── Deck da página ────────────────────────────────────────────────────
    if (ant) ant.addEventListener('click', () => ir(atual - 1));
    if (prox) prox.addEventListener('click', () => ir(atual + 1));
    dots.forEach((d, k) => d.addEventListener('click', () => ir(k)));

    deck.addEventListener('click', ev => {
        const b = ev.target.closest('[data-say]');
        if (b) { falar(b.getAttribute('data-say')); return; }
        const s = ev.target.closest('.gs-slide');
        if (!s) return;
        const expandir = ev.target.closest('.gs-expandir');
        if (!expandir && ev.target.closest('button, a')) return;
        // Quem arrasta para selecionar um trecho não quer abrir a tela cheia.
        const sel = window.getSelection && window.getSelection();
        if (!expandir && sel && String(sel).trim()) return;
        abrir(slides.indexOf(s), expandir || s.querySelector('.gs-expandir'));
    });

    let x0 = null, y0 = null;
    deck.addEventListener('touchstart', e => { const t = e.changedTouches[0]; x0 = t.clientX; y0 = t.clientY; }, { passive: true });
    deck.addEventListener('touchend', e => {
        if (x0 === null) return;
        const t = e.changedTouches[0], dx = t.clientX - x0, dy = t.clientY - y0;
        x0 = null;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) ir(atual + (dx < 0 ? 1 : -1));
    }, { passive: true });

    // Um handler só: com a tela cheia aberta, ela tem prioridade.
    document.addEventListener('keydown', ev => {
        if (ev.defaultPrevented || ev.altKey || ev.ctrlKey || ev.metaKey) return;
        if (aberto()) {
            const emBotao = ev.target && ev.target.closest && ev.target.closest('button');
            if (ev.key === 'Escape') { ev.preventDefault(); fechar(); }
            else if (ev.key === 'ArrowRight') { ev.preventDefault(); mover(1); }
            else if (ev.key === 'ArrowLeft') { ev.preventDefault(); mover(-1); }
            else if ((ev.key === ' ' || ev.key === 'Enter') && !emBotao) { ev.preventDefault(); alternarRevelar(); }
            return;
        }
        const aba = document.getElementById('tab-grammar');
        if (!aba || aba.classList.contains('hidden')) return;
        const alvo = ev.target;
        if (alvo && (/^(INPUT|TEXTAREA|SELECT)$/.test(alvo.tagName) || alvo.isContentEditable)) return;
        if (ev.key === 'ArrowRight') { ev.preventDefault(); ir(atual + 1); }
        else if (ev.key === 'ArrowLeft') { ev.preventDefault(); ir(atual - 1); }
    });

    // ── Estilo da tela cheia ──────────────────────────────────────────────
    // Fica no próprio arquivo, como no vocab-focus.js. O z-index passa o da
    // Yara flutuante (10000) para o slide ocupar a tela inteira.
    const css = `
.gs-foco{position:fixed;inset:0;z-index:10001;display:none;align-items:center;justify-content:center;
  background:rgba(0,31,63,.94);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);padding:2vh 2vw}
.gs-foco.gs-aberto{display:flex;animation:gsIn .18s ease both}
.gs-foco:focus{outline:none}
@keyframes gsIn{from{opacity:0}to{opacity:1}}
body.gs-travado{overflow:hidden}
.gs-foco-palco{--gs-e:1;width:min(1500px,calc(100vw - 160px));max-height:calc(100vh - 120px);overflow:auto;border-radius:1.75rem;
  background:#fff;box-shadow:0 30px 80px rgba(0,0,0,.35)}
.gs-foco-palco .gs-slide{border:0;border-radius:0;cursor:default}
.gs-foco-palco .gs-cab{padding:calc(var(--gs-e) * clamp(12px,2.2vh,26px)) clamp(18px,2.8vw,40px)}
.gs-foco-palco .gs-rotulo{font-size:calc(var(--gs-e) * clamp(.72rem,1.05vw,1rem))}
.gs-foco-palco .gs-titulo{font-size:calc(var(--gs-e) * clamp(1.4rem,3vw,3.2rem));line-height:1.15}
.gs-foco-palco .gs-corpo{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,6fr);gap:clamp(14px,2.2vw,40px);
  align-items:center;padding:calc(var(--gs-e) * clamp(12px,2.2vh,28px)) clamp(18px,2.8vw,40px)}
.gs-foco-palco .gs-img,.gs-foco-palco .gs-texto{grid-column:auto;margin:0}
.gs-foco-palco .gs-img{width:100%;height:auto;aspect-ratio:4/3;max-height:calc(100vh - 290px);object-fit:contain;background:none}
.gs-foco-palco .gs-lista>li+li{margin-top:calc(var(--gs-e) * clamp(5px,.9vh,12px))}
.gs-foco-palco .gs-item{padding:calc(var(--gs-e) * clamp(6px,1.1vh,14px)) clamp(10px,1.4vw,18px);align-items:center}
.gs-foco-palco .gs-en{font-size:calc(var(--gs-e) * clamp(1rem,1.85vw,2.1rem));line-height:1.25}
.gs-foco-palco .gs-pt{font-size:calc(var(--gs-e) * clamp(.85rem,1.25vw,1.35rem));transition:opacity .2s ease}
.gs-foco:not(.gs-revelado) .gs-pt{opacity:0;visibility:hidden}
.gs-foco-palco .gs-nota{font-size:calc(var(--gs-e) * clamp(.95rem,1.4vw,1.3rem))}
.gs-foco-palco .gs-ouvir{width:calc(var(--gs-e) * clamp(40px,3.4vw,58px));height:calc(var(--gs-e) * clamp(40px,3.4vw,58px))}
.gs-foco-palco .gs-ouvir svg{width:calc(var(--gs-e) * clamp(20px,1.7vw,28px));height:calc(var(--gs-e) * clamp(20px,1.7vw,28px))}
.gs-foco-fechar{position:absolute;top:max(12px,2vh);right:max(12px,2vw);width:48px;height:48px;border-radius:50%;
  background:rgba(255,255,255,.16);color:#fff;border:none;font-size:1.5rem;font-weight:700;cursor:pointer;line-height:1}
.gs-foco-fechar:hover{background:rgba(255,255,255,.3)}
.gs-foco-nav{position:absolute;top:50%;transform:translateY(-50%);width:56px;height:56px;border-radius:50%;
  background:rgba(255,255,255,.14);color:#fff;border:none;font-size:2.2rem;line-height:1;cursor:pointer}
.gs-foco-nav:hover{background:rgba(255,255,255,.28)}
.gs-foco-prev{left:max(10px,1.5vw)}
.gs-foco-next{right:max(10px,1.5vw)}
.gs-foco-rodape{position:absolute;bottom:max(12px,2vh);left:0;right:0;display:flex;align-items:center;justify-content:center;gap:16px;pointer-events:none}
.gs-foco-rodape>*{pointer-events:auto}
.gs-foco-revelar{background:rgba(255,255,255,.14);border:2px solid rgba(255,255,255,.35);color:#fff;font-weight:800;
  padding:.5rem 1.25rem;border-radius:999px;font-size:clamp(.9rem,1.5vw,1.1rem);cursor:pointer;transition:all .18s}
.gs-foco-revelar:hover{background:rgba(255,255,255,.25);transform:scale(1.04)}
.gs-foco-revelar[hidden]{display:none}
.gs-foco-contador{color:rgba(255,255,255,.65);font-weight:700;font-size:.95rem;font-variant-numeric:tabular-nums}
@media (max-width:760px),(orientation:portrait){
  .gs-foco{padding:64px 10px 76px}
  .gs-foco-palco{width:100%;max-height:100%}
  .gs-foco-palco .gs-corpo{grid-template-columns:1fr}
  .gs-foco-palco .gs-img{max-height:32vh}
  .gs-foco-nav{top:auto;bottom:max(12px,2vh);transform:none;width:48px;height:48px;font-size:1.9rem}
}`;
    const tag = document.createElement('style');
    tag.textContent = css;
    document.head.appendChild(tag);

    ir(0);
    window.CapyGramaticaSlides = { abrir: i => abrir(i), fechar, ir, atual: () => atual };
})();
