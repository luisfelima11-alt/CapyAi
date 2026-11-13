// Extensão "Capy no YouTube": a parte pura das legendas (extensao/legendas.js).
const test = require('node:test');
const assert = require('node:assert/strict');
const L = require('../extensao/legendas.js');

const ev = (ms, dur, texto, extra) => Object.assign({ tStartMs: ms, dDurationMs: dur, segs: [{ utf8: texto }] }, extra || {});

test('lerJson3: legenda feita por gente vira linhas em segundos, em ordem', () => {
    const cues = L.lerJson3(JSON.stringify({ events: [
        ev(4000, 2000, 'second line'),
        ev(1000, 2500, "I've been looking forward"),
        { tStartMs: 0, dDurationMs: 500 },                       // evento sem texto (estilo)
        ev(7000, 1500, '>> New   speaker\nhere'),
    ] }));
    assert.deepEqual(cues, [
        { inicio: 1, fim: 3.5, texto: "I've been looking forward" },
        { inicio: 4, fim: 6, texto: 'second line' },
        { inicio: 7, fim: 8.5, texto: 'New speaker here' },
    ]);
});

test('lerJson3: legenda automática (rolante) não se sobrepõe e ignora os "\\n" de aAppend', () => {
    const cues = L.lerJson3({ events: [
        { tStartMs: 0, dDurationMs: 9000, segs: [{ utf8: 'so' }, { utf8: ' today', tOffsetMs: 300 }, { utf8: ' we', tOffsetMs: 600 }] },
        { tStartMs: 2500, dDurationMs: 10, aAppend: 1, segs: [{ utf8: '\n' }] },
        { tStartMs: 2500, dDurationMs: 9000, segs: [{ utf8: 'are going' }, { utf8: ' to cook', tOffsetMs: 400 }] },
        { tStartMs: 5000, dDurationMs: 4000, segs: [{ utf8: 'are going to cook' }] },  // repetição colada: junta
    ] });
    assert.equal(cues.length, 2);
    assert.equal(cues[0].texto, 'so today we');
    assert.equal(cues[0].fim, 2.5, 'a linha acaba quando a próxima começa');
    assert.equal(cues[1].texto, 'are going to cook');
    assert.equal(cues[1].fim, 11.5);
});

test('lerJson3: entrada quebrada não derruba nada', () => {
    assert.deepEqual(L.lerJson3('<html>'), []);
    assert.deepEqual(L.lerJson3(null), []);
    assert.deepEqual(L.lerJson3({ events: 'x' }), []);
});

test('urlDaFaixa: mantém o token do player e troca só idioma/formato', () => {
    const capturada = 'https://www.youtube.com/api/timedtext?v=abc&ei=1&caps=asr&opi=1&exp=xpe&xoaf=5&hl=pt&ip=0.0.0.0&lang=en&fmt=srv3&pot=TOKEN123&c=WEB&tlang=pt';
    const en = new URL(L.urlDaFaixa(capturada, 'en'));
    assert.equal(en.searchParams.get('pot'), 'TOKEN123');
    assert.equal(en.searchParams.get('fmt'), 'json3');
    assert.equal(en.searchParams.get('tlang'), null, 'a faixa já é inglês: sem tradução');
    const pt = new URL(L.urlDaFaixa(capturada, 'pt'));
    assert.equal(pt.searchParams.get('tlang'), 'pt');
    assert.equal(pt.searchParams.get('lang'), 'en');
    assert.equal(pt.searchParams.get('pot'), 'TOKEN123');
    // Faixa original em português (en-GB/en-US contam como inglês).
    const deUmaPt = new URL(L.urlDaFaixa('/api/timedtext?v=abc&lang=pt-BR&pot=x', 'pt'));
    assert.equal(deUmaPt.searchParams.get('tlang'), null);
    assert.equal(L.idiomaBase('en-GB'), 'en');
});

test('dadosDaUrl: lê vídeo, idioma e tipo', () => {
    assert.deepEqual(L.dadosDaUrl('/api/timedtext?v=XyZ&lang=EN&kind=asr&fmt=json3'), { videoId: 'XyZ', lang: 'en', tlang: '', kind: 'asr', fmt: 'json3' });
    assert.equal(L.dadosDaUrl('http://[').videoId, '');
});

test('alinhar: tempos iguais (legenda feita por gente) casam um a um', () => {
    const en = [{ inicio: 1, fim: 3, texto: 'Hello there' }, { inicio: 3, fim: 5, texto: 'How are you?' }];
    const pt = [{ inicio: 1, fim: 3, texto: 'Olá' }, { inicio: 3, fim: 5, texto: 'Como vai?' }];
    assert.deepEqual(L.alinhar(en, pt).map(c => c.pt), ['Olá', 'Como vai?']);
});

test('alinhar: tempos diferentes (tradução de automática) usam o meio e a sobreposição', () => {
    const en = [
        { inicio: 0, fim: 2, texto: 'so today we' },
        { inicio: 2, fim: 4, texto: 'are going to cook' },
        { inicio: 4, fim: 6, texto: 'pasta' },
        { inicio: 20, fim: 21, texto: 'bye' },
    ];
    const pt = [
        { inicio: 0, fim: 3.6, texto: 'então hoje vamos cozinhar' },   // meio 1.8 → linha 1
        { inicio: 3.6, fim: 6, texto: 'macarrão' },                    // meio 4.8 → linha 3
    ];
    const r = L.alinhar(en, pt);
    assert.equal(r[0].pt, 'então hoje vamos cozinhar');
    assert.equal(r[1].pt, 'então hoje vamos cozinhar', 'nenhum meio cai aqui: vale a maior sobreposição');
    assert.equal(r[2].pt, 'macarrão');
    assert.equal(r[3].pt, '', 'sem português nesse trecho');
    assert.deepEqual(L.alinhar(en, null).map(c => c.pt), ['', '', '', '']);
});

test('indiceNoTempo / indiceVisivel: busca e silêncio entre falas', () => {
    const cues = [{ inicio: 1, fim: 2 }, { inicio: 3, fim: 4 }, { inicio: 4, fim: 6 }];
    assert.equal(L.indiceNoTempo(cues, 0.5), -1);
    assert.equal(L.indiceNoTempo(cues, 1.2), 0);
    assert.equal(L.indiceNoTempo(cues, 2.5), 0, 'no silêncio, a atual é a última ouvida');
    assert.equal(L.indiceVisivel(cues, 2.5), -1, 'mas nada aparece na tela');
    assert.equal(L.indiceNoTempo(cues, 2.97), 1, 'folga: logo depois de um seek para o início');
    assert.equal(L.indiceVisivel(cues, 5.9), 2);
    assert.equal(L.indiceNoTempo([], 3), -1);
});

test('destino: ⏮ 🔁 ⏭', () => {
    const cues = [{ inicio: 1, fim: 2 }, { inicio: 3, fim: 4 }, { inicio: 5, fim: 6 }];
    assert.equal(L.destino(cues, 3.5, 'repetir'), 1);
    assert.equal(L.destino(cues, 3.5, 'anterior'), 0);
    assert.equal(L.destino(cues, 3.5, 'proxima'), 2);
    assert.equal(L.destino(cues, 4.5, 'repetir'), 1, 'no silêncio, repete a que acabou de passar');
    assert.equal(L.destino(cues, 0.2, 'proxima'), 0, 'antes da primeira fala, ⏭ vai para ela');
    assert.equal(L.destino(cues, 0.2, 'anterior'), 0);
    assert.equal(L.destino(cues, 5.5, 'proxima'), -1, 'depois da última não há próxima');
    assert.equal(L.destino([], 1, 'repetir'), -1);
    assert.equal(L.destino(cues, 1, 'pular'), -1);
});

test('tokens: palavras clicáveis, pontuação e contrações', () => {
    const t = L.tokens("Don't stop, Ana! It’s 5 o'clock.");
    assert.deepEqual(t.filter(p => p.palavra).map(p => p.palavra), ["don't", 'stop', 'ana', "it's", '5', "o'clock"]);
    assert.equal(t.map(p => p.texto).join(''), "Don't stop, Ana! It’s 5 o'clock.", 'nada se perde ao remontar');
    assert.deepEqual(L.tokens(''), []);
});
