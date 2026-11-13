// Trilha diária: uma lição tem 4 dias (minilições). Ela só conta como concluída
// quando os 4 dias foram feitos, em qualquer ordem, e a retomada leva o aluno ao
// próximo dia pendente. Estes testes fazem o caminho do aluno de verdade: abrem
// o dia no modo guiado (lessons.html), terminam e voltam para a trilha.
const { test, expect } = require('playwright/test');

const ALUNA = { id: 'aluna-trilha', name: 'Ana Souza', email: 'ana@example.test', role: 'student' };

// Abre a página com a API dublê: sessão de aluna, perfil com onboarding feito,
// servidor sem progresso salvo e o quiz de IA fora do ar (cai no quiz da lição).
async function preparar(page, { sessao = ALUNA, local = {} } = {}) {
  await page.addInitScript(({ sessao, local }) => {
    if (sessionStorage.getItem('__preparado')) return;   // só na 1ª carga da aba
    sessionStorage.setItem('__preparado', '1');
    localStorage.setItem('capyPlacementDone', '1');
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
    if (caminho === '/api/profile') return route.fulfill({ status: 200, json: { onboarding_complete: true } });
    if (caminho === '/api/lesson-quiz') return route.fulfill({ status: 503, json: { error: 'fora do ar' } });
    return route.fulfill({ status: 200, json: {} });
  });
}

// Responde o quiz inteiro certo, clicando no botão da resposta.
async function responderQuizCerto(page) {
  await expect(page.locator('#quiz-opts')).toBeVisible();
  for (;;) {
    const fim = await page.evaluate(() => quizDone);
    if (fim) break;
    const idx = await page.evaluate(() => quizIdx);
    const certa = await page.evaluate(() => {
      const qs = (GUIDED_MODE && aiQuizQuestions.length > 0) ? aiQuizQuestions
        : (shuffledQuiz.length ? shuffledQuiz : currentLesson.quiz);
      return qs[quizIdx].a || qs[quizIdx].ans;
    });
    await page.locator('#quiz-opts .choice-btn', { hasText: certa }).first().click();
    await page.waitForFunction(i => quizDone || quizIdx > i, idx, { timeout: 8000 });
  }
}

const estado = page => page.evaluate(() => JSON.parse(localStorage.getItem('capyYaraState') || '{}'));

test('fazer só o Dia 1 não fecha a lição: os Dias 2 a 4 continuam pendentes', async ({ page }) => {
  // Começa no passo 2 do Dia 1 (o quiz), como quem já ouviu o Listen.
  await preparar(page, { local: { capyGuidedStep_1_en_m1: '1', capyGuidedVer_1_en_m1: 'v2' } });
  await page.goto('/lessons.html?lesson=1&mini=1&guided=1');
  await responderQuizCerto(page);
  await page.locator('#guided-continue-banner button').click();
  await expect(page.locator('#guided-complete-overlay')).toBeVisible();
  await expect(page.locator('#guided-complete-overlay h2')).toHaveText(/Day 1 Complete/);

  const s = await estado(page);
  expect(s.completedMinis).toEqual(['1_1']);
  expect(s.completedLessons || []).not.toContain(1);

  // De volta à trilha: só o Dia 1 está feito e a retomada aponta o Dia 2.
  await page.goto('/learn.html?lang=en');
  await expect(page.locator('#mini-node-1-1')).toContainText('Done');
  for (const dia of [2, 3, 4]) await expect(page.locator(`#mini-node-1-${dia}`)).not.toContainText('Done');
  await expect(page.locator('#continue-step')).toHaveText(/Day 2/);
  await expect(page.locator('#trail-progress-label')).toHaveText(/^0 \/ /);
});
