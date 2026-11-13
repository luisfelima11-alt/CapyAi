// Todo arquivo local que uma página pede (src/href no HTML, url() no CSS)
// existe no repositório e entra no deploy. O vercel.json usa "builds", que é
// uma lista branca de extensões: o que não casa com nenhuma entrada não sobe,
// sem erro nenhum no build.
// Até 13/nov/2026 as provas finais do GPS e do Agro pediam
// assets/css/tailwind.css (nunca existiu) e abriam sem estilo, e o lessons.html
// mostrava uma foto que tinha saído do repositório.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const vercel = JSON.parse(fs.readFileSync(path.join(RAIZ, 'vercel.json'), 'utf8'));

function globParaRegex(glob) {
  const escapado = glob.replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*\*\//g, '\u0000')
    .replace(/\*/g, '[^/]*')
    .replace(/\u0000/g, '(?:.*/)?');
  return new RegExp(`^${escapado}$`);
}
const LISTA_BRANCA = vercel.builds.map(b => globParaRegex(b.src));
const entraNoDeploy = arquivo => LISTA_BRANCA.some(r => r.test(arquivo));

// Fontes do Font Awesome que o CSS cita mas o site não usa: as .ttf são
// alternativa para navegador sem woff2, e as provas só usam fa-solid e fa-regular.
const FA = 'assets/vendor/fontawesome-free-6.4.0/webfonts/';
const FONTES_NAO_USADAS = new Set(['fa-brands-400.woff2', 'fa-brands-400.ttf', 'fa-regular-400.ttf',
  'fa-solid-900.ttf', 'fa-v4compatibility.woff2', 'fa-v4compatibility.ttf'].map(f => FA + f));

const IGNORAR = /^(https?:|data:|mailto:|tel:|javascript:|blob:|whatsapp:|sms:|#|\/\/)/i;

function conferir(origem, arquivo, problemas) {
  if (FONTES_NAO_USADAS.has(arquivo)) return;
  if (!fs.existsSync(path.join(RAIZ, arquivo))) problemas.push(`${origem} pede ${arquivo}, que não existe`);
  else if (!entraNoDeploy(arquivo)) problemas.push(`${origem} pede ${arquivo}, que não entra no deploy (vercel.json "builds")`);
}

test('cada src/href local das páginas existe e entra no deploy', () => {
  const problemas = [];
  for (const pagina of fs.readdirSync(RAIZ).filter(f => f.endsWith('.html'))) {
    const html = fs.readFileSync(path.join(RAIZ, pagina), 'utf8').replace(/<!--[\s\S]*?-->/g, '');
    for (const m of html.matchAll(/\s(?:src|href)\s*=\s*(?:"([^"]+)"|'([^']+)')/g)) {
      const bruto = (m[1] || m[2]).trim();
      if (IGNORAR.test(bruto) || /\$\{|\{\{|'\s*\+|"\s*\+/.test(bruto)) continue;
      const semQuery = bruto.split('#')[0].split('?')[0].replace(/^\//, '');
      if (!semQuery || semQuery.endsWith('/') || semQuery.startsWith('api/') || !path.extname(semQuery)) continue;
      let arquivo;
      try { arquivo = decodeURIComponent(semQuery); } catch { arquivo = semQuery; }
      conferir(pagina, arquivo, problemas);
    }
  }
  assert.deepEqual([...new Set(problemas)], []);
});

test('cada url() dos CSS publicados existe e entra no deploy', () => {
  const andar = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    if (e.name === 'node_modules' || e.name.startsWith('.')) return [];
    const caminho = path.join(dir, e.name);
    return e.isDirectory() ? andar(caminho) : [caminho];
  });
  const problemas = [];
  for (const css of andar(RAIZ).filter(f => f.endsWith('.css'))) {
    const rel = path.relative(RAIZ, css).split(path.sep).join('/');
    if (!entraNoDeploy(rel)) continue;
    for (const m of fs.readFileSync(css, 'utf8').matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) {
      const bruto = m[1].trim();
      if (IGNORAR.test(bruto)) continue;
      const semQuery = bruto.split('#')[0].split('?')[0];
      const absoluto = semQuery.startsWith('/') ? path.join(RAIZ, semQuery) : path.join(path.dirname(css), semQuery);
      conferir(rel, path.relative(RAIZ, absoluto).split(path.sep).join('/'), problemas);
    }
  }
  assert.deepEqual([...new Set(problemas)], []);
});

test('nenhuma página usa os ícones do Font Awesome que ficaram de fora (marcas e v4)', () => {
  for (const pagina of fs.readdirSync(RAIZ).filter(f => f.endsWith('.html'))) {
    const html = fs.readFileSync(path.join(RAIZ, pagina), 'utf8');
    if (!html.includes('fontawesome-free-6.4.0')) continue;
    assert.doesNotMatch(html, /\bfa-brands\b|class="[^"]*\bfab\b/, `${pagina} usa fa-brands: inclua fa-brands-400.woff2`);
    assert.doesNotMatch(html, /class="(?:[^"]* )?fa(?: |")/, `${pagina} usa a classe antiga "fa": inclua fa-v4compatibility.woff2`);
  }
});

test('a conversão de glob do vercel.json pega pasta funda e não atravessa pasta com *', () => {
  assert.ok(globParaRegex('assets/**/*.woff2').test('assets/vendor/x/webfonts/a.woff2'));
  assert.ok(globParaRegex('assets/**/*.css').test('assets/a.css'));
  assert.ok(!globParaRegex('*.css').test('assets/a.css'));
  assert.ok(entraNoDeploy('assets/vendor/fontawesome-free-6.4.0/webfonts/fa-solid-900.woff2'));
});
