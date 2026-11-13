// Página de Preparação de aula (piloto: francês), 09/nov/2026.
// A voz (tts-fr.js) e o microfone (CapyMic) são trocados por dublês: o teste
// confere o caminho do aluno, não a OpenAI.
const { test, expect } = require('playwright/test');
const fs = require('fs');
const path = require('path');

const ALUNA = { id: 'aluna-teste', name: 'Ana Souza', email: 'ana@example.test', role: 'student' };
const AULA3 = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'preparacao', 'fr_aula_03.json'), 'utf8'));
const DUBLE_VOZ = 'window.__falas = []; window.speakFrEnd = t => { window.__falas.push(String(t)); return Promise.resolve(true); }; window.speakFrStop = () => {};';

async function abrir(page, url, { concluidas = [], extra = {} } = {}) {
  const enviadas = [];
  await page.addInitScript(([aluna, concl, ex]) => {
    localStorage.setItem('capySession', JSON.stringify(aluna));
    localStorage.setItem('capyFrCompleted', JSON.stringify(concl));
    for (const [k, v] of Object.entries(ex)) localStorage.setItem(k, JSON.stringify(v));
  }, [ALUNA, concluidas, extra]);
  await page.route('**/tts-fr.js*', route => route.fulfill({ contentType: 'text/javascript', body: DUBLE_VOZ }));
  await page.route('**/api/**', async route => {
    const req = route.request();
    const caminho = new URL(req.url()).pathname;
    if (caminho === '/api/auth/session') return route.fulfill({ status: 200, json: { ok: true, user: ALUNA, csrfToken: 'csrf-teste' } });
    if (caminho === '/api/homework' && req.method() === 'POST') { enviadas.push(req.postDataJSON()); return route.fulfill({ status: 200, json: { success: true } }); }
    if (caminho === '/api/profile') return route.fulfill({ status: 200, json: { onboarding_complete: true, english_level: 'basic' } });
    return route.fulfill({ status: 200, json: {} });
  });
  await page.goto(url);
  return enviadas;
}

// Microfone de mentira: devolve o que o teste puser em window.__fala.
async function micDeMentira(page) {
  await page.evaluate(() => {
    window.__usos = [];
    window.CapyMic = {
      async start() { return true; },
      async stopAndTranscribe(o) { window.__usos.push(o); return { text: window.__fala || '', empty: false }; },
      cancel() {},
    };
  });
}

test('próxima aula: a primeira que o aluno não terminou, e a lista das 12', async ({ page }) => {
  await abrir(page, '/preparacao.html', { concluidas: [1, 2] });
  const proxima = page.locator('#proxima');
  await expect(proxima).toContainText('Aula 3 · Les Couleurs');
  await expect(page.locator('#comecar')).toHaveAttribute('href', 'preparacao.html?aula=fr_aula_03');
  await expect(page.locator('ul > li')).toHaveCount(12);
  await expect(page.locator('ul > li').nth(0)).toContainText('Aula feita');
  await expect(page.locator('ul > li').nth(2)).toContainText('Próxima');
});

test('a sessão inteira: ouvir, palavras, ler, reparar, falar — e o teacher recebe o placar', async ({ page }) => {
  const enviadas = await abrir(page, '/preparacao.html?aula=fr_aula_03', { concluidas: [1, 2] });

  // 1. Ouvir: o diálogo inteiro na voz, sem o texto na tela.
  await expect(page.getByText('Ouça a conversa, sem ler')).toBeVisible();
  await expect(page.locator('#passo')).not.toContainText(AULA3.dialogo.linhas[0].fr);
  await page.getByRole('button', { name: '▶ Ouvir a conversa' }).click();
  await expect(page.locator('#tocando')).toContainText('Ouviu tudo');
  expect(await page.evaluate(() => window.__falas.length)).toBe(AULA3.dialogo.linhas.length);
  await expect(page.locator('#seguir')).toBeDisabled();
  for (const [i, c] of AULA3.compreensao.entries()) {
    const certa = i === 0 ? c.opts[1] : c.a;            // erra a 1ª de propósito
    await page.locator(`[data-pergunta="${i}"] [data-opcao="${certa}"]`).click();
  }
  await expect(page.locator('[data-pergunta="0"] [data-fb]')).toContainText(`A resposta é: ${AULA3.compreensao[0].a}`);
  await page.click('#seguir');

  // 2. Palavras: as 2 primeiras "ainda não", as outras "já sabia"; as difíceis voltam.
  let vistas = 0;
  while (await page.locator('[data-virar]').count()) {
    await page.click('[data-virar]');
    const repetindo = await page.getByText('De novo: esta você ainda não sabia').count();
    await page.click(!repetindo && vistas < 2 ? '[data-sabia="0"]' : '[data-sabia="1"]');
    if (!repetindo) vistas++;
  }
  await expect(page.locator('#passo')).toContainText(`Você já sabia ${AULA3.palavras.length - 2} de ${AULA3.palavras.length}`);
  await page.click('#seguir');

  // 3. Ler: o texto aparece; tocar numa palavra sublinhada mostra a tradução.
  await expect(page.locator('#passo')).toContainText(AULA3.dialogo.linhas[0].fr.slice(0, 20));
  await page.locator('.palavra-lida').first().click();
  await expect(page.locator('[data-glossa]:visible').first()).toContainText('=');
  await page.click('#seguir');

  // 4. Reparar: o trecho em destaque, a pergunta e a explicação.
  await expect(page.locator('mark.repare').first()).toHaveText(AULA3.perceber[0].trecho);
  for (const [i, p] of AULA3.perceber.entries()) await page.locator(`[data-repare="${i}"] [data-opcao="${p.a}"]`).click();
  await expect(page.locator('[data-repare="0"] [data-fb]')).toContainText(AULA3.perceber[0].explica);
  await page.click('#seguir');

  // 5. Falar: 3 frases no microfone (com o balde de voz da preparação) e a pergunta.
  await micDeMentira(page);
  for (const [i, f] of AULA3.repetir.entries()) {
    await page.evaluate(t => { window.__fala = t; }, i === 1 ? 'je ne sais pas' : f.fr);
    const gravar = page.locator(`[data-frase="${i}"] [data-gravar]`);
    await gravar.click();
    await gravar.click();
    if (i === 1) {
      await expect(page.locator('[data-frase="1"] [data-fb]')).toContainText('Quase');
      await page.evaluate(t => { window.__fala = t; }, f.fr);
      await gravar.click();
      await gravar.click();
    }
    await expect(page.locator(`[data-frase="${i}"] [data-fb]`)).toContainText('Muito bem');
  }
  await expect(page.locator('#seguir')).toBeDisabled();
  await page.evaluate(() => { window.__fala = "Ma couleur préférée, c'est le bleu."; });
  await page.click('#responder');
  await page.click('#responder');
  await expect(page.locator('#resposta')).toHaveValue("Ma couleur préférée, c'est le bleu.");
  expect(await page.evaluate(() => window.__usos.every(u => u.lang === 'fr' && u.uso === 'preparacao'))).toBe(true);
  await page.click('#seguir');

  // 6. Pronto: placar, XP e o envio ao teacher.
  await expect(page.locator('#passo')).toContainText('Pronto para a aula 3!');
  await expect(page.locator('#envio')).toContainText('O seu teacher já sabe');
  expect(enviadas).toHaveLength(1);
  expect(enviadas[0].lessonId).toBe('fr_aula_03-prep');
  expect(enviadas[0].answers.placar).toBe('Ouvir 2/3 · Palavras 6/8 · Reparar 2/2 · Falar 3/3 · Total 81%');
  expect(enviadas[0].answers.resposta).toBe("Ma couleur préférée, c'est le bleu.");
  expect(enviadas[0].answers.dificeis.split(', ')).toHaveLength(2);
  const guardado = await page.evaluate(() => ({ feitas: JSON.parse(localStorage.getItem('capyPrepFeitas')), palavras: JSON.parse(localStorage.getItem('capyPrepPalavras_fr')) }));
  expect(guardado.feitas.fr_aula_03.pct).toBe(81);
  expect(Object.keys(guardado.palavras)).toHaveLength(2);

  // De volta à lista: já preparado, oferece adiantar a aula 4.
  await page.getByRole('link', { name: 'Voltar para a Preparação' }).click();
  await expect(page.locator('#proxima')).toContainText('Você já se preparou');
  await expect(page.getByRole('link', { name: 'Adiantar a aula 4 →' })).toHaveAttribute('href', 'preparacao.html?aula=fr_aula_04');
});

test('palavras para revisar voltam no dia seguinte, com repetição espaçada', async ({ page }) => {
  const ontem = Date.now() - 1000;
  await abrir(page, '/preparacao.html', {
    concluidas: [1],
    extra: { capyPrepPalavras_fr: {
      Rouge: { pt: 'Vermelho(a)', ex: '', emoji: '🔴', nivel: 0, volta: ontem },
      Bleu: { pt: 'Azul', ex: '', emoji: '🔵', nivel: 0, volta: ontem },
      Vert: { pt: 'Verde', ex: '', emoji: '🟢', nivel: 0, volta: Date.now() + 86400000 },
    } },
  });
  await expect(page.locator('#revisar')).toContainText('Palavras para revisar: 2');
  await page.click('#revisar');
  await page.click('[data-virar]');
  await page.click('[data-sabia="1"]');               // Rouge: lembrou
  await page.click('[data-virar]');
  await page.click('[data-sabia="0"]');               // Bleu: não lembrou (volta na hora)
  await page.click('[data-virar]');
  await page.click('[data-sabia="1"]');
  await expect(page.locator('#cartoes')).toContainText('Você lembrou 1 de 2');
  const palavras = await page.evaluate(() => JSON.parse(localStorage.getItem('capyPrepPalavras_fr')));
  expect(palavras.Rouge.nivel).toBe(1);
  expect(palavras.Rouge.volta).toBeGreaterThan(Date.now() + 2 * 86400000);
  expect(palavras.Bleu.nivel).toBe(0);
});

test('sem microfone: o aluno fala em voz alta e digita', async ({ page }) => {
  await abrir(page, '/preparacao.html?aula=fr_aula_01');
  // Vai direto ao passo de falar.
  await page.evaluate(() => {
    window.CapyMic = { async start({ onError }) { onError('permission_denied'); return false; }, async stopAndTranscribe() { return { text: '' }; }, cancel() {} };
  });
  const A1 = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'preparacao', 'fr_aula_01.json'), 'utf8'));
  for (const [i, c] of A1.compreensao.entries()) await page.locator(`[data-pergunta="${i}"] [data-opcao="${c.a}"]`).click();
  await page.click('#seguir');
  while (await page.locator('[data-virar]').count()) { await page.click('[data-virar]'); await page.click('[data-sabia="1"]'); }
  await page.click('#seguir');
  await page.click('#seguir');
  for (const [i, p] of A1.perceber.entries()) await page.locator(`[data-repare="${i}"] [data-opcao="${p.a}"]`).click();
  await page.click('#seguir');
  await page.locator('[data-frase="0"] [data-gravar]').click();
  await expect(page.locator('#sem-mic')).toContainText('O microfone está bloqueado');
  for (const [i, f] of A1.repetir.entries()) {
    const inp = page.locator(`[data-frase="${i}"] [data-digitar]`);
    await inp.fill(f.fr);
    await inp.press('Tab');
    await expect(page.locator(`[data-frase="${i}"] [data-fb]`)).toContainText('Muito bem');
  }
  await page.getByRole('button', { name: 'Prefiro responder na aula' }).click();
  await expect(page.locator('#seguir')).toBeEnabled();
});

test('os atalhos: botão em cada aula de francês, card na página do curso e na home de quem estuda francês', async ({ page }) => {
  await abrir(page, '/fr_aula_05.html');
  await expect(page.getByRole('link', { name: '🎯 Preparar esta aula · 12 min' })).toHaveAttribute('href', 'preparacao.html?aula=fr_aula_05');

  await page.goto('/classes_fr.html');
  await expect(page.locator('#prep-atalho')).toBeVisible();
  await expect(page.locator('#prep-atalho')).toHaveAttribute('href', 'preparacao.html?aula=fr_aula_01');

  await page.goto('/6_Home_Forest_Expedition.html');
  await expect(page.locator('#home-nome')).toBeVisible();
  await expect(page.locator('#prep-atalho')).toHaveCount(1);
  await expect(page.locator('#prep-atalho')).toBeHidden();      // nunca estudou francês
});

test('home de quem já estuda francês: o card leva à próxima aula a preparar', async ({ page }) => {
  await abrir(page, '/6_Home_Forest_Expedition.html', { concluidas: [1, 2, 3] });
  await expect(page.locator('#prep-atalho')).toBeVisible();
  await expect(page.locator('#prep-atalho')).toContainText('Aula 4');
  await expect(page.locator('#prep-atalho')).toHaveAttribute('href', 'preparacao.html?aula=fr_aula_04');
});
