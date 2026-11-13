// Chat da lousa (quadro.html), 07/nov/2026: o pedido ao /api/quadro-ai vira
// cartões no quadro. Quando a IA falha, as frases prontas aparecem AVISADAS no
// chat e não entram sozinhas no quadro (antes entravam como se fossem a resposta).
const { test, expect } = require('playwright/test');

async function abrirLousa(page, respostaDaIa) {
  const pedidos = [];
  await page.route('**/api/**', route => {
    const req = route.request();
    const caminho = new URL(req.url()).pathname;
    if (caminho === '/api/quadro-ai') {
      pedidos.push(req.postDataJSON());
      return route.fulfill(respostaDaIa);
    }
    return route.fulfill({ status: 401, json: { error: 'unauthorized' } });
  });
  await page.goto('/quadro.html?sala=travel');
  await page.click('#yw-fab');
  return pedidos;
}

const cartoesNoQuadro = page => page.evaluate(() => strokes.filter(s => s && (s.kind === 'note' || s.kind === 'text')).map(s => s.texto));

test('o pedido vira os cartões que a IA respondeu, no chat e no quadro', async ({ page }) => {
  const pedidos = await abrirLousa(page, { status: 200, json: {
    reply: 'Aqui estão 2 frases sobre viagem!',
    cards: [
      { badge: 'Frase 1', en: 'Where is the boarding gate?', pt: 'Onde fica o portão de embarque?' },
      { badge: 'Frase 2', en: 'I would like a window seat.', pt: 'Eu gostaria de um assento na janela.' },
    ],
  } });
  await page.fill('#yw-input', 'Me dê 2 frases sobre viagem');
  await page.click('#yw-send');

  const chat = page.locator('#yw-messages');
  await expect(chat).toContainText('Aqui estão 2 frases sobre viagem!');
  await expect(chat).toContainText('Where is the boarding gate?');
  await expect(chat).toContainText('✅ Colado na lousa!');
  expect(await cartoesNoQuadro(page)).toEqual(['Where is the boarding gate?', 'I would like a window seat.']);
  expect(pedidos[0]).toMatchObject({ sala: 'travel', message: 'Me dê 2 frases sobre viagem' });

  // A conversa continua: o segundo pedido leva o primeiro no histórico.
  await page.fill('#yw-input', 'Agora mais formal');
  await page.click('#yw-send');
  await expect.poll(() => pedidos.length).toBe(2);
  expect(pedidos[1].history.map(m => m.role)).toEqual(['user', 'assistant']);
  expect(pedidos[1].history[1].content).toContain('Where is the boarding gate?');
});

test('IA fora do ar: frases prontas avisadas, sem colar sozinhas no quadro', async ({ page }) => {
  await abrirLousa(page, { status: 502, json: { error: 'ia_falhou', message: 'A Yara não respondeu agora. Tente de novo.' } });
  await page.fill('#yw-input', 'Me dê 3 frases sobre viagem');
  await page.click('#yw-send');

  const chat = page.locator('#yw-messages');
  await expect(chat).toContainText('⚠️ A Yara não respondeu agora. Tente de novo.');
  await expect(chat).toContainText('frases prontas');
  await expect(chat).not.toContainText('✅ Colado na lousa!');
  expect(await cartoesNoQuadro(page)).toEqual([]);

  // O professor ainda pode usar as prontas, se quiser.
  await page.getByRole('button', { name: /Colar todos na lousa/ }).click();
  await expect.poll(async () => (await cartoesNoQuadro(page)).length).toBeGreaterThan(0);
});
