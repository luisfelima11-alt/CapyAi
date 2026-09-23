#!/usr/bin/env node
// ════════════════════════════════════════════════════════════════════════════
// testa-email.mjs — diz EM QUAL elo a entrega de e-mail quebrou
// ════════════════════════════════════════════════════════════════════════════
//
//   node scripts/testa-email.mjs luisfelima11@gmail.com
//
// Por que existe: em 16/set o SMTP do Brevo foi configurado no Supabase, o
// pedido de link devolveu HTTP 200, e NADA chegou. O log do Brevo estava
// vazio, o log de runtime da Vercel não é legível pelo CLI, e o
// /api/auth/magic-link engole todo erro num catch silencioso. Sobrou
// adivinhação.
//
// Este script bate no /api/admin/email-test, que percorre a mesma corrente e
// DEVOLVE o erro em vez de escondê-lo.
//
// Use um endereço REAL. Endereço inventado quica, e taxa de retorno alta fez o
// Supabase restringir o envio do projeto uma vez — não repetir.
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

const email = (process.argv[2] || '').toLowerCase().trim();
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.error('uso: node scripts/testa-email.mjs <email real>');
    process.exit(1);
}

const SEGREDO = env('CRON_SECRET');
const CSRF = crypto.randomBytes(24).toString('base64url');

const r = await fetch(BASE + '/api/admin/email-test', {
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
if (!r.ok) {
    console.error(`falhou: HTTP ${r.status}`);
    console.error(txt.slice(0, 300));
    process.exit(1);
}

const d = JSON.parse(txt);
console.log(`\ndestino: ${d.destino}\n`);

const linha = (nome, res) => {
    if (!res) { console.log(`  ${nome.padEnd(9)} —  (não executado)`); return; }
    const marca = res.ok ? '✓' : '✗';
    const detalhe = res.ok
        ? 'aceitou o envio'
        : [res.status, res.code, res.motivo, res.erro, res.corpo].filter(Boolean).join(' · ').slice(0, 180);
    console.log(`  ${marca} ${nome.padEnd(9)} ${detalhe}`);
};

linha('Resend', d.resend);
linha('Supabase', d.supabase);

const algumOk = (d.resend && d.resend.ok) || (d.supabase && d.supabase.ok);
console.log(algumOk
    ? '\nPelo menos um caminho aceitou. Confira a caixa (e o spam) do destino.'
    : '\nNenhum caminho entregou. O erro acima diz por quê.');

process.exit(algumOk ? 0 : 1);
