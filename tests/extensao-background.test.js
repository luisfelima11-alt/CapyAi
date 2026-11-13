// Extensão "Capy no YouTube": o service worker (extensao/background.js) é o
// único que conhece a chave. Roda aqui com um `chrome` e um `fetch` falsos.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const CODIGO = fs.readFileSync(path.join(__dirname, '..', 'extensao', 'background.js'), 'utf8');
const ID = 'abcdefghijklmnopabcdefghijklmnop';
const CHAVE = 'cx1.' + 'e'.repeat(40) + '.' + 's'.repeat(43);

function carregar(respostas) {
    const guardado = {};
    const pedidos = [];
    let ouvinte = null;
    const chrome = {
        runtime: { id: ID, onMessage: { addListener(f) { ouvinte = f; } } },
        storage: { local: {
            async get(chaves) { const r = {}; for (const k of [].concat(chaves)) if (k in guardado) r[k] = guardado[k]; return r; },
            async set(obj) { Object.assign(guardado, obj); },
            async remove(chaves) { for (const k of [].concat(chaves)) delete guardado[k]; },
        } },
    };
    async function fetch(url, opcoes) {
        pedidos.push({ url, opcoes });
        const caminho = new URL(url).pathname;
        const r = typeof respostas === 'function' ? respostas(caminho, opcoes) : (respostas[caminho] || { status: 404, json: {} });
        if (r.erroDeRede) throw new TypeError('Failed to fetch');
        return { status: r.status, ok: r.status >= 200 && r.status < 300, json: async () => r.json };
    }
    vm.runInNewContext(CODIGO, { chrome, fetch, URL, Map, Object, String, Number, Array, JSON, Promise, TypeError });
    const enviar = (msg, sender) => new Promise(resolve => {
        // JSON de ida e volta: o objeto nasce em outro "realm" (vm) e o
        // deepStrictEqual compararia os protótipos.
        const assincrono = ouvinte(msg, Object.assign({ id: ID }, sender), r => resolve(JSON.parse(JSON.stringify(r))));
        assert.equal(assincrono, true, 'o listener responde de forma assíncrona');
    });
    return { enviar, guardado, pedidos };
}

const SITE = { origin: 'https://www.capyenglish.com.br', url: 'https://www.capyenglish.com.br/extensao.html' };
const YOUTUBE = { origin: 'https://www.youtube.com', url: 'https://www.youtube.com/watch?v=abc' };
const POPUP = { origin: 'chrome-extension://' + ID, url: 'chrome-extension://' + ID + '/popup.html' };

const API_OK = {
    '/api/extensao/eu': { status: 200, json: { nome: 'Ana', plano: 'free' } },
    '/api/extensao/traduzir': { status: 200, json: { traducao: 'ansiosa por', explicacao: 'Esperar algo bom.' } },
    '/api/extensao/salvar': { status: 200, json: { ok: true, salvas: 3 } },
    '/api/extensao/palavras': { status: 200, json: { palavras: [{ en: 'trip', pt: 'viagem' }] } },
};

test('conectar: só aceita a chave vinda do nosso site e confere com /eu', async () => {
    const { enviar, guardado, pedidos } = carregar(API_OK);

    assert.deepEqual(await enviar({ tipo: 'conectar', token: CHAVE }, YOUTUBE), { ok: false, erro: 'origem' });
    assert.deepEqual(await enviar({ tipo: 'conectar', token: CHAVE }, { origin: 'https://capyenglish.com.br.evil.test' }), { ok: false, erro: 'origem' });
    assert.deepEqual(await enviar({ tipo: 'conectar', token: 'nao-e-chave' }, SITE), { ok: false, erro: 'chave' });
    assert.equal(guardado.capyToken, undefined);
    assert.equal(pedidos.length, 0);

    // Mensagem de outra extensão: ignorada.
    assert.deepEqual(await enviar({ tipo: 'estado' }, { id: 'outra', origin: SITE.origin }), { ok: false, erro: 'interno' });

    const r = await enviar({ tipo: 'conectar', token: CHAVE }, SITE);
    assert.deepEqual(r, { ok: true, conectado: true, nome: 'Ana' });
    assert.equal(guardado.capyToken, CHAVE);
    assert.equal(pedidos[0].url, 'https://www.capyenglish.com.br/api/extensao/eu');
    assert.equal(pedidos[0].opcoes.headers.Authorization, 'Bearer ' + CHAVE);
    assert.equal(pedidos[0].opcoes.credentials, 'omit', 'nunca manda cookie');

    assert.deepEqual(await enviar({ tipo: 'estado' }, YOUTUBE), { ok: true, conectado: true, nome: 'Ana' });
});

test('conectar com chave recusada pelo servidor não deixa a chave guardada', async () => {
    const { enviar, guardado } = carregar({ '/api/extensao/eu': { status: 401, json: { error: 'extensao_desconectada' } } });
    assert.deepEqual(await enviar({ tipo: 'conectar', token: CHAVE }, SITE), { ok: false, erro: 'sem-conta' });
    assert.equal(guardado.capyToken, undefined);
});

test('traduzir e salvar: só do YouTube ou do popup; sem conta não sai pedido', async () => {
    const { enviar, guardado, pedidos } = carregar(API_OK);
    assert.deepEqual(await enviar({ tipo: 'traduzir', palavra: 'trip', frase: 'a trip' }, YOUTUBE), { ok: false, erro: 'sem-conta' });
    assert.equal(pedidos.length, 0);

    guardado.capyToken = CHAVE;
    assert.deepEqual(await enviar({ tipo: 'traduzir', palavra: 'trip' }, SITE), { ok: false, erro: 'origem' });

    const t = await enviar({ tipo: 'traduzir', palavra: '  looking   forward ', frase: "I've been looking forward to this trip" }, YOUTUBE);
    assert.deepEqual(t, { ok: true, traducao: 'ansiosa por', explicacao: 'Esperar algo bom.' });
    assert.deepEqual(JSON.parse(pedidos[0].opcoes.body), { palavra: 'looking forward', frase: "I've been looking forward to this trip" });

    // A mesma palavra na mesma frase vem do cache: não gasta a cota de IA.
    await enviar({ tipo: 'traduzir', palavra: 'looking forward', frase: "I've been looking forward to this trip" }, YOUTUBE);
    assert.equal(pedidos.filter(p => p.url.endsWith('/traduzir')).length, 1);

    assert.deepEqual(await enviar({ tipo: 'salvar', palavra: 'trip', traducao: 'viagem' }, YOUTUBE), { ok: true, salvas: 3 });
    assert.deepEqual(await enviar({ tipo: 'palavras' }, YOUTUBE), { ok: false, erro: 'origem' }, 'a lista só vai ao popup');
    assert.deepEqual(await enviar({ tipo: 'palavras' }, POPUP), { ok: true, palavras: [{ en: 'trip', pt: 'viagem' }] });
});

test('401 da API esquece a chave; 429 vira "limite"; queda de rede vira "rede"', async () => {
    let modo = 'limite';
    const { enviar, guardado } = carregar(caminho => {
        if (modo === 'rede') return { erroDeRede: true };
        if (modo === 'limite') return { status: 429, json: { error: 'rate_limited' } };
        return { status: 401, json: { error: 'extensao_desconectada' } };
    });
    guardado.capyToken = CHAVE;
    guardado.capyNome = 'Ana';
    assert.deepEqual(await enviar({ tipo: 'traduzir', palavra: 'a', frase: 'x' }, YOUTUBE), { ok: false, erro: 'limite' });
    modo = 'rede';
    assert.deepEqual(await enviar({ tipo: 'salvar', palavra: 'a' }, YOUTUBE), { ok: false, erro: 'rede' });
    assert.equal(guardado.capyToken, CHAVE);
    modo = 'revogada';
    assert.deepEqual(await enviar({ tipo: 'salvar', palavra: 'a' }, YOUTUBE), { ok: false, erro: 'sem-conta' });
    assert.equal(guardado.capyToken, undefined);
    assert.equal(guardado.capyNome, undefined);
});

test('desconectar: do site ou do popup, nunca de uma página do YouTube', async () => {
    const { enviar, guardado } = carregar(API_OK);
    guardado.capyToken = CHAVE;
    assert.deepEqual(await enviar({ tipo: 'desconectar' }, YOUTUBE), { ok: false, erro: 'origem' });
    assert.equal(guardado.capyToken, CHAVE);
    assert.deepEqual(await enviar({ tipo: 'desconectar' }, POPUP), { ok: true, conectado: false });
    assert.equal(guardado.capyToken, undefined);
});

test('manifest: MV3, permissões mínimas e textos dentro dos limites da loja', () => {
    const m = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'extensao', 'manifest.json'), 'utf8'));
    assert.equal(m.manifest_version, 3);
    assert.deepEqual(m.permissions, ['storage']);
    assert.deepEqual(m.host_permissions, ['https://www.capyenglish.com.br/*']);
    assert.ok(m.name.length <= 75 && m.description.length <= 132);
    const mundos = m.content_scripts.map(c => [c.matches.join(','), c.world || 'ISOLATED', c.js.join(',')]);
    assert.deepEqual(mundos, [
        ['https://www.youtube.com/*', 'MAIN', 'yt-captura.js'],
        ['https://www.youtube.com/*', 'ISOLATED', 'legendas.js,yt-overlay.js'],
        ['https://www.capyenglish.com.br/extensao.html*,https://capyenglish.com.br/extensao.html*', 'ISOLATED', 'conector.js'],
    ]);
    for (const arquivo of [...m.content_scripts.flatMap(c => [...c.js, ...(c.css || [])]), m.background.service_worker, m.action.default_popup, ...Object.values(m.icons)]) {
        assert.ok(fs.existsSync(path.join(__dirname, '..', 'extensao', arquivo)), arquivo + ' existe');
    }
});

test('a página do mundo MAIN não fala com a Capy nem usa chrome.*', () => {
    const semComentarios = t => t.replace(/^\s*\/\/.*$/gm, '');
    const captura = semComentarios(fs.readFileSync(path.join(__dirname, '..', 'extensao', 'yt-captura.js'), 'utf8'));
    assert.doesNotMatch(captura, /chrome\.|capyenglish|Bearer/);
    const overlay = semComentarios(fs.readFileSync(path.join(__dirname, '..', 'extensao', 'yt-overlay.js'), 'utf8'));
    assert.doesNotMatch(overlay, /innerHTML|insertAdjacentHTML|outerHTML/, 'o YouTube exige Trusted Types');
    assert.doesNotMatch(overlay, /capyToken/, 'o content script nunca lê a chave');
});
