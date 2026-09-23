/**
 * gera-retrato-recrutador.js — recorta o retrato do recrutador de uma das
 * ilustrações do curso de entrevista e salva um 16:9 limpo na raiz.
 *
 * Por que: o palco da `entrevista.html` mostra esse retrato, e o clipe animado
 * do recrutador usa a MESMA moldura como quadro inicial. Gerar o recorte aqui
 * custa zero crédito — nenhuma imagem-base precisa sair do Higgsfield.
 *
 * A origem padrão é a `interview03`, não a `interview01`: as duas têm o mesmo
 * recrutador na mesma moldura de videochamada, mas na 01 ele está **acenando**,
 * que é pose de cumprimento e não de quem está falando no meio da entrevista.
 *
 * O recorte é a tela do notebook dentro da ilustração de 1200x800. O canvas
 * corta a altura para fechar 16:9 exato (o que o Kling aceita) e o ALINHAMENTO
 * decide onde esse corte tira mais: 0 = rente ao topo, 0.5 = centrado.
 *
 * O nome carrega versão pelo mesmo motivo do `yara-poster-v1.jpg`: o `sw.js` faz
 * cache-first de `.jpg`, então recortar diferente pede `-v2`, nunca o mesmo nome.
 *
 * Usa o Playwright que já está no package.json. Nenhuma dependência nova.
 *
 *   node scripts/gera-retrato-recrutador.js
 *   node scripts/gera-retrato-recrutador.js --origem=interview01 --x=393 --y=222 --w=408 --h=273 --alinhamento=0.5
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const RAIZ = path.join(__dirname, '..');
const arg = (nome, padrao) => {
    const achado = process.argv.slice(2).find(a => a.startsWith('--' + nome + '='));
    return achado === undefined ? padrao : achado.split('=')[1];
};

const ORIGEM = path.join(RAIZ, 'assets/img/' + arg('origem', 'interview03') + '-dialogue.jpg');
const DESTINO = path.join(RAIZ, arg('destino', 'recrutador-retrato-v1.jpg'));
// Tela do notebook na ilustração de 1200x800 (medida a olho, conferida na imagem).
const TELA = {
    x: Number(arg('x', 390)), y: Number(arg('y', 230)),
    w: Number(arg('w', 416)), h: Number(arg('h', 265)),
};
const ALINHAMENTO = Number(arg('alinhamento', 0.34));
const LARG = 1280, ALT = 720, QUALIDADE = 0.9;

(async () => {
    const b64 = fs.readFileSync(ORIGEM).toString('base64');
    const navegador = await chromium.launch();
    try {
        const pagina = await navegador.newPage();
        const saida = await pagina.evaluate(async ({ b64, TELA, ALINHAMENTO, LARG, ALT, QUALIDADE }) => {
            const img = new Image();
            await new Promise((ok, falha) => {
                img.onload = ok;
                img.onerror = () => falha(new Error('a ilustração de origem não decodificou'));
                img.src = 'data:image/jpeg;base64,' + b64;
            });
            // A região medida é ~1.57:1 e o alvo é 1.778:1, então sobra altura.
            // ALINHAMENTO < 0.5 tira mais de baixo (camisa) e menos de cima (cabeça).
            let { x, y, w, h } = TELA;
            const hIdeal = w / (LARG / ALT);
            y += (h - hIdeal) * ALINHAMENTO;
            h = hIdeal;
            const c = document.createElement('canvas');
            c.width = LARG; c.height = ALT;
            const ctx = c.getContext('2d');
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, x, y, w, h, 0, 0, LARG, ALT);
            return {
                dados: c.toDataURL('image/jpeg', QUALIDADE),
                origem: [img.naturalWidth, img.naturalHeight],
                regiao: [Math.round(x), Math.round(y), Math.round(w), Math.round(h)],
            };
        }, { b64, TELA, ALINHAMENTO, LARG, ALT, QUALIDADE });

        const bytes = Buffer.from(saida.dados.split(',')[1], 'base64');
        fs.writeFileSync(DESTINO, bytes);
        console.log('origem  ' + path.basename(ORIGEM) + '  ' + saida.origem.join('x') + '  ' + Math.round(fs.statSync(ORIGEM).size / 1024) + ' KB');
        console.log('regiao  x=' + saida.regiao[0] + ' y=' + saida.regiao[1] + ' w=' + saida.regiao[2] + ' h=' + saida.regiao[3] + '  (alinhamento ' + ALINHAMENTO + ')');
        console.log('retrato ' + LARG + 'x' + ALT + '  ' + Math.round(bytes.length / 1024) + ' KB  -> ' + path.relative(RAIZ, DESTINO));
    } finally {
        await navegador.close();
    }
})().catch(e => { console.error('FALHOU:', e.message); process.exit(1); });
