'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TARGETS = [
  '4_Login_Capy_Yara_Welcomes_You.html',
  'set-password.html',
  'account.html',
  'admin.html',
  'admin-metrics.html',
  'teacher_homework.html',
];

const jsDir = path.join(ROOT, 'assets', 'js', 'pages');
const cssDir = path.join(ROOT, 'assets', 'css', 'pages');
const vendorDir = path.join(ROOT, 'assets', 'vendor');
fs.mkdirSync(jsDir, { recursive: true });
fs.mkdirSync(cssDir, { recursive: true });
fs.mkdirSync(vendorDir, { recursive: true });

function slugFor(filename) {
  return path.basename(filename, '.html').replace(/[^a-zA-Z0-9_-]+/g, '-').toLowerCase();
}

function convertHandlers(source) {
  return source.replace(/\son(click|change|submit|input|load)=(['"])([\s\S]*?)\2/g,
    (_match, event, quote, expression) => ` data-capy-on${event}=${quote}${expression}${quote}`);
}

for (const filename of TARGETS) {
  const fullPath = path.join(ROOT, filename);
  let html = convertHandlers(fs.readFileSync(fullPath, 'utf8'));
  const slug = slugFor(filename);

  html = html.replace(/<script\b[^>]*src=(['"])https:\/\/cdn\.tailwindcss\.com[^'"]*\1[^>]*><\/script>\s*/gi,
    '<link rel="stylesheet" href="assets/css/security-pages.css">\n');
  html = html.replace(/<script\b[^>]*src=(['"])https:\/\/cdn\.jsdelivr\.net\/npm\/chart\.js@4\.4\.1\/dist\/chart\.umd\.min\.js\1[^>]*><\/script>/gi,
    '<script src="assets/vendor/chart.umd.min.js"></script>');

  let styleIndex = 0;
  html = html.replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gi, (_match, css) => {
    styleIndex += 1;
    const relative = `assets/css/pages/${slug}-${styleIndex}.css`;
    fs.writeFileSync(path.join(ROOT, relative), `${css.trim()}\n`, 'utf8');
    return `<link rel="stylesheet" href="${relative}">`;
  });

  let scriptIndex = 0;
  html = html.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (match, attrs, source) => {
    if (/\bsrc\s*=/.test(attrs)) return match;
    if (/tailwind\.config\s*=/.test(source)) return '';
    scriptIndex += 1;
    const relative = `assets/js/pages/${slug}-${scriptIndex}.js`;
    fs.writeFileSync(path.join(ROOT, relative), `${convertHandlers(source).trim()}\n`, 'utf8');
    return `<script src="${relative}"></script>`;
  });

  if (!html.includes('assets/js/secure-inline-events.js')) {
    html = html.replace(/<\/body>/i, '  <script src="assets/js/secure-inline-events.js"></script>\n</body>');
  }
  fs.writeFileSync(fullPath, html, 'utf8');
}

fs.copyFileSync(
  path.join(path.dirname(require.resolve('chart.js')), 'chart.umd.js'),
  path.join(vendorDir, 'chart.umd.min.js')
);

console.log(`Externalized security-sensitive assets for ${TARGETS.length} pages.`);
