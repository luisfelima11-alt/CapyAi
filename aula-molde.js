/* ══════════════════════════════════════════════════════════════════════════
   aula-molde.js — peças das aulas no molde novo (regra do Luis, 12/nov/2026)

   1. Key Expressions em slides, no visual do Patterns: uma expressão por slide,
      com 🔊, tradução, quando usar e exemplo. O deck é montado aqui a partir do
      EXPR_DATA que a aula já tem (as aulas antigas do molde ganham os slides sem
      regerar) e o comportamento — setas, bolinhas, deslizar e tela cheia — é o
      mesmo do Patterns (gramatica-slides.js, CapySlides.montar). Chegar ao
      último slide credita a seção (markSection('expressions')).
   2. "How do you say it in English?": frase em português, o aluno escreve em
      inglês. Conferência tolerante (CapyFala, a mesma régua da fala: contração,
      acento e pontuação não contam) e a resposta certa aparece SEMPRE escrita,
      no acerto e no erro (regra do site, 13/set).
   3. Texto com lacunas: os pedaços que faltam ficam numa caixa; tocar num pedaço
      preenche a lacuna escolhida (ou a próxima vazia), tocar numa lacuna devolve
      o pedaço. "Conferir" pinta certo/errado e revela a palavra certa.

   Tudo montado com createElement/textContent: nenhum dado da aula vira HTML
   cru. As funções de conferência são puras e ficam em CapyAula.puras,
   para os testes (tests/aula-molde.test.js).
   ══════════════════════════════════════════════════════════════════════════ */
(function (raiz) {
    'use strict';

    const VERSAO_SLIDES = 'gs2';
    const TETO_EXTRAS = 2;      // palavras a mais aceitas na tradução

    // ── Funções puras ─────────────────────────────────────────────────────
    function normalizarResposta(t) {
        const fala = raiz.CapyFala;
        if (fala && typeof fala.normalizar === 'function') return fala.normalizar(t, 'en');
        return String(t || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
            .replace(/[‘’ʼ]/g, "'").replace(/\bi'm\b/g, 'i am')
            .replace(/\b(\w+)n't\b/g, '$1 not').replace(/'(s|re|ve|ll|d)\b/g, ' $1')
            .replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
    }

    function palavrasDe(t) { return normalizarResposta(t).split(' ').filter(Boolean); }

    // Melhor nota entre as respostas aceitas. Passa com 80% das palavras do alvo e
    // no máximo TETO_EXTRAS palavras sobrando (quem cola uma frase enorme não passa).
    function conferirTraducao(dito, alvos) {
        const lista = (Array.isArray(alvos) ? alvos : [alvos]).filter(Boolean);
        const pDito = palavrasDe(dito);
        let melhor = { ok: false, pct: 0, faltando: [], alvo: lista[0] || '' };
        for (const alvo of lista) {
            const pAlvo = palavrasDe(alvo);
            if (!pAlvo.length) continue;
            const restante = pDito.slice();
            const faltando = [];
            for (const p of pAlvo) {
                const i = restante.findIndex(q => q !== null && (q === p || (p.length >= 5 && q.length >= 5 && distancia(p, q) <= 1)));
                if (i >= 0) restante[i] = null; else faltando.push(p);
            }
            const pct = Math.round((pAlvo.length - faltando.length) / pAlvo.length * 100);
            const sobra = restante.filter(q => q !== null).length;
            const ok = pDito.length > 0 && pct >= 80 && sobra <= TETO_EXTRAS;
            if (ok && !melhor.ok || (ok === melhor.ok && pct > melhor.pct)) melhor = { ok, pct, faltando, alvo };
        }
        return melhor;
    }

    function distancia(a, b) {
        const m = a.length, n = b.length;
        if (!m) return n;
        if (!n) return m;
        let ant = Array.from({ length: n + 1 }, (_, j) => j);
        for (let i = 1; i <= m; i++) {
            const cur = [i];
            for (let j = 1; j <= n; j++) cur[j] = a[i - 1] === b[j - 1] ? ant[j - 1] : 1 + Math.min(ant[j], cur[j - 1], ant[j - 1]);
            ant = cur;
        }
        return ant[n];
    }

    // "texto [[com]] lacunas" → [{t:'texto '}, {lacuna:'com'}, {t:' lacunas'}]
    function partesDoTexto(texto) {
        const partes = [];
        const re = /\[\[([^\]]+)\]\]/g;
        let i = 0, m;
        while ((m = re.exec(String(texto || '')))) {
            if (m.index > i) partes.push({ t: texto.slice(i, m.index) });
            partes.push({ lacuna: m[1].trim() });
            i = m.index + m[0].length;
        }
        if (i < String(texto || '').length) partes.push({ t: texto.slice(i) });
        return partes;
    }

    function conferirLacunas(respostas, certas) {
        const marcas = certas.map((c, i) => normalizarResposta(respostas[i] || '') === normalizarResposta(c));
        return { marcas, acertos: marcas.filter(Boolean).length, total: certas.length };
    }

    function semTags(s) {
        const t = String(s == null ? '' : s);
        if (!/[<&]/.test(t) || typeof DOMParser === 'undefined') return t;
        return new DOMParser().parseFromString(t, 'text/html').body.textContent || '';
    }

    function embaralhar(lista) {
        const a = lista.slice();
        for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
        return a;
    }

    const puras = { normalizarResposta, conferirTraducao, conferirLacunas, partesDoTexto, semTags };

    if (typeof document === 'undefined') { raiz.CapyAula = { puras }; return; }

    // ── DOM ───────────────────────────────────────────────────────────────
    function el(tag, classe, texto) {
        const n = document.createElement(tag);
        if (classe) n.className = classe;
        if (texto != null) n.textContent = texto;
        return n;
    }

    const ICONE = { ouvir: 'M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05A4.5 4.5 0 0 0 16.5 12zM14 3.23v2.06a7 7 0 0 1 0 13.42v2.06A9 9 0 0 0 14 3.23z',
        tela: 'M4 4h6v2H6v4H4V4zm10 0h6v6h-2V6h-4V4zM4 14h2v4h4v2H4v-6zm14 0h2v6h-6v-2h4v-4z' };
    function icone(d) {
        const ns = 'http://www.w3.org/2000/svg';
        const s = document.createElementNS(ns, 'svg');
        s.setAttribute('aria-hidden', 'true'); s.setAttribute('viewBox', '0 0 24 24');
        s.setAttribute('width', '20'); s.setAttribute('height', '20'); s.setAttribute('fill', 'currentColor');
        const p = document.createElementNS(ns, 'path'); p.setAttribute('d', d); s.appendChild(p);
        return s;
    }
    function botaoOuvir(texto) {
        const b = el('button', 'gs-ouvir flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-700 flex items-center justify-center transition-all active:scale-95');
        b.type = 'button';
        b.setAttribute('data-say', texto);
        b.setAttribute('aria-label', 'Ouvir: ' + texto);
        b.appendChild(icone(ICONE.ouvir));
        return b;
    }
    function falar(texto) { if (texto && typeof raiz.speak === 'function') raiz.speak(texto); }

    function slide(i, total, rotulo, titulo, corpo) {
        const s = el('section', 'gs-slide gs-sem-img rounded-3xl bg-white border-2 border-emerald-100 overflow-hidden cursor-zoom-in');
        s.dataset.i = String(i);
        s.setAttribute('aria-label', 'Slide ' + (i + 1) + ' de ' + total);
        if (i) s.hidden = true;
        const cab = el('div', 'gs-cab bg-navy text-white px-5 py-4 sm:px-6 flex items-start justify-between gap-3');
        const tit = el('div', 'min-w-0');
        tit.appendChild(el('p', 'gs-rotulo text-[11px] font-black uppercase tracking-widest text-emerald-300', rotulo));
        tit.appendChild(el('h3', 'gs-titulo text-xl sm:text-2xl font-black leading-snug', titulo));
        const exp = el('button', 'gs-expandir flex-shrink-0 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-all active:scale-95');
        exp.type = 'button';
        exp.title = 'Tela cheia';
        exp.setAttribute('aria-label', 'Ver o slide ' + (i + 1) + ' em tela cheia');
        exp.appendChild(icone(ICONE.tela));
        cab.append(tit, exp);
        const c = el('div', 'gs-corpo p-3 sm:p-4');
        const tx = el('div', 'gs-texto');
        tx.appendChild(corpo);
        c.appendChild(tx);
        s.append(cab, c);
        return s;
    }

    function itemFrase(en, pt, selo) {
        const li = el('li', 'gs-item flex items-start gap-3 rounded-2xl bg-slate-50 px-3 py-3 sm:px-4');
        li.appendChild(botaoOuvir(en));
        const d = el('div', 'min-w-0');
        if (selo) d.appendChild(el('span', 'gs-selo inline-block mb-1 text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 rounded-full px-2 py-0.5', selo));
        d.appendChild(el('p', 'gs-en text-navy font-bold text-base sm:text-lg leading-snug', en));
        if (pt) d.appendChild(el('p', 'gs-pt text-slate-500 text-sm mt-0.5', pt));
        li.appendChild(d);
        return li;
    }

    // ── 1. Key Expressions em slides ──────────────────────────────────────
    function expressoes(container, dados, aoTerminar) {
        if (!container || !Array.isArray(dados) || !dados.length) return null;
        const itens = dados.map(e => ({
            en: semTags(e.expr || e.en), pt: semTags(e.pt), uso: semTags(e.usage), ex: semTags(e.example),
        })).filter(e => e.en);
        const total = itens.length + 1;
        const deck = el('div', 'ex-deck');
        deck.setAttribute('role', 'region');
        deck.setAttribute('aria-roledescription', 'carrossel');
        deck.setAttribute('aria-label', 'Slides das expressões');

        const topo = el('div', 'flex items-center justify-between gap-3 mb-3');
        const pos = el('span', 'gs-pos text-xs font-black text-slate-400', 'Slide 1 de ' + total);
        pos.style.fontVariantNumeric = 'tabular-nums';
        pos.setAttribute('aria-live', 'polite');
        const bolas = el('div', 'flex flex-wrap gap-1.5');
        for (let i = 0; i < total; i++) {
            const b = el('button', 'gs-dot w-2.5 h-2.5 rounded-full ' + (i ? 'bg-slate-200' : 'bg-emerald-500'));
            b.type = 'button';
            b.setAttribute('aria-label', 'Ir para o slide ' + (i + 1));
            b.setAttribute('aria-current', i ? 'false' : 'true');
            bolas.appendChild(b);
        }
        topo.append(pos, bolas);
        deck.appendChild(topo);

        const lista = el('ol', 'gs-lista space-y-2');
        itens.forEach((e, i) => {
            const li = el('li', 'flex items-center gap-3');
            li.appendChild(el('span', 'flex-shrink-0 w-7 h-7 rounded-full bg-emerald-500 text-white font-black text-sm flex items-center justify-center', String(i + 1)));
            li.appendChild(el('span', 'gs-en font-black text-navy', e.en));
            lista.appendChild(li);
        });
        const abre = el('div');
        abre.appendChild(lista);
        abre.appendChild(el('p', 'gs-nota mt-4 text-slate-500 text-sm', itens.length + ' frases prontas para usar na conversa. Ouça cada uma e veja quando usar.'));
        deck.appendChild(slide(0, total, 'Nesta aula', 'Key Expressions', abre));

        itens.forEach((e, i) => {
            const corpo = el('div');
            const ul = el('ul', 'gs-lista space-y-2');
            ul.appendChild(itemFrase(e.en, e.pt));
            if (e.ex) ul.appendChild(itemFrase(e.ex, '', 'Exemplo'));
            corpo.appendChild(ul);
            if (e.uso) {
                const nota = el('p', 'gs-nota mt-3 text-slate-600 text-sm');
                nota.appendChild(el('strong', 'text-navy', 'Quando usar: '));
                nota.appendChild(document.createTextNode(e.uso));
                corpo.appendChild(nota);
            }
            deck.appendChild(slide(i + 1, total, 'Expressão ' + (i + 1) + ' de ' + itens.length, e.en, corpo));
        });

        const nav = el('div', 'flex items-center gap-3 mt-4');
        const ant = el('button', 'gs-ant flex-shrink-0 inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-navy font-black px-5 py-3 rounded-2xl transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed', '← Anterior');
        ant.type = 'button'; ant.disabled = true;
        const prox = el('button', 'gs-prox flex-1 inline-flex items-center justify-center gap-1 bg-navy hover:opacity-90 text-white font-black px-5 py-3 rounded-2xl transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed', 'Próximo →');
        prox.type = 'button';
        nav.append(ant, prox);
        deck.appendChild(nav);

        container.className = '';
        container.replaceChildren(deck);
        const ligar = () => raiz.CapySlides.montar(deck, { aba: 'tab-expressions', aoUltimo: aoTerminar });
        if (raiz.CapySlides) ligar();
        else carregarMotor(ligar);
        return deck;
    }

    function carregarMotor(pronto) {
        let s = document.querySelector('script[data-capy-slides]');
        if (!s) {
            s = document.createElement('script');
            s.src = 'gramatica-slides.js?v=' + VERSAO_SLIDES;
            s.dataset.capySlides = '1';
            document.head.appendChild(s);
        }
        s.addEventListener('load', () => { if (raiz.CapySlides) pronto(); }, { once: true });
    }

    // ── 2. How do you say it in English? ──────────────────────────────────
    function traducao(container, dados, aoTerminar) {
        if (!container || !Array.isArray(dados) || !dados.length) return;
        const feitos = new Set();
        const placar = el('p', 'text-xs font-black text-slate-400 mb-4', '0 de ' + dados.length + ' frases');
        container.replaceChildren(placar);
        dados.forEach((d, i) => {
            const alvos = [d.en].concat(Array.isArray(d.aceitas) ? d.aceitas : []);
            const card = el('div', 'bg-white border-2 border-slate-200 rounded-2xl p-4 mb-3');
            const cab = el('div', 'flex items-start gap-3 mb-3');
            cab.appendChild(el('span', 'flex-shrink-0 w-7 h-7 rounded-full bg-emerald-500 text-white font-black text-sm flex items-center justify-center', String(i + 1)));
            cab.appendChild(el('p', 'font-bold text-navy leading-snug', '🇧🇷 ' + d.pt));
            const linha = el('div', 'flex flex-col sm:flex-row gap-2');
            const inp = el('input', 'trad-inp flex-1 border-2 border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:border-emerald-400 focus:outline-none');
            inp.type = 'text';
            inp.autocomplete = 'off';
            inp.setAttribute('autocapitalize', 'off');
            inp.spellcheck = false;
            inp.placeholder = 'Escreva em inglês…';
            inp.setAttribute('aria-label', 'Em inglês: ' + d.pt);
            const btn = el('button', 'bg-navy text-white font-black text-sm px-5 py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all', 'Conferir');
            btn.type = 'button';
            linha.append(inp, btn);
            const fb = el('div', 'mt-3 hidden');
            card.append(cab, linha, fb);
            container.appendChild(card);
            let tentativas = 0;

            function conferir() {
                const dito = inp.value.trim();
                if (!dito) { inp.focus(); return; }
                tentativas++;
                const r = conferirTraducao(dito, alvos);
                fb.className = 'mt-3 rounded-xl p-3 text-sm ' + (r.ok ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200');
                fb.replaceChildren();
                const outroJeito = r.ok && normalizarResposta(r.alvo) !== normalizarResposta(d.en);
                fb.appendChild(el('p', 'font-black ' + (r.ok ? 'text-emerald-700' : 'text-red-700'),
                    r.ok ? (outroJeito ? '✅ Certo! Também se diz assim:' : r.pct === 100 ? '✅ Isso! Perfeito.' : '✅ Isso! Do jeito que se diz:')
                        : (tentativas < 2 ? '❌ Quase. Tente de novo ou veja o jeito certo:' : '❌ O jeito certo:')));
                const certa = el('div', 'flex items-center gap-2 mt-1.5');
                const ouvir = el('button', 'flex-shrink-0 w-8 h-8 rounded-full bg-white border border-slate-200 text-navy flex items-center justify-center', '🔊');
                ouvir.type = 'button';
                ouvir.setAttribute('aria-label', 'Ouvir a resposta certa');
                ouvir.addEventListener('click', () => falar(d.en));
                certa.append(ouvir, el('p', 'font-bold text-navy', d.en));
                fb.appendChild(certa);
                if (!r.ok && r.faltando.length) fb.appendChild(el('p', 'text-xs text-red-600 mt-1.5', 'Faltou: ' + r.faltando.join(', ')));
                if (d.dica && !r.ok) fb.appendChild(el('p', 'text-xs text-slate-600 mt-1', '💡 ' + d.dica));
                inp.classList.toggle('border-emerald-400', r.ok);
                inp.classList.toggle('border-red-300', !r.ok);
                if (r.ok || tentativas >= 2) {
                    feitos.add(i);
                    placar.textContent = feitos.size + ' de ' + dados.length + ' frases';
                    if (feitos.size === dados.length && typeof aoTerminar === 'function') aoTerminar();
                }
            }
            btn.addEventListener('click', conferir);
            inp.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); conferir(); } });
        });
    }

    // ── 3. Texto com lacunas ──────────────────────────────────────────────
    function lacunas(container, dados, aoTerminar) {
        if (!container || !dados || !dados.texto) return;
        const partes = partesDoTexto(dados.texto);
        const certas = partes.filter(p => p.lacuna).map(p => p.lacuna);
        const respostas = certas.map(() => null);
        let escolhida = 0;
        let conferido = false;

        const caixa = el('div', 'lac-caixa flex flex-wrap gap-2 p-3 mb-4 rounded-2xl bg-emerald-50 border-2 border-dashed border-emerald-300');
        caixa.setAttribute('aria-label', 'Caixa de palavras');
        const texto = el('p', 'lac-texto text-navy text-base leading-loose bg-white border-2 border-slate-200 rounded-2xl p-4');
        const fim = el('div', 'flex flex-wrap items-center gap-3 mt-4');
        const btnConf = el('button', 'bg-navy text-white font-black px-6 py-3 rounded-2xl hover:opacity-90 active:scale-95 transition-all', 'Conferir');
        btnConf.type = 'button';
        const btnDe = el('button', 'hidden border-2 border-slate-200 text-slate-600 font-black px-5 py-3 rounded-2xl hover:border-emerald-300', 'Tentar de novo');
        btnDe.type = 'button';
        const btnOuvir = el('button', 'hidden border-2 border-slate-200 text-slate-600 font-black px-5 py-3 rounded-2xl hover:border-emerald-300', '🔊 Ouvir o texto');
        btnOuvir.type = 'button';
        const res = el('p', 'w-full text-sm font-black hidden');
        fim.append(btnConf, btnDe, btnOuvir, res);

        const titulo = dados.titulo ? el('h3', 'font-black text-navy text-lg mb-2', dados.titulo) : null;
        container.replaceChildren(...[titulo, el('p', 'text-slate-500 text-sm mb-3', 'Toque num pedaço da caixa para colocar na lacuna marcada. Toque numa lacuna preenchida para devolver o pedaço.'), caixa, texto, fim].filter(Boolean));

        const pecas = embaralhar(certas.concat(Array.isArray(dados.extras) ? dados.extras : []))
            .map((t, k) => ({ t, k, usada: false }));
        const lacunasEl = [];

        partes.forEach(p => {
            if (p.t != null) { texto.appendChild(document.createTextNode(p.t)); return; }
            const idx = lacunasEl.length;
            const b = el('button', 'lac-gap inline-block align-baseline mx-0.5 min-w-[5.5rem] px-2 py-0.5 rounded-lg border-b-2 font-bold text-sm transition-all');
            b.type = 'button';
            b.addEventListener('click', () => {
                if (conferido) return;
                if (respostas[idx] != null) devolver(idx);
                escolhida = idx;
                pintar();
            });
            lacunasEl.push(b);
            texto.appendChild(b);
        });

        function devolver(idx) {
            const peca = pecas.find(q => q.k === respostas[idx]);
            if (peca) peca.usada = false;
            respostas[idx] = null;
        }

        function proximaVazia(de) {
            for (let n = 0; n < respostas.length; n++) { const i = (de + n) % respostas.length; if (respostas[i] == null) return i; }
            return -1;
        }

        function pintar() {
            caixa.replaceChildren();
            pecas.forEach(q => {
                if (q.usada) return;
                const c = el('button', 'lac-peca bg-white border-2 border-emerald-300 text-navy font-bold text-sm px-3 py-1.5 rounded-xl hover:bg-emerald-100 active:scale-95 transition-all', q.t);
                c.type = 'button';
                c.disabled = conferido;
                c.addEventListener('click', () => {
                    const alvo = respostas[escolhida] == null ? escolhida : proximaVazia(escolhida);
                    if (alvo < 0) return;
                    respostas[alvo] = q.k;
                    q.usada = true;
                    const prox = proximaVazia(alvo);
                    escolhida = prox < 0 ? alvo : prox;
                    pintar();
                });
                caixa.appendChild(c);
            });
            if (!caixa.children.length) caixa.appendChild(el('span', 'text-xs text-slate-400', 'Caixa vazia.'));
            if (conferido) return;   // depois de conferir, as lacunas mostram certo/errado e não são redesenhadas
            lacunasEl.forEach((b, i) => {
                const peca = pecas.find(q => q.k === respostas[i]);
                b.replaceChildren(document.createTextNode(peca ? peca.t : ' '));
                let cor = peca ? 'bg-emerald-50 border-emerald-400 text-navy' : 'bg-slate-100 border-slate-300 text-slate-400';
                if (!conferido && i === escolhida) cor += ' ring-2 ring-emerald-400';
                b.className = b.className.replace(/\b(bg|border|text|ring)-[a-z0-9-]+|\bring-2\b/g, '').replace(/\s+/g, ' ').trim() + ' ' + cor;
                b.setAttribute('aria-label', 'Lacuna ' + (i + 1) + (peca ? ': ' + peca.t : ', vazia'));
            });
        }

        btnConf.addEventListener('click', () => {
            if (respostas.some(r => r == null)) {
                res.className = 'w-full text-sm font-black text-amber-600';
                res.textContent = 'Preencha todas as lacunas antes de conferir.';
                return;
            }
            conferido = true;
            const ditas = respostas.map(k => (pecas.find(q => q.k === k) || {}).t || '');
            const r = conferirLacunas(ditas, certas);
            lacunasEl.forEach((b, i) => {
                const ok = r.marcas[i];
                b.disabled = true;
                b.className = b.className.replace(/\b(bg|border|text|ring)-[a-z0-9-]+|\bring-2\b/g, '').replace(/\s+/g, ' ').trim()
                    + (ok ? ' bg-emerald-100 border-emerald-500 text-emerald-800' : ' bg-red-50 border-red-400 text-red-700');
                if (!ok) {
                    b.replaceChildren();
                    b.appendChild(el('s', 'opacity-60', ditas[i]));
                    b.appendChild(document.createTextNode(' → ' + certas[i]));
                }
            });
            pintar();
            res.className = 'w-full text-sm font-black ' + (r.acertos === r.total ? 'text-emerald-600' : 'text-navy');
            res.textContent = (r.acertos === r.total ? '🎉 ' : '') + r.acertos + ' de ' + r.total + ' certas.' + (r.acertos === r.total ? '' : ' As certas aparecem depois da seta.');
            btnConf.classList.add('hidden');
            btnDe.classList.remove('hidden');
            btnOuvir.classList.remove('hidden');
            if (typeof aoTerminar === 'function') aoTerminar(r);
        });
        btnDe.addEventListener('click', () => {
            conferido = false;
            respostas.fill(null);
            pecas.forEach(q => { q.usada = false; });
            escolhida = 0;
            lacunasEl.forEach(b => { b.disabled = false; });
            btnConf.classList.remove('hidden');
            btnDe.classList.add('hidden');
            res.className = 'w-full text-sm font-black hidden';
            pintar();
        });
        btnOuvir.addEventListener('click', () => falar(dados.texto.replace(/\[\[|\]\]/g, '')));
        pintar();
    }

    raiz.CapyAula = { expressoes, traducao, lacunas, puras };

    // ── Ligação automática nas aulas do molde ─────────────────────────────
    // EXPR_DATA/TRAD_DATA/LACUNAS_DATA são const de script clássico: ficam no
    // escopo global e se leem pelo nome, mas não como window.X. O CSP das aulas
    // não tem 'unsafe-eval' (eval cairia), mas aceita script inline: um <script>
    // de uma linha copia as três para window.__capyDadosAula.
    let dados = null;
    function dado(nome) {
        if (!dados) {
            raiz.__capyDadosAula = {};
            const s = document.createElement('script');
            s.textContent = 'window.__capyDadosAula={' + ['EXPR_DATA', 'TRAD_DATA', 'LACUNAS_DATA']
                .map(n => n + ':typeof ' + n + '!=="undefined"?' + n + ':undefined').join(',') + '};';
            (document.head || document.documentElement).appendChild(s);
            s.remove();
            dados = raiz.__capyDadosAula || {};
        }
        return dados[nome];
    }
    function marcar(secao) {
        if (typeof raiz.markSection === 'function') raiz.markSection(secao);
    }
    function ligar() {
        const molde = document.getElementById('rota-indice-lista');
        const grade = document.getElementById('expr-grid');
        const expr = dado('EXPR_DATA');
        if (molde && grade && Array.isArray(expr)) {
            const sub = document.querySelector('#tab-expressions > h2 + p');
            if (sub) sub.textContent = 'Uma expressão por slide. Ouça, veja quando usar e passe com as setas. Toque no slide para ver em tela cheia.';
            expressoes(grade, expr, () => marcar('expressions'));
        }
        const trad = document.getElementById('trad-area');
        if (trad) traducao(trad, dado('TRAD_DATA'), () => marcar('traducao'));
        const lac = document.getElementById('lacunas-area');
        if (lac) lacunas(lac, dado('LACUNAS_DATA'), () => marcar('lacunas'));
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ligar);
    else ligar();
})(typeof window !== 'undefined' ? window : globalThis);
