/**
 * otimiza-dialogo-img.js — converte as imagens de diálogo do PNG cru da OpenAI
 * para JPEG web, e guarda o master fora da pasta que é deployada.
 *
 * Medido em interview03 (1536x1024):
 *   PNG original ............ 2668KB
 *   PNG 1200 reencodado ..... 2044KB   ← a textura granulada mata o PNG
 *   JPEG 1200 q92 ...........  229KB   ← escolhido
 *   JPEG 1200 q85 ...........  153KB
 *
 * Usa o Playwright que já está no package.json — nenhuma dependência nova.
 * O master PNG vai para scripts/masters/, que NÃO casa com nenhum padrão do
 * `builds` do vercel.json e portanto nunca é servido.
 *
 *   node scripts/otimiza-dialogo-img.js
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const RAIZ = path.join(__dirname, '..');
const LARGURA = 1200;
const QUALIDADE = 0.92;

(async () => {
    const dir = path.join(RAIZ, 'assets/img');
    const alvos = fs.readdirSync(dir)
        .filter(f => /-dialogue\.png$/.test(f))
        .filter(f => f !== 'gps09-dialogue.png')   // já está no ar em 1200x800/372KB — não mexer
        .sort();
    if (!alvos.length) { console.log('nada a converter'); return; }

    const masters = path.join(RAIZ, 'scripts/masters');
    fs.mkdirSync(masters, { recursive: true });

    const b = await chromium.launch();
    const p = await b.newPage();

    for (const f of alvos) {
        const src = path.join(dir, f);
        const destino = src.replace(/\.png$/, '.jpg');
        const antes = fs.statSync(src).size;

        const dataUrl = await p.evaluate(async ({ d, w, q }) => {
            const img = new Image();
            img.src = 'data:image/png;base64,' + d;
            await img.decode();
            const h = Math.round(img.height * w / img.width);
            const c = document.createElement('canvas');
            c.width = w; c.height = h;
            const x = c.getContext('2d');
            x.imageSmoothingQuality = 'high';
            x.drawImage(img, 0, 0, w, h);
            return c.toDataURL('image/jpeg', q);
        }, { d: fs.readFileSync(src).toString('base64'), w: LARGURA, q: QUALIDADE });

        fs.writeFileSync(destino, Buffer.from(dataUrl.split(',')[1], 'base64'));
        fs.renameSync(src, path.join(masters, f));
        const depois = fs.statSync(destino).size;
        console.log(`  ✓ ${f.replace('.png', '.jpg').padEnd(28)} ${(antes / 1024).toFixed(0)}KB → ${(depois / 1024).toFixed(0)}KB  (master em scripts/masters/)`);
    }
    await b.close();
})();
