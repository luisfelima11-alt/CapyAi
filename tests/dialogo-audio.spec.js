// "Ouvir o diálogo" nas aulas do molde novo (Agro, GPS Tronic...). As aulas sem
// arquivo gravado (GPS 15 a 27; Agro 11 a 15 até 21/nov, quando foram gravadas)
// apontavam para mp3 que não existem:
// dava 404 e o plano B falava cada frase duas vezes e andava a fila por tempo
// fixo (16/nov/2026). Agora cada fala sai uma vez, na ordem, uma depois da outra,
// na voz do personagem; quem tem arquivo gravado continua tocando o arquivo.
const { test, expect } = require('playwright/test');

const ALUNA = { id: 'aluna-teste', name: 'Ana Souza', email: 'ana@example.test', role: 'student' };

async function abrir(page, pagina) {
  const pedidosMp3 = [];
  await page.addInitScript(a => localStorage.setItem('capySession', JSON.stringify(a)), ALUNA);
  await page.route('**/api/**', route => {
    const caminho = new URL(route.request().url()).pathname;
    if (caminho === '/api/auth/session') return route.fulfill({ status: 200, json: { ok: true, user: ALUNA, csrfToken: 'csrf-teste' } });
    if (caminho === '/api/profile') return route.fulfill({ status: 200, json: { onboarding_complete: true } });
    return route.fulfill({ status: 200, json: {} });
  });
  await page.route('**/assets/audio/**', route => { pedidosMp3.push(new URL(route.request().url()).pathname); return route.fulfill({ status: 404, body: '' }); });
  await page.goto('/' + pagina);
  await page.waitForFunction(() => typeof dlgTocarTudo === 'function' && typeof window.speakEnEnd === 'function');
  // Voz dublê: cada fala leva 40 ms e registra começo e fim.
  await page.evaluate(() => {
    window.__falas = [];
    window.speakEnStop = () => { window.__parou = (window.__parou || 0) + 1; };
    window.speakEnEnd = (t, o) => new Promise(fim => {
      const f = { t: String(t), voice: o && o.voice, mp3: o && o.mp3, de: performance.now(), ate: null };
      window.__falas.push(f);
      setTimeout(() => { f.ate = performance.now(); fim(true); }, 40);
    });
  });
  return pedidosMp3;
}

test('aula sem arquivo gravado: cada fala uma vez, em ordem, na voz do personagem, sem pedir mp3', async ({ page }) => {
  const pedidosMp3 = await abrir(page, 'gpstronic_aula_20.html');
  const esperadas = await page.evaluate(() => DIALOGO.filter(l => !l.extra).map(l => ({ t: l.en, voz: l.voz, mp3: l.mp3 })));
  expect(esperadas.length).toBeGreaterThan(5);
  expect(esperadas.every(l => !l.mp3 && l.voz)).toBe(true);

  await page.evaluate(() => { dlgTocarTudo(); });
  await page.waitForFunction(n => window.__falas.length === n && window.__falas[n - 1].ate, esperadas.length);
  await page.waitForTimeout(200);
  const falas = await page.evaluate(() => window.__falas);
  expect(falas.map(f => f.t)).toEqual(esperadas.map(l => l.t));            // uma vez cada, na ordem
  expect(falas.map(f => f.voice)).toEqual(esperadas.map(l => l.voz));
  expect(new Set(falas.map(f => f.voice)).size).toBe(2);                    // duas vozes
  for (let i = 1; i < falas.length; i++) expect(falas[i].de).toBeGreaterThanOrEqual(falas[i - 1].ate);   // sem atropelo
  expect(pedidosMp3).toEqual([]);
  await expect(page.locator('#dlg-play-txt')).toHaveText('Ouvir o diálogo');   // voltou ao começo
});

test('"Parar" interrompe a fila', async ({ page }) => {
  await abrir(page, 'gpstronic_aula_20.html');
  // Falas lentas aqui (1 s): com 40 ms a fila podia acabar antes de o teste ver a
  // 2ª fala numa máquina carregada (a CI pulava o "=== 2" e esperava para sempre).
  await page.evaluate(() => {
    window.speakEnEnd = (t, o) => new Promise(fim => { window.__falas.push({ t: String(t) }); setTimeout(() => fim(true), 1000); });
  });
  await page.evaluate(() => { dlgTocarTudo(); });
  await page.waitForFunction(() => window.__falas.length >= 1);
  await page.evaluate(() => { dlgTocarTudo(); });      // o mesmo botão para
  const naHora = await page.evaluate(() => window.__falas.length);
  await page.waitForTimeout(2500);
  expect(await page.evaluate(() => window.__falas.length)).toBe(naHora);   // nenhuma fala nova depois do Parar
  expect(await page.evaluate(() => window.__parou)).toBeGreaterThan(0);
  await expect(page.locator('#dlg-play-txt')).toHaveText('Ouvir o diálogo');
});

test('tocar uma fala só: uma chamada, na voz de quem fala', async ({ page }) => {
  await abrir(page, 'gpstronic_aula_20.html');
  await page.evaluate(() => { dlgTocarUma(1); });
  await page.waitForTimeout(200);
  const falas = await page.evaluate(() => window.__falas);
  expect(falas.length).toBe(1);
  expect(falas[0].t).toBe(await page.evaluate(() => DIALOGO[1].en));
  expect(falas[0].voice).toBe(await page.evaluate(() => DIALOGO[1].voz));
});

for (const [pagina, pasta] of [['agro_aula_05.html', 'agro05'], ['agro_aula_12.html', 'agro12']]) {
  test(`aula com arquivo gravado continua tocando o arquivo (${pagina})`, async ({ page }) => {
    await abrir(page, pagina);
    await page.evaluate(() => { dlgTocarUma(0); });
    await page.waitForTimeout(150);
    const falas = await page.evaluate(() => window.__falas);
    expect(falas.length).toBe(1);
    expect(falas[0].mp3).toBe(`/assets/audio/${pasta}/s01.mp3`);
  });
}
