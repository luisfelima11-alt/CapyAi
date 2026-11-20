// Caça aos bugs do site no computador (1280 px), 20/nov/2026.
const { test, expect } = require('playwright/test');

const ALUNA = { id: 'aluna-teste', name: 'Ana Souza', email: 'ana@example.test', role: 'student' };

test.use({ viewport: { width: 1280, height: 720 } });

async function abrirLogada(page, url) {
  const erros = [];
  page.on('pageerror', e => erros.push(e.message));
  await page.addInitScript(aluna => {
    localStorage.setItem('capySession', JSON.stringify(aluna));
    localStorage.setItem('capyAnalyticsConsent', 'no');
  }, ALUNA);
  await page.route('**/api/**', route => {
    const caminho = new URL(route.request().url()).pathname;
    if (caminho === '/api/auth/session') return route.fulfill({ status: 200, json: { ok: true, user: ALUNA, csrfToken: 'csrf-teste' } });
    if (caminho === '/api/profile') return route.fulfill({ status: 200, json: { onboarding_complete: true } });
    return route.fulfill({ status: 200, json: {} });
  });
  await page.goto(url);
  return erros;
}

// O youtube_lab.html montava o menu lateral com innerHTML direto, sem o
// Components.mount: as setas ▲ ▼ do menu chamavam sideNavScroll(), que só existe
// depois do initSideNavScroll(). Clicar dava ReferenceError e o menu não rolava.
test('youtube_lab: as setas do menu lateral funcionam', async ({ page }) => {
  const erros = await abrirLogada(page, '/youtube_lab.html');
  await expect(page.locator('#sidenav-down')).toBeAttached();
  expect(await page.evaluate(() => typeof window.sideNavScroll)).toBe('function');
  await page.evaluate(() => document.getElementById('sidenav-down').click());
  await page.evaluate(() => document.getElementById('sidenav-up').click());
  expect(erros).toEqual([]);
});
