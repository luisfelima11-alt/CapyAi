#!/usr/bin/env node
// ════════════════════════════════════════════════════════════════════════════
// patch-legacy-aulas.js — Bring 32 legacy aulas to baseline consistency
// ════════════════════════════════════════════════════════════════════════════
// The 12 modern aulas (~01-12) use lesson-engine.js + components.js.
// The 32 legacy aulas (mostly 13-44) have inline code with custom top nav,
// possibly missing store.js / tts-en.js, and don't mount Components nav.
//
// This script adds (only where missing):
//   - <script src="store.js">
//   - <script src="tts-en.js"> (placed before yara-widget.js)
//   - <div id="top-nav-placeholder"></div> + <div id="side-nav-placeholder">
//   - <script src="components.js?v=7"> + Components.mount(...) calls
//
// Safe to re-run — each patch is idempotent (checks if pattern already present).
// ════════════════════════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const files = fs.readdirSync(ROOT).filter(f => /^aula_\d+\.html$/.test(f)).sort();

let modernCount = 0, legacyCount = 0, patched = 0, noChange = 0;
const log = [];

for (const f of files) {
  const filepath = path.join(ROOT, f);
  let content = fs.readFileSync(filepath, 'utf8');

  // Modern aulas already use lesson-engine.js OR components.js — skip.
  const isModern = /<script\s+[^>]*src=["']?lesson-engine\.js/.test(content) ||
                   /<script\s+[^>]*src=["']?components\.js/.test(content);
  if (isModern) {
    modernCount++;
    log.push(`SKIP modern: ${f}`);
    continue;
  }
  legacyCount++;

  const changes = [];

  // ── Patch A: store.js ────────────────────────────────────────────────────
  if (!/<script\s+[^>]*src=["']?store\.js/.test(content)) {
    if (/<\/style>/i.test(content)) {
      content = content.replace(/<\/style>/i, '</style>\n<script src="store.js"></script>');
      changes.push('+store.js');
    } else if (/<\/head>/i.test(content)) {
      content = content.replace(/<\/head>/i, '<script src="store.js"></script>\n</head>');
      changes.push('+store.js');
    }
  }

  // ── Patch B: tts-en.js — placed RIGHT BEFORE yara-widget.js script ───────
  if (!/<script\s+[^>]*src=["']?tts-en\.js/.test(content)) {
    if (/<script\s+[^>]*src=["']?yara-widget\.js[^>]*>\s*<\/script>/i.test(content)) {
      content = content.replace(
        /(<script\s+[^>]*src=["']?yara-widget\.js[^>]*>\s*<\/script>)/i,
        '<script src="tts-en.js"></script>\n$1'
      );
      changes.push('+tts-en.js');
    }
  }

  // ── Patch C: top-nav placeholder + Components mount ──────────────────────
  // Only inject if not already mounted (some legacy aulas may have it via
  // a previous run or hand-edit).
  if (!/Components\.mount/.test(content)) {
    // Inject placeholders just after <body...> (don't replace any existing
    // markup — just prepend the divs so they're available for mounting).
    if (!/id=["']top-nav-placeholder/.test(content)) {
      content = content.replace(
        /(<body[^>]*>)/i,
        '$1\n<div id="top-nav-placeholder"></div>\n<div id="side-nav-placeholder"></div>'
      );
      changes.push('+placeholders');
    }
    // Inject mount script just before yara-widget script.
    if (/<script\s+[^>]*src=["']?yara-widget\.js[^>]*>\s*<\/script>/i.test(content)) {
      const mountBlock =
        '<script src="components.js?v=7"></script>\n' +
        '<script>\n' +
        "if (typeof Components !== 'undefined') {\n" +
        '  try {\n' +
        "    Components.mount('top-nav-placeholder', Components.renderTopNav('classes'));\n" +
        "    Components.mount('side-nav-placeholder', Components.renderSideNav('classes'));\n" +
        '  } catch(e) { console.warn(\'Components mount failed\', e); }\n' +
        '}\n' +
        '</script>\n';
      content = content.replace(
        /(<script\s+[^>]*src=["']?yara-widget\.js[^>]*>\s*<\/script>)/i,
        mountBlock + '$1'
      );
      changes.push('+nav-mount');
    }
  }

  if (changes.length > 0) {
    fs.writeFileSync(filepath, content);
    patched++;
    log.push(`PATCH ${f}: ${changes.join(' ')}`);
  } else {
    noChange++;
    log.push(`SKIP legacy (already complete): ${f}`);
  }
}

console.log(log.join('\n'));
console.log(`\n📊 Summary:`);
console.log(`   Modern (skipped):     ${modernCount}`);
console.log(`   Legacy total:         ${legacyCount}`);
console.log(`   Legacy patched:       ${patched}`);
console.log(`   Legacy no-change:     ${noChange}`);
