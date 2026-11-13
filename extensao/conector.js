// ══════════════════════════════════════════════════════════════════════════════
// Capy no YouTube — ponte com o site (só em capyenglish.com.br/extensao.html)
// ══════════════════════════════════════════════════════════════════════════════
// A página não sabe o id da extensão (muda entre a loja e o modo
// desenvolvedor), então a conversa é por window.postMessage na mesma origem:
//   página → { capyExt: 1, id, tipo: 'ping' | 'conectar' (com token) | 'desconectar' }
//   ponte  → { capyExt: 1, id, tipo: '<tipo>:resposta', ok, conectado, nome, erro }
// A resposta nunca leva a chave de volta para a página.
// ══════════════════════════════════════════════════════════════════════════════
(function () {
    'use strict';
    try { document.documentElement.setAttribute('data-capy-extensao', chrome.runtime.getManifest().version); } catch (_) { /* segue */ }

    window.addEventListener('message', async e => {
        if (e.source !== window || e.origin !== location.origin) return;
        const d = e.data;
        if (!d || d.capyExt !== 1 || typeof d.tipo !== 'string' || d.tipo.endsWith(':resposta')) return;

        let pedido;
        if (d.tipo === 'ping') pedido = { tipo: 'estado' };
        else if (d.tipo === 'conectar' && typeof d.token === 'string') pedido = { tipo: 'conectar', token: d.token };
        else if (d.tipo === 'desconectar') pedido = { tipo: 'desconectar' };
        else return;

        let r;
        try { r = await chrome.runtime.sendMessage(pedido); } catch (_) { r = { ok: false, erro: 'recarregar' }; }
        r = r || { ok: false, erro: 'interno' };
        window.postMessage({
            capyExt: 1,
            id: String(d.id || '').slice(0, 40),
            tipo: d.tipo + ':resposta',
            ok: !!r.ok,
            conectado: !!r.conectado,
            nome: String(r.nome || '').slice(0, 40),
            erro: r.erro ? String(r.erro).slice(0, 30) : '',
            versao: (function () { try { return chrome.runtime.getManifest().version; } catch (_) { return ''; } })(),
        }, location.origin);
    });
})();
