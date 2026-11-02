// Migrações do Supabase: regras de RLS usam private.current_account_id().
// Desde a 202611010001 a public.current_account_id() não pode ser executada por
// usuário logado (alerta 0029 do Supabase). Uma regra nova que chame a pública
// faria toda leitura/gravação do aluno falhar com erro de permissão (42501).
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const PASTA = path.join(__dirname, '..', 'supabase', 'migrations');
const arquivos = fs.readdirSync(PASTA).filter(f => f.endsWith('.sql')).sort();
const semComentarios = sql => sql.split('\n').map(l => l.replace(/--.*$/, '')).join('\n');

test('migração depois da 202611010001 não usa public.current_account_id()', () => {
    for (const f of arquivos.filter(f => f.slice(0, 12) > '202611010001')) {
        const sql = semComentarios(fs.readFileSync(path.join(PASTA, f), 'utf8'));
        assert.ok(!/public\.current_account_id\s*\(/.test(sql), `${f} usa public.current_account_id()`);
    }
});

test('a lição de casa tem RLS e as regras da própria linha com a função privada', () => {
    const sql = semComentarios(fs.readFileSync(path.join(PASTA, '202611010003_licao_de_casa.sql'), 'utf8'));
    assert.match(sql, /alter table public\.homework_submissions enable row level security/);
    assert.match(sql, /revoke all on public\.homework_submissions from anon, authenticated/);
    assert.match(sql, /homework_select_own[\s\S]*using \(user_id = private\.current_account_id\(\)\)/);
    assert.match(sql, /homework_insert_own[\s\S]*with check \(\s*user_id = private\.current_account_id\(\)/);
});
