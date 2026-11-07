// ══════════════════════════════════════════════════════════════════════════════
// Capy no YouTube — captura das legendas (roda no MUNDO DA PÁGINA, "MAIN")
// ══════════════════════════════════════════════════════════════════════════════
// Por que no mundo da página: desde 2025 o /api/timedtext só responde com o
// token `pot` que o próprio player gera. Em vez de imitar o player, a gente
// observa o pedido que ELE faz, pega a URL (com o token) e pede de novo a
// mesma faixa em json3 — em inglês e com a tradução automática para português.
//
// Este arquivo é o mínimo possível: não tem acesso a chrome.*, não fala com a
// Capy e não guarda nada. Só entrega texto de legenda ao content script
// (yt-overlay.js) por window.postMessage, e liga a faixa em inglês quando ele
// pede. Tudo o que vem daqui é tratado lá como TEXTO (nunca HTML).
// ══════════════════════════════════════════════════════════════════════════════
(function () {
    'use strict';
    if (window.__capyLegendasCaptura) return;
    window.__capyLegendasCaptura = true;

    const MARCA = 'capy-legendas-v1';
    const TETO = 3 * 1024 * 1024;           // json3 de vídeo de 3 h fica bem abaixo
    const fetchOriginal = window.fetch;

    let ultimaChave = '';
    let pedidoAtual = 0;
    let ultimoPacote = null;
    let trocouEm = '';                      // troca para inglês: uma vez por vídeo

    const ehTimedtext = url => /\/api\/timedtext\?/.test(String(url || ''));

    function enviar(msg) {
        window.postMessage(Object.assign({ capy: MARCA }, msg), location.origin);
    }

    function videoDaPagina() {
        try { return new URL(location.href).searchParams.get('v') || ''; } catch (_) { return ''; }
    }

    function idiomaBase(c) { return String(c || '').toLowerCase().split(/[-_]/)[0]; }

    function urlDaFaixa(original, alvo) {
        const u = new URL(original, location.origin);
        u.searchParams.set('fmt', 'json3');
        if (idiomaBase(u.searchParams.get('lang')) === alvo) u.searchParams.delete('tlang');
        else u.searchParams.set('tlang', alvo);
        return u.toString();
    }

    async function baixar(url) {
        try {
            const r = await fetchOriginal.call(window, url, { credentials: 'include' });
            if (!r.ok) return null;
            const t = await r.text();
            return t && t.length <= TETO ? t : null;
        } catch (_) { return null; }
    }

    // ── O player ────────────────────────────────────────────────────────────
    function jogador() { return document.getElementById('movie_player'); }

    function faixasDoVideo() {
        const p = jogador();
        let lista = [];
        try { lista = (p && p.getOption && p.getOption('captions', 'tracklist', { includeAsr: true })) || []; } catch (_) { lista = []; }
        if (lista.length) return lista;
        // Antes de o módulo de legendas carregar, a lista vem vazia: a resposta
        // do player já diz quais faixas o vídeo tem.
        try {
            const resp = p && p.getPlayerResponse && p.getPlayerResponse();
            const tracks = resp && resp.captions && resp.captions.playerCaptionsTracklistRenderer
                && resp.captions.playerCaptionsTracklistRenderer.captionTracks;
            return Array.isArray(tracks) ? tracks.map(t => ({ languageCode: t.languageCode, kind: t.kind || '' })) : [];
        } catch (_) { return []; }
    }

    function faixaEmIngles(lista) {
        const en = lista.filter(t => idiomaBase(t.languageCode) === 'en');
        return en.find(t => t.kind !== 'asr') || en[0] || null;
    }

    // Pede ao player a faixa em inglês. Ele mesmo busca a legenda, e a gente
    // captura esse pedido (o único que leva o token certo).
    function ligarIngles() {
        const p = jogador();
        if (!p) return 'sem-jogador';
        try { if (p.loadModule) p.loadModule('captions'); } catch (_) { /* segue */ }
        const lista = faixasDoVideo();
        const en = faixaEmIngles(lista);
        if (en) {
            try {
                p.setOption('captions', 'track', en.kind === 'asr' ? { languageCode: en.languageCode, kind: 'asr' } : { languageCode: en.languageCode });
                return 'ok';
            } catch (_) { /* tenta o botão */ }
        }
        const botao = document.querySelector('.ytp-subtitles-button');
        if (botao && botao.getAttribute('aria-pressed') === 'false' && !(lista.length && !en)) { botao.click(); return 'botao'; }
        return lista.length ? 'sem-ingles' : 'sem-legendas';
    }

    // ── O pedido capturado ──────────────────────────────────────────────────
    async function processar(url, textoOriginal) {
        let u;
        try { u = new URL(url, location.origin); } catch (_) { return; }
        const videoId = u.searchParams.get('v') || '';
        const lang = (u.searchParams.get('lang') || '').toLowerCase();
        if (!videoId || videoId !== videoDaPagina()) return;     // anúncio, prévia, outro vídeo

        // O aluno escolheu outra língua no CC: se o vídeo tem inglês, troca —
        // o player busca de novo e a próxima captura já vem em inglês.
        if (idiomaBase(lang) !== 'en' && trocouEm !== videoId) {
            trocouEm = videoId;
            const en = faixaEmIngles(faixasDoVideo());
            if (en && ligarIngles() === 'ok') return;
        }

        const chave = videoId + '|' + lang + '|' + (u.searchParams.get('kind') || '');
        if (chave === ultimaChave) return;
        ultimaChave = chave;
        const meu = ++pedidoAtual;

        const urlEn = urlDaFaixa(url, 'en');
        const urlPt = urlDaFaixa(url, 'pt');
        const mesmaEn = textoOriginal && u.searchParams.get('fmt') === 'json3' && !u.searchParams.get('tlang') && idiomaBase(lang) === 'en';
        const [en, pt] = await Promise.all([mesmaEn ? textoOriginal : baixar(urlEn), baixar(urlPt)]);
        if (meu !== pedidoAtual) return;                          // chegou outro vídeo no meio
        if (!en) { ultimaChave = ''; enviar({ tipo: 'erro', videoId, erro: 'baixar' }); return; }

        ultimoPacote = { tipo: 'faixas', videoId, lang, kind: u.searchParams.get('kind') || '', en, pt };
        enviar(ultimoPacote);
    }

    function lerResposta(xhr) {
        try {
            const tipo = xhr.responseType;
            if (!tipo || tipo === 'text') return xhr.responseText;
            if (tipo === 'json') return JSON.stringify(xhr.response);
            if (tipo === 'arraybuffer') return new TextDecoder().decode(xhr.response);
        } catch (_) { /* cai para o download próprio */ }
        return null;
    }

    // XHR (o caminho atual do player)…
    const abrir = XMLHttpRequest.prototype.open;
    const mandar = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function (metodo, url) {
        try { this.__capyUrl = String(url); } catch (_) { this.__capyUrl = ''; }
        return abrir.apply(this, arguments);
    };
    XMLHttpRequest.prototype.send = function () {
        if (this.__capyUrl && ehTimedtext(this.__capyUrl)) {
            const url = this.__capyUrl;
            this.addEventListener('load', () => {
                if (this.status === 200) processar(url, lerResposta(this)).catch(() => {});
            });
        }
        return mandar.apply(this, arguments);
    };

    // …e fetch (caso o player mude de caminho).
    window.fetch = function (entrada) {
        const promessa = fetchOriginal.apply(this, arguments);
        try {
            const url = entrada instanceof Request ? entrada.url : String(entrada);
            if (ehTimedtext(url)) {
                promessa.then(r => {
                    if (r && r.ok) r.clone().text().then(t => processar(url, t)).catch(() => {});
                }).catch(() => {});
            }
        } catch (_) { /* nunca atrapalha o pedido da página */ }
        return promessa;
    };

    // ── Pedidos do content script ───────────────────────────────────────────
    window.addEventListener('message', e => {
        if (e.source !== window || !e.data || e.data.capy !== MARCA) return;
        if (e.data.tipo === 'pedir-faixas') {
            if (ultimoPacote && ultimoPacote.videoId === videoDaPagina()) enviar(ultimoPacote);
        } else if (e.data.tipo === 'ligar-ingles') {
            if (ultimoPacote && ultimoPacote.videoId === videoDaPagina()) { enviar(ultimoPacote); return; }
            enviar({ tipo: 'cc', videoId: videoDaPagina(), estado: ligarIngles() });
        } else if (e.data.tipo === 'nova-pagina') {
            ultimaChave = '';
        }
    });
})();
