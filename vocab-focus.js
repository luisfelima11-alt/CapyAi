/* ══════════════════════════════════════════════════════════════════════════
   vocab-focus.js — o card de vocabulário em tela cheia.

   POR QUÊ: na aula ao vivo o professor compartilha a tela, e o card do
   vocabulário tem 96 px de altura (`.flip-card h-24`). Do outro lado da
   chamada a palavra fica ilegível. Clicar no card agora abre o mesmo
   conteúdo ocupando quase a tela inteira — palavra, tradução e a frase de
   exemplo — para a turma ler de longe.

   Carregue em qualquer aula de curso, depois de components.js. Não precisa
   de configuração: ele lê os cards já renderizados no DOM (`.flip-card`,
   com `.flip-front` e `.flip-back`), então funciona nos dois formatos de
   aula do site — o antigo (`VOCAB` com pares) e o novo (`VOCAB_DATA`).

   O card pequeno continua virando como antes; a tela cheia é um extra por
   cima. Ao fechar, os cards voltam para a frente para não deixar metade da
   grade virada.
   ══════════════════════════════════════════════════════════════════════════ */
(function () {
    'use strict';

    const CFG = (typeof window !== 'undefined' && window.YARA_WIDGET) || {};
    const LANG = CFG.lang === 'fr' ? 'fr-FR' : 'en-US';

    let cards = [];      // os .flip-card na ordem da grade
    let atual = 0;
    let revelado = false;
    let overlay = null;
    let abertoEm = 0;      // instante da abertura, para ignorar o clique fantasma

    // ── Leitura do card ───────────────────────────────────────────────────
    // A frente tem emoji + palavra; o verso tem tradução e, nas aulas mais
    // novas, a frase de exemplo depois de um <br>. Nas aulas antigas o verso
    // é só a tradução. Aqui a gente aceita os dois sem reclamar.
    function emojisDe(txt) {
        const m = txt.match(/[\p{Extended_Pictographic}\u{1F3FB}-\u{1F3FF}\u{200D}\u{FE0F}]+/gu);
        return m ? m.join('') : '';
    }

    // Alguns cursos (o francês, por exemplo) põem um botãozinho 🔊 dentro do
    // card. Sem tirar, ele vira texto na tela cheia e a Yara tenta LER o
    // emoji em voz alta.
    function semControles(el) {
        if (!el) return null;
        const c = el.cloneNode(true);
        c.querySelectorAll('button, input, select, textarea, .material-symbols-outlined').forEach(n => n.remove());
        return c;
    }

    function lerCard(card) {
        const frente = semControles(card.querySelector('.flip-front'));
        const verso = semControles(card.querySelector('.flip-back'));
        const textoFrente = (frente ? frente.textContent : '').replace(/\s+/g, ' ').trim();
        const emoji = emojisDe(textoFrente);
        const palavra = textoFrente.replace(/[\p{Extended_Pictographic}\u{1F3FB}-\u{1F3FF}\u{200D}\u{FE0F}]/gu, '').replace(/\s+/g, ' ').trim();

        let traducao = '', formas = '', exemplo = '';
        if (verso) {
            // <br> separa tradução / formas do verbo / frase de exemplo — quebramos
            // pelo HTML, não pelo texto. Antes, formas+exemplo eram colados com um
            // espaço só (sem separação visual, e o áudio lia os dois juntos sem
            // pausa: "unplug unplugged has unplugged Unplug the cable slowly").
            // Agora cada parte fica isolada: a frase de exemplo é a que vem entre
            // aspas (o molde sempre envolve o exemplo em "…"); o resto, se houver,
            // são as formas do verbo.
            const partes = verso.innerHTML.split(/<br\s*\/?>/i);
            const limpar = h => {
                const d = document.createElement('div');
                d.innerHTML = h;
                return d.textContent.replace(/\s+/g, ' ').trim();
            };
            traducao = limpar(partes[0] || '');
            const extras = partes.slice(1).map(limpar).filter(Boolean);
            const iExemplo = extras.findIndex(t => /^["“]/.test(t));
            if (iExemplo >= 0) {
                exemplo = extras[iExemplo];
                formas = extras.filter((_, i) => i !== iExemplo).join(' · ');
            } else {
                exemplo = extras.join(' ');
            }
        }
        return { emoji, palavra, traducao, formas, exemplo };
    }

    // ── Overlay ───────────────────────────────────────────────────────────
    function criarOverlay() {
        const el = document.createElement('div');
        el.id = 'vf-overlay';
        el.className = 'vf-overlay';
        el.setAttribute('role', 'dialog');
        el.setAttribute('aria-modal', 'true');
        el.setAttribute('aria-label', 'Palavra em tela cheia');
        el.innerHTML = `
      <button class="vf-fechar" type="button" aria-label="Fechar">✕</button>
      <button class="vf-nav vf-prev" type="button" aria-label="Anterior">‹</button>
      <button class="vf-nav vf-next" type="button" aria-label="Próxima">›</button>
      <div class="vf-palco">
        <div class="vf-emoji" aria-hidden="true"></div>
        <div class="vf-palavra"></div>
        <button class="vf-revelar" type="button">👁️ Ver tradução</button>
        <div class="vf-traducao"></div>
        <div class="vf-formas"></div>
        <div class="vf-exemplo"></div>
        <div class="vf-acoes">
          <button class="vf-audio" type="button">🔊 Ouvir</button>
          <button class="vf-audio-ex" type="button">🔊 Ouvir a frase</button>
        </div>
      </div>
      <div class="vf-contador"></div>`;
        document.body.appendChild(el);

        el.querySelector('.vf-fechar').addEventListener('click', fechar);
        el.querySelector('.vf-prev').addEventListener('click', e => { e.stopPropagation(); mover(-1); });
        el.querySelector('.vf-next').addEventListener('click', e => { e.stopPropagation(); mover(1); });
        el.querySelector('.vf-revelar').addEventListener('click', e => { e.stopPropagation(); alternarRevelar(); });
        el.querySelector('.vf-audio').addEventListener('click', e => { e.stopPropagation(); falar(lerCard(cards[atual]).palavra); });
        el.querySelector('.vf-audio-ex').addEventListener('click', e => { e.stopPropagation(); falar(lerCard(cards[atual]).exemplo); });
        // Clicar no fundo fecha; clicar no palco não. A janela de carência
        // existe porque o overlay nasce EMBAIXO do dedo/cursor: no celular o
        // mesmo toque vira um "clique fantasma" ~300 ms depois, e sem isso o
        // card abria e fechava no mesmo toque.
        el.addEventListener('click', ev => {
            if (ev.target !== el) return;
            if (Date.now() - abertoEm < 400) return;
            fechar();
        });
        el.querySelector('.vf-palco').addEventListener('click', ev => {
            // toque no meio do palco também revela — é o gesto natural
            if (ev.target.closest('button')) return;
            alternarRevelar();
        });
        return el;
    }

    // O que aparece na tela e o que se fala não são a mesma coisa: o guia de
    // pronúncia "[bon-ZHOOR]" ajuda a ler, mas soletrado em voz alta atrapalha.
    function paraFalar(texto) {
        return String(texto || '')
            .replace(/\[[^\]]*\]/g, ' ')
            .replace(/[\p{Extended_Pictographic}\u{1F3FB}-\u{1F3FF}\u{200D}\u{FE0F}]/gu, ' ')
            .replace(/\s+/g, ' ').trim();
    }

    function falar(bruto) {
        const texto = paraFalar(bruto);
        if (!texto) return;
        if (window.CapyTTS && typeof CapyTTS.speak === 'function') { CapyTTS.speak(texto, LANG); return; }
        if (typeof window.speak === 'function') { window.speak(texto); return; }
        try {
            const u = new SpeechSynthesisUtterance(texto);
            u.lang = LANG; u.rate = 0.9;
            speechSynthesis.cancel(); speechSynthesis.speak(u);
        } catch (e) { }
    }

    function pintar() {
        const d = lerCard(cards[atual]);
        overlay.querySelector('.vf-emoji').textContent = d.emoji || '📚';
        overlay.querySelector('.vf-palavra').textContent = d.palavra;
        overlay.querySelector('.vf-traducao').textContent = d.traducao;
        overlay.querySelector('.vf-formas').textContent = d.formas;
        overlay.querySelector('.vf-formas').style.display = d.formas ? '' : 'none';
        overlay.querySelector('.vf-exemplo').textContent = d.exemplo;
        overlay.querySelector('.vf-exemplo').style.display = d.exemplo ? '' : 'none';
        overlay.querySelector('.vf-audio-ex').style.display = d.exemplo ? '' : 'none';
        overlay.querySelector('.vf-contador').textContent = (atual + 1) + ' / ' + cards.length;
        overlay.classList.toggle('vf-revelado', revelado);
        overlay.querySelector('.vf-revelar').textContent = revelado ? '🙈 Esconder' : '👁️ Ver tradução';
        overlay.querySelector('.vf-prev').style.visibility = cards.length > 1 ? '' : 'hidden';
        overlay.querySelector('.vf-next').style.visibility = cards.length > 1 ? '' : 'hidden';
    }

    function abrir(i) {
        cards = Array.from(document.querySelectorAll('.flip-card'));
        if (!cards.length) return;
        atual = Math.max(0, Math.min(i, cards.length - 1));
        revelado = false;
        if (!overlay) overlay = criarOverlay();
        pintar();
        abertoEm = Date.now();
        document.body.classList.add('vf-travado');
        overlay.classList.add('vf-aberto');
        overlay.querySelector('.vf-fechar').focus();
    }

    function fechar() {
        if (!overlay) return;
        overlay.classList.remove('vf-aberto');
        document.body.classList.remove('vf-travado');
        // devolve a grade para o estado "frente", senão fica metade virada
        cards.forEach(c => c.classList.remove('flipped'));
    }

    function mover(passo) {
        atual = (atual + passo + cards.length) % cards.length;
        revelado = false;
        pintar();
    }

    function alternarRevelar() {
        revelado = !revelado;
        pintar();
    }

    // ── Ligação com a grade ───────────────────────────────────────────────
    // Delegado no document: os cards são criados por buildVocab() depois que
    // este script roda, então não dá para escutar card por card.
    document.addEventListener('click', ev => {
        const card = ev.target.closest && ev.target.closest('.flip-card');
        if (!card) return;
        if (overlay && overlay.classList.contains('vf-aberto')) return;
        const lista = Array.from(document.querySelectorAll('.flip-card'));
        const i = lista.indexOf(card);
        if (i < 0) return;
        abrir(i);
    });

    // O card é uma <div> sem papel nenhum: quem navega por teclado nunca chega
    // nele, e leitor de tela não anuncia que dá para abrir. Marcamos como botão
    // e damos foco — o clique já é tratado pelo delegado acima.
    function marcarCards() {
        document.querySelectorAll('.flip-card').forEach((c, i) => {
            if (c.dataset.vfPronto) return;
            c.dataset.vfPronto = '1';
            c.setAttribute('role', 'button');
            c.setAttribute('tabindex', '0');
            const frente = c.querySelector('.flip-front');
            const palavra = frente ? frente.textContent.replace(/\s+/g, ' ').trim() : ('palavra ' + (i + 1));
            c.setAttribute('aria-label', 'Ver "' + palavra + '" em tela cheia');
            c.addEventListener('keydown', ev => {
                if (ev.key !== 'Enter' && ev.key !== ' ') return;
                ev.preventDefault();
                const lista = Array.from(document.querySelectorAll('.flip-card'));
                abrir(lista.indexOf(c));
            });
        });
    }

    // Os cards nascem do buildVocab() da aula; a segunda passada pega as aulas
    // que montam a grade depois de buscar algo.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => { marcarCards(); setTimeout(marcarCards, 1200); });
    } else {
        marcarCards(); setTimeout(marcarCards, 1200);
    }

    document.addEventListener('keydown', ev => {
        if (!overlay || !overlay.classList.contains('vf-aberto')) return;
        if (ev.key === 'Escape') { ev.preventDefault(); fechar(); }
        else if (ev.key === 'ArrowRight') { ev.preventDefault(); mover(1); }
        else if (ev.key === 'ArrowLeft') { ev.preventDefault(); mover(-1); }
        else if (ev.key === ' ' || ev.key === 'Enter') { ev.preventDefault(); alternarRevelar(); }
    });

    // ── Estilo ────────────────────────────────────────────────────────────
    // Fica no próprio arquivo para não depender de mudar 124 páginas de CSS.
    const css = `
.vf-overlay{position:fixed;inset:0;z-index:9998;display:none;align-items:center;justify-content:center;
  background:rgba(0,31,63,.94);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);padding:2vh 2vw}
.vf-overlay.vf-aberto{display:flex;animation:vfIn .18s ease both}
@keyframes vfIn{from{opacity:0}to{opacity:1}}
body.vf-travado{overflow:hidden}
.vf-palco{width:min(1100px,94vw);max-height:92vh;overflow:auto;text-align:center;color:#fff;
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:clamp(8px,1.6vh,20px);cursor:pointer}
.vf-emoji{font-size:clamp(3rem,11vh,7rem);line-height:1}
.vf-palavra{font-weight:900;line-height:1.05;font-size:clamp(2.2rem,9vw,6.5rem);
  background:linear-gradient(90deg,#fff,#ffe6ef);-webkit-background-clip:text;background-clip:text;color:transparent;
  word-break:break-word;padding:0 .2em}
.vf-revelar{background:rgba(255,255,255,.14);border:2px solid rgba(255,255,255,.35);color:#fff;font-weight:800;
  padding:.6rem 1.4rem;border-radius:999px;font-size:clamp(.95rem,2vw,1.25rem);cursor:pointer;transition:all .18s}
.vf-revelar:hover{background:rgba(255,255,255,.25);transform:scale(1.04)}
.vf-traducao,.vf-formas,.vf-exemplo{opacity:0;max-height:0;overflow:hidden;transition:opacity .25s ease,max-height .25s ease}
.vf-overlay.vf-revelado .vf-traducao{opacity:1;max-height:40vh;margin-bottom:.15em}
.vf-overlay.vf-revelado .vf-formas{opacity:1;max-height:10vh;margin-top:.3em}
.vf-overlay.vf-revelado .vf-exemplo{opacity:1;max-height:40vh;margin-top:.7em}
.vf-traducao{font-weight:800;font-size:clamp(1.5rem,5.5vw,3.5rem);color:#ffd9e4;line-height:1.15}
.vf-formas{font-weight:700;font-size:clamp(.85rem,2vw,1.15rem);color:#001f3f;letter-spacing:.02em;
  background:#ffd166;display:inline-block;padding:.35em 1em;border-radius:999px;line-height:1.4}
.vf-exemplo{font-size:clamp(1.05rem,3.2vw,2rem);color:rgba(255,255,255,.82);font-style:italic;line-height:1.4;max-width:34ch;margin:0 auto}
.vf-acoes{display:flex;flex-wrap:wrap;gap:.6rem;justify-content:center;margin-top:.4rem}
.vf-acoes button{background:#fff;color:#001f3f;font-weight:800;border:none;border-radius:999px;
  padding:.55rem 1.2rem;font-size:clamp(.9rem,1.8vw,1.1rem);cursor:pointer;transition:transform .15s}
.vf-acoes button:hover{transform:scale(1.06)}
.vf-fechar{position:absolute;top:max(12px,2vh);right:max(12px,2vw);width:48px;height:48px;border-radius:50%;
  background:rgba(255,255,255,.16);color:#fff;border:none;font-size:1.5rem;font-weight:700;cursor:pointer;line-height:1}
.vf-fechar:hover{background:rgba(255,255,255,.3)}
.vf-nav{position:absolute;top:50%;transform:translateY(-50%);width:56px;height:56px;border-radius:50%;
  background:rgba(255,255,255,.14);color:#fff;border:none;font-size:2.2rem;line-height:1;cursor:pointer}
.vf-nav:hover{background:rgba(255,255,255,.28)}
.vf-prev{left:max(8px,1.5vw)}
.vf-next{right:max(8px,1.5vw)}
.vf-contador{position:absolute;bottom:max(12px,2vh);left:0;right:0;text-align:center;
  color:rgba(255,255,255,.6);font-weight:700;font-size:.95rem}
@media (max-width:640px){.vf-nav{width:44px;height:44px;font-size:1.8rem}.vf-exemplo{max-width:90vw}}`;
    const tag = document.createElement('style');
    tag.textContent = css;
    document.head.appendChild(tag);

    window.CapyVocabFocus = { abrir, fechar };
})();
