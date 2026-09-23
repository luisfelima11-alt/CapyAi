#!/usr/bin/env node
// ════════════════════════════════════════════════════════════════════════════
// cortesias.mjs — quem tem cortesia, e promover todos para o melhor plano
// ════════════════════════════════════════════════════════════════════════════
// Ferramenta de autor. Não é deployada (o vercel.json bloqueia /scripts/*).
//
//   node scripts/cortesias.mjs             SÓ LÊ. Mostra o que mudaria.
//   node scripts/cortesias.mjs --promover  ESCREVE. Passa as cortesias → 'super'.
//
// Vai pela API de produção, NÃO direto no Supabase, por dois motivos:
//  1. as chaves do Supabase não estão no .env local, só na Vercel;
//  2. o /api/admin/grant-plan chama writeSecurityAudit — a escrita fica
//     registrada. Ir direto na tabela burlaria a auditoria.
//
// Uma cortesia é um perfil com plan 'pro'/'super' e SEM kiwify_subscription_id
// (api/index.js:2292). Usar a mesma definição do endpoint é o que impede este
// script de discordar do que o admin.html mostra.
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

// O assertCsrf compara o cookie com o header (duplo envio) — proteção pensada
// para navegador, onde o atacante não lê o cookie. Fora do navegador quem faz
// a chamada controla os dois lados, então basta mandar o mesmo valor nos dois.
// A autorização de verdade aqui é o Bearer, conferido pelo isAdminReq.
const CSRF = crypto.randomBytes(24).toString('base64url');

async function api(caminho, opts = {}) {
    const r = await fetch(BASE + caminho, {
        ...opts,
        headers: {
            'Authorization': `Bearer ${SEGREDO}`,
            'Content-Type': 'application/json',
            'Origin': BASE,                            // assertOrigin
            'X-CSRF-Token': CSRF,
            'Cookie': `__Host-capy-csrf=${CSRF}`,
            ...(opts.headers || {}),
        },
    });
    const t = await r.text();
    let j = null; try { j = t ? JSON.parse(t) : null; } catch { j = t; }
    if (!r.ok) throw new Error(`${r.status} ${JSON.stringify(j).slice(0, 200)}`);
    return j;
}

const listar = async () => (await api('/api/admin/courtesies')).courtesies || [];

// --conceder <email>: cria/promove uma cortesia nova direto no melhor plano.
// Sem expiresAt de propósito — cortesia nova nasce sem prazo (2099), que é o
// default do endpoint.
const iConceder = process.argv.indexOf('--conceder');
if (iConceder >= 0) {
    const email = (process.argv[iConceder + 1] || '').toLowerCase().trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { console.error('e-mail inválido'); process.exit(1); }
    const r = await api('/api/admin/grant-plan', { method: 'POST', body: JSON.stringify({ email, plan: 'super' }) });
    console.log(`${email} → ${r?.profile?.plan} (conta ${r?.accountCreated ? 'CRIADA agora' : 'já existia'})`);
    // Entregar via /entrar.html: o callback é de uso único e o robô de
    // pré-visualização do WhatsApp queima o token antes do aluno clicar.
    if (r?.loginUrl) {
        const hash = (String(r.loginUrl).match(/token_hash=([a-f0-9]+)/i) || [])[1];
        console.log(`link de acesso (uso único, mande agora): ${hash ? `${BASE}/entrar.html?t=${hash}` : r.loginUrl}`);
    }
    const conf = (await listar()).find(c => c.email === email);
    console.log(conf ? `conferido no servidor: ${conf.plan}, expira ${conf.expiresAt}` : 'ATENÇÃO: não apareceu na lista de cortesias');
    process.exit(conf?.plan === 'super' ? 0 : 1);
}

const antes = await listar();
const paraPromover = antes.filter(c => c.plan !== 'super');
const jaSuper = antes.filter(c => c.plan === 'super');

console.log(`\n${antes.length} cortesia(s) ativa(s): ${jaSuper.length} já em super, ${paraPromover.length} a promover\n`);
for (const c of antes) {
    console.log(`  ${c.plan === 'super' ? '  já super' : '→ PROMOVER'}  ${String(c.plan).padEnd(5)}  ${String(c.email || '(sem e-mail)').padEnd(34)} expira: ${c.expiresAt || 'sem prazo'}`);
}

if (!process.argv.includes('--promover')) {
    console.log('\nNada foi alterado. Para aplicar: node scripts/cortesias.mjs --promover');
    process.exit(0);
}
if (!paraPromover.length) { console.log('\nNada a fazer.'); process.exit(0); }

console.log(`\nPromovendo ${paraPromover.length}...`);
let ok = 0;
for (const c of paraPromover) {
    if (!c.email) { console.error(`  ✗ cortesia sem e-mail, impossível promover pelo endpoint`); continue; }
    try {
        // Repassa o prazo que já existia: quem tinha validade continua com a
        // mesma, só melhora de plano. Omitir expiresAt jogaria todos para 2099.
        const corpo = { email: c.email, plan: 'super' };
        if (c.expiresAt) corpo.expiresAt = c.expiresAt;
        const r = await api('/api/admin/grant-plan', { method: 'POST', body: JSON.stringify(corpo) });
        console.log(`  ✓ ${c.email} → ${r?.profile?.plan || '?'}`);
        ok++;
    } catch (e) {
        console.error(`  ✗ ${c.email}: ${e.message}`);
    }
}

// Reler do servidor em vez de confiar no que acabei de mandar.
const depois = await listar();
const aindaFora = depois.filter(c => c.plan !== 'super');
console.log(`\npromovidos: ${ok}/${paraPromover.length} · conferido no servidor: ${depois.length} cortesias, ${aindaFora.length} fora do super`);
if (aindaFora.length) { console.log('AINDA FORA:', aindaFora.map(c => c.email).join(', ')); process.exit(1); }
console.log('todas as cortesias estão no melhor plano.');
