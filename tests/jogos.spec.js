// Jogos do pavilhão e da lição: placar, fim de jogo e XP pago uma vez só.
// Cada teste nasceu de um bug real (ver BUGS-APRENDIDOS.md, caça de 20/nov/2026).
const { test, expect } = require('playwright/test');

const ALUNA = { id: 'aluna-jogos', name: 'Ana Souza', email: 'ana@example.test', role: 'student' };

async function entrarComoAluna(page) {
  await page.addInitScript(aluna => localStorage.setItem('capySession', JSON.stringify(aluna)), ALUNA);
  await page.route('**/api/**', route => {
    const caminho = new URL(route.request().url()).pathname;
    if (caminho === '/api/auth/session') return route.fulfill({ status: 200, json: { ok: true, user: ALUNA, csrfToken: 'csrf-teste' } });
    if (caminho === '/api/profile') return route.fulfill({ status: 200, json: { onboarding_complete: true } });
    return route.fulfill({ status: 200, json: {} });
  });
}

const xpDaAluna = page => page.evaluate(() => window.Store.state.xp);

test.describe('Grammar Lab (grammar_lab.html)', () => {
  test('clicar numa alternativa responde a pergunta (a explicação tem aspas)', async ({ page }) => {
    const erros = [];
    page.on('pageerror', e => erros.push(e.message));
    await entrarComoAluna(page);
    await page.goto('/grammar_lab.html');
    await page.click('text=Praticar Agora!');
    await page.locator('.q-opt').first().click();
    await expect(page.locator('#q-feedback')).toBeVisible();
    await expect(page.locator('#next-btn')).toBeVisible();
    expect(erros).toEqual([]);
  });

  test('a explicação do erro aparece inteira, com as aspas', async ({ page }) => {
    await entrarComoAluna(page);
    await page.goto('/grammar_lab.html');
    await page.click('text=Praticar Agora!');
    const certa = await page.evaluate(() => LESSONS[currentLesson].questions[0].correct);
    const exp = await page.evaluate(() => LESSONS[currentLesson].questions[0].exp);
    await page.locator('.q-opt', { hasNotText: new RegExp(`^\\s*${certa}\\s*$`) }).first().click();
    await expect(page.locator('#fb-text')).toHaveText(exp);
  });
});
