// A lição de casa chega ao professor (18/out/2026): components.js observa o
// botão "Submit Homework" de toda aula e, quando a entrega vale (o botão fica
// desabilitado), manda as respostas escritas para POST /api/homework.
const { test, expect } = require('playwright/test');

const ALUNA = { id: 'aluna-teste', name: 'Aluna Teste', email: 'aluna@example.test', role: 'student' };
const TEXTO = 'I told my friend about my new job and she felt happy.';

// Every API call is intercepted: these tests never reach a real database.
async function abrirAula(page, { sessao = ALUNA, statusLicao = [200], pagina = '/aula_05.html', botao = 'submitHomework5()' } = {}) {
  const enviadas = [];
  const fila = [...statusLicao];
  await page.route('**/api/**', async route => {
    const req = route.request();
    const path = new URL(req.url()).pathname;
    if (path === '/api/auth/session') {
      await route.fulfill(sessao
        ? { status: 200, json: { ok: true, user: sessao, csrfToken: 'csrf-teste' } }
        : { status: 401, json: { error: 'authentication_required' } });
    } else if (path === '/api/homework' && req.method() === 'POST') {
      enviadas.push(req.postDataJSON());
      const status = fila.length ? fila.shift() : 200;
      await route.fulfill({ status, json: status === 200 ? { success: true, id: 'entrega-1' } : { error: 'database_error' } });
    } else {
      await route.fulfill({ status: 401, json: { error: 'unexpected_mock_request' } });
    }
  });
  await page.goto(pagina);
  await page.evaluate(() => window.Auth && window.Auth.ready());
  await page.locator('[data-tab="homework"]').first().click();
  const aba = page.locator('#tab-homework');
  await aba.locator('textarea, input[type="text"]').last().fill(TEXTO);
  return { aba, enviadas, botao: aba.locator(`button[onclick="${botao}"]`) };
}

test('a signed-in student\'s homework reaches the teacher, with the lesson and the written answers', async ({ page }) => {
  const { aba, enviadas, botao } = await abrirAula(page);
  await botao.click();
  await expect(aba.getByText('Lição enviada para o seu professor.')).toBeVisible();
  expect(enviadas).toHaveLength(1);
  expect(enviadas[0]).toMatchObject({ lessonId: 'aula_05', xp: 75 });
  expect(enviadas[0].lessonTitle).toContain('To Tell, Work, Feel & Leave');
  expect(Object.values(enviadas[0].answers)).toContain(TEXTO);
  // The button is disabled now: a second click sends nothing.
  await botao.click({ force: true });
  await page.waitForTimeout(200);
  expect(enviadas).toHaveLength(1);
});

test('a visitor without an account sends nothing and is told to sign in for the teacher to see it', async ({ page }) => {
  const { aba, enviadas, botao } = await abrirAula(page, { sessao: null });
  await botao.click();
  await expect(aba.getByText(/Entre na sua conta para o professor ver/)).toBeVisible();
  await expect(aba.getByRole('link', { name: 'entrar' })).toHaveAttribute('href', /next=aula_05\.html$/);
  expect(enviadas).toHaveLength(0);
});

test('when the lesson refuses the submission (the button stays enabled), nothing is sent', async ({ page }) => {
  const { aba, enviadas, botao } = await abrirAula(page);
  await page.evaluate(() => { window.submitHomework5 = () => {}; });
  await botao.click();
  await page.waitForTimeout(200);
  expect(enviadas).toHaveLength(0);
  await expect(aba.getByText(/Lição enviada|Enviando/)).toHaveCount(0);
});

test('a failed send says so and "Tentar de novo" sends the same homework again', async ({ page }) => {
  const { aba, enviadas, botao } = await abrirAula(page, { statusLicao: [502, 200] });
  await botao.click();
  await expect(aba.getByText(/Não deu para enviar sua lição/)).toBeVisible();
  await aba.getByRole('button', { name: 'Tentar de novo' }).click();
  await expect(aba.getByText('Lição enviada para o seu professor.')).toBeVisible();
  expect(enviadas).toHaveLength(2);
  expect(enviadas[1]).toEqual(enviadas[0]);
});

test('a lesson whose submit button has another name (submitReviewDone) also reaches the teacher', async ({ page }) => {
  // intermediate_revisao.html (18/out) ends its Homework tab in submitReviewDone(), not submitHomework…().
  const { aba, enviadas, botao } = await abrirAula(page, { pagina: '/intermediate_revisao.html', botao: 'submitReviewDone()' });
  await botao.click();
  await expect(aba.getByText('Lição enviada para o seu professor.')).toBeVisible();
  expect(enviadas).toHaveLength(1);
  expect(enviadas[0]).toMatchObject({ lessonId: 'intermediate_revisao', xp: 75 });
  expect(enviadas[0].lessonTitle).toContain('Master Review');
  expect(Object.values(enviadas[0].answers)).toContain(TEXTO);
});
