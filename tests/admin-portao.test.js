// Portão do admin (26/set). O Luis relatou: "fica aparecendo que a senha tá
// errada, sendo que nem tem a parte de colocar a senha". A conta dele é admin
// no servidor; o defeito era a tela:
//  - toda falha virava "Chave inválida", frase da versão antiga que pedia chave;
//  - com o navegador logado na conta de um aluno não havia como trocar de conta;
//  - o login ignorava ?next=admin.html e, com alguém logado, pulava para a home.
//
// Roda o admin-1.js e o trecho do login DE VERDADE, num vm com DOM falso.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const flush = async () => { for (let n = 0; n < 20; n++) await new Promise(r => setImmediate(r)); };

function elemento(id, escondido) {
  const classes = new Set(escondido ? ['hidden'] : []);
  const ouvintes = {};
  return {
    id, textContent: '', innerHTML: '', value: '', disabled: false, checked: false,
    style: { setProperty() {} }, dataset: {},
    classList: {
      add: (...c) => c.forEach(x => classes.add(x)),
      remove: (...c) => c.forEach(x => classes.delete(x)),
      toggle(c, forca) { const on = forca === undefined ? !classes.has(c) : Boolean(forca); if (on) classes.add(c); else classes.delete(c); return on; },
      contains: c => classes.has(c),
    },
    addEventListener(tipo, fn) { (ouvintes[tipo] = ouvintes[tipo] || []).push(fn); },
    disparar(tipo) { return Promise.all((ouvintes[tipo] || []).map(fn => fn({ preventDefault() {}, currentTarget: this }))); },
    querySelectorAll: () => [], querySelector: () => null,
    appendChild() {}, setAttribute() {}, removeAttribute() {}, remove() {}, focus() {},
  };
}

// Sobe o script do admin com a sessão e a resposta do /api/admin/overview pedidas.
// Os DOIS admins (o novo, admin-v2.js, e o antigo, admin-1.js) têm o mesmo portão.
const SCRIPTS_DO_ADMIN = [['admin novo', 'assets/js/pages/admin-v2.js'], ['admin antigo', 'assets/js/pages/admin-1.js']];

// `mfa` é a resposta do /api/auth/mfa/status. O padrão é o de hoje: nenhum app
// autenticador cadastrado e ADMIN_REQUIRE_MFA desligado — o painel abre direto.
async function abrirAdmin({ script = 'assets/js/pages/admin-v2.js', sessao = null, overview = { status: 200 },
  mfa = { aal: 'aal1', enforced: false, factors: [] } } = {}) {
  const els = new Map();
  const ESCONDIDOS_NO_HTML = ['app', 'gate-quem', 'gate-trocar', 'gate-error',
    'mfa-code-form', 'mfa-code-erro', 'mfa-setup', 'mfa-setup-erro', 'mfa-banner', 'mfa-qr'];
  const el = id => {
    if (!els.has(id)) els.set(id, elemento(id, ESCONDIDOS_NO_HTML.includes(id)));
    return els.get(id);
  };
  const guardado = new Map();
  const chamadas = { logout: 0, fetch: [] };
  const location = { href: 'https://www.capyenglish.com.br/admin.html', search: '' };
  const Auth = {
    getSession: () => sessao,
    ready: () => Promise.resolve(sessao),
    refreshSession: () => Promise.resolve(sessao),
    logout: () => { chamadas.logout++; },
    getCsrfToken: () => '',
  };
  const context = {
    console, JSON, Math, Date, Promise, URLSearchParams, Set, Map,
    setTimeout: () => 0, clearTimeout() {}, setInterval: () => 0,
    location, Auth,
    navigator: {},
    addEventListener() {},
    sessionStorage: { getItem: k => (guardado.has(k) ? guardado.get(k) : null), setItem: (k, v) => guardado.set(k, String(v)), removeItem: k => guardado.delete(k) },
    localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
    document: {
      getElementById: el,
      querySelectorAll: () => [],
      querySelector: () => null,
      createElement: () => elemento('novo'),
      addEventListener() {},
      body: elemento('body'),
    },
    fetch: async (url) => {
      chamadas.fetch.push(String(url));
      if (String(url) === '/api/auth/mfa/status') {
        return { status: 200, ok: true, json: async () => mfa, clone() { return this; } };
      }
      if (String(url) === '/api/auth/mfa/enroll') {
        return { status: 200, ok: true, json: async () => ({ factorId: 'f-novo', qrCode: 'data:image/svg+xml;utf8,x', secret: 'JBSWY3DPEHPK3PXP' }), clone() { return this; } };
      }
      if (String(url) === '/api/admin/overview') {
        if (overview.rede) throw new Error('rede caiu');
        return {
          status: overview.status, ok: overview.status < 400,
          json: async () => ({}), clone() { return this; },
        };
      }
      return new Promise(() => {});   // o resto do painel fica "carregando" para sempre
    },
  };
  context.window = context;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(ROOT, script), 'utf8'), context, { filename: script });
  await flush();
  const visivel = id => !el(id).classList.contains('hidden');
  return { el, visivel, guardado, chamadas, location };
}

for (const [nome, script] of SCRIPTS_DO_ADMIN) {
  test(`${nome}: aluno logado no admin: diz QUEM está logado e oferece trocar de conta, sem "Chave inválida"`, async () => {
    const a = await abrirAdmin({ script, sessao: { id: 'grant-1', role: 'student', name: 'Luan', email: 'luan@exemplo.com' } });
    assert.equal(a.visivel('gate'), true);
    assert.equal(a.visivel('app'), false);
    assert.equal(a.el('gate-error').textContent, 'Esta conta não é de administrador.');
    assert.equal(a.el('gate-quem').textContent, 'Você está conectado como Luan (luan@exemplo.com).');
    assert.equal(a.visivel('gate-quem'), true);
    assert.equal(a.visivel('gate-trocar'), true);
    assert.equal(a.visivel('gate-btn'), false, 'apertar "Entrar" com a conta errada não resolve nada');
    assert.ok(!a.chamadas.fetch.includes('/api/admin/overview'), 'conta de aluno nem chama a rota de admin');
  });

  test(`${nome}: trocar de conta: sai e deixa o recado para o login voltar ao admin`, async () => {
    const a = await abrirAdmin({ script, sessao: { id: 'grant-1', role: 'student', name: 'Luan', email: 'luan@exemplo.com' } });
    await a.el('gate-trocar').disparar('click');
    assert.equal(a.chamadas.logout, 1);
    assert.equal(a.guardado.get('capyDepoisDoLogin'), 'admin.html');
  });

  test(`${nome}: deslogado: só o botão de entrar, e ele leva ao login COM a volta para o admin`, async () => {
    const a = await abrirAdmin({ script, sessao: null });
    assert.equal(a.visivel('gate'), true);
    assert.equal(a.visivel('gate-error'), false);
    assert.equal(a.visivel('gate-btn'), true);
    assert.equal(a.visivel('gate-trocar'), false);
    await a.el('gate-btn').disparar('click');
    assert.equal(a.location.href, '4_Login_Capy_Yara_Welcomes_You.html?next=admin.html');
  });

  test(`${nome}: admin com sessão válida entra direto no painel`, async () => {
    const a = await abrirAdmin({ script, sessao: { id: 'luis', role: 'admin', name: 'Luis', email: 'luis@exemplo.com' } });
    assert.equal(a.visivel('app'), true);
    assert.equal(a.visivel('gate'), false);
  });

  test(`${nome}: admin com sessão vencida (401): pede para entrar de novo`, async () => {
    const a = await abrirAdmin({ script, sessao: { id: 'luis', role: 'admin', name: 'Luis' }, overview: { status: 401 } });
    assert.equal(a.visivel('gate'), true);
    assert.equal(a.el('gate-error').textContent, 'Sua sessão venceu. Entre de novo.');
    assert.equal(a.visivel('gate-btn'), true);
  });

  test(`${nome}: servidor fora do ar: diz que a falha é de conexão, não de senha`, async () => {
    const a = await abrirAdmin({ script, sessao: { id: 'luis', role: 'admin', name: 'Luis' }, overview: { rede: true } });
    assert.equal(a.visivel('gate'), true);
    assert.match(a.el('gate-error').textContent, /servidor/);
    assert.equal(a.el('gate-btn').textContent, 'Tentar de novo');
  });
}

test('a frase da versão antiga saiu da página e do script', () => {
  // Comentário pode citar a frase (é o histórico do bug); o que vai para a tela, não.
  const semComentarios = s => s.replace(/<!--[\s\S]*?-->/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
  for (const arq of ['admin.html', 'admin-antigo.html', 'assets/js/pages/admin-1.js', 'assets/js/pages/admin-v2.js']) {
    assert.ok(!semComentarios(fs.readFileSync(path.join(ROOT, arq), 'utf8')).includes('Chave inválida'), arq);
  }
});

// ── Login: para onde voltar depois de entrar ────────────────────────────────
// Tira do arquivo real só o bloco do destino e roda num vm.
function destinoCom({ search = '', recado = null, storageQuebrado = false } = {}) {
  const fonte = fs.readFileSync(path.join(ROOT, 'assets/js/pages/4_login_capy_yara_welcomes_you-2.js'), 'utf8');
  const ini = fonte.indexOf('const DESTINOS_DEPOIS_DO_LOGIN');
  const fim = fonte.indexOf('/* ── success splash');
  assert.ok(ini > 0 && fim > ini, 'bloco do destino não encontrado no login');
  const guardado = new Map(recado ? [['capyDepoisDoLogin', recado]] : []);
  const context = {
    URLSearchParams, String,
    window: { location: { search, href: '' } },
    sessionStorage: storageQuebrado
      ? { getItem() { throw new Error('bloqueado'); }, removeItem() { throw new Error('bloqueado'); } }
      : { getItem: k => (guardado.has(k) ? guardado.get(k) : null), removeItem: k => guardado.delete(k) },
  };
  vm.createContext(context);
  vm.runInContext(fonte.slice(ini, fim) + '\n;globalThis.__destino = destinoDepoisDoLogin(); globalThis.__ir = irParaDestino;', context);
  return { destino: context.__destino, ir: context.__ir, guardado, window: context.window };
}

test('login: next=admin.html volta para o admin', () => {
  assert.equal(destinoCom({ search: '?next=admin.html' }).destino, 'admin.html');
  assert.equal(destinoCom({ search: '?next=/admin.html' }).destino, 'admin.html');
});

test('login: next fora da lista fechada é ignorado (sem redirecionamento aberto)', () => {
  for (const ruim of ['https://evil.example/admin.html', '//evil.example', 'learn.html', 'javascript:alert(1)', '../admin.html']) {
    assert.equal(destinoCom({ search: '?next=' + encodeURIComponent(ruim) }).destino, null, ruim);
  }
});

test('login: o recado do "trocar de conta" vale, e é usado uma vez só', () => {
  const r = destinoCom({ recado: 'admin.html' });
  assert.equal(r.destino, 'admin.html');
  r.ir(r.destino);
  assert.equal(r.window.location.href, 'admin.html');
  assert.equal(r.guardado.has('capyDepoisDoLogin'), false);
  assert.equal(destinoCom({ recado: 'https://evil.example' }).destino, null);
});

test('login: sem next e sem recado segue o caminho de sempre; storage bloqueado não quebra', () => {
  assert.equal(destinoCom().destino, null);
  assert.equal(destinoCom({ storageQuebrado: true }).destino, null);
});
