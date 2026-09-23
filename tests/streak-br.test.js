// ════════════════════════════════════════════════════════════════════════════
// A streak do aluno usa o dia de BRASÍLIA, não o de Greenwich
// ════════════════════════════════════════════════════════════════════════════
// O `store.js` datava o dia com `toISOString()`, que é UTC. Para UTC−3 o dia
// virava às 21h de Brasília: quem estudava segunda de manhã e terça às 22h
// perdia a streak, porque para o código terça 22h já era quarta.
//
// Os testes rodam o store.js REAL num sandbox, com relógio controlável. Rodar
// em três fusos (veja `npm run test:streak`) é o que prova que o resultado não
// depende do relógio da máquina — e é justamente por isso que o bug original
// passou: na máquina do dev, à tarde, `toISOString()` parece certo.
// ════════════════════════════════════════════════════════════════════════════

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const fonte = fs.readFileSync(path.join(root, 'store.js'), 'utf8');

// Duas adaptações, ambas necessárias e nenhuma delas mexe na lógica testada:
//  1. o arquivo termina com `Store.init()`, que dispara chamadas de rede — os
//     testes chamam init na mão, na hora certa, para serem determinísticos;
//  2. `const Store` não vira propriedade do global num contexto de vm, então
//     precisa ser exposto explicitamente.
const codigo = fonte.replace(/Store\.init\(\);\s*$/, '') + '\n;globalThis.Store = Store;';

// Um navegador de mentira com relógio que eu mando. `agora` é um instante ISO
// em UTC — os testes usam horários que caem dos dois lados das 21h BRT.
function montar({ agora, estado } = {}) {
    const loja = new Map();
    if (estado) loja.set('capyYaraState', JSON.stringify(estado));
    // Sessão de convidado: o save() não posta, então nenhum teste toca a rede.
    loja.set('capySession', JSON.stringify({ id: 'guest' }));

    const RelogioReal = Date;
    class RelogioFake extends RelogioReal {
        constructor(...args) {
            if (args.length === 0) super(agora); else super(...args);
        }
        static now() { return new RelogioReal(agora).getTime(); }
    }

    const ctx = {
        Date: RelogioFake,
        localStorage: {
            getItem: k => (loja.has(k) ? loja.get(k) : null),
            setItem: (k, v) => loja.set(k, String(v)),
            removeItem: k => loja.delete(k),
        },
        document: { dispatchEvent() {}, addEventListener() {} },
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
    return { Store: ctx.Store, loja, ctx };
}

// `init()` dispara syncPlanFromServer/mergeFromServer, que batem na rede. Nos
// testes de lógica pura chamo só o que interessa, na mesma ordem do init().
function abrirApp(m) {
    m.Store.state = { ...m.Store.state, ...JSON.parse(m.loja.get('capyYaraState') || '{}') };
    m.Store.migrarStreakBR();
    m.Store.checkDailyReset();
    return m.Store;
}

// Dia BR de um instante, calculado igual ao código de produção.
const diaBR = iso => new Date(iso).toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });

// ── O bug exato que motivou tudo ────────────────────────────────────────────

test('praticar as 22h30 BRT e voltar de manha nao quebra a streak', () => {
    // 03/set 22:30 BRT === 04/set 01:30 UTC. Pelo código antigo o dia já era 04.
    const noite = '2026-09-04T01:30:00Z';
    assert.equal(diaBR(noite), '2026-09-03', 'premissa: 22h30 BRT ainda é dia 3');

    let m = montar({ agora: noite, estado: { streakDays: 4, lastPracticeDate: '2026-09-02', streakSchema: 1 } });
    let s = abrirApp(m);
    s.activateStreak();
    assert.equal(s.state.streakDays, 5, 'praticou na noite do dia 3: 4 -> 5');
    assert.equal(s.state.lastPracticeDate, '2026-09-03');

    // Manhã seguinte (dia 4, 09h BRT = 12h UTC).
    m = montar({ agora: '2026-09-04T12:00:00Z', estado: { ...s.state } });
    s = abrirApp(m);
    assert.equal(s.state.streakDays, 5, 'streak sobreviveu a virada do dia');
    s.activateStreak();
    assert.equal(s.state.streakDays, 6, 'praticar no dia 4 soma normalmente');
});

test('abrir o app varias vezes no mesmo dia nao mexe na streak', () => {
    let estado = { streakDays: 3, lastPracticeDate: '2026-09-03', streakSchema: 1 };
    for (let i = 0; i < 10; i++) {
        const m = montar({ agora: '2026-09-04T13:00:00Z', estado });
        estado = { ...abrirApp(m).state };
    }
    assert.equal(estado.streakDays, 3);
    assert.equal(estado.streakActive, false, 'abriu mas nao praticou');
});

test('praticar duas vezes no mesmo dia conta uma vez so', () => {
    const m = montar({ agora: '2026-09-04T13:00:00Z', estado: { streakDays: 2, lastPracticeDate: '2026-09-03', streakSchema: 1 } });
    const s = abrirApp(m);
    s.activateStreak();
    s.activateStreak();
    s.activateStreak();
    assert.equal(s.state.streakDays, 3);
});

// ── O freeze, que nunca funcionou para quem abria o app ─────────────────────

test('freeze protege quem ABRIU o app sem estudar (o caso que o codigo velho nao cobria)', () => {
    // Praticou dia 2. Dia 3 abriu e não estudou. Dia 4 volta com 1 freeze.
    let estado = { streakDays: 6, lastPracticeDate: '2026-09-02', streakFreezes: 1, streakSchema: 1 };

    let m = montar({ agora: '2026-09-03T13:00:00Z', estado });
    estado = { ...abrirApp(m).state };
    assert.equal(estado.streakDays, 6, 'dia 3: praticou ontem, streak viva');
    assert.equal(estado.streakFreezes, 1, 'nao gastou freeze a toa');

    m = montar({ agora: '2026-09-04T13:00:00Z', estado });
    const s = abrirApp(m);
    assert.equal(s.state.streakDays, 6, 'dia 4: freeze salvou a streak');
    assert.equal(s.state.streakFreezes, 0, 'gastou o freeze');
    assert.equal(s.state.lastFreezeUsed, '2026-09-04');

    s.activateStreak();
    assert.equal(s.state.streakDays, 7, 'praticar depois do freeze continua a sequencia');
});

test('sem freeze, faltar um dia inteiro zera', () => {
    const m = montar({ agora: '2026-09-04T13:00:00Z', estado: { streakDays: 9, lastPracticeDate: '2026-09-02', streakFreezes: 0, streakSchema: 1 } });
    const s = abrirApp(m);
    assert.equal(s.state.streakDays, 0);
});

test('freeze cobre um dia so, nao dois', () => {
    const m = montar({ agora: '2026-09-05T13:00:00Z', estado: { streakDays: 9, lastPracticeDate: '2026-09-02', streakFreezes: 2, streakSchema: 1 } });
    const s = abrirApp(m);
    assert.equal(s.state.streakDays, 0, 'gap de 3 dias nao e coberto');
    assert.equal(s.state.streakFreezes, 2, 'nao desperdicou freeze numa streak ja perdida');
});

test('sumir por dias e voltar recomeca em 1', () => {
    const m = montar({ agora: '2026-09-20T13:00:00Z', estado: { streakDays: 12, lastPracticeDate: '2026-09-02', streakSchema: 1 } });
    const s = abrirApp(m);
    assert.equal(s.state.streakDays, 0);
    s.activateStreak();
    assert.equal(s.state.streakDays, 1);
});

// ── Migração ────────────────────────────────────────────────────────────────

test('migracao preserva streak de quem praticou hoje (streakActive true)', () => {
    const m = montar({ agora: '2026-09-04T13:00:00Z', estado: { streakDays: 7, streakActive: true, lastQuestDate: '2026-09-04' } });
    const s = abrirApp(m);
    assert.equal(s.state.streakDays, 7, 'nao perdeu nada na migracao');
    assert.equal(s.state.lastPracticeDate, '2026-09-04');
    assert.equal(s.state.streakSchema, 1);
});

test('migracao preserva streak de quem praticou ontem (streakActive false)', () => {
    // Estado velho: o reset rodou hoje, zerou streakActive, e a streak sobreviveu
    // — pela regra antiga isso só acontecia se tivesse praticado na véspera.
    const m = montar({ agora: '2026-09-04T13:00:00Z', estado: { streakDays: 7, streakActive: false, lastQuestDate: '2026-09-04' } });
    const s = abrirApp(m);
    assert.equal(s.state.lastPracticeDate, '2026-09-03', 'deduziu a vespera do rotulo');
    assert.equal(s.state.streakDays, 7, 'streak preservada');
});

test('migracao nao deixa data de pratica no futuro', () => {
    // Rótulo UTC um dia à frente: acontece com quem usou o app depois das 21h BRT.
    const m = montar({ agora: '2026-09-04T13:00:00Z', estado: { streakDays: 3, streakActive: true, lastQuestDate: '2026-09-05' } });
    const s = abrirApp(m);
    assert.equal(s.state.lastPracticeDate, '2026-09-04', 'grampeado em hoje');
    assert.equal(s.state.streakDays, 3);
    // Data no futuro travaria o activateStreak seguinte.
    s.activateStreak();
    assert.equal(s.state.streakDays, 3, 'ja tinha contado hoje');
});

test('migracao e idempotente', () => {
    const m = montar({ agora: '2026-09-04T13:00:00Z', estado: { streakDays: 5, streakActive: true, lastQuestDate: '2026-09-04' } });
    const s = abrirApp(m);
    const depoisDa1a = JSON.stringify(s.state);
    s.migrarStreakBR();
    s.migrarStreakBR();
    assert.equal(JSON.stringify(s.state), depoisDa1a);
    assert.equal(s.state.streakSchema, 1);
});

test('quem nunca praticou migra sem ganhar streak de graca', () => {
    const m = montar({ agora: '2026-09-04T13:00:00Z', estado: { streakDays: 0, streakActive: false, lastQuestDate: '2026-09-01' } });
    const s = abrirApp(m);
    assert.equal(s.state.streakDays, 0);
    assert.equal(s.state.lastPracticeDate, '');
});

// ── Merge com o servidor ────────────────────────────────────────────────────

test('resolverStreak impede ressurreicao de streak velha vinda do servidor', () => {
    const m = montar({ agora: '2026-09-04T13:00:00Z' });
    const s = m.Store;
    // Simula o estado logo após o merge: streakDays veio por MAIOR do servidor,
    // mas a data que o acompanha é de 5 dias atrás.
    s.state.streakDays = 12;
    s.state.lastPracticeDate = '2026-08-30';
    s.state.streakSchema = 1;
    s.resolverStreak();
    assert.equal(s.state.streakDays, 0, 'numero sem data que o justifique nao sobrevive');
});

test('resolverStreak preserva restauracao legitima vinda de outro aparelho', () => {
    const m = montar({ agora: '2026-09-04T13:00:00Z' });
    const s = m.Store;
    s.state.streakDays = 12;
    s.state.lastPracticeDate = '2026-09-03';   // praticou ontem no celular
    s.state.streakSchema = 1;
    s.resolverStreak();
    assert.equal(s.state.streakDays, 12, 'streak legitima do outro aparelho e mantida');
});

test('resolverStreak e idempotente', () => {
    const m = montar({ agora: '2026-09-04T13:00:00Z', estado: { streakDays: 6, lastPracticeDate: '2026-09-02', streakFreezes: 1, streakSchema: 1 } });
    const s = abrirApp(m);
    const a = JSON.stringify(s.state);
    s.resolverStreak();
    s.resolverStreak();
    assert.equal(JSON.stringify(s.state), a, 'nao gasta um segundo freeze');
});

// ── Helpers ─────────────────────────────────────────────────────────────────

test('capyDiaBR e capyDiasEntre nao caem na borda do dia', () => {
    const { ctx } = montar({ agora: '2026-09-04T01:30:00Z' });   // 22h30 BRT do dia 3
    assert.equal(ctx.capyHojeBR(), '2026-09-03');
    assert.equal(ctx.capyDiaBR(-1, '2026-09-01'), '2026-08-31', 'atravessa virada de mes');
    assert.equal(ctx.capyDiaBR(1, '2026-02-28'), '2026-03-01', 'fevereiro sem bissexto');
    assert.equal(ctx.capyDiasEntre('2026-09-01', '2026-09-04'), 3);
    assert.equal(ctx.capyDiasEntre('2026-10-17', '2026-10-19'), 2, 'janela de horario de verao');
    assert.equal(ctx.capyDiasEntre('2026-09-04', '2026-09-04'), 0);
    assert.equal(ctx.capyDiasEntre('', '2026-09-04'), null);
});
