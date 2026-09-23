#!/usr/bin/env node
// ════════════════════════════════════════════════════════════════════════════
// foto-streaks.mjs — retrato das streaks, para provar que a migração de fuso
// não quebrou a de ninguém
// ════════════════════════════════════════════════════════════════════════════
// Ferramenta de autor. SOMENTE LEITURA. Não é deployada (o vercel.json bloqueia
// /scripts/*).
//
//   node scripts/foto-streaks.mjs              tira a foto e salva
//   node scripts/foto-streaks.mjs --comparar   compara as duas fotos mais novas
//
// Por que existe: o `store.js` datava o dia do aluno em UTC, então a streak
// virava às 21h de Brasília. Corrigir isso mexe na regra que decide quem perde
// streak — e a única forma honesta de dizer "ninguém perdeu" é ter o número de
// antes. Tirar uma foto ANTES do deploy e outra 24h DEPOIS.
//
// Vai pela API de produção (`/api/admin/students`), não direto no Supabase: as
// chaves do banco não estão no .env local, só na Vercel. E usar o mesmo
// endpoint que o painel usa garante que este script não discorde do admin.
//
// O CRON_SECRET sai do .env e nunca é impresso.
// ════════════════════════════════════════════════════════════════════════════

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const RAIZ = path.resolve(new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const BASE = 'https://www.capyenglish.com.br';
const PASTA = path.join(RAIZ, 'scripts');

function env(chave) {
    const txt = fs.readFileSync(path.join(RAIZ, '.env'), 'utf8');
    const linha = txt.split('\n').find(l => l.trim().startsWith(chave + '='));
    if (!linha) throw new Error(`${chave} não está no .env`);
    return linha.slice(linha.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '');
}

// Mesmo esquema do cortesias.mjs: o assertCsrf é de duplo envio, pensado para
// navegador. Fora dele quem chama controla os dois lados, então basta mandar o
// mesmo valor nos dois. A autorização real é o Bearer, conferido pelo isAdminReq.
const SEGREDO = env('CRON_SECRET');
const CSRF = crypto.randomBytes(24).toString('base64url');

async function api(caminho) {
    const r = await fetch(BASE + caminho, {
        headers: {
            'Authorization': `Bearer ${SEGREDO}`,
            'Content-Type': 'application/json',
            'Origin': BASE,
            'X-CSRF-Token': CSRF,
            'Cookie': `__Host-capy-csrf=${CSRF}`,
        },
    });
    const t = await r.text();
    let j = null; try { j = t ? JSON.parse(t) : null; } catch { j = t; }
    if (!r.ok) throw new Error(`${r.status} ${JSON.stringify(j).slice(0, 200)}`);
    return j;
}

const fotos = () => fs.readdirSync(PASTA)
    .filter(f => /^_foto-streaks-.*\.json$/.test(f))
    .sort();

// ── Comparar ────────────────────────────────────────────────────────────────
if (process.argv.includes('--comparar')) {
    const arqs = fotos();
    if (arqs.length < 2) {
        console.error(`Preciso de 2 fotos, achei ${arqs.length}. Rode sem --comparar antes e depois do deploy.`);
        process.exit(1);
    }
    const [antesArq, depoisArq] = arqs.slice(-2);
    const antes = JSON.parse(fs.readFileSync(path.join(PASTA, antesArq), 'utf8'));
    const depois = JSON.parse(fs.readFileSync(path.join(PASTA, depoisArq), 'utf8'));
    const porId = Object.fromEntries(antes.alunos.map(a => [a.id, a]));

    console.log(`antes : ${antesArq}  (${antes.tiradaEm})`);
    console.log(`depois: ${depoisArq}  (${depois.tiradaEm})\n`);

    // Perder streak pode ser LEGÍTIMO: o aluno simplesmente não praticou. O que
    // este script separa é quem caiu tendo praticado recentemente — esse é o
    // padrão que a migração de fuso produziria se estivesse errada.
    const caiu = [], subiu = [], suspeitos = [];
    for (const d of depois.alunos) {
        const a = porId[d.id];
        if (!a) continue;
        if (d.streakDays < a.streakDays) {
            caiu.push({ nome: d.name, de: a.streakDays, para: d.streakDays, ultimaPratica: a.lastPractice });
            // Caiu apesar de ter praticado no dia da foto anterior ou no seguinte.
            if (a.daysSincePractice !== null && a.daysSincePractice <= 1) {
                suspeitos.push(`${d.name}: ${a.streakDays} -> ${d.streakDays} (praticou ha ${a.daysSincePractice}d)`);
            }
        } else if (d.streakDays > a.streakDays) {
            subiu.push(`${d.name}: ${a.streakDays} -> ${d.streakDays}`);
        }
    }

    console.log(`alunos: ${antes.alunos.length} -> ${depois.alunos.length}`);
    console.log(`streak subiu : ${subiu.length}`);
    console.log(`streak caiu  : ${caiu.length}`);
    caiu.forEach(c => console.log(`   ${c.nome}: ${c.de} -> ${c.para} (ultima pratica ${c.ultimaPratica || '-'})`));
    console.log();
    if (suspeitos.length) {
        console.log('=> SUSPEITO: caiu apesar de ter praticado ha <=1 dia. Investigar.');
        suspeitos.forEach(s => console.log('   ' + s));
        process.exit(1);
    }
    console.log('=> nenhuma queda suspeita: quem caiu estava mesmo sem praticar ha 2+ dias');
    process.exit(0);
}

// ── Tirar a foto ────────────────────────────────────────────────────────────
const d = await api('/api/admin/students');
const foto = {
    tiradaEm: new Date().toISOString(),
    diaBR: new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' }),
    resumo: d.summary,
    alunos: (d.students || []).map(s => ({
        id: s.id, name: s.name, streakDays: s.streakDays, xp: s.xp,
        lastPractice: s.lastPractice, daysSincePractice: s.daysSincePractice,
        status: s.status, hasPush: s.hasPush,
    })),
};

const nome = `_foto-streaks-${foto.tiradaEm.replace(/[:.]/g, '-')}.json`;
fs.writeFileSync(path.join(PASTA, nome), JSON.stringify(foto, null, 2));

const comStreak = foto.alunos.filter(a => a.streakDays > 0);
console.log(`foto salva: scripts/${nome}`);
console.log(`dia BR: ${foto.diaBR}`);
console.log(`alunos: ${foto.alunos.length} | com streak viva: ${comStreak.length} | com push: ${foto.alunos.filter(a => a.hasPush).length}`);
if (comStreak.length) {
    console.log('streaks vivas: ' + comStreak
        .sort((a, b) => b.streakDays - a.streakDays)
        .map(a => `${a.name}=${a.streakDays}`).join(', '));
}
