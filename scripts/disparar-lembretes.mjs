#!/usr/bin/env node
// ════════════════════════════════════════════════════════════════════════════
// disparar-lembretes.mjs — roda o cron diário à mão e mostra o resultado
// ════════════════════════════════════════════════════════════════════════════
// Ferramenta de autor. Não é deployada (o vercel.json bloqueia /scripts/*).
//
//   node scripts/disparar-lembretes.mjs
//
// O cron roda sozinho às 19h de Brasília. Isto serve para conferir o efeito de
// uma mudança sem esperar o dia seguinte.
//
// ATENÇÃO: isto ENVIA notificação de verdade para quem não praticou hoje.
// Com 9 alunos e 1 com push, o alcance é pequeno — mas não é um "dry run".
//
// O CRON_SECRET sai do .env e nunca é impresso.
// ════════════════════════════════════════════════════════════════════════════

import fs from 'node:fs';
import path from 'node:path';

const RAIZ = path.resolve(new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));

function env(chave) {
    const txt = fs.readFileSync(path.join(RAIZ, '.env'), 'utf8');
    const linha = txt.split('\n').find(l => l.trim().startsWith(chave + '='));
    if (!linha) throw new Error(`${chave} não está no .env`);
    return linha.slice(linha.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '');
}

const r = await fetch('https://www.capyenglish.com.br/api/send-reminders', {
    headers: { Authorization: `Bearer ${env('CRON_SECRET')}` },
});
const j = await r.json();

if (!j.ok) { console.error(`falhou (${r.status}):`, JSON.stringify(j).slice(0, 200)); process.exit(1); }

console.log(`data (Brasília)      : ${j.date}`);
console.log(`alunos considerados  : ${j.totalUsers}`);
console.log(`já praticaram (pulos): ${j.skipped}`);
console.log(`push enviado         : ${j.pushed}`);
console.log(`e-mail enviado       : ${j.emailed}`);
console.log(`nunca começaram      : ${j.nudgedNewcomers}`);
console.log(`erros                : ${j.errors}`);
console.log(`inscrições podadas   : ${j.podadas ?? 0}`);

// O `totalUsers` costumava contar linhas de serviço (mem_*, __analytics_*) como
// se fossem alunos. Se voltar a inflar, é regressão do filtro `ehAluno`.
if (j.totalUsers > 200) console.warn('\n⚠️  totalUsers alto demais — o filtro de linhas sintéticas pode ter quebrado.');
if (j.errors > 0) console.warn('\n⚠️  houve erro: rode `npx vercel logs www.capyenglish.com.br` e procure [send-reminders].');
