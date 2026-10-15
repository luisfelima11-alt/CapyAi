// Admin novo (26/set): as rotas que o admin pensado para o celular usa além das
// que já existiam — ficha do aluno, anotações do professor, saúde do site e
// cursos. Roda o bloco DE VERDADE do api/index.js ("Admin novo" até "fim do
// admin novo"), com o banco falso; as constantes e o resumoDoAluno também são
// os reais, recortados do arquivo.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const FONTE = fs.readFileSync(path.join(ROOT, 'api/index.js'), 'utf8');
const Security = require('../api/security');

function recorte(inicio, fim) {
  const i = FONTE.indexOf(inicio);
  const j = FONTE.indexOf(fim, i + inicio.length);
  assert.ok(i >= 0 && j > i, `recorte sumiu: ${inicio}`);
  return FONTE.slice(i, j + fim.length);
}
const CONSTANTES = [
  recorte('const CRONS_DO_SITE = [', '];'),
  recorte('const CURSOS_DO_ADMIN = [', '];'),
  recorte('function resumoDoAluno(', '\n}\n'),
].join('\n');
const ROTAS = recorte('    // ── Admin novo (26/set)', '    // ── fim do admin novo');

const HOJE = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
const diasAtras = n => new Date(new Date(HOJE + 'T12:00:00Z') - n * 86400000).toISOString().slice(0, 10);

function rota(options = {}) {
  const csrf = 'csrf-de-teste';
  const req = {
    method: options.method || 'GET',
    url: options.url,
    headers: {
      origin: 'https://www.capyenglish.com.br',
      ...(options.comCsrf ? { cookie: `${Security.COOKIE_NAMES.csrf}=${csrf}`, 'x-csrf-token': csrf } : {}),
    },
  };
  const res = { statusCode: 200, body: undefined, status(c) { this.statusCode = c; return this; }, json(b) { this.body = b; return this; } };
  const notas = { ...(options.notas || {}) };
  const tabelas = options.tabelas || {};
  const context = vm.createContext({
    console, JSON, String, Array, Number, Boolean, Object, Promise, Date, URL, Math,
    req, res, url: req.url.split('?')[0], crypto,
    isAdminReq: async () => options.admin !== false,
    assertCsrf: Security.assertCsrf,
    readBody: async () => options.body || {},
    sanitizeStoredJson: v => v,
    CAMPAIGN_TRACKER: { id: 'desafio-capy-2026-09' },
    VOZ_MINUTOS_MES: { free: 0, pro: 0, super: 60 },
    VOZ_TETO_USD_MES: 50,
    sb: async caminho => {
      for (const [prefixo, linhas] of Object.entries(tabelas)) if (caminho.startsWith(prefixo)) return linhas;
      return [];
    },
    lerNotas: async id => (notas[id] || []).slice(),
    gravarNotas: async (id, lista) => { notas[id] = lista; },
    memoriaDoAluno: async () => options.memoria || [],
    consumoVozDoMes: async quem => (quem === null ? options.vozGeral : options.vozAluno) || { segundos: 0, minutos: 0, usd: 0 },
    custoIaDoMes: async () => options.ia || null,
    jevDoMes: async () => options.jev || null,
    lerBrief: async () => options.resumo || null,
    aulasContexto: () => require('../api/aulas-contexto.json'),
  });
  vm.runInContext(CONSTANTES + '\nasync function rodar() {\n' + ROTAS + '\n}', context);
  return { rodar: () => context.rodar(), res, notas };
}

const LUAN = { id: 'grant-luan', name: 'Luan Soares', email: 'luan@exemplo.com', created_at: '2026-08-03T12:00:00Z' };

test('ficha: so admin, id em lista fechada, 404 para quem nao existe', async () => {
  const semAdmin = rota({ admin: false, url: '/api/admin/aluno?id=grant-luan' });
  await semAdmin.rodar();
  assert.equal(semAdmin.res.statusCode, 401);

  const lixo = rota({ url: '/api/admin/aluno?id=' + encodeURIComponent('x&select=*') });
  await lixo.rodar();
  assert.equal(lixo.res.statusCode, 400);

  const ninguem = rota({ url: '/api/admin/aluno?id=grant-sumido', tabelas: { '/accounts': [] } });
  await ninguem.rodar();
  assert.equal(ninguem.res.statusCode, 404);
});

test('ficha: junta conta, plano, progresso, perfil, voz, memoria e anotacoes', async () => {
  const h = rota({
    url: '/api/admin/aluno?id=grant-luan',
    tabelas: {
      '/accounts': [LUAN],
      '/user_state?user_id=eq.grant-luan': [{ data: { xp: 3840, streakDays: 2, lastPracticeDate: diasAtras(1), completedLessons: [1, 2, 3], completedMinis: [1], badges: ['a', 'b'] } }],
      '/user_profiles': [{ plan: 'super', plan_expires_at: '2099-12-31T23:59:59Z', kiwify_subscription_id: null, english_level: 'beginner', goals: ['work'], interests: ['sports'], interests_detail: 'Flamengo' }],
      '/user_state?user_id=eq.__campaign_': [{ data: { dailyXp: { [diasAtras(3)]: 40, [diasAtras(5)]: 0 } } }],
    },
    memoria: [{ id: 'f_abc123', texto: 'Tem uma filha, a Ana', tipo: 'familia', em: '2026-09-22T12:00:00Z', canal: 'voz' }],
    notas: { 'grant-luan': [{ id: 'n_aaaaaaaaaaaa', texto: 'Ligar na quinta', em: '2026-09-21T12:00:00Z' }] },
    vozAluno: { segundos: 720, minutos: 12, usd: 0.3 },
  });
  await h.rodar();
  const f = h.res.body;
  assert.equal(h.res.statusCode, 200);
  assert.equal(f.aluno.name, 'Luan Soares');
  assert.equal(f.aluno.status, 'idle');
  assert.equal(f.aluno.daysSincePractice, 1);
  assert.equal(f.aluno.criadoEm, LUAN.created_at);
  assert.deepEqual({ ...f.plano }, { plano: 'super', expira: '2099-12-31T23:59:59Z', cortesia: true });
  assert.equal(f.progresso.aulas, 3);
  assert.equal(f.progresso.minis, 1);
  assert.equal(f.progresso.medalhas, 2);
  assert.equal(f.progresso.dias.length, 14);
  assert.equal(f.progresso.dias.at(-1).dia, HOJE);
  const praticou = f.progresso.dias.filter(d => d.praticou).map(d => d.dia);
  assert.deepEqual([...praticou], [diasAtras(3), diasAtras(1)], 'corrida XP (dailyXp > 0) + o dia da última prática');
  assert.equal(f.perfil.nivel, 'beginner');
  assert.equal(f.perfil.detalhe, 'Flamengo');
  assert.deepEqual({ ...f.voz }, { minutos: 12, cota: 60 });
  assert.equal(f.memoria[0].texto, 'Tem uma filha, a Ana');
  assert.equal(f.notas[0].texto, 'Ligar na quinta');
});

test('ficha: aluno pagante (com assinatura Kiwify) nao aparece como cortesia', async () => {
  const h = rota({
    url: '/api/admin/aluno?id=grant-luan',
    tabelas: { '/accounts': [LUAN], '/user_profiles': [{ plan: 'pro', kiwify_subscription_id: 'sub_123' }] },
  });
  await h.rodar();
  assert.equal(h.res.body.plano.cortesia, false);
  assert.equal(h.res.body.voz.cota, 0, 'Pro não tem voz');
  assert.equal(h.res.body.aluno.status, 'never_started');
});

test('anotacoes: exigem CSRF, texto nao vazio, e apagar so o que existe', async () => {
  const semCsrf = rota({ method: 'POST', url: '/api/admin/notas', body: { aluno: 'grant-luan', texto: 'oi' } });
  await assert.rejects(semCsrf.rodar(), e => e.status === 403);

  const vazia = rota({ method: 'POST', url: '/api/admin/notas', comCsrf: true, body: { aluno: 'grant-luan', texto: '   ' } });
  await vazia.rodar();
  assert.equal(vazia.res.statusCode, 400);

  const alunoRuim = rota({ method: 'POST', url: '/api/admin/notas', comCsrf: true, body: { aluno: '../x', texto: 'oi' } });
  await alunoRuim.rodar();
  assert.equal(alunoRuim.res.statusCode, 400);

  const nova = rota({ method: 'POST', url: '/api/admin/notas', comCsrf: true,
    body: { aluno: 'grant-luan', texto: '  Disse que trava no listening  ' },
    notas: { 'grant-luan': [{ id: 'n_bbbbbbbbbbbb', texto: 'antiga', em: null }] } });
  await nova.rodar();
  assert.equal(nova.res.statusCode, 200);
  const salvas = nova.notas['grant-luan'];
  assert.equal(salvas.length, 2);
  assert.match(salvas[0].id, /^n_[a-f0-9]{12}$/);
  assert.equal(salvas[0].texto, 'Disse que trava no listening', 'a mais nova vem primeiro, sem espaço sobrando');

  const naoExiste = rota({ method: 'POST', url: '/api/admin/notas/apagar', comCsrf: true, body: { aluno: 'grant-luan', id: 'n_zzzzzzzzzzzz' } });
  await naoExiste.rodar();
  assert.equal(naoExiste.res.statusCode, 404);

  const apaga = rota({ method: 'POST', url: '/api/admin/notas/apagar', comCsrf: true, body: { aluno: 'grant-luan', id: 'n_bbbbbbbbbbbb' },
    notas: { 'grant-luan': [{ id: 'n_bbbbbbbbbbbb', texto: 'antiga', em: null }, { id: 'n_cccccccccccc', texto: 'fica', em: null }] } });
  await apaga.rodar();
  assert.deepEqual(apaga.notas['grant-luan'].map(n => n.id), ['n_cccccccccccc']);
});

test('saude: ultima vez de cada tarefa agendada, resumo de hoje, Kiwify e voz', async () => {
  const h = rota({
    url: '/api/admin/saude',
    tabelas: {
      '/user_state?user_id=like.__cron_': [
        { user_id: '__cron_teacher-brief', data: { em: '2026-09-26T09:00:05Z', ok: true, detalhe: 'resumo de 2026-09-26' } },
        { user_id: '__cron_send-reminders', data: { em: '2026-09-25T22:00:03Z', ok: false, detalhe: 'falhou' } },
      ],
      '/webhook_events': [],
    },
    resumo: { generatedAt: '2026-09-26T09:00:05Z' },
    vozGeral: { segundos: 1800, minutos: 30, usd: 1.234 },
    ia: { usd: 0.021, rotas: [{ rota: '/api/chat', chamadas: 10, usd: 0.02 }], evitadas: 4, economiaUsd: 0.004 },
    jev: { modo: 'sombra', usos: { desafio: { notas: 3, falhas: 0, comparadas: 3, concorda: 2, confiantes: 1, concordaConfiantes: 1 } }, usd: 0.00002 },
  });
  await h.rodar();
  const s = h.res.body;
  assert.equal(s.crons.length, 2);
  const porNome = Object.fromEntries(s.crons.map(c => [c.nome, c]));
  assert.equal(porNome['teacher-brief'].ultima, '2026-09-26T09:00:05Z');
  assert.equal(porNome['teacher-brief'].ok, true);
  assert.equal(porNome['send-reminders'].ok, false);
  assert.equal(s.resumoHoje.gerado, true);
  assert.deepEqual({ ...s.kiwify }, { eventos: 0, ultima: null });
  assert.deepEqual({ ...s.voz }, { usd: 1.23, minutos: 30, tetoUsd: 50 });
  assert.equal(s.ia.usd, 0.021);      // AI cost of the month, next to voice (29/set)
  assert.equal(s.ia.evitadas, 4);
  assert.equal(s.jev.modo, 'sombra');   // Jev observing, next to the AI cost (30/set)
  assert.equal(s.jev.usos.desafio.concorda, 2);
});

test('saude: tarefa que nunca bateu aparece como "nunca", nao some', async () => {
  const h = rota({ url: '/api/admin/saude', tabelas: {} });
  await h.rodar();
  assert.ok(h.res.body.crons.every(c => c.ultima === null && c.ok === null));
  assert.equal(h.res.body.resumoHoje.gerado, false);
});

test('conteudo: cursos contados do proprio catalogo das aulas', async () => {
  const h = rota({ url: '/api/admin/conteudo' });
  await h.rodar();
  const porNome = Object.fromEntries(h.res.body.cursos.map(c => [c.nome, c.aulas]));
  const catalogo = require('../api/aulas-contexto.json');
  const gps = Object.values(catalogo).filter(a => a.familia === 'gpstronic_aula').length;
  assert.equal(porNome['GPS Tronic'], gps);
  assert.ok(gps >= 14);
  assert.ok(h.res.body.cursos.every(c => c.aulas > 0), 'curso sem aula não aparece');
});

test('rotas do admin novo: todas atras do isAdminReq', async () => {
  for (const [method, url] of [['GET', '/api/admin/saude'], ['GET', '/api/admin/conteudo']]) {
    const h = rota({ admin: false, method, url });
    await h.rodar();
    assert.equal(h.res.statusCode, 401, url);
  }
  const notas = rota({ admin: false, method: 'POST', url: '/api/admin/notas', comCsrf: true, body: { aluno: 'grant-luan', texto: 'x' } });
  await notas.rodar();
  assert.equal(notas.res.statusCode, 401);
});
