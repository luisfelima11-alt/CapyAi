const { test, expect } = require('playwright/test');

// A aba Grammar em slides (gramatica-slides.js): clicar no slide abre a tela
// cheia, como o vocabulário; ela navega junto com o deck da página, esconde a
// tradução até a pessoa pedir e libera o +20 XP no último slide.

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('capyPlacementDone', '1');
    localStorage.setItem('capySession', JSON.stringify({ id: 'guest', name: 'Explorer' }));
  });
  await page.goto('/agro_aula_01.html');
  await page.waitForFunction(() => window.CapyGramaticaSlides && typeof irParaPasso === 'function');
  // Vai para o passo da gramática e grava o que seria falado.
  await page.evaluate(() => {
    window.__falou = [];
    window.speak = t => window.__falou.push(t);
    irParaPasso(ROTA.findIndex(s => s.id === 'grammar'), { rolar: false });
  });
});

const foco = page => page.locator('#gs-foco');
const contador = page => page.locator('#gs-foco .gs-foco-contador');
const traducao = page => page.locator('#gs-foco .gs-pt').first();

test('clicking a slide opens it fullscreen and the arrows move both views', async ({ page }) => {
  await page.locator('.gs-slide:not([hidden]) .gs-img').click();
  await expect(foco(page)).toBeVisible();
  await expect(contador(page)).toHaveText('1 / 6');
  await expect(page.locator('body')).toHaveClass(/gs-travado/);
  await expect(page.locator('#gs-foco .gs-img')).toHaveAttribute('src', 'assets/img/gramatica/agro01-0.webp');

  await page.keyboard.press('ArrowRight');
  await expect(contador(page)).toHaveText('2 / 6');
  await expect(page.locator('#gs-pos')).toHaveText('Slide 2 de 6');
  await expect(page.locator('#gs-foco .gs-titulo')).toContainText('I am');

  await page.keyboard.press('Escape');
  await expect(foco(page)).toBeHidden();
  await expect(page.locator('body')).not.toHaveClass(/gs-travado/);
  await expect(page.locator('.gs-slide:not([hidden])')).toHaveAttribute('data-i', '1');
});

test('the translation stays hidden until asked, and the audio reads the plain sentence', async ({ page }) => {
  await page.locator('#gs-prox').click();
  await page.locator('.gs-slide:not([hidden]) .gs-expandir').click();
  await expect(contador(page)).toHaveText('2 / 6');
  await expect(traducao(page)).toBeHidden();

  await page.keyboard.press(' ');
  await expect(traducao(page)).toBeVisible();
  await expect(traducao(page)).toHaveText('Eu sou o Luan.');
  await page.keyboard.press('ArrowRight');
  await expect(traducao(page)).toBeHidden();

  await page.locator('#gs-foco .gs-ouvir').first().click();
  await expect.poll(() => page.evaluate(() => window.__falou)).toEqual(["I'm from Dourados."]);
  await expect(foco(page)).toBeVisible();
});

test('the audio button on the page plays without opening the fullscreen', async ({ page }) => {
  await page.locator('#gs-prox').click();
  await page.locator('.gs-slide:not([hidden]) .gs-ouvir').first().click();
  await expect.poll(() => page.evaluate(() => window.__falou)).toEqual(['I am Luan.']);
  await expect(foco(page)).toBeHidden();
});

test('reaching the last slide in fullscreen unlocks the +20 XP', async ({ page }) => {
  await expect(page.locator('#gs-xp')).toBeDisabled();
  await page.locator('.gs-slide:not([hidden]) .gs-img').click();
  for (let i = 0; i < 5; i++) await page.keyboard.press('ArrowRight');
  await expect(contador(page)).toHaveText('6 / 6');
  await expect(page.locator('#gs-foco .gs-foco-next')).toBeHidden();
  await page.locator('#gs-foco .gs-foco-fechar').click();
  await expect(page.locator('#gs-xp')).toBeEnabled();
  await expect(page.locator('#gs-xp')).toContainText('Vi todos os exemplos');
});
