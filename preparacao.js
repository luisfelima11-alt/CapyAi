// preparacao.js — "🎯 Prepare": o aluno se prepara em casa antes da aula ao
// vivo com o teacher (07/nov/2026, pedido do Luis). Uns 10 minutos:
//   1. 6 palavras-chave com áudio   2. o começo do diálogo
//   3. quiz de 5 perguntas           4. uma pergunta de aquecimento
// Tudo sai do que a aula já tem (VOCAB_DATA, DIALOGO); só a pergunta de
// aquecimento vem de window.PREP (scripts/lib/preparacao.mjs).
//
// Ao terminar: markSection('prepare') (+20 XP, uma vez) e a preparação vai
// para o professor pelo mesmo caminho da lição de casa (POST /api/homework,
// lessonId "<aula>-prep"), e aparece no painel dele como "🎯 Preparação".
// O texto do aluno só vai em value de campo e no corpo do POST: nunca innerHTML.
(function () {
  'use strict';
  const raiz = document.getElementById('prep-raiz');
  if (!raiz) return;
  const P = window.PREP || {};
  const VOC = typeof VOCAB_DATA !== 'undefined' && Array.isArray(VOCAB_DATA) ? VOCAB_DATA : [];
  const DLG = typeof DIALOGO !== 'undefined' && Array.isArray(DIALOGO) ? DIALOGO : [];
  const W = window.YARA_WIDGET || {};
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pagina = (location.pathname.split('/').pop() || '').replace(/\.html$/i, '').toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 58);

  const palavras = VOC.slice(0, 6);
  const trecho = DLG.filter(l => !l.extra).slice(0, 4);
  // Quiz: o significado de 5 das palavras, com 3 alternativas tiradas do resto do vocabulário.
  const embaralhar = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const quiz = palavras.slice(0, 5).map(v => {
    const outras = embaralhar(VOC.filter(x => x.pt !== v.pt).map(x => x.pt)).slice(0, 3);
    return { en: v.en, a: v.pt, opts: embaralhar([v.pt, ...outras]) };
  });
  const resp = quiz.map(() => null);
  const ouvidas = new Set();

  function falar(texto, mp3) {
    const tts = () => { if (typeof window.speak === 'function') window.speak(texto); };
    if (!mp3) { tts(); return; }
    try { const a = new Audio(mp3); a.onerror = tts; a.play().catch(tts); } catch (e) { tts(); }
  }

  const bloco = (n, titulo, sub, corpo) => `<div class="bg-white border-2 border-pink-100 rounded-2xl p-5 mb-4">
    <div class="flex items-center gap-2 mb-3">
      <span class="w-7 h-7 rounded-full bg-pink-500 text-white font-black text-sm flex items-center justify-center shrink-0">${n}</span>
      <div><p class="font-black text-navy text-sm">${esc(titulo)}</p><p class="text-slate-500 text-xs">${esc(sub)}</p></div>
    </div>${corpo}</div>`;

  raiz.innerHTML = `
    <div class="bg-gradient-to-br from-pink-500 to-violet-700 rounded-3xl p-6 mb-6 text-white">
      <div class="flex items-center gap-3 mb-2">
        <span class="text-4xl" aria-hidden="true">🎯</span>
        <div><h2 class="text-2xl font-black">Prepare-se para a aula</h2><p class="text-white/80 text-sm">${esc(W.lessonNum ? `Lesson ${W.lessonNum} — ` : '')}${esc(W.lessonTitle || '')}</p></div>
      </div>
      <p class="text-white/80 text-sm">Uns 10 minutos, antes do encontro com o seu teacher. Você chega já conhecendo as palavras e a situação da aula.</p>
    </div>
    ${bloco(1, 'As palavras-chave', 'Toque em 🔊 para ouvir cada uma.', `<div class="grid grid-cols-2 sm:grid-cols-3 gap-2">${palavras.map((v, i) => `
      <button type="button" class="text-left bg-pink-50 rounded-xl p-3" data-prep-palavra="${i}">
        <span class="text-xl" aria-hidden="true">${esc(v.emoji || '🔊')}</span>
        <span class="block font-black text-navy text-sm mt-1">${esc(v.en)} <span aria-hidden="true">🔊</span></span>
        <span class="block text-xs text-slate-500">${esc(v.pt)}</span>
      </button>`).join('')}</div>`)}
    ${bloco(2, 'O começo do diálogo', 'Ouça e leia. Na aula, você vai ouvir a conversa inteira.', `<div class="grid gap-2">${trecho.map((l, i) => `
      <button type="button" class="text-left rounded-xl p-3 ${l.who === 'yara' ? 'bg-emerald-50' : 'bg-slate-100'}" data-prep-fala="${i}">
        <span class="block text-sm font-bold text-navy">🔊 ${esc(l.en)}</span>
        <span class="block text-xs text-slate-500 mt-0.5">${esc(l.pt)}</span>
      </button>`).join('')}</div>`)}
    ${bloco(3, 'Mini quiz', 'O que significa cada palavra?', `<div class="grid gap-3">${quiz.map((q, i) => `
      <div><p class="text-sm font-bold text-navy mb-1.5">${i + 1}. ${esc(q.en)}</p>
        <div class="grid grid-cols-2 gap-2" role="group" aria-label="${esc(q.en)}">${q.opts.map((o, k) => `
          <button type="button" class="text-left text-sm font-semibold border-2 border-slate-200 bg-white rounded-xl px-3 py-2" data-prep-q="${i}" data-prep-op="${k}">${esc(o)}</button>`).join('')}</div>
      </div>`).join('')}</div><p id="prep-quiz-total" class="text-xs font-black text-slate-500 mt-3"></p>`)}
    ${bloco(4, 'Aquecimento', P.aquecimento || `Em 1 ou 2 frases: o que você já sabe sobre o tema desta aula? Pode ser em português.`, `
      <input id="aquecimento" type="text" class="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-sm text-navy focus:border-pink-400 focus:outline-none" placeholder="${esc(P.exemplo || 'Escreva aqui…')}"/>`)}
    <button type="button" id="prep-pronto" class="w-full bg-gradient-to-r from-pink-500 to-violet-600 text-white font-black px-6 py-3 rounded-2xl">✅ Estou pronto para a aula (+20 XP)</button>
    <p id="prep-aviso" class="hidden text-xs font-black text-red-600 mt-2 text-center"></p>
    <p id="prep-status" class="hidden text-sm font-bold text-center mt-3"></p>`;

  raiz.addEventListener('click', e => {
    const p = e.target.closest('[data-prep-palavra]');
    if (p) { const v = palavras[Number(p.dataset.prepPalavra)]; ouvidas.add(v.en); falar(v.en); return; }
    const f = e.target.closest('[data-prep-fala]');
    if (f) { const l = trecho[Number(f.dataset.prepFala)]; falar(l.en, l.mp3); return; }
    const op = e.target.closest('[data-prep-op]');
    if (op) {
      const i = Number(op.dataset.prepQ), k = Number(op.dataset.prepOp);
      if (resp[i] !== null) return;
      resp[i] = k;
      raiz.querySelectorAll(`[data-prep-q="${i}"]`).forEach(b => {
        const certo = quiz[i].opts[Number(b.dataset.prepOp)] === quiz[i].a;
        b.disabled = true;
        b.classList.remove('border-slate-200', 'bg-white');
        if (certo) b.classList.add('border-emerald-400', 'bg-emerald-50');
        else if (b === op) b.classList.add('border-red-300', 'bg-red-50');
      });
      if (resp.every(x => x !== null)) document.getElementById('prep-quiz-total').textContent = `${acertos()} de ${quiz.length} certas`;
    }
  });

  const acertos = () => resp.filter((k, i) => k !== null && quiz[i].opts[k] === quiz[i].a).length;

  function status(texto, cor) {
    const s = document.getElementById('prep-status');
    s.textContent = texto;
    s.className = `text-sm font-bold text-center mt-3 ${cor}`;
  }

  document.getElementById('prep-pronto').addEventListener('click', async ev => {
    const btn = ev.currentTarget, aviso = document.getElementById('prep-aviso');
    const aq = document.getElementById('aquecimento').value.trim();
    const falta = resp.some(x => x === null) ? 'Responda as 5 perguntas do quiz.' : aq.split(/\s+/).filter(Boolean).length < 3 ? 'Escreva o aquecimento (uma frase já serve).' : '';
    if (falta) { aviso.textContent = '✋ ' + falta; aviso.classList.remove('hidden'); return; }
    aviso.classList.add('hidden');
    btn.disabled = true;
    btn.textContent = '🎉 Pronto para a aula!';
    if (typeof markSection === 'function') markSection('prepare');

    const sessao = window.Auth && typeof Auth.getSession === 'function' ? Auth.getSession() : null;
    if (!sessao || sessao.role === 'guest') { status('Feito! Entre na sua conta para o teacher ver que você se preparou.', 'text-slate-500'); return; }
    status('📤 Avisando o seu teacher…', 'text-slate-500');
    const entrega = {
      lessonId: `${pagina}-prep`,
      lessonTitle: `🎯 Preparação · ${W.lessonNum ? `Lesson ${W.lessonNum} — ` : ''}${W.lessonTitle || ''}`.slice(0, 160),
      answers: {
        placar: `Quiz ${acertos()}/${quiz.length} · Palavras ouvidas ${ouvidas.size}/${palavras.length}`,
        aquecimento: aq.slice(0, 600),
      },
      xp: 20,
    };
    try {
      const r = await fetch('/api/homework', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(entrega) });
      status(r.ok ? '✅ O seu teacher já sabe que você se preparou.' : 'Feito! Não deu para avisar o teacher agora; a preparação ficou só neste aparelho.', r.ok ? 'text-emerald-700' : 'text-slate-500');
    } catch (e) {
      status('Feito! Não deu para avisar o teacher agora; a preparação ficou só neste aparelho.', 'text-slate-500');
    }
  });

  window.CapyPreparacao = { _quiz: quiz, _acertos: acertos };
})();
