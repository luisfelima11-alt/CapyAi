#!/usr/bin/env node
// ════════════════════════════════════════════════════════════════════════════
// gen-dialogo-assets.mjs — gera imagem e áudio de QUALQUER aula do modelo novo
// ════════════════════════════════════════════════════════════════════════════
// Generalização do gen-aula09-assets.mjs. A fonte continua sendo um único
// scripts/<slug>-dialogo.json por aula, que também alimenta o HTML — é o que
// impede o áudio de dessincronizar do texto.
//
//   node scripts/gen-dialogo-assets.mjs --imagem interview01
//   node scripts/gen-dialogo-assets.mjs --imagem interview02 --ref interview01
//   node scripts/gen-dialogo-assets.mjs --audio  interview01 interview02 ...
//   node scripts/gen-dialogo-assets.mjs --lista
//
// --ref <slug> usa a imagem JÁ GERADA de outra aula como referência visual
// (endpoint /images/edits, input_fidelity:high). É o que mantém a MESMA sala e
// a MESMA pessoa nas 8 aulas de entrevista: sem isso o aluno vê oito
// entrevistas diferentes em vez de uma conversa só.
//
// Idempotente de propósito: arquivo que já existe não é regerado, porque
// regerar custa dinheiro. Para refazer, apague o arquivo na mão.
// ════════════════════════════════════════════════════════════════════════════

import fs from 'node:fs';
import path from 'node:path';

const RAIZ = path.resolve(new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));

function chaveDoEnv() {
    const env = fs.readFileSync(path.join(RAIZ, '.env'), 'utf8');
    const linha = env.split('\n').find(l => l.trim().startsWith('OPENAI_API_KEY='));
    if (!linha) throw new Error('OPENAI_API_KEY não está no .env');
    return linha.slice(linha.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '');
}
const CHAVE = chaveDoEnv();

function carregar(slug) {
    const p = path.join(RAIZ, 'scripts', `${slug}-dialogo.json`);
    if (!fs.existsSync(p)) throw new Error(`não existe: scripts/${slug}-dialogo.json`);
    return JSON.parse(fs.readFileSync(p, 'utf8'));
}

// pasta de áudio: gpstronic aula 9 → gps09 (já existe assim no repo);
// qualquer outro curso → <curso><NN>
function pastaAudio(d) {
    const nn = String(d.aula).padStart(2, '0');
    return d.curso === 'gpstronic' ? `gps${nn}` : `${d.curso}${nn}`;
}

// ── Imagem ─────────────────────────────────────────────────────────────────
async function gerarImagem(slug, refSlug) {
    const d = carregar(slug);
    const destino = path.join(RAIZ, d.imagem.arquivo);
    fs.mkdirSync(path.dirname(destino), { recursive: true });
    if (fs.existsSync(destino) && fs.statSync(destino).size > 10000) {
        console.log(`  · ${slug}: já existe (${(fs.statSync(destino).size / 1024).toFixed(0)}KB) — apague para regerar`);
        return;
    }

    let r;
    if (refSlug) {
        const ref = path.join(RAIZ, carregar(refSlug).imagem.arquivo);
        if (!fs.existsSync(ref)) throw new Error(`referência ainda não gerada: ${ref}`);
        const fd = new FormData();
        fd.append('model', 'gpt-image-1');
        fd.append('image[]', new Blob([fs.readFileSync(ref)], { type: 'image/png' }), 'ref.png');
        fd.append('prompt', d.imagem.prompt);
        fd.append('size', '1536x1024');
        fd.append('quality', 'medium');
        fd.append('input_fidelity', 'high');
        fd.append('n', '1');
        r = await fetch('https://api.openai.com/v1/images/edits', {
            method: 'POST', headers: { Authorization: `Bearer ${CHAVE}` }, body: fd,
        });
    } else {
        r = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: { Authorization: `Bearer ${CHAVE}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ model: 'gpt-image-1', prompt: d.imagem.prompt, size: '1536x1024', quality: 'medium', n: 1 }),
        });
    }

    const j = await r.json();
    if (!r.ok) throw new Error(`${slug} HTTP ${r.status}: ${JSON.stringify(j).slice(0, 400)}`);
    const b64 = j?.data?.[0]?.b64_json;
    if (!b64) throw new Error(`${slug}: resposta sem b64_json: ${JSON.stringify(j).slice(0, 300)}`);
    fs.writeFileSync(destino, Buffer.from(b64, 'base64'));
    console.log(`  ✓ ${slug}: ${d.imagem.arquivo} · ${(fs.statSync(destino).size / 1024).toFixed(0)}KB${refSlug ? `  (ref: ${refSlug})` : ''}`);
}

// ── Áudio ──────────────────────────────────────────────────────────────────
// Um mp3 por fala, não um arquivo concatenado: o botão 🔊 de cada bolha
// reaproveita o mesmo arquivo, dá pra destacar a fala tocando, e pular é trivial.
// Modelo de voz. Até 25/set/2026 era o `tts-1`, o mais simples da OpenAI. O
// Luis pediu áudio melhor, e comparamos as mesmas falas em três versões: tts-1,
// gpt-4o-mini-tts e ElevenLabs via Higgsfield. Ficou o gpt-4o-mini-tts: bem mais
// natural, mantém as vozes do curso (nova/onyx) e aceita INSTRUÇÃO — dá para
// pedir inglês claro e um pouco mais lento, o que importa para aluno A2.
// O `speed` só existe no tts-1; no modelo novo o ritmo vai pela instrução.
// Áudio já gerado continua como está: o script não regrava arquivo existente.
const MODELO_TTS = process.env.CAPY_TTS_MODEL || 'gpt-4o-mini-tts';
const INSTRUCAO_TTS = 'Speak in clear, natural American English, a little slower than normal, '
    + 'warm and friendly, like a real conversation at work. '
    + 'The listeners are Brazilian adults learning English at a basic level.';
function corpoTTS(voz, texto) {
    const corpo = { model: MODELO_TTS, voice: voz, input: texto };
    if (MODELO_TTS === 'tts-1' || MODELO_TTS === 'tts-1-hd') corpo.speed = 0.95;
    else corpo.instructions = INSTRUCAO_TTS;
    return corpo;
}

async function gerarAudio(slug) {
    const d = carregar(slug);
    const dir = path.join(RAIZ, 'assets/audio', pastaAudio(d));
    fs.mkdirSync(dir, { recursive: true });
    let feitos = 0, pulados = 0, falhas = 0;

    for (const [i, linha] of d.linhas.entries()) {
        const nome = `s${String(i + 1).padStart(2, '0')}.mp3`;
        const destino = path.join(dir, nome);
        if (fs.existsSync(destino) && fs.statSync(destino).size > 1000) { pulados++; continue; }
        const voz = d.vozes[linha.who];
        if (!voz) { console.error(`  ✗ ${nome}: personagem "${linha.who}" sem voz em vozes{}`); falhas++; continue; }
        const r = await fetch('https://api.openai.com/v1/audio/speech', {
            method: 'POST',
            headers: { Authorization: `Bearer ${CHAVE}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(corpoTTS(voz, linha.en)),
        });
        if (!r.ok) { console.error(`  ✗ ${nome}: HTTP ${r.status} ${(await r.text()).slice(0, 120)}`); falhas++; continue; }
        fs.writeFileSync(destino, Buffer.from(await r.arrayBuffer()));
        feitos++;
    }
    console.log(`  ${pastaAudio(d).padEnd(12)} ${feitos} gerados · ${pulados} já existiam · ${falhas} falhas`);
    return falhas;
}

// ── CLI ────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const refIdx = args.indexOf('--ref');
const ref = refIdx >= 0 ? args[refIdx + 1] : null;
const slugs = args.filter((a, i) => !a.startsWith('--') && i !== refIdx + 1);

if (args.includes('--lista')) {
    for (const f of fs.readdirSync(path.join(RAIZ, 'scripts')).filter(f => /-dialogo\.json$/.test(f)).sort()) {
        const d = JSON.parse(fs.readFileSync(path.join(RAIZ, 'scripts', f), 'utf8'));
        const img = fs.existsSync(path.join(RAIZ, d.imagem.arquivo)) ? '✓' : '·';
        const dir = path.join(RAIZ, 'assets/audio', pastaAudio(d));
        const n = fs.existsSync(dir) ? fs.readdirSync(dir).filter(x => x.endsWith('.mp3')).length : 0;
        console.log(`${f.replace('-dialogo.json', '').padEnd(14)} img:${img}  audio:${n}/${d.linhas.length}`);
    }
} else if (args.includes('--imagem')) {
    for (const s of slugs) await gerarImagem(s, ref);
} else if (args.includes('--audio')) {
    let falhas = 0;
    for (const s of slugs) falhas += await gerarAudio(s);
    if (falhas) process.exitCode = 1;
} else {
    console.log('uso: --lista | --imagem <slug> [--ref <slug>] | --audio <slug...>');
}
