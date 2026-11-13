// ══════════════════════════════════════════════════════════════════════════════
// Preparação de aula — a tela (preparacao.html)
// ══════════════════════════════════════════════════════════════════════════════
//   preparacao.html                 → a próxima aula, palavras para revisar e a lista
//   preparacao.html?aula=fr_aula_03 → a sessão: Ouvir → Palavras → Ler → Reparar → Falar → Pronto
//   preparacao.html?revisar=fr      → revisão das palavras que o aluno não sabia
// Os dados vêm de data/preparacao/*.json (scripts/build-preparacao.mjs). Toda
// a lógica sem tela (próxima aula, nota da fala, placar) está em preparacao-core.js.
// ══════════════════════════════════════════════════════════════════════════════
(function () {
  'use strict';

  const P = window.CapyPrep;
  const app = document.getElementById('prep-app');
  const params = new URLSearchParams(location.search);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const contaPalavras = t => String(t || '').trim().split(/\s+/).filter(Boolean).length;
  const XP_PREPARACAO = 30;

  const PASSOS = [
    { id: 'ouvir', icone: '🎧', nome: 'Ouvir' },
    { id: 'palavras', icone: '🔤', nome: 'Palavras' },
    { id: 'ler', icone: '📖', nome: 'Ler' },
    { id: 'reparar', icone: '👀', nome: 'Reparar' },
    { id: 'falar', icone: '🗣️', nome: 'Falar' },
    { id: 'pronto', icone: '✅', nome: 'Pronto' },
  ];

  // ── Voz ──────────────────────────────────────────────────────────────────
  // Francês: a voz da OpenAI do tts-fr.js (regra do curso). Sem ela, o navegador.
  function falar(texto, idioma) {
    if (idioma === 'fr' && typeof window.speakFrEnd === 'function') return window.speakFrEnd(texto);
    return new Promise(resolve => {
      try {
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(String(texto || '').replace(/\s*\([^)]*\)/g, ''));
        u.lang = idioma === 'fr' ? 'fr-FR' : 'en-US';
        u.rate = 0.9;
        u.onend = () => resolve(true);
        u.onerror = () => resolve(false);
        speechSynthesis.speak(u);
      } catch (_) { resolve(false); }
    });
  }
  function pararFala() {
    try { if (typeof window.speakFrStop === 'function') window.speakFrStop(); } catch (_) {}
    try { speechSynthesis.cancel(); } catch (_) {}
  }

  function erro(texto) {
    app.innerHTML = `<div class="bg-white rounded-[2rem] p-8 text-center shadow-sm entrar">
      <div class="text-4xl mb-2">🦫</div><p class="font-bold text-slate-600">${esc(texto)}</p>
      <a href="preparacao.html" class="botao inline-block mt-4 bg-navy text-white font-extrabold px-6 py-3">Voltar</a></div>`;
  }

  function opcoesHtml(opts, semente) {
    return P.embaralhar(opts, semente).map(o => `<button type="button" class="opcao bg-slate-100 hover:bg-slate-200 px-4 py-3 font-bold w-full" data-opcao="${esc(o)}">${esc(o)}</button>`).join('');
  }

  // Marca a resposta (uma tentativa só) e devolve se acertou.
  function responder(caixa, botao, certa) {
    const ok = botao.dataset.opcao === certa;
    caixa.querySelectorAll('[data-opcao]').forEach(b => {
      b.disabled = true;
      if (b.dataset.opcao === certa) b.classList.add('certa');
      else if (b === botao) b.classList.add('errada');
      else b.classList.add('apagada');
    });
    return ok;
  }

  // ════════════════════════════════════════════════════════════════════════
  // HUB
  // ════════════════════════════════════════════════════════════════════════
  function hub(curso) {
    const nums = P.concluidas(curso), prep = P.feitas(), prox = P.proxima(curso, nums, prep);
    const revisar = P.palavrasParaRevisar(curso.idioma);
    const link = a => `preparacao.html?aula=${encodeURIComponent(a.aula)}`;

    let cartao;
    if (!prox) {
      cartao = `<p class="text-lg font-black">🎉 Você terminou todas as aulas de ${esc(curso.nome)}.</p>
        <p class="text-sm text-slate-600 mt-1">Quer rever alguma? Escolha na lista abaixo.</p>`;
    } else if (prox.preparada) {
      cartao = `<p class="text-xs font-extrabold uppercase tracking-widest text-emerald-600">✓ Você já se preparou</p>
        <p class="text-xl font-black mt-1">${esc(prox.aula.emoji)} Aula ${prox.aula.num} · ${esc(prox.aula.titulo)}</p>
        <p class="text-sm text-slate-600 mt-1">Fez ${prox.preparada.pct}%. Agora é a aula ao vivo!</p>
        <div class="flex flex-wrap gap-2 mt-4">
          ${prox.seguinte ? `<a href="${link(prox.seguinte)}" class="botao bg-pink-500 hover:bg-pink-400 text-white font-black px-6 py-3">Adiantar a aula ${prox.seguinte.num} →</a>` : ''}
          <a href="${link(prox.aula)}" class="botao bg-slate-100 text-navy font-extrabold px-6 py-3">Refazer a aula ${prox.aula.num}</a>
        </div>`;
    } else {
      cartao = `<p class="text-xs font-extrabold uppercase tracking-widest text-pink-600">Sua próxima aula</p>
        <div class="flex items-center gap-4 mt-2">
          <span class="text-5xl" aria-hidden="true">${esc(prox.aula.emoji)}</span>
          <div class="min-w-0"><p class="text-xl font-black">Aula ${prox.aula.num} · ${esc(prox.aula.titulo)}</p>
          <p class="text-sm text-slate-600">${esc(prox.aula.subtitulo)}</p></div>
        </div>
        <a href="${link(prox.aula)}" id="comecar" class="botao block text-center mt-4 bg-pink-500 hover:bg-pink-400 text-white font-black px-6 py-4">Começar a preparação · ${prox.aula.minutos} min</a>`;
    }

    const linhas = curso.aulas.map(a => {
      const feita = prep[a.aula];
      const selo = feita ? `<span class="text-xs font-extrabold bg-emerald-100 text-emerald-700 rounded-full px-3 py-1">✓ ${feita.pct}%</span>`
        : prox && prox.aula.aula === a.aula ? '<span class="text-xs font-extrabold bg-pink-100 text-pink-700 rounded-full px-3 py-1">Próxima</span>'
        : nums.includes(a.num) ? '<span class="text-xs font-bold text-slate-400">Aula feita</span>' : '';
      return `<li><a href="${link(a)}" class="flex items-center gap-3 bg-white rounded-[1.5rem] px-4 py-3 shadow-sm hover:bg-slate-50">
        <span class="text-2xl" aria-hidden="true">${esc(a.emoji)}</span>
        <span class="flex-1 min-w-0"><b class="block text-sm font-extrabold truncate">Aula ${a.num} · ${esc(a.titulo)}</b>
        <small class="block text-xs text-slate-500 truncate">${esc(a.subtitulo)}</small></span>${selo}</a></li>`;
    }).join('');

    app.innerHTML = `
      <section class="rounded-[2rem] bg-gradient-to-br from-navy via-violet-950 to-pink-700 text-white p-6 md:p-8 entrar">
        <p class="text-xs font-extrabold uppercase tracking-widest text-pink-200">🎯 Preparação de aula</p>
        <h1 class="text-3xl md:text-4xl font-black mt-1 leading-tight">Chegue na aula sabendo o que vai acontecer</h1>
        <p class="text-white/80 mt-2">10 a 15 minutos antes da aula ao vivo: você ouve a conversa, aprende as palavras, lê, repara no jeito de falar e fala em voz alta.</p>
        <div class="flex flex-wrap gap-2 mt-4 text-xs font-extrabold">${PASSOS.slice(0, 5).map(p => `<span class="bg-white/15 rounded-full px-3 py-1">${p.icone} ${p.nome}</span>`).join('')}</div>
      </section>
      <div class="flex gap-2 mt-4"><span class="botao bg-navy text-white font-extrabold text-sm px-4 py-2">${esc(curso.bandeira)} ${esc(curso.nome)}</span></div>
      <section id="proxima" class="bg-white rounded-[2rem] p-5 md:p-6 shadow-sm mt-4 entrar">${cartao}</section>
      ${revisar.length ? `<a id="revisar" href="preparacao.html?revisar=${encodeURIComponent(curso.idioma)}" class="mt-4 flex items-center gap-3 bg-violet-50 rounded-[1.5rem] px-5 py-4 hover:bg-violet-100">
        <span class="text-2xl" aria-hidden="true">🔁</span><span class="flex-1"><b class="block font-extrabold">Palavras para revisar: ${revisar.length}</b>
        <small class="text-sm text-slate-600">As que você ainda não sabia. Leva 2 minutos.</small></span><span class="font-black text-violet-700">→</span></a>` : ''}
      <section class="mt-8"><h2 class="text-lg font-black mb-3">Todas as aulas de ${esc(curso.nome)}</h2><ul class="space-y-2">${linhas}</ul></section>`;
  }

  // ════════════════════════════════════════════════════════════════════════
  // CARTÕES DE PALAVRAS (usados no passo 2 e na revisão)
  // ════════════════════════════════════════════════════════════════════════
  // aoDecidir(palavra, sabia, primeiraVez); aoTerminar(). Quem disse "ainda
  // não" vê a palavra de novo no fim (até 3 vezes).
  function cartoesDePalavras(alvo, lista, idioma, aoDecidir, aoTerminar) {
    const fila = lista.map((p, i) => ({ ...p, i, vezes: 0 }));
    const vistas = new Set();
    const total = lista.length;

    function mostrar() {
      if (!fila.length) { aoTerminar(); return; }
      const p = fila[0];
      const repetindo = vistas.has(p.i);
      alvo.innerHTML = `<section class="bg-white rounded-[2rem] p-6 shadow-sm text-center entrar">
        <p class="text-xs font-extrabold text-slate-400">${repetindo ? '🔁 De novo: esta você ainda não sabia' : `Palavra ${vistas.size + 1} de ${total}`}</p>
        <div class="text-5xl mt-3" aria-hidden="true">${esc(p.emoji)}</div>
        <p class="text-3xl font-black mt-2" lang="${esc(idioma)}">${esc(p.fr)}</p>
        <button type="button" data-ouvir-palavra class="botao mt-3 bg-slate-100 font-extrabold px-4 py-2 text-sm">🔊 Ouvir</button>
        <div data-verso hidden class="mt-4">
          <p class="text-lg font-extrabold text-emerald-700">${esc(p.pt)}</p>
          ${p.ex ? `<p class="text-sm text-slate-500 italic mt-1" lang="${esc(idioma)}">${esc(p.ex)}</p>
          <button type="button" data-ouvir-exemplo class="text-xs font-extrabold text-violet-700 mt-1">🔊 Ouvir o exemplo</button>` : ''}
        </div>
        <button type="button" data-virar class="botao mt-5 w-full bg-navy text-white font-black py-3">Ver a tradução</button>
        <div data-decidir hidden class="grid grid-cols-2 gap-2 mt-5">
          <button type="button" data-sabia="0" class="botao bg-rose-100 text-rose-800 font-black py-3">😅 Ainda não sei</button>
          <button type="button" data-sabia="1" class="botao bg-emerald-100 text-emerald-800 font-black py-3">✅ Já sabia</button>
        </div>
      </section>`;
      alvo.querySelector('[data-ouvir-palavra]').addEventListener('click', () => falar(p.fr, idioma));
      const ex = alvo.querySelector('[data-ouvir-exemplo]');
      if (ex) ex.addEventListener('click', () => falar(p.ex, idioma));
      alvo.querySelector('[data-virar]').addEventListener('click', ev => {
        ev.currentTarget.hidden = true;
        alvo.querySelector('[data-verso]').hidden = false;
        alvo.querySelector('[data-decidir]').hidden = false;
      });
      alvo.querySelectorAll('[data-sabia]').forEach(b => b.addEventListener('click', () => {
        const sabia = b.dataset.sabia === '1';
        const primeiraVez = !vistas.has(p.i);
        vistas.add(p.i);
        aoDecidir(p, sabia, primeiraVez);
        fila.shift();
        if (!sabia && ++p.vezes < 3) fila.push(p);
        mostrar();
        if (fila.length) falar(fila[0].fr, idioma);
      }));
    }
    mostrar();
    if (fila.length) falar(fila[0].fr, idioma);
  }

  // ════════════════════════════════════════════════════════════════════════
  // SESSÃO
  // ════════════════════════════════════════════════════════════════════════
  async function sessao(curso, aulaId) {
    let A;
    try { A = await P.carregarAula(aulaId); } catch (_) { erro('Não consegui abrir esta preparação. Tente de novo.'); return; }
    const idioma = A.idioma;
    const R = {
      ouvir: A.compreensao.map(() => null),
      palavras: { sabia: 0, total: A.palavras.length },
      dificeis: [],
      perceber: A.perceber.map(() => null),
      falar: A.repetir.map(() => null),
      resposta: '',
      pulouPergunta: false,
    };
    let passo = 0;
    if (window.capyTrack) window.capyTrack('preparacao_iniciada', { aula: A.aula });

    function moldura() {
      const p = PASSOS[passo];
      app.innerHTML = `
        <div class="flex items-center gap-3">
          <a href="preparacao.html" id="sair" class="w-10 h-10 shrink-0 rounded-full bg-white shadow-sm grid place-items-center font-black" aria-label="Sair da preparação">✕</a>
          <div class="flex-1 flex gap-1" aria-hidden="true">${PASSOS.map((_, i) => `<span class="h-2 flex-1 rounded-full ${i < passo ? 'bg-emerald-500' : i === passo ? 'bg-pink-500' : 'bg-slate-200'}"></span>`).join('')}</div>
          <span class="text-xs font-extrabold text-slate-500">${passo + 1}/${PASSOS.length}</span>
        </div>
        <p class="mt-3 text-xs font-extrabold uppercase tracking-widest text-pink-600">${p.icone} ${p.nome} · Aula ${A.num} — ${esc(A.titulo)}</p>
        <div id="passo" class="mt-3"></div>
        <div id="rodape" class="mt-6"${p.id === 'pronto' ? ' hidden' : ''}>
          <button type="button" id="seguir" class="botao w-full bg-pink-500 hover:bg-pink-400 text-white font-black py-4" disabled>Continuar</button>
          <p id="dica" class="text-center text-xs font-bold text-slate-400 mt-2"></p>
        </div>`;
      document.getElementById('sair').addEventListener('click', ev => {
        if (passo > 0 && passo < PASSOS.length - 1 && !confirm('Sair da preparação? O que você fez nesta aula não fica salvo.')) ev.preventDefault();
        else pararFala();
      });
      const seguir = document.getElementById('seguir');
      seguir.addEventListener('click', () => { pararFala(); passo++; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
      return document.getElementById('passo');
    }
    function liberar(ok, dica) {
      const b = document.getElementById('seguir');
      if (b) b.disabled = !ok;
      const d = document.getElementById('dica');
      if (d) d.textContent = ok ? '' : (dica || '');
    }

    // ── 1. Ouvir ───────────────────────────────────────────────────────────
    function passoOuvir(alvo) {
      alvo.innerHTML = `
        <section class="bg-white rounded-[2rem] p-5 shadow-sm entrar">
          <h2 class="text-xl font-black">🎧 Ouça a conversa, sem ler</h2>
          <p class="text-sm text-slate-600 mt-1">${esc(A.dialogo.contexto)}</p>
          <p class="text-sm text-slate-500 mt-1">Ouça uma ou duas vezes e responda. O texto aparece no passo 3.</p>
          <div class="mt-4 flex flex-wrap items-center gap-3">
            <button type="button" id="tocar" class="botao bg-navy text-white font-black px-6 py-3">▶ Ouvir a conversa</button>
            <span id="tocando" class="text-sm font-bold text-slate-500"></span>
          </div>
        </section>
        <div class="mt-4 space-y-4">${A.compreensao.map((c, i) => `
          <section class="bg-white rounded-[2rem] p-5 shadow-sm" data-pergunta="${i}">
            <p class="font-extrabold">${i + 1}. ${esc(c.q)}</p>
            <div class="mt-3 grid gap-2">${opcoesHtml(c.opts, A.aula + 'c' + i)}</div>
            <p data-fb class="text-sm font-bold mt-2"></p>
          </section>`).join('')}</div>`;

      let tocandoAgora = false;
      const botao = alvo.querySelector('#tocar'), status = alvo.querySelector('#tocando');
      botao.addEventListener('click', async () => {
        if (tocandoAgora) { tocandoAgora = false; pararFala(); return; }
        tocandoAgora = true;
        botao.textContent = '⏸ Parar';
        const linhas = A.dialogo.linhas;
        let falhou = false;
        for (let i = 0; i < linhas.length && tocandoAgora; i++) {
          status.textContent = `🔊 ${linhas[i].quem} (${i + 1} de ${linhas.length})`;
          const ok = await falar(linhas[i].fr, idioma);
          if (!ok && tocandoAgora) { falhou = true; break; }
        }
        status.textContent = falhou ? 'Não consegui tocar o áudio agora. Toque de novo; se não der, responda e siga.' : tocandoAgora ? '✓ Ouviu tudo. Quer ouvir de novo?' : '';
        tocandoAgora = false;
        botao.textContent = '▶ Ouvir de novo';
      });

      alvo.querySelectorAll('[data-pergunta]').forEach(caixa => {
        const i = Number(caixa.dataset.pergunta), c = A.compreensao[i];
        caixa.querySelectorAll('[data-opcao]').forEach(b => b.addEventListener('click', () => {
          const ok = responder(caixa, b, c.a);
          R.ouvir[i] = ok;
          const fb = caixa.querySelector('[data-fb]');
          fb.innerHTML = ok ? '✅ Isso!' : `❌ A resposta é: <b>${esc(c.a)}</b>`;
          fb.className = `text-sm font-bold mt-2 ${ok ? 'text-emerald-700' : 'text-rose-700'}`;
          liberar(R.ouvir.every(x => x !== null), 'Responda as perguntas para continuar.');
        }));
      });
      liberar(false, 'Responda as perguntas para continuar.');
    }

    // ── 2. Palavras ────────────────────────────────────────────────────────
    function passoPalavras(alvo) {
      alvo.innerHTML = `<p class="text-sm text-slate-600 mb-3">Ouça cada palavra e pense no significado. Depois veja a tradução e diga se você já sabia. As que você não sabe voltam até grudar.</p><div id="cartoes"></div>`;
      const caixa = alvo.querySelector('#cartoes');
      cartoesDePalavras(caixa, A.palavras, idioma, (p, sabia, primeira) => {
        if (!primeira) return;
        if (sabia) R.palavras.sabia++;
        else { R.dificeis.push(p); P.anotarPalavra(idioma, p, false); }
      }, () => {
        const n = R.dificeis.length;
        caixa.innerHTML = `<section class="bg-white rounded-[2rem] p-6 shadow-sm text-center entrar">
          <div class="text-4xl">🔤</div>
          <p class="text-xl font-black mt-2">Você já sabia ${R.palavras.sabia} de ${R.palavras.total}</p>
          <p class="text-sm text-slate-600 mt-1">${n ? `${n === 1 ? 'A outra volta' : `As outras ${n} voltam`} amanhã na revisão de palavras.` : 'Todas de primeira. Muito bem!'}</p>
        </section>`;
        liberar(true);
      });
      liberar(false, 'Passe pelas palavras para continuar.');
    }

    // ── 3. Ler ─────────────────────────────────────────────────────────────
    // As palavras do passo 2 ficam sublinhadas no texto: tocar mostra a tradução.
    function destacar(texto) {
      const termos = [];
      A.palavras.forEach(p => String(p.fr).split('/').forEach(t => {
        const limpo = t.replace(/\([^)]*\)/g, '').trim();
        if (limpo.length >= 2) termos.push({ t: limpo.toLowerCase(), g: `${p.fr} = ${p.pt}` });
      }));
      termos.sort((a, b) => b.t.length - a.t.length);
      const baixo = texto.toLowerCase(), usados = [];
      const letra = c => /[\p{L}]/u.test(c || '');
      for (const { t, g } of termos) {
        let i = baixo.indexOf(t);
        while (i >= 0) {
          const fim = i + t.length;
          const livre = !usados.some(u => i < u.fim && fim > u.ini);
          if (livre && !letra(baixo[i - 1]) && !letra(baixo[fim])) { usados.push({ ini: i, fim, g }); break; }
          i = baixo.indexOf(t, i + 1);
        }
      }
      usados.sort((a, b) => a.ini - b.ini);
      let html = '', pos = 0;
      for (const u of usados) {
        html += esc(texto.slice(pos, u.ini)) + `<span class="palavra-lida" data-g="${esc(u.g)}">${esc(texto.slice(u.ini, u.fim))}</span>`;
        pos = u.fim;
      }
      return html + esc(texto.slice(pos));
    }

    function passoLer(alvo) {
      const primeiro = A.dialogo.linhas[0] ? A.dialogo.linhas[0].quem : '';
      alvo.innerHTML = `
        <section class="bg-white rounded-[2rem] p-5 shadow-sm entrar">
          <h2 class="text-xl font-black">📖 Agora leia a conversa</h2>
          <p class="text-sm text-slate-600 mt-1">Toque nas palavras sublinhadas para ver a tradução. Use “Ver tradução” só se travar.</p>
          <button type="button" id="ouvir-tudo" class="botao mt-3 bg-navy text-white font-black px-5 py-2.5 text-sm">▶ Ouvir lendo junto</button>
        </section>
        <div class="mt-4 space-y-3">${A.dialogo.linhas.map((l, i) => {
          const esquerda = l.quem === primeiro;
          return `<div class="flex ${esquerda ? 'justify-start' : 'justify-end'}">
            <div data-linha="${i}" class="max-w-[88%] ${esquerda ? 'bg-white' : 'bg-sky-50'} rounded-[1.5rem] p-4 shadow-sm transition">
              <p class="text-xs font-extrabold text-pink-600">${esc(l.quem)}</p>
              <p class="font-bold leading-relaxed mt-0.5" lang="${esc(idioma)}">${destacar(l.fr)}</p>
              <p data-glossa hidden class="text-xs font-extrabold text-emerald-700 mt-1"></p>
              <p data-trad hidden class="text-sm text-slate-500 mt-1">${esc(l.pt)}</p>
              <div class="flex gap-2 mt-2">
                <button type="button" data-ouvir="${i}" class="text-xs font-extrabold bg-slate-100 rounded-full px-3 py-1">🔊 Ouvir</button>
                <button type="button" data-ver="${i}" class="text-xs font-extrabold bg-slate-100 rounded-full px-3 py-1">Ver tradução</button>
              </div>
            </div></div>`;
        }).join('')}</div>`;

      alvo.querySelectorAll('[data-linha]').forEach(caixa => {
        const i = Number(caixa.dataset.linha);
        caixa.querySelector('[data-ouvir]').addEventListener('click', () => falar(A.dialogo.linhas[i].fr, idioma));
        caixa.querySelector('[data-ver]').addEventListener('click', ev => {
          const t = caixa.querySelector('[data-trad]');
          t.hidden = !t.hidden;
          ev.currentTarget.textContent = t.hidden ? 'Ver tradução' : 'Esconder';
        });
        caixa.querySelectorAll('.palavra-lida').forEach(s => s.addEventListener('click', () => {
          const g = caixa.querySelector('[data-glossa]');
          g.textContent = s.dataset.g;
          g.hidden = false;
        }));
      });

      let lendo = false;
      const botao = alvo.querySelector('#ouvir-tudo');
      botao.addEventListener('click', async () => {
        if (lendo) { lendo = false; pararFala(); return; }
        lendo = true;
        botao.textContent = '⏸ Parar';
        const caixas = [...alvo.querySelectorAll('[data-linha]')];
        for (let i = 0; i < caixas.length && lendo; i++) {
          caixas.forEach(c => c.classList.remove('ring-2', 'ring-pink-400'));
          caixas[i].classList.add('ring-2', 'ring-pink-400');
          caixas[i].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
          if (!(await falar(A.dialogo.linhas[i].fr, idioma))) break;
        }
        caixas.forEach(c => c.classList.remove('ring-2', 'ring-pink-400'));
        lendo = false;
        botao.textContent = '▶ Ouvir lendo junto';
      });
      liberar(true);
    }

    // ── 4. Reparar (noticing) ──────────────────────────────────────────────
    function passoReparar(alvo) {
      alvo.innerHTML = `<p class="text-sm text-slate-600 mb-3">Repare em como os franceses falam. São detalhes que aparecem na aula.</p>
        <div class="space-y-4">${A.perceber.map((p, i) => {
          const l = A.dialogo.linhas[p.linha];
          const k = l.fr.indexOf(p.trecho);
          const frase = esc(l.fr.slice(0, k)) + `<mark class="repare">${esc(p.trecho)}</mark>` + esc(l.fr.slice(k + p.trecho.length));
          return `<section class="bg-white rounded-[2rem] p-5 shadow-sm entrar" data-repare="${i}">
            <p class="text-xs font-extrabold text-pink-600">👀 Repare · ${esc(l.quem)}</p>
            <p class="text-lg font-bold mt-1 leading-relaxed" lang="${esc(idioma)}">${frase}</p>
            <button type="button" data-ouvir class="text-xs font-extrabold bg-slate-100 rounded-full px-3 py-1 mt-2">🔊 Ouvir a frase</button>
            <p class="font-extrabold mt-4">${esc(p.pergunta)}</p>
            <div class="mt-3 grid gap-2">${opcoesHtml(p.opts, A.aula + 'p' + i)}</div>
            <p data-fb class="text-sm font-bold mt-3"></p>
          </section>`;
        }).join('')}</div>`;
      alvo.querySelectorAll('[data-repare]').forEach(caixa => {
        const i = Number(caixa.dataset.repare), p = A.perceber[i];
        caixa.querySelector('[data-ouvir]').addEventListener('click', () => falar(A.dialogo.linhas[p.linha].fr, idioma));
        caixa.querySelectorAll('[data-opcao]').forEach(b => b.addEventListener('click', () => {
          const ok = responder(caixa, b, p.a);
          R.perceber[i] = ok;
          const fb = caixa.querySelector('[data-fb]');
          fb.innerHTML = `${ok ? '✅ Isso!' : `❌ A resposta é: <b>${esc(p.a)}</b>.`} <span class="font-semibold text-slate-600">${esc(p.explica)}</span>`;
          fb.className = `text-sm font-bold mt-3 ${ok ? 'text-emerald-700' : 'text-rose-700'}`;
          liberar(R.perceber.every(x => x !== null), 'Responda os dois para continuar.');
        }));
      });
      liberar(false, 'Responda os dois para continuar.');
    }

    // ── 5. Falar ───────────────────────────────────────────────────────────
    function passoFalar(alvo) {
      const temMic = !!(window.CapyMic && navigator.mediaDevices && window.MediaRecorder);
      const tentativas = A.repetir.map(() => 0);
      let gravando = null;           // índice da frase (0..2) ou 'resposta'

      alvo.innerHTML = `
        <p class="text-sm text-slate-600 mb-3">Ouça e repita cada frase no microfone. Depois responda a pergunta que o seu teacher vai fazer na aula.</p>
        <p id="sem-mic" class="${temMic ? 'hidden ' : ''}text-sm font-bold text-rose-700 bg-rose-50 rounded-2xl p-3 mb-3">🎤 Este aparelho não grava aqui. Fale em voz alta e digite o que você falou.</p>
        <div class="space-y-4">${A.repetir.map((f, i) => `
          <section class="bg-white rounded-[2rem] p-5 shadow-sm" data-frase="${i}">
            <p class="text-xs font-extrabold text-slate-400">Frase ${i + 1} de ${A.repetir.length}</p>
            <p class="text-lg font-black mt-1" lang="${esc(idioma)}">${esc(f.fr)}</p>
            <p class="text-sm text-slate-500">${esc(f.pt)}</p>
            <div class="flex flex-wrap gap-2 mt-3">
              <button type="button" data-ouvir class="botao bg-slate-100 font-extrabold px-4 py-2 text-sm">🔊 Ouvir</button>
              <button type="button" data-gravar class="botao bg-pink-500 text-white font-extrabold px-4 py-2 text-sm"${temMic ? '' : ' hidden'}>🎤 Gravar</button>
              <button type="button" data-pular hidden class="botao bg-white text-slate-500 font-bold px-4 py-2 text-sm">Pular esta frase</button>
            </div>
            <input data-digitar type="text" class="w-full mt-3 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold"${temMic ? ' hidden' : ''} placeholder="Digite o que você falou" lang="${esc(idioma)}">
            <p data-fb class="text-sm font-bold mt-2"></p>
          </section>`).join('')}
          <section class="bg-gradient-to-br from-violet-50 to-pink-50 rounded-[2rem] p-5" id="pergunta">
            <p class="text-xs font-extrabold uppercase tracking-widest text-violet-700">❓ A pergunta da aula</p>
            <p class="text-xl font-black mt-1" lang="${esc(idioma)}">${esc(A.pergunta.fr)}</p>
            <p class="text-sm text-slate-600">${esc(A.pergunta.pt)}</p>
            <button type="button" data-ouvir-pergunta class="text-xs font-extrabold bg-white rounded-full px-3 py-1 mt-2">🔊 Ouvir a pergunta</button>
            <p class="text-sm text-slate-600 mt-3">Responda em voz alta, em francês. O seu teacher lê a sua resposta antes da aula.</p>
            <button type="button" id="responder" class="botao mt-3 bg-violet-600 text-white font-black px-5 py-3"${temMic ? '' : ' hidden'}>🎤 Responder em voz</button>
            <textarea id="resposta" rows="3" class="w-full mt-3 rounded-2xl bg-white px-4 py-3 text-sm font-bold" lang="${esc(idioma)}" placeholder="A sua resposta aparece aqui. Você pode corrigir ou digitar."></textarea>
            <p id="resposta-fb" class="text-xs font-bold text-slate-500 mt-1"></p>
            <details class="mt-2"><summary class="text-sm font-extrabold text-violet-700 cursor-pointer">Ver um exemplo de resposta</summary>
              <p class="text-sm font-bold mt-2" lang="${esc(idioma)}">${esc(A.pergunta.exemplo)}</p>
              <button type="button" data-ouvir-exemplo class="text-xs font-extrabold bg-white rounded-full px-3 py-1 mt-1">🔊 Ouvir o exemplo</button>
            </details>
            <button type="button" id="pular-pergunta" class="text-xs font-bold text-slate-500 underline mt-3">Prefiro responder na aula</button>
          </section>
        </div>`;

      const resposta = alvo.querySelector('#resposta');
      function conferir() {
        R.resposta = resposta.value.trim().slice(0, 600);
        const pronto = R.falar.every(x => x !== null) && (contaPalavras(R.resposta) >= 2 || R.pulouPergunta);
        liberar(pronto, 'Repita as 3 frases e responda a pergunta para continuar.');
      }

      function notaFrase(i, falado, veioDoMic) {
        const caixa = alvo.querySelector(`[data-frase="${i}"]`), fb = caixa.querySelector('[data-fb]');
        const ok = P.falouBem(A.repetir[i].fr, falado);
        R.falar[i] = R.falar[i] === true ? true : ok;
        tentativas[i]++;
        fb.innerHTML = ok ? `✅ Muito bem!${veioDoMic ? ` <span class="font-semibold text-slate-500">Você disse: «${esc(falado)}»</span>` : ''}`
          : `🔁 Quase. Ouça de novo e tente outra vez.${veioDoMic ? ` <span class="font-semibold text-slate-500">Entendi: «${esc(falado)}»</span>` : ''}`;
        fb.className = `text-sm font-bold mt-2 ${ok ? 'text-emerald-700' : 'text-slate-600'}`;
        if (!ok && tentativas[i] >= 2) caixa.querySelector('[data-pular]').hidden = false;
        conferir();
      }

      function semMicrofone(motivo) {
        const aviso = alvo.querySelector('#sem-mic');
        aviso.classList.remove('hidden');
        aviso.textContent = motivo === 'permission_denied'
          ? '🎤 O microfone está bloqueado. Fale em voz alta e digite o que você falou.'
          : motivo === 'limite' ? '🎤 O limite de gravações de hoje acabou. Fale em voz alta e digite o que você falou.'
          : '🎤 Este aparelho não grava aqui. Fale em voz alta e digite o que você falou.';
        alvo.querySelectorAll('[data-gravar]').forEach(b => { b.hidden = true; });
        alvo.querySelectorAll('[data-digitar]').forEach(inp => { inp.hidden = false; });
        alvo.querySelector('#responder').hidden = true;
      }

      // Uma gravação por vez: 1º toque grava, 2º toque para e transcreve.
      async function gravar(qual, botao, rotulo) {
        const mic = window.CapyMic;
        if (gravando === qual) {
          botao.textContent = '⏳ Ouvindo…';
          botao.disabled = true;
          botao.classList.remove('gravando');
          const r = await mic.stopAndTranscribe({ lang: idioma, uso: 'preparacao' });
          gravando = null;
          botao.disabled = false;
          botao.textContent = rotulo.de_novo;
          if (r && r.error) {
            if (/limite|limit/i.test(r.error)) { semMicrofone('limite'); return; }
            mostrarFalha(qual, r.error);
            return;
          }
          if (!r || !r.text) { mostrarFalha(qual, 'Não deu para ouvir. Tente de novo, mais perto do microfone.'); return; }
          if (qual === 'resposta') {
            resposta.value = (resposta.value.trim() ? resposta.value.trim() + ' ' : '') + String(r.text).trim();
            alvo.querySelector('#resposta-fb').textContent = '✓ Transcrito. Confira e corrija se precisar.';
            conferir();
          } else notaFrase(qual, String(r.text).slice(0, 300), true);
          return;
        }
        if (gravando !== null) return;
        pararFala();
        const ok = await mic.start({
          onError: motivo => semMicrofone(motivo),
          onAutoStop: () => { if (gravando === qual) gravar(qual, botao, rotulo); },
        });
        if (!ok) return;
        gravando = qual;
        botao.textContent = '⏹ Parar';
        botao.classList.add('gravando');
      }

      function mostrarFalha(qual, texto) {
        const fb = qual === 'resposta' ? alvo.querySelector('#resposta-fb') : alvo.querySelector(`[data-frase="${qual}"] [data-fb]`);
        fb.textContent = '🔁 ' + texto;
        fb.className = qual === 'resposta' ? 'text-xs font-bold text-rose-700 mt-1' : 'text-sm font-bold mt-2 text-slate-600';
      }

      alvo.querySelectorAll('[data-frase]').forEach(caixa => {
        const i = Number(caixa.dataset.frase);
        caixa.querySelector('[data-ouvir]').addEventListener('click', () => falar(A.repetir[i].fr, idioma));
        const g = caixa.querySelector('[data-gravar]');
        g.addEventListener('click', () => gravar(i, g, { de_novo: '🎤 Gravar de novo' }));
        caixa.querySelector('[data-pular]').addEventListener('click', ev => {
          if (R.falar[i] === null) R.falar[i] = false;
          ev.currentTarget.hidden = true;
          const fb = caixa.querySelector('[data-fb]');
          fb.textContent = 'Tudo bem: treine esta na aula.';
          fb.className = 'text-sm font-bold mt-2 text-slate-500';
          conferir();
        });
        const inp = caixa.querySelector('[data-digitar]');
        inp.addEventListener('change', () => { if (inp.value.trim()) notaFrase(i, inp.value.trim(), false); });
      });
      const responderBtn = alvo.querySelector('#responder');
      responderBtn.addEventListener('click', () => gravar('resposta', responderBtn, { de_novo: '🎤 Gravar mais' }));
      alvo.querySelector('[data-ouvir-pergunta]').addEventListener('click', () => falar(A.pergunta.fr, idioma));
      alvo.querySelector('[data-ouvir-exemplo]').addEventListener('click', () => falar(A.pergunta.exemplo, idioma));
      resposta.addEventListener('input', () => { R.pulouPergunta = false; conferir(); });
      alvo.querySelector('#pular-pergunta').addEventListener('click', ev => {
        R.pulouPergunta = true;
        ev.currentTarget.textContent = '✓ Você responde na aula';
        conferir();
      });
      conferir();
    }

    // ── 6. Pronto ──────────────────────────────────────────────────────────
    async function passoPronto(alvo) {
      const pl = P.placar({ ouvir: R.ouvir, palavras: R.palavras, perceber: R.perceber, falar: R.falar.map(Boolean) });
      const primeira = P.marcarFeita(A.aula, pl.pct);
      if (primeira && window.Store && typeof Store.addXP === 'function') Store.addXP(XP_PREPARACAO);
      if (window.capyTrack) window.capyTrack('preparacao_concluida', { aula: A.aula, pct: pl.pct });
      const dificeis = R.dificeis.map(p => p.fr);

      alvo.innerHTML = `
        <section class="rounded-[2rem] bg-gradient-to-br from-emerald-600 to-teal-600 text-white p-6 text-center entrar">
          <div class="text-5xl" aria-hidden="true">🎉</div>
          <h2 class="text-2xl font-black mt-1">Pronto para a aula ${A.num}!</h2>
          <p class="text-white/85 mt-1">Você fez ${pl.pct}% da preparação${primeira ? ` · +${XP_PREPARACAO} XP` : ''}</p>
        </section>
        <section class="bg-white rounded-[2rem] p-5 shadow-sm mt-4 space-y-3">${pl.partes.map(p => `
          <div><div class="flex justify-between text-sm font-extrabold"><span>${p.rotulo}</span><span>${p.feito}/${p.total}</span></div>
          <div class="h-2 rounded-full bg-slate-100 mt-1 overflow-hidden"><i class="block h-full bg-emerald-500 rounded-full" style="width:${p.total ? Math.round(100 * p.feito / p.total) : 0}%"></i></div></div>`).join('')}
        </section>
        ${dificeis.length ? `<section class="bg-violet-50 rounded-[2rem] p-5 mt-4"><p class="font-extrabold">🔁 Para revisar: <span lang="${esc(idioma)}">${esc(dificeis.join(', '))}</span></p>
          <p class="text-sm text-slate-600 mt-1">Elas voltam amanhã em “Palavras para revisar”.</p></section>` : ''}
        <p id="envio" class="text-sm font-bold text-center text-slate-500 mt-4"></p>
        <div class="grid gap-2 mt-4">
          <a href="preparacao.html" class="botao block text-center bg-navy text-white font-black py-4">Voltar para a Preparação</a>
          <a href="${esc(A.aula)}.html" class="botao block text-center bg-white text-navy font-extrabold py-4 shadow-sm">Abrir a aula ${A.num}</a>
        </div>`;

      const envio = alvo.querySelector('#envio');
      const sessaoAluno = window.Auth && typeof Auth.getSession === 'function' ? Auth.getSession() : null;
      if (!sessaoAluno || sessaoAluno.role === 'guest') { envio.textContent = 'Entre na sua conta para o seu teacher ver a sua preparação.'; return; }
      envio.textContent = '📤 Avisando o seu teacher…';
      const entrega = {
        lessonId: `${A.aula}-prep`,
        lessonTitle: `🎯 Preparação · ${curso.nome} — Aula ${A.num}: ${A.titulo}`.slice(0, 160),
        answers: {
          placar: pl.texto,
          resposta: R.resposta || '(vai responder na aula)',
          dificeis: dificeis.join(', ') || '—',
        },
        xp: primeira ? XP_PREPARACAO : 0,
      };
      try {
        const r = await fetch('/api/homework', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(entrega) });
        envio.textContent = r.ok ? '✅ O seu teacher já sabe que você se preparou.' : 'Não deu para avisar o teacher agora. A preparação ficou salva neste aparelho.';
        envio.className = `text-sm font-bold text-center mt-4 ${r.ok ? 'text-emerald-700' : 'text-slate-500'}`;
      } catch (_) {
        envio.textContent = 'Não deu para avisar o teacher agora. A preparação ficou salva neste aparelho.';
      }
    }

    const PASSO_FN = [passoOuvir, passoPalavras, passoLer, passoReparar, passoFalar, passoPronto];
    function render() { PASSO_FN[passo](moldura()); }
    render();
  }

  // ════════════════════════════════════════════════════════════════════════
  // REVISÃO DE PALAVRAS
  // ════════════════════════════════════════════════════════════════════════
  function revisao(curso) {
    const lista = P.palavrasParaRevisar(curso.idioma).slice(0, 10);
    app.innerHTML = `
      <div class="flex items-center gap-3"><a href="preparacao.html" class="w-10 h-10 rounded-full bg-white shadow-sm grid place-items-center font-black" aria-label="Voltar">✕</a>
      <p class="text-xs font-extrabold uppercase tracking-widest text-violet-700">🔁 Palavras para revisar · ${esc(curso.nome)}</p></div>
      <div id="cartoes" class="mt-4"></div>`;
    const caixa = document.getElementById('cartoes');
    if (!lista.length) {
      caixa.innerHTML = '<section class="bg-white rounded-[2rem] p-6 shadow-sm text-center"><div class="text-4xl">🎉</div><p class="font-black mt-2">Nada para revisar agora.</p><a href="preparacao.html" class="botao inline-block mt-4 bg-navy text-white font-extrabold px-6 py-3">Voltar</a></section>';
      return;
    }
    let acertos = 0;
    cartoesDePalavras(caixa, lista, curso.idioma, (p, sabia, primeira) => {
      if (!primeira) return;
      if (sabia) acertos++;
      P.anotarPalavra(curso.idioma, p, sabia);
    }, () => {
      caixa.innerHTML = `<section class="bg-white rounded-[2rem] p-6 shadow-sm text-center entrar"><div class="text-4xl">🔁</div>
        <p class="text-xl font-black mt-2">Você lembrou ${acertos} de ${lista.length}</p>
        <p class="text-sm text-slate-600 mt-1">As que você lembrou voltam daqui a alguns dias; as outras, amanhã.</p>
        <a href="preparacao.html" class="botao inline-block mt-4 bg-navy text-white font-extrabold px-6 py-3">Voltar para a Preparação</a></section>`;
    });
  }

  // ════════════════════════════════════════════════════════════════════════
  async function iniciar() {
    let cursos;
    try { cursos = (await P.carregarCursos()).cursos || []; } catch (_) { erro('Não consegui carregar a preparação agora. Confira a internet e tente de novo.'); return; }
    const curso = cursos[0];
    if (!curso) { erro('Ainda não há preparação disponível.'); return; }
    const aula = params.get('aula');
    if (aula && curso.aulas.some(a => a.aula === aula)) { sessao(curso, aula); return; }
    if (params.get('revisar') === curso.idioma) { revisao(curso); return; }
    hub(curso);
  }

  iniciar();
})();
