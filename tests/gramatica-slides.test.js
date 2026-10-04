'use strict';

// A aba Grammar das aulas dos cursos em slides de exemplos (regra do Luis,
// 05/out/2026): um padrão por slide, 5 frases ou mais com tradução e áudio, o
// título é só o padrão, e o deck fecha com uma revisão de frases novas.
// O módulo é ESM (scripts/lib/gramatica-slides.mjs), por isso o import dinâmico.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const ROOT = path.resolve(__dirname, '..');
const modulo = () => import(pathToFileURL(path.join(ROOT, 'scripts/lib/gramatica-slides.mjs')).href);

const frases = (n, base = 'I **am** here') => Array.from({ length: n }, (_, i) => ({ en: `${base} ${i}.`, pt: `Eu estou aqui ${i}.` }));
const aula = (mudar = g => g) => ({ gramatica: mudar({
  titulo: 'Grammar: o verbo TO BE',
  slides: [
    { padrao: 'I **am**', frases: frases(5) },
    { padrao: 'you **are**', frases: frases(5, 'You **are** here') },
    { padrao: 'he **is**', frases: frases(5, 'He **is** here') },
  ],
  revisao: [0, 1, 2].map(i => ({ padrao: i, en: `It **is** new ${i}.`, pt: `É novo ${i}.` })),
}) });

function falhas(c, opcoes) {
  return modulo().then(({ checarSlides }) => {
    const r = [];
    checarSlides(c, (ok, msg) => { if (!ok) r.push(msg); }, opcoes);
    return r;
  });
}

test('the deck renders the opening, one slide per pattern and the review, with text escaped and audio in plain text', async () => {
  const { blocoGramaticaSlides } = await modulo();
  const c = aula(g => ({ ...g, slides: [{ padrao: 'Tom & <Jerry> **are**', frases: [
    { en: 'Say "<b>hi</b>" — I\'m **here**.', pt: 'Diga <oi>.' }, ...frases(4)] }, ...g.slides.slice(1)] }));
  const html = blocoGramaticaSlides(c);
  assert.equal((html.match(/class="gs-slide/g) || []).length, 3 + 2);
  assert.match(html, /^<div id="tab-grammar" class="tab-content fade-in hidden">/);
  assert.equal((html.match(/<section class="gs-slide[^>]*hidden>/g) || []).length, 4, 'only the first slide starts visible');
  assert.match(html, /Tom &amp; &lt;Jerry&gt; <strong class="text-emerald-300">are<\/strong>/);
  assert.match(html, /Say &quot;&lt;b&gt;hi&lt;\/b&gt;&quot; — I'm <strong class="text-emerald-600">here<\/strong>\./);
  assert.match(html, /data-say="Say &quot;&lt;b&gt;hi&lt;\/b&gt;&quot; — I'm here\."/, 'audio reads the sentence without the asterisks');
  assert.match(html, /<p class="text-slate-500 text-sm mt-0\.5">Diga &lt;oi&gt;\.<\/p>/);
  assert.doesNotMatch(html, /<b>hi<\/b>|<Jerry>/);
  assert.match(html, /id="gs-xp"[^>]*disabled/, 'the +20 XP waits for the last slide');
  const script = html.slice(html.indexOf('<script>') + 8, html.indexOf('</script>'));
  assert.doesNotThrow(() => new Function(script));
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

test('every converted lesson passes the validator and ships the deck it describes', async () => {
  const { checarSlides } = await modulo();
  const fontes = fs.readdirSync(path.join(ROOT, 'scripts'))
    .filter(f => /^(aula|agro|med|interview)\d+-conteudo\.json$/.test(f))
    .map(f => ({ f, c: JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts', f), 'utf8')) }))
    .filter(({ c }) => c.gramatica && c.gramatica.slides);
  assert.ok(fontes.length >= 2, 'the pilot lessons are converted');
  const pagina = f => {
    const n = f.match(/\d+/)[0];
    if (f.startsWith('agro')) return `agro_aula_${n}.html`;
    if (f.startsWith('aula')) return `gpstronic_aula_${n}.html`;
    return null;
  };
  for (const { f, c } of fontes) {
    const erros = [];
    checarSlides(c, (ok, m) => { if (!ok) erros.push(m); }, { teto: c.tetoPalavras || 14 });
    assert.deepEqual(erros, [], f);
    const arquivo = pagina(f);
    if (!arquivo) continue;
    const html = fs.readFileSync(path.join(ROOT, arquivo), 'utf8');
    const aba = html.slice(html.indexOf('<div id="tab-grammar"'), html.indexOf('<!-- CONVERSATION'));
    assert.equal((aba.match(/class="gs-slide/g) || []).length, c.gramatica.slides.length + 2, arquivo);
    const total = c.gramatica.slides.reduce((n, s) => n + s.frases.length, 0) + c.gramatica.revisao.length;
    assert.equal((aba.match(/data-say=/g) || []).length, total, arquivo + ': one audio button per sentence');
    assert.doesNotMatch(aba, /toggleAccordion/, arquivo + ': no accordion left');
  }
});
