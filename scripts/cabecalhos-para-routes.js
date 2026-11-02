#!/usr/bin/env node
// Copia o bloco `headers` do vercel.json para dentro de `routes` (02/nov/2026).
//
// Por quê: o vercel.json deste projeto usa `builds` + `routes` (formato antigo).
// Nesse formato a Vercel IGNORA o bloco `headers`: em produção nenhuma página
// estática recebia a CSP, o X-Frame-Options nem o nosniff. Só o "/" recebia,
// porque a rota dele já trazia os cabeçalhos. Conferido com curl em 02/nov.
//
// Como fica: o `headers` continua sendo o lugar onde se escreve (e o que os
// testes leem). Este script gera, no começo de `routes`, uma rota por regra,
// com `continue: true` (aplica o cabeçalho e segue para as rotas seguintes).
// As rotas geradas são as únicas com `continue: true` (nenhuma outra rota usa isso),
// e é assim que o script as encontra para trocar. Chave inventada na rota quebraria
// o deploy: a Vercel valida o esquema do vercel.json.
//
//   npm run headers           grava o vercel.json
//   npm run headers -- --check   só confere (sai com 1 se estiver desatualizado)
'use strict';

const fs = require('fs');
const path = require('path');

const ARQUIVO = path.join(__dirname, '..', 'vercel.json');

// `source` no formato do bloco headers (path-to-regexp) → `src` (regex) das routes.
// Só os formatos que este projeto usa; outro formato falha alto, sem adivinhar.
function fonteParaRegex(source) {
  const s = String(source);
  if (s.includes('?') && !s.startsWith('/((?!')) throw new Error(`query string não vale em routes: ${s}`);
  let m;
  if (s === '/(.*)') return '^/.*$';
  if ((m = /^\/:page\(([^)]+)\)$/.exec(s))) {
    return '^/(?:' + m[1].split('|').map(p => p.replace(/[.]/g, '\\.')).join('|') + ')$';
  }
  if (s.startsWith('/((?!') && s.endsWith('.*)')) return '^' + s.slice(0, -1).replace(/^\/\(/, '/') + '$';
  if ((m = /^\/\(\.\*\)\\\.([a-z]+)$/.exec(s))) return `^/.*\\.${m[1]}$`;
  if (/^\/[\w.-]+$/.test(s)) return '^' + s.replace(/[.]/g, '\\.') + '$';
  throw new Error(`formato de source não suportado: ${s}`);
}

function rotasDeCabecalho(config) {
  return (config.headers || []).map(regra => ({
    src: fonteParaRegex(regra.source),
    headers: Object.fromEntries(regra.headers.map(h => [h.key, h.value])),
    continue: true,
  }));
}

function montar(config) {
  const outras = (config.routes || []).filter(r => r.continue !== true);
  return { ...config, routes: [...rotasDeCabecalho(config), ...outras] };
}

module.exports = { fonteParaRegex, rotasDeCabecalho, montar };

if (require.main === module) {
  const original = fs.readFileSync(ARQUIVO, 'utf8');
  const novo = JSON.stringify(montar(JSON.parse(original)), null, 2) + '\n';
  if (process.argv.includes('--check')) {
    const atual = JSON.stringify(JSON.parse(original).routes);
    const esperado = JSON.stringify(JSON.parse(novo).routes);
    if (atual !== esperado) { console.error('vercel.json: as rotas de cabeçalho estão desatualizadas. Rode: npm run headers'); process.exit(1); }
    console.log('vercel.json: rotas de cabeçalho em dia.');
  } else {
    fs.writeFileSync(ARQUIVO, novo);
    console.log(`vercel.json: ${rotasDeCabecalho(JSON.parse(novo)).length} rotas de cabeçalho geradas.`);
  }
}
