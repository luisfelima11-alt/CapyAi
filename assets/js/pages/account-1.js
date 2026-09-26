Components.mount('top-nav-placeholder', Components.renderTopNav('account'));
Components.mount('side-nav-placeholder', Components.renderSideNav('account'));
Components.mount('mobile-nav-placeholder', Components.renderMobileNav('account'));
Components.mount('footer-placeholder', Components.renderFooter());

// ── Load profile ─────────────────────────────────────────────────────────
(function loadProfile() {
  let session = null;
  try { session = JSON.parse(localStorage.getItem('capySession') || 'null'); } catch (e) {}
  if (!session || !session.id || session.id === 'guest') {
    document.getElementById('profile-name').textContent = 'Visitante';
    document.getElementById('profile-email').textContent = 'Você não está logado';
    document.getElementById('profile-avatar').textContent = '👤';
    return;
  }
  document.getElementById('profile-name').textContent = session.name || 'Sem nome';
  document.getElementById('profile-email').textContent = session.email || '—';
  document.getElementById('profile-avatar').textContent = session.avatar || '🐾';
})();

// ── Load plan ────────────────────────────────────────────────────────────
function renderPlan() {
  const plan = (Store.state?.planType || 'free').toLowerCase();
  const expiresAt = Store.state?.planExpiresAt;
  const isPro   = plan === 'pro';
  const isSuper = plan === 'super';
  const isPaid  = isPro || isSuper;

  const card = document.getElementById('plan-card');
  const features = document.getElementById('plan-features');
  const actions = document.getElementById('plan-actions');

  if (isSuper) {
    card.style.borderColor = '#2EC4B6';
    card.style.background = 'linear-gradient(135deg,#f0fdfa 0%,#ffffff 100%)';
    document.getElementById('plan-name').textContent = 'Super 🚀';
    document.getElementById('plan-name').className = 'font-black text-2xl text-[#2EC4B6]';
    document.getElementById('plan-badge').textContent = '🚀';
  } else if (isPro) {
    card.style.borderColor = '#FF9F1C';
    card.style.background = 'linear-gradient(135deg,#fff7ed 0%,#ffffff 100%)';
    document.getElementById('plan-name').textContent = 'Pro ⚡';
    document.getElementById('plan-name').className = 'font-black text-2xl text-[#FF9F1C]';
    document.getElementById('plan-badge').textContent = '⚡';
  } else {
    card.style.borderColor = '#e2e8f0';
    card.style.background = '#ffffff';
    document.getElementById('plan-name').textContent = 'Grátis 🌱';
    document.getElementById('plan-name').className = 'font-black text-2xl text-slate-600';
    document.getElementById('plan-badge').textContent = '🌱';
  }

  // Status line
  let statusText = '';
  let statusColor = 'text-slate-500';
  if (isPaid && expiresAt) {
    const d = new Date(expiresAt);
    const daysLeft = Math.ceil((d - Date.now()) / 86400000);
    if (daysLeft > 60) {
      statusText = `Renova em ${d.toLocaleDateString('pt-BR')}`;
      statusColor = isSuper ? 'text-[#2EC4B6]' : 'text-[#FF9F1C]';
    } else if (daysLeft > 0) {
      statusText = `Renova em ${daysLeft} dia${daysLeft === 1 ? '' : 's'}`;
      statusColor = daysLeft <= 7 ? 'text-orange-500' : (isSuper ? 'text-[#2EC4B6]' : 'text-[#FF9F1C]');
    } else {
      statusText = 'Assinatura expirada — renove para continuar';
      statusColor = 'text-red-500';
    }
  } else if (isPaid) {
    statusText = 'Ativo';
    statusColor = isSuper ? 'text-[#2EC4B6]' : 'text-[#FF9F1C]';
  } else {
    statusText = '5 primeiras aulas grátis';
    statusColor = 'text-slate-500';
  }
  const statusEl = document.getElementById('plan-status');
  statusEl.textContent = statusText;
  statusEl.className = 'text-sm font-bold mt-1 ' + statusColor;

  // Features list
  const items = isSuper ? [
    '✓ Tudo do Pro',
    '✓ 10 min/mês de voz com Yara AI',
    '✓ Correção de pronúncia',
    '✓ Relatório de progresso semanal',
    '✓ Acesso prioritário a novas lições',
    '✓ Suporte VIP por WhatsApp',
  ] : isPro ? [
    '✓ 44 aulas de inglês + 7 de francês',
    '✓ Voz Nova TTS em todas as lições',
    '✓ Yara AI Chat em todas as lições',
    '✓ Plano de estudos personalizado',
    '✓ Music Lab + Homework tracker',
  ] : [
    '✓ 5 primeiras aulas de inglês',
    '✓ Voz do browser (TTS)',
    '— Yara AI Chat',
    '— Music Lab',
    '— Voz Nova TTS',
  ];
  features.innerHTML = items.map(t => {
    const isMinus = t.startsWith('—');
    return `<p class="${isMinus ? 'text-slate-400 line-through' : 'text-slate-700'}">${t}</p>`;
  }).join('');

  // Action buttons
  if (!isPaid) {
    actions.innerHTML = `
      <a href="https://pay.kiwify.com.br/7HYhJgk" target="_blank"
         class="block text-center bg-gradient-to-r from-[#FF9F1C] to-orange-400 text-white font-black py-3.5 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-orange-500/20">
        ⚡ Assinar Pro · R$47/mês
      </a>
      <a href="https://pay.kiwify.com.br/lIBOlgZ" target="_blank"
         class="block text-center bg-gradient-to-r from-[#2EC4B6] to-teal-400 text-white font-black py-3 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow text-sm">
        🚀 Ou Super · R$97/mês
      </a>
      <a href="landing.html#pricing" class="text-center text-slate-500 font-bold text-sm py-2 hover:text-navy">Comparar planos →</a>
    `;
  } else if (isPro) {
    actions.innerHTML = `
      <a href="https://pay.kiwify.com.br/lIBOlgZ" target="_blank"
         class="block text-center bg-gradient-to-r from-[#2EC4B6] to-teal-400 text-white font-black py-3.5 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-teal-500/20">
        🚀 Upgrade para Super · R$97/mês
      </a>
      <button data-capy-onclick="openCancellation()" class="text-center text-slate-400 font-bold text-sm py-2 hover:text-slate-600">Gerenciar / Cancelar assinatura</button>
    `;
  } else {
    actions.innerHTML = `
      <button data-capy-onclick="openCancellation()" class="text-center text-slate-400 font-bold text-sm py-2 hover:text-slate-600">Gerenciar / Cancelar assinatura</button>
    `;
  }
}

function openCancellation() {
  // Kiwify customer portal — actual link tbd. For now, mailto + instructions.
  const modal = document.createElement('div');
  modal.style.cssText = 'position:fixed;inset:0;z-index:100;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,.6);backdrop-filter:blur(4px);';
  modal.innerHTML = `
    <div style="background:#fff;border-radius:20px;max-width:420px;padding:26px;position:relative;">
      <button data-capy-onclick="this.closest('div').parentElement.remove()" style="position:absolute;top:12px;right:12px;width:32px;height:32px;border-radius:50%;background:#f1f5f9;border:none;font-weight:900;cursor:pointer;">×</button>
      <h2 style="font-weight:900;font-size:18px;color:#0f172a;margin:0 0 10px;">Gerenciar assinatura</h2>
      <p style="color:#64748b;font-size:14px;line-height:1.5;margin:0 0 18px;">
        Por enquanto, para cancelar sua assinatura você precisa entrar em contato com a gente — vamos cuidar do cancelamento sem burocracia e sem perguntas.
      </p>
      <a href="mailto:luisfelima11@gmail.com?subject=Cancelar%20assinatura%20Capy%20English" style="display:block;text-align:center;background:#0f172a;color:#fff;padding:12px;border-radius:12px;text-decoration:none;font-weight:900;">📧 Enviar e-mail</a>
      <p style="color:#94a3b8;font-size:11px;margin:12px 0 0;text-align:center;">Em breve: portal de auto-gerenciamento da Kiwify.</p>
    </div>`;
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
  document.body.appendChild(modal);
}

renderPlan();

// ── Stats ────────────────────────────────────────────────────────────────
function renderStats() {
  const s = Store.state || {};
  document.getElementById('stat-level').textContent   = (typeof Store.getLevel === 'function') ? 'Lv.' + Store.getLevel() : '—';
  document.getElementById('stat-xp').textContent      = String(s.xp || 0);
  document.getElementById('stat-streak').textContent  = (s.streakDays || 0) + 'd';
  document.getElementById('stat-lessons').textContent = ((s.completedLessons || []).length) + '/44';
}
renderStats();

// ── Recent activity (from completedActivities) ──────────────────────────
function renderActivity() {
  const list = document.getElementById('activity-list');
  const s = Store.state || {};
  const items = [];
  if (s.completedLessons && s.completedLessons.length) {
    s.completedLessons.slice(-3).reverse().forEach(n => {
      items.push({ icon: '📚', text: `Aula ${String(n).padStart(2, '0')} concluída`, when: 'recente' });
    });
  }
  if (s.streakDays > 0) {
    items.push({ icon: '🔥', text: `${s.streakDays} dia${s.streakDays === 1 ? '' : 's'} de streak`, when: 'ativo' });
  }
  if (s.xp > 0) {
    items.push({ icon: '⭐', text: `${s.xp} XP acumulados`, when: 'total' });
  }
  if (items.length === 0) {
    list.innerHTML = '<p class="text-slate-400 text-sm italic">Comece uma aula para ver atividade aqui →</p>';
    return;
  }
  list.innerHTML = items.slice(0, 5).map(i => `
    <div class="flex items-center gap-3 py-1.5">
      <span class="text-xl">${i.icon}</span>
      <span class="flex-1 text-sm font-bold text-slate-700">${i.text}</span>
      <span class="text-xs text-slate-400 font-bold">${i.when}</span>
    </div>
  `).join('');
}
renderActivity();

// ── Force sync plan ──────────────────────────────────────────────────────
async function forceSyncPlan() {
  const icon = document.getElementById('sync-icon');
  icon.textContent = '⏳';
  if (typeof Store.syncPlanFromServer === 'function') {
    await Store.syncPlanFromServer({ force: true });
    renderPlan();
    icon.textContent = '✓';
    setTimeout(() => { icon.textContent = '↻'; }, 1800);
  } else {
    icon.textContent = '↻';
  }
}

// ── Logout ───────────────────────────────────────────────────────────────
document.getElementById('logout-btn').addEventListener('click', () => {
  if (!confirm('Sair da sua conta?')) return;
  try {
    if (window.Auth && window.Auth.logout) window.Auth.logout();
    else {
      localStorage.removeItem('capySession');
      window.location.href = '4_Login_Capy_Yara_Welcomes_You.html';
    }
  } catch (e) {
    localStorage.removeItem('capySession');
    window.location.href = '4_Login_Capy_Yara_Welcomes_You.html';
  }
});

// React to plan change events
document.addEventListener('planChanged', () => { renderPlan(); renderStats(); });

// ── Sobre mim: o que a Yara sabe do aluno ───────────────────────────────
// E o que a Yara usa para abrir as conversas com uma pergunta concreta em vez
// de "tudo bem?". Tudo por textContent: o detalhe e texto livre do aluno.
const SOBRE_ROTULOS = {
  nivel: { beginner: 'Iniciante', elementary: 'Básico', intermediate: 'Intermediário', advanced: 'Avançado' },
  objetivos: { travel: 'viajar', work: 'trabalho', entertainment: 'entretenimento', games: 'games', study: 'estudos', family: 'família' },
  gostos: { music: 'música', sports: 'esportes', food: 'comida', travel: 'viagem', tech: 'tecnologia', art: 'arte', series: 'séries e filmes', games: 'games' },
};

function linhaSobre(rotulo, valor) {
  const p = document.createElement('p');
  const r = document.createElement('span');
  r.className = 'text-slate-700 font-bold text-sm';
  r.textContent = rotulo + ': ';
  p.appendChild(r);
  p.appendChild(document.createTextNode(valor));
  return p;
}

function renderSobreMim(perfil) {
  const alvo = document.getElementById('sobre-mim');
  if (!alvo) return;
  alvo.textContent = '';
  if (/[?&]salvo=1(?:&|$)/.test(location.search)) {
    const ok = document.createElement('p');
    ok.className = 'text-slate-700 font-bold text-sm';
    ok.textContent = '✓ Salvo! A Yara já usa isso na próxima conversa.';
    alvo.appendChild(ok);
  }
  const p = perfil || {};
  const lista = (valores, mapa) => (Array.isArray(valores) ? valores : []).map(v => mapa[v]).filter(Boolean).join(', ');
  const linhas = [];
  if (SOBRE_ROTULOS.nivel[p.english_level]) linhas.push(linhaSobre('Nível', SOBRE_ROTULOS.nivel[p.english_level]));
  const objetivos = lista(p.goals, SOBRE_ROTULOS.objetivos);
  if (objetivos) linhas.push(linhaSobre('Aprende inglês para', objetivos));
  const gostos = lista(p.interests, SOBRE_ROTULOS.gostos);
  if (gostos) linhas.push(linhaSobre('Gosta de', gostos));
  if (p.interests_detail) linhas.push(linhaSobre('Nas suas palavras', '“' + String(p.interests_detail).slice(0, 200) + '”'));
  if (!linhas.length) {
    const vazio = document.createElement('p');
    vazio.className = 'text-slate-400 text-sm italic';
    vazio.textContent = 'A Yara ainda não sabe nada sobre você — conte em 1 minuto e as conversas ficam sobre o que você gosta. ';
    const a = document.createElement('a');
    a.href = 'onboarding.html?editar=1';
    a.className = 'text-xs font-black text-violet-500 hover:text-violet-700';
    a.textContent = 'Contar agora →';
    vazio.appendChild(a);
    alvo.appendChild(vazio);
    return;
  }
  linhas.forEach(l => alvo.appendChild(l));
}

(function carregarSobreMim() {
  let session = null;
  try { session = JSON.parse(localStorage.getItem('capySession') || 'null'); } catch (e) {}
  if (!session || !session.id || session.id === 'guest' || !window.Auth || typeof Auth.fetchProfile !== 'function') {
    const card = document.getElementById('sobre-mim-card');
    if (card) card.hidden = true;
    return;
  }
  Promise.resolve(Auth.fetchProfile(session.id)).then(renderSobreMim).catch(() => renderSobreMim(null));
})();

// ── Das nossas conversas: a memória da Yara ────────────────────────────────
// O que a Yara anotou das conversas livres (POST /api/lembrancas). O aluno vê e
// apaga cada item: o dado é dele. Montado todo aqui, com textContent — o fato
// veio da fala do aluno — e só com classes que a página já usa (o CSS desta
// página é pré-compilado; classe nova não existe nele). O fetch leva o token
// CSRF sozinho: o auth-secure.js embrulha o fetch da página.
function montarLembrancas(fatos) {
  const card = document.getElementById('sobre-mim-card');
  if (!card || card.hidden) return;
  let bloco = document.getElementById('yara-lembra');
  if (!bloco) {
    bloco = document.createElement('div');
    bloco.id = 'yara-lembra';
    bloco.className = 'mt-4 border-t border-slate-100';
    card.appendChild(bloco);
  }
  bloco.textContent = '';

  const topo = document.createElement('div');
  topo.className = 'flex items-center justify-between mt-4 mb-2';
  const titulo = document.createElement('p');
  titulo.className = 'text-slate-500 text-xs font-black uppercase tracking-widest';
  titulo.textContent = 'Das nossas conversas';
  topo.appendChild(titulo);
  if (fatos.length) {
    const tudo = document.createElement('button');
    tudo.type = 'button';
    tudo.className = 'text-xs font-black text-violet-500 hover:text-violet-700 cursor-pointer';
    tudo.textContent = 'Apagar tudo';
    tudo.addEventListener('click', () => {
      if (window.confirm('Apagar tudo o que a Yara anotou das conversas? Ela não vai mais lembrar disso.')) apagarLembranca({ tudo: true });
    });
    topo.appendChild(tudo);
  }
  bloco.appendChild(topo);

  const aviso = document.createElement('p');
  aviso.className = 'text-xs text-slate-400 leading-relaxed mb-2';
  aviso.textContent = fatos.length
    ? 'A Yara anota o que você conta nas conversas para lembrar na próxima. Você pode apagar qualquer item. O professor Luis também vê.'
    : 'Converse com a Yara e ela vai lembrando do que você contar: família, trabalho, seus planos. Tudo aparece aqui, e você apaga quando quiser.';
  bloco.appendChild(aviso);
  if (!fatos.length) return;

  const lista = document.createElement('ul');
  lista.className = 'space-y-2';
  fatos.slice().reverse().forEach(f => {            // mais recente primeiro
    const li = document.createElement('li');
    li.className = 'flex items-start gap-2 text-sm text-slate-600';
    const texto = document.createElement('span');
    texto.className = 'flex-1 leading-relaxed';
    texto.textContent = f.texto;
    const apagar = document.createElement('button');
    apagar.type = 'button';
    apagar.className = 'flex-shrink-0 text-slate-300 hover:text-slate-600 text-xs font-bold px-2 py-1 rounded-lg hover:bg-slate-50 cursor-pointer';
    apagar.textContent = '✕';
    apagar.setAttribute('aria-label', 'Apagar: ' + f.texto);
    apagar.addEventListener('click', () => apagarLembranca({ id: f.id }));
    li.append(texto, apagar);
    lista.appendChild(li);
  });
  bloco.appendChild(lista);
}

async function apagarLembranca(corpo) {
  try {
    const r = await fetch('/api/lembrancas/apagar', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(corpo),
    });
    const d = await r.json().catch(() => null);
    if (!r.ok || !d || !Array.isArray(d.fatos)) throw new Error('apagar_falhou');
    montarLembrancas(d.fatos);
  } catch (e) {
    window.alert('Não consegui apagar agora. Tente de novo em instantes.');
  }
}

(function carregarLembrancas() {
  let session = null;
  try { session = JSON.parse(localStorage.getItem('capySession') || 'null'); } catch (e) {}
  if (!session || !session.id || session.id === 'guest') return;
  fetch('/api/lembrancas', { credentials: 'same-origin' })
    .then(r => (r.ok ? r.json() : null))
    .then(d => { if (d && Array.isArray(d.fatos)) montarLembrancas(d.fatos); })
    .catch(() => { /* sem memória na tela: o resto da conta segue */ });
})();
