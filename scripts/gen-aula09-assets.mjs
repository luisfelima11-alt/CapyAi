#!/usr/bin/env node
// ════════════════════════════════════════════════════════════════════════════
// gen-aula09-assets.mjs — gera o áudio e a imagem do diálogo da aula 9
// ════════════════════════════════════════════════════════════════════════════
// Ferramenta de autor. Roda UMA vez; os arquivos gerados vão pro repositório.
// Não é deployada (o vercel.json bloqueia /scripts/*).
//
//   node scripts/gen-aula09-assets.mjs --audio     ~20 chamadas de TTS
//   node scripts/gen-aula09-assets.mjs --imagem    1 imagem (custa ~R$0,25)
//
// Fonte única: scripts/aula09-dialogo.json. O mesmo arquivo alimenta o HTML da
// aula, então o áudio nunca fica dessincronizado do texto.
//
// A chave sai do .env e nunca é impressa.
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

const dados = JSON.parse(fs.readFileSync(path.join(RAIZ, 'scripts/aula09-dialogo.json'), 'utf8'));
const CHAVE = chaveDoEnv();

// ── Áudio ──────────────────────────────────────────────────────────────────
// Um mp3 por fala, não um arquivo concatenado: assim o botão 🔊 de cada bolha
// reaproveita o mesmo arquivo, dá pra destacar a fala tocando, e pular é
// trivial. Vozes diferentes por personagem — é diálogo, não narração.
async function gerarAudio() {
    const dir = path.join(RAIZ, 'assets/audio/gps09');
    fs.mkdirSync(dir, { recursive: true });
    let feitos = 0, pulados = 0;

    for (const [i, linha] of dados.linhas.entries()) {
        const nome = `s${String(i + 1).padStart(2, '0')}.mp3`;
        const destino = path.join(dir, nome);
        if (fs.existsSync(destino) && fs.statSync(destino).size > 1000) { pulados++; continue; }

        const voz = dados.vozes[linha.who];
        const r = await fetch('https://api.openai.com/v1/audio/speech', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${CHAVE}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ model: 'tts-1', voice: voz, input: linha.en, speed: 0.95 }),
        });
        if (!r.ok) { console.error(`  ✗ ${nome}: HTTP ${r.status} ${(await r.text()).slice(0, 120)}`); continue; }
        fs.writeFileSync(destino, Buffer.from(await r.arrayBuffer()));
        const kb = (fs.statSync(destino).size / 1024).toFixed(0);
        console.log(`  ✓ ${nome}  ${voz.padEnd(5)} ${kb}KB  "${linha.en.slice(0, 46)}"`);
        feitos++;
    }
    console.log(`\naudio: ${feitos} gerados, ${pulados} já existiam (idempotente — rodar de novo não regera)`);
}

// ── Imagem ─────────────────────────────────────────────────────────────────
async function gerarImagem() {
    const destino = path.join(RAIZ, dados.imagem.arquivo);
    fs.mkdirSync(path.dirname(destino), { recursive: true });
    if (fs.existsSync(destino) && fs.statSync(destino).size > 10000) {
        console.log('imagem já existe — apague o arquivo para regerar (custa dinheiro)');
        return;
    }
    const r = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${CHAVE}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'gpt-image-1', prompt: dados.imagem.prompt,
            size: '1536x1024', quality: 'medium', n: 1,
        }),
    });
    const j = await r.json();
    if (!r.ok) throw new Error(`imagem HTTP ${r.status}: ${JSON.stringify(j).slice(0, 300)}`);
    const b64 = j?.data?.[0]?.b64_json;
    if (!b64) throw new Error(`resposta sem b64_json: ${JSON.stringify(j).slice(0, 300)}`);
    fs.writeFileSync(destino, Buffer.from(b64, 'base64'));
    console.log(`imagem: ${dados.imagem.arquivo} · ${(fs.statSync(destino).size / 1024).toFixed(0)}KB`);
}

const args = process.argv.slice(2);
if (args.includes('--audio'))  await gerarAudio();
if (args.includes('--imagem')) await gerarImagem();
if (!args.length) console.log('uso: --audio | --imagem');
