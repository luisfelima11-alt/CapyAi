'use strict';

// Music Lab (28/set). The search and lyrics routes proxy lyrics.ovh. They used
// to pass its status and body straight through, with no deadline, and the page
// turned any failure into "Nenhuma música encontrada". Here https.get is faked:
// no test talks to the real provider.
const test = require('node:test');
const assert = require('node:assert/strict');
const https = require('node:https');
const { EventEmitter } = require('node:events');

const apiHandler = require('../api/index');
const { buscarJsonExterno, checkRateLimit } = apiHandler._internos;

function mockResponse() {
  const res = new EventEmitter();
  res.statusCode = 200;
  res.headers = {};
  res.body = '';
  res.headersSent = false;
  res.setHeader = (key, value) => { res.headers[String(key).toLowerCase()] = value; };
  res.getHeader = key => res.headers[String(key).toLowerCase()];
  res.status = code => { res.statusCode = code; return res; };
  res.json = value => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(value)); return res; };
  res.end = value => {
    if (value) res.body += Buffer.isBuffer(value) ? value.toString('utf8') : String(value);
    res.headersSent = true;
    res.emit('finish');
    return res;
  };
  return res;
}

async function callApi(url) {
  const req = new EventEmitter();
  req.method = 'GET';
  req.url = url;
  req.headers = {};
  req.socket = { remoteAddress: '127.0.0.1' };
  req.destroy = () => {};
  const res = mockResponse();
  const pending = apiHandler(req, res);
  process.nextTick(() => req.emit('end'));
  await pending;
  return { status: res.statusCode, json: JSON.parse(res.body || '{}') };
}

// Replaces https.get for one test. `resposta` is { status, body } or 'trava'
// (never answers) or 'erro' (network error).
function comProvedor(resposta, fn) {
  const original = https.get;
  const pedidos = [];
  https.get = (alvo, _opts, cb) => {
    pedidos.push(String(alvo));
    const pedido = new EventEmitter();
    pedido.destroy = erro => setImmediate(() => pedido.emit('error', erro || new Error('destroyed')));
    setImmediate(() => {
      if (resposta === 'trava') return;
      if (resposta === 'erro') { pedido.emit('error', new Error('ECONNRESET')); return; }
      const r = new EventEmitter();
      r.statusCode = resposta.status;
      r.setEncoding = () => {};
      cb(r);
      r.emit('data', resposta.body);
      r.emit('end');
    });
    return pedido;
  };
  return Promise.resolve().then(() => fn(pedidos)).finally(() => { https.get = original; });
}

const faixa = i => ({ title: `Song ${i}`, artist: { name: 'Band' }, album: { title: 'Album', cover_medium: `https://e-cdns-images.dzcdn.net/${i}.jpg` } });

test('search: the catalogue answer reaches the page, at most 7 songs', () => comProvedor(
  { status: 200, body: JSON.stringify({ data: Array.from({ length: 10 }, (_, i) => faixa(i)) }) },
  async pedidos => {
    const r = await callApi('/api/lyrics-search?q=coldplay');
    assert.equal(r.status, 200);
    assert.equal(r.json.data.length, 7);
    assert.equal(r.json.data[0].artist.name, 'Band');
    assert.match(pedidos[0], /^https:\/\/api\.lyrics\.ovh\/suggest\/coldplay$/);
  },
));

test('search: a provider error page becomes a JSON error, not "no songs"', () => comProvedor(
  { status: 503, body: '<html><body>Service Unavailable</body></html>' },
  async () => {
    const r = await callApi('/api/lyrics-search?q=coldplay');
    assert.equal(r.status, 502);
    assert.equal(r.json.error, 'music_search_unavailable');
    assert.match(r.json.message, /não respondeu/);
  },
));

test('lyrics: found, not found and provider down are three different answers', async () => {
  await comProvedor({ status: 200, body: JSON.stringify({ lyrics: 'Look at the stars\nLook how they shine for you' }) }, async () => {
    const r = await callApi('/api/lyrics?artist=Coldplay&title=Yellow');
    assert.equal(r.status, 200);
    assert.match(r.json.lyrics, /Look at the stars/);
  });
  await comProvedor({ status: 404, body: JSON.stringify({ error: 'No lyrics found' }) }, async () => {
    const r = await callApi('/api/lyrics?artist=Nobody&title=Nothing');
    assert.equal(r.status, 404);
    assert.equal(r.json.error, 'lyrics_not_found');
  });
  await comProvedor('erro', async () => {
    const r = await callApi('/api/lyrics?artist=Coldplay&title=Yellow');
    assert.equal(r.status, 502);
    assert.equal(r.json.error, 'lyrics_unavailable');
  });
});

test('a provider that never answers is cut at the deadline', () => comProvedor('trava', async () => {
  const inicio = Date.now();
  await assert.rejects(buscarJsonExterno('https://api.lyrics.ovh/suggest/x', { timeoutMs: 60 }), /timeout/);
  assert.ok(Date.now() - inicio < 1000);
}));

test('a visitor searching songs and lyrics keeps the 3 AI uses for the analysis', async () => {
  const visitante = () => ({
    headers: { 'x-forwarded-for': '203.0.113.9' },
    socket: { remoteAddress: '203.0.113.9' },
    _securityIdentity: { kind: 'guest', guestId: 'musica-teste-1' },
  });
  for (let i = 0; i < 5; i++) assert.equal((await checkRateLimit(visitante(), 'lyrics-search')).ok, true, `busca ${i + 1}`);
  for (let i = 0; i < 2; i++) assert.equal((await checkRateLimit(visitante(), 'lyrics')).ok, true, `letra ${i + 1}`);
  const usos = [];
  for (let i = 0; i < 4; i++) usos.push((await checkRateLimit(visitante(), 'music')).ok);
  assert.deepEqual(usos, [true, true, true, false]);   // 3 AI uses a day, untouched by the searches
});
