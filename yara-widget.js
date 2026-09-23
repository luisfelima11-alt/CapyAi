/**
 * yara-widget.js — Floating Yara AI chat widget
 * Drop-in for any lesson page. Reads page context automatically.
 * Config (optional, set before loading this script):
 *   window.YARA_WIDGET = { lang: 'fr', lessonTitle: 'Les Salutations', lessonNum: 1 }
 */
(function () {
  const cfg = window.YARA_WIDGET || {};
  const LANG         = cfg.lang || 'en';
  const LESSON_TITLE = cfg.lessonTitle || document.title || 'Lesson';
  const LESSON_NUM   = cfg.lessonNum   || '';
  const IS_FR        = LANG === 'fr';

  // ── Plan gating ──────────────────────────────────────────────────────────────
  // Yara AI Chat is a Pro/Super feature. Free users see a locked stub that
  // opens the paywall. We re-evaluate on every FAB click in case the plan
  // sync from /api/me happens after the widget initially loads.
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
        <button onclick="document.getElementById('yw-paywall').remove()" style="position:absolute;top:14px;right:14px;width:32px;height:32px;border-radius:50%;background:#f1f5f9;border:none;color:#64748b;font-weight:900;font-size:18px;cursor:pointer;">×</button>
        <div style="text-align:center;font-size:56px;margin-bottom:8px;">🔒</div>
        <h2 style="text-align:center;font-weight:900;font-size:22px;color:#0f172a;margin:0 0 6px;">Yara AI Chat é Pro!</h2>
        <p style="text-align:center;color:#64748b;font-size:14px;margin:0 0 22px;line-height:1.5;">
          Converse com a Yara sobre qualquer aula, peça correções, exemplos e explicações em português. Disponível no plano <strong style="color:#f59e0b;">Pro</strong>.
        </p>
        <a href="https://pay.kiwify.com.br/7HYhJgk" target="_blank" style="display:block;text-align:center;background:linear-gradient(135deg,#f97316,#fb923c);color:#fff;font-weight:900;padding:14px;border-radius:16px;text-decoration:none;margin-bottom:8px;box-shadow:0 6px 24px rgba(249,115,22,.35);">⚡ Assinar Pro · R$47/mês</a>
        <a href="https://pay.kiwify.com.br/lIBOlgZ" target="_blank" style="display:block;text-align:center;background:linear-gradient(135deg,#14b8a6,#2dd4bf);color:#fff;font-weight:900;padding:12px;border-radius:16px;text-decoration:none;font-size:14px;">🚀 Ou Super · R$97/mês</a>
        <p style="text-align:center;color:#94a3b8;font-size:11px;margin:12px 0 0;">Pagamento via Kiwify · Cartão ou Pix · Cancele quando quiser</p>
      </div>`;
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
    document.body.appendChild(modal);
  }

  // ── Styles ──────────────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    #yw-fab{position:fixed;bottom:24px;right:24px;z-index:9999;width:58px;height:58px;border-radius:50%;
      background:linear-gradient(135deg,#6d28d9,#4f46e5);box-shadow:0 4px 20px rgba(99,102,241,.45);
      cursor:pointer;display:flex;align-items:center;justify-content:center;
      transition:transform .2s cubic-bezier(.34,1.56,.64,1),box-shadow .2s;border:none;outline:none;}
    #yw-fab:hover{transform:scale(1.1);box-shadow:0 6px 28px rgba(99,102,241,.6);}
    #yw-fab img{width:36px;height:36px;border-radius:50%;object-fit:cover;}
    #yw-fab .yw-pulse{position:absolute;top:-2px;right:-2px;width:14px;height:14px;
      background:#10b981;border-radius:50%;border:2px solid #fff;
      animation:yw-ping 2s ease-in-out infinite;}
    @keyframes yw-ping{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.3);opacity:.7}}

    /* Atalho da lousa, ao lado do chat da Yara. A posição exata é calculada em
       tempo de execução a partir do próprio FAB (posicionarAtalho), porque
       algumas páginas sobrescrevem o bottom/right padrão do widget. */
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
      display:flex;flex-direction:column;overflow:hidden;
      transform:scale(.85) translateY(12px);opacity:0;pointer-events:none;
      transition:transform .25s cubic-bezier(.34,1.56,.64,1),opacity .2s;}
    #yw-panel.open{transform:scale(1) translateY(0);opacity:1;pointer-events:all;}

    #yw-header{background:linear-gradient(135deg,#6d28d9,#4f46e5);padding:14px 16px;
      display:flex;align-items:center;gap:10px;flex-shrink:0;}
    #yw-header img{width:34px;height:34px;border-radius:50%;object-fit:cover;border:2px solid rgba(255,255,255,.4);}
    #yw-header .yw-name{color:#fff;font-weight:900;font-size:14px;line-height:1.2;}
    #yw-header .yw-sub{color:rgba(255,255,255,.7);font-size:11px;}
    #yw-header .yw-close{margin-left:auto;background:rgba(255,255,255,.15);border:none;color:#fff;
      width:28px;height:28px;border-radius:50%;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;transition:background .15s;}
    #yw-header .yw-close:hover{background:rgba(255,255,255,.3);}

    #yw-ctx-bar{background:#f5f3ff;border-bottom:1px solid #e5e7eb;padding:8px 14px;
      font-size:11px;color:#7c3aed;font-weight:700;display:flex;align-items:center;gap-6px;
      flex-shrink:0;cursor:pointer;user-select:none;}
    #yw-ctx-bar:hover{background:#ede9fe;}

    #yw-messages{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;
      scroll-behavior:smooth;}
    #yw-messages::-webkit-scrollbar{width:4px;}
    #yw-messages::-webkit-scrollbar-thumb{background:#e5e7eb;border-radius:4px;}

    .yw-msg{max-width:84%;font-size:13px;line-height:1.5;padding:10px 13px;border-radius:18px;word-break:break-word;}
    .yw-msg.user{align-self:flex-end;background:#6d28d9;color:#fff;border-bottom-right-radius:5px;}
    .yw-msg.yara{align-self:flex-start;background:#f1f5f9;color:#1e293b;border-bottom-left-radius:5px;}
    .yw-msg.typing{color:#94a3b8;font-style:italic;}

    #yw-ctx-preview{background:#faf5ff;border:1px solid #e9d5ff;border-radius:12px;
      padding:10px 12px;font-size:11px;color:#6b21a8;margin:0 14px 8px;
      max-height:80px;overflow-y:auto;display:none;white-space:pre-wrap;line-height:1.5;}
    #yw-ctx-preview.visible{display:block;}

    #yw-input-row{display:flex;gap:8px;padding:12px 14px;border-top:1px solid #f1f5f9;flex-shrink:0;}
    #yw-input{flex:1;border:1.5px solid #e2e8f0;border-radius:12px;padding:9px 12px;
      font-size:13px;outline:none;resize:none;font-family:inherit;max-height:80px;overflow-y:auto;
      transition:border-color .15s;}
    #yw-input:focus{border-color:#6d28d9;}
    #yw-send{background:#6d28d9;color:#fff;border:none;border-radius:12px;width:38px;height:38px;
      cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;
      transition:background .15s,transform .1s;}
    #yw-send:hover{background:#5b21b6;}
    #yw-send:active{transform:scale(.93);}
    #yw-send svg{width:16px;height:16px;}

    @media(max-width:400px){
      #yw-panel{width:calc(100vw - 32px);right:16px;bottom:88px;}
      #yw-fab{bottom:16px;right:16px;}
    }
  `;
  document.head.appendChild(style);

  // ── HTML ────────────────────────────────────────────────────────────────────
  const avatarSrc = 'yara-avatar.png?v=3';
  const greeting  = IS_FR
    ? `Bonjour! 👋 Je suis Yara, votre assistante française. Vous pouvez me demander de corriger vos phrases, expliquer une règle de grammaire, ou tout autre chose sur la leçon! 🗼`
    : `Hey! 👋 I'm Yara, your English assistant. Ask me to check your writing, explain grammar, or anything about the lesson!`;

  // Na própria página do quadro o atalho não faz sentido.
  const ON_BOARD_PAGE = /\/quadro\.html$/.test(location.pathname);

  const container = document.createElement('div');
  container.innerHTML = `
    <!-- FAB -->
    <button id="yw-fab" title="Chat with Yara" aria-label="Chat with Yara">
      <img src="${avatarSrc}" onerror="this.style.display='none';this.parentElement.innerHTML='🐾'"/>
      <span class="yw-pulse"></span>
    </button>

    <!-- Atalho da lousa ao vivo (não aparece na própria página do quadro) -->
    ${ON_BOARD_PAGE ? '' : `<a id="yw-board" href="quadro.html" title="Quadro branco ao vivo" aria-label="Abrir o quadro branco ao vivo">
      📝<span class="yw-board-tip">Quadro ao vivo</span>
    </a>`}

    <!-- Panel -->
    <div id="yw-panel" role="dialog" aria-label="Yara chat">
      <div id="yw-header">
        <img src="${avatarSrc}" onerror="this.style.display='none';this.parentElement.innerHTML='🐾'"/>
        <div>
          <div class="yw-name">Yara ✨</div>
          <div class="yw-sub">${IS_FR ? 'Assistante Française' : 'English Assistant'} · ${LESSON_TITLE}</div>
        </div>
        <button class="yw-close" id="yw-close" aria-label="Close">✕</button>
      </div>

      <div id="yw-ctx-bar" onclick="toggleCtx()" title="Click to preview what Yara can see">
        👁️ Yara can see what you typed on this page — <u>click to preview</u>
      </div>
      <div id="yw-ctx-preview"></div>

      <div id="yw-messages"></div>

      <div id="yw-input-row">
        <textarea id="yw-input" rows="1" placeholder="${IS_FR ? 'Yara, est-ce correct ?' : 'Ask Yara anything…'}"></textarea>
        <button id="yw-send" aria-label="Send">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(container);

  // ── State ───────────────────────────────────────────────────────────────────
  let isOpen    = false;
  let isLoading = false;
  const history = [];

  // ── DOM refs ─────────────────────────────────────────────────────────────────
  const fab      = document.getElementById('yw-fab');
  const panel    = document.getElementById('yw-panel');
  const closeBtn = document.getElementById('yw-close');
  const msgArea  = document.getElementById('yw-messages');
  const input    = document.getElementById('yw-input');
  const sendBtn  = document.getElementById('yw-send');
  const ctxPrev  = document.getElementById('yw-ctx-preview');

  // ── Atalho da lousa: alinhar ao FAB ──────────────────────────────────────────
  // Algumas páginas sobrescrevem o bottom/right do #yw-fab, então em vez de
  // chutar um valor fixo a gente lê a posição real do FAB e encosta o atalho
  // do lado dele, com os centros na mesma linha.
  // ── Fugir da barra de navegação do celular ───────────────────────────────
  // No celular o site tem um menu colado embaixo (Home · Cursos · Trilha ·
  // Yara AI · Mais) com ~82px de altura. O FAB nascia em bottom:16px, ou seja,
  // DENTRO dessa faixa — e como ele tem z-index 9999, os dois botões ficavam
  // por cima dos itens da direita do menu e roubavam o toque.
  //
  // Em vez de chutar 82px, a gente MEDE a barra: assim continua certo se ela
  // mudar de altura, e nas páginas que não têm menu nenhum os botões voltam
  // para o canto de sempre.
  const FOLGA = 16;

  function alturaDoMenuDeBaixo() {
    let maior = 0;
    const candidatos = document.querySelectorAll('nav, footer, [class*="bottom-0"]');
    for (const el of candidatos) {
      if (el.id && el.id.indexOf('yw-') === 0) continue;      // nossos próprios botões
      const s = getComputedStyle(el);
      if (s.position !== 'fixed' || s.display === 'none' || s.visibility === 'hidden') continue;
      const r = el.getBoundingClientRect();
      if (r.height < 30 || r.width < innerWidth * 0.7) continue;   // não é barra
      if (innerHeight - r.bottom > 4) continue;                    // não está colada embaixo
      if (r.height > innerHeight * 0.4) continue;                  // é painel/folha, não barra
      if (r.height > maior) maior = r.height;
    }
    return maior;
  }

  function posicionarFlutuantes() {
    if (!fab) return;
    fab.style.bottom = (FOLGA + alturaDoMenuDeBaixo()) + 'px';
    posicionarAtalho();
  }

  function posicionarAtalho() {
    const board = document.getElementById('yw-board');
    if (!board || !fab) return;
    const f = getComputedStyle(fab);
    const fBottom = parseFloat(f.bottom) || 0;
    const fRight  = parseFloat(f.right)  || 0;
    const fW = fab.offsetWidth || 58;
    const fH = fab.offsetHeight || 58;
    const bH = board.offsetHeight || 50;
    board.style.right  = (fRight + fW + 12) + 'px';
    board.style.bottom = (fBottom + (fH - bH) / 2) + 'px';
  }

  posicionarFlutuantes();
  window.addEventListener('resize', posicionarFlutuantes);
  // O menu é injetado pelo components.js depois deste script; uma segunda
  // passada garante que a medida pegue a barra já montada.
  setTimeout(posicionarFlutuantes, 400);
  setTimeout(posicionarFlutuantes, 1500);

  // ── Sumir enquanto QUALQUER modal de tela cheia está aberto ──────────────
  // Subir os botões resolveu a barra fixa, mas antes isto só vigiava a folha
  // "Mais" por id fixo (#more-sheet-overlay) — qualquer outro modal do site
  // (o popup "Day N of X" da trilha, result-overlay das aulas, a tela cheia
  // do vocab-focus...) ficava com os FABs boiando por cima, porque o z-index
  // deles (9999) vence o de qualquer modal comum (z-50/z-60).
  // Generalizado: o projeto inteiro usa o MESMO padrão pra modal — classe
  // `.fixed.inset-0`, alternando `.hidden` — então vigiar esse padrão cobre
  // todo modal existente E os futuros, sem listar id por id.
  function sincronizarComModal() {
    // vf-overlay (tela cheia do vocab, vocab-focus.js) tem CSS próprio — não
    // usa .fixed.inset-0/.hidden do Tailwind, então precisa de seletor à parte.
    // #levelup-overlay (levelup-overlay.js) é a EXCEÇÃO ao padrão: fica
    // display:flex o tempo todo por design (o cartão interno que é invisível
    // via scale-0/opacity-0 até subir de nível) e usa a classe própria
    // .hidden-overlay, não .hidden — sem excluir, ele casava sempre e os FABs
    // ficavam escondidos pra sempre em qualquer página.
    const aberto = !!document.querySelector('.fixed.inset-0:not(.hidden):not(#levelup-overlay), #vf-overlay.vf-aberto');
    for (const id of ['yw-fab', 'yw-board']) {
      const el = document.getElementById(id);
      if (!el) continue;
      el.style.opacity = aberto ? '0' : '';
      el.style.pointerEvents = aberto ? 'none' : '';
    }
  }
  new MutationObserver(sincronizarComModal)
    .observe(document.body, { attributes: true, attributeFilter: ['class'], subtree: true });
  sincronizarComModal();
  setTimeout(sincronizarComModal, 1500);   // o menu pode chegar depois

  // ── Context collector ────────────────────────────────────────────────────────
  function collectContext() {
    const parts = [];

    // Lesson info
    parts.push(`Lesson: ${LESSON_TITLE}${LESSON_NUM ? ' (#' + LESSON_NUM + ')' : ''}`);

    // Active tab
    const activeTab = document.querySelector('.tab-btn.active, [class*="tab-btn"][class*="active"]');
    if (activeTab) parts.push(`Active tab: ${activeTab.textContent.trim()}`);

    // All filled inputs and textareas
    const filled = [];
    document.querySelectorAll('input[type="text"], textarea').forEach(el => {
      const val = el.value.trim();
      if (!val) return;
      // Try to find a nearby label/question
      const card  = el.closest('[class*="rounded"]');
      const label = card
        ? (card.querySelector('h3')?.textContent || card.querySelector('p')?.textContent || '').trim().slice(0, 80)
        : '';
      filled.push(label ? `[${label}]: "${val}"` : `"${val}"`);
    });

    if (filled.length) {
      parts.push('Student wrote:');
      filled.forEach(f => parts.push('  • ' + f));
    } else {
      parts.push('(No text typed yet on this page)');
    }

    return parts.join('\n');
  }

  function toggleCtx() {
    const ctx = collectContext();
    ctxPrev.textContent = ctx;
    ctxPrev.classList.toggle('visible');
  }

  // ── Messages ─────────────────────────────────────────────────────────────────
  function addMsg(role, text) {
    const div = document.createElement('div');
    div.className = `yw-msg ${role}`;
    div.textContent = text;
    msgArea.appendChild(div);
    msgArea.scrollTop = msgArea.scrollHeight;
    return div;
  }

  function addGreeting() {
    addMsg('yara', greeting);
  }

  // ── Send ─────────────────────────────────────────────────────────────────────
  async function send() {
    const text = input.value.trim();
    if (!text || isLoading) return;
    input.value = '';
    input.style.height = 'auto';
    addMsg('user', text);

    isLoading = true;
    const typingEl = addMsg('yara typing', IS_FR ? 'Yara réfléchit…' : 'Yara is thinking…');

    // Build context-aware system prompt
    const pageCtx = collectContext();
    const baseLang = IS_FR ? 'French' : 'English';
    const systemPrompt = `You are Yara, a friendly capybara who is an expert ${baseLang} language tutor.
The student is on this lesson page. Here is the current page context:
---
${pageCtx}
---
Rules:
- Be warm, encouraging and concise (2-4 sentences max per reply).
- If the student asks you to check their writing, look at "Student wrote" in the context above and give specific feedback.
- Correct mistakes gently with the right form shown clearly.
- Use 1-2 relevant emojis.
- Always respond in the same language the student used (English or Portuguese for explanations, ${baseLang} for examples/corrections).
- If they ask about something not visible in context, ask them to paste their text.`;

    // Get userId from session
    let userId = 'guest';
    try { userId = JSON.parse(localStorage.getItem('capySession') || '{}').id || 'guest'; } catch(e) {}

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history,
          systemOverride: systemPrompt,
          userId,
        }),
      });
      const data = await res.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text
        || data?.error?.message
        || (IS_FR ? 'Désolée, une erreur s\'est produite.' : 'Sorry, something went wrong.');

      typingEl.classList.remove('typing');
      typingEl.textContent = reply;
      history.push({ role: 'user',  text });
      history.push({ role: 'model', text: reply });
      // Keep history lean
      if (history.length > 20) history.splice(0, 2);
    } catch (e) {
      typingEl.classList.remove('typing');
      typingEl.textContent = IS_FR ? 'Oops! Connexion perdue.' : 'Oops! Connection error.';
    }

    isLoading = false;
  }

  // ── Events ───────────────────────────────────────────────────────────────────
  fab.addEventListener('click', e => {
    e.stopPropagation();
    // Gate: free users see paywall instead of the chat panel
    if (!isPro()) {
      showYaraPaywall();
      return;
    }
    isOpen = !isOpen;
    panel.classList.toggle('open', isOpen);
    if (isOpen && msgArea.children.length === 0) {
      addGreeting();
      setTimeout(() => input.focus(), 300);
    }
    // Hide pulse dot after first open
    const pulse = fab.querySelector('.yw-pulse');
    if (pulse) pulse.style.display = 'none';
  });

  closeBtn.addEventListener('click', e => {
    e.stopPropagation();
    isOpen = false;
    panel.classList.remove('open');
  });

  // Prevent panel clicks from bubbling to document close handler
  panel.addEventListener('click', e => e.stopPropagation());

  sendBtn.addEventListener('click', send);

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  });

  // Auto-resize textarea
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 80) + 'px';
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (isOpen && !panel.contains(e.target) && e.target !== fab) {
      isOpen = false;
      panel.classList.remove('open');
    }
  });

  // Expose toggle globally
  window.openYaraChat = () => { isOpen = true; panel.classList.add('open'); if (msgArea.children.length === 0) addGreeting(); };
})();
