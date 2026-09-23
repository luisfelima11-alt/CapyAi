const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.resolve(__dirname, '..');
const vm = require('node:vm');
const crypto = require('node:crypto');

function trackerHarness() {
  let stored = null;
  let instant = '2026-09-04T15:00:00Z';
  let unavailable = false;
  class Clock extends Date { constructor(...args) { super(...(args.length ? args : [instant])); } }
  const source = fs.readFileSync(path.join(ROOT, 'api', 'index.js'), 'utf8');
  const start = source.indexOf('const CAMPAIGN_TRACKER =');
  const end = source.indexOf('const TEACHER_BRIEF_PREFIX', start);
  const ctx = vm.createContext({ Date: Clock, crypto, sb: async (url, options = {}) => {
    if (unavailable) return null;
    if (!options.method) return stored ? [{data: structuredClone(stored)}] : [];
    const data = JSON.parse(options.body).data;
    if (options.method === 'POST') {
      if (stored) return [];
    } else {
      const revision = new URL('https://test/' + url).searchParams.get('data->>revision');
      if (!stored || revision !== 'eq.' + stored.revision) return [];
    }
    stored = structuredClone(data);
    return [{data}];
  }});
  vm.runInContext(source.slice(start, end), ctx);
  return {
    save: (xp, streakDays = 900) => ctx.trackCampaignProgress({appUserId:'student-a'}, {xp, streakDays}),
    read: () => stored,
    at: value => { instant = value; },
    offline: () => { unavailable = true; },
  };
}

test('first sync is an explicit baseline; replay and stale clients never add XP', async () => {
  const h = trackerHarness();
  await h.save(1000); await h.save(1050); await h.save(1050); await h.save(900); await h.save(1050);
  assert.equal(h.read().baselineXp, 1000);
  assert.equal(h.read().campaignXp, 50);
  assert.equal(h.read().maxStreak, 1);
});

test('simultaneous saves retry without losing or duplicating the high-water increase', async () => {
  const h = trackerHarness();
  await h.save(1000);
  await Promise.all([h.save(1020), h.save(1070), h.save(1030), h.save(1100)]);
  assert.equal(h.read().campaignXp, 100);
  assert.equal(h.read().lastXp, 1100);
});

test('simultaneous first saves retain one baseline', async () => {
  const h = trackerHarness();
  await Promise.all([h.save(1000), h.save(1050)]);
  assert.equal(h.read().baselineXp, 1000);
  assert.equal(h.read().campaignXp, 50);
});

test('Brasilia midnight and missed days define period streak, not lifetime streak', async () => {
  const h = trackerHarness();
  await h.save(0);
  h.at('2026-09-05T02:59:59Z'); await h.save(10);
  h.at('2026-09-05T03:00:01Z'); await h.save(20);
  assert.equal(h.read().maxStreak, 2);
  assert.equal(h.read().dailyXp['2026-09-04'], 10);
  assert.equal(h.read().dailyXp['2026-09-05'], 10);
  h.at('2026-09-07T15:00:00Z'); await h.save(30);
  assert.equal(h.read().currentStreak, 1);
  assert.equal(h.read().maxStreak, 2);
});

test('out-of-window saves and unavailable storage cannot fabricate a baseline', async () => {
  const h = trackerHarness();
  h.at('2026-10-11T03:00:00Z'); await h.save(900);
  assert.equal(h.read(), null);
  h.at('2026-09-04T15:00:00Z'); h.offline();
  await assert.rejects(h.save(900), /campaign_read_unavailable/);
  assert.equal(h.read(), null);
});
test('campaign tracker records period deltas separately from lifetime XP', () => {
  const api = fs.readFileSync(path.join(ROOT, 'api', 'index.js'), 'utf8');
  assert.match(api, /CAMPAIGN_TRACKER/); assert.match(api, /baselineXp/); assert.match(api, /dailyXp/);
  assert.match(api, /campaignXp/); assert.match(api, /\/api\/admin\/campaign/);
  assert.match(api, /large_jump/); assert.match(api, /daily_limit/);
});
test('admin has race dashboard, review state and CSV export', () => {
  const html = fs.readFileSync(path.join(ROOT, 'admin.html'), 'utf8');
  const js = fs.readFileSync(path.join(ROOT, 'assets', 'js', 'pages', 'admin-1.js'), 'utf8');
  assert.match(html, /data-tab="campanha"/); assert.match(html, /id="camp-rows"/);
  assert.match(js, /loadCampaign/); assert.match(js, /corrida-xp\.csv/); assert.match(js, /Aguardando sincronização/);
});

function campaignEndpointHarness({ count = 0, cap = 500, failTable, failMode = 'null', instant = '2026-09-04T15:00:00Z', authorized = true } = {}) {
  const calls = [];
  const ids = Array.from({ length: count }, (_, i) => `student-${String(i).padStart(5, '0')}`);
  const tables = {
    '/accounts': ids.map(id => ({ id, name: id, email: `${id}@example.test` })),
    '/user_profiles': ids.map(id => ({ id, plan: 'premium' })),
    '/user_state': ids.map(id => ({ user_id: `__campaign_desafio-capy-2026-09_${id}`, data: {
      campaignXp: 10, activeDays: ['2026-09-04'], currentStreak: 1, maxStreak: 1, lastPracticeDate: '2026-09-04', flags: [],
    } })),
  };
  class Clock extends Date { constructor(...args) { super(...(args.length ? args : [instant])); } }
  class HttpError extends Error { constructor(status, code, message) { super(message); this.status = status; this.code = code; } }
  const response = { statusCode: null, body: null, status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; } };
  const source = fs.readFileSync(path.join(ROOT, 'api', 'index.js'), 'utf8');
  const start = source.indexOf("    if (req.method === 'GET' && url === '/api/admin/campaign') {");
  const end = source.indexOf("    if (req.method === 'GET' && url === '/api/admin/funnel') {", start);
  const trackerStart = source.indexOf('const CAMPAIGN_TRACKER =');
  const trackerEnd = source.indexOf('function campaignRowId', trackerStart);
  const ctx = vm.createContext({ Date: Clock, HttpError, req: { method: 'GET' }, res: response,
    url: '/api/admin/campaign', isAdminReq: async () => authorized,
    buildStudentRoster: () => { throw new Error('Campaign must not load retention roster'); },
    sb: async path => {
      const parsed = new URL('https://example.test' + path);
      const offset = Number(parsed.searchParams.get('offset'));
      const limit = Number(parsed.searchParams.get('limit'));
      const table = parsed.pathname;
      calls.push({ table, offset });
      assert.equal(parsed.searchParams.get('order'), table === '/user_state' ? 'user_id.asc' : 'id.asc');
      assert.equal(limit, 500);
      if (table === '/user_state') assert.ok(parsed.searchParams.get('user_id').startsWith('like.__campaign_'));
      if (table === failTable && offset > 0) {
        if (failMode === 'throw') throw new Error('unavailable');
        return failMode === 'object' ? { message: 'database error' } : null;
      }
      assert.ok(tables[table], `Unexpected table: ${table}`);
      return tables[table].slice(offset, offset + Math.min(cap, limit));
    },
  });
  vm.runInContext(source.slice(trackerStart, trackerEnd) + '\nasync function runCampaignEndpoint() {\n' + source.slice(start, end) + '\n}', ctx);
  return { calls, response, run: () => ctx.runCampaignEndpoint() };
}

test('campaign endpoint reads every account, profile and campaign row beyond 1000 records', async () => {
  const h = campaignEndpointHarness({ count: 1123 });
  await h.run();
  assert.equal(h.response.statusCode, 200);
  assert.equal(h.response.body.participants.length, 1123);
  assert.equal(h.response.body.summary.tracked, 1123);
  assert.equal(h.response.body.summary.totalXp, 11230);
  assert.ok(h.response.body.participants.every(p => p.plan === 'premium'));
  for (const table of ['/accounts', '/user_profiles', '/user_state']) {
    assert.deepEqual(h.calls.filter(c => c.table === table).map(c => c.offset), [0, 500, 1000, 1123]);
  }
});

test('campaign endpoint advances by received rows when server cap is below 500', async () => {
  const h = campaignEndpointHarness({ count: 1101, cap: 137 });
  await h.run();
  assert.equal(h.response.body.summary.total, 1101);
  assert.equal(h.response.body.summary.tracked, 1101);
  for (const table of ['/accounts', '/user_profiles', '/user_state']) {
    assert.deepEqual(h.calls.filter(c => c.table === table).map(c => c.offset), [0, 137, 274, 411, 548, 685, 822, 959, 1096, 1101]);
  }
});

for (const [failTable, failMode] of [['/accounts', 'null'], ['/user_profiles', 'object'], ['/user_state', 'throw']]) {
  test(`campaign endpoint rejects a failed second page of ${failTable} with 503`, async () => {
    const h = campaignEndpointHarness({ count: 700, failTable, failMode });
    await assert.rejects(h.run(), error => error.status === 503 && error.code === 'campaign_unavailable');
    assert.equal(h.response.body, null, 'A partial ranking must never be returned');
  });
}

test('campaign endpoint requires admin before reading any roster data', async () => {
  const h = campaignEndpointHarness({ count: 2, authorized: false });
  await h.run();
  assert.equal(h.response.statusCode, 401);
  assert.equal(h.calls.length, 0);
});

test('campaign endpoint reports phase using inclusive Brasilia campaign dates', async () => {
  for (const [instant, status] of [
    ['2026-09-01T02:59:59Z', 'upcoming'], ['2026-09-01T03:00:00Z', 'active'],
    ['2026-10-11T02:59:59Z', 'active'], ['2026-10-11T03:00:00Z', 'ended'],
  ]) {
    const h = campaignEndpointHarness({ instant });
    await h.run();
    assert.equal(h.response.body.campaign.status, status, instant);
  }
});

test('campaign UI labels distinguish synchronized increases and both streak metrics', () => {
  const html = fs.readFileSync(path.join(ROOT, 'admin.html'), 'utf8');
  const js = fs.readFileSync(path.join(ROOT, 'assets', 'js', 'pages', 'admin-1.js'), 'utf8');
  const campaign = html.slice(html.indexOf('<section id="tab-campanha"'), html.indexOf('<!-- ── Alunos:', html.indexOf('<section id="tab-campanha"')));
  for (const label of ['Aumento de XP sincronizado', 'Com aumento recebido hoje', 'Dias com aumento', 'Sequência atual no período', 'Melhor sequência no período']) assert.ok(campaign.includes(label));
  assert.match(js, /ended: 'Encerrada'/);
  assert.match(js, /Sem sincronização no período/);
  assert.match(js, /🔥 \$\{p\.currentStreak\}/);
  assert.match(js, /🔥 \$\{p\.maxStreak\}/);
  assert.match(js, /colspan="7"/);
});
