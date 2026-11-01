// Botão "Tela cheia" para dar aula (pedido do Luis, 01/nov/2026): só nos cursos
// GPS Tronic e Agro English, uma vez por aula, e o molde dos geradores
// (gpstronic_aula_09.html) também tem, para as próximas aulas nascerem com ele.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const TAG = '<script src="tela-cheia.js?v=tc1"></script>';
const paginas = fs.readdirSync(RAIZ).filter(f => /\.html$/.test(f));
const contar = arq => fs.readFileSync(path.join(RAIZ, arq), 'utf8').split('tela-cheia.js').length - 1;

test('toda aula do GPS Tronic e do Agro carrega o botão uma vez', () => {
    const aulas = paginas.filter(f => /^(gpstronic|agro)_aula_\d+\.html$/.test(f));
    assert.ok(aulas.length >= 32, `achei só ${aulas.length} aulas`);
    for (const arq of aulas) {
        const html = fs.readFileSync(path.join(RAIZ, arq), 'utf8');
        assert.equal(contar(arq), 1, `${arq}: tela-cheia.js deve aparecer uma vez`);
        assert.ok(html.includes(TAG), `${arq}: tag diferente da esperada`);
    }
});

test('nenhuma outra página tem o botão (o Luis pediu só GPS Tronic e Agro)', () => {
    for (const arq of paginas.filter(f => !/^(gpstronic|agro)_aula_\d+\.html$/.test(f))) {
        assert.equal(contar(arq), 0, `${arq} não deveria carregar tela-cheia.js`);
    }
});

test('os dois geradores usam o molde que já tem o botão', () => {
    const molde = fs.readFileSync(path.join(RAIZ, 'gpstronic_aula_09.html'), 'utf8');
    assert.ok(molde.includes(TAG));
    for (const g of ['build-gpstronic-aula.mjs', 'build-agro-aula.mjs']) {
        const js = fs.readFileSync(path.join(RAIZ, 'scripts', g), 'utf8');
        assert.ok(js.includes("'gpstronic_aula_09.html'"), `${g} mudou de molde: confira se o botão continua`);
    }
});

test('o script monta o botão sem innerHTML e some sem a API de tela cheia', () => {
    const js = fs.readFileSync(path.join(RAIZ, 'tela-cheia.js'), 'utf8');
    assert.ok(!/innerHTML/.test(js));
    assert.ok(js.includes('fullscreenEnabled') && js.includes('webkitFullscreenEnabled'));
    assert.ok(js.includes('fullscreenchange'));
    assert.doesNotThrow(() => new Function(js));
});
