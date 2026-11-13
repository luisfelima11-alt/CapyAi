// ══════════════════════════════════════════════════════════════════════════════
// Capy no YouTube — a legenda dupla, o clique na palavra e o frase a frase
// ══════════════════════════════════════════════════════════════════════════════
// Content script (mundo isolado). Recebe as faixas do yt-captura.js (mundo da
// página) por window.postMessage e desenha, dentro do player, um shadow DOM
// com: a linha em inglês (cada palavra clicável), a linha em português, a
// barra ⏮ 🔁 ⏭ e a bolha de tradução.
//
// Regras que seguram a extensão de pé no YouTube:
// - nada de innerHTML: o YouTube exige Trusted Types e o texto da legenda vem
//   da página. Tudo é createElement + textContent;
// - a chave da Capy nunca passa por aqui: traduzir e salvar são pedidos ao
//   service worker (background.js), que é quem fala com a API.
// ══════════════════════════════════════════════════════════════════════════════
(function () {
    'use strict';
    if (window.__capyOverlay) return;
    window.__capyOverlay = true;

    const L = self.CapyLegendas;
    const MARCA = 'capy-legendas-v1';
    const SITE = 'https://www.capyenglish.com.br';
    const AJUSTES_PADRAO = { ligado: true, mostrarPt: true, pausarNoFim: false };

    const estado = {
        videoId: '',
        cues: [],
        visivel: -1,
        ajustes: { ...AJUSTES_PADRAO },
        fechadoEm: '',          // o aluno fechou a Capy neste vídeo
        ultimaPausa: -1,
        raf: 0,
        tentativas: [],
        salvas: new Set(),
        retomar: false,
        bolhaPalavra: '',
        pedidoBolha: 0,
    };

    // ── Fala com o service worker ───────────────────────────────────────────
    async function pedir(msg) {
        try {
            const r = await chrome.runtime.sendMessage(msg);
            return r || { ok: false, erro: 'interno' };
        } catch (_) {
            // A extensão foi atualizada/recarregada: este script ficou órfão.
            return { ok: false, erro: 'recarregar' };
        }
    }

    function guardar(chave, valor) {
        try { chrome.storage.local.set({ [chave]: valor }); } catch (_) { /* órfão: ignora */ }
    }

    // ── Página e player ─────────────────────────────────────────────────────
    function videoDaPagina() {
        if (location.pathname !== '/watch') return '';
        try { return new URL(location.href).searchParams.get('v') || ''; } catch (_) { return ''; }
    }
    function jogador() { return document.getElementById('movie_player'); }
    function video() {
        const p = jogador();
        return (p && p.querySelector('video')) || document.querySelector('video.html5-main-video');
    }
    function paraCaptura(msg) { window.postMessage(Object.assign({ capy: MARCA }, msg), location.origin); }

    // ── Shadow DOM ──────────────────────────────────────────────────────────
    const CSS = `
:host { all: initial; }
.raiz { position: relative; display: flex; flex-direction: column; align-items: center; gap: 6px;
  font-family: "Plus Jakarta Sans", Roboto, Arial, sans-serif; --fs: 22px; pointer-events: none; }
.raiz[hidden] { display: none; }
.caixa { pointer-events: auto; max-width: 88%; background: rgba(0, 12, 28, .78); border-radius: 14px;
  padding: .28em .8em .34em; text-align: center; box-shadow: 0 4px 18px rgba(0,0,0,.35); }
.caixa[hidden], .barra[hidden], .aviso[hidden], .bolha[hidden], .pt[hidden] { display: none; }
.en { color: #fff; font-size: var(--fs); font-weight: 700; line-height: 1.3; text-shadow: 0 1px 2px #000; }
.pt { color: #a7f3d0; font-size: calc(var(--fs) * .78); font-weight: 500; line-height: 1.3; margin-top: .1em; }
.p { cursor: pointer; border-radius: 6px; padding: 0 .06em; transition: background .12s; }
.p:hover { background: rgba(236, 72, 153, .55); }
.p.salva { box-shadow: inset 0 -.14em 0 #ec4899; }
.p.ativa { background: #ec4899; }
.barra { pointer-events: auto; display: flex; gap: 4px; align-items: center; background: rgba(0, 12, 28, .7);
  border-radius: 9999px; padding: 3px 6px; opacity: .35; transition: opacity .15s; }
.raiz:hover .barra, .raiz.pausado .barra, .barra:focus-within { opacity: 1; }
.barra button, .bolha button { font: inherit; cursor: pointer; border: 0; }
.barra button { background: transparent; color: #fff; font-size: 15px; line-height: 1; min-width: 30px; height: 28px;
  border-radius: 9999px; padding: 0 7px; }
.barra button:hover { background: rgba(255,255,255,.16); }
.barra button:active { transform: scale(.96); }
.barra button[aria-pressed="true"] { background: #ec4899; }
.barra .marca { font-weight: 800; font-size: 12px; color: #fbcfe8; }
.aviso { pointer-events: auto; background: rgba(0, 12, 28, .82); color: #fff; font-size: 13px; font-weight: 600;
  border-radius: 9999px; padding: 6px 14px; display: flex; gap: 10px; align-items: center; }
.aviso a { color: #f9a8d4; }
.aviso button { background: transparent; color: #fff; border: 0; cursor: pointer; font: inherit; }
.bolha { pointer-events: auto; position: absolute; bottom: calc(100% + 10px); width: 264px; transform: translateX(-50%);
  background: #fff; color: #001f3f; border-radius: 18px; padding: 12px 14px 14px; box-shadow: 0 10px 30px rgba(0,0,0,.45);
  font-size: 14px; line-height: 1.35; }
.bolha .topo { display: flex; align-items: center; gap: 6px; }
.bolha .palavra { font-size: 18px; font-weight: 800; flex: 1; word-break: break-word; }
.bolha .icone { background: #f1f5f9; color: #001f3f; width: 32px; height: 32px; border-radius: 9999px; font-size: 15px; }
.bolha .trad { margin-top: 6px; font-size: 16px; font-weight: 800; color: #047857; }
.bolha .expl { margin-top: 2px; color: #475569; font-size: 13px; }
.bolha .salvar { margin-top: 10px; width: 100%; background: #ec4899; color: #fff; font-weight: 800; padding: 9px 12px;
  border-radius: 9999px; font-size: 14px; }
.bolha .salvar:disabled { background: #10b981; cursor: default; }
.bolha .salvar:active:not(:disabled) { transform: scale(.98); }
.bolha .nota { margin-top: 8px; font-size: 12.5px; color: #475569; }
.bolha .nota a { color: #db2777; font-weight: 700; }
.toast { position: absolute; bottom: calc(100% + 10px); background: rgba(0, 12, 28, .9); color: #fff; font-size: 13px;
  font-weight: 700; border-radius: 9999px; padding: 6px 14px; pointer-events: none; }
.toast[hidden] { display: none; }
`;

    let host = null, raiz, caixa, linhaEn, linhaPt, barra, aviso, avisoTexto, bolha, toast;
    const botoes = {};

    function el(tag, classe, texto) {
        const e = document.createElement(tag);
        if (classe) e.className = classe;
        if (texto != null) e.textContent = texto;
        return e;
    }

    function botao(rotulo, titulo, aoClicar) {
        const b = el('button', '', rotulo);
        b.type = 'button';
        b.title = titulo;
        b.setAttribute('aria-label', titulo);
        b.addEventListener('click', e => { e.stopPropagation(); aoClicar(); });
        return b;
    }

    function montar() {
        host = document.createElement('div');
        host.id = 'capy-legendas-host';
        host.setAttribute('translate', 'no');
        // Aberto: os testes de ponta a ponta leem a legenda como o aluno vê. Fechar
        // não protegeria nada — a página do YouTube já controla o player inteiro.
        const sombra = host.attachShadow({ mode: 'open' });
        try {
            const folha = new CSSStyleSheet();
            folha.replaceSync(CSS);
            sombra.adoptedStyleSheets = [folha];
        } catch (_) {
            sombra.appendChild(el('style', '', CSS));
        }

        raiz = el('div', 'raiz');
        raiz.hidden = true;

        toast = el('div', 'toast');
        toast.hidden = true;

        aviso = el('div', 'aviso');
        aviso.hidden = true;
        avisoTexto = el('span');
        const fecharAviso = botao('✕', 'Fechar aviso', () => { aviso.hidden = true; });
        aviso.append(avisoTexto, fecharAviso);

        barra = el('div', 'barra');
        barra.hidden = true;
        botoes.anterior = botao('⏮', 'Frase anterior (A)', () => navegar('anterior'));
        botoes.repetir = botao('🔁', 'Repetir a frase (S)', () => navegar('repetir'));
        botoes.proxima = botao('⏭', 'Próxima frase (D)', () => navegar('proxima'));
        botoes.pausar = botao('⏸ fim', 'Pausar no fim de cada frase (Q)', () => alternar('pausarNoFim'));
        botoes.pt = botao('PT', 'Mostrar a tradução em português', () => alternar('mostrarPt'));
        botoes.fechar = botao('✕', 'Fechar a Capy neste vídeo', fecharNesteVideo);
        const marca = el('span', 'marca', '🦫 Capy');
        barra.append(marca, botoes.anterior, botoes.repetir, botoes.proxima, botoes.pausar, botoes.pt, botoes.fechar);

        caixa = el('div', 'caixa');
        caixa.hidden = true;
        linhaEn = el('div', 'en');
        linhaEn.setAttribute('lang', 'en');
        linhaPt = el('div', 'pt');
        linhaPt.setAttribute('lang', 'pt-BR');
        caixa.append(linhaEn, linhaPt);
        linhaEn.addEventListener('click', aoClicarPalavra);

        bolha = el('div', 'bolha');
        bolha.hidden = true;
        bolha.setAttribute('role', 'dialog');

        raiz.append(toast, aviso, barra, caixa, bolha);
        sombra.appendChild(raiz);

        // Cliques dentro da Capy não podem chegar ao player (clique pausa,
        // duplo clique põe em tela cheia).
        for (const tipo of ['click', 'dblclick', 'mousedown', 'mouseup', 'pointerdown', 'pointerup', 'touchstart', 'touchend']) {
            host.addEventListener(tipo, e => e.stopPropagation());
        }
    }

    let observador = null;
    function garantirHost() {
        const p = jogador();
        if (!p) return false;
        if (!host) montar();
        if (host.parentElement !== p) {
            p.appendChild(host);
            ajustarFonte();
            // Tela cheia, modo cinema, miniplayer: a fonte acompanha o player.
            if ('ResizeObserver' in window) {
                if (observador) observador.disconnect();
                observador = new ResizeObserver(ajustarFonte);
                observador.observe(p);
            }
        }
        return true;
    }

    function ajustarFonte() {
        const p = jogador();
        if (!p || !raiz) return;
        const h = p.clientHeight || 360;
        raiz.style.setProperty('--fs', Math.round(Math.max(15, Math.min(34, h * 0.045))) + 'px');
    }

    // ── Desenho ─────────────────────────────────────────────────────────────
    function ativo() {
        return estado.ajustes.ligado && estado.videoId && estado.fechadoEm !== estado.videoId;
    }

    // Durante o anúncio o <video> é o mesmo, mas o tempo é do anúncio: nada de
    // pausar no "fim da frase" nem de pular frase.
    function emAnuncio() {
        const p = jogador();
        return !!(p && p.classList.contains('ad-showing'));
    }

    function atualizarBarra() {
        if (!raiz) return;
        botoes.pausar.setAttribute('aria-pressed', String(!!estado.ajustes.pausarNoFim));
        botoes.pt.setAttribute('aria-pressed', String(!!estado.ajustes.mostrarPt));
        const v = video();
        raiz.classList.toggle('pausado', !!(v && v.paused));
    }

    function desenhar() {
        if (!garantirHost()) return;
        const p = jogador();
        const temCues = estado.cues.length > 0;
        const ligado = ativo();
        p.classList.toggle('capy-ligado', !!(ligado && temCues));
        raiz.hidden = !ligado;
        barra.hidden = !temCues;
        atualizarBarra();
        desenharLinha();
    }

    function desenharLinha() {
        if (!raiz) return;
        const c = estado.cues[estado.visivel];
        if (!c || !ativo()) { caixa.hidden = true; return; }
        linhaEn.replaceChildren();
        for (const parte of L.tokens(c.texto)) {
            if (!parte.palavra) { linhaEn.append(document.createTextNode(parte.texto)); continue; }
            const s = el('span', 'p', parte.texto);
            s.dataset.palavra = parte.palavra;
            if (estado.salvas.has(parte.palavra)) s.classList.add('salva');
            if (!bolha.hidden && estado.bolhaPalavra === parte.palavra) s.classList.add('ativa');
            linhaEn.append(s);
        }
        linhaPt.textContent = c.pt || '';
        linhaPt.hidden = !estado.ajustes.mostrarPt || !c.pt;
        caixa.hidden = false;
    }

    let toastTimer = 0;
    function mostrarToast(texto) {
        if (!toast) return;
        toast.textContent = texto;
        toast.hidden = false;
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => { toast.hidden = true; }, 1600);
    }

    let avisoTimer = 0;
    function mostrarAviso(texto, link, duracao) {
        if (!garantirHost()) return;
        avisoTexto.replaceChildren(document.createTextNode(texto));
        if (link) {
            avisoTexto.append(' ');
            const a = el('a', '', link.texto);
            a.href = link.href;
            a.target = '_blank';
            a.rel = 'noopener';
            avisoTexto.append(a);
        }
        aviso.hidden = false;
        clearTimeout(avisoTimer);
        if (duracao) avisoTimer = setTimeout(() => { aviso.hidden = true; }, duracao);
    }

    // ── Tempo ───────────────────────────────────────────────────────────────
    function atualizar() {
        const v = video();
        if (!v || !estado.cues.length || emAnuncio()) return;
        const t = v.currentTime;
        const i = L.indiceVisivel(estado.cues, t);
        if (i !== estado.visivel) { estado.visivel = i; desenharLinha(); }

        // Pausar no fim de cada frase: uma vez por frase. Depois do ▶ o aluno
        // segue; ao repetir (🔁) a trava zera e pausa de novo no fim.
        if (estado.ajustes.pausarNoFim && ativo() && !v.paused) {
            const k = L.indiceNoTempo(estado.cues, t);
            if (k >= 0 && k !== estado.ultimaPausa) {
                const c = estado.cues[k];
                if (t >= c.fim - 0.12 && t < c.fim + 0.5) {
                    estado.ultimaPausa = k;
                    v.pause();
                }
            }
        }
    }

    function tique() {
        estado.raf = 0;
        atualizar();
        const v = video();
        if (v && !v.paused) estado.raf = requestAnimationFrame(tique);
    }

    function ligarRelogio() {
        if (!estado.raf) estado.raf = requestAnimationFrame(tique);
    }

    let videoOuvido = null;
    function ouvirVideo() {
        const v = video();
        if (!v || v === videoOuvido) return;
        videoOuvido = v;
        v.addEventListener('play', () => { ligarRelogio(); atualizarBarra(); });
        v.addEventListener('pause', () => { atualizar(); atualizarBarra(); });
        v.addEventListener('seeked', atualizar);
        v.addEventListener('timeupdate', () => { if (v.paused) atualizar(); });
        if (!v.paused) ligarRelogio();
    }

    function navegar(acao) {
        const v = video();
        if (!v || !estado.cues.length || !ativo() || emAnuncio()) return;
        const i = L.destino(estado.cues, v.currentTime, acao);
        if (i < 0) return;
        estado.ultimaPausa = -1;
        fecharBolha(false);
        v.currentTime = estado.cues[i].inicio + 0.01;
        estado.visivel = i;
        desenharLinha();
        const tocar = v.play();
        if (tocar && tocar.catch) tocar.catch(() => {});
    }

    function alternar(chave) {
        estado.ajustes = { ...estado.ajustes, [chave]: !estado.ajustes[chave] };
        guardar('capyAjustes', estado.ajustes);
        if (chave === 'pausarNoFim') {
            estado.ultimaPausa = video() ? L.indiceNoTempo(estado.cues, video().currentTime) : -1;
            mostrarToast(estado.ajustes.pausarNoFim ? '⏸ Pausar no fim de cada frase: ligado' : '▶ Pausar no fim de cada frase: desligado');
        }
        atualizarBarra();
        desenharLinha();
    }

    function fecharNesteVideo() {
        estado.fechadoEm = estado.videoId;
        fecharBolha(false);
        desenhar();
    }

    // ── Bolha da palavra ────────────────────────────────────────────────────
    function aoClicarPalavra(e) {
        const alvo = e.target && e.target.closest ? e.target.closest('.p') : null;
        if (!alvo) return;
        e.stopPropagation();
        const v = video();
        if (bolha.hidden) estado.retomar = !!(v && !v.paused);
        if (v && !v.paused) v.pause();
        const c = estado.cues[estado.visivel];
        abrirBolha(alvo, alvo.textContent, c ? c.texto : '');
    }

    function posicionarBolha(alvo) {
        const r = raiz.getBoundingClientRect();
        const w = alvo.getBoundingClientRect();
        const meio = w.left + w.width / 2 - r.left;
        const metade = 140;
        bolha.style.left = Math.max(metade, Math.min(r.width - metade, meio)) + 'px';
    }

    function linhaDeBolha(classe, texto) { return el('div', classe, texto); }

    async function abrirBolha(alvo, palavra, frase) {
        const meu = ++estado.pedidoBolha;
        const chave = palavra.replace(/’/g, "'").toLowerCase();
        estado.bolhaPalavra = chave;
        bolha.replaceChildren();
        const topo = el('div', 'topo');
        const titulo = el('div', 'palavra', palavra);
        titulo.setAttribute('lang', 'en');
        const ouvir = botao('🔊', 'Ouvir a palavra', () => falar(palavra));
        ouvir.className = 'icone';
        const fechar = botao('✕', 'Fechar', () => fecharBolha(true));
        fechar.className = 'icone';
        topo.append(titulo, ouvir, fechar);
        const trad = linhaDeBolha('trad', 'Traduzindo…');
        const expl = linhaDeBolha('expl', '');
        bolha.append(topo, trad, expl);
        bolha.hidden = false;
        posicionarBolha(alvo);
        desenharLinha();

        const r = await pedir({ tipo: 'traduzir', palavra, frase });
        if (meu !== estado.pedidoBolha) return;
        if (!r.ok) { mostrarErroNaBolha(r.erro, trad); return; }
        trad.textContent = r.traducao || '—';
        expl.textContent = r.explicacao || '';

        const salvar = el('button', 'salvar', estado.salvas.has(chave) ? '✓ Já está na sua revisão' : '⭐ Salvar na revisão');
        salvar.type = 'button';
        salvar.disabled = estado.salvas.has(chave);
        const nota = el('div', 'nota');
        nota.hidden = true;
        salvar.addEventListener('click', async ev => {
            ev.stopPropagation();
            salvar.disabled = true;
            salvar.textContent = 'Salvando…';
            const s = await pedir({ tipo: 'salvar', palavra, traducao: r.traducao || '' });
            if (meu !== estado.pedidoBolha) return;
            if (!s.ok) {
                salvar.disabled = false;
                salvar.textContent = '⭐ Salvar na revisão';
                mostrarErroNaBolha(s.erro, nota);
                nota.hidden = false;
                return;
            }
            estado.salvas.add(chave);
            guardar('capySalvas', [...estado.salvas].slice(-500));
            salvar.textContent = '✓ Salva na sua revisão';
            nota.textContent = 'Ela aparece na “Revisão de palavras” do seu plano de hoje.';
            nota.hidden = false;
            desenharLinha();
        });
        bolha.append(salvar, nota);
    }

    function mostrarErroNaBolha(erro, alvo) {
        alvo.replaceChildren();
        if (erro === 'sem-conta') {
            alvo.append('Conecte sua conta Capy para traduzir e salvar palavras. ');
            const a = el('a', '', 'Conectar');
            a.href = SITE + '/extensao.html';
            a.target = '_blank';
            a.rel = 'noopener';
            alvo.append(a);
        } else if (erro === 'limite') {
            alvo.textContent = 'Você usou as traduções de hoje do seu plano. Amanhã tem mais!';
        } else if (erro === 'recarregar') {
            alvo.textContent = 'A extensão foi atualizada. Recarregue a página do vídeo.';
        } else if (erro === 'rede') {
            alvo.textContent = 'Sem conexão com a Capy agora. Tente de novo.';
        } else {
            alvo.textContent = 'Não deu para traduzir agora. Tente de novo.';
        }
    }

    function fecharBolha(retomar) {
        if (!bolha || bolha.hidden) return;
        estado.pedidoBolha++;
        bolha.hidden = true;
        estado.bolhaPalavra = '';
        desenharLinha();
        const v = video();
        if (retomar && estado.retomar && v && v.paused) {
            const tocar = v.play();
            if (tocar && tocar.catch) tocar.catch(() => {});
        }
        estado.retomar = false;
    }

    function falar(texto) {
        try {
            const fala = new SpeechSynthesisUtterance(texto);
            fala.lang = 'en-US';
            fala.rate = 0.9;
            speechSynthesis.cancel();
            speechSynthesis.speak(fala);
        } catch (_) { /* sem voz no navegador */ }
    }

    // ── Faixas que chegam da captura ────────────────────────────────────────
    function receberFaixas(d) {
        if (d.videoId !== estado.videoId) return;
        const en = L.lerJson3(d.en);
        if (!en.length) { mostrarAviso('🦫 Capy: a legenda em inglês deste vídeo veio vazia.', null, 5000); return; }
        const pt = d.pt ? L.lerJson3(d.pt) : [];
        estado.cues = L.alinhar(en, pt);
        estado.visivel = -1;
        estado.ultimaPausa = -1;
        cancelarTentativas();
        if (aviso) aviso.hidden = true;
        ouvirVideo();
        desenhar();
        atualizar();
    }

    function cancelarTentativas() {
        estado.tentativas.forEach(clearTimeout);
        estado.tentativas = [];
    }

    // Vídeo novo: pede a faixa já capturada; se não houver, pede ao player a
    // faixa em inglês (1,5 s, 4 s e 8 s — o módulo de legendas pode demorar).
    function novoVideo(id) {
        estado.videoId = id;
        estado.cues = [];
        estado.visivel = -1;
        estado.ultimaPausa = -1;
        fecharBolha(false);
        cancelarTentativas();
        if (aviso) aviso.hidden = true;
        desenhar();
        if (!id || !estado.ajustes.ligado) return;
        paraCaptura({ tipo: 'nova-pagina' });
        paraCaptura({ tipo: 'pedir-faixas' });
        for (const ms of [1500, 4000, 8000]) {
            estado.tentativas.push(setTimeout(() => {
                if (estado.videoId === id && !estado.cues.length && ativo()) paraCaptura({ tipo: 'ligar-ingles' });
            }, ms));
        }
        estado.tentativas.push(setTimeout(() => {
            if (estado.videoId === id && !estado.cues.length && ativo()) {
                mostrarAviso('🦫 Capy: não achei a legenda em inglês. Ligue o CC do vídeo e escolha English.', null, 7000);
            }
        }, 11000));
    }

    window.addEventListener('message', e => {
        if (e.source !== window || !e.data || e.data.capy !== MARCA) return;
        const d = e.data;
        if (d.tipo === 'faixas' && typeof d.en === 'string' && (d.pt == null || typeof d.pt === 'string')) {
            receberFaixas(d);
        } else if (d.tipo === 'cc' && d.videoId === estado.videoId && ativo() && !estado.cues.length) {
            if (d.estado === 'sem-ingles') { cancelarTentativas(); mostrarAviso('🦫 Capy: este vídeo não tem legenda em inglês.', null, 5000); }
            if (d.estado === 'sem-legendas') { cancelarTentativas(); mostrarAviso('🦫 Capy: este vídeo não tem legendas.', null, 5000); }
        } else if (d.tipo === 'erro' && d.videoId === estado.videoId && ativo()) {
            mostrarAviso('🦫 Capy: não consegui baixar a legenda. Ligue e desligue o CC.', null, 7000);
        }
    });

    // ── Teclado: A ⏮ · S 🔁 · D ⏭ · Q pausar no fim · Esc fecha a bolha ───
    document.addEventListener('keydown', e => {
        if (!ativo() || !estado.cues.length || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
        const alvo = (e.composedPath && e.composedPath()[0]) || e.target;
        if (alvo && (alvo.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(alvo.tagName || ''))) return;
        const k = String(e.key || '').toLowerCase();
        const acao = { a: 'anterior', s: 'repetir', d: 'proxima' }[k];
        if (acao) navegar(acao);
        else if (k === 'q') alternar('pausarNoFim');
        else if (k === 'escape' && bolha && !bolha.hidden) fecharBolha(true);
        else return;
        e.preventDefault();
        e.stopPropagation();
    }, true);

    // ── Ajustes (popup ⇄ página) ────────────────────────────────────────────
    function aplicarAjustes(novos) {
        const antes = estado.ajustes.ligado;
        estado.ajustes = { ...AJUSTES_PADRAO, ...(novos || {}) };
        if (!antes && estado.ajustes.ligado) novoVideo(videoDaPagina());
        else desenhar();
    }

    try {
        chrome.storage.local.get(['capyAjustes', 'capySalvas']).then(d => {
            estado.salvas = new Set(Array.isArray(d.capySalvas) ? d.capySalvas : []);
            aplicarAjustes(d.capyAjustes);
        }).catch(() => {});
        chrome.storage.onChanged.addListener((mudou, area) => {
            if (area !== 'local') return;
            if (mudou.capyAjustes) aplicarAjustes(mudou.capyAjustes.newValue);
            if (mudou.capySalvas) { estado.salvas = new Set(mudou.capySalvas.newValue || []); desenharLinha(); }
        });
    } catch (_) { /* fora da extensão (testes sem chrome.storage) */ }

    // ── Navegação do YouTube (SPA) ──────────────────────────────────────────
    function verificar() {
        const id = videoDaPagina();
        if (id !== estado.videoId) novoVideo(id);
        if (id) { garantirHost(); ouvirVideo(); }
    }
    document.addEventListener('yt-navigate-finish', verificar);
    setInterval(verificar, 1000);
    verificar();
})();
