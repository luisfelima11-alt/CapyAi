const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const logPath = path.join(root, 'AUTOMATION_LOG.md');

const entry = `## [2026-07-23T00:00:00-04:00] — SUCESSO
- Capítulo: 22 "Academic & Legal English"
- Lições criadas: 101 "Academic English & Essay Writing", 102 "Legal English for Everyday Life"
- Validação: todas passaram (sintaxe 3+2 blocos, IDs únicos, paridade TRAIL<->JADSON_LESSONS 102 lições, TRAIL_GAMES ok, schema 4 verbs/30 vocab/4 expressions/8 sentences/4 grammar rows/5 quiz/5 speak, sem duplicidade de título, zero mojibake, dev-server respondeu 200 em learn.html e lessons.html)
- Deploy: publicado em produção, confirmado (www.capyenglish.com.br/learn.html e lessons.html contêm os novos títulos; alias de domínio precisou ser reapontado manualmente para o novo deployment via \`vercel alias set\`, pois \`vercel --prod --force\` não atualizou www.capyenglish.com.br/capyenglish.com.br automaticamente — ficaram presos a um deployment de 73 dias atrás)
---

`;

const existing = fs.existsSync(logPath) ? fs.readFileSync(logPath, 'utf8') : '# Automation Log\n\n';
let newContent;
if (existing.startsWith('# Automation Log')) {
  const headerEnd = existing.indexOf('\n\n') + 2;
  newContent = existing.slice(0, headerEnd) + entry + existing.slice(headerEnd);
} else {
  newContent = '# Automation Log\n\n' + entry + existing;
}
fs.writeFileSync(logPath, newContent, 'utf8');
console.log('Log written.');
