#!/usr/bin/env node
// ════════════════════════════════════════════════════════════════════════════
// bump-versions.js — Cache-bust JS/CSS via git SHA
// ════════════════════════════════════════════════════════════════════════════
// Walks all .html files in repo root, rewrites every <script src="X.js"> and
// <link rel="stylesheet" href="X.css"> to append ?v=<gitSha>.
//
// vercel.json already maps ?v=:version → Cache-Control: immutable, so once
// versioned, those assets get long-lived edge cache; updates land on the next
// SHA bump.
//
// Run before each deploy:  npm run bump && git add -A && git commit && git push
// ════════════════════════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');

let sha;
try {
  sha = execSync('git rev-parse --short HEAD', { cwd: ROOT }).toString().trim();
} catch (e) {
  console.error('⚠️  Not in a git repo — using timestamp instead');
  sha = String(Date.now()).slice(-7);
}

console.log(`🔄 Bumping cache version to: ${sha}`);

const htmls = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));
let touchedFiles = 0;
let totalChanges = 0;

for (const f of htmls) {
  const filepath = path.join(ROOT, f);
  let content = fs.readFileSync(filepath, 'utf8');
  const original = content;
  let fileChanges = 0;

  // <script src="local.js"> or <script src="local.js?v=anything">
  // Excludes external URLs (http://, https://, //).
  content = content.replace(
    /<script\s+([^>]*?)src=(["'])(?!https?:|\/\/)([^"'?]+\.js)(?:\?v=[^"']+)?(["'])([^>]*)>/gi,
    (m, pre, q1, src, q2, post) => {
      fileChanges++;
      return `<script ${pre}src=${q1}${src}?v=${sha}${q2}${post}>`;
    }
  );

  // <link rel="stylesheet" href="local.css">
  content = content.replace(
    /<link\s+([^>]*?)href=(["'])(?!https?:|\/\/)([^"'?]+\.css)(?:\?v=[^"']+)?(["'])([^>]*)>/gi,
    (m, pre, q1, src, q2, post) => {
      fileChanges++;
      return `<link ${pre}href=${q1}${src}?v=${sha}${q2}${post}>`;
    }
  );

  if (content !== original) {
    fs.writeFileSync(filepath, content);
    console.log(`  ${f}  (${fileChanges} bumped)`);
    touchedFiles++;
    totalChanges += fileChanges;
  }
}

console.log(`\n✅ Done. Touched ${touchedFiles} files. ${totalChanges} references bumped. SHA: ${sha}`);
console.log(`   Next: git add -A && git commit -m "chore: bump asset versions to ${sha}" && git push`);
