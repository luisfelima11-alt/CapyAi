/* ── avatar picker ──────────────────────────────── */
const AVATARS = ['🐾','🦊','🐼','🐸','🦁','🐯','🐧','🦋','🐝','🌿'];
let selectedAvatar = '🐾';

function renderAvatars() {
  document.getElementById('avatar-row').innerHTML = AVATARS.map(a => `
    <button data-capy-onclick="pickAvatar('${a}', this)"
            data-avatar="${a}"
            class="avatar-btn w-11 h-11 rounded-full bg-slate-100 hover:bg-pink-100 text-2xl
                   transition-all border-2 border-transparent flex items-center justify-center
                   ${a === selectedAvatar ? 'border-pink-brand bg-pink-50 scale-110' : ''}">
      ${a}
    </button>`).join('');
}

function pickAvatar(emoji, btn) {
  selectedAvatar = emoji;
  document.querySelectorAll('.avatar-btn').forEach(b => {
    b.classList.remove('border-pink-brand', 'bg-pink-50', 'scale-110');
    b.classList.add('border-transparent');
  });
  btn.classList.add('border-pink-brand', 'bg-pink-50', 'scale-110');
  btn.classList.remove('border-transparent');
}
renderAvatars();

/* ── tab switcher ───────────────────────────────── */
let currentTab = 'login';

function switchTab(tab) {
  currentTab = tab;
  const loginForm  = document.getElementById('form-login');
  const signupForm = document.getElementById('form-signup');
  const tabLogin   = document.getElementById('tab-login');
  const tabSignup  = document.getElementById('tab-signup');
  const bar        = document.getElementById('tab-bar');
  const headerSub  = document.getElementById('header-sub');
  const hint       = document.getElementById('bottom-hint');

  if (tab === 'login') {
    loginForm.classList.remove('hidden-panel');
    signupForm.classList.add('hidden-panel');
    tabLogin.classList.replace('text-slate-400', 'text-pink-brand');
    tabSignup.classList.replace('text-pink-brand', 'text-slate-400');
    bar.style.setProperty('--tab-left',  '0%');
    bar.style.setProperty('--tab-width', '50%');
    headerSub.textContent = 'Sign in to continue your adventure.';
    hint.innerHTML = `Don't have an account? <button data-capy-onclick="switchTab('signup')" class="text-pink-brand font-bold hover:underline ml-1">Sign up free →</button>`;
  } else {
    signupForm.classList.remove('hidden-panel');
    loginForm.classList.add('hidden-panel');
    tabSignup.classList.replace('text-slate-400', 'text-pink-brand');
    tabLogin.classList.replace('text-pink-brand', 'text-slate-400');
    bar.style.setProperty('--tab-left',  '50%');
    bar.style.setProperty('--tab-width', '50%');
    headerSub.textContent = 'Create your free explorer account.';
    hint.innerHTML = `Already have an account? <button data-capy-onclick="switchTab('login')" class="text-pink-brand font-bold hover:underline ml-1">Log in →</button>`;
  }
  clearErrors();
}

/* ── error helpers ──────────────────────────────── */
function clearErrors() {
  document.querySelectorAll('[id^="err-"]').forEach(el => {
    el.textContent = '';
    el.classList.add('hidden');
  });
  document.querySelectorAll('input').forEach(i => {
    i.classList.remove('border-red-400');
    i.classList.add('border-slate-200');
  });
}

function showError(fieldId, msg) {
  const errEl = document.getElementById('err-' + fieldId);
  if (errEl) { errEl.textContent = msg; errEl.classList.remove('hidden'); }
  const inputId = fieldId.replace('login-','login-').replace('signup-','signup-');
  const inputEl = document.getElementById(inputId);
  if (inputEl) { inputEl.classList.replace('border-slate-200', 'border-red-400'); }
}

/* ── password visibility toggle ────────────────── */
function togglePw(inputId, btn) {
  const input = document.getElementById(inputId);
  const icon  = btn.querySelector('.material-symbols-outlined');
  if (input.type === 'password') {
    input.type = 'text';
    icon.textContent = 'visibility_off';
  } else {
    input.type = 'password';
    icon.textContent = 'visibility';
  }
}

/* ── password strength ──────────────────────────── */
function updateStrength() {
  const pw = document.getElementById('signup-password').value;
  let score = 0;
  if (pw.length >= 12) score++;
  if (pw.length >= 16) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw) || /[^A-Za-z0-9]/.test(pw)) score++;

  const colors = ['bg-red-400','bg-orange-400','bg-yellow-400','bg-green-brand'];
  const labels = ['Too short','Weak','Fair','Strong'];
  for (let i = 1; i <= 4; i++) {
    const seg = document.getElementById('s' + i);
    seg.className = 'strength-seg flex-1 ' + (i <= score ? colors[score - 1] : 'bg-slate-200');
  }
  document.getElementById('strength-label').textContent = pw.length ? labels[score - 1] || '' : '';
}

/* ── success splash ─────────────────────────────── */
function showSuccess(name, isNew = false) {
  const overlay = document.getElementById('success-overlay');
  document.getElementById('success-title').textContent = isNew
    ? `Welcome, ${name}! 🎉`
    : `Welcome back, ${name}! 🌿`;
  overlay.classList.remove('hidden');

  // For new accounts always go to onboarding; for existing check profile
  if (isNew) {
    document.getElementById('success-sub').textContent = 'Vamos personalizar seu inglês…';
    setTimeout(() => { window.location.href = 'onboarding.html'; }, 1800);
  } else {
    document.getElementById('success-sub').textContent = 'Taking you to the forest…';
    setTimeout(async () => {
      const session = Auth.getSession();
      if (session && session.role !== 'guest' && session.id !== 'guest') {
        const profile = await Auth.fetchProfile(session.id);
        if (!profile || !profile.onboarding_complete) {
          window.location.href = 'onboarding.html';
          return;
        }
      }
      window.location.href = '6_Home_Forest_Expedition.html';
    }, 1800);
  }
}

/* ── login handler ──────────────────────────────── */
async function handleLogin() {
  clearErrors();
  const email    = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  if (!email)    { showError('login-email',    'Email is required.');    return; }
  if (!password) { showError('login-password', 'Password is required.'); return; }

  const result = await Auth.login(email, password);
  if (!result.ok) {
    showError('login-' + result.field, result.error);
    return;
  }

  // Attempt to sync Store with the remote DB or fallback to local
  const storeKey = 'capyYaraState_' + result.user.id;
  try {
    const res = await fetch('/api/db?type=state');
    if (res.ok) {
      const dbState = await res.json();
      if (dbState) localStorage.setItem(storeKey, JSON.stringify(dbState));
    }
    const resSet = await fetch('/api/db?type=settings');
    if (resSet.ok) {
      const dbSet = await resSet.json();
      if (dbSet) localStorage.setItem('capySettings', JSON.stringify(dbSet));
    }
  } catch(e) {}
  
  const saved = localStorage.getItem(storeKey);
  if (saved) localStorage.setItem('capyYaraState', saved);

  showSuccess(result.user.name, false);
}

/* ── signup handler ─────────────────────────────── */
async function handleSignup() {
  clearErrors();
  const name     = document.getElementById('signup-name').value.trim();
  const email    = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  const confirm  = document.getElementById('signup-confirm').value;

  if (!name)    { showError('signup-name',    'Name is required.');    return; }
  if (!email)   { showError('signup-email',   'Email is required.');   return; }
  if (!password){ showError('signup-password','Password is required.'); return; }
  if (password.length < 12) { showError('signup-password', 'Use pelo menos 12 caracteres.'); return; }
  if (password !== confirm) {
    showError('signup-confirm', 'Passwords do not match.');
    return;
  }

  const result = await Auth.signUp(name, email, password, selectedAvatar);
  if (!result.ok) {
    showError('signup-' + result.field, result.error);
    return;
  }

  if (result.verificationRequired || !result.user) {
    showError('signup-email', 'Confira seu e-mail para confirmar a conta antes de entrar.');
    return;
  }

  // Also set playerName in the shared store
  const storeData = JSON.parse(localStorage.getItem('capyYaraState_' + result.user.id) || '{}');
  storeData.playerName = name;
  localStorage.setItem('capyYaraState_' + result.user.id, JSON.stringify(storeData));
  localStorage.setItem('capyYaraState', JSON.stringify(storeData));
  
  try {
    await fetch('/api/db', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'state', payload: storeData })
    });
  } catch(e) {}

  showSuccess(result.user.name, true);
}

/* ── guest handler ──────────────────────────────── */
async function handleGuest() {
  const result = await Auth.continueAsGuest();
  if (!result.ok) {
    showError('login-email', result.error || 'Não foi possível iniciar a visita.');
    return;
  }
  showSuccess('Explorer', false);
}

/* ── forgot password → magic link via email ────────────────────── */
function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[char]);
}

async function forgotPassword() {
  const email = document.getElementById('login-email').value.trim();
  if (!email) {
    showError('login-email', 'Digite seu e-mail acima primeiro.');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError('login-email', 'E-mail inválido.');
    return;
  }

  // Build the modal once
  let modal = document.getElementById('magic-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'magic-modal';
    modal.style.cssText = 'position:fixed;inset:0;z-index:100;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,.6);backdrop-filter:blur(4px);font-family:Plus Jakarta Sans,sans-serif';
    document.body.appendChild(modal);
  }
  modal.innerHTML = `
    <div style="background:#fff;border-radius:24px;max-width:420px;width:100%;padding:32px;text-align:center;box-shadow:0 16px 60px rgba(0,0,0,.25);position:relative">
      <div style="font-size:48px;margin-bottom:12px">🐾</div>
      <h2 style="font-weight:900;font-size:20px;color:#001f3f;margin:0 0 8px">Enviando link de acesso...</h2>
      <p style="color:#64748b;font-size:14px;line-height:1.5;margin:0 0 20px">Para <strong>${escapeHtml(email)}</strong></p>
      <div style="width:40px;height:40px;border:4px solid #fde68a;border-top-color:#FF9F1C;border-radius:50%;animation:spin .8s linear infinite;margin:0 auto"></div>
      <link rel="stylesheet" href="assets/css/pages/4_login_capy_yara_welcomes_you-2.css">
    </div>`;

  try {
    const r = await fetch('/api/auth/magic-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await r.json();

    if (r.status === 429) {
      modal.innerHTML = renderMagicModal('⏳', 'Muitas tentativas', 'Aguarde algumas horas e tente de novo. (Limite anti-spam.)');
      return;
    }
    if (!r.ok) {
      // `message` vem do 503 `email_indisponivel`, quando NENHUM provedor
      // aceitou a mensagem. Antes o endpoint respondia ok:true mesmo nesse
      // caso e a tela dizia "link enviado" para quem nunca ia receber nada.
      modal.innerHTML = renderMagicModal('⚠️', 'Não conseguimos enviar',
        data.message || data.details || 'Tente novamente em alguns minutos.');
      return;
    }

    // Dev mode (no Resend key set yet): show the link directly
    if (false && data.devLink) {
      modal.innerHTML = `
        <div style="background:#fff;border-radius:24px;max-width:520px;width:100%;padding:32px;text-align:center;box-shadow:0 16px 60px rgba(0,0,0,.25)">
          <button data-capy-onclick="document.getElementById('magic-modal').remove()" style="position:absolute;top:14px;right:14px;width:32px;height:32px;border-radius:50%;background:#f1f5f9;border:none;font-weight:900;cursor:pointer">×</button>
          <div style="font-size:48px;margin-bottom:12px">⚙️</div>
          <h2 style="font-weight:900;font-size:18px;color:#001f3f;margin:0 0 8px">Modo dev — sem e-mail configurado</h2>
          <p style="color:#94a3b8;font-size:12px;line-height:1.5;margin:0 0 16px">${data.warning || ''}</p>
          <p style="color:#475569;font-size:13px;margin:0 0 16px">Clique no link abaixo pra entrar:</p>
          <a href="${data.devLink}" style="display:block;background:#FF9F1C;color:#fff;font-weight:900;padding:14px;border-radius:14px;text-decoration:none;word-break:break-all;font-size:13px">${data.devLink}</a>
        </div>`;
      return;
    }

    // Normal: success
    modal.innerHTML = renderMagicModal('✉️', 'Confira seu e-mail', `Se o endereço estiver habilitado, você receberá um link de acesso em ${email}. Use o link uma única vez.\n\nAbra o link no mesmo navegador em que fez a solicitação. Não chegou? Verifique a caixa de spam.`);
  } catch (e) {
    modal.innerHTML = renderMagicModal('⚠️', 'Falha de rede', 'Verifique sua conexão e tente novamente.');
  }

  function renderMagicModal(emoji, title, msg) {
    return `
      <div style="background:#fff;border-radius:24px;max-width:420px;width:100%;padding:32px;text-align:center;box-shadow:0 16px 60px rgba(0,0,0,.25);position:relative">
        <button data-capy-onclick="document.getElementById('magic-modal').remove()" style="position:absolute;top:14px;right:14px;width:32px;height:32px;border-radius:50%;background:#f1f5f9;border:none;font-weight:900;cursor:pointer">×</button>
        <div style="font-size:56px;margin-bottom:12px">${escapeHtml(emoji)}</div>
        <h2 style="font-weight:900;font-size:20px;color:#001f3f;margin:0 0 10px">${escapeHtml(title)}</h2>
        <p style="color:#64748b;font-size:14px;line-height:1.6;margin:0;white-space:pre-line;overflow-wrap:anywhere">${escapeHtml(msg)}</p>
      </div>`;
  }
}

/* ── particles ──────────────────────────────────── */
function spawnParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 22; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 8 + 3;
    p.className = 'particle';
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      top:${Math.random() * 100}%;
      --dur:${3 + Math.random() * 5}s;
      --delay:${Math.random() * 4}s;
      opacity:${0.05 + Math.random() * 0.15};
    `;
    container.appendChild(p);
  }
}
spawnParticles();

/* ── init tab bar position ──────────────────────── */
document.getElementById('tab-bar').style.setProperty('--tab-left',  '0%');
document.getElementById('tab-bar').style.setProperty('--tab-width', '50%');

/* ── keyboard enter support ─────────────────────── */
document.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  if (currentTab === 'login')  handleLogin();
  else                         handleSignup();
});

/* ── redirect if already logged in ─────────────── */
// The display cache is not proof of a valid session. Guests must also be able
// to stay here and sign into their registered account.
Auth.ready().then(session => {
  if (session && session.role !== 'guest' && session.id !== 'guest') {
    window.location.href = '6_Home_Forest_Expedition.html';
  }
}).catch(() => { /* Keep the login form available during a network outage. */ });
