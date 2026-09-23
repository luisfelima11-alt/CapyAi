const { test, expect } = require('playwright/test');

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('capyPlacementDone', '1');
    localStorage.setItem('capySession', JSON.stringify({ id: 'guest', name: 'Explorer' }));
    localStorage.setItem('capyYaraState', JSON.stringify({
      xp: 0, completedLessons: [], completedMinis: [], onboardingComplete: true,
      planType: 'pro', dailyGoalMinutes: 10, lastQuestDate: ''
    }));
  });
});

test('Turkish course exposes nine chapters and links to its own trail', async ({ page }) => {
  await page.goto('/classes_tr.html');
  await expect(page.getByRole('heading', { name: /Türkçe Başlangıç/ })).toBeVisible();
  await expect(page.locator('#chapter-tabs button')).toHaveCount(9);
  await expect(page.locator('#tr-lessons > a')).toHaveCount(4);
  await expect(page.locator('body')).toContainText('144 minilições');
  await expect(page.locator('a[href="learn.html?lang=tr"]')).toBeVisible();
});

test('Turkish daily trail is separate and opens Turkish guided content', async ({ page }) => {
  await page.goto('/learn.html?lang=tr');
  await expect(page.locator('[data-lang="tr"]')).toHaveClass(/bg-pink-500/);
  await expect(page.locator('#mini-node-301-1')).toBeVisible();
  await expect(page.locator('#mini-node-201-1')).toHaveCount(0);
  await page.locator('#mini-node-301-1').click();
  await page.locator('#popup-start-btn').click();
  await expect(page).toHaveURL(/lessons\.html\?lesson=301&mini=1&guided=1/);
  await expect(page.locator('body')).toContainText('Merhaba');
  await expect.poll(() => page.evaluate(() => CUR_TTS_LANG)).toBe('tr-TR');
});
