// Extensão "Capy no YouTube" de ponta a ponta: a extensão DE VERDADE carregada
// no Chromium, numa página falsa do YouTube (mesma URL, mesmo jeito de pedir a
// legenda: XHR para /api/timedtext com o token `pot`) e no nosso extensao.html.
// Nenhum pedido sai para a internet: tudo o que não é rota daqui é abortado.
const { test, expect, chromium } = require('playwright/test');
const fs = require('fs');
const os = require('os');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const EXT = path.join(RAIZ, 'extensao');
const VIDEO = 'capyTeste01';
const POT = 'pot-do-player-123';
const CHAVE = 'cx1.' + 'e'.repeat(40) + '.' + 's'.repeat(43);
const ALUNA = { id: 'aluna-teste', name: 'Ana Souza', email: 'ana@example.test', role: 'student' };

const json3 = linhas => JSON.stringify({ events: linhas.map(([ms, dur, utf8]) => ({ tStartMs: ms, dDurationMs: dur, segs: [{ utf8 }] })) });
const EN = json3([[500, 1500, "I've been looking forward"], [2000, 1500, 'to this trip'], [4000, 2000, 'See you soon, Ana!']]);
const PT = json3([[500, 1500, 'Eu estava ansiosa'], [2000, 1500, 'por esta viagem'], [4000, 2000, 'Até logo, Ana!']]);

// Uma página com o mínimo do player do YouTube: #movie_player com a API de
// legendas, o <video>, a legenda nativa e o botão CC. O "vídeo" é um WAV mudo
// de 12 s (o Chromium do Playwright não toca H.264).
const PAGINA_DO_YOUTUBE = `<!doctype html><html><head><meta charset="utf-8"><title>Vídeo - YouTube</title></head><body style="margin:0;background:#0f0f0f">
<div id="movie_player" class="html5-video-player" style="position:relative;width:854px;height:480px;background:#000;overflow:hidden">
  <div class="html5-video-container"><video class="html5-main-video" muted playsinline style="width:854px;height:480px"></video></div>
  <div class="ytp-caption-window-container"><span class="ytp-caption-segment">legenda nativa do YouTube</span></div>
  <button class="ytp-subtitles-button" aria-pressed="false">CC</button>
</div>
<input id="busca" placeholder="Pesquisar">
<script>
(function () {
  var sr = 8000, n = sr * 12, buf = new ArrayBuffer(44 + n), v = new DataView(buf);
  function w(o, t) { for (var i = 0; i < t.length; i++) v.setUint8(o + i, t.charCodeAt(i)); }
  w(0, 'RIFF'); v.setUint32(4, 36 + n, true); w(8, 'WAVE'); w(12, 'fmt '); v.setUint32(16, 16, true);
  v.setUint16(20, 1, true); v.setUint16(22, 1, true); v.setUint32(24, sr, true); v.setUint32(28, sr, true);
  v.setUint16(32, 1, true); v.setUint16(34, 8, true); w(36, 'data'); v.setUint32(40, n, true);
  for (var i = 0; i < n; i++) v.setUint8(44 + i, 128);
  document.querySelector('video').src = URL.createObjectURL(new Blob([buf], { type: 'audio/wav' }));
  var p = document.getElementById('movie_player');
  p.loadModule = function () {};
  p.getOption = function (m, o) { return m === 'captions' && o === 'tracklist' ? [{ languageCode: 'en' }, { languageCode: 'pt' }] : null; };
  p.getPlayerResponse = function () { return { captions: { playerCaptionsTracklistRenderer: { captionTracks: [{ languageCode: 'en' }, { languageCode: 'pt' }] } } }; };
  p.setOption = function (m, o, faixa) {
    if (m !== 'captions' || o !== 'track') return;
    var x = new XMLHttpRequest();
    x.open('GET', '/api/timedtext?v=${VIDEO}&ei=abc&caps=asr&lang=' + faixa.languageCode + '&fmt=json3&xorb=2&pot=${POT}&c=WEB');
    x.send();
  };
})();
</script></body></html>`;

const TIPOS = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.json': 'application/json', '.ico': 'image/x-icon' };

async function abrirComExtensao() {
    const perfil = fs.mkdtempSync(path.join(os.tmpdir(), 'capy-ext-'));
    const ctx = await chromium.launchPersistentContext(perfil, {
        channel: 'chromium',
        headless: true,
        args: [`--disable-extensions-except=${EXT}`, `--load-extension=${EXT}`, '--autoplay-policy=no-user-gesture-required'],
    });
    const registro = { timedtext: [], api: [] };

    await ctx.route('**/*', async route => {
        const req = route.request();
        const u = new URL(req.url());
        if (u.hostname === 'www.youtube.com') {
            if (u.pathname === '/watch') return route.fulfill({ status: 200, contentType: 'text/html', body: PAGINA_DO_YOUTUBE });
            if (u.pathname === '/api/timedtext') {
                registro.timedtext.push(u.search);
                // Como o YouTube de verdade: sem o token do player, nada.
                if (u.searchParams.get('pot') !== POT) return route.fulfill({ status: 403, body: '' });
                const emPt = u.searchParams.get('tlang') === 'pt' || u.searchParams.get('lang') === 'pt';
                return route.fulfill({ status: 200, contentType: 'application/json', body: emPt ? PT : EN });
            }
            return route.abort();
        }
        if (u.hostname === 'www.capyenglish.com.br') {
            if (u.pathname.startsWith('/api/')) {
                const corpo = req.postData() ? JSON.parse(req.postData()) : null;
                registro.api.push({ caminho: u.pathname, metodo: req.method(), corpo, auth: req.headers()['authorization'] || '', csrf: req.headers()['x-csrf-token'] || '' });
                const ok = json => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(json) });
                const autorizado = (req.headers()['authorization'] || '') === 'Bearer ' + CHAVE && !registro.desconectada;
                switch (u.pathname) {
                    case '/api/auth/session': return ok({ ok: true, user: ALUNA, csrfToken: 'csrf-teste' });
                    case '/api/extensao/conectar': registro.desconectada = false; return ok({ token: CHAVE, exp: 9999999999, nome: 'Ana' });
                    case '/api/extensao/desconectar': registro.desconectada = true; return ok({ ok: true });
                    case '/api/extensao/eu': return autorizado ? ok({ nome: 'Ana', plano: 'free' }) : route.fulfill({ status: 401, contentType: 'application/json', body: '{"error":"extensao_desconectada"}' });
                    case '/api/extensao/traduzir': return autorizado ? ok({ traducao: 'viagem', explicacao: 'Uma ida para outro lugar.' }) : route.fulfill({ status: 401, body: '{}' });
                    case '/api/extensao/salvar': return autorizado ? ok({ ok: true, salvas: 1 }) : route.fulfill({ status: 401, body: '{}' });
                    default: return ok({});
                }
            }
            const arquivo = path.normalize(path.join(RAIZ, decodeURIComponent(u.pathname)));
            if (arquivo.startsWith(RAIZ + path.sep) && fs.existsSync(arquivo) && fs.statSync(arquivo).isFile()) {
                return route.fulfill({ status: 200, contentType: TIPOS[path.extname(arquivo)] || 'application/octet-stream', body: fs.readFileSync(arquivo) });
            }
            return route.fulfill({ status: 404, body: '' });
        }
        if (u.hostname === 'cdn.tailwindcss.com') return route.fulfill({ status: 200, contentType: 'text/javascript', body: 'window.tailwind = {};' });
        return route.abort();
    });

    return { ctx, registro };
}

async function abrirVideo(ctx) {
    const page = await ctx.newPage();
    await page.goto(`https://www.youtube.com/watch?v=${VIDEO}`);
    // A Capy liga a faixa em inglês sozinha e esconde a legenda nativa.
    await expect(page.locator('#movie_player.capy-ligado')).toHaveCount(1, { timeout: 10000 });
    return page;
}

const irPara = (page, t) => page.evaluate(t => { const v = document.querySelector('video'); v.pause(); v.currentTime = t; }, t);
const pausar = page => page.evaluate(() => document.querySelector('video').pause());

test('legenda dupla, frase a frase e pausa no fim, sem conta conectada', async () => {
    const { ctx, registro } = await abrirComExtensao();
    try {
        const page = await abrirVideo(ctx);
        const en = page.locator('#capy-legendas-host .en');
        const pt = page.locator('#capy-legendas-host .pt');

        // O token do player foi reaproveitado no pedido da tradução em português.
        const pedidoPt = registro.timedtext.find(s => s.includes('tlang=pt'));
        expect(pedidoPt, registro.timedtext.join('\n')).toBeTruthy();
        expect(pedidoPt).toContain('pot=' + POT);
        await expect(page.locator('.ytp-caption-window-container')).toBeHidden();

        await irPara(page, 0.6);
        await expect(en).toHaveText("I've been looking forward");
        await expect(pt).toHaveText('Eu estava ansiosa');

        // D → próxima, A → anterior, S → repete.
        await page.keyboard.press('d');
        await expect(en).toHaveText('to this trip');
        await expect(pt).toHaveText('por esta viagem');
        await pausar(page);
        await page.keyboard.press('a');
        await expect(en).toHaveText("I've been looking forward");
        await pausar(page);

        // Digitando na busca do YouTube, as letras são do aluno, não da Capy.
        await page.click('#busca');
        await page.keyboard.type('dad');
        await expect(page.locator('#busca')).toHaveValue('dad');
        await expect(en).toHaveText("I've been looking forward");
        await page.locator('#busca').blur();

        // PT some e volta pelo botão da barra.
        await page.locator('#capy-legendas-host button[title="Mostrar a tradução em português"]').click();
        await expect(pt).toBeHidden();
        await page.locator('#capy-legendas-host button[title="Mostrar a tradução em português"]').click();
        await expect(pt).toBeVisible();

        // Q → pausar no fim de cada frase: repete a 2ª frase (2,0 s–3,5 s) e o
        // vídeo para sozinho no fim dela, com a frase ainda na tela.
        await page.keyboard.press('q');
        await expect(page.locator('#capy-legendas-host .toast')).toContainText('ligado');
        await irPara(page, 2.2);
        await page.keyboard.press('s');
        await expect.poll(() => page.evaluate(() => document.querySelector('video').paused), { timeout: 5000 }).toBe(true);
        const parou = await page.evaluate(() => document.querySelector('video').currentTime);
        expect(parou).toBeGreaterThan(3.2);
        expect(parou).toBeLessThan(3.9);
        await expect(en).toHaveText('to this trip');

        // Clique na palavra com o vídeo tocando (3ª frase, 4 s–6 s), sem conta:
        // o vídeo pausa e a Capy pede para conectar.
        await page.keyboard.press('q');
        await irPara(page, 4.05);
        await page.evaluate(() => { document.querySelector('video').play(); });
        await expect.poll(() => page.evaluate(() => document.querySelector('video').paused)).toBe(false);
        await page.locator('#capy-legendas-host .p', { hasText: 'soon' }).click({ timeout: 1500 });
        await expect(page.locator('#capy-legendas-host .bolha')).toContainText('Conecte sua conta Capy');
        await expect(page.locator('#capy-legendas-host .bolha a')).toHaveAttribute('href', 'https://www.capyenglish.com.br/extensao.html');
        expect(await page.evaluate(() => document.querySelector('video').paused)).toBe(true);
        expect(registro.api, 'sem conta, nada vai para a Capy').toEqual([]);
    } finally {
        await ctx.close();
    }
});

test('conectar no site, traduzir e salvar a palavra; desconectar corta tudo', async () => {
    const { ctx, registro } = await abrirComExtensao();
    try {
        const site = await ctx.newPage();
        await site.goto('https://www.capyenglish.com.br/extensao.html');
        await expect(site.locator('#estado')).toHaveAttribute('data-estado', 'conectar');
        await site.getByRole('button', { name: 'Conectar extensão' }).click();
        await expect(site.locator('#estado')).toHaveAttribute('data-estado', 'conectado');
        await expect(site.locator('#estado')).toContainText('Conectada como Ana');

        const conectar = registro.api.find(p => p.caminho === '/api/extensao/conectar');
        expect(conectar.csrf, 'o conectar leva o CSRF do site').toBe('csrf-teste');
        const eu = registro.api.find(p => p.caminho === '/api/extensao/eu');
        expect(eu.auth).toBe('Bearer ' + CHAVE);
        // A chave não fica na página.
        expect(await site.content()).not.toContain(CHAVE);
        expect(await site.evaluate(() => JSON.stringify(localStorage) + JSON.stringify(sessionStorage))).not.toContain(CHAVE);

        const page = await abrirVideo(ctx);
        await irPara(page, 2.3);
        await page.locator('#capy-legendas-host .p', { hasText: 'trip' }).click();
        const bolha = page.locator('#capy-legendas-host .bolha');
        await expect(bolha.locator('.trad')).toHaveText('viagem');
        await expect(bolha.locator('.expl')).toHaveText('Uma ida para outro lugar.');
        expect(registro.api.find(p => p.caminho === '/api/extensao/traduzir').corpo).toEqual({ palavra: 'trip', frase: 'to this trip' });

        await bolha.getByRole('button', { name: '⭐ Salvar na revisão' }).click();
        await expect(bolha.locator('.salvar')).toHaveText('✓ Salva na sua revisão');
        expect(registro.api.find(p => p.caminho === '/api/extensao/salvar').corpo).toEqual({ palavra: 'trip', traducao: 'viagem' });
        await expect(page.locator('#capy-legendas-host .p.salva', { hasText: 'trip' })).toHaveCount(1);

        // Esc fecha a bolha.
        await page.keyboard.press('Escape');
        await expect(bolha).toBeHidden();

        // Desconectar no site revoga a chave: o clique seguinte pede conexão.
        await site.bringToFront();
        await site.getByRole('button', { name: 'Desconectar' }).click();
        await expect(site.locator('#estado')).toHaveAttribute('data-estado', 'conectar');
        await page.bringToFront();
        await page.locator('#capy-legendas-host .p', { hasText: 'this' }).click();
        await expect(bolha).toContainText('Conecte sua conta Capy');
    } finally {
        await ctx.close();
    }
});

// ── extensao.html sem a extensão (navegador comum, servidor de dev) ─────────
test('extensao.html: sem login pede para entrar; logado sem extensão pede para instalar', async ({ page }) => {
    let logado = false;
    await page.route('**/api/**', route => {
        const caminho = new URL(route.request().url()).pathname;
        if (caminho === '/api/auth/session') {
            return logado
                ? route.fulfill({ status: 200, json: { ok: true, user: ALUNA, csrfToken: 'csrf-teste' } })
                : route.fulfill({ status: 401, json: { error: 'unauthorized' } });
        }
        return route.fulfill({ status: 200, json: {} });
    });
    await page.goto('/extensao.html');
    await expect(page.locator('#estado')).toHaveAttribute('data-estado', 'entrar');
    await expect(page.getByRole('link', { name: 'Entrar na minha conta' })).toHaveAttribute('href', '4_Login_Capy_Yara_Welcomes_You.html?next=extensao.html');
    await expect(page.locator('#lojas')).toContainText('Chegando às lojas');

    logado = true;
    await page.reload();
    await expect(page.locator('#estado')).toHaveAttribute('data-estado', 'instalar');
    await expect(page.getByRole('button', { name: 'Já instalei, recarregar' })).toBeVisible();
});

// O botão "Revisar minhas palavras" do popup abre lessons.html?review=1 direto:
// a palavra salva no YouTube só existe no servidor e precisa entrar na fila.
test('revisão aberta direto: espera a memória do servidor e mostra a palavra do YouTube', async ({ page }) => {
    await page.addInitScript(aluna => localStorage.setItem('capySession', JSON.stringify(aluna)), ALUNA);
    await page.route('**/api/**', route => {
        const caminho = new URL(route.request().url()).pathname;
        if (caminho === '/api/auth/session') return route.fulfill({ status: 200, json: { ok: true, user: ALUNA, csrfToken: 'csrf-teste' } });
        if (caminho === '/api/memory') {
            return route.fulfill({ status: 200, json: { words: [{ en: 'looking forward', pt: 'ansiosa por', source: 'youtube', lessonId: 0, mastered: false, srs: { streak: 0, nextDue: 0 } }] } });
        }
        return route.fulfill({ status: 200, json: {} });
    });
    await page.goto('/lessons.html?review=1');
    await expect(page.locator('#review-container')).toContainText('looking forward');
    await expect(page.locator('#review-container')).toContainText('ansiosa por');
});
