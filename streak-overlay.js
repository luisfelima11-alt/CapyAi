/**
 * Streak Celebration Overlay
 * Mostra a Yara celebrando (vídeo Kling em loop, fallback imagem) quando o
 * aluno atinge um marco de streak. Escuta o evento 'streakMilestone' que o
 * store.js já dispara em checkStreakMilestone() (dias 3/7/14/30).
 * Incluir depois de store.js: <script src="streak-overlay.js?v=1"></script>
 */
(function () {
    let injected = false;
    let hasVideo = false;

    function inject() {
        if (injected) return;
        injected = true;

        const style = document.createElement('style');
        style.textContent = `
          #streak-overlay { position:fixed; inset:0; z-index:9999; display:none;
            align-items:center; justify-content:center; background:rgba(0,10,25,.72);
            backdrop-filter:blur(6px); }
          #streak-overlay.show { display:flex; }
          #streak-card { position:relative; width:min(92vw,380px); border-radius:2rem;
            overflow:hidden; box-shadow:0 24px 80px rgba(236,72,153,.35);
            border:2px solid rgba(251,146,60,.5); background:#001f3f;
            transform:scale(.85); opacity:0; transition:all .45s cubic-bezier(.34,1.56,.64,1); }
          #streak-overlay.show #streak-card { transform:scale(1); opacity:1; }
          .streak-media { width:100%; aspect-ratio:1/1; object-fit:cover; display:block; }
          #streak-info { padding:18px 20px 22px; text-align:center;
            font-family:'Plus Jakarta Sans',sans-serif; }
          #streak-days { font-size:2.4rem; font-weight:900; color:#fb923c; line-height:1; }
          #streak-msg { color:#fff; font-weight:700; font-size:.95rem; margin-top:6px; }
          #streak-btn { margin-top:14px; background:linear-gradient(135deg,#ec4899,#f43f5e);
            color:#fff; font-weight:900; border:0; border-radius:999px; padding:12px 34px;
            font-size:1rem; cursor:pointer; font-family:inherit; transition:transform .15s; }
          #streak-btn:active { transform:scale(.94); }
          @media (prefers-reduced-motion: reduce) {
            #streak-card { transition:none; }
          }
        `;
        document.head.appendChild(style);

        const el = document.createElement('div');
        el.id = 'streak-overlay';
        el.innerHTML = `
          <div id="streak-card">
            <video id="streak-video" class="streak-media" loop muted playsinline
                   poster="yara-streak.jpg" style="display:none"></video>
            <img id="streak-img" class="streak-media" src="yara-streak.jpg" alt="Yara celebrando"/>
            <div id="streak-info">
              <div id="streak-days">🔥 0</div>
              <div id="streak-msg"></div>
              <button id="streak-btn">Continuar! 🎉</button>
            </div>
          </div>`;
        document.body.appendChild(el);

        // Vídeo só quando a conexão aguenta. Ele tem 5,7MB, e este overlay
        // aparece para aluno que quase sempre está no celular, muitas vezes no
        // 4G. A imagem (72KB) já entrega a comemoração; o vídeo é o luxo.
        //
        // `saveData` é o aluno pedindo explicitamente para economizar dados —
        // respeitar isso não é opcional. `effectiveType` cobre 2g/3g, onde
        // baixar 5,7MB deixaria o cartão parado esperando.
        const rede = navigator.connection || {};
        const conexaoBoa = !rede.saveData && !/(^|-)2g$|^3g$/.test(rede.effectiveType || '');

        if (conexaoBoa) {
            fetch('yara-streak.mp4', { method: 'HEAD' }).then(r => {
                if (r.ok) {
                    const vid = document.getElementById('streak-video');
                    vid.src = 'yara-streak.mp4';
                    vid.style.display = 'block';
                    document.getElementById('streak-img').style.display = 'none';
                    hasVideo = true;
                }
            }).catch(() => {});
        }

        el.querySelector('#streak-btn').addEventListener('click', () => {
            el.classList.remove('show');
            if (hasVideo) document.getElementById('streak-video').pause();
        });
    }

    function show(days, msg) {
        inject();
        const el = document.getElementById('streak-overlay');
        el.querySelector('#streak-days').textContent = `🔥 ${days} dias`;
        el.querySelector('#streak-msg').textContent = msg || 'Sua streak está pegando fogo!';
        if (hasVideo) {
            const v = document.getElementById('streak-video');
            v.currentTime = 0;
            v.play().catch(() => {});
        }
        requestAnimationFrame(() => el.classList.add('show'));
        if (window.CapySound) (CapySound.fanfare || CapySound.correct).call(CapySound);
        if (window.CapyJuice) CapyJuice.celebrate();
    }

    document.addEventListener('streakMilestone', (e) => {
        show(e.detail.days, e.detail.msg);
    });

    window.StreakOverlay = { show };
})();
