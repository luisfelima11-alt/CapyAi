// Capy no YouTube — popup do ícone da extensão.
'use strict';

const SITE = 'https://www.capyenglish.com.br';
const AJUSTES_PADRAO = { ligado: true, mostrarPt: true, pausarNoFim: false };
const $ = id => document.getElementById(id);

async function lerAjustes() {
    const d = await chrome.storage.local.get('capyAjustes');
    return { ...AJUSTES_PADRAO, ...(d.capyAjustes || {}) };
}

async function mudarAjuste(chave, valor) {
    const atual = await lerAjustes();
    await chrome.storage.local.set({ capyAjustes: { ...atual, [chave]: valor } });
}

function abrir(caminho) {
    chrome.tabs.create({ url: SITE + caminho });
    window.close();
}

async function mostrarPalavras() {
    const r = await chrome.runtime.sendMessage({ tipo: 'palavras' });
    const lista = $('lista');
    lista.replaceChildren();
    const palavras = r && r.ok ? r.palavras : [];
    $('contagem').textContent = String(palavras.length);
    $('vazio').hidden = palavras.length > 0;
    for (const p of palavras.slice(0, 12)) {
        const li = document.createElement('li');
        const en = document.createElement('b');
        en.textContent = p.en;
        const pt = document.createElement('span');
        pt.textContent = p.pt || '';
        li.append(en, pt);
        lista.append(li);
    }
}

async function iniciar() {
    const ajustes = await lerAjustes();
    $('aj-ligado').checked = ajustes.ligado;
    $('aj-pt').checked = ajustes.mostrarPt;
    $('aj-pausar').checked = ajustes.pausarNoFim;
    $('aj-ligado').addEventListener('change', e => mudarAjuste('ligado', e.target.checked));
    $('aj-pt').addEventListener('change', e => mudarAjuste('mostrarPt', e.target.checked));
    $('aj-pausar').addEventListener('change', e => mudarAjuste('pausarNoFim', e.target.checked));

    $('conectar').addEventListener('click', () => abrir('/extensao.html'));
    $('revisar').addEventListener('click', () => abrir('/lessons.html?review=1'));
    $('sair').addEventListener('click', async () => {
        await chrome.runtime.sendMessage({ tipo: 'desconectar' });
        location.reload();
    });

    const estado = await chrome.runtime.sendMessage({ tipo: 'estado' });
    const conectado = !!(estado && estado.conectado);
    $('quem').textContent = conectado ? 'Conectado como ' + (estado.nome || 'você') : 'Conta Capy não conectada';
    $('sem-conta').hidden = conectado;
    $('com-conta').hidden = !conectado;
    if (conectado) mostrarPalavras();
}

iniciar();
