// Homework maior do GPS Tronic e do Agro (07/nov/2026): 8 tarefas, placar de
// cada tarefa para o professor e um card para o aluno mandar ao teacher.
const { test, expect } = require('playwright/test');

const ALUNA = { id: 'aluna-teste', name: 'Ana Souza', email: 'ana@example.test', role: 'student' };
const TEXTO = 'Option A includes the monitor. Option B also includes RTK. If you choose B, you will get a free training day.';

async function abrir(page, pagina) {
  const enviadas = [];
  await page.route('**/api/**', async route => {
    const req = route.request();
    const path = new URL(req.url()).pathname;
    if (path === '/api/auth/session') await route.fulfill({ status: 200, json: { ok: true, user: ALUNA, csrfToken: 'csrf-teste' } });
    else if (path === '/api/homework' && req.method() === 'POST') { enviadas.push(req.postDataJSON()); await route.fulfill({ status: 200, json: { success: true, id: 'e1' } }); }
    else await route.fulfill({ status: 401, json: { error: 'unexpected_mock_request' } });
  });
  await page.goto(pagina);
  await page.evaluate(() => window.Auth && window.Auth.ready());
  // As aulas do GPS e do Agro são uma rota de passos (sem barra de abas).
  await page.waitForFunction(() => typeof irParaPasso === 'function' && typeof ROTA !== 'undefined');
  await page.evaluate(() => irParaPasso(ROTA.findIndex(s => s.id === 'homework'), { rolar: false }));
  return { aba: page.locator('#tab-homework'), enviadas };
}

test('GPS 25: as 8 tarefas, o placar vai ao professor e o card aparece para compartilhar', async ({ page }) => {
  const { aba, enviadas } = await abrir(page, '/gpstronic_aula_25.html');
  const botao = aba.locator('button[onclick="submitHomeworkGps25()"]');
  for (const n of ['4', '5', '6', '7', '8']) await expect(aba.locator('span.rounded-full', { hasText: new RegExp(`^${n}$`) }).first()).toBeVisible();
  await expect(aba.getByText('Escreva 5 passos para o cliente reiniciar o monitor.')).toHaveCount(0);

  // 4. Completar: 3 certas e 1 errada.
  await page.fill('#completar-1', 'includes');
  await page.fill('#completar-2', 'Takes');
  await page.fill('#completar-3', 'will');
  await page.fill('#completar-4', 'of');
  await page.click('#completar-conferir');
  await expect(page.locator('#completar-total')).toHaveText('3 de 4 certas');
  await expect(page.locator('#completar-fb-3')).toContainText('about');

  // 5. Compreensão: as duas certas (uma tentativa por pergunta).
  await aba.getByRole('button', { name: 'Ninety thousand reais.' }).click();
  await aba.getByRole('button', { name: 'A free training day.' }).click();
  await expect(aba.getByRole('button', { name: 'Nine thousand reais.' })).toBeDisabled();

  // 6. Voz: o microfone é simulado (a transcrição real passa pela API).
  await page.evaluate(() => {
    window.CapyMic = { start: async () => true, stopAndTranscribe: async () => ({ text: 'Option A includes the autosteer and the monitor.' }) };
  });
  const gravar = aba.locator('[data-hw-gravar="0"]');
  await gravar.click();
  await expect(gravar).toHaveText('⏹️ Parar');
  await gravar.click();
  await expect(page.locator('#voz-1')).toHaveValue('Option A includes the autosteer and the monitor.');
  await expect(page.locator('#voz-fb-0')).toContainText('Muito bem');

  // 7. Frase livre.
  await page.fill('#frase-livre', "If you pay today, you'll get a discount.");

  // 8. Sem o texto, a entrega não vale e nada vai para o professor.
  await botao.click();
  await expect(page.locator('#texto-guiado-aviso')).toBeVisible();
  await expect(botao).toBeEnabled();
  await page.waitForTimeout(150);
  expect(enviadas).toHaveLength(0);

  await page.fill('#texto-guiado', TEXTO);
  await botao.click();
  await expect(aba.getByText('Lição enviada para o seu professor.')).toBeVisible();
  expect(enviadas).toHaveLength(1);
  const r = enviadas[0].answers;
  expect(Object.keys(r)[0]).toBe('placar');
  expect(r.placar).toContain('Completar 3/4');
  expect(r.placar).toContain('Compreensão 2/2');
  expect(r.placar).toContain('Voz 1/2');
  expect(r.placar).toContain('Frase livre ✓');
  expect(r.placar).toMatch(/Total \d+\/\d+$/);
  expect(r['texto-guiado']).toBe(TEXTO);
  expect(r['completar-1']).toBe('includes');
  expect(r['voz-1']).toContain('autosteer');

  // O card: imagem pronta, e sem compartilhamento de arquivo o botão baixa a imagem.
  const card = page.locator('#hw-card img');
  await expect(card).toHaveAttribute('src', /^blob:/);
  expect(await card.evaluate(img => img.decode().then(() => [img.naturalWidth, img.naturalHeight]))).toEqual([1080, 1350]);
  await page.evaluate(() => { navigator.canShare = undefined; });
  const [download] = await Promise.all([page.waitForEvent('download'), page.click('#hw-compartilhar')]);
  expect(download.suggestedFilename()).toBe('homework-lesson-25.png');
  await expect(page.locator('#hw-card-aviso')).toContainText('WhatsApp');
});

test('Agro 13 tem o homework novo; Agro 10 só ganha a escrita certa e entrega como antes', async ({ page }) => {
  let { aba } = await abrir(page, '/agro_aula_13.html');
  await expect(aba.locator('#hw-plus')).toContainText('Você entendeu o diálogo?');
  await expect(aba.getByText('Ajude o Jack a escolher')).toBeVisible();

  ({ aba } = await abrir(page, '/agro_aula_10.html'));
  await expect(aba.locator('#hw-plus')).toHaveCount(0);
  await expect(aba.getByText(/reiniciar o monitor/)).toHaveCount(0);
  await expect(aba.getByText('Escreva 4 frases sobre o seu dia a dia', { exact: false })).toBeVisible();
});
