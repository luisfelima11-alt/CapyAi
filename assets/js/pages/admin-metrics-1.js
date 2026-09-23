const statusEl = document.getElementById('status');
const refreshBtn = document.getElementById('refresh-btn');
const autoRefreshCb = document.getElementById('auto-refresh');

let data = null;
let chart = null;
let sortKey = 'day';
let sortDir = -1; // desc by default

function showStatus(text, kind) {
  statusEl.textContent = text;
  statusEl.className = 'mb-5 rounded-2xl p-4 fade-up font-bold text-sm ' +
    (kind === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
     kind === 'warn'  ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                       'bg-emerald-50 text-emerald-700 border border-emerald-200');
}

async function loadStats() {
  const user = await Auth.ready();
  if (!user) { window.location.href = '4_Login_Capy_Yara_Welcomes_You.html?next=admin-metrics.html'; return; }
  if (user.role !== 'admin') { showStatus('Conta sem permissao administrativa.', 'error'); return; }
  try {
    const r = await fetch('/api/admin/stats', { credentials: 'same-origin' });
    if (r.status === 401) { showStatus('Sessao expirada.', 'error'); refreshBtn.disabled = true; return; }
    if (r.status === 403) { showStatus('Key inválida. Verifique TEACHER_KEY.', 'error'); refreshBtn.disabled = true; return; }
    if (r.status === 404) { showStatus('Endpoint /api/admin/stats não encontrado. Backend ainda não deployado.', 'warn'); refreshBtn.disabled = true; return; }
    if (!r.ok) { showStatus('Erro ' + r.status + ' ao buscar stats.', 'error'); return; }
    data = await r.json();
    if (data.warning) {
      showStatus('⚠️ ' + data.warning, 'warn');
    } else {
      statusEl.classList.add('hidden');
    }
    refreshBtn.disabled = false;
    render();
  } catch (e) {
    showStatus('Falha de rede: ' + e.message, 'error');
  }
}

function render() {
  if (!data) return;
  const today = new Date().toISOString().slice(0,10);
  const todayRows = (Array.isArray(data.metrics) ? data.metrics : []).filter(m => m.day === today);
  const todayReqs = todayRows.reduce((s,m) => s + (m.requests || 0), 0);
  const todayErrs = todayRows.reduce((s,m) => s + (m.errors || 0), 0);
  const todayMs   = todayRows.reduce((s,m) => s + (m.total_ms || 0), 0);
  const avgLat    = todayReqs ? Math.round(todayMs / todayReqs) : 0;
  const endpointsToday = new Set(todayRows.map(m => m.endpoint)).size;

  document.getElementById('stat-requests').textContent  = todayReqs.toLocaleString('pt-BR');
  const errEl = document.getElementById('stat-errors');
  errEl.textContent = todayErrs.toLocaleString('pt-BR');
  errEl.className = 'font-black text-3xl mono ' + (todayErrs > 0 ? 'text-red-500' : 'text-emerald-500');
  document.getElementById('stat-latency').textContent   = avgLat + ' ms';
  document.getElementById('stat-endpoints').textContent = String(endpointsToday);

  renderChart();
  renderTable();
  renderLive();
  document.getElementById('gen-at').textContent = data.generatedAt || '—';
}

function renderChart() {
  const metrics = data.metrics || [];
  const empty = metrics.length === 0;
  document.getElementById('chart-empty').classList.toggle('hidden', !empty);
  if (empty) {
    if (chart) { chart.destroy(); chart = null; }
    return;
  }
  // Aggregate by endpoint over the 7-day window
  const byEp = {};
  metrics.forEach(m => {
    if (!byEp[m.endpoint]) byEp[m.endpoint] = { ok: 0, err: 0 };
    byEp[m.endpoint].ok  += (m.requests || 0) - (m.errors || 0);
    byEp[m.endpoint].err += (m.errors || 0);
  });
  const endpoints = Object.keys(byEp).sort((a,b) => (byEp[b].ok + byEp[b].err) - (byEp[a].ok + byEp[a].err));
  const okData = endpoints.map(e => byEp[e].ok);
  const errData = endpoints.map(e => byEp[e].err);

  if (chart) chart.destroy();
  chart = new Chart(document.getElementById('reqs-chart'), {
    type: 'bar',
    data: {
      labels: endpoints,
      datasets: [
        { label: 'OK', data: okData, backgroundColor: '#2EC4B6', borderRadius: 4 },
        { label: 'Errors', data: errData, backgroundColor: '#ef4444', borderRadius: 4 },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } },
      plugins: { legend: { position: 'top' } },
    },
  });
}

function sortBy(k) {
  if (sortKey === k) sortDir = -sortDir; else { sortKey = k; sortDir = -1; }
  renderTable();
}

function renderTable() {
  const tbody = document.getElementById('rows');
  const rows = (Array.isArray(data.metrics) ? data.metrics : []).map(m => ({
    ...m, avg: m.requests ? Math.round(m.total_ms / m.requests) : 0
  }));
  rows.sort((a, b) => {
    const av = a[sortKey], bv = b[sortKey];
    if (typeof av === 'number') return (av - bv) * sortDir;
    return String(av).localeCompare(String(bv)) * sortDir;
  });
  if (rows.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center py-8 text-slate-400 italic">Sem dados ainda — esperando primeiras requests</td></tr>';
    return;
  }
  tbody.innerHTML = rows.map(r => `
    <tr class="border-b border-slate-100 hover:bg-slate-50">
      <td class="px-5 py-2.5 mono text-xs text-slate-500">${r.day}</td>
      <td class="px-5 py-2.5 mono text-xs"><span class="bg-slate-100 px-2 py-0.5 rounded">${r.endpoint}</span></td>
      <td class="px-5 py-2.5 text-right mono">${r.requests.toLocaleString('pt-BR')}</td>
      <td class="px-5 py-2.5 text-right mono ${r.errors > 0 ? 'text-red-500 font-black' : 'text-slate-400'}">${r.errors}</td>
      <td class="px-5 py-2.5 text-right mono text-slate-600">${r.avg}</td>
    </tr>
  `).join('');
}

function renderLive() {
  const live = Array.isArray(data.live) ? data.live : [];
  document.getElementById('live-pre').textContent = live.length
    ? JSON.stringify(live, null, 2)
    : '— nenhum contador em memória no momento (cold start ou tudo foi persistido) —';
}

document.getElementById('load-btn').addEventListener('click', loadStats);
refreshBtn.addEventListener('click', loadStats);

// Auto-refresh
let _autoTimer = null;
autoRefreshCb.addEventListener('change', e => {
  if (e.target.checked) {
    _autoTimer = setInterval(loadStats, 60000);
    showStatus('Auto-refresh ativado (a cada 60s).', 'success');
  } else {
    clearInterval(_autoTimer);
    _autoTimer = null;
    statusEl.classList.add('hidden');
  }
});

// Auto-load if key was already saved
loadStats();
