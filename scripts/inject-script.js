#!/usr/bin/env node
// ════════════════════════════════════════════════════════════════════════════
// inject-script.js — add a local <script> tag to many HTML pages (idempotent)
// ════════════════════════════════════════════════════════════════════════════
//   node scripts/inject-script.js --src=analytics.js --where=head --exclude=admin.html,verify.html
//   node scripts/inject-script.js --src=progress.js --where=body --only='^(fr_)?aula_\d+\.html$'
//
// --where=head  → right after <meta charset> (runs before the page's own scripts)
// --where=body  → right before </body> (runs after the page's inline scripts)
// Pages that already reference --src are skipped. Run `npm run bump` afterwards.
// ════════════════════════════════════════════════════════════════════════════
const fs = require('fs');
const path = require('path');

const args = Object.fromEntries(process.argv.slice(2).map(a => {
    const i = a.indexOf('=');
    return i < 0 ? [a.replace(/^--/, ''), true] : [a.slice(2, i), a.slice(i + 1)];
}));
const src = args.src;
const where = args.where || 'body';
if (!src || !/^[\w.-]+\.js$/.test(src)) { console.error('usage: --src=file.js [--where=head|body] [--only=regex] [--exclude=a.html,b.html]'); process.exit(1); }

const ROOT = path.resolve(__dirname, '..');
const only = args.only ? new RegExp(args.only) : null;
const exclude = new Set(String(args.exclude || '').split(',').map(s => s.trim()).filter(Boolean));
const tag = `<script src="${src}"></script>`;
const already = new RegExp(`src=["']${src.replace(/\./g, '\\.')}(\\?[^"']*)?["']`);

let changed = 0, skipped = 0;
for (const f of fs.readdirSync(ROOT).filter(n => n.endsWith('.html')).sort()) {
    if ((only && !only.test(f)) || exclude.has(f)) continue;
    const file = path.join(ROOT, f);
    const html = fs.readFileSync(file, 'utf8');
    if (already.test(html)) { skipped++; continue; }
    let out;
    if (where === 'head') {
        const m = html.match(/<meta\s+charset=[^>]*>/i);
        out = m ? html.replace(m[0], `${m[0]}\n${tag}`) : html.replace(/<head[^>]*>/i, h => `${h}\n${tag}`);
    } else {
        const i = html.toLowerCase().lastIndexOf('</body>');
        out = i < 0 ? null : `${html.slice(0, i)}${tag}\n${html.slice(i)}`;
    }
    if (!out || out === html) { console.warn(`  ⚠️  could not place tag in ${f}`); continue; }
    fs.writeFileSync(file, out);
    changed++;
}
console.log(`✅ ${src}: added to ${changed} page(s), ${skipped} already had it.`);
