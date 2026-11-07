// Página de Cursos (07/nov/2026): o aluno acha o curso dele em um toque.
// "Meus cursos" mostra o progresso de cada curso e o "Continuar" leva direto à
// próxima aula; a busca entende palavras sem acento; os filtros do topo
// separam por tipo de curso.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');

const RAIZ = path.join(__dirname, '..');
const HTML = fs.readFileSync(path.join(RAIZ, 'classes.html'), 'utf8');

test('cada curso do catálogo tem cor, palavras de busca e (quando grava progresso) a chave e o prefixo certos', () => {
  const cursos = [...HTML.matchAll(/\{ id: '([a-z]+)',/g)].map(m => m[1]);
  assert.ok(cursos.length >= 11, `achei só ${cursos.length} cursos no catálogo`);
  const visual = HTML.match(/const VISUAL = \{([\s\S]*?)\n\};/);
  assert.ok(visual, 'classes.html precisa do mapa VISUAL');
  for (const id of cursos) {
    const linha = visual[1].match(new RegExp(`^\\s*${id}:\\s*\\{(.*)\\},?$`, 'm'));
    assert.ok(linha, `${id} sem cor/busca no VISUAL`);
    assert.match(linha[1], /cor: '#[0-9a-f]{6}'/, `${id}: cor`);
    const chave = linha[1].match(/chave: '([A-Za-z]+)'/);
    const prefixo = linha[1].match(/prefixo: '([a-z]+)'/);
    if (!chave) continue;
    // A chave tem que ser a mesma que a página do curso lê, e o prefixo tem
    // que apontar para aulas que existem.
    assert.ok(prefixo, `${id}: chave sem prefixo`);
    const hub = HTML.match(new RegExp(`^\\s*${id}:\\s*'(classes_[a-z]+\\.html)'`, 'm'));
    assert.ok(hub, `${id} fora do mapa CURSOS`);
    assert.ok(fs.readFileSync(path.join(RAIZ, hub[1]), 'utf8').includes(`'${chave[1]}'`), `${hub[1]} não usa ${chave[1]}`);
    assert.ok(fs.existsSync(path.join(RAIZ, `${prefixo[1]}_aula_01.html`)), `${prefixo[1]}_aula_01.html não existe`);
  }
});

test('a página não usa amarelo e continua gravando a última aula do Starter', () => {
  assert.ok(!/#d97706|#f59e0b|#eab308|#facc15/i.test(HTML), 'sem amarelo (design system)');
  assert.match(HTML, /localStorage\.setItem\('capyUltimaAula'/);
});

function servidor() {
  const tipos = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.json': 'application/json' };
  const srv = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0]);
    if (url.startsWith('/api/')) { res.writeHead(401, { 'content-type': 'application/json' }); res.end('{}'); return; }
    const arq = path.join(RAIZ, path.normalize(url === '/' ? '/classes.html' : url));
    if (!arq.startsWith(RAIZ) || !fs.existsSync(arq) || fs.statSync(arq).isDirectory()) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'content-type': tipos[path.extname(arq)] || 'application/octet-stream' });
    fs.createReadStream(arq).pipe(res);
  });
  return new Promise(ok => srv.listen(0, '127.0.0.1', () => ok(srv)));
}

async function abrir(browser, base, ls, largura = 390) {
  const ctx = await browser.newContext({ viewport: { width: largura, height: 900 } });
  const page = await ctx.newPage();
  const erros = [];
  page.on('pageerror', e => erros.push(e.message));
  // Fora do ar no teste: Tailwind e fontes não mudam a lógica.
  await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, r => r.fulfill({ status: 200, body: /tailwindcss/.test(r.request().url()) ? 'window.tailwind = {};' : '' }));
  await page.addInitScript(dados => { for (const [k, v] of Object.entries(dados)) localStorage.setItem(k, v); }, ls);
  await page.goto(`${base}/classes.html`);
  await page.waitForSelector('#grupos .cartao');
  return { page, ctx, erros };
}

test('Meus cursos, Continuar, busca sem acento e filtros', { timeout: 90_000 }, async () => {
  const srv = await servidor();
  const base = `http://127.0.0.1:${srv.address().port}`;
  const browser = await chromium.launch();
  try {
    // Aluno novo: Starter e o teste de nível.
    {
      const { page, ctx, erros } = await abrir(browser, base, {});
      assert.equal(await page.textContent('#meus-titulo'), 'Comece por aqui');
      assert.equal(await page.getAttribute('#meus [data-ir="starter"]', 'href'), 'aula_01.html');
      assert.ok(await page.$('#meus a[href="placement_test.html"]'), 'atalho para o teste de nível');
      assert.deepEqual(erros, []);
      await ctx.close();
    }
    // Aluno do GPS (12 aulas feitas, sem ter passado por esta página) e do Starter.
    {
      const { page, ctx, erros } = await abrir(browser, base, {
        capyGpstronicCompleted: '[1,2,3,4,5,6,7,8,9,10,11,12]',
        capyUltimaAula: JSON.stringify({ n: 8, title: 'Past Simple — Irregular Verbs', href: 'aula_08.html', at: 1 }),
      });
      assert.equal(await page.textContent('#meus-titulo'), 'Meus cursos');
      const gps = page.locator('#meus [data-ir="gpstronic"]');
      assert.equal(await gps.getAttribute('href'), 'gpstronic_aula_13.html', 'Continuar vai direto à próxima aula');
      assert.match(await gps.textContent(), /Continuar aula 13/);
      assert.equal(await page.getAttribute('#meus [data-ir="starter"]', 'href'), 'aula_08.html');
      assert.equal(await page.getAttribute('#meus [data-curso-ver="gpstronic"]', 'href'), 'classes_gpstronic.html');
      // O cartão do catálogo também mostra o progresso.
      assert.match(await page.textContent('#grupos [data-curso="gpstronic"]'), /12 de \d+ aulas feitas/);
      // Clicar em Continuar abre a aula e lembra o curso.
      await Promise.all([page.waitForURL(/gpstronic_aula_13\.html$/), gps.click()]);
      assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('capyCursosVistos'))[0]), 'gpstronic');
      assert.deepEqual(erros, []);
      await ctx.close();
    }
    // Busca e filtros.
    {
      const { page, ctx, erros } = await abrir(browser, base, {});
      const visiveis = () => page.$$eval('#grupos .cartao', bs => bs.filter(b => b.offsetParent !== null).map(b => b.dataset.curso));
      assert.equal((await visiveis()).length, 11);
      await page.fill('#busca', 'frances');
      assert.deepEqual(await visiveis(), ['francais'], '"frances" sem acento acha Français');
      assert.ok(await page.isHidden('#meus-sec'), 'Meus cursos sai da frente durante a busca');
      await page.fill('#busca', 'medico');
      assert.deepEqual(await visiveis(), ['med']);
      await page.fill('#busca', 'trator');
      assert.deepEqual((await visiveis()).sort(), ['agro', 'gpstronic']);
      // Aulas do Starter também aparecem na busca.
      await page.fill('#busca', 'passive');
      assert.ok(await page.isVisible('#res-aulas [data-aula-busca="31"]'), 'acha a aula Passive Voice');
      await page.fill('#busca', 'xyzqw');
      assert.ok(await page.isVisible('#busca-vazia'));
      assert.match(await page.textContent('#busca-status'), /Nenhum resultado/);
      await page.click('#busca-limpar');
      assert.equal(await page.inputValue('#busca'), '');
      assert.ok(await page.isVisible('#meus-sec'));
      // Filtro "Outros idiomas".
      await page.click('#chips [data-chip="3"]');
      assert.deepEqual((await visiveis()).sort(), ['francais', 'turkish']);
      assert.equal(await page.getAttribute('#chips [data-chip="3"]', 'aria-pressed'), 'true');
      await page.click('#chips [data-chip="-1"]');
      assert.equal((await visiveis()).length, 11);
      // Nada passa da largura do celular.
      const largura = await page.evaluate(() => document.documentElement.scrollWidth);
      assert.ok(largura <= 390, `rolagem lateral no celular (${largura}px)`);
      assert.deepEqual(erros, []);
      await ctx.close();
    }
  } finally {
    await browser.close();
    srv.close();
  }
});
