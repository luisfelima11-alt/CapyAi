// ══════════════════════════════════════════════════════════════════════════════
// Capy no YouTube — service worker (o único lugar que conhece a chave)
// ══════════════════════════════════════════════════════════════════════════════
// A chave (cx1…) chega do site por conector.js, só de uma página nossa
// (https://www.capyenglish.com.br/extensao.html). Fica em chrome.storage.local
// e só este arquivo a lê: o content script do YouTube pede "traduzir"/"salvar"
// por mensagem e recebe só o resultado, nunca a chave.
// ══════════════════════════════════════════════════════════════════════════════
'use strict';

const API = 'https://www.capyenglish.com.br';
const ORIGENS_DO_SITE = ['https://www.capyenglish.com.br', 'https://capyenglish.com.br'];
const FORMATO_DA_CHAVE = /^cx1\.[A-Za-z0-9_-]{10,2000}\.[A-Za-z0-9_-]{20,200}$/;

// Mesma palavra na mesma frase não gasta IA duas vezes (o service worker
// reinicia de vez em quando; o cache ir junto é aceitável).
const cacheDeTraducao = new Map();
const TETO_DO_CACHE = 300;

async function lerConta() {
    const d = await chrome.storage.local.get(['capyToken', 'capyNome']);
    return { token: d.capyToken || null, nome: d.capyNome || '' };
}

async function esquecerConta() {
    await chrome.storage.local.remove(['capyToken', 'capyNome']);
}

async function chamar(caminho, opcoes) {
    const { method = 'GET', body } = opcoes || {};
    const { token } = await lerConta();
    if (!token) return { ok: false, erro: 'sem-conta' };
    let r;
    try {
        r = await fetch(API + caminho, {
            method,
            headers: Object.assign({ Authorization: 'Bearer ' + token }, body ? { 'Content-Type': 'application/json' } : {}),
            body: body ? JSON.stringify(body) : undefined,
            credentials: 'omit',
            cache: 'no-store',
        });
    } catch (_) {
        return { ok: false, erro: 'rede' };
    }
    if (r.status === 401) { await esquecerConta(); return { ok: false, erro: 'sem-conta' }; }
    if (r.status === 429) return { ok: false, erro: 'limite' };
    if (!r.ok) return { ok: false, erro: 'servidor' };
    let dados = {};
    try { dados = await r.json(); } catch (_) { dados = {}; }
    return { ok: true, dados };
}

function origemDe(sender) {
    if (sender.origin) return sender.origin;
    try { return new URL(sender.url).origin; } catch (_) { return ''; }
}

function texto(v, max) {
    return String(v == null ? '' : v).replace(/\s+/g, ' ').trim().slice(0, max);
}

async function tratar(msg, sender) {
    if (!msg || typeof msg !== 'object' || !sender || sender.id !== chrome.runtime.id) return { ok: false, erro: 'interno' };
    const origem = origemDe(sender);
    const doSite = ORIGENS_DO_SITE.includes(origem);
    const daExtensao = origem === 'chrome-extension://' + chrome.runtime.id;
    const doYoutube = origem === 'https://www.youtube.com';

    switch (msg.tipo) {
        // Do site, depois que o aluno logado clicou em "Conectar".
        case 'conectar': {
            if (!doSite) return { ok: false, erro: 'origem' };
            const token = String(msg.token || '');
            if (!FORMATO_DA_CHAVE.test(token)) return { ok: false, erro: 'chave' };
            await chrome.storage.local.set({ capyToken: token });
            const eu = await chamar('/api/extensao/eu');
            if (!eu.ok) { await esquecerConta(); return { ok: false, erro: eu.erro }; }
            const nome = texto(eu.dados.nome, 40);
            await chrome.storage.local.set({ capyNome: nome });
            return { ok: true, conectado: true, nome };
        }

        // Do site ("Desconectar") ou do popup ("Sair neste navegador").
        case 'desconectar': {
            if (!doSite && !daExtensao) return { ok: false, erro: 'origem' };
            await esquecerConta();
            return { ok: true, conectado: false };
        }

        case 'estado': {
            const { token, nome } = await lerConta();
            return { ok: true, conectado: !!token, nome: token ? nome : '' };
        }

        case 'traduzir': {
            if (!doYoutube && !daExtensao) return { ok: false, erro: 'origem' };
            const palavra = texto(msg.palavra, 40);
            const frase = texto(msg.frase, 300);
            if (!palavra) return { ok: false, erro: 'interno' };
            const chave = palavra.toLowerCase() + '|' + frase.toLowerCase();
            if (cacheDeTraducao.has(chave)) return Object.assign({ ok: true }, cacheDeTraducao.get(chave));
            const r = await chamar('/api/extensao/traduzir', { method: 'POST', body: { palavra, frase } });
            if (!r.ok) return r;
            const res = { traducao: texto(r.dados.traducao, 80), explicacao: texto(r.dados.explicacao, 200) };
            if (cacheDeTraducao.size >= TETO_DO_CACHE) cacheDeTraducao.delete(cacheDeTraducao.keys().next().value);
            cacheDeTraducao.set(chave, res);
            return Object.assign({ ok: true }, res);
        }

        case 'salvar': {
            if (!doYoutube && !daExtensao) return { ok: false, erro: 'origem' };
            const palavra = texto(msg.palavra, 60);
            if (!palavra) return { ok: false, erro: 'interno' };
            const r = await chamar('/api/extensao/salvar', { method: 'POST', body: { palavra, traducao: texto(msg.traducao, 80) } });
            return r.ok ? { ok: true, salvas: Number(r.dados.salvas) || 0 } : r;
        }

        case 'palavras': {
            if (!daExtensao) return { ok: false, erro: 'origem' };
            const r = await chamar('/api/extensao/palavras');
            return r.ok ? { ok: true, palavras: Array.isArray(r.dados.palavras) ? r.dados.palavras.slice(0, 40) : [] } : r;
        }

        default:
            return { ok: false, erro: 'interno' };
    }
}

chrome.runtime.onMessage.addListener((msg, sender, responder) => {
    tratar(msg, sender).then(responder, () => responder({ ok: false, erro: 'interno' }));
    return true;   // resposta assíncrona
});
