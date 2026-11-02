// Folha da aula (regra do Luis, 12/out/2026): toda aula com PDF mostra o cartão de baixar,
// o cartão aponta para um PDF que existe, e a Vercel publica PDF (lista branca de builds).
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const PASTA = path.join(RAIZ, 'assets', 'pdf');
const pdfs = fs.readdirSync(PASTA).filter(f => f.endsWith('-folha.pdf'));

test('existe folha para os cursos em uso (GPS Tronic, Agro, Intermediate, Entrevista, Francês)', () => {
    for (const fam of ['gpstronic_aula', 'agro_aula', 'intermediate_aula', 'interview_aula', 'fr_aula']) {
        const aulas = fs.readdirSync(RAIZ).filter(f => new RegExp(`^${fam}_\\d+\\.html$`).test(f));
        for (const aula of aulas) {
            assert.ok(pdfs.includes(aula.replace('.html', '-folha.pdf')), `${aula} sem folha em PDF`);
        }
    }
});

test('cada folha tem o cartão na própria aula, apontando para o PDF certo', () => {
    for (const pdf of pdfs) {
        const aula = pdf.replace('-folha.pdf', '.html');
        const html = fs.readFileSync(path.join(RAIZ, aula), 'utf8');
        assert.ok(html.includes(`<script src="folha-da-aula.js?v=fa1" data-pdf="assets/pdf/${pdf}"></script>`),
            `${aula} sem o cartão da folha`);
        assert.ok(html.includes('id="tab-homework"'), `${aula} sem Homework para receber o cartão`);
    }
});

test('cada PDF tem uma página só', () => {
    for (const pdf of pdfs) {
        const bin = fs.readFileSync(path.join(PASTA, pdf)).toString('latin1');
        assert.strictEqual((bin.match(/\/Type\s*\/Page[^s]/g) || []).length, 1, `${pdf} passou de 1 página`);
    }
});

test('a página de cada curso lista as folhas logo abaixo de "Todas as aulas"', () => {
    const hubs = { gpstronic_aula: 'classes_gpstronic.html', agro_aula: 'classes_agro.html',
        intermediate_aula: 'classes_intermediate.html', interview_aula: 'classes_interview.html',
        fr_aula: 'classes_fr.html' };
    for (const [fam, hub] of Object.entries(hubs)) {
        const html = fs.readFileSync(path.join(RAIZ, hub), 'utf8');
        const nav = html.indexOf('</nav>', html.indexOf('<!-- SEO:indice-aulas -->'));
        const ini = html.indexOf('<!-- FOLHAS:inicio');
        assert.ok(ini > nav, `${hub}: lista de folhas fora do lugar`);
        const bloco = html.slice(ini, html.indexOf('<!-- FOLHAS:fim -->'));
        for (const pdf of pdfs.filter(p => p.startsWith(fam + '_'))) {
            assert.ok(bloco.includes(`href="assets/pdf/${pdf}"`), `${hub} sem ${pdf}`);
        }
        assert.ok(!/&amp;#|&amp;amp;/.test(bloco), `${hub}: título escapado duas vezes`);
    }
});

test('a Vercel publica assets/**/*.pdf', () => {
    const v = JSON.parse(fs.readFileSync(path.join(RAIZ, 'vercel.json'), 'utf8'));
    assert.ok(v.builds.some(b => b.src === 'assets/**/*.pdf' && b.use === '@vercel/static'));
});

test('o cartão é montado sem innerHTML e só aceita PDF da pasta de folhas', () => {
    const js = fs.readFileSync(path.join(RAIZ, 'folha-da-aula.js'), 'utf8');
    assert.ok(!/innerHTML/.test(js));
    assert.ok(js.includes('^assets\\/pdf\\/[a-z0-9_]+-folha\\.pdf$'));
});

test('o cartão de cada aula aponta para a folha DELA (o gerador não pode herdar a do molde)', () => {
    for (const arq of fs.readdirSync(RAIZ).filter(n => /^[a-z_]*aula_\d+\.html$/.test(n))) {
        const html = fs.readFileSync(path.join(RAIZ, arq), 'utf8');
        const tags = html.match(/<script src="folha-da-aula\.js[^>]*>/g) || [];
        assert.ok(tags.length <= 1, `${arq}: cartão da folha repetido`);
        if (!tags.length) continue;
        const pdf = (tags[0].match(/data-pdf="([^"]+)"/) || [])[1];
        assert.equal(pdf, `assets/pdf/${arq.replace(/\.html$/, '')}-folha.pdf`, arq);
    }
});
