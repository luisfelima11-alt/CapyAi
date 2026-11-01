// Barra de passos/abas das aulas atrás do menu fixo (corrigido em 01/nov/2026).
// O menu do topo (#top-nav-bar) é fixed, z-50, ~63 px e fica sempre visível
// (o script de auto-esconder dele mora dentro do innerHTML e nunca roda). Toda
// barra "sticky top-0" grudava ATRÁS dele: ao rolar, as setas ‹ › e as abas
// sumiam. O Components.mount do menu agora empurra essas barras para baixo dele,
// e quem rola até uma seção desconta a altura do menu também.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const comp = fs.readFileSync(path.join(RAIZ, 'components.js'), 'utf8');
const paginas = fs.readdirSync(RAIZ).filter(f => f.endsWith('.html'));

test('montar o menu do topo posiciona as barras sticky embaixo dele', () => {
    const mount = comp.slice(comp.indexOf('    mount(containerId, html) {'), comp.indexOf('    posicionarStickies() {'));
    assert.ok(/top-nav-placeholder[\s\S]*this\.posicionarStickies\(\)/.test(mount), 'mount do top-nav não chama posicionarStickies');
    const fn = comp.slice(comp.indexOf('    posicionarStickies() {'));
    assert.ok(fn.includes("querySelectorAll('.sticky.top-0')"));
    assert.ok(fn.includes('el.style.top'), 'tem que ser pelo CSSOM (a CSP estrita bloqueia <style> novo)');
    assert.ok(fn.includes("addEventListener('resize'"));
});

test('quem rola até a seção desconta a barra E o menu do topo', () => {
    for (const arq of paginas) {
        const html = fs.readFileSync(path.join(RAIZ, arq), 'utf8');
        if (!html.includes('window.scrollY-76')) continue;
        assert.ok(html.includes("window.scrollY-76-((document.getElementById('top-nav-bar')||{}).offsetHeight||0)"),
            `${arq}: o scroll até a seção não desconta o menu do topo`);
    }
});

test('todas as páginas pedem a mesma versão do components.js (cache)', () => {
    const versoes = new Set();
    for (const arq of paginas) {
        for (const m of fs.readFileSync(path.join(RAIZ, arq), 'utf8').matchAll(/components\.js\?v=([a-z0-9]+)/g)) versoes.add(m[1]);
    }
    assert.equal(versoes.size, 1, `versões misturadas: ${[...versoes].join(', ')}`);
});
