// ════════════════════════════════════════════════════════════════════════════
// A máquina de estados dos lembretes
// ════════════════════════════════════════════════════════════════════════════
// Roda a função `CapyPush.estado()` REAL, extraída do components.js. Ela é pura
// de propósito: a decisão "o que mostrar para este aluno" é a parte com mais
// combinações e a que mais erra em silêncio — e não precisa de navegador para
// ser conferida.
//
// O que os testes protegem, em ordem de importância:
//  1. quem DESLIGOU não pode ser reinscrito por nenhum caminho;
//  2. iPhone em aba tem que cair no balde do iOS, nunca em "não suportado" —
//     lá `Notification` é undefined, e o balde errado significa que o aluno de
//     iPhone nunca descobre que precisa instalar o app;
//  3. os dois becos sem saída (`orfa` e `granted_sem_sub`) têm que ser
//     distinguíveis de "ligado", senão o conserto automático nunca dispara.
// ════════════════════════════════════════════════════════════════════════════

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const fonte = fs.readFileSync(path.resolve(__dirname, '..', 'components.js'), 'utf8');

// Extrai só o método `estado(ctx)` do CapyPush, do arquivo real.
const inicio = fonte.indexOf('    estado(ctx) {');
const fim = fonte.indexOf('\n    },', inicio);
assert.ok(inicio > -1 && fim > inicio, 'nao consegui recortar CapyPush.estado do components.js');
const corpo = fonte.slice(inicio, fim + 7);

const ctxVm = {};
vm.createContext(ctxVm);
new vm.Script(`globalThis.CapyPush = { ${corpo} };`).runInContext(ctxVm);
const estado = ctx => ctxVm.CapyPush.estado(ctx);

// Aluno de Android com tudo funcionando; cada teste muda só o que interessa.
const base = {
    permission: 'granted', suportado: true, temSubNavegador: true,
    temSubServidor: true, ios: false, standalone: false, logado: true, optOut: false,
};
const com = extra => ({ ...base, ...extra });

test('tudo certo => ligado', () => {
    assert.equal(estado(base), 'ligado');
});

test('quem desligou nao e reinscrito por NADA (optOut vence tudo)', () => {
    // Se qualquer um destes escapar, o app reinscreve quem pediu para parar —
    // e vira aquele site que não respeita o "não".
    assert.equal(estado(com({ optOut: true })), 'desligado_por_escolha');
    assert.equal(estado(com({ optOut: true, permission: 'default' })), 'desligado_por_escolha');
    assert.equal(estado(com({ optOut: true, temSubNavegador: false })), 'desligado_por_escolha');
    assert.equal(estado(com({ optOut: true, ios: true, standalone: false })), 'desligado_por_escolha');
    assert.equal(estado(com({ optOut: true, suportado: false })), 'desligado_por_escolha');
});

test('iPhone em aba cai no balde do iOS, nao em "nao suportado"', () => {
    // No Safari em aba `Notification` nem existe, entao suportado=false. Se a
    // ordem das checagens inverter, o iPhone vira "nao_suportado" e o aluno
    // nunca recebe a instrucao de instalar — que e a UNICA coisa que destrava
    // push no iOS.
    assert.equal(estado(com({ ios: true, standalone: false, suportado: false, permission: 'unsupported' })), 'ios_aba');
    assert.equal(estado(com({ ios: true, standalone: false, permission: 'default' })), 'ios_aba');
});

test('iPhone com o app instalado segue o caminho normal', () => {
    assert.equal(estado(com({ ios: true, standalone: true, permission: 'default' })), 'pode_pedir');
    assert.equal(estado(com({ ios: true, standalone: true })), 'ligado');
});

test('os dois becos sem saida sao distinguiveis de "ligado"', () => {
    // orfa: o navegador tem a inscricao, o servidor perdeu (aba velha
    // sobrescreveu o blob de estado inteiro).
    assert.equal(estado(com({ temSubServidor: false })), 'orfa');
    // granted_sem_sub: permissao concedida mas a inscricao sumiu do navegador.
    assert.equal(estado(com({ temSubNavegador: false, temSubServidor: false })), 'granted_sem_sub');
    assert.equal(estado(com({ temSubNavegador: false })), 'granted_sem_sub');
});

test('negado nunca vira pedido', () => {
    assert.equal(estado(com({ permission: 'denied' })), 'negado');
    assert.equal(estado(com({ permission: 'denied', temSubNavegador: false })), 'negado');
});

test('permissao ainda nao pedida => pode_pedir, logado ou nao', () => {
    assert.equal(estado(com({ permission: 'default', temSubNavegador: false, temSubServidor: false })), 'pode_pedir');
    assert.equal(estado(com({ permission: 'default', temSubNavegador: false, temSubServidor: false, logado: false })), 'pode_pedir');
});

test('navegador sem suporte, fora do iOS => nao_suportado', () => {
    assert.equal(estado(com({ suportado: false, permission: 'unsupported' })), 'nao_suportado');
});

test('todo estado alcancavel tem nome (nenhum undefined)', () => {
    const valores = ['default', 'granted', 'denied', 'unsupported'];
    const bool = [true, false];
    const conhecidos = new Set(['desligado_por_escolha', 'ios_aba', 'nao_suportado',
        'negado', 'granted_sem_sub', 'orfa', 'ligado', 'pode_pedir']);
    let n = 0;
    for (const permission of valores)
        for (const suportado of bool)
            for (const temSubNavegador of bool)
                for (const temSubServidor of bool)
                    for (const ios of bool)
                        for (const standalone of bool)
                            for (const optOut of bool) {
                                const r = estado({ permission, suportado, temSubNavegador, temSubServidor, ios, standalone, optOut, logado: true });
                                assert.ok(conhecidos.has(r), `estado desconhecido: ${r}`);
                                n++;
                            }
    assert.equal(n, 256);
});
