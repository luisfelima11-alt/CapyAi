#!/usr/bin/env node
// ════════════════════════════════════════════════════════════════════════════
// build-curriculum.js — generates curriculum.json (lesson order + tabs)
// ════════════════════════════════════════════════════════════════════════════
// Source of truth for the order: the LESSONS arrays in classes.html and
// classes_fr.html. Tabs come from each lesson page's `.tab-btn[data-tab]`.
// Used by the API (/api/me/summary → next lesson) and by progress.js.
//
//   npm run curriculum      (re-run after adding/reordering lessons or tabs)
// ════════════════════════════════════════════════════════════════════════════
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');

function readLessons(file) {
    const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
    const m = html.match(/const LESSONS\s*=\s*(\[[\s\S]*?\n\]);/);
    if (!m) throw new Error(`LESSONS array not found in ${file}`);
    return vm.runInNewContext(m[1]);
}

function readTabs(file) {
    const p = path.join(ROOT, file);
    if (!fs.existsSync(p)) return [];
    const html = fs.readFileSync(p, 'utf8');
    const tabs = [];
    const re = /<button[^>]*class="[^"]*\btab-btn\b[^"]*"[^>]*data-tab="([a-z0-9_-]+)"|<button[^>]*data-tab="([a-z0-9_-]+)"[^>]*class="[^"]*\btab-btn\b/g;
    let m;
    while ((m = re.exec(html))) {
        const t = m[1] || m[2];
        if (t !== 'personalizada' && !tabs.includes(t)) tabs.push(t);
    }
    return tabs;
}

function build(list) {
    return list.filter(l => l.href).map(l => ({
        n: l.n,
        id: l.href.replace(/\.html$/, ''),
        title: l.title,
        tabs: readTabs(l.href),
    }));
}

const curriculum = { en: build(readLessons('classes.html')), fr: build(readLessons('classes_fr.html')) };
const missing = [...curriculum.en, ...curriculum.fr].filter(l => !l.tabs.length).map(l => l.id);
fs.writeFileSync(path.join(ROOT, 'curriculum.json'), JSON.stringify(curriculum, null, 1) + '\n');
console.log(`✅ curriculum.json: ${curriculum.en.length} English + ${curriculum.fr.length} French lessons` +
    (missing.length ? ` (no tabs found: ${missing.join(', ')})` : ''));
