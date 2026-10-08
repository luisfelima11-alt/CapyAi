'use strict';

// A aba Grammar das aulas dos cursos em slides de exemplos (regra do Luis,
// 05/out/2026): um padrão por slide, 5 frases ou mais com tradução e áudio, o
// título é só o padrão, e o deck fecha com uma revisão de frases novas. Cada
// slide tem uma imagem gerada e abre em tela cheia, como o vocabulário.
// O módulo é ESM (scripts/lib/gramatica-slides.mjs), por isso o import dinâmico.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const ROOT = path.resolve(__dirname, '..');
const modulo = () => import(pathToFileURL(path.join(ROOT, 'scripts/lib/gramatica-slides.mjs')).href);

const frases = (n, base = 'I **am** here') => Array.from({ length: n }, (_, i) => ({ en: `${base} ${i}.`, pt: `Eu estou aqui ${i}.` }));
const aula = (mudar = g => g) => ({ gramatica: mudar({
  titulo: 'Grammar: o verbo TO BE',
  personagens: { LUAN: 'a young man (green shirt)' },
  cenaAbertura: '{LUAN} waves hello in a workshop.',
  slides: [
    { padrao: 'I **am**', cena: '{LUAN} points at himself.', frases: frases(5) },
    { padrao: 'you **are**', cena: 'A farmer points at a friend.', frases: frases(5, 'You **are** here') },
    { padrao: 'he **is**', cena: 'Two people look at a tractor.', frases: frases(5, 'He **is** here') },
  ],
  revisao: [0, 1, 2].map(i => ({ padrao: i, en: `It **is** new ${i}.`, pt: `É novo ${i}.` })),
  cenaRevisao: '{LUAN} walks into a field at sunset.',
}) });

function falhas(c, opcoes) {
  return modulo().then(({ checarSlides }) => {
    const r = [];
    checarSlides(c, (ok, msg) => { if (!ok) r.push(msg); }, opcoes);
    return r;
  });
}

// Uma pasta temporária com as imagens de um deck de 5 slides.
function pastaComImagens(slug, total, { pular = -1, pesada = -1 } = {}) {
  const raiz = fs.mkdtempSync(path.join(os.tmpdir(), 'gs-'));
  fs.mkdirSync(path.join(raiz, 'assets/img/gramatica'), { recursive: true });
  for (let k = 0; k < total; k++) {
    if (k === pular) continue;
    fs.writeFileSync(path.join(raiz, `assets/img/gramatica/${slug}-${k}.webp`), Buffer.alloc(k === pesada ? 201 * 1024 : 1024));
  }
  return raiz;
}

test('the deck renders the opening, one slide per pattern and the review, with text escaped and audio in plain text', async () => {
  const { blocoGramaticaSlides } = await modulo();
  const c = aula(g => ({ ...g, slides: [{ padrao: 'Tom & <Jerry> **are**', cena: 'x', frases: [
    { en: 'Say "<b>hi</b>" — I\'m **here**.', pt: 'Diga <oi>.' }, ...frases(4)] }, ...g.slides.slice(1)] }));
  const html = blocoGramaticaSlides(c, { slug: 'teste01' });
  assert.equal((html.match(/class="gs-slide/g) || []).length, 3 + 2);
  assert.match(html, /^<div id="tab-grammar" class="tab-content fade-in hidden">/);
  assert.equal((html.match(/<section class="gs-slide[^>]*hidden>/g) || []).length, 4, 'only the first slide starts visible');
  assert.match(html, /Tom &amp; &lt;Jerry&gt; <strong class="text-emerald-300">are<\/strong>/);
  assert.match(html, /Say &quot;&lt;b&gt;hi&lt;\/b&gt;&quot; — I'm <strong class="text-emerald-600">here<\/strong>\./);
  assert.match(html, /data-say="Say &quot;&lt;b&gt;hi&lt;\/b&gt;&quot; — I'm here\."/, 'audio reads the sentence without the asterisks');
  assert.match(html, /<p class="gs-pt text-slate-500 text-sm mt-0\.5">Diga &lt;oi&gt;\.<\/p>/);
  assert.doesNotMatch(html, /<b>hi<\/b>|<Jerry>/);
  assert.match(html, /id="gs-xp"[^>]*disabled/, 'the +20 XP waits for the last slide');
});

test('every slide carries its image and a fullscreen button, and the behaviour comes from gramatica-slides.js', async () => {
  const { blocoGramaticaSlides, VERSAO_JS } = await modulo();
  const html = blocoGramaticaSlides(aula(), { slug: 'agro09' });
  const imgs = html.match(/<img class="gs-img[^>]*>/g) || [];
  assert.equal(imgs.length, 5, 'one image per slide');
  imgs.forEach((tag, k) => {
    assert.match(tag, new RegExp(`src="assets/img/gramatica/agro09-${k}\\.webp"`));
    assert.match(tag, /alt=""/);
    assert.match(tag, /loading="lazy"/);
    assert.match(tag, /width="1024" height="768"/, 'the page keeps the space before the image loads');
  });
  assert.equal((html.match(/class="gs-expandir/g) || []).length, 5, 'one fullscreen button per slide');
  assert.match(html, new RegExp(`<script src="gramatica-slides\\.js\\?v=${VERSAO_JS}"></script>`));
  assert.doesNotMatch(html, /<script>/, 'no inline script left in the tab');
  assert.throws(() => blocoGramaticaSlides(aula()), /slug/, 'without the slug there is no image name');
});

test('the validator takes a good deck and refuses short patterns, missing parts, long sentences and old accordions', async () => {
  assert.deepEqual(await falhas(aula()), []);
  const msg = async m => (await falhas(aula(m))).join(' | ');
  assert.match(await msg(g => ({ ...g, slides: [{ ...g.slides[0], frases: frases(4) }, ...g.slides.slice(1)] })), /5 frases ou mais/);
  assert.match(await msg(g => ({ ...g, revisao: [...g.revisao.slice(0, 2), { padrao: 2, en: 'It **is** ok.', pt: '' }] })), /inglês e tradução/);
  assert.match(await msg(g => ({ ...g, revisao: [...g.revisao.slice(0, 2), { padrao: 2, en: 'It is ok.', pt: 'Ok.' }] })), /destaca a parte do padrão/);
  assert.match(await msg(g => ({ ...g, revisao: g.revisao.slice(0, 2) })), /revisão com uma frase de cada padrão/);
  assert.match(await msg(g => ({ ...g, revisao: [...g.revisao.slice(0, 2), { padrao: 2, en: 'I **am** here 0.', pt: 'x' }] })), /frases novas/);
  assert.match(await msg(g => ({ ...g, blocos: [] })), /acordeão antigo/);
  assert.match(await msg(g => ({ ...g, slides: [{ ...g.slides[0], padrao: '❌ I **is**' }, ...g.slides.slice(1)] })), /só o padrão/);
  assert.match(await msg(g => ({ titulo: g.titulo, blocos: [], tabela: {} })), /gramática em slides/);
  const longa = (await falhas(aula(g => ({ ...g, slides: [{ ...g.slides[0], frases: [...frases(4), { en: 'I **am** here with my very good friends from the farm today.', pt: 'x' }] }, ...g.slides.slice(1)] })), { teto: 10 })).join(' | ');
  assert.match(longa, /até 10 palavras/);
});

test('the validator asks for a scene per slide, known characters and the image files', async () => {
  const msg = async (m, o) => (await falhas(aula(m), o)).join(' | ');
  assert.match(await msg(g => ({ ...g, slides: [{ ...g.slides[0], cena: ' ' }, ...g.slides.slice(1)] })), /cena da imagem.*slides 1\b/);
  assert.match(await msg(g => ({ ...g, cenaRevisao: undefined })), /cena da imagem.*slides 4\b/);
  assert.match(await msg(g => ({ ...g, cenaAbertura: '{JACK} waves.' })), /\{JACK\}/);

  const ok = pastaComImagens('agro09', 5);
  assert.deepEqual(await falhas(aula(), { slug: 'agro09', raiz: ok }), []);
  assert.match(await msg(g => g, { slug: 'agro09', raiz: pastaComImagens('agro09', 5, { pular: 3 }) }), /imagem de cada slide existe.*agro09-3\.webp/);
  assert.match(await msg(g => g, { slug: 'agro09', raiz: pastaComImagens('agro09', 5, { pesada: 2 }) }), /até 200 KB.*agro09-2\.webp/);
});

test('the image prompt joins the shared style, the scene and the full character description', async () => {
  const { promptDaImagem, cenasDoDeck, ESTILO_IMAGEM } = await modulo();
  const g = aula().gramatica;
  const prompts = cenasDoDeck(g).map(c => promptDaImagem(g, c));
  assert.equal(prompts.length, 5);
  for (const p of prompts) {
    assert.ok(p.startsWith(ESTILO_IMAGEM.antes) && p.endsWith(ESTILO_IMAGEM.depois));
    assert.match(p, /No text, no letters/);
    assert.doesNotMatch(p, /\{[A-Z]/);
  }
  assert.match(prompts[0], /shading\. A young man \(green shirt\) waves hello/, 'the character description replaces {LUAN}, starting the sentence in capitals');
});

test('every converted lesson passes the validator, has its images and ships the deck it describes', async () => {
  const { checarSlides, VERSAO_JS, MAX_KB_IMAGEM } = await modulo();
  const fontes = fs.readdirSync(path.join(ROOT, 'scripts'))
    .filter(f => /^(aula|agro|med|interview)\d+-conteudo\.json$/.test(f))
    .map(f => ({ f, c: JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts', f), 'utf8')) }))
    .filter(({ c }) => c.gramatica && c.gramatica.slides);
  assert.ok(fontes.length >= 2, 'the pilot lessons are converted');
  const pagina = f => {
    const [, curso, n] = f.match(/^([a-z]+)(\d+)/);
    return {
      slug: `${curso === 'aula' ? 'gps' : curso}${n}`,
      arquivo: { aula: `gpstronic_aula_${n}.html`, agro: `agro_aula_${n}.html` }[curso] || null,
    };
  };
  for (const { f, c } of fontes) {
    const { slug, arquivo } = pagina(f);
    const erros = [];
    checarSlides(c, (ok, m) => { if (!ok) erros.push(m); }, { teto: c.tetoPalavras || 14, slug, raiz: ROOT });
    assert.deepEqual(erros, [], f);
    if (!arquivo) continue;
    const html = fs.readFileSync(path.join(ROOT, arquivo), 'utf8');
    const aba = html.slice(html.indexOf('<div id="tab-grammar"'), html.indexOf('<!-- CONVERSATION'));
    const total = c.gramatica.slides.length + 2;
    assert.equal((aba.match(/class="gs-slide/g) || []).length, total, arquivo);
    assert.equal((aba.match(/<img class="gs-img/g) || []).length, total, arquivo + ': one image per slide');
    for (let k = 0; k < total; k++) {
      const img = path.join(ROOT, `assets/img/gramatica/${slug}-${k}.webp`);
      assert.ok(aba.includes(`src="assets/img/gramatica/${slug}-${k}.webp"`), `${arquivo}: slide ${k} points to its image`);
      const cabeca = fs.readFileSync(img).subarray(0, 12);
      assert.ok(cabeca.subarray(0, 4).toString() === 'RIFF' && cabeca.subarray(8, 12).toString() === 'WEBP', `${slug}-${k}: a real WebP`);
      assert.ok(fs.statSync(img).size <= MAX_KB_IMAGEM * 1024, `${slug}-${k}: up to ${MAX_KB_IMAGEM} KB`);
    }
    const nFrases = c.gramatica.slides.reduce((n, s) => n + s.frases.length, 0) + c.gramatica.revisao.length;
    assert.equal((aba.match(/data-say=/g) || []).length, nFrases, arquivo + ': one audio button per sentence');
    assert.ok(aba.includes(`<script src="gramatica-slides.js?v=${VERSAO_JS}"></script>`), arquivo + ': loads the deck script');
    assert.doesNotMatch(aba, /toggleAccordion/, arquivo + ': no accordion left');
  }
});

test('gramatica-slides.js parses, drives the deck and builds the fullscreen view', () => {
  const codigo = fs.readFileSync(path.join(ROOT, 'gramatica-slides.js'), 'utf8');
  assert.doesNotThrow(() => new Function(codigo));
  assert.match(codigo, /gs-foco/, 'the fullscreen overlay');
  assert.match(codigo, /gs-revelado/, 'the translation stays hidden until revealed');
  assert.match(codigo, /Date\.now\(\) - abertoEm < 400/, 'the ghost-click guard from vocab-focus.js');
  // A tela cheia clona o slide; o único innerHTML é o esqueleto fixo do overlay.
  assert.doesNotMatch(codigo, /innerHTML\s*=\s*(?=\S)(?![`'"])/, 'no HTML built from page text');
  assert.doesNotMatch(codigo, /innerHTML\s*=\s*`[^`]*\$\{/, 'no interpolation in the overlay markup');
});
