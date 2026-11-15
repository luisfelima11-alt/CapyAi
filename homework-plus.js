// homework-plus.js — o homework maior das aulas do GPS Tronic e do Agro English
// (07/nov/2026, pedido do Luis) e o card para mandar ao teacher.
//
// A aula traz os dados em window.HW_PLUS (gerado por scripts/lib/homework-plus.mjs)
// e o estado das 3 primeiras tarefas em window.HW_ESTADO(). Aqui entram:
//   4. Completar frases   5. Compreensão do diálogo   6. Gravação de voz   7. Frase livre
// (a 8, escrita guiada, já vem no HTML da aula, com o botão de entrega).
//
// Homework maior (15/nov/2026, protótipo no GPS 20–24): quando a aula traz
// HW_PLUS.ditado, entram mais 4 tarefas de fixação antes da escrita, que vira a 12:
//   8. Ditado   9. Traduzir para o inglês   10. Diálogo de memória   11. Revisão da aula anterior
// As aulas sem esses dados continuam com as 8 tarefas, sem mudança.
//
// Na entrega: podeEntregar() confere a escrita e escreve o placar no campo
// #placar, que o components.js manda ao professor junto com as respostas
// (primeiro campo da entrega); entregue() desenha o card e oferece compartilhar.
// O texto do aluno só vai para o canvas e para value de campos: nunca innerHTML.
(function () {
  'use strict';
  const D = window.HW_PLUS;
  if (!D || !document.getElementById('hw-plus')) return;

  const $ = id => document.getElementById(id);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  // Para comparar respostas: minúsculas, apóstrofo reto, sem pontuação.
  const norm = s => String(s || '').toLowerCase().replace(/[’‘`´]/g, "'").replace(/[^a-z0-9' ]+/g, ' ').replace(/\s+/g, ' ').trim();
  const palavras = s => norm(s).split(' ').filter(Boolean);

  const MAIOR = Array.isArray(D.ditado);
  const DITADO = MAIOR ? D.ditado : [], TRADUZIR = MAIOR ? (D.traduzir || []) : [];
  const MEMORIA = MAIOR ? (D.memoria || []) : [], REVISAO = MAIOR ? (D.revisao || []) : [];

  const estado = {
    completar: D.completar.map(() => null),     // true / false / null (não respondida)
    compreensao: D.compreensao.map(() => null), // índice escolhido
    voz: D.voz.map(() => null),                 // true / false / null
    ditado: DITADO.map(() => null),
    traduzir: TRADUZIR.map(() => null),
    memoria: MEMORIA.map(() => null),
    revisao: REVISAO.map(() => null),           // índice escolhido
  };

  // Frase digitada contra a esperada: contração e número contam como a mesma
  // coisa ("I'll" = "I will", "40" = "forty"), pela régua do CapyFala.
  const paraComparar = s => (window.CapyFala && typeof CapyFala.normalizar === 'function' ? CapyFala.normalizar(s, 'en') : norm(s)).replace(/\s+/g, ' ').trim();
  // Quanto da frase esperada o aluno escreveu (palavras certas, na conta da esperada).
  function acertoFrase(esperada, escrita) {
    const alvo = paraComparar(esperada).split(' ').filter(Boolean), dito = paraComparar(escrita).split(' ').filter(Boolean);
    if (!alvo.length || !dito.length) return 0;
    const resto = dito.slice();
    let iguais = 0;
    for (const w of alvo) { const k = resto.indexOf(w); if (k >= 0) { iguais++; resto.splice(k, 1); } }
    return iguais / Math.max(alvo.length, dito.length);
  }

  function cartao(num, titulo, sub, corpo) {
    return `<div class="bg-white border-2 border-emerald-200 rounded-2xl p-5 mb-4">
      <div class="flex items-center gap-2 mb-3">
        <span class="w-7 h-7 rounded-full bg-emerald-500 text-white font-black text-sm flex items-center justify-center shrink-0">${num}</span>
        <div><p class="font-black text-navy text-sm">${esc(titulo)}</p><p class="text-slate-500 text-xs">${esc(sub)}</p></div>
      </div>${corpo}</div>`;
  }

  // ── 4. Completar ─────────────────────────────────────────────────────────
  const htmlCompletar = D.completar.map((x, i) => {
    const [antes, depois] = String(x.f).split('___');
    return `<div class="bg-slate-50 rounded-xl p-3">
      <label class="text-sm text-navy font-semibold leading-relaxed flex flex-wrap items-center gap-1" for="completar-${i + 1}">
        <span>${i + 1}. ${esc(antes)}</span>
        <input id="completar-${i + 1}" type="text" autocomplete="off" autocapitalize="off" spellcheck="false"
          class="w-32 border-2 border-slate-200 rounded-lg px-2 py-1 text-sm focus:border-emerald-400 focus:outline-none" data-hw-completar="${i}"/>
        <span>${esc(depois || '')}</span>
      </label>
      <p class="text-[11px] text-slate-400 mt-1">💡 ${esc(x.dica)}</p>
      <p class="text-xs font-black mt-1 hidden" id="completar-fb-${i}"></p>
    </div>`;
  }).join('');

  // ── 5. Compreensão ───────────────────────────────────────────────────────
  const htmlCompreensao = D.compreensao.map((q, i) => `<div class="bg-slate-50 rounded-xl p-3">
      <p class="text-sm font-bold text-navy mb-2">${i + 1}. ${esc(q.q)}</p>
      <div class="grid gap-2" role="group" aria-label="Pergunta ${i + 1}">${q.opts.map((o, k) =>
        `<button type="button" class="hw-op text-left text-sm font-semibold border-2 border-slate-200 bg-white rounded-xl px-3 py-2 transition-colors" data-hw-q="${i}" data-hw-op="${k}">${esc(o)}</button>`).join('')}</div>
    </div>`).join('');

  // ── 6. Voz ───────────────────────────────────────────────────────────────
  const htmlVoz = D.voz.map((s, i) => `<div class="bg-slate-50 rounded-xl p-3">
      <p class="text-sm font-bold text-navy">${i + 1}. "${esc(s)}"</p>
      <div class="flex flex-wrap gap-2 mt-2">
        <button type="button" class="text-xs font-black bg-white border-2 border-slate-200 rounded-full px-3 py-1.5" data-hw-ouvir="${i}">🔊 Ouvir</button>
        <button type="button" class="text-xs font-black bg-emerald-500 text-white rounded-full px-3 py-1.5" data-hw-gravar="${i}">🎤 Gravar</button>
      </div>
      <input id="voz-${i + 1}" type="text" readonly tabindex="-1" placeholder="O que você falou aparece aqui"
        class="mt-2 w-full bg-white border-2 border-slate-200 rounded-lg px-2 py-1.5 text-sm text-navy" data-hw-voz="${i}"/>
      <p class="text-xs font-black mt-1 hidden" id="voz-fb-${i}"></p>
    </div>`).join('');

  $('hw-plus').innerHTML =
    cartao(4, 'Complete as frases', 'Escreva a palavra que falta. Depois toque em Conferir.',
      `<div class="grid gap-2">${htmlCompletar}</div>
       <button type="button" id="completar-conferir" class="mt-3 text-sm font-black bg-navy text-white rounded-full px-5 py-2">Conferir</button>
       <p id="completar-total" class="text-xs font-black text-slate-500 mt-2"></p>`) +
    cartao(5, 'Você entendeu o diálogo?', 'Escolha a resposta certa. Se precisar, ouça o diálogo de novo.',
      `<div class="grid gap-2">${htmlCompreensao}</div>`) +
    cartao(6, 'Grave a sua voz', 'Ouça, toque em Gravar, fale a frase e toque de novo para parar. Seu teacher vê o que você falou.',
      `<div class="grid gap-2">${htmlVoz}</div><p id="voz-aviso" class="hidden text-xs font-bold text-slate-500 mt-2"></p>`) +
    cartao(7, D.livre.pedido, 'Escreva com as suas palavras. Pode ser simples!',
      `<input id="frase-livre" type="text" class="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-sm text-navy focus:border-emerald-400 focus:outline-none" placeholder="${esc(D.livre.exemplo)}"/>`) +
    (MAIOR ? htmlMaior() : '');

  // ── Homework maior: 8 a 11 ───────────────────────────────────────────────
  function htmlMaior() {
    const campo = (id, extra) => `<input id="${id}" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" ${extra}
      class="mt-2 w-full border-2 border-slate-200 rounded-lg px-2 py-1.5 text-sm text-navy focus:border-emerald-400 focus:outline-none"/>`;
    const fb = id => `<p class="text-xs font-black mt-1 hidden" id="${id}"></p>`;
    const ditado = DITADO.map((_, i) => `<div class="bg-slate-50 rounded-xl p-3">
        <div class="flex items-center gap-2"><span class="text-sm font-bold text-navy">Frase ${i + 1}</span>
          <button type="button" class="text-xs font-black bg-white border-2 border-slate-200 rounded-full px-3 py-1.5" data-hw-ditado="${i}">🔊 Ouvir</button></div>
        ${campo(`ditado-${i + 1}`, 'placeholder="Escreva o que você ouviu"')}${fb(`ditado-fb-${i}`)}
      </div>`).join('');
    const traduzir = TRADUZIR.map((x, i) => `<div class="bg-slate-50 rounded-xl p-3">
        <label class="text-sm font-bold text-navy" for="traduzir-${i + 1}">${i + 1}. ${esc(x.pt)}</label>
        ${campo(`traduzir-${i + 1}`, 'placeholder="In English…"')}${fb(`traduzir-fb-${i}`)}
      </div>`).join('');
    const memoria = MEMORIA.map((x, i) => {
      const [antes, depois] = String(x.f).split('___');
      return `<div class="bg-slate-50 rounded-xl p-3">
        <p class="text-[11px] font-black text-emerald-700">${esc(x.quem)}</p>
        <label class="text-sm text-navy font-semibold leading-relaxed flex flex-wrap items-center gap-1" for="memoria-${i + 1}">
          <span>${esc(antes)}</span>
          <input id="memoria-${i + 1}" type="text" autocomplete="off" autocapitalize="off" spellcheck="false"
            class="w-28 border-2 border-slate-200 rounded-lg px-2 py-1 text-sm focus:border-emerald-400 focus:outline-none"/>
          <span>${esc(depois || '')}</span>
        </label>${fb(`memoria-fb-${i}`)}
      </div>`;
    }).join('');
    const revisao = REVISAO.map((q, i) => `<div class="bg-slate-50 rounded-xl p-3">
        <p class="text-sm font-bold text-navy mb-2">${i + 1}. ${esc(q.en)}</p>
        <div class="grid gap-2" role="group" aria-label="${esc(q.en)}">${q.opts.map((o, k) =>
          `<button type="button" class="text-left text-sm font-semibold border-2 border-slate-200 bg-white rounded-xl px-3 py-2 transition-colors" data-hw-rev="${i}" data-hw-rev-op="${k}">${esc(o)}</button>`).join('')}</div>
      </div>`).join('');
    const conferir = (id, total) => `<button type="button" id="${id}" class="mt-3 text-sm font-black bg-navy text-white rounded-full px-5 py-2">Conferir</button>
       <p id="${total}" class="text-xs font-black text-slate-500 mt-2"></p>`;
    return cartao(8, 'Ditado', 'Ouça cada frase (quantas vezes quiser) e escreva em inglês o que você ouviu.',
        `<div class="grid gap-2">${ditado}</div>${conferir('ditado-conferir', 'ditado-total')}`) +
      cartao(9, 'Como se diz em inglês?', 'Escreva em inglês, de memória, as frases que você viu na aula.',
        `<div class="grid gap-2">${traduzir}</div>${conferir('traduzir-conferir', 'traduzir-total')}`) +
      cartao(10, 'O diálogo, de memória', 'Complete as falas do diálogo sem olhar a aula.',
        `<div class="grid gap-2">${memoria}</div>${conferir('memoria-conferir', 'memoria-total')}`) +
      (REVISAO.length ? cartao(11, 'Revisão da aula anterior', 'O que significam estas palavras da última aula? Uma tentativa por palavra.',
        `<div class="grid gap-2">${revisao}</div>`) : '');
  }

  function marcarCampo(inp, fb, ok, certo) {
    fb.classList.remove('hidden');
    fb.textContent = ok ? '✅ Correto!' : `❌ Quase. O certo: ${certo}`;
    fb.className = `text-xs font-black mt-1 ${ok ? 'text-emerald-600' : 'text-red-500'}`;
    inp.classList.toggle('border-emerald-400', ok);
    inp.classList.toggle('border-red-300', !ok);
  }
  // Confere uma lista de campos; `julgar(i, valor)` devolve { ok, certo }.
  function conferirLista(nome, lista, julgar, mostrar) {
    let certas = 0;
    lista.forEach((_, i) => {
      const inp = $(`${nome}-${i + 1}`), fb = $(`${nome}-fb-${i}`);
      if (!inp.value.trim()) { estado[nome][i] = null; if (mostrar) fb.classList.add('hidden'); return; }
      const r = julgar(i, inp.value);
      estado[nome][i] = r.ok;
      if (r.ok) certas++;
      if (mostrar) marcarCampo(inp, fb, r.ok, r.certo);
    });
    if (mostrar) $(`${nome}-total`).textContent = `${certas} de ${lista.length} certas`;
    return certas;
  }
  const conferirDitado = m => conferirLista('ditado', DITADO, (i, v) => ({ ok: acertoFrase(DITADO[i], v) >= 0.85, certo: DITADO[i] }), m);
  const conferirTraduzir = m => conferirLista('traduzir', TRADUZIR, (i, v) => ({ ok: TRADUZIR[i].en.some(e => acertoFrase(e, v) >= 0.85), certo: TRADUZIR[i].en[0] }), m);
  const conferirMemoria = m => conferirLista('memoria', MEMORIA, (i, v) => ({ ok: MEMORIA[i].r.map(norm).includes(norm(v)), certo: MEMORIA[i].r[0] }), m);
  if (MAIOR) {
    $('ditado-conferir').addEventListener('click', () => conferirDitado(true));
    $('traduzir-conferir').addEventListener('click', () => conferirTraduzir(true));
    $('memoria-conferir').addEventListener('click', () => conferirMemoria(true));
  }

  // ── Correções ────────────────────────────────────────────────────────────
  function conferirCompletar(mostrar) {
    let certas = 0;
    D.completar.forEach((x, i) => {
      const inp = $(`completar-${i + 1}`), fb = $(`completar-fb-${i}`);
      const v = norm(inp.value);
      if (!v) { estado.completar[i] = null; if (mostrar) fb.classList.add('hidden'); return; }
      const ok = x.r.map(norm).includes(v);
      estado.completar[i] = ok;
      if (ok) certas++;
      if (!mostrar) return;
      fb.classList.remove('hidden');
      fb.textContent = ok ? '✅ Correto!' : `❌ Quase. Resposta: ${x.r[0]}`;
      fb.className = `text-xs font-black mt-1 ${ok ? 'text-emerald-600' : 'text-red-500'}`;
      inp.classList.toggle('border-emerald-400', ok);
      inp.classList.toggle('border-red-300', !ok);
    });
    if (mostrar) $('completar-total').textContent = `${certas} de ${D.completar.length} certas`;
    return certas;
  }
  $('completar-conferir').addEventListener('click', () => conferirCompletar(true));

  $('hw-plus').addEventListener('click', e => {
    const op = e.target.closest('[data-hw-op]');
    if (op) {
      const i = Number(op.dataset.hwQ), k = Number(op.dataset.hwOp);
      if (estado.compreensao[i] !== null) return;   // uma tentativa: vale o placar
      estado.compreensao[i] = k;
      const q = D.compreensao[i];
      document.querySelectorAll(`[data-hw-q="${i}"]`).forEach(b => {
        const certo = q.opts[Number(b.dataset.hwOp)] === q.a;
        b.disabled = true;
        if (certo) b.classList.add('border-emerald-400', 'bg-emerald-50');
        else if (b === op) b.classList.add('border-red-300', 'bg-red-50');
        b.classList.remove('border-slate-200', 'bg-white');
      });
      return;
    }
    const dit = e.target.closest('[data-hw-ditado]');
    if (dit) { falar(DITADO[Number(dit.dataset.hwDitado)]); return; }
    const rev = e.target.closest('[data-hw-rev-op]');
    if (rev) {
      const i = Number(rev.dataset.hwRev), k = Number(rev.dataset.hwRevOp);
      if (estado.revisao[i] !== null) return;        // uma tentativa: vale o placar
      estado.revisao[i] = k;
      document.querySelectorAll(`[data-hw-rev="${i}"]`).forEach(b => {
        const certo = REVISAO[i].opts[Number(b.dataset.hwRevOp)] === REVISAO[i].a;
        b.disabled = true;
        if (certo) b.classList.add('border-emerald-400', 'bg-emerald-50');
        else if (b === rev) b.classList.add('border-red-300', 'bg-red-50');
        b.classList.remove('border-slate-200', 'bg-white');
      });
      return;
    }
    const ouvir = e.target.closest('[data-hw-ouvir]');
    if (ouvir) { falar(D.voz[Number(ouvir.dataset.hwOuvir)]); return; }
    const gravar = e.target.closest('[data-hw-gravar]');
    if (gravar) gravarVoz(Number(gravar.dataset.hwGravar), gravar);
  });

  function falar(texto) {
    if (typeof window.speak === 'function') { window.speak(texto); return; }
    try {
      const u = new SpeechSynthesisUtterance(texto);
      u.lang = 'en-US';
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
    } catch (e) { /* sem voz no navegador: o aluno lê a frase */ }
  }

  // Quantas palavras da frase apareceram no que o aluno falou (70% = certo).
  function notaVoz(esperado, falado) {
    const alvo = palavras(esperado), dito = new Set(palavras(falado));
    if (!alvo.length || !dito.size) return false;
    return alvo.filter(w => dito.has(w)).length / alvo.length >= 0.7;
  }

  function marcarVoz(i) {
    const inp = $(`voz-${i + 1}`), fb = $(`voz-fb-${i}`);
    if (!inp.value.trim()) { estado.voz[i] = null; fb.classList.add('hidden'); return; }
    const ok = notaVoz(D.voz[i], inp.value);
    estado.voz[i] = ok;
    fb.classList.remove('hidden');
    fb.textContent = ok ? '✅ Muito bem!' : '🔁 Quase. Ouça de novo e grave outra vez.';
    fb.className = `text-xs font-black mt-1 ${ok ? 'text-emerald-600' : 'text-slate-600'}`;
  }

  // Sem microfone (ou sem permissão): o aluno lê em voz alta e digita o que falou.
  function semMicrofone(motivo) {
    const aviso = $('voz-aviso');
    aviso.classList.remove('hidden');
    aviso.textContent = motivo === 'permission_denied'
      ? '🎤 O microfone está bloqueado. Leia as frases em voz alta e digite o que você falou.'
      : '🎤 Este aparelho não grava aqui. Leia as frases em voz alta e digite o que você falou.';
    D.voz.forEach((_, i) => {
      const inp = $(`voz-${i + 1}`);
      inp.readOnly = false;
      inp.tabIndex = 0;
      inp.placeholder = 'Digite o que você falou';
      inp.addEventListener('input', () => marcarVoz(i));
    });
    document.querySelectorAll('[data-hw-gravar]').forEach(b => { b.disabled = true; b.classList.add('opacity-50'); });
  }

  let gravando = null;
  async function gravarVoz(i, btn) {
    const mic = window.CapyMic;
    if (!mic) { semMicrofone('not_supported'); return; }
    if (gravando === i) {
      btn.textContent = '⏳ Ouvindo…';
      btn.disabled = true;
      const r = await mic.stopAndTranscribe({ lang: 'en' });
      gravando = null;
      btn.disabled = false;
      btn.textContent = '🎤 Gravar de novo';
      if (r && r.text) { $(`voz-${i + 1}`).value = String(r.text).slice(0, 300); marcarVoz(i); }
      else { const fb = $(`voz-fb-${i}`); fb.classList.remove('hidden'); fb.textContent = '🔁 Não deu para ouvir. Tente de novo, mais perto do microfone.'; fb.className = 'text-xs font-black mt-1 text-slate-600'; }
      return;
    }
    if (gravando !== null) return;   // uma gravação por vez
    const ok = await mic.start({
      onError: motivo => semMicrofone(motivo),
      onAutoStop: () => { if (gravando === i) gravarVoz(i, btn); },
    });
    if (!ok) return;
    gravando = i;
    btn.textContent = '⏹️ Parar';
  }

  // ── Placar e entrega ─────────────────────────────────────────────────────
  function placar() {
    const E = typeof window.HW_ESTADO === 'function' ? (() => { try { return window.HW_ESTADO(); } catch (e) { return null; } })() : null;
    const ordem = E && Array.isArray(E.ordem) ? E.ordem : [];
    const linhas = [];
    let certas = 0, total = 0;
    const somar = (nome, ok, de, texto) => { certas += ok; total += de; linhas.push(`${nome} ${texto || (de === 1 ? (ok ? '✓' : '✗') : `${ok}/${de}`)}`); };
    if (ordem.length) somar('Montar a frase', ordem.filter(Boolean).length, ordem.length);
    if (E && Array.isArray(E.pares)) { const [f, t] = E.pares; somar('Ligar os pares', f === t && t > 0 ? 1 : 0, 1, `${f}/${t}`); }
    if (E) somar('Corrigir o erro', E.erro ? 1 : 0, 1);
    somar('Completar', conferirCompletar(false), D.completar.length);
    somar('Compreensão', estado.compreensao.filter((k, i) => k !== null && D.compreensao[i].opts[k] === D.compreensao[i].a).length, D.compreensao.length);
    somar('Voz', estado.voz.filter(Boolean).length, D.voz.length);
    somar('Frase livre', palavras($('frase-livre').value).length >= 3 ? 1 : 0, 1);
    if (MAIOR) {
      somar('Ditado', conferirDitado(false), DITADO.length);
      somar('Traduzir', conferirTraduzir(false), TRADUZIR.length);
      somar('De memória', conferirMemoria(false), MEMORIA.length);
      if (REVISAO.length) somar('Revisão', estado.revisao.filter((k, i) => k !== null && REVISAO[i].opts[k] === REVISAO[i].a).length, REVISAO.length);
    }
    return { certas, total, texto: `${linhas.join(' · ')} · Total ${certas}/${total}` };
  }

  let resultado = null;
  function podeEntregar() {
    const ta = $('texto-guiado'), aviso = $('texto-guiado-aviso');
    if (!ta) return true;
    if (palavras(ta.value).length < 8) {
      aviso.textContent = '✍️ Escreva o seu texto (umas 3 frases) antes de entregar. É ele que o seu teacher vai corrigir.';
      aviso.classList.remove('hidden');
      ta.focus();
      return false;
    }
    aviso.classList.add('hidden');
    resultado = placar();
    $('placar').value = resultado.texto;
    return true;
  }

  // ── O card ───────────────────────────────────────────────────────────────
  function primeiroNome() {
    let nome = '';
    try { nome = (window.Auth && Auth.getSession && Auth.getSession() || {}).name || ''; } catch (e) {}
    if (!nome) { try { nome = (JSON.parse(localStorage.getItem('capySession') || 'null') || {}).name || ''; } catch (e) {} }
    nome = String(nome).trim().split(/\s+/)[0] || '';
    return /^(guest|visitante|convidado)$/i.test(nome) ? '' : nome.slice(0, 18);
  }

  function quebrar(ctx, texto, largura, maxLinhas) {
    const linhas = [];
    let atual = '';
    for (const p of String(texto).split(/\s+/).filter(Boolean)) {
      const teste = atual ? `${atual} ${p}` : p;
      if (ctx.measureText(teste).width > largura && atual) { linhas.push(atual); atual = p; } else atual = teste;
      if (linhas.length === maxLinhas) break;
    }
    if (atual && linhas.length < maxLinhas) linhas.push(atual);
    if (linhas.length === maxLinhas && linhas.join(' ').length < String(texto).trim().length) linhas[maxLinhas - 1] = linhas[maxLinhas - 1].replace(/\s*\S*$/, '') + '…';
    return linhas;
  }

  function retangulo(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  async function desenharCard() {
    try { await document.fonts.ready; } catch (e) {}
    const W = 1080, H = 1350, F = "'Plus Jakarta Sans', system-ui, sans-serif";
    const cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    const ctx = cv.getContext('2d');
    const fundo = ctx.createLinearGradient(0, 0, W, H);
    fundo.addColorStop(0, D.cor || '#0f766e');
    fundo.addColorStop(1, '#001f3f');
    ctx.fillStyle = fundo;
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 0.12;
    ctx.font = `360px ${F}`;
    ctx.fillText('🦫', 700, 420);
    ctx.globalAlpha = 1;

    ctx.fillStyle = 'rgba(255,255,255,.75)';
    ctx.font = `800 34px ${F}`;
    ctx.fillText('CAPY ENGLISH · ' + String(D.curso || '').toUpperCase(), 80, 120);
    ctx.fillStyle = '#fff';
    ctx.font = `120px ${F}`;
    ctx.fillText('🏆', 80, 280);
    ctx.font = `900 86px ${F}`;
    ctx.fillText('Homework', 80, 400);
    ctx.fillText('concluído!', 80, 495);
    const nome = primeiroNome();
    ctx.font = `600 44px ${F}`;
    ctx.fillStyle = 'rgba(255,255,255,.88)';
    ctx.fillText(nome ? `${nome} terminou a lição de casa` : 'Lição de casa entregue', 80, 570);

    // Cartão branco: a aula, o placar e um trecho do texto do aluno.
    retangulo(ctx, 60, 630, W - 120, 600, 56);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.fillStyle = D.cor || '#0f766e';
    ctx.font = `800 34px ${F}`;
    ctx.fillText(`LESSON ${D.aula}`, 120, 715);
    ctx.fillStyle = '#0f1b33';
    ctx.font = `900 50px ${F}`;
    quebrar(ctx, D.titulo, W - 240, 2).forEach((l, k) => ctx.fillText(l, 120, 780 + k * 60));
    const r = resultado || placar();
    ctx.fillStyle = '#ec4899';
    ctx.font = `900 64px ${F}`;
    const placarTxt = `${r.certas}/${r.total} acertos`;
    ctx.fillText(placarTxt, 120, 935);
    const larguraPlacar = ctx.measureText(placarTxt).width;
    ctx.fillStyle = '#10b981';
    ctx.font = `900 44px ${F}`;
    ctx.fillText('+75 XP', 120 + larguraPlacar + 36, 935);
    const texto = ($('texto-guiado') || {}).value || '';
    retangulo(ctx, 110, 975, W - 220, 215, 32);
    ctx.fillStyle = '#f3f4f8';
    ctx.fill();
    ctx.fillStyle = '#334155';
    ctx.font = `italic 500 34px ${F}`;
    quebrar(ctx, `"${texto.replace(/\s+/g, ' ').trim()}"`, W - 300, 4).forEach((l, k) => ctx.fillText(l, 150, 1030 + k * 44));

    ctx.fillStyle = 'rgba(255,255,255,.8)';
    ctx.font = `600 32px ${F}`;
    ctx.fillText(new Date().toLocaleDateString('pt-BR'), 80, 1295);
    ctx.textAlign = 'right';
    ctx.fillText('capyenglish.com.br', W - 80, 1295);
    return cv;
  }

  async function entregue() {
    const caixa = $('hw-card');
    if (!caixa) return;
    const cv = await desenharCard();
    const blob = await new Promise(ok => cv.toBlob(ok, 'image/png'));
    if (!blob) return;
    const arquivo = new File([blob], `homework-lesson-${D.aula}.png`, { type: 'image/png' });
    const url = URL.createObjectURL(blob);
    caixa.className = 'mt-5 bg-gradient-to-br from-emerald-50 to-pink-50 rounded-2xl p-4 text-center';
    caixa.innerHTML = `<p class="font-black text-navy">🏆 Mande para o seu teacher</p>
      <p class="text-xs text-slate-500 mt-1">Compartilhe o card no WhatsApp. As suas respostas já foram para o painel do teacher.</p>
      <img alt="Card do homework concluído" class="mx-auto mt-3 rounded-2xl shadow-lg w-56"/>
      <div class="flex flex-wrap justify-center gap-2 mt-3">
        <button type="button" id="hw-compartilhar" class="bg-pink-500 text-white font-black rounded-full px-5 py-2.5 text-sm">📤 Compartilhar com o teacher</button>
        <a id="hw-baixar" class="bg-white text-navy font-black rounded-full px-5 py-2.5 text-sm">⬇️ Baixar imagem</a>
      </div>
      <p id="hw-card-aviso" class="hidden text-xs font-bold text-emerald-700 mt-2"></p>`;
    caixa.querySelector('img').src = url;
    const baixar = $('hw-baixar');
    baixar.href = url;
    baixar.download = arquivo.name;
    $('hw-compartilhar').addEventListener('click', async () => {
      const r = resultado || placar();
      const texto = `Teacher, terminei o homework da Lesson ${D.aula} (${D.titulo})! ${r.certas}/${r.total} acertos ✅`;
      try {
        if (navigator.canShare && navigator.canShare({ files: [arquivo] })) {
          await navigator.share({ files: [arquivo], text: texto });
          return;
        }
      } catch (e) {
        if (e && e.name === 'AbortError') return;   // o aluno fechou a janela de compartilhar
      }
      baixar.click();
      const aviso = $('hw-card-aviso');
      aviso.textContent = 'Imagem salva. Agora é só mandar para o seu teacher no WhatsApp.';
      aviso.classList.remove('hidden');
    });
  }

  window.HomeworkPlus = { podeEntregar, entregue, placar, _norm: norm, _notaVoz: notaVoz, _desenharCard: desenharCard };
})();
