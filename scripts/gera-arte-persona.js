/**
 * gera-arte-persona.js — converte o PNG cru de uma persona da Capivara IA para
 * o JPEG quadrado que o palco da `ai_chat.html` usa como `poster` do <video>.
 *
 * Substitui o antigo `gera-poster-yara.js`, que só sabia fazer a Yara padrão e
 * recortava em 16:9.
 *
 * ── Por que QUADRADA, e não 16:9 ─────────────────────────────────────────────
 * O palco virou fundo de tela inteira. A mesma imagem precisa cobrir 9:19,5 no
 * celular e 16:9 no desktop. Medido: um recorte 16:9 com `object-fit:cover`
 * numa tela de 375x812 vira um close extremo do focinho. O quadrado com
 * `object-position:top center` serve as duas.
 *
 * ── Por que JPEG, e por que 640 ──────────────────────────────────────────────
 *   PNG cru do Higgsfield (1024x1024) ...... ~2 100 KB
 *   JPEG 640x640 q80 ........................ ~55 KB    <- escolhido
 * O poster fica visível até o aluno ligar, e esta página é o destino do botão
 * "Yara AI" de 201 arquivos: cada KB aqui vale por 201.
 *
 * ── Versão NO NOME, nunca `?v=` ──────────────────────────────────────────────
 * O `sw.js` faz cache-first de `.jpg` partindo do princípio de que "asset muda
 * de nome quando muda". Regerar pedindo o mesmo nome deixa quem já abriu a
 * página com a arte velha para sempre — foi o incidente do `/icon-192.png`.
 * Arte nova? `-v2`, e troca a referência no catálogo (`PERSONAS` em api/index.js).
 *
 * O master PNG fica em `scripts/masters/`, que não casa com nenhum padrão do
 * `builds` do vercel.json e portanto nunca é servido.
 *
 * Usa o Playwright que já está no package.json. Nenhuma dependência nova.
 *
 *   node scripts/gera-arte-persona.js --origem=scripts/masters/travel.png --destino=yara-travel-v1.jpg
 *   node scripts/gera-arte-persona.js --origem=yara-avatar.png --destino=yara-quadrado-v1.jpg
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const RAIZ = path.join(__dirname, '..');
const arg = (nome, padrao) => {
    const achado = process.argv.slice(2).find(a => a.startsWith('--' + nome + '='));
    return achado === undefined ? padrao : achado.split('=').slice(1).join('=');
};

const ORIGEM = path.resolve(RAIZ, arg('origem', 'yara-avatar.png'));
const DESTINO = path.resolve(RAIZ, arg('destino', 'yara-quadrado-v1.jpg'));
const LADO = Number(arg('lado', 640));
const QUALIDADE = Number(arg('qualidade', 0.80));
// 0 = rente ao topo, 0.5 = centrado. Só tem efeito quando a origem não é
// quadrada; sobra é sempre cortada da dimensão mais longa.
const ALINHAMENTO = Number(arg('alinhamento', 0.3));
const TETO_KB = Number(arg('teto', 60));

(async () => {
    if (!fs.existsSync(ORIGEM)) throw new Error('origem não existe: ' + ORIGEM);
    const ext = path.extname(ORIGEM).toLowerCase();
    const tipo = ext === '.png' ? 'image/png' : 'image/jpeg';
    const b64 = fs.readFileSync(ORIGEM).toString('base64');

    const navegador = await chromium.launch();
    try {
        const pagina = await navegador.newPage();
        const saida = await pagina.evaluate(async ({ b64, tipo, LADO, QUALIDADE, ALINHAMENTO }) => {
            const img = new Image();
            await new Promise((ok, falha) => {
                img.onload = ok;
                img.onerror = () => falha(new Error('a imagem de origem não decodificou'));
                img.src = 'data:' + tipo + ';base64,' + b64;
            });
            const c = document.createElement('canvas');
            c.width = LADO; c.height = LADO;
            const ctx = c.getContext('2d');
            ctx.imageSmoothingQuality = 'high';
            // Recorte quadrado por "cover": pega o lado menor inteiro e corta a
            // sobra do maior, deslocada por ALINHAMENTO.
            const lado = Math.min(img.naturalWidth, img.naturalHeight);
            const x = (img.naturalWidth - lado) * 0.5;
            const y = (img.naturalHeight - lado) * ALINHAMENTO;
            ctx.drawImage(img, x, y, lado, lado, 0, 0, LADO, LADO);
            return { dados: c.toDataURL('image/jpeg', QUALIDADE), origem: [img.naturalWidth, img.naturalHeight] };
        }, { b64, tipo, LADO, QUALIDADE, ALINHAMENTO });

        const bytes = Buffer.from(saida.dados.split(',')[1], 'base64');
        fs.writeFileSync(DESTINO, bytes);
        const kb = Math.round(bytes.length / 1024);
        console.log('origem  ' + path.basename(ORIGEM) + '  ' + saida.origem.join('x') +
                    '  ' + Math.round(fs.statSync(ORIGEM).size / 1024) + ' KB');
        console.log('arte    ' + LADO + 'x' + LADO + '  ' + kb + ' KB  -> ' + path.relative(RAIZ, DESTINO));
        if (kb > TETO_KB) {
            console.error('AVISO: ' + kb + ' KB passa do teto de ' + TETO_KB +
                          ' KB. Baixe --qualidade ou --lado antes de publicar.');
            process.exitCode = 1;
        }
    } finally {
        await navegador.close();
    }
})().catch(e => { console.error('FALHOU:', e.message); process.exit(1); });
