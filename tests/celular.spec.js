// O site no celular (iPhone 13, 390 px, toque). Cada teste mede com
// getBoundingClientRect o que o aluno não consegue tocar.
const { test, expect, devices } = require('playwright/test');

// defaultBrowserType não pode ir no test.use (o Chromium da CI faz o papel).
const { defaultBrowserType, ...IPHONE } = devices['iPhone 13'];
test.use({ ...IPHONE, deviceScaleFactor: 1 });

const ALUNA = { id: 'aluna-teste', name: 'Ana Souza', email: 'ana@example.test', role: 'student' };

async function entrar(page, url) {
  await page.addInitScript(aluna => {
    localStorage.setItem('capySession', JSON.stringify(aluna));
    localStorage.setItem('capyConsent', 'no');
  }, ALUNA);
  await page.route('**/api/**', route => {
    const caminho = new URL(route.request().url()).pathname;
    if (caminho === '/api/auth/session') return route.fulfill({ status: 200, json: { ok: true, user: ALUNA, csrfToken: 'csrf-teste' } });
    if (caminho === '/api/profile') return route.fulfill({ status: 200, json: { onboarding_complete: true } });
    return route.fulfill({ status: 200, json: {} });
  });
  await page.goto(url);
}

// Quanto do elemento fica embaixo dos botões flutuantes (Yara e lousa), com a
// página rolada até o fim: é ali que o último botão para.
const cobertoPelosFlutuantes = (page, seletor) => page.evaluate(async seletor => {
  window.scrollTo(0, document.documentElement.scrollHeight);
  await new Promise(r => setTimeout(r, 300));
  const alvo = document.querySelector(seletor).getBoundingClientRect();
  let coberto = 0;
  for (const id of ['yw-fab', 'yw-board']) {
    const el = document.getElementById(id);
    if (!el || getComputedStyle(el).pointerEvents === 'none') continue;
    const r = el.getBoundingClientRect();
    const w = Math.max(0, Math.min(alvo.right, r.right) - Math.max(alvo.left, r.left));
    const h = Math.max(0, Math.min(alvo.bottom, r.bottom) - Math.max(alvo.top, r.top));
    coberto += w * h;
  }
  return coberto / (alvo.width * alvo.height);
}, seletor);

test('lessons.html: o "Verificar" do Build não fica embaixo da Yara', async ({ page }) => {
  await entrar(page, '/lessons.html?lesson=1');
  await page.waitForSelector('#yw-fab');
  await page.waitForFunction(() => typeof currentLesson !== 'undefined' && currentLesson && currentLesson.vocab);
  await page.evaluate(() => switchTool('build', true));
  const verificar = '#panel-build button[onclick^="buildCheck"]';
  await page.waitForSelector(verificar);
  expect(await cobertoPelosFlutuantes(page, verificar)).toBe(0);
});

test('lessons.html: a última opção do Quiz não fica embaixo da Yara', async ({ page }) => {
  await entrar(page, '/lessons.html?lesson=1');
  await page.waitForSelector('#yw-fab');
  await page.waitForFunction(() => typeof currentLesson !== 'undefined' && currentLesson && currentLesson.vocab);
  await page.evaluate(() => switchTool('quiz', true));
  await page.waitForSelector('#qopt-3');
  expect(await cobertoPelosFlutuantes(page, '#qopt-3')).toBe(0);
});

// "Minha conta" (plano e "Atualizar status da assinatura") só existia no menu
// do avatar, que abre ao passar o mouse. No celular o toque no avatar leva
// direto para os Ajustes: a página da conta não tinha caminho nenhum.
test('celular: o menu "Mais" leva à Minha conta', async ({ page }) => {
  await entrar(page, '/classes.html');
  await page.tap('nav.md\\:hidden >> text=Mais');
  const link = page.locator('#more-sheet a[href="account.html"]');
  await expect(link).toBeVisible();
  await page.waitForTimeout(400);   // a folha sobe com animação
  const tocavel = await link.evaluate(el => {
    const r = el.getBoundingClientRect();
    return r.bottom <= innerHeight && el.contains(document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2));
  });
  expect(tocavel).toBe(true);
  await link.tap();
  await expect(page).toHaveURL(/account\.html/);
});

// Aulas do molde (Agro, GPS 09+, Intermediate 19+, Entrevista, Medical): o
// Índice abre dentro da barra grudada no topo. Com 10 passos ele passava da
// tela e o fim ficava embaixo do menu de baixo, sem rolagem: o "Homework"
// não tinha como ser tocado.
for (const aula of ['agro_aula_12.html', 'gpstronic_aula_20.html']) {
  test(`${aula}: todo passo do Índice pode ser tocado`, async ({ page }) => {
    await entrar(page, '/' + aula);
    // O passo "Prepare" entra depois que a página monta: são 10 passos.
    await page.waitForFunction(() => document.querySelectorAll('#rota-indice-lista .rota-item').length >= 10);
    await page.evaluate(() => window.scrollTo(0, 800));   // a barra gruda no topo
    await page.tap('#rota-indice-btn');
    const itens = page.locator('#rota-indice-lista .rota-item');
    const n = await itens.count();
    expect(n).toBeGreaterThanOrEqual(10);
    for (let i = 0; i < n; i++) {
      const item = itens.nth(i);
      const tocavel = await item.evaluate(async el => {
        el.scrollIntoView({ block: 'center' });   // o que o dedo faria: rolar até ele
        await new Promise(r => setTimeout(r, 100));
        const r = el.getBoundingClientRect();
        const cy = r.top + r.height / 2;
        if (cy <= 0 || cy >= innerHeight) return false;
        return el.contains(document.elementFromPoint(r.left + 40, cy));
      });
      expect(tocavel, `passo ${i + 1} do Índice`).toBe(true);
    }
  });
}

// Aulas 43 e 44: o 🔊 do diálogo, das frases-chave e dos exemplos chamava a voz
// do navegador direto (speechSynthesis), que o iPhone cala com a chave de
// silencioso. As outras aulas passam pelo tts-en.js (voz da IA no elemento de
// áudio que o primeiro toque liberou, CapyAudio). O teste confere que o toque
// pede a voz da IA e não fala pelo navegador antes dela.
for (const [aula, aba, botao, abrir] of [
  ['aula_43.html', 'dialogue', 'button[onclick^="speakLine43"]'],
  ['aula_43.html', 'chunks', 'button[onclick^="speakChunk43"]'],
  ['aula_44.html', 'dialogue', 'button[onclick^="speakLine44"]'],
  ['aula_44.html', 'chunks', 'button[onclick^="speakChunk44"]', '.chunk-card > button'],
  ['aula_44.html', 'speak', 'button[onclick^="speakEx44"]', 'button[onclick^="toggleSpeak44"]'],
]) {
  test(`${aula} (${aba}): o 🔊 usa a voz que toca no iPhone`, async ({ page }) => {
    await page.addInitScript(() => {
      window.__falasDoNavegador = 0;
      const original = speechSynthesis.speak.bind(speechSynthesis);
      speechSynthesis.speak = u => { if (u.text.trim()) window.__falasDoNavegador++; return original(u); };
    });
    await entrar(page, '/' + aula);
    // A voz da IA responde com um clipe mudo de verdade (sem cair no plano B).
    const MUDO = Buffer.from('UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=', 'base64');
    await page.route('**/api/tts**', route => route.fulfill({ status: 200, contentType: 'audio/wav', body: MUDO }));
    await page.tap(`.tab-btn[data-tab="${aba}"]`);
    if (abrir) await page.locator(abrir).first().tap();   // o cartão abre antes
    const alvo = page.locator(botao).first();
    await alvo.scrollIntoViewIfNeeded();
    const pedido = page.waitForRequest(r => new URL(r.url()).pathname === '/api/tts', { timeout: 5000 });
    await alvo.tap();
    await pedido;
    expect(await page.evaluate(() => window.__falasDoNavegador)).toBe(0);
  });
}

// Pavilhão de Jogos: o botão "voltar ao topo" (fixo, 64 px, canto de baixo)
// ficava em cima do "Mais" do menu de baixo: o toque no "Mais" subia a página
// em vez de abrir o menu.
test('Pavilhão de Jogos: o "Mais" do menu de baixo abre no toque', async ({ page }) => {
  await entrar(page, '/5_Game_Pavilion_Forest_Edition.html');
  const mais = page.locator('nav.md\\:hidden button', { hasText: 'Mais' });
  await expect(mais).toBeVisible();
  const centro = await mais.evaluate(el => {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  });
  await page.touchscreen.tap(centro.x, centro.y);   // o dedo cai no meio do botão
  await expect.poll(() => page.evaluate(() => {
    const r = document.getElementById('more-sheet').getBoundingClientRect();
    return r.top < innerHeight - 100;
  })).toBe(true);
});
