#!/usr/bin/env node
// ════════════════════════════════════════════════════════════════════════════
// senha-aluno.mjs — define a senha de um aluno, sem passar pelo admin
// ════════════════════════════════════════════════════════════════════════════
//
//   node scripts/senha-aluno.mjs luan_r_soares@hotmail.com
//
// A senha é pedida no terminal. Ela NÃO vai por argumento de linha de comando
// (ficaria no histórico do shell), NÃO é impressa, NÃO é gravada em log e NÃO
// volta na resposta da API. Vai direto para o Supabase, que faz o hash.
//
// Por que existe: a seção "Definir senha" do admin resolve isto pela tela, mas
// o admin exige uma sessão de administrador — e criar sessão depende de
// e-mail, que é justamente o que está quebrado. A ferramenta ficou trancada
// atrás do problema que ela resolve. Este script usa o CRON_SECRET, que o
// `isAdminReq` aceita como credencial de admin, e contorna o impasse.
//
// Depois de definir, o aluno entra em capyenglish.com.br com e-mail + senha.
// Senha não expira e não é de uso único — diferente do link mágico, que
// expirou duas vezes antes do Luan conseguir clicar.
//
// O CRON_SECRET sai do .env e nunca é impresso.
// ════════════════════════════════════════════════════════════════════════════

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import readline from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

const RAIZ = path.resolve(new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const BASE = 'https://www.capyenglish.com.br';

function env(chave) {
    const txt = fs.readFileSync(path.join(RAIZ, '.env'), 'utf8');
    const linha = txt.split('\n').find(l => l.trim().startsWith(chave + '='));
    if (!linha) throw new Error(`${chave} não está no .env`);
    return linha.slice(linha.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '');
}

const email = (process.argv[2] || '').toLowerCase().trim();
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.error('uso: node scripts/senha-aluno.mjs <email do aluno>');
    process.exit(1);
}

const rl = readline.createInterface({ input: stdin, output: stdout });
console.log(`\nDefinindo senha para: ${email}`);
console.log('(mínimo 8 caracteres — escolha algo que o aluno digite fácil no celular)\n');
const senha = (await rl.question('Senha: ')).trim();
rl.close();

if (senha.length < 8) {
    console.error('\nA senha precisa ter pelo menos 8 caracteres. Nada foi alterado.');
    process.exit(1);
}

const SEGREDO = env('CRON_SECRET');
const CSRF = crypto.randomBytes(24).toString('base64url');

const r = await fetch(BASE + '/api/admin/set-password', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${SEGREDO}`,
        'Content-Type': 'application/json',
        'Origin': BASE,
        'X-CSRF-Token': CSRF,
        'Cookie': `__Host-capy-csrf=${CSRF}`,
    },
    body: JSON.stringify({ email, password: senha }),
});

const txt = await r.text();
let j = null; try { j = txt ? JSON.parse(txt) : null; } catch { j = null; }

if (r.ok && j?.ok) {
    console.log(`\n✓ Senha definida para ${j.email}.`);
    console.log('\nMande para o aluno:');
    console.log(`   site:   ${BASE}`);
    console.log(`   e-mail: ${j.email}`);
    console.log('   senha:  (a que você acabou de digitar)');
    console.log('\nEle entra pela aba "Entrar", com e-mail e senha. Não expira.');
    process.exit(0);
}

console.error(`\n✗ Não deu certo (HTTP ${r.status}).`);
if (j?.error === 'conta_nao_encontrada') {
    console.error('   Esse e-mail não tem conta. Crie antes com:');
    console.error(`   node scripts/cortesias.mjs --conceder ${email}`);
} else {
    console.error('   ' + (j?.message || j?.error || txt.slice(0, 200)));
}
process.exit(1);
