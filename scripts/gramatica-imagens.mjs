#!/usr/bin/env node
// ════════════════════════════════════════════════════════════════════════════
// gramatica-imagens.mjs — as imagens dos slides de gramática de uma aula de curso
// ════════════════════════════════════════════════════════════════════════════
// Cada slide da aba Grammar tem uma imagem (assets/img/gramatica/<slug>-<k>.webp,
// k = 0 abertura … último = revisão). Elas são geradas na Higgsfield pelo Claude
// Code (conector MCP), com o Z Image em 4:3, o modelo mais barato. Este script
// faz as duas pontas que não dependem do conector:
//
//   node scripts/gramatica-imagens.mjs --lista agro01
//       as imagens da aula, com o prompt completo de cada uma e se já existe
//   node scripts/gramatica-imagens.mjs --salvar agro01 3 <arquivo-ou-https-url>
//       reduz para 1024×768 e grava em WebP (até 200 KB), no caminho certo
//
// slug: gps14 (scripts/aula14-conteudo.json), agro01, med05, interview03.
// A conversão usa o Chromium do Playwright (dependência de dev), porque o
// projeto não tem sharp nem ImageMagick. Para baixar de uma URL pelo proxy do
// contêiner de nuvem, rode com NODE_USE_ENV_PROXY=1.
// ════════════════════════════════════════════════════════════════════════════

import fs from 'node:fs';
import path from 'node:path';
import { cenasDoDeck, promptDaImagem, imagemDoSlide, MAX_KB_IMAGEM } from './lib/gramatica-slides.mjs';

const RAIZ = path.resolve(new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const LARGURA = 1024, ALTURA = 768;

function conteudoDe(slug) {
    const m = /^(gps|agro|med|interview)(\d{2})$/.exec(slug);
    if (!m) throw new Error(`slug inválido: ${slug} (ex.: gps14, agro01, med05, interview03)`);
    const arquivo = path.join(RAIZ, 'scripts', `${m[1] === 'gps' ? 'aula' : m[1]}${m[2]}-conteudo.json`);
    if (!fs.existsSync(arquivo)) throw new Error(`não existe: ${path.relative(RAIZ, arquivo)}`);
    return JSON.parse(fs.readFileSync(arquivo, 'utf8'));
}

function lista(slug) {
    const g = conteudoDe(slug).gramatica || {};
    if (!Array.isArray(g.slides)) throw new Error(`${slug}: a gramática ainda não está em slides`);
    return cenasDoDeck(g).map((cena, k) => {
        const arquivo = imagemDoSlide(slug, k);
        const abs = path.join(RAIZ, arquivo);
        const existe = fs.existsSync(abs);
        return { k, arquivo, existe, kb: existe ? Math.round(fs.statSync(abs).size / 1024) : null, prompt: promptDaImagem(g, cena) };
    });
}

function tipoDaImagem(buf) {
    if (buf.subarray(0, 4).toString('hex') === '89504e47') return 'image/png';
    if (buf.subarray(0, 3).toString('hex') === 'ffd8ff') return 'image/jpeg';
    if (buf.subarray(0, 4).toString() === 'RIFF' && buf.subarray(8, 12).toString() === 'WEBP') return 'image/webp';
    throw new Error('formato de imagem desconhecido (esperava PNG, JPEG ou WebP)');
}

async function lerEntrada(entrada) {
    if (/^https:\/\//.test(entrada)) {
        const r = await fetch(entrada);
        if (!r.ok) throw new Error(`download falhou: HTTP ${r.status}`);
        return Buffer.from(await r.arrayBuffer());
    }
    return fs.readFileSync(entrada);
}

async function salvar(slug, k, entrada) {
    const itens = lista(slug);
    const item = itens[k];
    if (!item) throw new Error(`${slug} tem ${itens.length} slides (k de 0 a ${itens.length - 1})`);
    const buf = await lerEntrada(entrada);
    const dataUrl = `data:${tipoDaImagem(buf)};base64,${buf.toString('base64')}`;

    const { chromium } = await import('playwright');
    const navegador = await chromium.launch();
    try {
        const pagina = await navegador.newPage();
        // Recorta pelo centro se a proporção não for 4:3 exata e reduz com suavização alta.
        // A qualidade desce até o arquivo caber no teto.
        const webp = await pagina.evaluate(async ({ src, W, H, tetoBytes }) => {
            const img = new Image();
            img.src = src;
            await img.decode();
            const cv = document.createElement('canvas');
            cv.width = W; cv.height = H;
            const ctx = cv.getContext('2d');
            ctx.imageSmoothingQuality = 'high';
            const s = Math.max(W / img.naturalWidth, H / img.naturalHeight);
            const w = img.naturalWidth * s, h = img.naturalHeight * s;
            ctx.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
            let url = '';
            for (const q of [0.8, 0.72, 0.64, 0.56]) {
                url = cv.toDataURL('image/webp', q);
                if (url.startsWith('data:image/webp') && (url.length - url.indexOf(',') - 1) * 3 / 4 <= tetoBytes) break;
            }
            return { url, larg: img.naturalWidth, alt: img.naturalHeight };
        }, { src: dataUrl, W: LARGURA, H: ALTURA, tetoBytes: MAX_KB_IMAGEM * 1024 });
        if (!webp.url.startsWith('data:image/webp')) throw new Error('o Chromium não gerou WebP');
        const saida = Buffer.from(webp.url.slice(webp.url.indexOf(',') + 1), 'base64');
        const abs = path.join(RAIZ, item.arquivo);
        fs.mkdirSync(path.dirname(abs), { recursive: true });
        fs.writeFileSync(abs, saida);
        const kb = Math.round(saida.length / 1024);
        console.log(`  ✓ ${item.arquivo}: ${webp.larg}×${webp.alt} → ${LARGURA}×${ALTURA}, ${kb} KB${kb > MAX_KB_IMAGEM ? `  ⚠ acima de ${MAX_KB_IMAGEM} KB` : ''}`);
    } finally {
        await navegador.close();
    }
}

const [modo, slug, k, entrada] = process.argv.slice(2);
try {
    if (modo === '--lista' && slug) {
        console.log(JSON.stringify(lista(slug), null, 2));
    } else if (modo === '--salvar' && slug && /^\d+$/.test(k || '') && entrada) {
        await salvar(slug, Number(k), entrada);
    } else {
        console.log('uso: node scripts/gramatica-imagens.mjs --lista <slug>\n     node scripts/gramatica-imagens.mjs --salvar <slug> <k> <arquivo-ou-https-url>');
        process.exitCode = 1;
    }
} catch (e) {
    console.error('✗', e.message);
    process.exitCode = 1;
}
