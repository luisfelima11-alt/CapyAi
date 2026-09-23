/**
 * Gera o card de compartilhamento (og-cover.png, 1200×630) usado nas meta tags
 * Open Graph / Twitter. É esse PNG que o WhatsApp e o Instagram mostram quando
 * alguém cola o link do site.
 *
 * Roda com o Playwright que já está no package.json — nenhuma dependência nova:
 *   node scripts/make-og.js
 *
 * Regere sempre que a marca (cores, avatar da Yara, headline) mudar e
 * versione o PNG resultante.
 */
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'og-cover.png');

// A Yara vai embutida como data URI: o Chromium roda com about:blank, então
// não há origem de onde carregar um arquivo relativo.
const yara = fs.readFileSync(path.join(ROOT, 'yara.png')).toString('base64');
// A marca nova assina o card. A Yara de corpo inteiro continua sendo o herói
// porque é ela que faz alguém clicar; o selo entra pequeno, do lado do domínio,
// para o card ficar reconhecível como sendo do mesmo app do ícone.
const marca = fs.readFileSync(path.join(ROOT, 'logo-capy.png')).toString('base64');

const html = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;800&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body {
    width:1200px; height:630px; overflow:hidden; position:relative;
    background:#001229; color:#fff;
    font-family:'Plus Jakarta Sans', system-ui, sans-serif;
    display:flex; align-items:center; gap:56px; padding:0 80px;
  }
  /* mesmos blobs da landing */
  .blob { position:absolute; border-radius:50%; filter:blur(90px); opacity:.42; }
  .b1 { width:520px; height:520px; background:#FF3E81; top:-160px; left:-140px; }
  .b2 { width:460px; height:460px; background:#8B5CF6; bottom:-180px; right:-100px; }
  .b3 { width:280px; height:280px; background:#2EC4B6; top:52%; left:44%; }
  .content { position:relative; z-index:1; flex:1; }
  .badge {
    display:inline-flex; align-items:center; gap:12px;
    background:rgba(255,255,255,.09); border:1px solid rgba(255,255,255,.18);
    border-radius:999px; padding:12px 24px; font-size:22px; font-weight:800;
    color:#cbd5e1; margin-bottom:28px;
  }
  .dot { width:11px; height:11px; border-radius:50%; background:#4ade80; }
  h1 { font-size:82px; font-weight:800; line-height:1.03; letter-spacing:-.02em; }
  .grad { background:linear-gradient(100deg,#FF3E81,#FF9F1C); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
  p { font-size:30px; color:#94a3b8; margin-top:26px; font-weight:500; }
  .domain { margin-top:38px; font-size:27px; font-weight:800; color:#FF3E81; letter-spacing:.01em;
            display:flex; align-items:center; gap:14px; }
  .domain img { width:46px; height:46px; border-radius:50%; flex:none; }
  .avatar {
    position:relative; z-index:1; width:340px; height:340px; flex:none;
    border-radius:50%; overflow:hidden;
    border:8px solid rgba(255,62,129,.55);
    box-shadow:0 30px 90px rgba(255,62,129,.35);
  }
  .avatar img { width:100%; height:100%; object-fit:cover; }
</style></head>
<body>
  <div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div>
  <div class="content">
    <div class="badge"><span class="dot"></span>Comece de graça</div>
    <h1>Aprenda inglês<br><span class="grad">conversando.</span></h1>
    <p>Trilha diária, 6 cursos e conversação real com a Yara.</p>
    <div class="domain"><img src="data:image/png;base64,${marca}" alt="">capyenglish.com.br</div>
  </div>
  <div class="avatar"><img src="data:image/png;base64,${yara}" alt=""></div>
</body></html>`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: OUT });
  await browser.close();

  const b = fs.readFileSync(OUT);
  console.log(`og-cover.png -> ${b.readUInt32BE(16)}x${b.readUInt32BE(20)}, ${(b.length / 1024).toFixed(0)}KB`);
})();
