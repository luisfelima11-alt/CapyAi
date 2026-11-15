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

// ── Homework de 12 tarefas (15/nov/2026, protótipo no GPS 20–24) ───────────
test('GPS 20: as 12 tarefas, com ditado, tradução, diálogo de memória e revisão da aula anterior no placar', async ({ page }) => {
  const { aba, enviadas } = await abrir(page, '/gpstronic_aula_20.html');
  await expect(aba).toContainText('São 12 tarefas, uns 30 a 40 minutos');
  for (const n of ['8', '9', '10', '11', '12']) await expect(aba.locator('span.rounded-full', { hasText: new RegExp(`^${n}$`) }).first()).toBeVisible();
  const D = await page.evaluate(() => window.HW_PLUS);
  expect([D.ditado.length, D.traduzir.length, D.memoria.length, D.revisao.length]).toEqual([4, 5, 4, 6]);

  // 8. Ditado: a frase é falada (dublê) e não aparece escrita; contração e pontuação não pesam.
  await page.evaluate(() => { window.__faladas = []; window.speak = t => window.__faladas.push(t); });
  await aba.locator('[data-hw-ditado="0"]').click();
  expect(await page.evaluate(() => window.__faladas)).toEqual([D.ditado[0]]);
  await expect(aba.getByText(D.ditado[2])).toHaveCount(0);
  await page.fill('#ditado-1', 'welcome to the gps tronic booth');
  await page.fill('#ditado-2', 'How big is the farm?');
  await page.fill('#ditado-3', 'We are cheaper than buying a new receiver');     // "We're" na frase
  await page.fill('#ditado-4', 'Here is the price');                              // errada
  await page.click('#ditado-conferir');
  await expect(page.locator('#ditado-total')).toHaveText('3 de 4 certas');
  await expect(page.locator('#ditado-fb-3')).toContainText(D.ditado[3]);

  // 9. Traduzir: aceita as variações previstas; uma em branco conta como errada no placar.
  await page.fill('#traduzir-1', 'what does your company do');
  await page.fill('#traduzir-2', 'We offer support 7 days a week.');
  await page.fill('#traduzir-3', 'Sounds good');
  await page.fill('#traduzir-4', 'I would like a price list, please');
  await page.click('#traduzir-conferir');
  await expect(page.locator('#traduzir-total')).toHaveText('4 de 5 certas');

  // 10. De memória: 3 certas e 1 errada.
  await page.fill('#memoria-1', 'farm');
  await page.fill('#memoria-2', 'Week');
  await page.fill('#memoria-3', 'call');
  await page.fill('#memoria-4', 'weeks');
  await page.click('#memoria-conferir');
  await expect(page.locator('#memoria-total')).toHaveText('3 de 4 certas');
  await expect(page.locator('#memoria-fb-2')).toContainText('choose');

  // 11. Revisão da aula 19: uma tentativa por palavra; erra a primeira de propósito.
  for (const [i, q] of D.revisao.entries()) {
    const k = i === 0 ? q.opts.findIndex(o => o !== q.a) : q.opts.indexOf(q.a);
    await aba.locator(`[data-hw-rev="${i}"][data-hw-rev-op="${k}"]`).click();
  }
  await expect(aba.locator('[data-hw-rev="0"]').first()).toBeDisabled();

  // As outras tarefas e a entrega.
  for (const [i, x] of D.completar.entries()) await page.fill(`#completar-${i + 1}`, x.r[0]);
  for (const q of D.compreensao) await aba.getByRole('button', { name: q.a }).click();
  await page.fill('#frase-livre', 'We offer GPS repair and training.');
  await page.fill('#texto-guiado', 'Welcome to GPS Tronic! We offer GPS repair and operator training. Our repairs are faster than the dealers. Would you like to see a demo?');
  await aba.locator('button[onclick="submitHomeworkGps20()"]').click();
  await expect(aba.getByText('Lição enviada para o seu professor.')).toBeVisible();
  expect(enviadas).toHaveLength(1);
  const r = enviadas[0].answers;
  expect(Object.keys(r)[0]).toBe('placar');
  expect(r.placar).toContain('Completar 4/4');
  expect(r.placar).toContain('Ditado 3/4');
  expect(r.placar).toContain('Traduzir 4/5');
  expect(r.placar).toContain('De memória 3/4');
  expect(r.placar).toContain('Revisão 5/6');
  expect(r['ditado-4']).toBe('Here is the price');          // o teacher vê o que o aluno escreveu
  expect(r['traduzir-3']).toBe('Sounds good');
  await expect(page.locator('#hw-card img')).toHaveAttribute('src', /^blob:/);
});

test('o homework de 12 tarefas é só do GPS 20 a 24; GPS 25 e Agro 13 seguem com 8', async ({ page }) => {
  for (const [pagina, maior] of [['/gpstronic_aula_24.html', true], ['/gpstronic_aula_25.html', false], ['/agro_aula_13.html', false]]) {
    const { aba } = await abrir(page, pagina);
    await expect(aba.locator('#ditado-conferir')).toHaveCount(maior ? 1 : 0);
    await expect(aba).toContainText(maior ? 'São 12 tarefas' : 'São 8 tarefas');
    await page.unrouteAll({ behavior: 'ignoreErrors' });
  }
});
