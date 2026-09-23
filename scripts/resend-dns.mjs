#!/usr/bin/env node
// ════════════════════════════════════════════════════════════════════════════
// resend-dns.mjs — os registros de DNS que faltam para o e-mail voltar a sair
// ════════════════════════════════════════════════════════════════════════════
// Ferramenta de autor. Não é deployada (o vercel.json bloqueia /scripts/*).
//
//   node scripts/resend-dns.mjs             mostra o estado e os registros
//   node scripts/resend-dns.mjs --criar     registra o domínio no Resend
//   node scripts/resend-dns.mjs --verificar manda o Resend conferir o DNS
//
// Por que existe: o Resend recusa todo envio com 403 porque
// `capyenglish.com.br` não está verificado. Isso derruba o login por link
// mágico, o lembrete diário por e-mail e o convite de cortesia — três
// funcionalidades, uma causa. Ver BUGS-APRENDIDOS.md (2026-09-03).
//
// A parte que NÃO dá para automatizar: o DNS do domínio está no Registro.br
// (nameservers a.sec.dns.br / c.sec.dns.br), que não tem CLI nem API pública
// de zona. Colar os registros lá é manual, e exige login com CPF — por isso
// este script para de fazer o trabalho exatamente ali, e entrega a tabela
// pronta em vez de mandar alguém "procurar os registros SPF/DKIM".
//
// A chave sai do .env.producao (baixado com `vercel env pull`) e nunca é
// impressa.
// ════════════════════════════════════════════════════════════════════════════

import fs from 'node:fs';
import path from 'node:path';

const RAIZ = path.resolve(new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const DOMINIO = 'capyenglish.com.br';

function env(chave) {
    for (const arq of ['.env.producao', '.env.local', '.env']) {
        const p = path.join(RAIZ, arq);
        if (!fs.existsSync(p)) continue;
        const linha = fs.readFileSync(p, 'utf8').split('\n')
            .find(l => l.trim().startsWith(chave + '='));
        if (linha) return linha.slice(linha.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '');
    }
    throw new Error(`${chave} não encontrada. Rode: npx vercel env pull .env.producao --environment=production`);
}

const CHAVE = env('RESEND_API_KEY');

// A Vercel REDIGE valores sensíveis no `env pull`: o arquivo baixado vem com
// as chaves presentes e os valores vazios. Sem esta checagem o script manda um
// Bearer vazio e o Resend responde "API key is invalid" — mensagem que faz
// qualquer um concluir que a chave está errada, quando na verdade ela nem foi
// lida. Custou uma investigação inteira; não deixe isso acontecer de novo.
if (!CHAVE || !CHAVE.startsWith('re_')) {
    console.error('RESEND_API_KEY não veio utilizável' + (CHAVE ? ' (valor não começa com "re_")' : ' (vazia)') + '.');
    console.error('');
    console.error('Provável causa: `vercel env pull` redige valores sensíveis — o arquivo');
    console.error('baixado tem os NOMES das variáveis, mas não os valores.');
    console.error('');
    console.error('Para rodar este script, cole a chave no .env local:');
    console.error('   RESEND_API_KEY=re_...   (pegue em resend.com/api-keys)');
    process.exit(1);
}

async function resend(caminho, opts = {}) {
    const r = await fetch('https://api.resend.com' + caminho, {
        ...opts,
        headers: { Authorization: `Bearer ${CHAVE}`, 'Content-Type': 'application/json', ...(opts.headers || {}) },
    });
    const txt = await r.text();
    let j = null; try { j = txt ? JSON.parse(txt) : null; } catch { j = txt; }
    return { status: r.status, body: j };
}

const lista = await resend('/domains');
if (lista.status !== 200) {
    console.error(`Resend respondeu ${lista.status}:`, JSON.stringify(lista.body).slice(0, 200));
    process.exit(1);
}

const dominios = lista.body?.data || [];
let alvo = dominios.find(d => d.name === DOMINIO);

console.log(`domínios no Resend: ${dominios.length}`);
dominios.forEach(d => console.log(`   ${d.name.padEnd(26)} ${d.status}  (região ${d.region})`));

if (!alvo && process.argv.includes('--criar')) {
    const novo = await resend('/domains', { method: 'POST', body: JSON.stringify({ name: DOMINIO, region: 'sa-east-1' }) });
    if (novo.status >= 300) {
        console.error(`falhou ao criar (${novo.status}):`, JSON.stringify(novo.body).slice(0, 300));
        process.exit(1);
    }
    alvo = novo.body;
    console.log(`\n${DOMINIO} registrado no Resend.`);
}

if (!alvo) {
    console.log(`\n${DOMINIO} ainda NÃO está no Resend. Rode com --criar para registrar.`);
    process.exit(0);
}

const det = await resend(`/domains/${alvo.id}`);
const d = det.body || alvo;

if (process.argv.includes('--verificar')) {
    const v = await resend(`/domains/${alvo.id}/verify`, { method: 'POST' });
    console.log(`\npedido de verificação: ${v.status === 200 ? 'enviado' : 'falhou ' + v.status}`);
    console.log('O Resend leva alguns minutos. Rode de novo sem --verificar para ver o status.');
}

console.log(`\nstatus de ${DOMINIO}: ${d.status}`);
if (d.status === 'verified') {
    console.log('=> VERIFICADO. O e-mail volta a sair sozinho.');
    process.exit(0);
}

console.log('\n=== COLE ESTES REGISTROS NO REGISTRO.BR ===');
console.log('(painel do domínio → DNS → Editar zona)\n');
for (const r of d.records || []) {
    console.log(`  tipo  : ${r.type}`);
    console.log(`  nome  : ${r.name || '@'}`);
    console.log(`  valor : ${r.value}`);
    if (r.priority != null) console.log(`  prior.: ${r.priority}`);
    console.log(`  status: ${r.status}`);
    console.log('');
}
console.log('Depois de colar e esperar propagar, rode:');
console.log('  node scripts/resend-dns.mjs --verificar');
