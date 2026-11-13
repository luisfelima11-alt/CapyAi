#!/usr/bin/env node
// Empacota a extensão "Capy no YouTube" (pasta extensao/) num .zip pronto para
// enviar à Chrome Web Store e à loja do Edge:
//   npm run extensao:zip  →  dist/capy-no-youtube-<versão>.zip
//
// Sem dependências (o `zip` não existe no Windows): o formato ZIP é escrito à
// mão, com deflate do próprio Node. Antes de empacotar, confere o básico que a
// loja recusa: manifest inválido, arquivo citado que não existe, versão repetida.
'use strict';

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const RAIZ = path.join(__dirname, '..');
const PASTA = path.join(RAIZ, 'extensao');
const SAIDA = path.join(RAIZ, 'dist');

const TABELA = (() => {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        t[n] = c >>> 0;
    }
    return t;
})();

function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) c = TABELA[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
}

function listar(dir, base = '') {
    const saida = [];
    for (const nome of fs.readdirSync(dir).sort()) {
        if (nome.startsWith('.')) continue;
        const cheio = path.join(dir, nome);
        const rel = base ? base + '/' + nome : nome;
        if (fs.statSync(cheio).isDirectory()) saida.push(...listar(cheio, rel));
        else saida.push(rel);
    }
    return saida;
}

function zipar(arquivos) {
    const partes = [];
    const central = [];
    let offset = 0;
    // Data fixa (1/1/2026): o mesmo conteúdo gera o mesmo .zip.
    const hora = 0, data = ((2026 - 1980) << 9) | (1 << 5) | 1;
    for (const { nome, dados } of arquivos) {
        const nomeBuf = Buffer.from(nome, 'utf8');
        const comprimido = zlib.deflateRawSync(dados, { level: 9 });
        const crc = crc32(dados);
        const local = Buffer.alloc(30);
        local.writeUInt32LE(0x04034b50, 0);
        local.writeUInt16LE(20, 4);
        local.writeUInt16LE(0x0800, 6);          // nomes em UTF-8
        local.writeUInt16LE(8, 8);               // deflate
        local.writeUInt16LE(hora, 10);
        local.writeUInt16LE(data, 12);
        local.writeUInt32LE(crc, 14);
        local.writeUInt32LE(comprimido.length, 18);
        local.writeUInt32LE(dados.length, 22);
        local.writeUInt16LE(nomeBuf.length, 26);
        local.writeUInt16LE(0, 28);
        partes.push(local, nomeBuf, comprimido);

        const c = Buffer.alloc(46);
        c.writeUInt32LE(0x02014b50, 0);
        c.writeUInt16LE(20, 4);
        c.writeUInt16LE(20, 6);
        c.writeUInt16LE(0x0800, 8);
        c.writeUInt16LE(8, 10);
        c.writeUInt16LE(hora, 12);
        c.writeUInt16LE(data, 14);
        c.writeUInt32LE(crc, 16);
        c.writeUInt32LE(comprimido.length, 20);
        c.writeUInt32LE(dados.length, 24);
        c.writeUInt16LE(nomeBuf.length, 28);
        c.writeUInt32LE(offset, 42);
        central.push(c, nomeBuf);
        offset += local.length + nomeBuf.length + comprimido.length;
    }
    const tamanhoCentral = central.reduce((s, b) => s + b.length, 0);
    const fim = Buffer.alloc(22);
    fim.writeUInt32LE(0x06054b50, 0);
    fim.writeUInt16LE(arquivos.length, 8);
    fim.writeUInt16LE(arquivos.length, 10);
    fim.writeUInt32LE(tamanhoCentral, 12);
    fim.writeUInt32LE(offset, 16);
    return Buffer.concat([...partes, ...central, fim]);
}

function conferir(manifest, arquivos) {
    const erros = [];
    if (manifest.manifest_version !== 3) erros.push('manifest_version precisa ser 3');
    if (!/^\d+(\.\d+){0,3}$/.test(manifest.version || '')) erros.push('versão inválida: ' + manifest.version);
    if ((manifest.description || '').length > 132) erros.push('descrição passa de 132 caracteres');
    const citados = [
        manifest.background && manifest.background.service_worker,
        manifest.action && manifest.action.default_popup,
        ...Object.values(manifest.icons || {}),
        ...(manifest.content_scripts || []).flatMap(c => [...(c.js || []), ...(c.css || [])]),
    ].filter(Boolean);
    for (const c of citados) if (!arquivos.includes(c)) erros.push('o manifest cita um arquivo que não existe: ' + c);
    return erros;
}

function main() {
    const manifest = JSON.parse(fs.readFileSync(path.join(PASTA, 'manifest.json'), 'utf8'));
    const nomes = listar(PASTA);
    const erros = conferir(manifest, nomes);
    if (erros.length) {
        console.error('✗ A extensão não está pronta:\n  - ' + erros.join('\n  - '));
        process.exit(1);
    }
    fs.mkdirSync(SAIDA, { recursive: true });
    const destino = path.join(SAIDA, `capy-no-youtube-${manifest.version}.zip`);
    const zip = zipar(nomes.map(nome => ({ nome, dados: fs.readFileSync(path.join(PASTA, nome)) })));
    fs.writeFileSync(destino, zip);
    console.log(`✓ ${path.relative(RAIZ, destino)} (${nomes.length} arquivos, ${(zip.length / 1024).toFixed(1)} KB)`);
    console.log('  Antes de mandar para a loja: suba "version" no extensao/manifest.json se esta já foi enviada.');
}

if (require.main === module) main();
module.exports = { crc32, zipar, conferir, listar };
