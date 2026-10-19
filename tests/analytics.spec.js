// Google Analytics com aviso de cookies: nada do Google antes do "Aceitar".
// O site é servido do disco como se fosse www.capyenglish.com.br (o analytics.js só liga
// no domínio de produção), com um ID de medição de teste no lugar do provisório.
const { test, expect } = require('playwright/test');
const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const SITE = 'https://www.capyenglish.com.br';
const TIPOS = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml' };

async function montar(page, { idDeTeste = true } = {}) {
  const google = [];
  await page.route('**/*', route => {
    const url = new URL(route.request().url());
    if (/googletagmanager\.com|google-analytics\.com/.test(url.host)) {
      google.push(url.href);
      return route.fulfill({ status: 200, contentType: 'application/javascript', body: '' });
    }
    if (url.origin !== SITE) return route.fulfill({ status: 204, body: '' });
    if (url.pathname.startsWith('/api/')) return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    const arquivo = path.join(RAIZ, decodeURIComponent(url.pathname === '/' ? '/landing.html' : url.pathname));
    if (!arquivo.startsWith(RAIZ) || !fs.existsSync(arquivo)) return route.fulfill({ status: 404, body: '' });
    let corpo = fs.readFileSync(arquivo);
    if (idDeTeste && url.pathname === '/analytics.js') corpo = corpo.toString().replace("const GA_ID = 'G-XXXXXXXXXX'", "const GA_ID = 'G-TESTE12345'");
    return route.fulfill({ status: 200, contentType: TIPOS[path.extname(arquivo)] || 'application/octet-stream', body: corpo });
  });
  return google;
}

test('sem consentimento nada do Google carrega; Aceitar carrega o gtag e lembra a escolha', async ({ page }) => {
  const google = await montar(page);
  await page.goto(SITE + '/privacidade.html');
  const aviso = page.locator('#capy-cookies');
  await expect(aviso).toBeVisible();
  await expect(aviso).toContainText('Google Analytics');
  expect(google).toEqual([]);

  await aviso.getByRole('button', { name: 'Aceitar' }).click();
  await expect(aviso).toHaveCount(0);
  await expect.poll(() => google.some(u => u.includes('gtag/js?id=G-TESTE12345'))).toBe(true);
  expect(await page.evaluate(() => localStorage.getItem('capyCookies'))).toBe('aceito');

  // Próxima página: carrega direto, sem perguntar de novo.
  google.length = 0;
  await page.goto(SITE + '/termos.html');
  await expect(page.locator('#capy-cookies')).toHaveCount(0);
  await expect.poll(() => google.length).toBeGreaterThan(0);
});

test('Recusar não carrega nada, não volta a perguntar, e a política reabre o aviso', async ({ page }) => {
  const google = await montar(page);
  await page.goto(SITE + '/privacidade.html');
  await page.locator('#capy-cookies').getByRole('button', { name: 'Recusar' }).click();
  await page.goto(SITE + '/termos.html');
  await expect(page.locator('#capy-cookies')).toHaveCount(0);
  await page.goto(SITE + '/privacidade.html');
  await page.getByRole('button', { name: 'Mudar minha escolha de cookies' }).click();
  await expect(page.locator('#capy-cookies')).toBeVisible();
  expect(google).toEqual([]);
});

test('com o ID provisório o analytics.js não faz nada (pode ir ao ar antes do ID)', async ({ page }) => {
  const google = await montar(page, { idDeTeste: false });
  await page.goto(SITE + '/privacidade.html');
  await page.waitForLoadState('load');
  await expect(page.locator('#capy-cookies')).toHaveCount(0);
  expect(await page.evaluate(() => window.CapyAnalytics && window.CapyAnalytics.ativo)).toBe(false);
  expect(google).toEqual([]);
});

test('eventos do funil e cliques de WhatsApp vão para o GA só depois do Aceitar, sem dado pessoal', async ({ page }) => {
  await montar(page);
  await page.goto(SITE + '/privacidade.html');
  await page.locator('#capy-cookies').getByRole('button', { name: 'Aceitar' }).click();
  const eventos = await page.evaluate(() => {
    window.CapyAnalytics.evento('mini_complete', { lessonId: 'L12', email: 'aluno@x.com' });
    window.CapyAnalytics.evento('Nome Inválido', {});
    return window.dataLayer.filter(a => a[0] === 'event').map(a => [a[1], a[2]]);
  });
  expect(eventos).toEqual([['mini_complete', { lesson_id: 'L12' }]]);
});
