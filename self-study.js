/* ══════════════════════════════════════════════════════════════════════════
   self-study.js — apoio ao aluno que estuda SOZINHO, sem professor junto.

   Carregue depois de components.js em qualquer aula de curso
   (intermediate_aula_*, gpstronic_aula_*, fr_aula_*). Não precisa de
   configuração: a página só precisa ter definido window.YARA_WIDGET
   (já usado pelo widget da Yara) pra saber o idioma e o nome da lição.

   O que ele liga:
   1. Tradução clicável (CapyTranslate, de components.js) nos blocos onde o
      aluno costuma travar: diálogo, expressões, frases de fala e o quiz.
   2. Correção de escrita pela Yara nos textareas de escrita livre, usando
      o /api/correct-writing que já existe no backend.

   Tudo é defensivo: se um bloco não existir na aula, ele simplesmente pula.
   ══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const CFG = (typeof window !== 'undefined' && window.YARA_WIDGET) || {};
  const LANG = (CFG.lang === 'fr') ? 'fr' : 'en';
  const IDIOMA = LANG === 'fr' ? 'francês' : 'inglês';

  // ── 1. Tradução clicável ──────────────────────────────────────────────────
  // ATENÇÃO: CapyTranslate.enable(el) substitui TODO o conteúdo do elemento por
  // spans de palavra — ela foi escrita para parágrafos de texto puro (newsline).
  // Aplicada direto num container de aula, ela apaga <strong>, botões, chips,
  // textareas e o microfone. Por isso aqui a gente desce até cada NÓ DE TEXTO,
  // embrulha só ele num span e liga a tradução nesse span: a estrutura em volta
  // (formatação e elementos interativos) fica intacta.
  // As três famílias de aula usam ids diferentes para os mesmos blocos: o curso
  // de francês usa "-list" e monta o diálogo/quiz direto no painel da aba.
  const ALVOS = [
    // inglês (intermediate + gpstronic)
    '#dialogue-lines', '#expr-grid', '#speak-grid', '#practice-area', '#conv-grid',
    // francês
    '#expr-list', '#speak-list', '#quiz-container', '#tab-dialogue',
  ];

  // Onde NÃO mexer: clicar numa palavra dentro destes dispararia a ação do
  // elemento junto com a tradução.
  const INTERATIVOS = 'button, a, input, textarea, select, label, [onclick], .chip-starter';

  function embrulharTextos(raiz) {
    const walker = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT, {
      acceptNode(no) {
        if (!no.nodeValue || !/[A-Za-zÀ-ÿ]{2}/.test(no.nodeValue)) return NodeFilter.FILTER_REJECT;
        const pai = no.parentElement;
        if (!pai) return NodeFilter.FILTER_REJECT;
        if (pai.classList.contains('capy-t-word') || pai.classList.contains('capy-t-seg')) return NodeFilter.FILTER_REJECT;
        if (pai.closest(INTERATIVOS)) return NodeFilter.FILTER_REJECT;
        if (/^(SCRIPT|STYLE|TEXTAREA)$/.test(pai.tagName)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    const nos = [];
    let n;
    while ((n = walker.nextNode())) nos.push(n);

    const segmentos = [];
    nos.forEach(no => {
      const span = document.createElement('span');
      span.className = 'capy-t-seg';
      no.parentNode.replaceChild(span, no);
      span.appendChild(no);
      segmentos.push(span);
    });
    return segmentos;
  }

  function ligarTraducao() {
    if (!window.CapyTranslate) return;
    ALVOS.forEach(sel => {
      const el = document.querySelector(sel);
      if (!el) return;
      try {
        embrulharTextos(el).forEach(seg => CapyTranslate.enable(seg));
      } catch (e) { /* nunca derruba a aula */ }
    });
  }

  // O quiz troca de pergunta o tempo todo; sem observar, só a primeira ficaria
  // clicável. Observa também o diálogo/conversa, que são montados por JS.
  function observarRerenders() {
    if (!window.MutationObserver) return;
    const obs = new MutationObserver(() => ligarTraducao());
    ALVOS.forEach(sel => {
      const el = document.querySelector(sel);
      if (el) obs.observe(el, { childList: true, subtree: true });
    });
  }

  // ── 2. Correção de escrita pela Yara ──────────────────────────────────────
  function escapar(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
  }

  function caixaResultado(id) {
    let box = document.getElementById(id);
    if (!box) {
      box = document.createElement('div');
      box.id = id;
      box.className = 'mt-3 hidden';
      return box;
    }
    return box;
  }

  function renderCorrecao(box, d) {
    const nota = Math.max(1, Math.min(5, Number(d.score) || 3));
    const cor = nota >= 4 ? 'emerald' : nota >= 3 ? 'amber' : 'red';
    const erros = Array.isArray(d.errors) ? d.errors : [];

    box.className = `mt-3 rounded-2xl border-2 border-${cor}-200 bg-${cor}-50 p-4 text-sm`;
    box.innerHTML = `
      <div class="flex items-center gap-2 mb-2">
        <span class="text-lg">${'⭐'.repeat(nota)}</span>
        <span class="font-black text-navy">${nota}/5</span>
      </div>
      ${d.praise ? `<p class="text-navy font-semibold mb-3">🐾 ${escapar(d.praise)}</p>` : ''}
      ${erros.length ? `<div class="space-y-2 mb-3">${erros.map(e => `
        <div class="bg-white rounded-xl p-3">
          <p class="text-xs"><span class="line-through text-red-500 font-bold">${escapar(e.original)}</span>
             <span class="mx-1 text-slate-400">→</span>
             <span class="text-emerald-600 font-black">${escapar(e.fixed)}</span></p>
          <p class="text-[11px] text-slate-500 mt-1">${escapar(e.why)}</p>
        </div>`).join('')}</div>` : ''}
      ${d.improved ? `<div class="bg-white rounded-xl p-3 mb-2">
        <p class="text-[11px] font-black text-slate-400 uppercase mb-1">Sua versão corrigida</p>
        <p class="text-navy italic">"${escapar(d.improved)}"</p>
      </div>` : ''}
      ${d.tip ? `<p class="text-xs text-slate-600"><strong>💡 Dica:</strong> ${escapar(d.tip)}</p>` : ''}
    `;
    box.classList.remove('hidden');
  }

  async function corrigir(ta, btn, box) {
    const texto = (ta.value || '').trim();
    if (texto.split(/\s+/).filter(Boolean).length < 3) {
      box.className = 'mt-3 rounded-2xl border-2 border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 font-bold';
      box.textContent = `Escreva pelo menos uma frase em ${IDIOMA} para a Yara corrigir.`;
      box.classList.remove('hidden');
      return;
    }

    const textoOriginal = btn.textContent;
    btn.disabled = true;
    btn.textContent = '⏳ A Yara está lendo...';
    box.className = 'mt-3 text-sm text-slate-400 font-bold';
    box.textContent = 'Corrigindo...';
    box.classList.remove('hidden');

    try {
      const r = await fetch('/api/correct-writing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          text: texto,
          lang: LANG,
          lessonTitle: CFG.lessonTitle || '',
          course: CFG.course || '',
          task: ta.getAttribute('placeholder') || 'free writing practice',
        }),
      });
      const d = await r.json();
      if (!r.ok || d.error) {
        box.className = 'mt-3 rounded-2xl border-2 border-red-200 bg-red-50 p-3 text-sm text-red-700 font-bold';
        box.textContent = d.error || 'Não consegui corrigir agora. Tente de novo em instantes.';
        return;
      }
      renderCorrecao(box, d);
    } catch (e) {
      box.className = 'mt-3 rounded-2xl border-2 border-red-200 bg-red-50 p-3 text-sm text-red-700 font-bold';
      box.textContent = 'Sem conexão com a Yara agora. Sua escrita continua salva no campo.';
    } finally {
      btn.disabled = false;
      btn.textContent = textoOriginal;
    }
  }

  function ligarCorrecao() {
    // Só campos que estão dentro de uma aba da aula. Sem isto o botão também
    // aparecia no campo de chat do widget da Yara (#yw-input).
    const areas = document.querySelectorAll('[id^="tab-"] textarea');
    let n = 0;
    areas.forEach((ta, i) => {
      // Campos de resposta curta da aba de conversação já têm o fluxo de fala.
      if (ta.id && ta.id.indexOf('conv-ta-') === 0) return;
      if (ta.closest('#yara-widget, [id^="yw-"]')) return;
      // No ditado da aba Listening o aluno escreve o que OUVIU. Corrigir a
      // gramática dali diria "sua escrita está errada" para quem escutou certo.
      if (ta.classList.contains('ll-resposta')) return;
      if (ta.dataset.selfStudyReady) return;
      ta.dataset.selfStudyReady = '1';

      const box = caixaResultado('ss-fb-' + i);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'mt-2 bg-navy text-white font-black text-xs px-4 py-2 rounded-xl hover:opacity-80 active:scale-95 transition-all';
      btn.textContent = '✍️ Corrigir minha escrita';
      btn.addEventListener('click', () => corrigir(ta, btn, box));

      const depois = ta.nextSibling;
      const pai = ta.parentNode;
      if (!pai) return;
      pai.insertBefore(btn, depois);
      pai.insertBefore(box, btn.nextSibling);
      n++;
    });
    return n;
  }

  // ── 3. Prática de pronúncia com retorno ───────────────────────────────────
  // O aluno lê a frase em voz alta, o Whisper transcreve e a gente compara com
  // a frase-alvo. Sem professor, é a única forma de ele saber se falou certo.
  // A comparação mora no CapyFala (components.js) porque é a mesma regra da
  // trilha diária: número por extenso na frase-alvo x algarismo na
  // transcrição do Whisper, contração inglesa, acento e pontuação.
  function normalizar(s) {
    if (window.CapyFala) return CapyFala.normalizar(s, LANG);
    return String(s || '').toLowerCase().replace(/[.,!?;:"'()¿¡—–-]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function compararFala(alvo, dito) {
    if (window.CapyFala) return CapyFala.acerto(alvo, dito, LANG);
    const pAlvo = normalizar(alvo).split(' ').filter(Boolean);
    const pDito = normalizar(dito).split(' ').filter(Boolean);
    const restante = [...pDito];
    const faltando = [];
    pAlvo.forEach(p => {
      const i = restante.indexOf(p);
      if (i >= 0) restante.splice(i, 1);
      else faltando.push(p);
    });
    const acertos = pAlvo.length - faltando.length;
    const pct = pAlvo.length ? Math.round(acertos / pAlvo.length * 100) : 0;
    return { pct, faltando };
  }

  let micAtivo = null;

  async function gravar(alvo, btn, box) {
    if (!window.CapyMic) { btn.textContent = '🎤 Indisponível'; return; }

    if (micAtivo === btn) {
      btn.textContent = '⏳ Ouvindo...';
      const { text, empty, error } = await CapyMic.stopAndTranscribe({ lang: LANG });
      micAtivo = null;
      btn.textContent = '🎤 Falar';
      if (error) { box.className = 'mt-2 text-xs font-bold text-red-500'; box.textContent = 'Não consegui gravar. Verifique o microfone.'; box.classList.remove('hidden'); return; }
      if (empty || !text) { box.className = 'mt-2 text-xs font-bold text-slate-400'; box.textContent = 'Não ouvi nada. Tente de novo, mais perto do microfone.'; box.classList.remove('hidden'); return; }

      const { pct, faltando } = compararFala(alvo, text);
      const cor = pct >= 80 ? 'emerald' : pct >= 50 ? 'amber' : 'red';
      const nota = pct >= 80 ? '🎉 Muito bom!' : pct >= 50 ? '👍 Quase lá' : '💪 Tente de novo';
      box.className = `mt-2 rounded-xl border-2 border-${cor}-200 bg-${cor}-50 p-2.5 text-xs`;
      box.innerHTML = `
        <p class="font-black text-navy mb-1">${nota} <span class="text-${cor}-600">${pct}%</span></p>
        <p class="text-slate-500">Ouvi: "<span class="italic">${escapar(text)}</span>"</p>
        ${faltando.length ? `<p class="text-slate-500 mt-1">Faltou dizer: <strong>${faltando.map(escapar).join(', ')}</strong></p>` : ''}`;
      box.classList.remove('hidden');
      return;
    }

    if (micAtivo) return; // já tem outra frase gravando
    const started = await CapyMic.start({
      onError: () => { btn.textContent = '🎤 Falar'; micAtivo = null; },
      // A trava de 15s parou o gravador: segue como se o aluno tivesse tocado em "Parar".
      onAutoStop: () => { if (micAtivo === btn) gravar(alvo, btn, box); },
    });
    if (started) { micAtivo = btn; btn.textContent = '⏹ Parar'; }
  }

  function ligarPronuncia() {
    // #speak-grid no inglês, #speak-list no francês.
    const grid = document.getElementById('speak-grid') || document.getElementById('speak-list');
    if (!grid || !window.CapyMic) return 0;
    let n = 0;
    [...grid.children].forEach((item, i) => {
      if (item.dataset.selfStudyMic) return;
      const frase = item.querySelector('p');
      if (!frase) return;
      item.dataset.selfStudyMic = '1';

      const alvo = frase.textContent.trim();
      const box = document.createElement('div');
      box.className = 'mt-2 hidden';
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'flex-shrink-0 bg-navy text-white font-black text-[11px] px-3 py-2 rounded-lg hover:opacity-80 active:scale-95 transition-all';
      btn.textContent = '🎤 Falar';
      btn.addEventListener('click', () => gravar(alvo, btn, box));

      // O card do speak é flex em linha; o botão entra ao lado, e o retorno
      // vai embaixo do card inteiro pra não quebrar o layout.
      item.appendChild(btn);
      item.insertAdjacentElement('afterend', box);
      n++;
    });
    return n;
  }

  // ── 4. "Por que é assim?" nas falas do diálogo ────────────────────────────
  // A tradução resolve a palavra; isto resolve a ESTRUTURA. Sem professor, é
  // aqui que o aluno normalmente empaca e desiste.
  const TOPICO = CFG.lessonTitle || '';

  async function explicar(frase, btn, box) {
    const original = btn.textContent;
    btn.disabled = true;
    btn.textContent = '⏳';
    box.className = 'mt-2 text-xs text-slate-400 font-bold';
    box.textContent = 'A Yara está pensando...';
    box.classList.remove('hidden');
    try {
      const r = await fetch('/api/lesson-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          lang: LANG,
          lessonTopic: TOPICO,
          history: [],
          message: `Explique em português do Brasil, em no máximo 3 frases curtas, por que esta frase é assim (a estrutura/gramática, não a tradução palavra por palavra): "${frase}"`,
        }),
      });
      const d = await r.json();
      const texto = d?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      if (d?.error || !texto) {
        box.className = 'mt-2 text-xs font-bold text-red-500';
        box.textContent = d?.error?.message ? 'A Yara não respondeu agora. Tente de novo.' : 'Sem resposta. Tente de novo em instantes.';
        return;
      }
      box.className = 'mt-2 rounded-xl border-2 border-indigo-200 bg-indigo-50 p-3 text-xs text-navy leading-relaxed';
      box.innerHTML = `<strong class="text-indigo-700">🐾 Yara:</strong> ${escapar(texto)}`;
    } catch (e) {
      box.className = 'mt-2 text-xs font-bold text-red-500';
      box.textContent = 'Sem conexão com a Yara agora.';
    } finally {
      btn.disabled = false;
      btn.textContent = original;
    }
  }

  function ligarExplicacao() {
    const cont = document.getElementById('dialogue-lines')
      || document.querySelector('#tab-dialogue .space-y-3');
    if (!cont) return 0;
    let n = 0;
    [...cont.children].forEach(fala => {
      if (fala.dataset.selfStudyWhy) return;
      const texto = (fala.textContent || '').trim();
      if (texto.length < 12) return;
      fala.dataset.selfStudyWhy = '1';

      const box = document.createElement('div');
      box.className = 'mt-2 hidden';
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'mt-2 text-[11px] font-black text-indigo-600 hover:text-indigo-800 underline decoration-dotted';
      btn.textContent = '❓ Por que é assim?';
      // Só a frase do idioma-alvo. No inglês a bolha vem como "🙋 Nome: frase";
      // mandar o rótulo junto desviava a explicação da Yara pro cumprimento.
      const bruto = (fala.querySelector('p:nth-of-type(2)') || fala.querySelector('p') || fala).textContent.trim();
      const alvo = bruto
        .replace(/^[^\p{L}\p{N}]+/u, '')
        .replace(/^[^:]{1,40}:\s*/, '')
        .trim();
      btn.addEventListener('click', () => explicar(alvo || texto, btn, box));

      fala.appendChild(btn);
      fala.appendChild(box);
      n++;
    });
    return n;
  }

  function iniciar() {
    ligarTraducao();
    observarRerenders();
    ligarCorrecao();
    ligarPronuncia();
    ligarExplicacao();
    // Aulas montam abas por JS; uma segunda passada pega o que veio depois.
    setTimeout(() => { ligarTraducao(); ligarCorrecao(); ligarPronuncia(); ligarExplicacao(); }, 1200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }

  window.CapySelfStudy = { ligarTraducao, ligarCorrecao, ligarPronuncia, compararFala, lang: LANG };
})();
