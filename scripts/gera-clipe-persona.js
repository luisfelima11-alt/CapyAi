/**
 * gera-clipe-persona.js — converte o clipe cru do Higgsfield (Kling 3.0, 960x960,
 * ~3 MB) para o MP4 leve que o palco da `ai_chat.html` toca em loop.
 *
 *   640x640 · 24 fps · H.264 main · crf 28 · sem audio · +faststart
 *   meta 450 KB, teto 600 KB (sobe o crf ate caber)
 *
 * ── Versao NO NOME, nunca `?v=` ──────────────────────────────────────────────
 * O `sw.js` faz cache-first de midia. Clipe novo? `-v2`, e troca a referencia em
 * `PERSONAS` (api/index.js). Fica na raiz porque o `builds` do vercel.json so
 * publica `*.mp4` da raiz.
 *
 * ── O que ele confere ────────────────────────────────────────────────────────
 *   emenda  ssim do ultimo x primeiro quadro (>= 0,96, senao o loop "pula")
 *   foto    ssim do primeiro quadro x arte da persona (>= 0,85, senao a troca
 *           foto -> video da um tranco visivel)
 * E grava uma folha de 10 quadros em scripts/masters/clipes-brutos/ para olhar
 * chapeu, dedos e objetos.
 *
 *   node scripts/gera-clipe-persona.js --origem=scripts/masters/clipes-brutos/agro-parada.mp4 --destino=persona-agro-parada-v1.mp4 --arte=yara-agro-v1.jpg
 */
const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const RAIZ = path.join(__dirname, '..');
const arg = nome => {
    const achado = process.argv.slice(2).find(a => a.startsWith('--' + nome + '='));
    return achado ? achado.slice(nome.length + 3) : '';
};
const origem = path.resolve(RAIZ, arg('origem'));
const destino = path.resolve(RAIZ, arg('destino'));
const arte = arg('arte') ? path.resolve(RAIZ, arg('arte')) : '';
// Clipe que nao e quadrado (o yara-chat.mp4 e 16:9): --recorte=716:716:292:0 (crop do ffmpeg).
const recorte = arg('recorte') ? 'crop=' + arg('recorte') + ',' : '';
const pastaBrutos = path.join(RAIZ, 'scripts/masters/clipes-brutos');

const ff = args => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args], { stdio: ['ignore', 'ignore', 'pipe'] });
const ssim = (a, b) => {
    const p = spawnSync('ffmpeg', ['-i', a, '-i', b, '-lavfi',
        '[0]scale=640:640,format=yuv420p[x];[1]scale=640:640,format=yuv420p[y];[x][y]ssim', '-f', 'null', '-'],
        { encoding: 'utf8' });
    const m = /All:([\d.]+)/.exec(p.stderr || '');
    return m ? Number(m[1]) : NaN;
};

let crf = 28;
let kb = Infinity;
for (; crf <= 34; crf += 2) {
    ff(['-i', origem, '-vf', recorte + 'scale=640:640:flags=lanczos,fps=24,format=yuv420p',
        '-c:v', 'libx264', '-profile:v', 'main', '-preset', 'slow', '-crf', String(crf), '-tune', 'animation',
        '-an', '-movflags', '+faststart', destino]);
    kb = Math.round(fs.statSync(destino).size / 1024);
    if (kb <= 450) break;
}
if (kb > 600) {
    console.error(path.basename(destino) + ': ' + kb + ' KB, acima do teto de 600 KB');
    process.exit(1);
}

fs.mkdirSync(pastaBrutos, { recursive: true });
const base = path.basename(destino, '.mp4');
const primeiro = path.join(pastaBrutos, base + '-q1.png');
const ultimo = path.join(pastaBrutos, base + '-qN.png');
ff(['-i', destino, '-frames:v', '1', primeiro]);
ff(['-sseof', '-0.1', '-i', destino, '-update', '1', ultimo]);
ff(['-i', destino, '-vf', 'fps=2,scale=256:256,tile=5x2', '-frames:v', '1', path.join(pastaBrutos, base + '-folha.png')]);

const emenda = ssim(ultimo, primeiro);
const foto = arte ? ssim(primeiro, arte) : NaN;
const alerta = (v, min) => (v < min ? ' (abaixo de ' + min + ')' : '');
console.log(path.basename(destino) + '  ' + kb + ' KB (crf ' + crf + ')'
    + '  emenda ' + emenda.toFixed(3) + alerta(emenda, 0.96)
    + '  foto ' + (Number.isNaN(foto) ? '-' : foto.toFixed(3) + alerta(foto, 0.85)));
