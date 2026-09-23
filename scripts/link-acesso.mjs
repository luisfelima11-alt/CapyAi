#!/usr/bin/env node
// ════════════════════════════════════════════════════════════════════════════
// link-acesso.mjs — gera um link de entrada para um aluno
// ════════════════════════════════════════════════════════════════════════════
// Ferramenta de autor. Não é deployada (o vercel.json bloqueia /scripts/*).
//
//   node scripts/link-acesso.mjs <email>
//
// Por que existe: o login do site é SÓ por link mágico por e-mail, e o e-mail
// está morto — o Resend recusa com 403 (domínio não verificado no DNS) e o
// SMTP do Supabase também não entregou. Enquanto isso não se resolve, um aluno
// que não consegue entrar não tem caminho nenhum.
//
// Isto bate no /api/admin/login-link, o mesmo que o botão da aba Alunos usa.
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

const email = (process.argv[2] || '').toLowerCase().trim();
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.error('uso: node scripts/link-acesso.mjs <email>');
    process.exit(1);
}

const SEGREDO = env('CRON_SECRET');
const CSRF = crypto.randomBytes(24).toString('base64url');

const r = await fetch(BASE + '/api/admin/login-link', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${SEGREDO}`,
        'Content-Type': 'application/json',
        'Origin': BASE,
        'X-CSRF-Token': CSRF,
        'Cookie': `__Host-capy-csrf=${CSRF}`,
    },
    body: JSON.stringify({ email }),
});
const txt = await r.text();
let j = null; try { j = JSON.parse(txt); } catch { j = txt; }

if (!r.ok || !j?.ok) {
    console.error(`falhou (${r.status}):`, typeof j === 'string' ? j.slice(0, 200) : JSON.stringify(j));
    if (j?.error === 'conta_nao_encontrada') {
        console.error('\nEsse e-mail não tem conta. Para criar junto com a cortesia:');
        console.error(`   node scripts/cortesias.mjs --conceder ${email}`);
    }
    process.exit(1);
}

console.log(`${j.name} <${email}>`);
if (j.aviso) console.log(j.aviso);

// O `loginUrl` aponta direto para o /api/auth/callback, e esse endereço é de
// USO ÚNICO: a primeira requisição queima o token. WhatsApp, Telegram e
// Outlook ABREM a URL sozinhos para montar a pré-visualização do link — o
// aluno então recebe `otp_expired` num link que nunca chegou a usar. Foi o que
// aconteceu com o Luan em 19/set/2026.
//
// Por isso entregamos o /entrar.html, que é inofensivo de abrir: ele só
// carrega um botão, e apenas o CLIQUE navega para o callback. Robô de preview
// não clica.
const hash = (String(j.loginUrl).match(/token_hash=([a-f0-9]+)/i) || [])[1];
if (hash) {
    console.log(`${BASE}/entrar.html?t=${hash}`);
} else {
    // Formato inesperado: melhor entregar o que veio do que não entregar nada.
    console.log(j.loginUrl);
    console.log('(aviso: não consegui extrair o token; este link pode queimar na pré-visualização)');
}
