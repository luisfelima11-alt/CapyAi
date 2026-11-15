// XP das ferramentas da lição (lessons.html) é pago UMA vez por rodada.
// Até 13/nov/2026 a tela de fim do Quiz e do Listen era quem pagava o XP, e
// trocar de aba chama de novo renderQuiz()/renderListen(), que redesenham a
// tela de fim. Resultado: Quiz → Flashcards → Quiz pagava a rodada de novo, a
// cada clique, sem o aluno responder nada (XP infinito, nível subindo sozinho).
const { test, expect } = require('playwright/test');

const ALUNA = { id: 'aluna-teste', name: 'Ana Souza', email: 'ana@example.test', role: 'student' };

async function abrirLicao(page) {
  await page.addInitScript(aluna => localStorage.setItem('capySession', JSON.stringify(aluna)), ALUNA);
  await page.route('**/api/**', route => {
    const caminho = new URL(route.request().url()).pathname;
    if (caminho === '/api/auth/session') return route.fulfill({ status: 200, json: { ok: true, user: ALUNA, csrfToken: 'csrf-teste' } });
    if (caminho === '/api/profile') return route.fulfill({ status: 200, json: { onboarding_complete: true } });
    return route.fulfill({ status: 200, json: {} });
  });
  await page.goto('/lessons.html?lesson=1');
  await page.waitForFunction(() => typeof currentLesson !== 'undefined' && currentLesson
    && currentLesson.quiz && currentLesson.quiz.length > 1 && currentLesson.vocab && currentLesson.vocab.length > 3
    && window.Store);
}

const xp = page => page.evaluate(() => Store.state.xp);

test('Quiz: voltar para a aba depois de terminar não paga o XP de novo', async ({ page }) => {
  await abrirLicao(page);
  await page.click('.tool-tab[data-tool="quiz"]');
  // Pula para a última pergunta, com 3 acertos já feitos.
  await page.evaluate(() => {
    const qs = shuffledQuiz.length ? shuffledQuiz : currentLesson.quiz;
    quizIdx = qs.length - 1; quizScore = 3; quizDone = false;
    renderQuiz();
  });
  const certa = await page.evaluate(() => {
    const qs = shuffledQuiz.length ? shuffledQuiz : currentLesson.quiz;
    return qs[quizIdx].a;
  });
  const antes = await xp(page);
  // Texto EXATO: "is" não pode casar com "This is".
  const exato = new RegExp('^\\s*' + certa.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*$');
  await page.locator('#quiz-opts button').filter({ hasText: exato }).click();
  await expect(page.locator('#panel-quiz')).toContainText('Quiz Concluído!', { timeout: 5000 });
  const depoisDeTerminar = await xp(page);
  expect(depoisDeTerminar).toBe(antes + 4 * 5);   // 4 acertos × 5 XP, pagos no fim

  for (let i = 0; i < 3; i++) {
    await page.click('.tool-tab[data-tool="vocab"]');
    await page.click('.tool-tab[data-tool="quiz"]');
    await expect(page.locator('#panel-quiz')).toContainText('Quiz Concluído!');
  }
  expect(await xp(page)).toBe(depoisDeTerminar);
});

test('Listen: voltar para a aba depois de terminar não paga o XP de novo', async ({ page }) => {
  await abrirLicao(page);
  await page.click('.tool-tab[data-tool="listen"]');
  // Pula para o último cartão, com 3 acertos já feitos.
  await page.evaluate(() => {
    const vocab = shuffledVocab.length ? shuffledVocab : currentLesson.vocab;
    listenIdx = vocab.length - 1; listenScore = 3; listenDone = false;
    renderListen();
  });
  const antes = await xp(page);
  await page.locator('#listen-opts button[onclick*="true"]').click();
  await expect(page.locator('#panel-listen')).toContainText('Listening Concluído!', { timeout: 5000 });
  const depoisDeTerminar = await xp(page);
  expect(depoisDeTerminar).toBe(antes + 4 * 5);

  for (let i = 0; i < 3; i++) {
    await page.click('.tool-tab[data-tool="vocab"]');
    await page.click('.tool-tab[data-tool="listen"]');
    await expect(page.locator('#panel-listen')).toContainText('Listening Concluído!');
  }
  expect(await xp(page)).toBe(depoisDeTerminar);
});
