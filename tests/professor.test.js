'use strict';
// Painel do professor e turma (19/out/2026): o professor só vê quem entrou na turma
// dele, a página nunca põe texto do aluno como HTML, e a atividade do dia sai da
// diferença entre dois estados salvos.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
process.env.SUPABASE_URL = process.env.SUPABASE_URL || 'https://supabase.invalid';
const { deltaAtividade, resumoAluno, novoCodigoTurma } = require('../api/index.js')._professor;
const api = fs.readFileSync(path.join(ROOT, 'api', 'index.js'), 'utf8');

test('deltaAtividade counts only new minis and XP gained, never negative', () => {
  assert.deepEqual(deltaAtividade({ completedMinis: ['1_1'], xp: 100 }, { completedMinis: ['1_1', '1_2', 'fr:201_1'], xp: 160 }), { minis: 2, xp: 60 });
  // An out-of-date device saving less is not negative progress.
  assert.deepEqual(deltaAtividade({ completedMinis: ['1_1', '1_2'], xp: 300 }, { completedMinis: ['1_1'], xp: 50 }), { minis: 0, xp: 0 });
  assert.deepEqual(deltaAtividade({}, { completedMinis: Array.from({ length: 80 }, (_, i) => `x_${i}`), xp: 9e6 }), { minis: 50, xp: 5000 });
});

test('resumoAluno: today, streak, days away and alerts', () => {
  const hoje = '2026-10-19';
  const ativo = resumoAluno({
    state: { streakDays: 4, xp: 900, completedMinis: ['1_1', 'fr:201_1'], completedLessons: [1], lastPracticeDate: hoje },
    atividade: [{ dia: '2026-10-18', minis: 2, xp: 40 }, { dia: hoje, minis: 1, xp: 20 }], licoes: [], hoje,
  });
  assert.equal(ativo.trilhaHoje, true);
  assert.equal(ativo.minisHoje, 1);
  assert.equal(ativo.diasSem, 0);
  assert.deepEqual(ativo.minisPorIdioma, { en: 1, fr: 1 });
  assert.deepEqual(ativo.alertas, []);

  const sumido = resumoAluno({ state: { lastPracticeDate: '2026-10-14' }, atividade: [], licoes: [], hoje });
  assert.equal(sumido.diasSem, 5);
  assert.deepEqual(sumido.alertas, ['sumido']);
  assert.deepEqual(resumoAluno({ state: {}, hoje }).alertas, ['nunca_praticou']);

  const atrasado = resumoAluno({ state: { lastPracticeDate: hoje }, hoje,
    licoes: [{ id: 'a', lesson_id: 'aula_3', lesson_title: 'Aula 3', submitted_at: new Date(Date.now() - 9 * 86400000).toISOString(), xp_earned: 75 }] });
  assert.deepEqual(atrasado.alertas, ['licao_atrasada']);
});

test('class codes are 8 characters from an unambiguous alphabet', () => {
  for (let i = 0; i < 50; i++) assert.match(novoCodigoTurma(), /^[a-hjkmnp-z2-9]{8}$/);
});

test('teacher routes require a teacher/admin session and are scoped to the teacher', () => {
  const rota = nome => api.slice(api.indexOf(nome), api.indexOf('\n    }\n', api.indexOf(nome)));
  for (const nome of ["url === '/api/professor/turma'", "url === '/api/professor/remover'", "url.startsWith('/api/professor/licao?')"]) {
    assert.match(rota(nome), /await requireProfessor\(req, res\)/, `${nome} must call requireProfessor`);
  }
  // Every query on the class filters by the teacher id from the session, never from the request.
  assert.match(rota("url === '/api/professor/turma'"), /turma_alunos\?professor_id=eq\.\$\{encodeURIComponent\(profId\)\}/);
  assert.match(rota("url === '/api/professor/remover'"), /professor_id=eq\.\$\{encodeURIComponent\(identity\.appUserId\)\}/);
  // A homework text opens only when its student is in this teacher's class.
  assert.match(rota("url.startsWith('/api/professor/licao?')"), /turma_alunos\?professor_id=eq\.\$\{encodeURIComponent\(identity\.appUserId\)\}&aluno_id=eq\.\$\{encodeURIComponent\(row\.user_id\)\}/);
  // Joining needs a signed-in student and the CSRF token.
  const entrar = rota("url === '/api/turma/entrar'");
  assert.match(entrar, /assertCsrf\(req\)/);
  assert.match(entrar, /requireAppUser\(req, res\)/);
});

test('teacher and class pages build the screen without HTML from student data', () => {
  for (const arquivo of ['assets/js/pages/professor.js', 'assets/js/pages/turma.js']) {
    const fonte = fs.readFileSync(path.join(ROOT, arquivo), 'utf8');
    assert.doesNotMatch(fonte, /innerHTML|outerHTML|insertAdjacentHTML|document\.write/, `${arquivo} must use textContent`);
  }
  const config = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));
  const strict = config.headers.find(group => String(group.source).includes('4_Login_Capy_Yara_Welcomes_You'));
  assert.match(strict.source, /professor\.html/);
  assert.match(strict.source, /turma\.html/);
});

test('the migration keeps the class tables server-only', () => {
  const sql = fs.readFileSync(path.join(ROOT, 'supabase', 'migrations', '202610190003_turmas.sql'), 'utf8');
  for (const tabela of ['turmas', 'turma_alunos', 'atividade_diaria']) {
    assert.match(sql, new RegExp(`alter table public\\.${tabela} enable row level security`));
  }
  assert.match(sql, /revoke all on public\.turmas, public\.turma_alunos, public\.atividade_diaria from anon, authenticated/);
  assert.match(sql, /grant execute on function public\.somar_atividade\([^)]*\) to service_role/);
});
