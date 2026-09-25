/**
 * yara-widget.js — a Yara no canto de toda aula: chat escrito e LIGACAO.
 * Config opcional, definida antes deste script:
 *   window.YARA_WIDGET = { lang: 'fr', lessonTitle: 'Les Salutations', lessonNum: 1 }
 *
 * Desde 24/set:
 * - o painel manda ao servidor SO o id da aula ('agro_aula_03'). O material
 *   da aula mora no servidor (api/aulas-contexto.json). Antes o painel montava
 *   um prompt de sistema inteiro no navegador — que o /api/chat ignora, entao
 *   a Yara daqui nunca soube em que aula estava;
 * - o botao 📞 liga para a Yara, que conduz a aula guiada ali mesmo, com a
 *   pagina aberta. O motor de voz (conversa-core.js) so carrega no 1o clique.
 */
(function () {
  const cfg = window.YARA_WIDGET || {};
  const LANG = cfg.lang || 'en';
  const IS_FR = LANG === 'fr';

  // A mesma versao que a ai_chat.html e a entrevista.html carregam. Um teste
  // garante que as tres andam juntas.
  const CORE_SRC = 'conversa-core.js?v=aula20260924';

  // ── Em que aula estamos ──────────────────────────────────────────────────
  // Aula de curso: o proprio nome do arquivo. Trilha (lessons.html): a licao
  // aberta agora — lida NO CLIQUE, porque a trilha troca de licao sem recarregar.
  // `currentLesson` e um `let` de script classico: visivel por nome, sem eval.
  const ARQUIVO_AULA = (location.pathname.match(/\/(([a-z]+_)?aula_\d{1,3})(?:\.html)?$/) || [])[1] || null;
  const NA_TRILHA = /\/lessons(?:\.html)?$/.test(location.pathname);
  const PAGINA_DE_AULA = !!(ARQUIVO_AULA || NA_TRILHA);

  function licaoDaTrilha() {
    try {
      // eslint-disable-next-line no-undef
      if (typeof currentLesson !== 'undefined' && currentLesson && /^\d{1,4}$/.test(String(currentLesson.id))) return currentLesson;
    } catch (e) { /* sem licao aberta */ }
    return null;
  }

  function idDaAula() {
    if (ARQUIVO_AULA) return ARQUIVO_AULA;
    const l = NA_TRILHA && licaoDaTrilha();
    return l ? 'trilha_' + l.id : null;
  }

  function tituloDaAula() {
    const l = NA_TRILHA && licaoDaTrilha();
    if (l && l.title) return String(l.title);
    const h1 = document.querySelector('h1');
    // Os <h1> das aulas quebram linha com <br> ("How Many<br>Hectares?"), e o
    // textContent cola as palavras ("How ManyHectares?"). Troca o <br> por
    // espaco numa copia antes de ler.
    let doH1 = '';
    if (h1) {
      const copia = h1.cloneNode(true);
      copia.querySelectorAll('br').forEach(br => br.replaceWith(' '));
      doH1 = copia.textContent.replace(/[\p{Extended_Pictographic}‍️]/gu, '').replace(/\s+/g, ' ').trim();
    }
    return doH1 || String(cfg.lessonTitle || '');
  }

  // ── Plano ────────────────────────────────────────────────────────────────
  // O chat da Yara e Pro/Super. Reavaliado a cada clique porque o plano pode
  // sincronizar (/api/me) depois do widget carregar. A LIGACAO e do Super, mas
  // isso o servidor decide: aqui ninguem trava nada, so traduz o 403.
  function isPro() {
    try { return typeof Store !== 'undefined' && (Store.state?.planType === 'pro' || Store.state?.planType === 'super'); }
    catch (e) { return false; }
  }

  function showYaraPaywall() {
    if (document.getElementById('yw-paywall')) return;
    const modal = document.createElement('div');
    modal.id = 'yw-paywall';
    modal.style.cssText = 'position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,.6);backdrop-filter:blur(4px);font-family:system-ui,sans-serif;';
    modal.innerHTML = `
      <div style="background:#fff;border-radius:24px;max-width:400px;width:100%;padding:28px;box-shadow:0 12px 60px rgba(0,0,0,.3);position:relative;">
        <button type="button" data-fechar style="position:absolute;top:14px;right:14px;width:32px;height:32px;border-radius:50%;background:#f1f5f9;border:none;color:#64748b;font-weight:900;font-size:18px;cursor:pointer;" aria-label="Fechar">×</button>
        <div style="text-align:center;font-size:56px;margin-bottom:8px;">🔒</div>
        <h2 style="text-align:center;font-weight:900;font-size:22px;color:#0f172a;margin:0 0 6px;">Yara AI Chat é Pro!</h2>
        <p style="text-align:center;color:#64748b;font-size:14px;margin:0 0 22px;line-height:1.5;">
          Converse com a Yara sobre qualquer aula, peça correções, exemplos e explicações em português. Disponível no plano <strong style="color:#f59e0b;">Pro</strong>.
        </p>
        <a href="https://pay.kiwify.com.br/7HYhJgk" target="_blank" rel="noopener" style="display:block;text-align:center;background:linear-gradient(135deg,#f97316,#fb923c);color:#fff;font-weight:900;padding:14px;border-radius:16px;text-decoration:none;margin-bottom:8px;box-shadow:0 6px 24px rgba(249,115,22,.35);">⚡ Assinar Pro · R$47/mês</a>
        <a href="https://pay.kiwify.com.br/lIBOlgZ" target="_blank" rel="noopener" style="display:block;text-align:center;background:linear-gradient(135deg,#14b8a6,#2dd4bf);color:#fff;font-weight:900;padding:12px;border-radius:16px;text-decoration:none;font-size:14px;">🚀 Ou Super · R$97/mês — com ligação por voz</a>
        <p style="text-align:center;color:#94a3b8;font-size:11px;margin:12px 0 0;">Pagamento via Kiwify · Cartão ou Pix · Cancele quando quiser</p>
      </div>`;
    modal.addEventListener('click', e => { if (e.target === modal || e.target.closest('[data-fechar]')) modal.remove(); });
    document.body.appendChild(modal);
  }

  // ── Estilos ──────────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    #yw-fab{position:fixed;bottom:24px;right:24px;z-index:9999;width:58px;height:58px;border-radius:50%;
      background:linear-gradient(135deg,#6d28d9,#4f46e5);box-shadow:0 4px 20px rgba(99,102,241,.45);
      cursor:pointer;display:flex;align-items:center;justify-content:center;
      transition:transform .2s cubic-bezier(.34,1.56,.64,1),box-shadow .2s;border:none;outline:none;}
    #yw-fab:hover{transform:scale(1.1);box-shadow:0 6px 28px rgba(99,102,241,.6);}
    #yw-fab:focus-visible{outline:3px solid #a78bfa;outline-offset:3px;}
    #yw-fab img{width:36px;height:36px;border-radius:50%;object-fit:cover;}
    #yw-fab .yw-pulse{position:absolute;top:-2px;right:-2px;width:14px;height:14px;
      background:#10b981;border-radius:50%;border:2px solid #fff;
      animation:yw-ping 2s ease-in-out infinite;}
    @keyframes yw-ping{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.3);opacity:.7}}
    /* Em chamada com o painel minimizado: anel vermelho pulsando no FAB. */
    #yw-fab.yw-emchamada{box-shadow:0 0 0 4px #ef4444,0 4px 20px rgba(239,68,68,.5);animation:yw-anel 1.6s ease-in-out infinite;}
    @keyframes yw-anel{0%,100%{box-shadow:0 0 0 3px #ef4444,0 4px 20px rgba(239,68,68,.4)}50%{box-shadow:0 0 0 7px rgba(239,68,68,.35),0 4px 20px rgba(239,68,68,.5)}}

    /* Atalho da lousa, ao lado do FAB. Posicao calculada a partir do FAB. */
    #yw-board{position:fixed;bottom:16px;right:86px;z-index:9999;width:50px;height:50px;border-radius:50%;
      background:linear-gradient(135deg,#059669,#10b981);box-shadow:0 4px 18px rgba(16,185,129,.45);
      cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:22px;line-height:1;
      transition:transform .2s cubic-bezier(.34,1.56,.64,1),box-shadow .2s;border:none;outline:none;
      text-decoration:none;}
    #yw-board:hover{transform:scale(1.1);box-shadow:0 6px 26px rgba(16,185,129,.6);}
    #yw-board .yw-board-tip{position:absolute;right:60px;top:50%;transform:translateY(-50%) scale(.9);
      background:#001f3f;color:#fff;font:800 11px/1 system-ui,sans-serif;white-space:nowrap;
      padding:7px 10px;border-radius:9px;opacity:0;pointer-events:none;transition:opacity .18s,transform .18s;}
    #yw-board:hover .yw-board-tip{opacity:1;transform:translateY(-50%) scale(1);}
    @media (max-width:640px){#yw-board .yw-board-tip{display:none}}

    #yw-panel{position:fixed;bottom:96px;right:24px;z-index:9998;width:340px;max-height:520px;
      background:#fff;border-radius:24px;box-shadow:0 8px 40px rgba(0,0,0,.18);
      display:flex;flex-direction:column;overflow:hidden;font-family:system-ui,-apple-system,sans-serif;
      transform:scale(.85) translateY(12px);opacity:0;pointer-events:none;visibility:hidden;
      transition:transform .25s cubic-bezier(.34,1.56,.64,1),opacity .2s,visibility 0s .25s;}
    #yw-panel.open{transform:scale(1) translateY(0);opacity:1;pointer-events:all;visibility:visible;
      transition:transform .25s cubic-bezier(.34,1.56,.64,1),opacity .2s,visibility 0s;}

    #yw-header{background:linear-gradient(135deg,#6d28d9,#4f46e5);padding:12px 12px 12px 16px;
      display:flex;align-items:center;gap:10px;flex-shrink:0;}
    #yw-header img{width:34px;height:34px;border-radius:50%;object-fit:cover;border:2px solid rgba(255,255,255,.4);flex-shrink:0;}
    #yw-header .yw-id{min-width:0;flex:1;}
    #yw-header .yw-name{color:#fff;font-weight:900;font-size:14px;line-height:1.2;}
    #yw-header .yw-sub{color:rgba(255,255,255,.75);font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
    #yw-header button{background:rgba(255,255,255,.15);border:none;color:#fff;flex-shrink:0;
      width:36px;height:36px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s;}
    #yw-header button:hover{background:rgba(255,255,255,.3);}
    #yw-header button:focus-visible{outline:2px solid #fff;outline-offset:2px;}
    #yw-header button svg{width:18px;height:18px;}
    #yw-call{background:#10b981 !important;}
    #yw-call:hover{background:#059669 !important;}
    #yw-call[disabled]{opacity:.55;cursor:default;}

    #yw-aula-bar{background:#f5f3ff;border-bottom:1px solid #e5e7eb;padding:7px 14px;
      font-size:11px;color:#6d28d9;font-weight:700;display:flex;align-items:center;gap:8px;flex-shrink:0;}
    #yw-aula-bar .yw-aula-nome{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
    #yw-aula-bar a{color:#7c3aed;font-weight:800;white-space:nowrap;text-decoration:underline;}

    #yw-callbar{background:#ecfdf5;border-bottom:1px solid #a7f3d0;padding:8px 12px;flex-shrink:0;
      display:flex;flex-wrap:wrap;align-items:center;gap:8px;font-size:12px;color:#065f46;font-weight:700;}
    #yw-callbar[hidden]{display:none;}
    #yw-call-dot{width:9px;height:9px;border-radius:50%;background:#10b981;flex-shrink:0;animation:yw-ping 1.4s ease-in-out infinite;}
    #yw-call-estado{flex:1;min-width:0;}
    #yw-call-tempo{font-variant-numeric:tabular-nums;color:#047857;}
    #yw-callbar button{border:none;border-radius:999px;cursor:pointer;font-weight:800;font-size:12px;min-height:34px;padding:0 12px;}
    #yw-mute{background:#d1fae5;color:#065f46;}
    #yw-mute[aria-pressed="true"]{background:#fef3c7;color:#92400e;}
    #yw-hangup{background:#ef4444;color:#fff;}
    #yw-callbar .yw-dica{flex-basis:100%;font-size:10.5px;font-weight:600;color:#047857;opacity:.85;}

    #yw-messages{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;
      scroll-behavior:smooth;min-height:120px;}
    #yw-messages::-webkit-scrollbar{width:4px;}
    #yw-messages::-webkit-scrollbar-thumb{background:#e5e7eb;border-radius:4px;}

    .yw-msg{max-width:86%;font-size:13px;line-height:1.5;padding:10px 13px;border-radius:18px;word-break:break-word;}
    .yw-msg.user{align-self:flex-end;background:#6d28d9;color:#fff;border-bottom-right-radius:5px;}
    .yw-msg.yara{align-self:flex-start;background:#f1f5f9;color:#1e293b;border-bottom-left-radius:5px;}
    .yw-msg.typing{color:#94a3b8;font-style:italic;}
    .yw-msg.yw-voz::before{content:'🎙 ';opacity:.7;}
    .yw-msg.yw-viva{opacity:.75;}
    .yw-msg.yw-aviso{align-self:center;background:#fff7ed;color:#9a3412;border:1px solid #fed7aa;font-size:12px;text-align:center;max-width:94%;}
    .yw-msg.yw-aviso a{color:#c2410c;font-weight:800;}

    #yw-input-row{display:flex;gap:8px;padding:12px 14px;border-top:1px solid #f1f5f9;flex-shrink:0;}
    #yw-input{flex:1;border:1.5px solid #e2e8f0;border-radius:12px;padding:9px 12px;
      font-size:16px;outline:none;resize:none;font-family:inherit;max-height:80px;overflow-y:auto;
      transition:border-color .15s;min-width:0;}
    @media (min-width:641px){#yw-input{font-size:13px;}}
    #yw-input:focus{border-color:#6d28d9;}
    #yw-input:disabled{background:#f8fafc;}
    #yw-send{background:#6d28d9;color:#fff;border:none;border-radius:12px;width:40px;height:40px;
      cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;
      transition:background .15s,transform .1s;}
    #yw-send:hover{background:#5b21b6;}
    #yw-send:active{transform:scale(.93);}
    #yw-send:disabled{opacity:.5;cursor:default;}
    #yw-send svg{width:16px;height:16px;}
  `;
  document.head.appendChild(style);

  // ── HTML ─────────────────────────────────────────────────────────────────
  const avatarSrc = 'yara-avatar.png?v=3';
  const ON_BOARD_PAGE = /\/quadro\.html$/.test(location.pathname);
  const ICONE_TELEFONE = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z"/></svg>';

  const container = document.createElement('div');
  container.innerHTML = `
    <button id="yw-fab" type="button" title="Falar com a Yara" aria-label="Falar com a Yara">
      <img src="${avatarSrc}" alt=""/>
      <span class="yw-pulse"></span>
    </button>
    ${ON_BOARD_PAGE ? '' : `<a id="yw-board" href="quadro.html" title="Quadro branco ao vivo" aria-label="Abrir o quadro branco ao vivo">
      📝<span class="yw-board-tip">Quadro ao vivo</span>
    </a>`}
    <div id="yw-panel" role="dialog" aria-label="Yara" aria-hidden="true">
      <div id="yw-header">
        <img src="${avatarSrc}" alt=""/>
        <div class="yw-id">
          <div class="yw-name">Yara ✨</div>
          <div class="yw-sub" id="yw-sub"></div>
        </div>
        ${PAGINA_DE_AULA ? `<button id="yw-call" type="button" aria-label="Ligar para a Yara e praticar esta aula" title="Ligar e praticar esta aula">${ICONE_TELEFONE}</button>` : ''}
        <button id="yw-close" type="button" aria-label="Fechar">✕</button>
      </div>
      <div id="yw-aula-bar" hidden>
        <span class="yw-aula-nome" id="yw-aula-nome"></span>
        <a href="onboarding.html?editar=1" id="yw-sobre">O que ela sabe de você</a>
      </div>
      <div id="yw-callbar" hidden>
        <span id="yw-call-dot" aria-hidden="true"></span>
        <span id="yw-call-estado" role="status" aria-live="polite">Chamando a Yara…</span>
        <span id="yw-call-tempo">00:00</span>
        <button id="yw-mute" type="button" aria-pressed="false">Silenciar</button>
        <button id="yw-hangup" type="button">Desligar</button>
        <span class="yw-dica">🎧 Use fone de ouvido: o som da aula pode entrar no microfone.</span>
      </div>
      <div id="yw-messages" aria-live="polite"></div>
      <div id="yw-input-row">
        <textarea id="yw-input" rows="1" aria-label="Mensagem para a Yara"></textarea>
        <button id="yw-send" type="button" aria-label="Enviar">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(container);
  // Avatar quebrado vira a patinha — por listener, nao por atributo inline
  // (a CSP de algumas paginas proibe handler em atributo).
  container.querySelectorAll('img').forEach(img => img.addEventListener('error', () => {
    const pai = img.parentElement;
    img.remove();
    if (pai && pai.id === 'yw-fab') pai.insertAdjacentText('afterbegin', '🐾');
  }, { once: true }));

  // ── Estado e referencias ─────────────────────────────────────────────────
  let isOpen = false;
  let isLoading = false;
  const history = [];
  const $ = id => document.getElementById(id);
  const fab = $('yw-fab'), panel = $('yw-panel'), closeBtn = $('yw-close');
  const msgArea = $('yw-messages'), input = $('yw-input'), sendBtn = $('yw-send');
  const callBtn = $('yw-call'), callbar = $('yw-callbar');
  const estadoEl = $('yw-call-estado'), tempoEl = $('yw-call-tempo');
  const muteBtn = $('yw-mute'), hangupBtn = $('yw-hangup');

  input.placeholder = PAGINA_DE_AULA
    ? (IS_FR ? 'Pergunte sobre a aula de francês…' : 'Pergunte sobre esta aula…')
    : 'Pergunte qualquer coisa à Yara…';

  function atualizarCabecalho() {
    const titulo = PAGINA_DE_AULA ? tituloDaAula() : '';
    $('yw-sub').textContent = titulo || (IS_FR ? 'Francês com a Yara' : 'Inglês com a Yara');
    const barra = $('yw-aula-bar');
    barra.hidden = !(PAGINA_DE_AULA && titulo);
    $('yw-aula-nome').textContent = titulo ? '📘 Nesta aula: ' + titulo : '';
  }
  atualizarCabecalho();

  // ── Posicao: fugir da barra do celular e nao cobrir o FAB ────────────────
  // O menu de baixo do celular (~82px) e MEDIDO, nao chutado: continua certo se
  // ele mudar, e onde nao ha menu os botoes voltam ao canto de sempre.
  const FOLGA = 16;
  const ESTREITO = () => innerWidth <= 640;

  function alturaDoMenuDeBaixo() {
    let maior = 0;
    const candidatos = document.querySelectorAll('nav, footer, [class*="bottom-0"]');
    for (const el of candidatos) {
      if (el.id && el.id.indexOf('yw-') === 0) continue;
      const s = getComputedStyle(el);
      if (s.position !== 'fixed' || s.display === 'none' || s.visibility === 'hidden') continue;
      const r = el.getBoundingClientRect();
      if (r.height < 30 || r.width < innerWidth * 0.7) continue;
      if (innerHeight - r.bottom > 4) continue;
      if (r.height > innerHeight * 0.4) continue;
      if (r.height > maior) maior = r.height;
    }
    return maior;
  }

  function posicionarAtalho() {
    const board = $('yw-board');
    if (!board || !fab) return;
    const f = getComputedStyle(fab);
    const fBottom = parseFloat(f.bottom) || 0;
    const fRight = parseFloat(f.right) || 0;
    const fW = fab.offsetWidth || 58, fH = fab.offsetHeight || 58, bH = board.offsetHeight || 50;
    board.style.right = (fRight + fW + 12) + 'px';
    board.style.bottom = (fBottom + (fH - bH) / 2) + 'px';
  }

  // O painel era fixo em bottom:96px. No celular o FAB sobe para ~98px (acima
  // do menu) e o painel aberto ficava POR CIMA dele. Agora: no celular o painel
  // ocupa a largura e os botoes flutuantes somem enquanto ele esta aberto; no
  // computador ele nasce acima do FAB, onde quer que o FAB esteja.
  function posicionarPainel() {
    const altura = (window.visualViewport && window.visualViewport.height) || innerHeight;
    if (ESTREITO()) {
      const baixo = alturaDoMenuDeBaixo() + 8;
      panel.style.left = '8px';
      panel.style.right = '8px';
      panel.style.width = 'auto';
      panel.style.bottom = baixo + 'px';
      panel.style.maxHeight = Math.max(260, Math.min(560, altura - baixo - 64)) + 'px';
    } else {
      const fBottom = parseFloat(fab.style.bottom) || parseFloat(getComputedStyle(fab).bottom) || 24;
      const baixo = fBottom + (fab.offsetHeight || 58) + 14;
      panel.style.left = '';
      panel.style.width = '';
      panel.style.right = getComputedStyle(fab).right;
      panel.style.bottom = baixo + 'px';
      panel.style.maxHeight = Math.max(260, Math.min(560, altura - baixo - 16)) + 'px';
    }
  }

  function posicionarFlutuantes() {
    if (!fab) return;
    fab.style.bottom = (FOLGA + alturaDoMenuDeBaixo()) + 'px';
    posicionarAtalho();
    posicionarPainel();
    sincronizarVisibilidade();
  }

  // ── Visibilidade: modais, painel aberto no celular, chamada ──────────────
  // O projeto inteiro usa o MESMO padrao de modal (.fixed.inset-0 alternando
  // .hidden); vigiar o padrao cobre todo modal atual e futuro. #levelup-overlay
  // fica display:flex o tempo todo por design e usa .hidden-overlay — sem
  // excluir, os botoes ficariam escondidos para sempre.
  //
  // E so conta modal que esta NA TELA: a trilha (lessons.html) tem um
  // #guided-complete-overlay escondido por display:none, sem a classe .hidden.
  // Pelo seletor sozinho ele "estava aberto" o tempo todo, e o botao da Yara
  // ficava invisivel e sem clique na trilha inteira.
  function haModalAberto() {
    const candidatos = document.querySelectorAll('.fixed.inset-0:not(.hidden):not(#levelup-overlay), #vf-overlay.vf-aberto, #yw-paywall');
    for (const el of candidatos) {
      const s = getComputedStyle(el);
      if (s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0') return true;
    }
    return false;
  }

  function sincronizarVisibilidade() {
    const modal = haModalAberto();
    // Modal abriu com o painel aberto e SEM chamada: fecha o painel (ele ficaria
    // por cima do modal). Durante a chamada o painel fica — e o controle dela.
    if (modal && isOpen && !emChamada() && !document.getElementById('yw-paywall')) fecharPainel();
    const esconder = modal || (isOpen && ESTREITO());
    for (const id of ['yw-fab', 'yw-board']) {
      const el = $(id);
      if (!el) continue;
      el.style.opacity = esconder ? '0' : '';
      el.style.pointerEvents = esconder ? 'none' : '';
    }
  }

  // ── Mensagens ────────────────────────────────────────────────────────────
  function rolar() { msgArea.scrollTop = msgArea.scrollHeight; }

  function addMsg(role, text) {
    const div = document.createElement('div');
    div.className = `yw-msg ${role}`;
    div.textContent = text;
    msgArea.appendChild(div);
    rolar();
    return div;
  }

  // Aviso com um link opcional. Montado com textContent: nada do servidor vira HTML.
  function addAviso(texto, link) {
    const div = addMsg('yw-aviso', texto);
    if (link) {
      div.appendChild(document.createTextNode(' '));
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.texto;
      div.appendChild(a);
    }
    rolar();
    return div;
  }

  function addGreeting() {
    const titulo = PAGINA_DE_AULA ? tituloDaAula() : '';
    if (titulo) {
      addMsg('yara', `Oi! 👋 Estou nesta aula com você: “${titulo}”. Tire suas dúvidas por escrito — ou toque no 📞 e a gente pratica a aula em voz alta.`);
    } else {
      addMsg('yara', 'Oi! 👋 Sou a Yara. Pode me pedir correções, explicações de gramática ou exemplos — em português mesmo.');
    }
  }

  // ── Chat escrito ─────────────────────────────────────────────────────────
  async function send() {
    const text = input.value.trim();
    if (!text || isLoading || emChamada()) return;
    input.value = '';
    input.style.height = 'auto';
    addMsg('user', text);

    isLoading = true;
    sendBtn.disabled = true;
    const typingEl = addMsg('yara typing', 'A Yara está pensando…');
    const aula = PAGINA_DE_AULA ? idDaAula() : null;
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        // So o id da aula: o material mora no servidor.
        body: JSON.stringify(aula ? { message: text, history, aula } : { message: text, history }),
      });
      const data = await res.json().catch(() => null);
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text
        || (typeof data?.error?.message === 'string' ? data.error.message : '')
        || (typeof data?.message === 'string' ? data.message : '')
        || 'Desculpe, algo deu errado. Tente de novo.';
      typingEl.classList.remove('typing');
      typingEl.textContent = reply;
      if (res.ok) {
        history.push({ role: 'user', text });
        history.push({ role: 'model', text: reply });
        if (history.length > 20) history.splice(0, history.length - 20);
      }
    } catch (e) {
      typingEl.classList.remove('typing');
      typingEl.textContent = 'Ops! A conexão caiu. Tente de novo.';
    }
    isLoading = false;
    sendBtn.disabled = emChamada();
  }

  // ── Ligacao ──────────────────────────────────────────────────────────────
  let chamada = null;
  let corePromessa = null;
  let aulaDaLigacao = null;
  const vivas = new Map();

  const ROTULOS = {
    microfone: 'Pedindo o microfone…',
    conectando: 'Chamando a Yara…',
    ouvindo: 'Pode falar',
    falando: 'Ouvindo você…',
    pensando: 'Pensando…',
    ia_falando: 'Yara falando…',
    desconectado: 'Chamada encerrada',
  };

  function emChamada() { return !!(chamada && (chamada.ligado() || chamada.pendente())); }

  function carregarCore() {
    if (typeof window.CapyChamada === 'function') return Promise.resolve();
    if (!corePromessa) {
      corePromessa = new Promise((ok, falha) => {
        const s = document.createElement('script');
        s.src = CORE_SRC;
        s.async = true;
        s.onload = () => (typeof window.CapyChamada === 'function' ? ok() : falha(new Error('core')));
        s.onerror = () => falha(new Error('core'));
        document.head.appendChild(s);
      }).catch(e => { corePromessa = null; throw e; });
    }
    return corePromessa;
  }

  function mmss(ms) {
    const t = Math.max(0, Math.floor((ms || 0) / 1000));
    return String(Math.floor(t / 60)).padStart(2, '0') + ':' + String(t % 60).padStart(2, '0');
  }

  function controles() {
    const ativa = emChamada();
    callbar.hidden = !ativa;
    if (callBtn) callBtn.disabled = ativa;
    input.disabled = ativa;
    sendBtn.disabled = ativa || isLoading;
    input.placeholder = ativa ? 'Em ligação — fale com a Yara' : (PAGINA_DE_AULA ? 'Pergunte sobre esta aula…' : 'Pergunte qualquer coisa à Yara…');
    const ligada = !!(chamada && chamada.ligado());
    muteBtn.disabled = !ligada;
    const mudo = !!(chamada && chamada.mudo());
    muteBtn.setAttribute('aria-pressed', mudo ? 'true' : 'false');
    muteBtn.textContent = mudo ? 'Microfone mudo' : 'Silenciar';
    if (!ativa) {
      fab.classList.remove('yw-emchamada');
      fab.setAttribute('aria-label', 'Falar com a Yara');
    }
  }

  // Uma linha por fala, chaveada pelo id do item: os deltas vao crescendo a
  // mesma linha, e o texto final a FINALIZA em vez de criar outra.
  function linhaDe(quem, id) {
    if (id && vivas.has(id)) return vivas.get(id);
    const div = addMsg((quem === 'eu' ? 'user' : 'yara') + ' yw-voz yw-viva', '');
    if (id) vivas.set(id, div);
    return div;
  }

  // O custo e gravado SEMPRE, em todo desligamento, por sendBeacon (sobrevive
  // ao unload). Mesmo desenho da ai_chat.html e da entrevista.html.
  function registrarUso(uso, duracaoMs) {
    try {
      const corpo = JSON.stringify({ cenario: 'aula:' + (aulaDaLigacao || 'desconhecida'), uso, duracaoMs });
      const blob = new Blob([corpo], { type: 'application/json' });
      if (!(navigator.sendBeacon && navigator.sendBeacon('/api/conversa-uso', blob))) {
        fetch('/api/conversa-uso', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: corpo, keepalive: true,
        }).catch(() => {});
      }
    } catch (_) { /* medir e bonus: nunca atrapalha o aluno */ }
  }

  function criarChamada() {
    return window.CapyChamada({
      aoEstado(estado) {
        estadoEl.textContent = ROTULOS[estado] || '';
        controles();
      },
      aoUso() { if (chamada) tempoEl.textContent = mmss(chamada.decorridoMs()); },
      aoFalaParcial(quem, texto, id) {
        const div = linhaDe(quem, id);
        div.textContent = texto;
        rolar();
      },
      aoFala(quem, texto, id) {
        const div = linhaDe(quem, id);
        div.textContent = texto;
        div.classList.remove('yw-viva');
        if (id) vivas.delete(id);
        // Entra no historico do chat escrito: desliga, digita "como escreve
        // isso?", e ela sabe do que se trata.
        history.push({ role: quem === 'eu' ? 'user' : 'model', text: texto });
        if (history.length > 20) history.splice(0, history.length - 20);
        rolar();
      },
      aoErro(mensagem, info) {
        const erro = info && info.erro;
        if (erro === 'plano_sem_voz') {
          addAviso('A ligação com a Yara faz parte do plano Super.', { href: 'account.html', texto: 'Ver planos' });
        } else if (erro === 'cota_de_voz') {
          addAviso('Você já usou os minutos de ligação deste mês. Eles renovam no dia 1º.');
        } else if (info && info.status === 401) {
          addAviso('Entre na sua conta para ligar para a Yara.', { href: '4_Login_Capy_Yara_Welcomes_You.html', texto: 'Entrar' });
        } else {
          addAviso(String(mensagem || 'Não foi possível ligar agora. Tente de novo.'));
        }
        controles();
      },
      aoDesligar(motivo, dados) {
        for (const div of vivas.values()) div.classList.remove('yw-viva');
        vivas.clear();
        if (dados) registrarUso(dados.uso, dados.duracaoMs);
        const porque = { silencio: 'A ligação caiu depois de 3 minutos em silêncio.', tempo: 'A ligação chegou ao limite de 15 minutos.' }[motivo];
        addAviso((porque ? porque + ' ' : '') + 'Ligação encerrada. Se quiser, continue por escrito — eu lembro do que conversamos.');
        controles();
        estadoEl.textContent = '';
      },
    });
  }

  async function ligar() {
    if (emChamada()) return;
    const aula = idDaAula();
    if (!aula) {
      addAviso('Abra uma lição para ligar e praticar com a Yara.');
      return;
    }
    aulaDaLigacao = aula;
    if (callBtn) callBtn.disabled = true;
    try {
      await carregarCore();
    } catch (e) {
      addAviso('Não consegui carregar a ligação. Confira sua internet e tente de novo.');
      if (callBtn) callBtn.disabled = false;
      return;
    }
    if (!chamada) chamada = criarChamada();
    tempoEl.textContent = '00:00';
    estadoEl.textContent = ROTULOS.conectando;
    callbar.hidden = false;
    // So o id: a aula (e a persona) quem decide e o servidor.
    const promessa = chamada.ligar({ aula });
    controles();
    await promessa;
    controles();
  }

  // ── Abrir, fechar, minimizar ─────────────────────────────────────────────
  function abrirPainel() {
    isOpen = true;
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    fab.classList.remove('yw-emchamada');
    atualizarCabecalho();
    posicionarPainel();
    if (msgArea.children.length === 0) addGreeting();
    const pulse = fab.querySelector('.yw-pulse');
    if (pulse) pulse.style.display = 'none';
    sincronizarVisibilidade();
    if (!emChamada() && !ESTREITO()) setTimeout(() => input.focus(), 300);
  }

  // Durante a chamada, fechar so MINIMIZA: a ligacao continua e o FAB ganha o
  // anel vermelho ("em chamada — toque para abrir").
  function fecharPainel() {
    isOpen = false;
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    if (emChamada()) {
      fab.classList.add('yw-emchamada');
      fab.setAttribute('aria-label', 'Em ligação com a Yara — abrir');
    }
    sincronizarVisibilidade();
  }

  fab.addEventListener('click', e => {
    e.stopPropagation();
    if (!isPro() && !emChamada()) { showYaraPaywall(); return; }
    if (isOpen) fecharPainel(); else abrirPainel();
  });
  closeBtn.addEventListener('click', e => { e.stopPropagation(); fecharPainel(); });
  panel.addEventListener('click', e => e.stopPropagation());
  if (callBtn) callBtn.addEventListener('click', e => { e.stopPropagation(); ligar(); });
  hangupBtn.addEventListener('click', () => { if (chamada) chamada.desligar('manual'); });
  muteBtn.addEventListener('click', () => { if (chamada) { chamada.silenciar(!chamada.mudo()); controles(); } });
  sendBtn.addEventListener('click', send);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  });
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 80) + 'px';
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen) fecharPainel(); });
  // Clique fora fecha — mas na chamada o painel e o controle dela, entao fica.
  document.addEventListener('click', e => {
    if (isOpen && !emChamada() && !panel.contains(e.target) && !fab.contains(e.target)) fecharPainel();
  });

  posicionarFlutuantes();
  window.addEventListener('resize', posicionarFlutuantes);
  if (window.visualViewport) window.visualViewport.addEventListener('resize', posicionarPainel);
  // O menu e injetado pelo components.js depois deste script; uma segunda
  // passada garante que a medida pegue a barra ja montada.
  setTimeout(posicionarFlutuantes, 400);
  setTimeout(posicionarFlutuantes, 1500);
  // Classe e style: e assim que os modais do site abrem e fecham (a maioria
  // troca .hidden; o da trilha troca display). Mudanca DENTRO do widget e
  // ignorada — ele mexe no proprio style e entraria em laco. Nao vigia
  // childList: dispararia a cada palavra da transcricao ao vivo.
  new MutationObserver(registros => {
    if (registros.some(r => !container.contains(r.target))) sincronizarVisibilidade();
  }).observe(document.body, { attributes: true, attributeFilter: ['class', 'style'], subtree: true });

  window.openYaraChat = () => { if (!isOpen) abrirPainel(); };
  // Para testes e diagnostico: em que aula o painel acha que esta.
  window.CapyYaraWidget = { aula: idDaAula, titulo: tituloDaAula };
})();
