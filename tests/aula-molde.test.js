// Padrão das aulas de 12/nov/2026 (pedido do Luis):
// - Listening com no máximo 15 áudios (listening-lab.js);
// - Key Expressions em slides (aula-molde.js + o motor do gramatica-slides.js);
// - "How do you say it in English?" e texto com lacunas (aula-molde.js), que nascem
//   nas aulas refeitas no molde novo (Intermediate 19 e 20, build-intermediate-aula.mjs).
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RAIZ = path.join(__dirname, '..');
const ler = f => fs.readFileSync(path.join(RAIZ, f), 'utf8');

function carregarPuras({ comFala }) {
    const ctx = { globalThis: null };
    ctx.globalThis = ctx;
    vm.createContext(ctx);
    if (comFala) {
        const comp = ler('components.js');
        const i = comp.indexOf('window.CapyFala = (function () {');
        const j = comp.indexOf('// Auto-inject personalized tab', i);
        assert.ok(i > 0 && j > i, 'achei o CapyFala no components.js');
        vm.runInContext('var window = globalThis;\n' + comp.slice(i, j), ctx);
    }
    vm.runInContext(ler('aula-molde.js'), ctx);
    return ctx.CapyAula.puras;
}

for (const comFala of [true, false]) {
    test(`tradução: tolerante a contração, pontuação e variação aceita (${comFala ? 'com' : 'sem'} CapyFala)`, () => {
        const p = carregarPuras({ comFala });
        const alvos = ["I'm going to sign up for the course tomorrow.", 'I will sign up for the course tomorrow.'];
        assert.equal(p.conferirTraducao('I am going to sign up for the course tomorrow', alvos).ok, true);
        assert.equal(p.conferirTraducao('i will sign up for the course tomorrow!!', alvos).ok, true);
        assert.equal(p.conferirTraducao("We're about to leave", ["We're about to leave."]).ok, true);
        const errada = p.conferirTraducao('The prazo is friday', ['The deadline is next Friday.']);
        assert.equal(errada.ok, false);
        assert.deepEqual(errada.faltando, ['deadline', 'next']);
        assert.equal(p.conferirTraducao('', ['The deadline is next Friday.']).ok, false, 'resposta vazia não passa');
        // Quem cola a frase certa no meio de um monte de palavras não passa.
        assert.equal(p.conferirTraducao('the deadline is next friday and also many other random words here', ['The deadline is next Friday.']).ok, false);
    });
}

test('tradução: número em algarismo vale o mesmo que por extenso (com CapyFala)', () => {
    const p = carregarPuras({ comFala: true });
    assert.equal(p.conferirTraducao("I'm meeting my boss at 3. It's all arranged.", ["I'm meeting my boss at three. It's all arranged."]).ok, true);
});

test('lacunas: o texto vira partes e a conferência marca cada lacuna', () => {
    const p = carregarPuras({ comFala: false });
    const partes = p.partesDoTexto('She [[used to]] feel [[invisible]].');
    assert.deepEqual(partes, [{ t: 'She ' }, { lacuna: 'used to' }, { t: ' feel ' }, { lacuna: 'invisible' }, { t: '.' }]);
    const r = p.conferirLacunas(['used to', 'visible'], ['used to', 'invisible']);
    assert.deepEqual(r.marcas, [true, false]);
    assert.equal(r.acertos, 1);
    assert.equal(p.semTags('<strong>oi</strong>'), '<strong>oi</strong>', 'sem DOMParser no Node, o texto passa como está');
});

test('aula-molde.js: nada de dado da aula em innerHTML, nem eval (o CSP das aulas não tem unsafe-eval)', () => {
    const js = ler('aula-molde.js');
    assert.ok(!/innerHTML/.test(js));
    assert.ok(!/\beval\s*\(|new Function/.test(js));
});

test('listening-lab.js: no máximo 15 áudios, Speak primeiro e as falas extras por último', () => {
    const js = ler('listening-lab.js');
    assert.match(js, /const MAX_ITENS = 15;/);
    assert.match(js, /if \(saida\.length >= MAX_ITENS\) break;/);
    assert.ok(js.indexOf('filter(f => !f.hidden)') < js.indexOf('filter(f => f.hidden)'), 'principais antes das extras');
    new Function(js);
});

test('gramatica-slides.js: um motor para vários decks (Patterns e Key Expressions)', () => {
    const js = ler('gramatica-slides.js');
    new Function(js);
    assert.match(js, /window\.CapySlides = \{ montar \}/);
    assert.match(js, /opts\.aoUltimo/);
    assert.match(js, /window\.CapyGramaticaSlides = api/, 'o deck de Patterns continua exposto como antes');
});

const MOLDE = html => html.includes('id="expr-grid"') && html.includes('id="rota-indice-lista"') && html.includes('proximoPasso()');
const aulasDoMolde = fs.readdirSync(RAIZ).filter(n => n.endsWith('.html')).filter(n => MOLDE(ler(n)));

test('toda aula do molde carrega o aula-molde.js uma vez, antes do cartão da folha', () => {
    assert.ok(aulasDoMolde.length >= 50, `aulas do molde: ${aulasDoMolde.length}`);
    for (const arq of aulasDoMolde) {
        const html = ler(arq);
        const tags = html.match(/<script src="aula-molde\.js\?v=am1"><\/script>/g) || [];
        assert.equal(tags.length, 1, arq);
        const folha = html.indexOf('folha-da-aula.js');
        if (folha >= 0) assert.ok(html.indexOf('aula-molde.js') < folha, arq + ': aula-molde antes da folha');
    }
});

test('a versão do gramatica-slides.js é a mesma em todas as páginas', () => {
    for (const arq of fs.readdirSync(RAIZ).filter(n => n.endsWith('.html'))) {
        const vs = [...ler(arq).matchAll(/gramatica-slides\.js\?v=(\w+)/g)].map(m => m[1]);
        assert.ok(vs.every(v => v === 'gs2'), arq + ': ' + vs.join(','));
    }
});

for (const nn of ['19', '20', '21', '22', '23', '24', '25', '26', '27', '28']) {
    test(`intermediate_aula_${nn}: molde novo com as seções de 12/nov`, () => {
        const html = ler(`intermediate_aula_${nn}.html`);
        assert.equal((html.match(/id="tab-/g) || []).length, 11);
        assert.ok(html.includes('id="trad-area"') && html.includes('id="lacunas-area"'));
        assert.match(html, /\{id:'traducao'/);
        assert.match(html, /\{id:'lacunas'/);
        assert.match(html, /const TRAD_DATA=\[/);
        assert.match(html, /const LACUNAS_DATA=\{/);
        assert.ok(html.includes('capyIntermediateCompleted') && html.includes(`arr.push(${Number(nn)})`), 'grava a conclusão do curso');
        assert.ok(!/gpstronic|GPS Tronic|\bemerald-/.test(html), 'sem resíduo do molde do GPS');
        const visivel = html.replace(/<!--[\s\S]*?-->/g, '').replace(/tab-grammar|'grammar'|"grammar"|assets\/img\/gramatica\/|gramatica-slides\.js/g, '');
        assert.ok(!/gram[aá]tic|grammar/i.test(visivel), 'sem a palavra proibida');
        for (const m of html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)) new Function(m[1]);
    });
}

test('a aula 20 mantém a frase da Sofia que a revisão usa e leva para a 21', () => {
    const html = ler('intermediate_aula_20.html');
    assert.ok(html.includes('Five years ago, Sofia [[used to]] feel invisible'));
    assert.ok(html.includes('href="intermediate_aula_21.html"'));
});

test('o curso fecha na aula 28: cartão da revisão e da prova, e a página do curso com as 28', () => {
    const html = ler('intermediate_aula_28.html');
    assert.ok(html.includes('href="intermediate_revisao.html"') && html.includes('href="intermediate_prova.html"'));
    const hub = ler('classes_intermediate.html');
    for (let n = 1; n <= 28; n++) assert.ok(hub.includes(`href:'intermediate_aula_${String(n).padStart(2, '0')}.html'`) || hub.includes(`href:'intermediate_aula_${n}.html'`), `aula ${n} na lista`);
    assert.ok(!/\b20 aulas\b|All 20 Lessons/.test(hub));
    for (const f of ['intermediate_revisao.html', 'intermediate_prova.html']) assert.ok(ler(f).includes('href="intermediate_aula_28.html"'), f);
});
