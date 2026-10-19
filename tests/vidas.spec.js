// ❤️ Vidas do plano grátis (19/out/2026): vidas.js embrulha as funções de
// resposta das páginas; cada erro avisa POST /api/vidas/errou, e sem vidas a
// resposta não roda e aparece o aviso. Todas as chamadas à API são simuladas.
const { test, expect } = require('playwright/test');

const ALUNA = { id: 'aluna-teste', name: 'Aluna Teste', email: 'aluna@example.test', role: 'student' };

async function abrir(page, { vidas = 5, ilimitado = false, depois = [], pagina = '/advanced_aula_01.html', convite = 'ok' } = {}) {
  const erros = [];
  const aceites = [];
  const fila = [...depois];
  await page.route('**/api/**', async route => {
    const req = route.request();
    const path = new URL(req.url()).pathname;
    if (path === '/api/auth/session') return route.fulfill({ status: 200, json: { ok: true, user: ALUNA, csrfToken: 'csrf-teste' } });
    if (path === '/api/vidas') return route.fulfill({ status: 200, json: ilimitado ? { ilimitado: true } : { vidas, max: 5, proximaEm: new Date(Date.now() + 3 * 3600e3).toISOString() } });
    if (path === '/api/vidas/errou') { erros.push(1); return route.fulfill({ status: 200, json: { vidas: fila.length ? fila.shift() : 0, max: 5, proximaEm: null } }); }
    if (path === '/api/convite/aceitar') { aceites.push(req.postDataJSON()); return route.fulfill({ status: 200, json: { status: convite, premio: { vidas: 5, ia: 5 } } }); }
    return route.fulfill({ status: 401, json: { error: 'unexpected_mock_request' } });
  });
  await page.goto(pagina);
  await page.evaluate(() => window.Auth && window.Auth.ready());
  return { erros, aceites };
}

async function abrirPratica(page) {
  await page.locator('[data-tab="practice"]').first().click();
  await expect(page.locator('#opts button').first()).toBeVisible();
  const certa = await page.evaluate(() => QUIZ[pracIdx].a);
  return {
    certa: page.locator('#opts button').filter({ hasText: certa }).first(),
    errada: page.locator('#opts button').filter({ hasNotText: certa }).first(),
  };
}

test('a free student\'s wrong answer spends a life; a right one does not', async ({ page }) => {
  const { erros } = await abrir(page, { vidas: 5, depois: [4] });
  await expect(page.locator('#capy-vidas')).toHaveText('❤️ 5');
  const { errada } = await abrirPratica(page);
  await errada.click();
  await expect(page.locator('#capy-vidas')).toHaveText('❤️ 4');
  expect(erros).toHaveLength(1);
  // The answered question is locked: clicking again spends nothing.
  await errada.click({ force: true });
  await page.waitForTimeout(200);
  expect(erros).toHaveLength(1);
});

test('a right answer spends nothing', async ({ page }) => {
  const { erros } = await abrir(page, { vidas: 5 });
  const { certa } = await abrirPratica(page);
  await certa.click();
  await page.waitForTimeout(300);
  expect(erros).toHaveLength(0);
  await expect(page.locator('#capy-vidas')).toHaveText('❤️ 5');
});

test('the last life lost opens the warning, with the invite and the plans', async ({ page }) => {
  await abrir(page, { vidas: 1, depois: [0] });
  const { errada } = await abrirPratica(page);
  await errada.click();
  const aviso = page.locator('#capy-vidas-aviso');
  await expect(aviso.getByText('Suas vidas acabaram')).toBeVisible({ timeout: 4000 });
  await expect(aviso.getByRole('button', { name: /Convidar um amigo/ })).toBeVisible();
  await expect(aviso.getByRole('link', { name: /Pro/ })).toHaveAttribute('href', 'landing.html#pricing');
});

test('with no lives the answer does not run: the warning opens instead', async ({ page }) => {
  const { erros } = await abrir(page, { vidas: 0 });
  const { certa } = await abrirPratica(page);
  await certa.click();
  await expect(page.locator('#capy-vidas-aviso').getByText('Suas vidas acabaram')).toBeVisible();
  expect(await page.evaluate(() => pracScore)).toBe(0);
  await expect(certa).toBeEnabled();
  expect(erros).toHaveLength(0);
});

test('Pro and Super see no lives and spend nothing', async ({ page }) => {
  const { erros } = await abrir(page, { ilimitado: true });
  const { errada } = await abrirPratica(page);
  await errada.click();
  await page.waitForTimeout(300);
  await expect(page.locator('#capy-vidas')).toHaveCount(0);
  expect(erros).toHaveLength(0);
});

test('an invite link is kept until the friend has an account, then sent once', async ({ page }) => {
  await page.route('**/api/**', route => route.fulfill({ status: 401, json: {} }));
  await page.goto('/landing.html?convite=abcdefgh23');
  expect(await page.evaluate(() => localStorage.getItem('capyConvite'))).toBe('abcdefgh23');
  await page.unroute('**/api/**');
  const { aceites } = await abrir(page);
  await expect(page.getByText(/Convite aceito/)).toBeVisible();
  expect(aceites).toEqual([{ codigo: 'abcdefgh23' }]);
  expect(await page.evaluate(() => localStorage.getItem('capyConvite'))).toBeNull();
});
