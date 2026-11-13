// Typing da lição (lessons.html): a palavra que aparece na tela é a que é
// cobrada. Até 09/nov/2026 a tela mostrava a lista embaralhada e a conferência
// (e o 💡 Hint) liam a lista na ordem original: o aluno via "Informação",
// digitava "information" e levava erro, porque a resposta esperada era "water".
const { test, expect } = require('playwright/test');

const ALUNA = { id: 'aluna-teste', name: 'Ana Souza', email: 'ana@example.test', role: 'student' };

async function abrirTyping(page) {
  await page.addInitScript(aluna => localStorage.setItem('capySession', JSON.stringify(aluna)), ALUNA);
  await page.route('**/api/**', route => {
    const caminho = new URL(route.request().url()).pathname;
    if (caminho === '/api/auth/session') return route.fulfill({ status: 200, json: { ok: true, user: ALUNA, csrfToken: 'csrf-teste' } });
    if (caminho === '/api/profile') return route.fulfill({ status: 200, json: { onboarding_complete: true } });
    return route.fulfill({ status: 200, json: {} });
  });
  await page.goto('/lessons.html?lesson=1');
  await page.waitForFunction(() => typeof currentLesson !== 'undefined' && currentLesson && currentLesson.vocab && currentLesson.vocab.length > 3);
  // Embaralhado de um jeito que com certeza difere da ordem original.
  await page.evaluate(() => {
    switchTool('typing');
    shuffledVocab = currentLesson.vocab.slice().reverse().slice(0, 15);
    typeIdx = 0; typeScore = 0; typeHints = 0; typeDone = false; typeChecked = false; typeMode = 'pt-to-en';
    renderTyping();
  });
}

// A resposta certa para o que está NA TELA, achada pela tradução mostrada.
const respostaDaTela = page => page.evaluate(() => {
  const mostrado = document.querySelector('#panel-typing .font-headline').textContent.trim();
  return currentLesson.vocab.find(c => c.pt === mostrado).en;
});

test('digitar a palavra que aparece na tela conta como certo', async ({ page }) => {
  await abrirTyping(page);
  const resposta = await respostaDaTela(page);
  const primeiraDaOrdemOriginal = await page.evaluate(() => currentLesson.vocab[0].en);
  expect(resposta).not.toBe(primeiraDaOrdemOriginal);   // o caso do bug: as duas listas diferem

  await page.fill('#type-input', resposta);
  await page.click('text=✓ Verificar');
  await expect(page.locator('#type-feedback-chars .type-char.miss')).toHaveCount(0);
  await expect(page.locator('#type-feedback-chars')).toHaveText(resposta.toLowerCase());
  await expect(page.locator('#panel-typing')).toContainText('✓ 1 corretas');
  expect(await page.evaluate(() => typeIdx)).toBe(1);
});

test('o 💡 Hint dá as letras da palavra da tela', async ({ page }) => {
  await abrirTyping(page);
  const resposta = await respostaDaTela(page);
  await page.click('text=💡 Hint');
  await page.click('text=💡 Hint');
  await expect(page.locator('#type-input')).toHaveValue(resposta.slice(0, 2));
});

test('o Typing termina depois dos cartões da tela (15), sem tentar um 16º', async ({ page }) => {
  await abrirTyping(page);
  const total = await page.evaluate(() => typingVocab().length);
  expect(total).toBeLessThanOrEqual(15);
  await page.evaluate(n => { typeIdx = n - 1; renderTyping(); }, total);
  const resposta = await respostaDaTela(page);
  await page.fill('#type-input', resposta);
  await page.click('text=✓ Verificar');
  await expect(page.locator('#panel-typing')).toContainText('Typing Concluído!');
});
