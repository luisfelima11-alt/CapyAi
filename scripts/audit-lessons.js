#!/usr/bin/env node
// ════════════════════════════════════════════════════════════════════════════
// audit-lessons.js
// ════════════════════════════════════════════════════════════════════════════
// Visits each aula_NN.html and fr_aula_NN.html in production, captures
// console errors, JS exceptions, network failures, and writes audit-report.md.
//
// Requirements:  npm install playwright   (one-time)
// Usage:         node scripts/audit-lessons.js [--base=https://www.capyenglish.com.br]
//
// Output: audit-report.md in the repo root.
// ════════════════════════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');

let chromium;
try { chromium = require('playwright').chromium; }
catch (e) {
  console.error('❌ playwright not installed. Run: npm install playwright && npx playwright install chromium');
  process.exit(1);
}

// CLI args
const args = Object.fromEntries(
  process.argv.slice(2).map(a => a.split('=')).map(([k, v]) => [k.replace(/^--/, ''), v ?? true])
);
const BASE = args.base || 'https://www.capyenglish.com.br';
const HEADLESS = args.headless !== 'false';

// Collect aula files locally (drives the URL list)
const repoRoot = path.resolve(__dirname, '..');
const allFiles = fs.readdirSync(repoRoot);
const aulaFiles = allFiles
  .filter(f => /^(aula_\d+|fr_aula_\d+)\.html$/.test(f))
  .sort();

console.log(`🐾 Auditing ${aulaFiles.length} lesson pages against ${BASE}`);

(async () => {
  const browser = await chromium.launch({ headless: HEADLESS });
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent: 'CapyAuditBot/1.0',
  });

  const report = [];
  report.push('# Lesson Audit Report');
  report.push(`Generated: ${new Date().toISOString()}`);
  report.push(`Base: ${BASE}`);
  report.push(`Lessons: ${aulaFiles.length}\n`);
  report.push('| Lesson | Status | Console errors | Page errors | Failed requests |');
  report.push('|--------|--------|----------------|-------------|-----------------|');

  const summary = { ok: 0, warn: 0, error: 0 };
  const detailedFindings = [];

  for (const f of aulaFiles) {
    const url = `${BASE}/${f}`;
    const page = await ctx.newPage();
    const consoleErrors = [];
    const pageErrors = [];
    const failedRequests = [];

    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text().slice(0, 200));
    });
    page.on('pageerror', err => { pageErrors.push(err.message.slice(0, 200)); });
    page.on('requestfailed', req => {
      if (req.url().startsWith(BASE) || req.url().includes('capyenglish')) {
        failedRequests.push(`${req.method()} ${req.url().slice(0, 100)}`);
      }
    });

    let status = '✅ ok';
    try {
      const resp = await page.goto(url, { waitUntil: 'load', timeout: 20000 });
      if (!resp || !resp.ok()) { status = `❌ HTTP ${resp ? resp.status() : '???'}`; }
      // Wait a beat for JS to throw async errors
      await page.waitForTimeout(2500);

      // Probe a few common things
      const probe = await page.evaluate(() => {
        const out = {};
        out.hasYaraWidget = !!document.getElementById('yw-fab');
        out.hasTopNav = !!document.getElementById('top-nav-bar') || !!document.querySelector('[id*="top-nav"]');
        out.hasVocabTab = !!document.querySelector('[data-tab="vocab"], [onclick*="vocab"], button.tab-btn');
        out.tabs = [...document.querySelectorAll('.tab-btn')].map(b => b.textContent.trim().slice(0, 24));
        out.speakBtns = document.querySelectorAll('button[onclick*="speak"]').length;
        out.hasUserYou = !!document.querySelector('[onclick*="personalize"], [data-tab="personalize"]');
        return out;
      }).catch(() => ({}));

      const errs = consoleErrors.length + pageErrors.length + failedRequests.length;
      if (errs > 0 && status === '✅ ok') status = `⚠️ ${errs} issue${errs === 1 ? '' : 's'}`;
      if (errs > 5) status = `❌ ${errs} issues`;

      // Detailed finding entry
      if (consoleErrors.length || pageErrors.length || failedRequests.length || !probe.hasYaraWidget) {
        detailedFindings.push({ file: f, probe, consoleErrors, pageErrors, failedRequests });
      }

      if (status.startsWith('✅')) summary.ok++;
      else if (status.startsWith('⚠️')) summary.warn++;
      else summary.error++;
    } catch (e) {
      status = `❌ ${e.message.slice(0, 60)}`;
      summary.error++;
    }

    report.push(`| ${f} | ${status} | ${consoleErrors.length} | ${pageErrors.length} | ${failedRequests.length} |`);
    process.stdout.write(`  ${f.padEnd(20)} ${status}\n`);
    await page.close();
  }

  report.push('\n## Summary\n');
  report.push(`- ✅ OK: **${summary.ok}**`);
  report.push(`- ⚠️ Warnings: **${summary.warn}**`);
  report.push(`- ❌ Errors: **${summary.error}**`);

  if (detailedFindings.length) {
    report.push('\n## Detailed findings\n');
    for (const d of detailedFindings) {
      report.push(`### ${d.file}\n`);
      if (!d.probe.hasYaraWidget) report.push('- ⚠️ Yara widget not detected (`#yw-fab` missing)');
      if (d.probe.tabs?.length) report.push(`- Tabs found: ${d.probe.tabs.join(', ')}`);
      if (typeof d.probe.speakBtns === 'number') report.push(`- 🔊 buttons: ${d.probe.speakBtns}`);
      if (d.consoleErrors.length) {
        report.push(`- **Console errors (${d.consoleErrors.length}):**`);
        d.consoleErrors.forEach(e => report.push(`  - \`${e}\``));
      }
      if (d.pageErrors.length) {
        report.push(`- **Page errors (${d.pageErrors.length}):**`);
        d.pageErrors.forEach(e => report.push(`  - \`${e}\``));
      }
      if (d.failedRequests.length) {
        report.push(`- **Failed requests:**`);
        d.failedRequests.forEach(r => report.push(`  - \`${r}\``));
      }
      report.push('');
    }
  }

  fs.writeFileSync(path.join(repoRoot, 'audit-report.md'), report.join('\n'));
  console.log(`\n📄 Report written: audit-report.md`);
  console.log(`   ✅ ${summary.ok}   ⚠️ ${summary.warn}   ❌ ${summary.error}`);

  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
