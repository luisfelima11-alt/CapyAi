let _allSubmissions = [];

async function doLogin() {
  const user = await Auth.ready();
  if (!user) { window.location.href = '4_Login_Capy_Yara_Welcomes_You.html?next=teacher_homework.html'; return; }
  if (!['teacher', 'admin'].includes(user.role)) {
    document.getElementById('login-err').textContent = 'Conta sem permissao de professor.';
    document.getElementById('login-err').classList.remove('hidden');
    return;
  }
  loadSubmissions();
}

function logout() {
  Auth.logout();
}

async function loadSubmissions() {
  const area = document.getElementById('results-area');
  area.innerHTML = `<div class="text-center py-12 text-slate-400">
    <div class="text-4xl mb-3 animate-spin inline-block">⟳</div>
    <p class="font-bold">Carregando entregas…</p>
  </div>`;

  try {
    const res = await fetch('/api/homework', { credentials: 'same-origin' });
    if (res.status === 401 || res.status === 403) {
      document.getElementById('login-err').textContent = 'Sessao sem permissao de professor.';
      document.getElementById('login-err').classList.remove('hidden');
      document.getElementById('dashboard').classList.add('hidden');
      document.getElementById('login-screen').classList.remove('hidden');
      return;
    }
    if (!res.ok) throw new Error('API error ' + res.status);
    _allSubmissions = await res.json();

    // Show dashboard
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');

    applyFilters();
  } catch(e) {
    area.innerHTML = `<div class="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center text-red-700">
      <div class="text-3xl mb-2">⚠️</div>
      <p class="font-black">Erro ao carregar: ${e.message}</p>
      <p class="text-sm mt-1">Verifique a conexão e tente novamente.</p>
    </div>`;
  }
}

function applyFilters() {
  const lessonFilter  = document.getElementById('filter-lesson').value.trim().toLowerCase();
  const studentFilter = document.getElementById('filter-student').value.trim().toLowerCase();
  const sortBy        = document.getElementById('sort-by').value;

  let data = [..._allSubmissions];

  if (lessonFilter)  data = data.filter(s => String(s.lesson_id).toLowerCase().includes(lessonFilter));
  if (studentFilter) data = data.filter(s =>
    (s.student_name || '').toLowerCase().includes(studentFilter) ||
    (s.user_id || '').toLowerCase().includes(studentFilter)
  );

  if (sortBy === 'newest')  data.sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));
  if (sortBy === 'oldest')  data.sort((a, b) => new Date(a.submitted_at) - new Date(b.submitted_at));
  if (sortBy === 'student') data.sort((a, b) => (a.student_name || '').localeCompare(b.student_name || ''));
  if (sortBy === 'lesson')  data.sort((a, b) => Number(a.lesson_id) - Number(b.lesson_id));

  renderSubmissions(data);
}

function renderSubmissions(data) {
  // Update stats
  const today = new Date().toISOString().slice(0, 10);
  const uniqueStudents = new Set(_allSubmissions.map(s => s.user_id)).size;
  const uniqueLessons  = new Set(_allSubmissions.map(s => s.lesson_id)).size;
  const todayCount     = _allSubmissions.filter(s => s.submitted_at?.startsWith(today)).length;

  document.getElementById('stat-total').textContent    = _allSubmissions.length;
  document.getElementById('stat-students').textContent = uniqueStudents;
  document.getElementById('stat-lessons').textContent  = uniqueLessons;
  document.getElementById('stat-today').textContent    = todayCount;
  document.getElementById('stats-row').classList.remove('hidden');
  document.getElementById('total-badge').textContent   = `${_allSubmissions.length} entregas`;

  const area = document.getElementById('results-area');

  if (!data.length) {
    area.innerHTML = `<div class="bg-white border-2 border-slate-200 rounded-2xl p-10 text-center text-slate-400">
      <div class="text-5xl mb-3">📭</div>
      <p class="font-black text-lg text-slate-600">Nenhuma entrega encontrada</p>
      <p class="text-sm mt-1">Tente ajustar os filtros ou aguarde o aluno enviar a tarefa.</p>
    </div>`;
    return;
  }

  area.innerHTML = data.map((s, i) => {
    const date = new Date(s.submitted_at);
    const dateStr = date.toLocaleDateString('pt-BR', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
    const answers = s.answers || {};
    const answerEntries = Object.entries(answers).filter(([k, v]) => v && String(v).trim());

    return `
    <div class="fade-in bg-white border-2 border-slate-200 rounded-2xl overflow-hidden mb-4 shadow-sm hover:border-violet-200 transition-colors"
         style="animation-delay:${i * 0.04}s">
      <!-- Card Header -->
      <div class="bg-gradient-to-r from-violet-50 to-indigo-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between flex-wrap gap-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-violet-600 text-white font-black text-sm flex items-center justify-center flex-shrink-0">
            ${(s.student_name || '?').charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 class="font-black text-navy text-base">${escHtml(s.student_name || 'Sem nome')}</h3>
            <p class="text-xs text-slate-500">ID: ${escHtml(s.user_id || '—')}</p>
          </div>
        </div>
        <div class="flex items-center gap-2 flex-wrap">
          <span class="bg-violet-100 text-violet-700 font-black text-xs px-3 py-1 rounded-full">Aula ${escHtml(s.lesson_id)}</span>
          ${s.lesson_title ? `<span class="bg-slate-100 text-slate-600 font-bold text-xs px-3 py-1 rounded-full">${escHtml(s.lesson_title)}</span>` : ''}
          <span class="bg-amber-100 text-amber-700 font-black text-xs px-3 py-1 rounded-full">+${s.xp_earned || 0} XP</span>
          <span class="bg-slate-100 text-slate-500 font-bold text-xs px-3 py-1 rounded-full">🕐 ${dateStr}</span>
        </div>
      </div>

      <!-- Answers -->
      <div class="px-6 py-4">
        ${answerEntries.length === 0
          ? `<p class="text-slate-400 text-sm italic">Nenhuma resposta escrita registrada.</p>`
          : `<div class="space-y-3">
              ${answerEntries.map(([k, v]) => `
                <div class="answer-card bg-slate-50 rounded-xl px-4 py-3">
                  <div class="text-[10px] font-black uppercase tracking-wider text-violet-400 mb-1">${escHtml(k)}</div>
                  <p class="text-sm text-navy leading-relaxed whitespace-pre-wrap">${escHtml(String(v))}</p>
                </div>
              `).join('')}
            </div>`
        }
      </div>
    </div>`;
  }).join('');
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

window.addEventListener('DOMContentLoaded', () => {
  Auth.ready().then(user => {
    if (user && ['teacher', 'admin'].includes(user.role)) loadSubmissions();
  });
});
