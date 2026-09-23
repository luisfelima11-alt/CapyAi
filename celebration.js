/* ══════════════════════════════════════════════════════════════════════════
   celebration.js — a comemoração da Yara ao fechar uma lição ou um capítulo.

   POR QUÊ: a trilha diária terminava numa tela branca com um emoji 🎉 parado.
   O que segura aluno em app de idioma é justamente esse instante: o Duolingo
   gasta dois segundos de festa toda vez que você fecha uma lição, e é isso
   que faz voltar amanhã.

   São CINCO comemorações diferentes — quatro para lição, uma maior para
   capítulo — e o módulo nunca repete a mesma duas vezes seguidas:

     pulo      Yara salta de baixo, amassa e estica, chuva de confete
     estrelas  Yara cresce do centro, onda de choque e estrelas voando
     carimbo   selo bate na tela com tremida, faixa entrando de lado
     folhas    folhas e frutinhas rodopiando, Yara gira e dá um pulinho
     coroa     (capítulo) raios dourados girando, coroa caindo na cabeça

   COMO USAR
     CapyCelebra.mostrar({ tipo:'licao', titulo:'Lesson Complete!', xp:50 })
   Devolve uma Promise que resolve quando a festa acaba — dá para esperar
   antes de mostrar a tela de resumo.

   ARTE GERADA: hoje a Yara é a foto `yara.png` dentro de um medalhão, animada
   por CSS. Quando existir clipe pronto (Higgsfield, elemento Capyara), basta
   preencher `video` na variante correspondente lá em ARTE — o módulo passa a
   tocar o clipe e mantém partículas, texto, som e tempo do jeito que estão.
   ══════════════════════════════════════════════════════════════════════════ */
(function () {
    'use strict';

    // Arte por variante. O clipe é a Yara animada de verdade (gerado a partir
    // do próprio yara.png, por isso é ela mesma e não um sósia); a imagem é o
    // plano B — se o vídeo demorar ou falhar, a foto entra no lugar e a
    // animação de CSS segura a comemoração sozinha.
    const ARTE = {
        pulo: { video: 'celebra-pulo.mp4', imagem: 'yara.png' },
        estrelas: { video: 'celebra-estrelas.mp4', imagem: 'yara.png' },
        carimbo: { video: 'celebra-carimbo.mp4', imagem: 'yara.png' },
        folhas: { video: 'celebra-folhas.mp4', imagem: 'yara.png' },
        coroa: { video: 'celebra-coroa.mp4', imagem: 'yara.png' },
    };
    const VERSAO_ARTE = 'c1';

    const DAS_LICOES = ['pulo', 'estrelas', 'carimbo', 'folhas'];
    const CHAVE_ULTIMA = 'capyCelebraUltima';
    const DURACAO = { licao: 2400, capitulo: 3200 };

    const ELOGIOS = [
        'Mandou bem!', 'Isso aí!', 'Tá voando!', 'Que orgulho!',
        'Continua assim!', 'Show de bola!', 'Arrasou!', 'Tá ficando fera!',
    ];

    function poucoMovimento() {
        try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; }
    }

    function sorteia(lista) { return lista[Math.floor(Math.random() * lista.length)]; }

    // Nunca a mesma duas vezes seguidas — repetir mata a graça na terceira lição.
    function proximaVariante() {
        let ultima = '';
        try { ultima = localStorage.getItem(CHAVE_ULTIMA) || ''; } catch (e) { }
        const opcoes = DAS_LICOES.filter(v => v !== ultima);
        const escolhida = sorteia(opcoes.length ? opcoes : DAS_LICOES);
        try { localStorage.setItem(CHAVE_ULTIMA, escolhida); } catch (e) { }
        return escolhida;
    }

    function esc(s) {
        return String(s == null ? '' : s)
            .replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    }

    // ── Partículas ────────────────────────────────────────────────────────
    const CORES = ['#ec4899', '#8b5cf6', '#10b981', '#f59e0b', '#3b82f6', '#f472b6', '#facc15'];

    function confete(palco, quantidade) {
        for (let i = 0; i < quantidade; i++) {
            const p = document.createElement('i');
            p.className = 'cc-confete';
            p.style.left = Math.random() * 100 + '%';
            p.style.background = sorteia(CORES);
            p.style.animationDelay = (Math.random() * 0.5) + 's';
            p.style.animationDuration = (1.4 + Math.random() * 1.1) + 's';
            p.style.setProperty('--giro', (Math.random() * 720 - 360) + 'deg');
            p.style.setProperty('--deriva', (Math.random() * 120 - 60) + 'px');
            if (Math.random() < 0.35) p.style.borderRadius = '50%';
            palco.appendChild(p);
        }
    }

    function estrelasVoando(palco, quantidade) {
        for (let i = 0; i < quantidade; i++) {
            const ang = (360 / quantidade) * i + Math.random() * 12;
            const dist = 150 + Math.random() * 200;
            const s = document.createElement('i');
            s.className = 'cc-estrela';
            s.textContent = Math.random() < 0.5 ? '⭐' : '✨';
            s.style.setProperty('--dx', Math.cos(ang * Math.PI / 180) * dist + 'px');
            s.style.setProperty('--dy', Math.sin(ang * Math.PI / 180) * dist + 'px');
            s.style.animationDelay = (Math.random() * 0.25) + 's';
            palco.appendChild(s);
        }
    }

    function folhasCaindo(palco, quantidade) {
        const bichos = ['🍃', '🍂', '🌿', '🫐', '🍁'];
        for (let i = 0; i < quantidade; i++) {
            const f = document.createElement('i');
            f.className = 'cc-folha';
            f.textContent = sorteia(bichos);
            f.style.left = Math.random() * 100 + '%';
            f.style.animationDelay = (Math.random() * 0.7) + 's';
            f.style.animationDuration = (2 + Math.random() * 1.4) + 's';
            f.style.fontSize = (16 + Math.random() * 18) + 'px';
            f.style.setProperty('--vai', (Math.random() * 160 - 80) + 'px');
            palco.appendChild(f);
        }
    }

    // ── A Yara ────────────────────────────────────────────────────────────
    // O `yara.png` é uma foto quadrada COM cenário de floresta atrás. Dentro de
    // um medalhão redondo isso lê como retrato, e não como recorte mal feito.
    function medalhao(variante) {
        const arte = ARTE[variante] || {};
        const cont = document.createElement('div');
        cont.className = 'cc-yara cc-yara-' + variante;
        const foto = esc(arte.imagem || 'yara.png');
        if (!arte.video) {
            cont.innerHTML = `<img class="cc-midia" src="${foto}" alt="">`;
            return cont;
        }
        // A foto entra primeiro e o clipe cobre ela quando estiver pronto. Sem
        // isso, numa conexão ruim o medalhão ficaria PRETO durante a festa
        // inteira — a comemoração tem 2,4 s, não dá para esperar download.
        cont.innerHTML =
            `<img class="cc-midia cc-foto" src="${foto}" alt="">` +
            `<video class="cc-midia cc-clipe" src="${esc(arte.video)}?v=${VERSAO_ARTE}"` +
            ` autoplay muted playsinline preload="auto"></video>`;
        const clipe = cont.querySelector('.cc-clipe');
        clipe.addEventListener('playing', () => cont.classList.add('cc-com-clipe'));
        clipe.addEventListener('error', () => clipe.remove());
        return cont;
    }

    // ── Montagem de cada variante ─────────────────────────────────────────
    function montar(variante, dados, palco) {
        // O medalhão vai dentro de um berço posicionado. Sem ele, o selo e a
        // coroa se ancoravam em `top:50%` DA TELA — e como o palco é uma coluna
        // flex, o meio da tela não é o meio do medalhão: a coroa caía em cima
        // do rosto da Yara em vez de na cabeça.
        const berco = document.createElement('div');
        berco.className = 'cc-berco';
        berco.appendChild(medalhao(variante));
        const yara = berco;

        const texto = document.createElement('div');
        texto.className = 'cc-texto';
        texto.innerHTML = `
      <h2 class="cc-titulo">${esc(dados.titulo)}</h2>
      ${dados.subtitulo ? `<p class="cc-sub">${esc(dados.subtitulo)}</p>` : ''}
      <p class="cc-elogio">${esc(dados.elogio)}</p>
      ${dados.xp ? `<div class="cc-xp">+${esc(dados.xp)} XP</div>` : ''}`;

        if (variante === 'pulo') {
            confete(palco, 70);
            palco.appendChild(yara);
            palco.appendChild(texto);

        } else if (variante === 'estrelas') {
            const onda = document.createElement('div');
            onda.className = 'cc-onda';
            palco.appendChild(onda);
            palco.appendChild(yara);
            estrelasVoando(palco, 16);
            palco.appendChild(texto);

        } else if (variante === 'carimbo') {
            palco.classList.add('cc-tremer');
            const selo = document.createElement('div');
            selo.className = 'cc-selo';
            selo.textContent = dados.tipo === 'capitulo' ? '👑' : '✅';
            const faixa = document.createElement('div');
            faixa.className = 'cc-faixa';
            faixa.textContent = dados.elogio;
            berco.appendChild(selo);          // no berço: fica em cima da cabeça
            palco.appendChild(yara);
            palco.appendChild(faixa);
            texto.querySelector('.cc-elogio').remove();
            palco.appendChild(texto);
            confete(palco, 30);

        } else if (variante === 'folhas') {
            folhasCaindo(palco, 28);
            palco.appendChild(yara);
            palco.appendChild(texto);

        } else if (variante === 'coroa') {
            const raios = document.createElement('div');
            raios.className = 'cc-raios';
            palco.appendChild(raios);
            palco.appendChild(yara);
            const coroa = document.createElement('div');
            coroa.className = 'cc-coroa-icone';
            coroa.textContent = '👑';
            berco.appendChild(coroa);         // no berço: cai na cabeça, não no rosto
            confete(palco, 90);
            estrelasVoando(palco, 12);
            palco.appendChild(texto);
        }
    }

    // ── API ───────────────────────────────────────────────────────────────
    let aberta = null;

    function mostrar(opcoes) {
        const dados = Object.assign({ tipo: 'licao', titulo: 'Lesson Complete!', subtitulo: '', xp: 0 }, opcoes || {});
        dados.elogio = dados.elogio || sorteia(ELOGIOS);
        const variante = dados.tipo === 'capitulo' ? 'coroa' : proximaVariante();

        if (aberta) { try { aberta.remove(); } catch (e) { } aberta = null; }

        const overlay = document.createElement('div');
        overlay.className = 'cc-overlay cc-' + variante;
        overlay.setAttribute('role', 'status');
        overlay.setAttribute('aria-live', 'polite');
        const palco = document.createElement('div');
        palco.className = 'cc-palco';
        overlay.appendChild(palco);

        const suave = poucoMovimento();
        if (suave) overlay.classList.add('cc-suave');
        montar(variante, dados, palco);

        document.body.appendChild(overlay);
        aberta = overlay;
        if (window.CapySound) { try { CapySound.fanfare(); } catch (e) { } }

        return new Promise(resolve => {
            let fechado = false;
            const fechar = () => {
                if (fechado) return;
                fechado = true;
                overlay.classList.add('cc-saindo');
                setTimeout(() => {
                    try { overlay.remove(); } catch (e) { }
                    if (aberta === overlay) aberta = null;
                    resolve();
                }, 280);
            };
            // toque em qualquer lugar pula a festa — quem já viu não quer esperar
            overlay.addEventListener('click', fechar);
            setTimeout(fechar, suave ? 1200 : (DURACAO[dados.tipo] || DURACAO.licao));
        });
    }

    // ── Estilo ────────────────────────────────────────────────────────────
    const css = `
.cc-overlay{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;
  overflow:hidden;background:radial-gradient(circle at 50% 45%,rgba(255,255,255,.97),rgba(236,240,247,.97));
  animation:ccEntra .22s ease both;cursor:pointer}
.cc-overlay.cc-saindo{animation:ccSai .28s ease both}
@keyframes ccEntra{from{opacity:0}to{opacity:1}}
@keyframes ccSai{to{opacity:0}}
.cc-palco{position:relative;width:100%;height:100%;display:flex;flex-direction:column;
  align-items:center;justify-content:center;gap:1rem;text-align:center;padding:2rem}

/* berço: só serve de referência de posição para o selo e a coroa */
.cc-berco{position:relative;flex-shrink:0;line-height:0}

/* medalhão da Yara */
.cc-yara{position:relative;width:min(46vw,220px);height:min(46vw,220px);border-radius:50%;
  overflow:hidden;box-shadow:0 18px 50px rgba(0,31,63,.28);border:6px solid #fff;flex-shrink:0}
.cc-midia{width:100%;height:100%;object-fit:cover;display:block}
/* o clipe fica por cima da foto e só aparece quando começa a tocar */
.cc-yara .cc-clipe{position:absolute;inset:0;opacity:0;transition:opacity .25s ease}
.cc-yara.cc-com-clipe .cc-clipe{opacity:1}

/* texto */
.cc-texto{position:relative;z-index:2}
.cc-titulo{font-size:clamp(1.6rem,6vw,2.6rem);font-weight:900;color:#001f3f;line-height:1.1;margin-bottom:.25rem}
.cc-sub{color:#64748b;font-weight:700;font-size:clamp(.9rem,2.6vw,1.05rem);margin-bottom:.35rem}
.cc-elogio{font-weight:900;font-size:clamp(1.05rem,3.4vw,1.4rem);
  background:linear-gradient(90deg,#ec4899,#8b5cf6);-webkit-background-clip:text;background-clip:text;color:transparent}
.cc-xp{display:inline-block;margin-top:.6rem;background:linear-gradient(90deg,#10b981,#14b8a6);color:#fff;
  font-weight:900;font-size:clamp(1rem,3vw,1.3rem);padding:.4rem 1.2rem;border-radius:999px;
  box-shadow:0 8px 20px rgba(16,185,129,.35);animation:ccXp .5s .35s cubic-bezier(.34,1.56,.64,1) both}
@keyframes ccXp{from{opacity:0;transform:scale(.4) translateY(14px)}to{opacity:1;transform:none}}

/* 1. pulo — sobe de baixo, amassa e estica */
.cc-pulo .cc-berco{animation:ccPulo 1.05s cubic-bezier(.34,1.56,.64,1) both}
@keyframes ccPulo{
  0%{transform:translateY(70vh) scaleY(1.25) scaleX(.8);opacity:0}
  45%{opacity:1}
  60%{transform:translateY(0) scaleY(.78) scaleX(1.2)}
  75%{transform:translateY(-26px) scaleY(1.1) scaleX(.94)}
  88%{transform:translateY(0) scaleY(.92) scaleX(1.06)}
  100%{transform:none}}
.cc-confete{position:absolute;top:-24px;width:11px;height:16px;border-radius:2px;
  animation:ccCai linear forwards;pointer-events:none}
@keyframes ccCai{to{transform:translate(var(--deriva),105vh) rotate(var(--giro));opacity:.15}}

/* 2. estrelas — cresce do centro com onda de choque */
.cc-estrelas .cc-berco{animation:ccCresce .6s cubic-bezier(.34,1.56,.64,1) both}
@keyframes ccCresce{from{transform:scale(0) rotate(-25deg);opacity:0}to{transform:none;opacity:1}}
.cc-onda{position:absolute;width:min(46vw,220px);height:min(46vw,220px);border-radius:50%;
  border:5px solid #8b5cf6;top:50%;left:50%;translate:-50% -50%;
  animation:ccOnda .9s .15s ease-out both;pointer-events:none}
@keyframes ccOnda{from{transform:scale(.5);opacity:.9}to{transform:scale(3.4);opacity:0}}
.cc-estrela{position:absolute;top:50%;left:50%;font-size:26px;pointer-events:none;
  animation:ccVoa 1.1s .1s cubic-bezier(.2,.8,.3,1) both}
@keyframes ccVoa{from{transform:translate(-50%,-50%) scale(.2);opacity:0}
  30%{opacity:1}
  to{transform:translate(calc(-50% + var(--dx)),calc(-50% + var(--dy))) scale(1.1) rotate(180deg);opacity:0}}

/* 3. carimbo — o selo bate e a tela treme */
.cc-carimbo .cc-berco{animation:ccEntraLado .55s cubic-bezier(.34,1.56,.64,1) both}
@keyframes ccEntraLado{from{transform:translateX(-70vw) rotate(-18deg);opacity:0}to{transform:none;opacity:1}}
.cc-selo{position:absolute;left:50%;translate:-50% 0;top:-14%;font-size:clamp(3rem,14vw,5.5rem);
  animation:ccBate .5s .3s cubic-bezier(.3,1.7,.5,1) both;pointer-events:none;z-index:3}
@keyframes ccBate{from{transform:scale(4) rotate(-22deg);opacity:0}
  70%{transform:scale(.88) rotate(4deg);opacity:1}
  to{transform:scale(1) rotate(-6deg);opacity:1}}
.cc-tremer{animation:ccTreme .32s .42s ease-in-out}
@keyframes ccTreme{0%,100%{transform:translate(0,0)}
  20%{transform:translate(-9px,4px)}40%{transform:translate(8px,-5px)}
  60%{transform:translate(-6px,-3px)}80%{transform:translate(5px,3px)}}
.cc-faixa{background:linear-gradient(90deg,#ec4899,#f59e0b);color:#fff;font-weight:900;
  padding:.5rem 2.4rem;border-radius:.5rem;font-size:clamp(1rem,3.4vw,1.4rem);
  box-shadow:0 10px 24px rgba(236,72,153,.35);animation:ccFaixa .5s .5s cubic-bezier(.34,1.56,.64,1) both}
@keyframes ccFaixa{from{transform:translateX(60vw) skewX(-12deg);opacity:0}to{transform:none;opacity:1}}

/* 4. folhas — a floresta da Yara cai na tela */
.cc-folhas .cc-berco{animation:ccGira .8s cubic-bezier(.34,1.56,.64,1) both}
@keyframes ccGira{from{transform:rotate(-360deg) scale(.2);opacity:0}
  70%{transform:rotate(0) scale(1.08);opacity:1}
  85%{transform:translateY(-18px) scale(1)}
  to{transform:none;opacity:1}}
.cc-folha{position:absolute;top:-30px;pointer-events:none;animation:ccRodopia linear forwards}
@keyframes ccRodopia{to{transform:translate(var(--vai),105vh) rotate(540deg);opacity:.2}}

/* 5. coroa — a festa de capítulo */
.cc-coroa .cc-berco{animation:ccCresce .6s cubic-bezier(.34,1.56,.64,1) both}
.cc-raios{position:absolute;top:50%;left:50%;width:180vmax;height:180vmax;translate:-50% -50%;
  background:repeating-conic-gradient(from 0deg,rgba(250,204,21,.28) 0deg 12deg,transparent 12deg 24deg);
  animation:ccRoda 9s linear infinite;pointer-events:none}
@keyframes ccRoda{to{transform:rotate(360deg)}}
/* nome próprio para a coroa: cc-coroa já é a classe do OVERLAY desta
   variante, e reusar aqui fazia a regra cair em cima da tela inteira */
.cc-coroa-icone{position:absolute;left:50%;translate:-50% 0;top:-24%;font-size:clamp(2.6rem,11vw,4.5rem);
  animation:ccCoroaCai .7s .45s cubic-bezier(.3,1.7,.5,1) both;pointer-events:none;z-index:3}
@keyframes ccCoroaCai{from{transform:translateY(-60vh) rotate(-30deg);opacity:0}
  75%{transform:translateY(6px) rotate(6deg);opacity:1}
  to{transform:translateY(0) rotate(-4deg);opacity:1}}

/* quem pediu menos movimento vê a mesma festa, parada */
.cc-suave *,.cc-suave{animation:none!important;transition:none!important}
.cc-suave .cc-confete,.cc-suave .cc-folha,.cc-suave .cc-estrela,.cc-suave .cc-onda{display:none}

@media (max-width:640px){.cc-yara{border-width:5px}}`;

    function ligarEstilo() {
        if (document.getElementById('cc-estilo')) return;
        const tag = document.createElement('style');
        tag.id = 'cc-estilo';
        tag.textContent = css;
        document.head.appendChild(tag);
    }
    if (document.head) ligarEstilo();
    else document.addEventListener('DOMContentLoaded', ligarEstilo);

    window.CapyCelebra = { mostrar, variantes: DAS_LICOES.concat('coroa'), ARTE };
})();
