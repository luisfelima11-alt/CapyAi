'use strict';

// `npm audit --audit-level=high` with a short list of dated exceptions.
//
// What the site runs (the production dependencies) gets no exception: any high
// or critical advisory there fails. An exception covers one advisory in one
// package that only the dev tools reach (Tailwind, Playwright), and only until
// its date; after that the check fails again and someone has to look.
const { execFileSync } = require('child_process');

const EXCECOES = [
  {
    id: 'GHSA-vfj7-8cjw-p6xm',
    pacote: 'braces',
    ate: '2026-12-31',
    motivo: 'no fixed braces release yet; it only arrives through tailwindcss 3 (dev), which builds '
      + 'assets/css/security-pages.css from fixed paths in the repo and never runs in production',
  },
];

const GRAVES = new Set(['high', 'critical']);

// Advisories at high or critical in an `npm audit --json` report, one per id.
function avisosGraves(relatorio) {
  const avisos = new Map();
  for (const v of Object.values((relatorio && relatorio.vulnerabilities) || {})) {
    for (const via of v.via || []) {
      if (!via || typeof via !== 'object' || !GRAVES.has(via.severity)) continue;
      const id = String(via.url || '').split('/').pop() || String(via.source || via.title);
      avisos.set(id, { id, pacote: via.name, titulo: via.title, gravidade: via.severity });
    }
  }
  return [...avisos.values()];
}

// The advisories that fail the check. `hoje` is YYYY-MM-DD.
function avaliar(completo, producao, hoje, excecoes = EXCECOES) {
  // A report that could not be made (registry down, broken lockfile) fails; it is not a pass.
  for (const r of [completo, producao]) {
    if (!r || r.error || !r.vulnerabilities) {
      const porque = (r && r.error && (r.error.summary || r.error.code)) || 'no report';
      return [{ id: 'npm-audit', pacote: '-', titulo: 'npm audit did not run', gravidade: 'high', porque }];
    }
  }
  const falhas = avisosGraves(producao).map(a => ({ ...a, porque: 'it reaches the production dependencies' }));
  for (const a of avisosGraves(completo)) {
    if (falhas.some(f => f.id === a.id)) continue;
    const ex = excecoes.find(e => e.id === a.id && e.pacote === a.pacote);
    if (!ex) falhas.push({ ...a, porque: 'no exception' });
    else if (hoje > ex.ate) falhas.push({ ...a, porque: `the exception ended on ${ex.ate}` });
  }
  return falhas;
}

function auditar(extra = []) {
  try {
    return JSON.parse(execFileSync('npm', ['audit', '--json', ...extra], {
      encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024,
    }));
  } catch (e) {
    // npm audit exits 1 when it finds anything; the report is still on stdout.
    try { return JSON.parse(e.stdout); } catch (_) { return { error: { summary: String(e.message || e).slice(0, 200) } }; }
  }
}

if (require.main === module) {
  const hoje = new Date().toISOString().slice(0, 10);
  const completo = auditar();
  const producao = auditar(['--omit=dev']);
  const falhas = avaliar(completo, producao, hoje);
  const graves = avisosGraves(completo);
  for (const ex of completo.vulnerabilities ? EXCECOES : []) {
    const aviso = graves.find(a => a.id === ex.id && a.pacote === ex.pacote);
    if (!aviso) console.log(`exception no longer needed, remove it: ${ex.id} (${ex.pacote})`);
    else if (!falhas.some(f => f.id === ex.id)) console.log(`exception until ${ex.ate}: ${ex.id} (${ex.pacote}): ${ex.motivo}`);
  }
  if (falhas.length) {
    for (const f of falhas) console.error(`${f.gravidade}: ${f.id} (${f.pacote}) ${f.titulo}: ${f.porque}`);
    process.exit(1);
  }
  console.log('npm audit: no high or critical advisory outside the dated exceptions.');
}

module.exports = { _internos: { avisosGraves, avaliar, EXCECOES } };
