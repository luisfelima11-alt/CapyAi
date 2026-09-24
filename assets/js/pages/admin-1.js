// ══════════════════════════════════════════════════════════════════════════
// AJUSTE AQUI — preços dos planos (usados apenas para estimar faturamento)
const PRECO_PRO   = 47;   // AJUSTE AQUI se o preço do Kiwify mudar
const PRECO_SUPER = 97;
// ══════════════════════════════════════════════════════════════════════════

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[char]);
}

function toast(msg, kind) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'fixed top-4 right-4 z-40 px-4 py-3 rounded-xl font-bold text-sm shadow-lg fade-up ' +
    (kind === 'error' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white');
  el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), 2800);
}

async function api(path, opts = {}, _jaTentou) {
  const r = await fetch(path, {
    ...opts,
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
  });

  // Um 403 aqui quase nunca é "você não é admin" — é o token CSRF ausente ou
  // vencido. O token vive em sessionStorage, que morre quando a aba fecha,
  // enquanto o cookie de sessão sobrevive. Resultado: ler funcionava (GET não
  // exige CSRF) e gravar dava 403, jogando o Luis de volta pro portão com
  // "Chave inválida" — que é a mensagem errada para o problema certo.
  // Aqui a sessão é renovada (o /api/auth/session devolve o token) e a
  // chamada é repetida UMA vez.
  if (r.status === 403 && !_jaTentou && window.Auth && Auth.refreshSession) {
    let corpo = null;
    try { corpo = await r.clone().json(); } catch (e) { /* corpo não-JSON */ }
    if (!corpo || corpo.error === 'invalid_csrf') {
      try { await Auth.refreshSession(); } catch (e) { /* segue e deixa o 403 aparecer */ }
      return api(path, opts, true);
    }
  }

  if (r.status === 401 || r.status === 403) { showGate(true); throw new Error('unauthorized'); }
  return r.json();
}

function showGate(err) {
  document.getElementById('gate').classList.remove('hidden');
  document.getElementById('app').classList.add('hidden');
  document.getElementById('gate-error').classList.toggle('hidden', !err);
}

function showApp() {
  document.getElementById('gate').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  loadAll();
}

document.getElementById('gate-btn').addEventListener('click', async () => {
  const user = await Auth.ready();
  if (!user) { window.location.href = '4_Login_Capy_Yara_Welcomes_You.html?next=admin.html'; return; }
  entrarNoPainel(user);
});

// ── Verificação em 2 etapas (MFA) ─────────────────────────────────────────────
// Depois da senha a sessão é "aal1". Com um app autenticador cadastrado, o
// painel pede o código (vira "aal2") antes de abrir. Sem cadastro, abre e
// mostra o aviso — até ADMIN_REQUIRE_MFA=true, quando o cadastro vira obrigatório.
let mfaFatorPendente = '';

async function mfaStatus() {
  const r = await fetch('/api/auth/mfa/status', { credentials: 'same-origin', cache: 'no-store' });
  if (!r.ok) return null;
  return r.json();
}

async function mfaPost(path, body, _jaTentou) {
  const r = await fetch(path, {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body || {}),
  });
  let data = {};
  try { data = await r.json(); } catch (e) { /* corpo vazio */ }
  // Mesmo caso do api(): aba reaberta perde o token CSRF (sessionStorage).
  if (r.status === 403 && data.error === 'invalid_csrf' && !_jaTentou && Auth.refreshSession) {
    try { await Auth.refreshSession(); } catch (e) { /* deixa o erro aparecer */ }
    return mfaPost(path, body, true);
  }
  if (!r.ok) {
    const erro = new Error(data.message || data.error || 'Falha');
    erro.code = data.error;
    throw erro;
  }
  return data;
}

function mensagemMfa(e) {
  if (e && (e.code === 'rate_limited' || /limit/i.test(e.message))) return 'Muitas tentativas. Espere um minuto.';
  if (e && e.code === 'invalid_code') return 'O código tem 6 dígitos.';
  return 'Código não confere. Confira o relógio do celular e tente o código novo.';
}

async function entrarNoPainel(user) {
  if (user?.role !== 'admin') { showGate(Boolean(user)); return; }
  const st = await mfaStatus().catch(() => null);
  const verificados = (st?.factors || []).filter(f => f.status === 'verified');
  if (st && st.aal !== 'aal2' && verificados.length) { pedirCodigoMfa(verificados[0].id); return; }
  if (st && !verificados.length && st.enforced) { abrirCadastroMfa(true); return; }
  try {
    await api('/api/admin/overview');
    showApp();
    document.getElementById('mfa-banner').classList.toggle('hidden', Boolean(!st || verificados.length));
  } catch (e) { if (e.message !== 'unauthorized') toast('Falha de rede.', 'error'); }
}

function pedirCodigoMfa(factorId) {
  mfaFatorPendente = factorId;
  document.getElementById('gate').classList.remove('hidden');
  document.getElementById('app').classList.add('hidden');
  document.getElementById('gate-btn').classList.add('hidden');
  document.getElementById('gate-error').classList.add('hidden');
  document.getElementById('mfa-code-form').classList.remove('hidden');
  document.getElementById('mfa-code').focus();
}

async function confirmarCodigoMfa(factorId, code) {
  const data = await mfaPost('/api/auth/mfa/verify', { factorId, code });
  if (data.csrfToken && Auth._setCsrf) Auth._setCsrf(data.csrfToken);
  try { await Auth.refreshSession(); } catch (e) { /* o cookie novo já vale */ }
}

document.getElementById('mfa-code-form').addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const erroEl = document.getElementById('mfa-code-erro');
  const btn = document.getElementById('mfa-code-btn');
  erroEl.classList.add('hidden');
  btn.disabled = true;
  try {
    await confirmarCodigoMfa(mfaFatorPendente, document.getElementById('mfa-code').value.trim());
    document.getElementById('mfa-code-form').classList.add('hidden');
    document.getElementById('gate-btn').classList.remove('hidden');
    await api('/api/admin/overview');
    showApp();
  } catch (e) {
    if (e.message === 'unauthorized') return;
    erroEl.textContent = mensagemMfa(e);
    erroEl.classList.remove('hidden');
  } finally { btn.disabled = false; }
});

let mfaCadastroObrigatorio = false;
async function abrirCadastroMfa(obrigatorio) {
  mfaCadastroObrigatorio = Boolean(obrigatorio);
  const box = document.getElementById('mfa-setup');
  const erroEl = document.getElementById('mfa-setup-erro');
  document.getElementById('mfa-setup-cancel').classList.toggle('hidden', mfaCadastroObrigatorio);
  erroEl.classList.add('hidden');
  box.classList.remove('hidden');
  try {
    const d = await mfaPost('/api/auth/mfa/enroll');
    mfaFatorPendente = d.factorId;
    const img = document.getElementById('mfa-qr');
    if (d.qrCode) { img.src = d.qrCode; img.classList.remove('hidden'); }
    document.getElementById('mfa-secret').textContent = d.secret || '';
    document.getElementById('mfa-setup-code').focus();
  } catch (e) {
    erroEl.textContent = e.code === 'mfa_required'
      ? 'Confirme primeiro o código do app que você já cadastrou.'
      : 'Não deu para gerar o QR code agora. Tente de novo em instantes.';
    erroEl.classList.remove('hidden');
  }
}

document.getElementById('mfa-banner-btn').addEventListener('click', () => abrirCadastroMfa(false));
document.getElementById('mfa-setup-cancel').addEventListener('click', () => {
  document.getElementById('mfa-setup').classList.add('hidden');
});
document.getElementById('mfa-setup-form').addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const erroEl = document.getElementById('mfa-setup-erro');
  const btn = document.getElementById('mfa-setup-btn');
  erroEl.classList.add('hidden');
  btn.disabled = true;
  try {
    await confirmarCodigoMfa(mfaFatorPendente, document.getElementById('mfa-setup-code').value.trim());
    document.getElementById('mfa-setup').classList.add('hidden');
    document.getElementById('mfa-banner').classList.add('hidden');
    toast('Verificação em 2 etapas ativada.');
    if (mfaCadastroObrigatorio) { await api('/api/admin/overview'); showApp(); }
  } catch (e) {
    if (e.message === 'unauthorized') return;
    erroEl.textContent = mensagemMfa(e);
    erroEl.classList.remove('hidden');
  } finally { btn.disabled = false; }
});
document.getElementById('logout-btn').addEventListener('click', () => Auth.logout());

// ── Tabs ─────────────────────────────────────────────────────────────────
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => { b.classList.remove('active'); b.classList.add('bg-white/5'); });
    btn.classList.add('active'); btn.classList.remove('bg-white/5');
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
    document.getElementById('tab-' + btn.dataset.tab).classList.remove('hidden');
    // O briefing sai do loadAll de proposito: ele e uma leitura extra que so
    // interessa a quem abriu a aba, e o loadAll dispara a cada login no admin.
    if (btn.dataset.tab === 'agente' && !briefCarregado) loadBrief();
  });
});

// ── Agente: briefing diário do professor ────────────────────────────────────
// TODO texto aqui vem de um modelo de linguagem. Nada entra no DOM sem passar
// por escapeHtml — um aluno pode ter cadastrado o nome como "<img onerror=...>"
// e esse nome vai no prompt.
let briefCarregado = false;

function listaDoBrief(id, itens) {
  const el = document.getElementById(id);
  const arr = Array.isArray(itens) ? itens.slice(0, 6) : [];
  el.innerHTML = arr.length
    ? arr.map(t => `<li class="flex gap-2"><span class="text-white/25">&bull;</span><span>${escapeHtml(t)}</span></li>`).join('')
    : '<li class="text-white/30 italic font-normal">Nada a destacar.</li>';
}

async function loadBrief() {
  const carregando = document.getElementById('ag-carregando');
  const vazio = document.getElementById('ag-vazio');
  const conteudo = document.getElementById('ag-conteudo');
  carregando.classList.remove('hidden');
  vazio.classList.add('hidden');
  conteudo.classList.add('hidden');
  try {
    const d = await api('/api/admin/brief');
    briefCarregado = true;
    carregando.classList.add('hidden');
    document.getElementById('ag-data').textContent = d.date || '';

    if (d.missing) {
      const s = d.summary || {};
      document.getElementById('ag-vazio-nums').textContent =
        `${s.total ?? 0} alunos · ${s.activeToday ?? 0} praticaram hoje · ${s.idle ?? 0} parados · ${s.neverStarted ?? 0} nunca começaram`;
      vazio.classList.remove('hidden');
      return;
    }

    const b = d.brief || {};
    document.getElementById('ag-manchete').textContent = String(b.manchete || '');
    listaDoBrief('ag-churn', b.churn);
    listaDoBrief('ag-acoes', b.acoes);
    listaDoBrief('ag-conteudo-lista', b.conteudo);
    document.getElementById('ag-animo').textContent = String(b.animo || '');
    const u = d.usage;
    document.getElementById('ag-custo').textContent = u
      ? `${u.prompt_tokens || 0} tokens de entrada · ${u.completion_tokens || 0} de saída`
      : '';
    conteudo.classList.remove('hidden');
  } catch (e) {
    carregando.classList.add('hidden');
    if (e.message !== 'unauthorized') toast('Falha ao carregar o briefing.', 'error');
  }
}

document.getElementById('ag-reload').addEventListener('click', () => { briefCarregado = false; loadBrief(); });

// ── Load everything ──────────────────────────────────────────────────────
let goalsData = { monthlyRevenueTarget: 0, studentsTarget: 0, manualRevenue: [] };
let overviewData = null;
let leadsData = [];
let crmFilter = 'todos';

async function loadAll() {
  await Promise.all([loadOverview(), loadCourtesies(), loadGoals(), loadLeads(), loadGps(), loadFunnel(), loadStudents(), loadCampaign()]);
}

let campaignData = null;
async function loadCampaign() {
  const exportButton = document.getElementById('camp-export');
  exportButton.disabled = true;
  campaignData = null;
  try {
    const response = await fetch('/api/admin/campaign', { credentials: 'same-origin', cache: 'no-store' });
    if (response.status === 401 || response.status === 403) { showGate(true); throw new Error('unauthorized'); }
    if (!response.ok) throw new Error('campaign_unavailable');
    const data = await response.json();
    if (!Array.isArray(data.participants) || !data.campaign || !data.summary) throw new Error('invalid_campaign');
    campaignData = data;
    exportButton.disabled = !data.participants.length;
    const c = data.campaign || {}, s = data.summary || {}, list = data.participants || [];
    const phase = ({ upcoming: 'Ainda não começou', active: 'Em andamento', ended: 'Encerrada' })[c.status] || '';
    document.getElementById('camp-period').textContent = `${formatDate(c.startDate)} → ${formatDate(c.endDate)} · ${phase} · atualizado ${new Date(data.generatedAt).toLocaleString('pt-BR', { timeZone: c.timeZone })} (Brasília)`;
    document.getElementById('camp-tracked').textContent = `${s.tracked || 0}/${s.total || 0}`;
    document.getElementById('camp-xp').textContent = Number(s.totalXp || 0).toLocaleString('pt-BR');
    document.getElementById('camp-active').textContent = s.activeToday || 0;
    document.getElementById('camp-review').textContent = s.review || 0;
    const leader = list.find(p => p.campaignXp > 0), leaderBox = document.getElementById('camp-leader');
    leaderBox.classList.toggle('hidden', !leader);
    if (leader) leaderBox.innerHTML = `<div class="flex items-center gap-4"><div class="text-4xl">👑</div><div class="flex-1 min-w-0"><p class="race-label">${c.status === 'ended' ? 'Maior aumento acompanhado' : 'Na frente agora'}</p><p class="text-xl font-black truncate">${escapeHtml(leader.name)}</p><p class="text-xs text-white/45 mt-1">${leader.activeDays} dias com aumento · sequência atual ${leader.currentStreak} · melhor sequência ${leader.maxStreak}</p></div><p class="text-2xl md:text-4xl font-black mono text-[#FF9F1C] whitespace-nowrap">${leader.campaignXp.toLocaleString('pt-BR')} XP</p></div>`;
    const medals = ['🥇','🥈','🥉'];
    document.getElementById('camp-rows').innerHTML = list.map(p => {
      const status = !p.tracking ? [c.status === 'ended' ? 'Sem sincronização no período' : 'Aguardando sincronização','text-white/35'] : p.flags.length ? ['Revisar: ' + p.flags.map(flagLabel).join(', '),'text-[#FF3E81]'] : ['Acompanhado','text-[#2EC4B6]'];
      return `<tr class="border-b border-white/5 hover:bg-white/[.025]"><td class="p-3 mono text-white/60">${p.rank == null ? '—' : medals[p.rank - 1] || '#' + p.rank}</td><td class="p-3"><p>${escapeHtml(p.name)}</p><p class="text-[10px] text-white/30 font-normal">${escapeHtml(p.email)}</p><p class="text-[10px] text-white/60">Desde ${escapeHtml(p.firstSeenAt ? new Date(p.firstSeenAt).toLocaleDateString('pt-BR', {timeZone:'America/Sao_Paulo'}) : 'a primeira sincronização')}</p></td><td class="p-3 text-right mono text-[#FF9F1C]">${p.campaignXp.toLocaleString('pt-BR')}</td><td class="p-3 text-right mono">${p.activeDays}</td><td class="p-3 text-right mono">🔥 ${p.currentStreak}</td><td class="p-3 text-right mono">🔥 ${p.maxStreak}</td><td class="p-3 text-xs ${status[1]}">${escapeHtml(status[0])}</td></tr>`;
    }).join('');
    if (!list.length) document.getElementById('camp-rows').innerHTML = '<tr><td colspan="7" class="p-3">Nenhum aluno para acompanhar ainda.</td></tr>';
    const start = Date.parse(c.startDate + 'T00:00:00-03:00');
    const end = Date.parse(c.endDate + 'T23:59:59-03:00');
    document.getElementById('camp-runner').style.left = Math.max(2, Math.min(98, 100 * (Date.parse(data.generatedAt) - start) / (end - start))) + '%';
  } catch (e) {
    document.getElementById('camp-period').textContent = 'Não foi possível atualizar. Clique em Atualizar agora para tentar novamente.';
    document.getElementById('camp-leader').classList.add('hidden');
    document.getElementById('camp-rows').replaceChildren();
    ['camp-tracked','camp-xp','camp-active','camp-review'].forEach(id => document.getElementById(id).textContent = '—');
    if (e.message !== 'unauthorized') toast('Erro ao carregar a corrida.', 'error');
  }
}
function formatDate(iso) { if (!iso) return '—'; const [y,m,d] = iso.split('-'); return `${d}/${m}/${y}`; }
function flagLabel(flag) { return ({large_jump:'salto grande',daily_limit:'limite diário',xp_regression:'XP diminuiu'})[flag] || flag; }
document.getElementById('camp-reload').addEventListener('click', loadCampaign);
document.getElementById('camp-export').addEventListener('click', () => {
  if (!campaignData) return;
  const list = campaignData?.participants || [];
  downloadCsv('corrida-xp.csv', ['Posição','Nome','E-mail','Aumento de XP sincronizado','Dias com aumento','Sequência atual no período','Melhor sequência no período','Início do acompanhamento','Última sincronização','Revisão'], list.map(p => [p.rank ?? '',p.name,p.email,p.campaignXp,p.activeDays,p.currentStreak,p.maxStreak,p.firstSeenAt || '',p.lastSeenAt || '',p.flags.map(flagLabel).join('; ')]));
});

// ── Alunos: quem está ativo, quem sumiu ─────────────────────────────────────
// Ordered by who needs attention first (never started → longest idle → active).
async function loadStudents() {
  try {
    const data = await api('/api/admin/students');
    const s = data.summary || {};
    document.getElementById('al-kpi-hoje').textContent = s.activeToday ?? 0;
    document.getElementById('al-kpi-idle').textContent = s.idle ?? 0;
    document.getElementById('al-kpi-novos').textContent = s.neverStarted ?? 0;
    document.getElementById('al-kpi-push').textContent = s.withPush ?? 0;

    const rows = document.getElementById('alunos-rows');
    const vazio = document.getElementById('alunos-vazio');
    const list = data.students || [];
    vazio.classList.toggle('hidden', list.length > 0);

    const BADGE = {
      never_started: ['Nunca começou', 'bg-[#FF3E81]/20 text-[#FF3E81]'],
      idle:          ['Sumido',        'bg-[#FF9F1C]/20 text-[#FF9F1C]'],
      active_today:  ['Praticou hoje', 'bg-[#2EC4B6]/20 text-[#2EC4B6]'],
    };

    rows.innerHTML = list.map(a => {
      const [label, cls] = BADGE[a.status] || ['—', 'bg-white/10 text-white/50'];
      const ausencia = a.status === 'never_started'
        ? '—'
        : (a.daysSincePractice === 0 ? 'hoje' : (a.daysSincePractice ?? '?') + 'd');
      return `
        <tr class="border-b border-white/5">
          <td class="p-3">
            <p class="text-white">${escapeHtml(a.name)}</p>
            <p class="text-[10px] text-white/30 font-normal">${escapeHtml(a.email)}</p>
          </td>
          <td class="p-3"><span class="text-[10px] font-black px-2 py-1 rounded-full ${cls}">${label}</span></td>
          <td class="p-3 text-right mono">${ausencia}</td>
          <td class="p-3 text-right mono">${a.xp}</td>
          <td class="p-3 text-right mono">${a.streakDays > 0 ? '🔥' + a.streakDays : '—'}</td>
          <td class="p-3 text-center">${a.hasPush ? '🔔' : '<span class="text-white/20">—</span>'}</td>
          <td class="p-3 text-right">
            <button data-link-email="${escapeHtml(a.email)}" class="text-[10px] font-black text-[#2EC4B6] hover:text-white transition-colors whitespace-nowrap">link de acesso</button>
          </td>
        </tr>`;
    }).join('');

    // Enquanto o e-mail do site não sai (Resend com domínio não verificado),
    // este botão é o ÚNICO jeito de um aluno que não consegue entrar voltar a
    // entrar. O professor gera e manda por WhatsApp.
    rows.querySelectorAll('[data-link-email]').forEach(btn => {
      btn.addEventListener('click', () => gerarLinkDeAcesso(btn));
    });
  } catch (e) { if (e.message !== 'unauthorized') toast('Erro ao carregar alunos.', 'error'); }
}

async function gerarLinkDeAcesso(btn) {
  const email = btn.dataset.linkEmail;
  const original = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'gerando…';
  try {
    const r = await api('/api/admin/login-link', { method: 'POST', body: JSON.stringify({ email }) });
    if (!r.ok) { toast(r.error === 'conta_nao_encontrada' ? 'Sem conta para esse e-mail.' : `Erro: ${r.error}`, 'error'); return; }
    try {
      await navigator.clipboard.writeText(linkDeEntrada(r.loginUrl));
      toast(`Link de ${r.name} copiado — uso único, mande agora.`);
    } catch (e) {
      // clipboard exige contexto seguro; sem ele, mostrar para copiar à mão.
      prompt('Copie o link de acesso (uso único, mande agora):', linkDeEntrada(r.loginUrl));
    }
  } catch (e) {
    if (e.message !== 'unauthorized') toast('Erro de rede.', 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = original;
  }
}

async function loadOverview() {
  try {
    overviewData = await api('/api/admin/overview');
    document.getElementById('kpi-total').textContent = overviewData.totalStudents ?? '—';
    document.getElementById('kpi-new7').textContent = overviewData.new7d ?? '—';
    document.getElementById('kpi-new30').textContent = overviewData.new30d ?? '—';
    document.getElementById('kpi-pro').textContent = overviewData.plans?.pro ?? 0;
    document.getElementById('kpi-super').textContent = overviewData.plans?.super ?? 0;
    document.getElementById('kpi-courtesy').textContent = overviewData.courtesies ?? 0;
    document.getElementById('kpi-ai').textContent = overviewData.aiToday != null ? overviewData.aiToday : 'sem dados';
    renderDashboardGoals();
    renderSignupsChart(overviewData.signupsByDay || []);
  } catch (e) { if (e.message !== 'unauthorized') toast('Erro ao carregar overview.', 'error'); }
}

// ── Gráfico de cadastros (30 dias, sem lib externa) ─────────────────────────
function renderSignupsChart(days) {
  const chart = document.getElementById('signups-chart');
  const labels = document.getElementById('signups-labels');
  if (!days.length) { chart.innerHTML = '<p class="text-xs text-white/30 italic self-center">Sem dados ainda.</p>'; labels.innerHTML = ''; return; }
  const max = Math.max(1, ...days.map(d => d.count));
  chart.innerHTML = days.map(d => {
    const h = Math.max(2, Math.round((d.count / max) * 100));
    return `<div class="flex-1 bg-gradient-to-t from-[#FF9F1C] to-[#FF3E81] rounded-t" style="height:${h}%" title="${escapeHtml(d.date)}: ${Number(d.count) || 0} cadastro(s)"></div>`;
  }).join('');
  labels.innerHTML = days.map((d, i) => (i % 5 === 0 || i === days.length - 1)
    ? `<span>${escapeHtml(String(d.date || '').slice(5))}</span>` : '').join('');
}

function renderDashboardGoals() {
  if (!overviewData) return;
  const now = new Date();
  const monthKey = now.toISOString().slice(0, 7);
  const manualThisMonth = (goalsData.manualRevenue || []).filter(r => r.month === monthKey).reduce((s, r) => s + (Number(r.amount) || 0), 0);
  const estimated = (overviewData.plans?.pro || 0) * PRECO_PRO + (overviewData.plans?.super || 0) * PRECO_SUPER + manualThisMonth;
  const target = Number(goalsData.monthlyRevenueTarget) || 0;
  document.getElementById('rev-current').textContent = 'R$ ' + estimated.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  document.getElementById('rev-target').textContent = 'meta: R$ ' + target.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  document.getElementById('rev-bar').style.width = Math.min(100, target ? (estimated / target) * 100 : 0) + '%';

  const stuTarget = Number(goalsData.studentsTarget) || 0;
  document.getElementById('stu-current').textContent = overviewData.totalStudents ?? 0;
  document.getElementById('stu-target').textContent = 'meta: ' + stuTarget;
  document.getElementById('stu-bar').style.width = Math.min(100, stuTarget ? (overviewData.totalStudents / stuTarget) * 100 : 0) + '%';
}

// ── Cortesias ────────────────────────────────────────────────────────────
async function loadCourtesies() {
  try {
    const data = await api('/api/admin/courtesies');
    const rows = data.courtesies || [];
    const tbody = document.getElementById('courtesy-rows');
    tbody.innerHTML = rows.length ? rows.map(c => `
      <tr class="border-t border-white/5">
        <td class="px-4 py-2.5">${escapeHtml(c.name) || '—'}</td>
        <td class="px-4 py-2.5 mono text-xs text-white/60">${escapeHtml(c.email) || '—'}</td>
        <td class="px-4 py-2.5">
          <select class="plan-select px-2 py-1 rounded text-[10px] font-black bg-white/5 border border-white/10 outline-none cursor-pointer ${c.plan === 'super' ? 'text-[#FF3E81]' : 'text-[#FF9F1C]'}"
                  data-email="${escapeHtml(c.email)}" data-plan="${escapeHtml(c.plan)}" data-exp="${escapeHtml(c.expiresAt || '')}" title="Trocar o plano desta cortesia">
            <option value="pro" ${c.plan === 'pro' ? 'selected' : ''}>pro</option>
            <option value="super" ${c.plan === 'super' ? 'selected' : ''}>super</option>
          </select>
        </td>
        <td class="px-4 py-2.5 mono text-xs text-white/40">${c.expiresAt ? new Date(c.expiresAt).toLocaleDateString('pt-BR') : '—'}</td>
        <td class="px-4 py-2.5 text-right"><button class="revoke-btn text-red-400 text-xs font-black" data-email="${escapeHtml(c.email)}">Revogar</button></td>
      </tr>
    `).join('') : '<tr><td colspan="5" class="text-center py-8 text-white/30 italic">Nenhuma cortesia ativa.</td></tr>';
    document.querySelectorAll('.revoke-btn').forEach(b => b.addEventListener('click', () => revokePlan(b.dataset.email)));
    document.querySelectorAll('.plan-select').forEach(s => s.addEventListener('change', () => trocarPlano(s)));
  } catch (e) { if (e.message !== 'unauthorized') toast('Erro ao carregar cortesias.', 'error'); }
}

// ── Export CSV (client-side, UTF-8 BOM p/ Excel) ────────────────────────────
function downloadCsv(filename, headers, rows) {
  const esc = v => {
    let value = String(v ?? '');
    if (/^[\s\uFEFF]*[=+@-]/.test(value)) value = "'" + value;
    return `"${value.replace(/"/g, '""')}"`;
  };
  const lines = [headers.map(esc).join(';'), ...rows.map(r => r.map(esc).join(';'))];
  const csv = '﻿' + lines.join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

document.getElementById('courtesy-csv-btn').addEventListener('click', async () => {
  try {
    const data = await api('/api/admin/courtesies');
    const rows = (data.courtesies || []).map(c => [c.name || '', c.email || '', c.plan || '', c.expiresAt ? new Date(c.expiresAt).toLocaleDateString('pt-BR') : '']);
    downloadCsv('cortesias.csv', ['Nome', 'E-mail', 'Plano', 'Expira'], rows);
  } catch (e) { toast('Erro ao exportar CSV.', 'error'); }
});

document.getElementById('lead-csv-btn').addEventListener('click', () => {
  const rows = leadsData.map(l => [l.name || '', l.contact || '', l.source || '', l.status || '', l.nextAction || '', l.nextActionDate || '', l.notes || '']);
  downloadCsv('leads.csv', ['Nome', 'Contato', 'Origem', 'Status', 'Próxima ação', 'Data', 'Notas'], rows);
});

document.getElementById('grant-btn').addEventListener('click', async () => {
  const email = document.getElementById('grant-email').value.trim();
  const plan = document.getElementById('grant-plan').value;
  if (!email) { toast('Digite um e-mail.', 'error'); return; }
  try {
    const r = await api('/api/admin/grant-plan', { method: 'POST', body: JSON.stringify({ email, plan }) });
    if (r.ok) {
      toast(r.accountCreated ? 'Cortesia concedida — conta criada!' : 'Cortesia concedida!');
      document.getElementById('grant-email').value = '';
      mostrarLinkDeAcesso(email, r);
      loadCourtesies(); loadOverview();
    } else {
      // Mostrar o erro REAL do servidor. O genérico escondia coisas como
      // "invalid_email" e o 502 de banco, e não dava pra saber o que corrigir.
      toast(r.error ? `Erro: ${r.error}` : 'Erro ao conceder.', 'error');
    }
  } catch (e) { if (e.message !== 'unauthorized') toast('Erro de rede.', 'error'); }
});

// O `loginUrl` do endpoint aponta direto para /api/auth/callback, e esse
// endereço é de USO ÚNICO: a primeira requisição queima o token. WhatsApp,
// Telegram e Outlook ABREM a URL sozinhos para montar a pré-visualização do
// link, então o aluno recebe `otp_expired` num link que nunca usou — foi o
// que aconteceu com o Luan em 19/set/2026.
//
// /entrar.html é inofensivo de abrir: carrega só um botão, e apenas o CLIQUE
// navega para o callback. Robô de preview não clica.
function linkDeEntrada(loginUrl) {
  const hash = (String(loginUrl || '').match(/token_hash=([a-f0-9]+)/i) || [])[1];
  return hash ? `${location.origin}/entrar.html?t=${hash}` : loginUrl;
}

// Enquanto o domínio não estiver verificado no DNS, este link é o ÚNICO jeito
// de a pessoa entrar.
function mostrarLinkDeAcesso(email, r) {
  const caixa = document.getElementById('grant-result');
  if (!caixa || !r.loginUrl) return;
  document.getElementById('grant-result-title').textContent =
    `${email} — ${r.profile?.plan || 'super'}${r.accountCreated ? ' (conta nova)' : ''}`;
  document.getElementById('grant-link').value = linkDeEntrada(r.loginUrl);
  caixa.classList.remove('hidden');
}

document.getElementById('grant-copy').addEventListener('click', async () => {
  const campo = document.getElementById('grant-link');
  try {
    await navigator.clipboard.writeText(campo.value);
    toast('Link copiado!');
  } catch (e) {
    // clipboard exige contexto seguro e permissão; o select deixa copiar à mão.
    campo.select();
    toast('Selecionado — use Ctrl+C.', 'error');
  }
});

// ── Trocar o plano de uma cortesia já existente ─────────────────────────────
// Usa o mesmo /api/admin/grant-plan da concessão. Reenviamos o expiresAt atual
// de propósito: sem ele o backend joga a validade pra 2099 e a data que estava
// na tela mudaria sozinha.
async function trocarPlano(select) {
  const email = select.dataset.email;
  const anterior = select.dataset.plan;
  const novo = select.value;
  if (novo === anterior) return;

  if (!confirm(`Mudar ${email} de ${anterior} para ${novo}?`)) {
    select.value = anterior;
    return;
  }
  select.disabled = true;
  try {
    const body = { email, plan: novo };
    if (select.dataset.exp) body.expiresAt = select.dataset.exp;
    const r = await api('/api/admin/grant-plan', { method: 'POST', body: JSON.stringify(body) });
    if (r.ok) { toast(`${email} agora é ${novo}.`); loadCourtesies(); loadOverview(); }
    else { toast(r.error || 'Erro ao trocar o plano.', 'error'); select.value = anterior; select.disabled = false; }
  } catch (e) {
    if (e.message !== 'unauthorized') toast('Erro de rede.', 'error');
    select.value = anterior;
    select.disabled = false;
  }
}

// Sobe todo mundo que ainda está no pro. Mostra quantos serão afetados antes.
async function todosParaSuper() {
  const pros = [...document.querySelectorAll('.plan-select')].filter(s => s.dataset.plan !== 'super');
  if (!pros.length) { toast('Todas as cortesias já são super.'); return; }
  if (!confirm(`Passar ${pros.length} cortesia(s) de pro para super?`)) return;

  const btn = document.getElementById('all-super-btn');
  btn.disabled = true;
  const textoOriginal = btn.innerHTML;
  let ok = 0, falhou = 0;
  for (const s of pros) {
    btn.innerHTML = `⏳ ${ok + falhou + 1}/${pros.length}`;
    try {
      const body = { email: s.dataset.email, plan: 'super' };
      if (s.dataset.exp) body.expiresAt = s.dataset.exp;
      const r = await api('/api/admin/grant-plan', { method: 'POST', body: JSON.stringify(body) });
      if (r.ok) ok++; else falhou++;
    } catch (e) { falhou++; }
  }
  btn.innerHTML = textoOriginal;
  btn.disabled = false;
  toast(falhou ? `${ok} atualizadas, ${falhou} falharam.` : `${ok} cortesias agora são super.`, falhou ? 'error' : 'ok');
  loadCourtesies();
  loadOverview();
}

async function revokePlan(email) {
  if (!confirm('Revogar cortesia de ' + email + '?')) return;
  try {
    const r = await api('/api/admin/revoke-plan', { method: 'POST', body: JSON.stringify({ email }) });
    if (r.ok) { toast('Cortesia revogada.'); loadCourtesies(); loadOverview(); }
    else toast(r.error || 'Erro ao revogar.', 'error');
  } catch (e) { if (e.message !== 'unauthorized') toast('Erro de rede.', 'error'); }
}

// ── Metas ────────────────────────────────────────────────────────────────
async function loadGoals() {
  try {
    goalsData = await api('/api/admin/goals');
    document.getElementById('goal-revenue').value = goalsData.monthlyRevenueTarget || 0;
    document.getElementById('goal-students').value = goalsData.studentsTarget || 0;
    renderManualRevenue();
    renderDashboardGoals();
  } catch (e) { if (e.message !== 'unauthorized') toast('Erro ao carregar metas.', 'error'); }
}

function renderManualRevenue() {
  const list = document.getElementById('manual-rev-list');
  const items = goalsData.manualRevenue || [];
  list.innerHTML = items.length ? items.map((r, i) => `
    <div class="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2">
      <span class="mono text-xs text-white/60">${escapeHtml(r.month)}</span>
      <span class="font-black text-sm mono text-[#2EC4B6]">R$ ${Number(r.amount || 0).toLocaleString('pt-BR')}</span>
      <span class="text-xs text-white/40 flex-1 px-2 truncate">${escapeHtml(r.note || '')}</span>
      <button class="rev-del-btn text-red-400 text-xs font-black" data-idx="${i}">remover</button>
    </div>
  `).join('') : '<p class="text-xs text-white/30 italic">Nenhum lançamento manual.</p>';
  document.querySelectorAll('.rev-del-btn').forEach(b => b.addEventListener('click', () => {
    goalsData.manualRevenue.splice(Number(b.dataset.idx), 1);
    renderManualRevenue(); renderDashboardGoals();
  }));
}

document.getElementById('rev-add-btn').addEventListener('click', () => {
  const month = document.getElementById('rev-month').value;
  const amount = Number(document.getElementById('rev-amount').value);
  const note = document.getElementById('rev-note').value.trim();
  if (!month || !amount) { toast('Preencha mês e valor.', 'error'); return; }
  goalsData.manualRevenue = goalsData.manualRevenue || [];
  goalsData.manualRevenue.push({ month, amount, note });
  document.getElementById('rev-amount').value = '';
  document.getElementById('rev-note').value = '';
  renderManualRevenue(); renderDashboardGoals();
});

document.getElementById('goals-save-btn').addEventListener('click', async () => {
  goalsData.monthlyRevenueTarget = Number(document.getElementById('goal-revenue').value) || 0;
  goalsData.studentsTarget = Number(document.getElementById('goal-students').value) || 0;
  try {
    const r = await api('/api/admin/goals', { method: 'POST', body: JSON.stringify(goalsData) });
    if (r.ok) { toast('Metas salvas!'); goalsData = r.data; renderDashboardGoals(); }
    else toast('Erro ao salvar.', 'error');
  } catch (e) { if (e.message !== 'unauthorized') toast('Erro de rede.', 'error'); }
});

// ── CRM ──────────────────────────────────────────────────────────────────
async function loadLeads() {
  try {
    const data = await api('/api/admin/leads');
    leadsData = data.leads || [];
    renderLeads();
  } catch (e) { if (e.message !== 'unauthorized') toast('Erro ao carregar leads.', 'error'); }
}

function renderLeads() {
  const tbody = document.getElementById('lead-rows');
  let rows = leadsData.slice();
  if (crmFilter !== 'todos') rows = rows.filter(l => l.status === crmFilter);
  rows.sort((a, b) => (a.nextActionDate || '9999') < (b.nextActionDate || '9999') ? -1 : 1);
  const statusColor = { lead: 'bg-slate-400/20 text-slate-300', conversando: 'bg-[#FF9F1C]/20 text-[#FF9F1C]', aluno: 'bg-[#2EC4B6]/20 text-[#2EC4B6]', pausado: 'bg-red-400/20 text-red-300' };
  tbody.innerHTML = rows.length ? rows.map(l => `
    <tr class="border-t border-white/5">
      <td class="px-4 py-2.5">${escapeHtml(l.name) || '—'}</td>
      <td class="px-4 py-2.5 text-xs text-white/60">${escapeHtml(l.contact) || '—'}</td>
      <td class="px-4 py-2.5 text-xs text-white/40">${escapeHtml(l.source) || '—'}</td>
      <td class="px-4 py-2.5"><span class="px-2 py-0.5 rounded text-[10px] ${statusColor[l.status] || ''}">${escapeHtml(l.status) || '—'}</span></td>
      <td class="px-4 py-2.5 text-xs">${escapeHtml(l.nextAction || '')} ${l.nextActionDate ? '<span class="text-white/40 mono">(' + escapeHtml(l.nextActionDate) + ')</span>' : ''}</td>
      <td class="px-4 py-2.5 text-right whitespace-nowrap">
        <button class="lead-edit-btn text-[#2EC4B6] text-xs font-black mr-2" data-id="${escapeHtml(l.id)}">editar</button>
        <button class="lead-del-btn text-red-400 text-xs font-black" data-id="${escapeHtml(l.id)}">excluir</button>
      </td>
    </tr>
  `).join('') : '<tr><td colspan="6" class="text-center py-8 text-white/30 italic">Nenhum lead nesta categoria.</td></tr>';
  document.querySelectorAll('.lead-edit-btn').forEach(b => b.addEventListener('click', () => openLeadModal(b.dataset.id)));
  document.querySelectorAll('.lead-del-btn').forEach(b => b.addEventListener('click', () => deleteLead(b.dataset.id)));
}

document.querySelectorAll('.crm-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.crm-chip').forEach(c => { c.classList.remove('active'); c.classList.add('bg-white/5'); c.classList.remove('bg-white/10'); });
    chip.classList.add('active'); chip.classList.remove('bg-white/5'); chip.classList.add('bg-white/10');
    crmFilter = chip.dataset.status;
    renderLeads();
  });
});

let editingLeadId = null;
function openLeadModal(id) {
  editingLeadId = id || null;
  const lead = id ? leadsData.find(l => l.id === id) : null;
  document.getElementById('lead-modal-title').textContent = lead ? 'Editar lead' : 'Novo lead';
  document.getElementById('lead-name').value = lead?.name || '';
  document.getElementById('lead-contact').value = lead?.contact || '';
  document.getElementById('lead-source').value = lead?.source || '';
  document.getElementById('lead-status').value = lead?.status || 'lead';
  document.getElementById('lead-notes').value = lead?.notes || '';
  document.getElementById('lead-next-action').value = lead?.nextAction || '';
  document.getElementById('lead-next-date').value = lead?.nextActionDate || '';
  document.getElementById('lead-modal').classList.remove('hidden');
}
document.getElementById('lead-new-btn').addEventListener('click', () => openLeadModal(null));
document.getElementById('lead-cancel-btn').addEventListener('click', () => document.getElementById('lead-modal').classList.add('hidden'));

document.getElementById('lead-save-btn').addEventListener('click', async () => {
  const payload = {
    id: editingLeadId || undefined,
    name: document.getElementById('lead-name').value.trim(),
    contact: document.getElementById('lead-contact').value.trim(),
    source: document.getElementById('lead-source').value.trim(),
    status: document.getElementById('lead-status').value,
    notes: document.getElementById('lead-notes').value.trim(),
    nextAction: document.getElementById('lead-next-action').value.trim(),
    nextActionDate: document.getElementById('lead-next-date').value,
  };
  if (!payload.name) { toast('Digite um nome.', 'error'); return; }
  try {
    const r = await api('/api/admin/leads', { method: 'POST', body: JSON.stringify(payload) });
    if (r.ok) {
      toast('Lead salvo!');
      leadsData = r.leads;
      document.getElementById('lead-modal').classList.add('hidden');
      renderLeads();
    } else toast('Erro ao salvar lead.', 'error');
  } catch (e) { if (e.message !== 'unauthorized') toast('Erro de rede.', 'error'); }
});

async function deleteLead(id) {
  if (!confirm('Excluir este lead?')) return;
  try {
    const r = await api('/api/admin/leads?id=' + encodeURIComponent(id), { method: 'DELETE' });
    if (r.ok) { toast('Lead excluído.'); leadsData = r.leads; renderLeads(); }
    else toast('Erro ao excluir.', 'error');
  } catch (e) { if (e.message !== 'unauthorized') toast('Erro de rede.', 'error'); }
}

// ── GPS Tronic ───────────────────────────────────────────────────────────
function estimateLevel(byBand) {
  const order = ['A1', 'A2', 'B1', 'B2', 'leitura'];
  let level = '—';
  for (const band of order) {
    const pct = byBand?.[band];
    if (typeof pct === 'number' && pct >= 60) level = band;
    else break;
  }
  return level;
}

async function loadGps() {
  try {
    const data = await api('/api/admin/gpstronic-results');
    const results = data.results || [];
    const wrap = document.getElementById('gps-cards');
    document.getElementById('gps-empty').classList.toggle('hidden', results.length > 0);
    wrap.innerHTML = results.map(r => {
      const bands = ['A1', 'A2', 'B1', 'B2', 'leitura'];
      const level = estimateLevel(r.byBand);
      return `
        <div class="card rounded-2xl p-5 fade-up">
          <div class="flex items-center justify-between mb-3">
            <p class="font-black text-sm">${escapeHtml(r.name)}</p>
            <span class="px-2 py-1 rounded-full text-[10px] font-black bg-[#2EC4B6]/20 text-[#2EC4B6]">Nível: ${level}</span>
          </div>
          <p class="text-[10px] text-white/40 mb-3">${r.completedAt ? new Date(r.completedAt).toLocaleString('pt-BR') : ''} · Score geral: ${r.score ?? '—'}</p>
          <div class="space-y-2">
            ${bands.map(b => {
              const pct = Math.max(0, Math.min(100, Number(r.byBand?.[b]) || 0));
              return `<div>
                <div class="flex justify-between text-[10px] text-white/50 mb-0.5"><span>${b}</span><span class="mono">${pct}%</span></div>
                <div class="w-full h-2 rounded-full bg-white/10 overflow-hidden"><div class="h-full bg-gradient-to-r from-[#FF9F1C] to-[#FF3E81]" style="width:${pct}%"></div></div>
              </div>`;
            }).join('')}
          </div>
        </div>
      `;
    }).join('');
  } catch (e) { if (e.message !== 'unauthorized') toast('Erro ao carregar GPS Tronic.', 'error'); }
}

// ── Funil de conversão ───────────────────────────────────────────────────
async function loadFunnel() {
  try {
    const days = document.getElementById('funil-days').value || 14;
    const data = await api('/api/admin/funnel?days=' + encodeURIComponent(days));

    const totals = data.totals || {};
    const start = totals.mini_start || 0;
    const complete = totals.mini_complete || 0;
    const quiz = totals.quiz_finish || 0;
    const hasData = start > 0 || complete > 0 || quiz > 0;

    document.getElementById('funil-kpi-start').textContent = start.toLocaleString('pt-BR');
    document.getElementById('funil-kpi-complete').textContent = complete.toLocaleString('pt-BR');
    document.getElementById('funil-kpi-drop').textContent = hasData ? Math.round((Number(data.dropRate) || 0) * 100) + '%' : '—';

    renderFunnelBars({ mini_start: start, mini_complete: complete, quiz_finish: quiz }, hasData);
    renderFunnelTop('funil-top-started', data.topLessonsStarted || []);
    renderFunnelTop('funil-top-completed', data.topLessonsCompleted || []);
    renderFunnelChart(data.days || []);
  } catch (e) { if (e.message !== 'unauthorized') toast('Erro ao carregar funil.', 'error'); }
}

function renderFunnelBars(steps, hasData) {
  const wrap = document.getElementById('funil-bars');
  const empty = document.getElementById('funil-empty');
  empty.classList.toggle('hidden', hasData);
  if (!hasData) { wrap.innerHTML = ''; return; }
  const stepDefs = [
    { key: 'mini_start', label: 'Iniciaram a mini', color: 'from-[#FF9F1C] to-[#FF3E81]' },
    { key: 'mini_complete', label: 'Completaram a mini', color: 'from-[#FF3E81] to-[#2EC4B6]' },
    { key: 'quiz_finish', label: 'Terminaram o quiz', color: 'from-[#2EC4B6] to-[#3b82f6]' },
  ];
  const max = Math.max(1, steps.mini_start, steps.mini_complete, steps.quiz_finish);
  wrap.innerHTML = stepDefs.map(s => {
    const v = steps[s.key] || 0;
    const pct = Math.max(v > 0 ? 3 : 0, Math.round((v / max) * 100));
    return `
      <div>
        <div class="flex justify-between text-xs font-bold text-white/60 mb-1"><span>${s.label}</span><span class="mono">${v.toLocaleString('pt-BR')}</span></div>
        <div class="w-full h-4 rounded-full bg-white/10 overflow-hidden">
          <div class="h-full rounded-full bg-gradient-to-r ${s.color}" style="width:${pct}%"></div>
        </div>
      </div>`;
  }).join('');
}

function renderFunnelTop(elId, items) {
  const wrap = document.getElementById(elId);
  if (!items.length) { wrap.innerHTML = '<p class="text-xs text-white/30 italic">Ainda sem dados — os eventos começam a aparecer conforme os alunos usam a trilha.</p>'; return; }
  const max = Math.max(1, ...items.map(i => i.count || 0));
  wrap.innerHTML = items.map(i => {
    const pct = Math.max(3, Math.round(((i.count || 0) / max) * 100));
    return `
      <div>
        <div class="flex justify-between text-xs font-bold text-white/60 mb-0.5"><span>Lição ${escapeHtml(i.lessonId)}</span><span class="mono">${(i.count || 0).toLocaleString('pt-BR')}</span></div>
        <div class="w-full h-2 rounded-full bg-white/10 overflow-hidden"><div class="h-full bg-gradient-to-r from-[#FF9F1C] to-[#FF3E81]" style="width:${pct}%"></div></div>
      </div>`;
  }).join('');
}

function renderFunnelChart(days) {
  const chart = document.getElementById('funil-chart');
  const labels = document.getElementById('funil-chart-labels');
  const points = days.map(d => ({ date: d.date, count: (d.counts && d.counts.mini_start) || 0 }));
  if (!points.length || !points.some(p => p.count > 0)) {
    chart.innerHTML = '<p class="text-xs text-white/30 italic self-center">Ainda sem dados — os eventos começam a aparecer conforme os alunos usam a trilha.</p>';
    labels.innerHTML = '';
    return;
  }
  const max = Math.max(1, ...points.map(p => p.count));
  chart.innerHTML = points.map(p => {
    const h = Math.max(2, Math.round((p.count / max) * 100));
    return `<div class="flex-1 bg-gradient-to-t from-[#FF9F1C] to-[#FF3E81] rounded-t" style="height:${h}%" title="${escapeHtml(p.date)}: ${p.count} início(s)"></div>`;
  }).join('');
  labels.innerHTML = points.map((p, i) => (i % 5 === 0 || i === points.length - 1)
    ? `<span>${escapeHtml(String(p.date || '').slice(5))}</span>` : '').join('');
}

document.getElementById('funil-days').addEventListener('change', loadFunnel);

// ── Avisos (broadcast push) ─────────────────────────────────────────────────
const bcTitle = document.getElementById('bc-title');
const bcBody = document.getElementById('bc-body');
const bcUrl = document.getElementById('bc-url');

function updateBcPreview() {
  document.getElementById('bc-title-count').textContent = `(${bcTitle.value.length}/60)`;
  document.getElementById('bc-body-count').textContent = `(${bcBody.value.length}/160)`;
  document.getElementById('bc-preview-title').textContent = bcTitle.value.trim() || 'Título do aviso';
  document.getElementById('bc-preview-body').textContent = bcBody.value.trim() || 'Mensagem curta e motivadora...';
}
bcTitle.addEventListener('input', updateBcPreview);
bcBody.addEventListener('input', updateBcPreview);

document.getElementById('bc-send-btn').addEventListener('click', async () => {
  const title = bcTitle.value.trim();
  const body = bcBody.value.trim();
  const url = bcUrl.value.trim();
  if (!title || !body) { toast('Preencha título e mensagem.', 'error'); return; }
  const subs = overviewData?.totalStudents ?? '?';
  if (!confirm(`Enviar este aviso push para os inscritos? (até ${subs} alunos cadastrados, apenas quem tem push ativo recebe)`)) return;
  const resultEl = document.getElementById('bc-result');
  try {
    const r = await api('/api/admin/broadcast', { method: 'POST', body: JSON.stringify({ title, body, url: url || undefined }) });
    resultEl.classList.remove('hidden');
    if (r.error === 'push_not_configured') {
      resultEl.textContent = 'Push não configurado no servidor (faltam chaves VAPID).';
      resultEl.className = 'card rounded-2xl p-4 text-sm font-bold fade-up text-red-400';
    } else {
      resultEl.textContent = `Enviado: ${r.sent ?? 0} · Falhas: ${r.failed ?? 0}`;
      resultEl.className = 'card rounded-2xl p-4 text-sm font-bold fade-up text-emerald-400';
      toast('Aviso enviado!');
    }
  } catch (e) { if (e.message !== 'unauthorized') toast('Erro de rede.', 'error'); }
});

// ── Boot ─────────────────────────────────────────────────────────────────
Auth.ready().then(entrarNoPainel);

document.getElementById('alunos-reload').addEventListener('click', loadStudents);

document.getElementById('all-super-btn').addEventListener('click', todosParaSuper);

// ── Definir senha de um aluno ────────────────────────────────────────────
// O link mágico depende de e-mail e é de uso único — o do Luan expirou duas
// vezes antes de ele clicar. Senha resolve de vez: não expira, e o robô de
// pré-visualização do WhatsApp não tem como queimar.
//
// A senha NÃO é guardada nem ecoada aqui. Vai no corpo do POST e o campo é
// limpo em seguida, para não ficar na tela do professor.
document.getElementById('pwd-set')?.addEventListener('click', async (ev) => {
  const btn    = ev.currentTarget;
  const email  = document.getElementById('pwd-email').value.trim().toLowerCase();
  const campo  = document.getElementById('pwd-senha');
  const senha  = campo.value;
  const saida  = document.getElementById('pwd-result');

  const mostrar = (texto, ok) => {
    saida.textContent = texto;
    saida.className = 'mt-3 text-xs rounded-xl p-3 ' + (ok
      ? 'bg-[#2EC4B6]/10 border border-[#2EC4B6]/30 text-[#2EC4B6]'
      : 'bg-red-500/10 border border-red-500/30 text-red-300');
  };

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { mostrar('Informe um e-mail válido.', false); return; }
  if (senha.length < 12) { mostrar('A senha precisa ter pelo menos 12 caracteres.', false); return; }

  const rotulo = btn.textContent;
  btn.disabled = true; btn.textContent = 'definindo…';
  try {
    const r = await api('/api/admin/set-password', { method: 'POST', body: JSON.stringify({ email, password: senha }) });
    if (r.ok) {
      mostrar(`Senha definida para ${r.email}. Passe o e-mail e a senha para o aluno — ele entra na tela de login, sem depender de e-mail nenhum.`, true);
      campo.value = '';
      toast('Senha definida.');
    } else {
      mostrar(r.message || (r.error === 'conta_nao_encontrada'
        ? 'Esse e-mail não tem conta. Conceda a cortesia primeiro.'
        : `Não deu certo: ${r.error}`), false);
    }
  } catch (e) {
    if (e.message !== 'unauthorized') mostrar('Erro de rede. Tente de novo.', false);
  } finally {
    btn.disabled = false; btn.textContent = rotulo;
  }
});
