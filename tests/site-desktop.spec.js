// Caça aos bugs do site no computador (1280 px), 20/nov/2026.
const { test, expect } = require('playwright/test');

const ALUNA = { id: 'aluna-teste', name: 'Ana Souza', email: 'ana@example.test', role: 'student' };

test.use({ viewport: { width: 1280, height: 720 } });

async function abrirLogada(page, url) {
  const erros = [];
  page.on('pageerror', e => erros.push(e.message));
  await page.addInitScript(aluna => {
    localStorage.setItem('capySession', JSON.stringify(aluna));
    localStorage.setItem('capyAnalyticsConsent', 'no');
  }, ALUNA);
  await page.route('**/api/**', route => {
    const caminho = new URL(route.request().url()).pathname;
    if (caminho === '/api/auth/session') return route.fulfill({ status: 200, json: { ok: true, user: ALUNA, csrfToken: 'csrf-teste' } });
    if (caminho === '/api/profile') return route.fulfill({ status: 200, json: { onboarding_complete: true } });
    return route.fulfill({ status: 200, json: {} });
  });
  await page.goto(url);
  return erros;
}

// O youtube_lab.html montava o menu lateral com innerHTML direto, sem o
// Components.mount: as setas ▲ ▼ do menu chamavam sideNavScroll(), que só existe
// depois do initSideNavScroll(). Clicar dava ReferenceError e o menu não rolava.
test('youtube_lab: as setas do menu lateral funcionam', async ({ page }) => {
  const erros = await abrirLogada(page, '/youtube_lab.html');
  await expect(page.locator('#sidenav-down')).toBeAttached();
  expect(await page.evaluate(() => typeof window.sideNavScroll)).toBe('function');
  await page.evaluate(() => document.getElementById('sidenav-down').click());
  await page.evaluate(() => document.getElementById('sidenav-up').click());
  expect(erros).toEqual([]);
});

// Regra do Luis (12/out/2026): "gramática"/"grammar" não aparecem em nada que
// o aluno vê. Estas páginas do site (fora das aulas) ainda mostravam a palavra:
// selo "Grammar Star", "grammar adventure" no diálogo, "Domine a gramática" no
// curso Advanced, "Expedição de gramática" no Verb Voyage, "Grammar Notes" no
// criador de aulas.
const PROIBIDA = /gramm?[aá]tic|grammar/i;
const textoVisivel = page => page.evaluate(() => {
  const c = document.body.cloneNode(true);
  c.querySelectorAll('script,style,noscript,template').forEach(x => x.remove());
  const attrs = [...c.querySelectorAll('[title],[placeholder],[aria-label],[alt]')]
    .flatMap(el => ['title', 'placeholder', 'aria-label', 'alt'].map(a => el.getAttribute(a) || ''));
  return [document.title, c.textContent, ...attrs].join('\n');
});
for (const pagina of ['3_Dialogue_Expedition_Yara_Turn.html', '5_Game_Pavilion_Forest_Edition.html',
  '9_Game_Pavilion_Yaras_Expedition.html', 'progress.html', 'classes_advanced.html',
  'verb_voyage_game.html', 'lesson_creator.html']) {
  test(`${pagina}: sem "gramática"/"grammar" na tela`, async ({ page }) => {
    await abrirLogada(page, '/' + pagina);
    await page.waitForLoadState('load');
    const texto = await textoVisivel(page);
    expect(texto.match(new RegExp('.{0,40}(' + PROIBIDA.source + ').{0,40}', 'gi')) || []).toEqual([]);
  });
}

test('selo "Grammar Star" e o fim do diálogo também não dizem a palavra', async () => {
  const fs = require('fs'), path = require('path');
  const ler = f => fs.readFileSync(path.join(__dirname, '..', f), 'utf8');
  expect(ler('badge-toast.js')).not.toMatch(/label:\s*'[^']*Grammar/);
  expect(ler('3_Dialogue_Expedition_Yara_Turn.html')).not.toMatch(/grammar explorer/i);
});

// account.html tem CSP estrita na Vercel (style-src-elem sem 'unsafe-inline').
// O CapyJuice.init (components.js) criava um <style> para o "+XP" e o confete:
// a CSP bloqueava, o console da produção mostrava erro e o "+XP" ficava sem estilo.
test('account.html com a CSP da produção: sem erro de CSP e o "+XP" tem estilo', async ({ page }) => {
  const csp = require('../vercel.json').routes.find(r => r.src.includes('account')).headers['Content-Security-Policy'];
  const errosCsp = [];
  page.on('console', m => { if (m.type() === 'error' && /Content Security Policy/.test(m.text())) errosCsp.push(m.text().slice(0, 160)); });
  await page.route(/\/account\.html$/, async route => {
    const r = await route.fetch();
    await route.fulfill({ response: r, headers: { ...r.headers(), 'content-security-policy': csp } });
  });
  await abrirLogada(page, '/account.html');
  await page.waitForFunction(() => typeof window.CapyJuice !== 'undefined');
  await page.waitForTimeout(500);
  const posicao = await page.evaluate(() => {
    const el = document.createElement('div'); el.className = 'capy-xp-pop'; document.body.appendChild(el);
    const p = getComputedStyle(el).position; el.remove(); return p;
  });
  expect(errosCsp).toEqual([]);
  expect(posicao).toBe('fixed');
});
