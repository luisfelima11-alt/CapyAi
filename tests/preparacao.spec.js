// "🎯 Prepare" (07/nov/2026): a preparação antes da aula ao vivo. É o primeiro
// passo da rota das aulas do GPS Tronic e do Agro, sai do conteúdo que a aula
// já tem e avisa o teacher pelo mesmo caminho da lição de casa.
const { test, expect } = require('playwright/test');

const ALUNA = { id: 'aluna-teste', name: 'Ana Souza', email: 'ana@example.test', role: 'student' };

async function abrir(page, pagina, sessao = ALUNA) {
  const enviadas = [];
  await page.route('**/api/**', async route => {
    const req = route.request();
    const path = new URL(req.url()).pathname;
    if (path === '/api/auth/session') {
      await route.fulfill(sessao ? { status: 200, json: { ok: true, user: sessao, csrfToken: 'csrf-teste' } } : { status: 401, json: { error: 'authentication_required' } });
    } else if (path === '/api/homework' && req.method() === 'POST') {
      enviadas.push(req.postDataJSON());
      await route.fulfill({ status: 200, json: { success: true, id: 'p1' } });
    } else await route.fulfill({ status: 401, json: { error: 'unexpected_mock_request' } });
  });
  await page.goto(pagina);
  await page.evaluate(() => window.Auth && window.Auth.ready());
  return { enviadas };
}

test('GPS 25: a aula abre no Prepare, e a preparação feita avisa o teacher', async ({ page }) => {
  const { enviadas } = await abrir(page, '/gpstronic_aula_25.html');
  const prep = page.locator('#tab-prepare');
  await expect(prep).toBeVisible();
  await expect(page.locator('#rota-titulo')).toHaveText('🎯 Prepare');
  await expect(prep.getByText('Prepare-se para a aula')).toBeVisible();
  await expect(prep.locator('[data-prep-palavra]')).toHaveCount(6);
  await expect(prep.locator('[data-prep-fala]')).toHaveCount(4);
  await expect(prep.getByText('Você já teve um cliente bravo?', { exact: false })).toHaveCount(0); // é a GPS 26
  await expect(prep.getByText('Como você apresenta o preço', { exact: false })).toBeVisible();

  // Sem o quiz respondido, não vale.
  await page.click('#prep-pronto');
  await expect(page.locator('#prep-aviso')).toContainText('quiz');
  expect(enviadas).toHaveLength(0);

  // Responde o quiz: a resposta certa de cada pergunta.
  const quiz = await page.evaluate(() => window.CapyPreparacao._quiz.map(q => q.opts.indexOf(q.a)));
  for (let i = 0; i < quiz.length; i++) await prep.locator(`[data-prep-q="${i}"][data-prep-op="${quiz[i]}"]`).click();
  await expect(page.locator('#prep-quiz-total')).toHaveText('5 de 5 certas');
  await prep.locator('[data-prep-palavra="0"]').click();
  await page.fill('#aquecimento', 'I explain what the price includes.');
  await page.click('#prep-pronto');
  await expect(page.locator('#prep-status')).toContainText('teacher já sabe');
  expect(enviadas).toHaveLength(1);
  expect(enviadas[0]).toMatchObject({ lessonId: 'gpstronic_aula_25-prep', xp: 20 });
  expect(enviadas[0].lessonTitle).toContain('Preparação');
  expect(enviadas[0].answers).toEqual({ placar: 'Quiz 5/5 · Palavras ouvidas 1/6', aquecimento: 'I explain what the price includes.' });
  // O passo fica marcado como feito, uma vez só.
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('capyGps25Done')))).toContain('prepare');
  await expect(page.locator('#prep-pronto')).toBeDisabled();
});

test('Agro 10 (aula sem pergunta própria) também tem o Prepare; visitante não envia nada', async ({ page }) => {
  const { enviadas } = await abrir(page, '/agro_aula_10.html', null);
  const prep = page.locator('#tab-prepare');
  await expect(prep).toBeVisible();
  await expect(prep.getByText('o que você já sabe sobre o tema desta aula', { exact: false })).toBeVisible();
  const quiz = await page.evaluate(() => window.CapyPreparacao._quiz.map(q => q.opts.indexOf(q.a)));
  for (let i = 0; i < quiz.length; i++) await prep.locator(`[data-prep-q="${i}"][data-prep-op="${quiz[i]}"]`).click();
  await page.fill('#aquecimento', 'Hoje está muito quente aqui.');
  await page.click('#prep-pronto');
  await expect(page.locator('#prep-status')).toContainText('Entre na sua conta');
  expect(enviadas).toHaveLength(0);
});
