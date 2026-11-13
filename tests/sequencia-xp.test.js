// ════════════════════════════════════════════════════════════════════════════
// Sequência (streak) e XP: casos de borda do store.js real, com relógio falso
// ════════════════════════════════════════════════════════════════════════════
// Mesma montagem do tests/streak-br.test.js: o store.js de verdade roda num vm
// com um relógio que o teste controla.
// ════════════════════════════════════════════════════════════════════════════

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const fonte = fs.readFileSync(path.join(root, 'store.js'), 'utf8');
const codigo = fonte.replace(/Store\.init\(\);\s*$/, '') + '\n;globalThis.Store = Store;';

// `relogio.agora` pode mudar no meio do teste: é a página que fica aberta
// enquanto o dia vira.
function montar({ agora, estado } = {}) {
    const relogio = { agora };
    const loja = new Map();
    if (estado) loja.set('capyYaraState', JSON.stringify(estado));
    loja.set('capySession', JSON.stringify({ id: 'guest' }));
    const eventos = [];

    const RelogioReal = Date;
    class RelogioFake extends RelogioReal {
        constructor(...args) {
            if (args.length === 0) super(relogio.agora); else super(...args);
        }
        static now() { return new RelogioReal(relogio.agora).getTime(); }
    }

    const ctx = {
        Date: RelogioFake,
        localStorage: {
            getItem: k => (loja.has(k) ? loja.get(k) : null),
            setItem: (k, v) => loja.set(k, String(v)),
            removeItem: k => loja.delete(k),
        },
        document: { dispatchEvent(e) { eventos.push(e); }, addEventListener() {} },
        Event: class { constructor(t) { this.type = t; } },
        CustomEvent: class { constructor(t, o) { this.type = t; Object.assign(this, o); } },
        fetch: () => Promise.reject(new Error('sem rede no teste')),
        URLSearchParams,
        console,
        Number, Math, JSON, Object, Array, String, Boolean, RegExp, Set, Promise, Error, isNaN,
    };
    ctx.window = ctx;
    ctx.location = { search: '' };
    vm.createContext(ctx);
    new vm.Script(codigo, { filename: 'store.js' }).runInContext(ctx);
    return { Store: ctx.Store, loja, ctx, relogio, eventos };
}

function abrirApp(m) {
    m.Store.state = { ...m.Store.state, ...JSON.parse(m.loja.get('capyYaraState') || '{}') };
    m.Store.migrarStreakBR();
    m.Store.checkDailyReset();
    return m.Store;
}

// ── Relógio adiantado ───────────────────────────────────────────────────────
// Celular 10 min adiantado, aluno estuda às 23h55: o celular grava a prática
// como "amanhã". Quando o relógio volta ao certo (ou o estado chega a um
// aparelho com a hora certa), a data de prática está no futuro. A prática
// aconteceu de verdade, no máximo agora: tem que contar como hoje, não zerar.

test('data de pratica no futuro (relogio adiantado) nao zera a streak', () => {
    // Hoje, no relógio certo: 03/set 23h58 BRT. A prática foi gravada como 04/set.
    const m = montar({ agora: '2026-09-04T02:58:00Z',
        estado: { streakDays: 10, lastPracticeDate: '2026-09-04', streakSchema: 1 } });
    const s = abrirApp(m);
    assert.equal(s.state.streakDays, 10, 'a streak de 10 dias sobreviveu');
    assert.equal(s.state.lastPracticeDate, '2026-09-03', 'a data foi trazida para hoje');
    assert.equal(s.state.streakActive, true, 'conta como praticou hoje');
});

test('estado com data no futuro: praticar hoje nao recomeca a streak em 1', () => {
    const m = montar({ agora: '2026-09-04T02:58:00Z' });
    const s = m.Store;
    // Estado que acabou de chegar de outro aparelho (merge), sem reabrir o app.
    s.state.streakDays = 10;
    s.state.lastPracticeDate = '2026-09-04';
    s.state.streakSchema = 1;
    s.activateStreak();
    assert.equal(s.state.streakDays, 10, 'ja tinha praticado hoje: nem zera nem soma');
    assert.equal(s.state.lastPracticeDate, '2026-09-03');
});

test('no dia seguinte a streak continua normalmente depois do relogio adiantado', () => {
    let m = montar({ agora: '2026-09-04T02:58:00Z',
        estado: { streakDays: 10, lastPracticeDate: '2026-09-04', streakSchema: 1 } });
    const estado = { ...abrirApp(m).state };
    m = montar({ agora: '2026-09-04T13:00:00Z', estado });   // 04/set 10h BRT
    const s = abrirApp(m);
    assert.equal(s.state.streakDays, 10, 'praticou ontem: viva');
    s.activateStreak();
    assert.equal(s.state.streakDays, 11);
});

// ── Página aberta enquanto o dia vira ───────────────────────────────────────
// O freeze só era conferido ao ABRIR o app (checkDailyReset). Quem deixava a
// página aberta e estudava depois da meia-noite pulava essa conferência: o
// activateStreak via o buraco de um dia e recomeçava em 1, com o freeze
// comprado (80 🫐) ainda no bolso.

test('pagina aberta na virada do dia: o freeze protege a streak', () => {
    // Praticou dia 1. Dia 2 não estudou; abriu a página às 23h50 (BRT) do dia 2.
    const m = montar({ agora: '2026-09-03T02:50:00Z',
        estado: { streakDays: 6, lastPracticeDate: '2026-09-01', streakFreezes: 1, streakSchema: 1 } });
    const s = abrirApp(m);
    assert.equal(s.state.streakDays, 6, 'dia 2: praticou ontem, viva');

    // A página continua aberta. 00h10 do dia 3: o aluno faz a lição.
    m.relogio.agora = '2026-09-03T03:10:00Z';
    s.activateStreak();
    assert.equal(s.state.streakFreezes, 0, 'o freeze cobriu o dia 2');
    assert.equal(s.state.streakDays, 7, 'a streak continua, como se tivesse reaberto o app');
});

test('pagina aberta na virada do dia, sem freeze: recomeca em 1 (regra normal)', () => {
    const m = montar({ agora: '2026-09-03T02:50:00Z',
        estado: { streakDays: 6, lastPracticeDate: '2026-09-01', streakFreezes: 0, streakSchema: 1 } });
    const s = abrirApp(m);
    m.relogio.agora = '2026-09-03T03:10:00Z';
    s.activateStreak();
    assert.equal(s.state.streakDays, 1);
});
