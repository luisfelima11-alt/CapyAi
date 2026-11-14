// Story Time (story_time.html): a palavra que o aluno digita em "Add your own
// word" ia crua para o innerHTML e para onclick="toggleWord('…')". Até
// 13/nov/2026, "don't" quebrava o ✕ (o apóstrofo fechava a string do onclick)
// e HTML digitado entrava na página.
const { test, expect } = require('playwright/test');

async function abrir(page) {
  await page.route('**/api/**', route => {
    const caminho = new URL(route.request().url()).pathname;
    if (caminho === '/api/story') {
      const texto = JSON.stringify({ title: 'A day', sentences: ['Yara said hi.'], moral: 'Be kind.' });
      return route.fulfill({ status: 200, json: { candidates: [{ content: { parts: [{ text: texto }] } }] } });
    }
    return route.fulfill({ status: 200, json: {} });
  });
  await page.goto('/story_time.html');
  await page.waitForFunction(() => typeof addCustomWord === 'function');
}

async function adicionar(page, palavra) {
  await page.fill('#custom-word', palavra);
  await page.press('#custom-word', 'Enter');
}

test('palavra com apóstrofo aparece e sai pelo ✕', async ({ page }) => {
  const erros = [];
  page.on('pageerror', e => erros.push(e.message));
  await abrir(page);
  await adicionar(page, "don't");
  const display = page.locator('#selected-display');
  await expect(display).toContainText("don't");
  await display.locator('button').click();
  await expect(display).not.toContainText("don't");
  expect(await page.evaluate(() => selectedWords)).toEqual([]);
  expect(erros).toEqual([]);
});

test('HTML digitado vira texto, na escolha e na história', async ({ page }) => {
  await abrir(page);
  await adicionar(page, '<img src=x onerror="window.__xss=1">');
  await adicionar(page, '<b>negrito</b>');
  const display = page.locator('#selected-display');
  await expect(display).toContainText('<b>negrito</b>');
  await expect(display.locator('img, b')).toHaveCount(0);

  // O ✕ tira a palavra certa, mesmo com aspas e sinais.
  await display.locator('button').first().click();
  expect(await page.evaluate(() => selectedWords)).toEqual(['<b>negrito</b>']);

  await page.evaluate(() => generateStory());
  const usadas = page.locator('#used-words-row');
  await expect(usadas).toContainText('<b>negrito</b>');
  await expect(usadas.locator('img, b')).toHaveCount(0);
  expect(await page.evaluate(() => window.__xss)).toBeUndefined();
});
