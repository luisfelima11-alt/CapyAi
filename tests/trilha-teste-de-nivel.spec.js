// Trilha (learn.html) e o teste de nível. O "já fiz o teste" fica só no
// aparelho (localStorage). Até 13/nov/2026, quem tinha conta e abria a trilha
// noutro aparelho (o celular depois de se cadastrar no computador, outro
// navegador) era mandado para o teste toda vez, mesmo com o onboarding feito.
const { test, expect } = require('playwright/test');

const ALUNA = { id: 'aluna-teste', name: 'Ana Souza', email: 'ana@example.test', role: 'student' };

async function abrir(page, { sessao, perfil, local = {} }) {
  await page.addInitScript(({ sessao, local }) => {
    if (sessao) localStorage.setItem('capySession', JSON.stringify(sessao));
    for (const [k, v] of Object.entries(local)) localStorage.setItem(k, v);
  }, { sessao, local });
  await page.route('**/api/**', route => {
    const caminho = new URL(route.request().url()).pathname;
    if (caminho === '/api/auth/session') {
      return sessao && sessao.role === 'student'
        ? route.fulfill({ status: 200, json: { ok: true, user: sessao, csrfToken: 'csrf-teste' } })
        : route.fulfill({ status: 401, json: { error: 'unauthorized' } });
    }
    if (caminho === '/api/profile') return route.fulfill({ status: 200, json: perfil || {} });
    return route.fulfill({ status: 200, json: {} });
  });
  await page.goto('/learn.html');
}

test('aluna com conta e onboarding feito, num aparelho novo, fica na trilha', async ({ page }) => {
  await abrir(page, { sessao: ALUNA, perfil: { onboarding_complete: true, english_level: 'elementary' } });
  await expect.poll(() => page.evaluate(() => localStorage.getItem('capyPlacementDone'))).toBe('1');
  await page.waitForTimeout(500);
  await expect(page).toHaveURL(/\/learn\.html$/);
  // O nível do perfil vira o selo da trilha.
  expect(await page.evaluate(() => localStorage.getItem('capyPlayerLevel'))).toBe('elementary');
  await expect(page.locator('#level-name')).toHaveText('Elementary Level');
});

test('o nível que o aparelho já tem (do teste) não é trocado pelo do perfil', async ({ page }) => {
  await abrir(page, {
    sessao: ALUNA,
    perfil: { onboarding_complete: true, english_level: 'beginner' },
    local: { capyPlacementDone: '1', capyPlayerLevel: 'intermediate' },
  });
  await expect(page.locator('#level-name')).toHaveText('Intermediate Level');
  await page.waitForTimeout(500);
  await expect(page).toHaveURL(/\/learn\.html$/);
  expect(await page.evaluate(() => localStorage.getItem('capyPlayerLevel'))).toBe('intermediate');
});

test('visitante sem o teste vai para o teste de nível', async ({ page }) => {
  await abrir(page, { sessao: null });
  await expect(page).toHaveURL(/\/placement_test\.html$/);
});

test('visitante (sessão antiga de convidado) sem o teste também vai para o teste', async ({ page }) => {
  await abrir(page, { sessao: { id: 'guest', name: 'Explorer' } });
  await expect(page).toHaveURL(/\/placement_test\.html$/);
});

test('aluna com conta e sem onboarding vai para o onboarding', async ({ page }) => {
  await abrir(page, { sessao: ALUNA, perfil: { onboarding_complete: false } });
  await expect(page).toHaveURL(/\/onboarding\.html/);
});
