'use strict';

// Créditos de IA do plano grátis (19/out/2026): um saldo único por dia, com
// pesos por função. Sem Supabase (como aqui), checkRateLimit cai no contador em
// memória, que segue as mesmas regras da consume_rate_limit_peso.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const { checkRateLimit, PESO_IA, IA_GRATIS_DIA } = require('../api/index.js')._creditosIa;

let n = 0;
const aluno = (id = `aluno-${++n}`) => () => ({
    headers: {}, socket: { remoteAddress: '10.0.0.1' },
    _securityIdentity: { kind: 'user', authUserId: id, appUserId: `conta-${id}` },
});

test('a free student spends one daily balance, weighted by what each AI use costs', async () => {
    const req = aluno();
    assert.equal(IA_GRATIS_DIA, 10);
    for (let i = 0; i < 8; i++) assert.equal((await checkRateLimit(req(), 'chat')).ok, true, `chat ${i + 1}`);
    const historia = await checkRateLimit(req(), 'story');
    assert.equal(historia.ok, false, 'a story (3) does not fit in the 2 credits left');
    assert.equal(historia.peso, 3);
    // Refused without spending: the 2 credits are still there for two chats.
    assert.equal((await checkRateLimit(req(), 'chat')).ok, true);
    const ultimo = await checkRateLimit(req(), 'translate');
    assert.deepEqual([ultimo.ok, ultimo.used, ultimo.limit], [true, 10, 10]);
    assert.equal((await checkRateLimit(req(), 'quiz')).ok, false);
});

test('the balance is per student, and routes outside it keep their own limit', async () => {
    const a = aluno(), b = aluno();
    assert.equal((await checkRateLimit(a(), 'music')).used, 3);
    assert.equal((await checkRateLimit(b(), 'music')).used, 3, 'another student has a full balance');
    // The lessons' Nova voice is not an AI credit.
    const voz = await checkRateLimit(a(), 'tts');
    assert.equal(voz.peso, 0);
    assert.equal(voz.limit, 200);
    assert.deepEqual(Object.keys(PESO_IA).filter(k => ['tts', 'lyrics', 'lyrics-search', 'realtime', 'homework'].includes(k)), []);
});

test('one request is charged once even when the route checks the limit again', async () => {
    const req = aluno()();
    await checkRateLimit(req, 'youtube');
    const denovo = await checkRateLimit(req, 'youtube');
    assert.equal(denovo.used, 3);
});

test('guests keep their 3 uses; anonymous visitors are not on the student balance', async () => {
    const convidado = { headers: {}, socket: { remoteAddress: '10.0.0.9' }, _securityIdentity: { kind: 'guest', guestId: 'g1' } };
    const r = await checkRateLimit({ ...convidado }, 'story');
    assert.deepEqual([r.limit, r.peso], [3, 0]);
});

test('every course is open on the free plan, and the site says so', () => {
    for (const pagina of ['classes.html', 'classes_fr.html']) {
        const src = fs.readFileSync(path.join(ROOT, pagina), 'utf8');
        assert.match(src, /const locked = false;/, pagina);
        assert.doesNotMatch(src, /FREE_LESSON_LIMIT|function isPro\(/, pagina);
    }
    const landing = fs.readFileSync(path.join(ROOT, 'landing.html'), 'utf8');
    assert.doesNotMatch(landing, /5 primeiras aulas/);
    assert.match(landing, /10 créditos de IA por dia/);
    const coach = fs.readFileSync(path.join(ROOT, 'components.js'), 'utf8');
    assert.doesNotMatch(coach, /capyWritingCoach_/, 'the writing coach has no local daily counter: the server decides');
});

test('lives: a wrong answer is read the same way whatever the order of the arguments', () => {
    const src = fs.readFileSync(path.join(ROOT, 'vidas.js'), 'utf8');
    const errou = new Function(src.match(/function errou\(a\) \{[\s\S]*?\n {4}\}/)[0] + '; return errou;')();
    const btn = { nodeType: 1 };
    const casos = [
        [['x', btn, { a: 'y' }], true], [['y', btn, { a: 'y' }], false],      // answerQ(ans, btn, q)
        [[btn, 2, 'a', 'b'], true], [[btn, 2, 'a', 'a'], false],              // answerQ(btn, qi, chosen, correct)
        [[btn, 'a', 'b', 'explicação'], true], [[btn, 'a', 'a', 'exp'], false], // grammar_lab, reading_room
        [['a', 'b', btn], true], [['a', 'a', btn], false],                    // answerPrac, answerQuiz do alfabeto
        [[btn, 'c ', 'c'], false],                                             // answerQuiz(btn, chosen, correct)
    ];
    for (const [args, esperado] of casos) assert.equal(errou(args), esperado, JSON.stringify(args.map(x => x === btn ? 'btn' : x)));
});

test('lives: server-only tables, every quiz page loads vidas.js, and the script builds no HTML from strings', () => {
    const sql = fs.readFileSync(path.join(ROOT, 'supabase', 'migrations', '202610190002_vidas_convites.sql'), 'utf8');
    for (const t of ['vidas', 'convite_codigos', 'convites']) assert.match(sql, new RegExp(`alter table public\\.${t} enable row level security;`));
    assert.match(sql, /revoke all on public\.vidas, public\.convite_codigos, public\.convites from anon, authenticated;/);
    assert.doesNotMatch(sql, /grant [^;]* to (anon|authenticated)/);
    assert.match(fs.readFileSync(path.join(ROOT, 'components.js'), 'utf8'), /s\.src = 'vidas\.js\?v=vd1';/);
    const vidas = fs.readFileSync(path.join(ROOT, 'vidas.js'), 'utf8');
    assert.doesNotMatch(vidas, /innerHTML|outerHTML|insertAdjacentHTML/);
    for (const pagina of fs.readdirSync(ROOT).filter(f => f.endsWith('.html'))) {
        const src = fs.readFileSync(path.join(ROOT, pagina), 'utf8');
        if (!/function\s+(answerQ|answerPrac|answerQuiz)\s*\(/.test(src)) continue;
        assert.match(src, /src="(components|vidas)\.js/, `${pagina} has quiz answers but loads neither components.js nor vidas.js`);
    }
});
