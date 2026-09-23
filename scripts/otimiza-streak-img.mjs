#!/usr/bin/env node
// ════════════════════════════════════════════════════════════════════════════
// otimiza-streak-img.mjs — encolhe a arte do overlay de streak
// ════════════════════════════════════════════════════════════════════════════
//
//   node scripts/otimiza-streak-img.mjs
//
// Por que existe: `yara-streak.png` tinha 2048x2048 e 8MB, mas o cartão do
// overlay mostra a imagem com no máximo 380px de largura
// (`width:min(92vw,380px)` em streak-overlay.js). Eram ~29x mais pixels do que
// a tela usa — e o overlay ainda carregava o vídeo de 5,7MB por cima, somando
// uns 14MB para o aluno ver uma animação de sequência, quase sempre no celular.
//
// A imagem não tem canal alfa (PNG tipo 2, RGB), então JPEG serve e pesa uma
// fração. `*.jpg` está na lista branca do vercel.json; `*.webp` NÃO está, por
// isso não usamos webp aqui — iria parar sem ir ao ar.
//
// Sem sharp no projeto: o redimensionamento sai pelo canvas do Chromium, via
// Playwright, que já é dependência de desenvolvimento.
// ════════════════════════════════════════════════════════════════════════════

import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const RAIZ = path.resolve(new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const ENTRADA = path.join(RAIZ, 'yara-streak.png');
const SAIDA = path.join(RAIZ, 'yara-streak.jpg');

// 380px de exibição x2 para telas retina. Acima disso é peso sem ganho visível.
const LADO = 760;
const QUALIDADE = 0.82;

if (!fs.existsSync(ENTRADA)) {
    console.error('não achei yara-streak.png na raiz do projeto');
    process.exit(1);
}

const antes = fs.statSync(ENTRADA).size;
const base64 = fs.readFileSync(ENTRADA).toString('base64');

const navegador = await chromium.launch();
const pagina = await navegador.newPage();

const jpegBase64 = await pagina.evaluate(async ({ b64, lado, q }) => {
    const img = new Image();
    img.src = 'data:image/png;base64,' + b64;
    await img.decode();

    const c = document.createElement('canvas');
    c.width = lado;
    c.height = Math.round(lado * (img.naturalHeight / img.naturalWidth));
    const ctx = c.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, c.width, c.height);

    return c.toDataURL('image/jpeg', q).split(',')[1];
}, { b64: base64, lado: LADO, q: QUALIDADE });

await navegador.close();

fs.writeFileSync(SAIDA, Buffer.from(jpegBase64, 'base64'));
const depois = fs.statSync(SAIDA).size;

const mb = n => (n / 1024 / 1024).toFixed(2) + 'MB';
const kb = n => Math.round(n / 1024) + 'KB';
console.log(`antes : ${path.basename(ENTRADA)}  ${mb(antes)}  (2048px)`);
console.log(`depois: ${path.basename(SAIDA)}  ${kb(depois)}  (${LADO}px)`);
console.log(`reducao: ${(100 - depois / antes * 100).toFixed(1)}%`);
