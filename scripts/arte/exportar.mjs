#!/usr/bin/env node
// ════════════════════════════════════════════════════════════════════════════
// exportar.mjs — transforma precos.html em PNG pronto para publicar
// ════════════════════════════════════════════════════════════════════════════
// Ferramenta de autor. Vive em scripts/, que o vercel.json BLOQUEIA por rota —
// importante, porque `builds` inclui `*.html` e `*.png` na raiz: um arquivo de
// arte solto lá viraria página pública do site.
//
//   node scripts/arte/exportar.mjs
//
// Por que HTML e não gerador de imagem: o texto é o produto aqui. "R$ 399" tem
// que sair "R$ 399", e "personalizado" tem que manter o acento. Modelo de
// imagem erra exatamente isso.
// ════════════════════════════════════════════════════════════════════════════

import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const FONTE = path.join(AQUI, 'precos.html');
const SAIDA = path.join(AQUI, 'saida');

const FORMATOS = [
    { nome: 'precos-feed',    classe: 'feed',    w: 1080, h: 1350 },
    { nome: 'precos-stories', classe: 'stories', w: 1080, h: 1920 },
];

fs.mkdirSync(SAIDA, { recursive: true });

const navegador = await chromium.launch();
try {
    for (const f of FORMATOS) {
        const pagina = await navegador.newPage({
            viewport: { width: f.w, height: f.h },
            // Dobro da resolução: o Instagram recomprime, e partir de uma
            // imagem maior é o que mantém a tipografia nítida depois disso.
            deviceScaleFactor: 2,
        });
        await pagina.goto('file:///' + FONTE.replace(/\\/g, '/'), { waitUntil: 'networkidle' });
        await pagina.evaluate(c => {
            const el = document.getElementById('arte');
            el.classList.remove('feed', 'stories');
            el.classList.add(c);
        }, f.classe);

        // Sem esperar a fonte, o PNG sai com a fonte de sistema e ninguém
        // percebe até olhar de perto — falha silenciosa clássica.
        await pagina.evaluate(() => document.fonts.ready);
        await pagina.waitForTimeout(350);

        const arquivo = path.join(SAIDA, f.nome + '.png');
        await pagina.locator('#arte').screenshot({ path: arquivo });
        await pagina.close();

        const kb = (fs.statSync(arquivo).size / 1024).toFixed(0);
        console.log(`${f.nome.padEnd(16)} ${f.w}x${f.h} (@2x)  ${kb} KB`);
    }
} finally {
    await navegador.close();
}

console.log('\nsaida em scripts/arte/saida/');
