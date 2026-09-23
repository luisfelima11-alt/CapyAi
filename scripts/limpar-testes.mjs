#!/usr/bin/env node
// ════════════════════════════════════════════════════════════════════════════
// limpar-testes.mjs — lista (e ajuda a remover) contas de teste
// ════════════════════════════════════════════════════════════════════════════
// Ferramenta de autor. SOMENTE LEITURA por padrão.
//
//   node scripts/limpar-testes.mjs
//
// Por que existe: em 14/set testei o fluxo de cadastro disparando ~10 signups
// com endereços inventados (`capy.fim.…@gmail.com` etc.). Endereço que não
// existe faz o e-mail quicar, e taxa de retorno alta faz o Supabase avisar o
// dono do projeto — e, no limite, desligar o envio de e-mail do projeto.
//
// Essas contas também entraram na tabela `accounts`, ou seja, aparecem como
// ALUNOS no painel. Este script mostra quais são, para poder limpar.
//
// O CRON_SECRET sai do .env e nunca é impresso.
// ════════════════════════════════════════════════════════════════════════════

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const RAIZ = path.resolve(new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const BASE = 'https://www.capyenglish.com.br';

function env(chave) {
    const txt = fs.readFileSync(path.join(RAIZ, '.env'), 'utf8');
    const linha = txt.split('\n').find(l => l.trim().startsWith(chave + '='));
    if (!linha) throw new Error(`${chave} não está no .env`);
    return linha.slice(linha.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '');
}

const SEGREDO = env('CRON_SECRET');
const CSRF = crypto.randomBytes(24).toString('base64url');

const r = await fetch(BASE + '/api/admin/students', {
    headers: {
        'Authorization': `Bearer ${SEGREDO}`,
        'Origin': BASE,
        'X-CSRF-Token': CSRF,
        'Cookie': `__Host-capy-csrf=${CSRF}`,
    },
});
if (!r.ok) { console.error('falhou:', r.status, (await r.text()).slice(0, 160)); process.exit(1); }
const { students = [] } = await r.json();

// Padrões que só um teste automático geraria. Deliberadamente estreito: é
// melhor deixar um teste passar batido do que sugerir apagar um aluno real.
const EH_TESTE = e => /^(capy\.(fim|prop|conf|diag)\.\d+@|diag-\d+@|teste\d*@)/i.test(String(e || ''));

const lixo = students.filter(s => EH_TESTE(s.email));
const reais = students.filter(s => !EH_TESTE(s.email));

console.log(`contas no total : ${students.length}`);
console.log(`alunos de verdade: ${reais.length}`);
console.log(`cadastros de teste: ${lixo.length}`);
if (lixo.length) {
    console.log('\nPara apagar (Supabase → Authentication → Users → busque e delete):');
    lixo.forEach(s => console.log('   ' + s.email));
}
console.log('\nAlunos de verdade, para conferir que nenhum entrou na lista acima:');
reais.forEach(s => console.log('   ' + (s.email || '(sem e-mail)')));
