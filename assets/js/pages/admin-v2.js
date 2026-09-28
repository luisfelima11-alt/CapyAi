// ══════════════════════════════════════════════════════════════════════════
// Admin novo (26/set/2026) — pensado para o celular.
// Protótipo aprovado pelo Luis: https://claude.ai/artifact/9psa329nmXdJtVsnigJs7R
//
// Cinco seções (Hoje, Alunos, Conteúdo, Dinheiro, Avisos) + a ficha do aluno,
// no lugar das 10 abas do admin antigo (que segue em admin-antigo.html para
// CRM, GPS Tronic, Corrida XP e Métricas).
//
// Regras desta página:
//  - CSP estrita: nada de script inline nem onclick; eventos só por aqui.
//  - Dado de aluno (nome, fato da memória, anotação, resumo da IA) entra no
//    DOM SÓ por textContent — o `el()` abaixo nunca monta HTML a partir de texto.
//  - O portão é o MESMO do admin antigo (tests/admin-portao.test.js roda os
//    dois scripts): cada falha com a sua frase, e trocar de conta funciona.
// ══════════════════════════════════════════════════════════════════════════

// ── Utilidades ─────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);

// Cria um elemento. `props`: class, text, style e atributos; onX = evento.
// Filhos: nós ou texto (texto vira nó de texto, nunca HTML).
function el(tag, props, ...filhos) {
  const n = document.createElement(tag);
  if (props) {
    for (const [k, v] of Object.entries(props)) {
      if (v == null || v === false) continue;
      if (k === 'class') n.className = v;
      else if (k === 'text') n.textContent = String(v);
      else if (k.startsWith('on') && typeof v === 'function') n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v === true ? '' : String(v));
    }
  }
  for (const f of filhos.flat(Infinity)) {
    if (f == null || f === false) continue;
    n.appendChild(typeof f === 'object' ? f : document.createTextNode(String(f)));
  }
  return n;
}

// Ícones de traço (os mesmos do protótipo). Cada um: lista de [tag, atributos].
const ICONES = {
  chat: [['path', { d: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z' }]],
  link: [['path', { d: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71' }], ['path', { d: 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71' }]],
  chave: [['circle', { cx: 7.5, cy: 15.5, r: 5.5 }], ['path', { d: 'm21 2-9.6 9.6' }], ['path', { d: 'm15.5 7.5 3 3L22 7l-3-3' }]],
  carteira: [['rect', { x: 2, y: 6, width: 20, height: 14, rx: 2 }], ['path', { d: 'M2 10h20' }], ['path', { d: 'M16 15h2' }]],
  brilho: [['path', { d: 'M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z' }], ['path', { d: 'M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z' }]],
  mic: [['rect', { x: 9, y: 2, width: 6, height: 12, rx: 3 }], ['path', { d: 'M19 10v1a7 7 0 0 1-14 0v-1' }], ['path', { d: 'M12 18v4' }]],
  sino: [['path', { d: 'M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9' }], ['path', { d: 'M13.73 21a2 2 0 0 1-3.46 0' }]],
  alerta: [['path', { d: 'M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z' }], ['path', { d: 'M12 9v4' }], ['path', { d: 'M12 17h.01' }]],
  seta: [['path', { d: 'm9 18 6-6-6-6' }]],
  voltar: [['path', { d: 'm15 18-6-6 6-6' }]],
  busca: [['circle', { cx: 11, cy: 11, r: 8 }], ['path', { d: 'm21 21-4.3-4.3' }]],
  mais: [['path', { d: 'M12 5v14M5 12h14' }]],
  enviar: [['path', { d: 'm22 2-7 20-4-9-9-4z' }], ['path', { d: 'M22 2 11 13' }]],
};
function icone(nome, tam = 18) {
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  for (const [k, v] of Object.entries({ width: tam, height: tam, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
    'stroke-width': 1.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true' })) svg.setAttribute(k, v);
  for (const [tag, attrs] of ICONES[nome] || []) {
    const parte = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) parte.setAttribute(k, v);
    svg.appendChild(parte);
  }
  return svg;
}

const FUSO = 'America/Sao_Paulo';
const numero = n => Number(n || 0).toLocaleString('pt-BR');
const reais = n => 'R$ ' + Number(n || 0).toLocaleString('pt-BR', { maximumFractionDigits: 2 });
const dolares = n => 'US$ ' + Number(n || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const hojeISO = () => new Date().toLocaleDateString('en-CA', { timeZone: FUSO });

function dataCurta(iso) {
  if (!iso) return '—';
  const d = new Date(String(iso).length === 10 ? iso + 'T12:00:00Z' : iso);
  return isNaN(d) ? '—' : d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', timeZone: FUSO });
}
function dataLonga(iso) {
  const d = new Date(iso);
  return isNaN(d) ? '—' : d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: FUSO });
}
// "hoje às 06:02", "ontem às 19:00", "12/09 às 19:00"
function quandoFoi(iso) {
  if (!iso) return 'nunca';
  const d = new Date(iso);
  if (isNaN(d)) return 'nunca';
  const hora = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: FUSO });
  const dia = d.toLocaleDateString('en-CA', { timeZone: FUSO });
  const ontem = new Date(Date.now() - 86400000).toLocaleDateString('en-CA', { timeZone: FUSO });
  if (dia === hojeISO()) return `hoje às ${hora}`;
  if (dia === ontem) return `ontem às ${hora}`;
  return `${dataCurta(iso)} às ${hora}`;
}
function iniciais(nome) {
  const partes = String(nome || '?').trim().split(/\s+/).filter(Boolean);
  return ((partes[0] || '?')[0] + (partes.length > 1 ? partes[partes.length - 1][0] : '')).toUpperCase();
}
const primeiroNome = nome => String(nome || '').trim().split(/\s+/)[0] || '';
const semAcento = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

let toastTimer = null;
function toast(msg, tipo) {
  const t = $('toast');
  if (!t) return;
  t.textContent = msg;
  t.className = 'toast' + (tipo === 'erro' ? ' toast--erro' : '');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.add('hidden'), 3200);
}

async function copiar(texto) {
  try { await navigator.clipboard.writeText(texto); return true; } catch (e) { return false; }
}
const linkWhatsApp = msg => 'https://wa.me/?text=' + encodeURIComponent(msg);

// ── API ────────────────────────────────────────────────────────────────────
// Igual ao admin antigo: um 403 quase sempre é o token CSRF vencido (vive em
// sessionStorage, que morre com a aba) — renova a sessão e tenta UMA vez.
async function api(path, opts = {}, _jaTentou) {
  const r = await fetch(path, {
    ...opts,
    credentials: 'same-origin',
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
  });
  if (r.status === 403 && !_jaTentou && window.Auth && Auth.refreshSession) {
    let corpo = null;
    try { corpo = await r.clone().json(); } catch (e) { /* corpo não-JSON */ }
    if (!corpo || corpo.error === 'invalid_csrf') {
      try { await Auth.refreshSession(); } catch (e) { /* segue e deixa o 403 aparecer */ }
      return api(path, opts, true);
    }
  }
  if (r.status === 401 || r.status === 403) { showGate(motivoDoPortao()); throw new Error('unauthorized'); }
  let corpo = null;
  try { corpo = await r.json(); } catch (e) { corpo = null; }
  if (!r.ok) {
    const erro = new Error((corpo && corpo.error) || `http_${r.status}`);
    erro.status = r.status;
    erro.corpo = corpo;
    throw erro;
  }
  return corpo || {};
}
const postar = (path, corpo) => api(path, { method: 'POST', body: JSON.stringify(corpo || {}) });

// Leituras compartilhadas entre as telas, uma vez por abertura do admin.
const cache = {};
function carregar(chave, rota) {
  if (!cache[chave]) cache[chave] = api(rota).catch(e => { delete cache[chave]; throw e; });
  return cache[chave];
}
function esquecer(...chaves) { for (const k of chaves) delete cache[k]; }

// ── Portão ─────────────────────────────────────────────────────────────────
// O MESMO do admin antigo (26/set): antes, toda falha virava "Chave inválida",
// frase da versão que pedia chave. Cada caso agora tem a sua frase e a sua saída.
const FRASE_DO_PORTAO = {
  nao_admin: 'Esta conta não é de administrador.',
  sessao: 'Sua sessão venceu. Entre de novo.',
  falha: 'Não consegui falar com o servidor. Tente de novo em instantes.',
};
const LOGIN_COM_VOLTA = '4_Login_Capy_Yara_Welcomes_You.html?next=admin.html';

function motivoDoPortao() {
  const s = Auth.getSession();
  if (!s || s.role === 'guest') return 'deslogado';
  return s.role === 'admin' ? 'sessao' : 'nao_admin';
}

let appAberto = false;

function showGate(motivo) {
  const m = motivo || 'deslogado';
  appAberto = false;
  $('gate').classList.remove('hidden');
  $('app').classList.add('hidden');

  const erro = $('gate-error');
  erro.textContent = FRASE_DO_PORTAO[m] || '';
  erro.classList.toggle('hidden', !FRASE_DO_PORTAO[m]);

  const s = Auth.getSession();
  const conta = s && s.role !== 'guest' ? [s.name, s.email && `(${s.email})`].filter(Boolean).join(' ') : '';
  const quem = $('gate-quem');
  quem.textContent = m === 'nao_admin' && conta ? `Você está conectado como ${conta}.` : '';
  quem.classList.toggle('hidden', !quem.textContent);

  $('gate-trocar').classList.toggle('hidden', m !== 'nao_admin');
  const btn = $('gate-btn');
  btn.classList.toggle('hidden', m === 'nao_admin');
  btn.textContent = m === 'falha' ? 'Tentar de novo' : 'Entrar com conta administrativa';
}

function showApp() {
  appAberto = true;
  $('gate').classList.add('hidden');
  $('app').classList.remove('hidden');
  render();
}

async function entrarNoAdmin() {
  try {
    const visao = await api('/api/admin/overview');
    cache.visao = Promise.resolve(visao);
    showApp();
  } catch (e) {
    if (e.message !== 'unauthorized') showGate('falha');
  }
}

$('gate-btn').addEventListener('click', async () => {
  // refreshSession, não ready(): o ready() guarda a PRIMEIRA resposta da página.
  const user = await Auth.refreshSession();
  if (!user || user.role === 'guest') { window.location.href = LOGIN_COM_VOLTA; return; }
  if (user.role !== 'admin') { showGate('nao_admin'); return; }
  entrarNoAdmin();
});

$('gate-trocar').addEventListener('click', () => {
  try { sessionStorage.setItem('capyDepoisDoLogin', 'admin.html'); } catch (e) { /* sem storage: volta pela home */ }
  Auth.logout();
});

// ── Menu da conta ──────────────────────────────────────────────────────────
function fecharMenu() {
  $('menu').classList.add('hidden');
  $('menu-btn').setAttribute('aria-expanded', 'false');
}
$('menu-btn').addEventListener('click', ev => {
  ev.stopPropagation();
  const aberto = !$('menu').classList.contains('hidden');
  if (aberto) fecharMenu();
  else { $('menu').classList.remove('hidden'); $('menu-btn').setAttribute('aria-expanded', 'true'); }
});
document.addEventListener('click', ev => {
  const menu = $('menu');
  if (menu && !menu.classList.contains('hidden') && !(menu.contains && menu.contains(ev.target))) fecharMenu();
});
$('logout-btn').addEventListener('click', () => Auth.logout());

// ── Rotas ──────────────────────────────────────────────────────────────────
// #hoje · #alunos · #aluno/<id> · #conteudo · #dinheiro · #avisos
const TITULOS = { hoje: 'Hoje', alunos: 'Alunos', aluno: 'Aluno', conteudo: 'Conteúdo', dinheiro: 'Dinheiro', avisos: 'Avisos' };

function rotaAtual() {
  const h = String((window.location && window.location.hash) || '#hoje').slice(1);
  const [nome, ...resto] = h.split('/');
  if (!Object.prototype.hasOwnProperty.call(TITULOS, nome)) return { nome: 'hoje', id: null };
  let id = null;
  try { id = resto.length ? decodeURIComponent(resto.join('/')) : null; } catch (e) { id = null; }
  return { nome, id };
}

function saudacao() {
  const hora = Number(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', hour12: false, timeZone: FUSO }).slice(0, 2));
  const s = Auth.getSession();
  const nome = primeiroNome(s && s.name);
  return (hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite') + (nome ? `, ${nome}` : '');
}
function hojePorExtenso() {
  const t = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: FUSO });
  return t.charAt(0).toUpperCase() + t.slice(1);
}

function render() {
  if (!appAberto) return;
  fecharMenu();
  const r = rotaAtual();
  for (const s of document.querySelectorAll('[data-secao]')) s.classList.toggle('hidden', s.dataset.secao !== r.nome);
  const naNav = r.nome === 'aluno' ? 'alunos' : r.nome;
  for (const a of document.querySelectorAll('[data-nav]')) {
    if (a.dataset.nav === naNav) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  }
  $('topo-titulo').textContent = r.nome === 'hoje' ? saudacao() : TITULOS[r.nome];
  $('topo-data').textContent = r.nome === 'hoje' ? hojePorExtenso() : '';
  const s = Auth.getSession();
  $('menu-btn').textContent = iniciais((s && s.name) || 'Admin');
  if (typeof window.scrollTo === 'function') window.scrollTo(0, 0);
  TELAS[r.nome](r.id);
}
window.addEventListener('hashchange', render);

// Troca o conteúdo de uma seção (só se o usuário ainda estiver nela).
function montar(secaoId, ...nos) {
  const s = $(secaoId);
  s.textContent = '';
  for (const n of nos.flat(Infinity)) if (n) s.appendChild(n);
}
const carregando = secaoId => montar(secaoId, el('p', { class: 'carregando', text: 'Carregando…' }));
function mostrarErro(secaoId, e, deNovo) {
  if (e && e.message === 'unauthorized') return;
  montar(secaoId, el('p', { class: 'aviso' }, 'Não consegui carregar agora. ',
    el('button', { type: 'button', class: 'botao botao--pequeno', text: 'Tentar de novo', onclick: deNovo })));
}
const aindaEm = nome => appAberto && rotaAtual().nome === nome;

// ── Blocos comuns ──────────────────────────────────────────────────────────
const ROTULOS = {
  nivel: { beginner: 'Iniciante', elementary: 'Básico', intermediate: 'Intermediário', advanced: 'Avançado' },
  objetivos: { travel: 'viajar', work: 'trabalho', entertainment: 'entretenimento', games: 'games', study: 'estudos', family: 'família' },
  gostos: { music: 'música', sports: 'esportes', food: 'comida', travel: 'viagem', tech: 'tecnologia', art: 'arte', series: 'séries e filmes', games: 'games' },
  plano: { super: 'Super', pro: 'Pro', free: 'Grátis' },
  tipoFato: { familia: 'família', trabalho: 'trabalho', estudo: 'estudo', lugar: 'lugar', plano: 'plano', gosto: 'gosto', rotina: 'rotina', outro: 'outro' },
};
const STATUS = {
  active_today: { selo: 'Hoje', tom: 'tom-ok' },
  idle: { selo: 'Sumido', tom: 'tom-atencao' },
  never_started: { selo: 'Novo', tom: 'tom-novo' },
};

function subDoAluno(a) {
  if (a.status === 'never_started') return 'Ainda não fez a primeira aula';
  const xp = `${numero(a.xp)} XP`;
  if (a.status === 'active_today') return `${xp} · ${a.streakDays > 1 ? `${a.streakDays} dias seguidos` : 'praticou hoje'}`;
  return a.daysSincePractice != null ? `${xp} · parado há ${a.daysSincePractice} dia${a.daysSincePractice === 1 ? '' : 's'}` : `${xp} · parado`;
}

// A mensagem de WhatsApp segue o método do Luis: perguntar antes de oferecer.
function mensagemPara(a) {
  const nome = primeiroNome(a.name);
  if (a.status === 'never_started') return `Oi, ${nome}! Aqui é o Luis, da Capy English. Vi que você ainda não conseguiu começar as aulas. Me conta: o que atrapalhou?`;
  if (a.status === 'idle') return `Oi, ${nome}! Aqui é o Luis. Senti sua falta nas aulas esses dias. Como você está?`;
  return `Oi, ${nome}! Vi que você praticou hoje, mandou bem! Como foi a aula?`;
}

function linhaDeAluno(a, comWhatsApp) {
  const st = STATUS[a.status] || STATUS.idle;
  const corpo = el('a', { href: `#aluno/${encodeURIComponent(a.id)}`, class: 'linha', style: comWhatsApp ? 'flex-grow:1;padding:0;min-height:44px' : null },
    el('span', { class: `avatar ${st.tom}`, 'aria-hidden': 'true', text: iniciais(a.name) }),
    el('span', { class: 'linha__texto' },
      el('span', { class: 'linha__titulo', text: a.name }),
      el('span', { class: 'linha__sub', text: subDoAluno(a) })),
    comWhatsApp ? null : el('span', { class: `selo ${st.tom}`, text: st.selo }));
  if (!comWhatsApp) return el('li', null, corpo);
  return el('li', null, el('div', { class: 'linha' }, corpo,
    el('a', { class: 'botao botao--pequeno', href: linkWhatsApp(mensagemPara(a)), target: '_blank', rel: 'noopener', 'aria-label': `Chamar ${a.name} no WhatsApp` },
      icone('chat', 16), 'Chamar')));
}

function kpi(valor, rotulo, nota, alerta) {
  return el('div', { class: 'kpi' + (alerta ? ' kpi--alerta' : '') },
    el('span', { class: 'kpi__numero', text: numero(valor) }),
    el('span', { class: 'kpi__rotulo', text: rotulo }),
    el('span', { class: 'kpi__nota', text: nota }));
}

function bloco(titulo, link, ...conteudo) {
  return el('div', { class: 'bloco' },
    el('div', { class: 'bloco__topo' }, el('h2', { text: titulo }),
      link ? el('a', { class: 'bloco__link', href: link.href, text: link.texto }) : null),
    ...conteudo);
}

function linhaIcone(nomeIcone, tom, titulo, sub) {
  return el('li', null, el('div', { class: 'linha linha--compacta' },
    el('span', { class: `linha__icone ${tom}`, 'aria-hidden': 'true' }, icone(nomeIcone)),
    el('span', { class: 'linha__texto' }, el('span', { class: 'linha__titulo', style: 'white-space:normal', text: titulo }),
      el('span', { class: 'linha__sub', text: sub }))));
}

// Uma tarefa agendada "está rodando" se bateu nas últimas 26 horas.
const cronEmDia = c => Boolean(c.ultima) && Date.now() - new Date(c.ultima).getTime() < 26 * 3600 * 1000;

function linhasDoSite(saude) {
  const itens = [];
  const voz = saude.voz || {};
  itens.push(linhaIcone('mic', 'tom-ok',
    voz.usd == null ? 'Voz: não consegui medir agora' : `Voz neste mês: ${dolares(voz.usd)} de ${dolares(voz.tetoUsd)}`,
    voz.minutos == null ? 'O freio de gasto usa esta medição' : `${numero(voz.minutos)} min em ligações · teto por aluno: 60 min no Super`));
  const crons = saude.crons || [];
  const emDia = crons.filter(cronEmDia).length;
  itens.push(linhaIcone('sino', emDia === crons.length ? 'tom-ok' : 'tom-atencao',
    `Tarefas automáticas: ${emDia} de ${crons.length} rodaram nas últimas 24h`,
    crons.map(c => `${c.horario} ${c.ok === false ? '(falhou)' : ''}`.trim()).join(' · ')));
  const k = saude.kiwify || {};
  itens.push(k.eventos
    ? linhaIcone('carteira', 'tom-ok', `Kiwify: ${numero(k.eventos)} aviso(s) de compra`, `último ${quandoFoi(k.ultima)}`)
    : linhaIcone('alerta', 'tom-atencao', 'Kiwify: nenhuma venda registrada', 'O site nunca recebeu um aviso de compra'));
  return el('ul', { class: 'lista' }, itens);
}

// ══ HOJE ══════════════════════════════════════════════════════════════════
async function telaHoje() {
  const S = 'secao-hoje';
  if (!$(S).childElementCount) carregando(S);
  let alunos, resumo, saude;
  try {
    [alunos, resumo, saude] = await Promise.all([
      carregar('alunos', '/api/admin/students'), carregar('brief', '/api/admin/brief'), carregar('saude', '/api/admin/saude'),
    ]);
  } catch (e) { return mostrarErro(S, e, telaHoje); }
  if (!aindaEm('hoje')) return;

  const r = alunos.summary || {};
  const kpis = el('div', { class: 'kpis' },
    kpi(r.activeToday, 'Praticaram hoje', `de ${numero(r.total)} alunos`),
    kpi(r.idle, 'Sumidos', 'sem praticar há dias'),
    kpi(r.neverStarted, 'Nunca começaram', r.neverStarted ? 'ainda sem a 1ª aula' : 'todos já começaram', r.neverStarted > 0),
    kpi(r.withPush, 'Com notificação', 'recebem os avisos'));

  const b = resumo && !resumo.missing ? (resumo.brief || {}) : null;
  const cartaoYara = el('div', { class: 'cartao cartao--escuro' },
    el('p', { class: 'cartao__rotulo' }, icone('brilho', 18), b ? `Resumo da Yara · ${quandoFoi(resumo.generatedAt || null)}` : 'Resumo da Yara'),
    b
      ? [el('p', { class: 'manchete', text: String(b.manchete || '') }),
        el('ol', { class: 'acoes-yara' }, (Array.isArray(b.acoes) ? b.acoes : []).slice(0, 4).map(t => el('li', { text: String(t) }))),
        b.animo ? el('p', { style: 'margin:0;font-size:13px;color:#DCDFE4', text: String(b.animo) }) : null]
      : el('p', { class: 'manchete', style: 'font-size:16px', text: 'O resumo de hoje sai às 06:00. Enquanto isso, os números da turma estão acima.' }));

  const precisam = (alunos.students || [])
    .filter(a => a.status !== 'active_today')
    .sort((x, y) => (x.status === 'never_started' ? 0 : 1) - (y.status === 'never_started' ? 0 : 1) || (y.daysSincePractice || 0) - (x.daysSincePractice || 0))
    .slice(0, 3);

  montar(S,
    bloco('A turma hoje', null, kpis),
    cartaoYara,
    bloco('Quem precisa de você', { href: '#alunos', texto: 'Ver todos' },
      precisam.length ? el('ul', { class: 'lista' }, precisam.map(a => linhaDeAluno(a, true)))
        : el('p', { class: 'vazio', text: 'Todo mundo praticou hoje.' })),
    bloco('O site', null, linhasDoSite(saude)));
}

// ══ ALUNOS ════════════════════════════════════════════════════════════════
const estadoAlunos = { filtro: 'todos', busca: '' };
const FILTROS = [
  ['todos', 'Todos', () => true],
  ['never_started', 'Nunca começaram', a => a.status === 'never_started'],
  ['idle', 'Sumidos', a => a.status === 'idle'],
  ['active_today', 'Hoje', a => a.status === 'active_today'],
];

async function telaAlunos() {
  const S = 'secao-alunos';
  if (!$(S).childElementCount) carregando(S);
  let alunos;
  try { alunos = await carregar('alunos', '/api/admin/students'); } catch (e) { return mostrarErro(S, e, telaAlunos); }
  if (!aindaEm('alunos')) return;
  const todos = alunos.students || [];

  const lista = el('ul', { class: 'lista' });
  const contador = el('p', { class: 'vazio' });
  const desenharLista = () => {
    const [, , teste] = FILTROS.find(f => f[0] === estadoAlunos.filtro) || FILTROS[0];
    const termo = semAcento(estadoAlunos.busca).trim();
    const vistos = todos.filter(teste).filter(a => !termo || semAcento(`${a.name} ${a.email}`).includes(termo));
    lista.textContent = '';
    for (const a of vistos) lista.appendChild(linhaDeAluno(a, false));
    lista.classList.toggle('hidden', !vistos.length);
    contador.textContent = vistos.length ? `${vistos.length} de ${todos.length} alunos` : 'Nenhum aluno com esse filtro.';
  };

  const filtros = el('div', { class: 'filtros', role: 'group', 'aria-label': 'Filtrar alunos' },
    FILTROS.map(([id, rotulo, teste]) => el('button', {
      type: 'button', class: 'filtro', 'aria-pressed': String(estadoAlunos.filtro === id),
      text: `${rotulo} ${todos.filter(teste).length}`,
      onclick: ev => {
        estadoAlunos.filtro = id;
        for (const b of filtros.querySelectorAll('.filtro')) b.setAttribute('aria-pressed', String(b === ev.currentTarget));
        desenharLista();
      },
    })));

  const campoBusca = el('input', { id: 'busca-aluno', type: 'search', placeholder: 'Buscar por nome ou e-mail', value: estadoAlunos.busca,
    oninput: ev => { estadoAlunos.busca = ev.target.value; desenharLista(); } });

  montar(S,
    el('p', { class: 'secao__sub', text: `${todos.length} alunos` }),
    el('label', { class: 'busca', for: 'busca-aluno' }, icone('busca'), el('span', { class: 'so-leitor', text: 'Buscar aluno' }), campoBusca),
    filtros, lista, contador,
    el('a', { class: 'botao', href: '#dinheiro' }, icone('mais', 16), 'Dar cortesia a um e-mail novo'));
  desenharLista();
}

// ══ FICHA DO ALUNO ════════════════════════════════════════════════════════
async function telaAluno(id) {
  const S = 'secao-aluno';
  carregando(S);
  if (!id) { location.hash = '#alunos'; return; }
  let f;
  try { f = await carregar('aluno:' + id, '/api/admin/aluno?id=' + encodeURIComponent(id)); }
  catch (e) {
    if (e.status === 404) return montar(S, voltarParaAlunos(), el('p', { class: 'aviso', text: 'Aluno não encontrado.' }));
    return mostrarErro(S, e, () => telaAluno(id));
  }
  if (!aindaEm('aluno')) return;
  const a = f.aluno || {};
  $('topo-titulo').textContent = primeiroNome(a.name) || 'Aluno';
  const st = STATUS[a.status] || STATUS.idle;
  const p = f.plano || {};
  const semPrazo = !p.expira || new Date(p.expira).getFullYear() >= 2090;
  const rotuloPlano = `${ROTULOS.plano[p.plano] || p.plano}${p.cortesia ? ' · cortesia' : ''}${p.plano !== 'free' ? (semPrazo ? ' sem prazo' : ` até ${dataCurta(p.expira)}`) : ''}`;

  const cabecalho = el('div', { class: 'cartao' },
    el('div', { style: 'display:flex;align-items:center;gap:14px' },
      el('span', { class: `avatar avatar--grande ${st.tom}`, 'aria-hidden': 'true', text: iniciais(a.name) }),
      el('div', { style: 'display:flex;flex-direction:column;gap:2px;min-width:0' },
        el('h2', { style: 'margin:0;font-size:22px;font-weight:800', text: a.name }),
        el('span', { class: 'nota-meta', style: 'overflow-wrap:anywhere', text: `${a.email}${a.criadoEm ? ` · aluno desde ${dataLonga(a.criadoEm)}` : ''}` }))),
    el('div', { class: 'selos' },
      el('span', { class: 'selo tom-neutro', text: rotuloPlano }),
      el('span', { class: `selo ${st.tom}`, text: a.status === 'idle' && a.daysSincePractice != null ? `Sumido há ${a.daysSincePractice} dias` : st.selo })));

  // Ações: cada uma abre o seu painel logo abaixo da grade (um por vez).
  const painel = el('div', { class: 'hidden' });
  const abrirPainel = conteudo => { painel.textContent = ''; painel.appendChild(conteudo); painel.classList.remove('hidden'); };
  const acoes = el('div', { class: 'grade-acoes' },
    el('a', { class: 'botao botao--principal', href: linkWhatsApp(mensagemPara(a)), target: '_blank', rel: 'noopener' }, icone('chat'), 'WhatsApp'),
    el('button', { type: 'button', class: 'botao', onclick: () => abrirPainel(painelLink(a)) }, icone('link'), 'Link de acesso'),
    el('button', { type: 'button', class: 'botao', onclick: () => abrirPainel(painelSenha(a)) }, icone('chave'), 'Definir senha'),
    el('button', { type: 'button', class: 'botao', onclick: () => abrirPainel(painelPlano(a, p)) }, icone('carteira'), 'Mudar plano'));

  const pr = f.progresso || {};
  const voz = f.voz || {};
  const praticados = (pr.dias || []).filter(d => d.praticou).length;
  const progresso = el('div', { class: 'cartao' },
    el('h2', { text: 'Progresso' }),
    el('div', { class: 'numeros' },
      el('div', null, el('strong', { text: numero(a.xp) }), el('span', { text: 'XP' })),
      el('div', null, el('strong', { text: `${numero(a.streakDays)} dia${a.streakDays === 1 ? '' : 's'}` }), el('span', { text: 'sequência' })),
      el('div', null, el('strong', { text: a.lastPractice ? dataCurta(a.lastPractice) : '—' }), el('span', { text: 'última prática' }))),
    el('div', { class: 'numeros' },
      el('div', null, el('strong', { text: numero(pr.aulas) }), el('span', { text: 'aulas concluídas' })),
      el('div', null, el('strong', { text: numero(pr.minis) }), el('span', { text: 'mini-aulas' })),
      el('div', null, el('strong', { text: numero(pr.medalhas) }), el('span', { text: 'medalhas' }))),
    el('div', { style: 'display:flex;flex-direction:column;gap:6px' },
      el('span', { class: 'campo__rotulo', text: 'Dias com prática · últimas 2 semanas' }),
      el('div', { class: 'dias', role: 'img', 'aria-label': `Praticou em ${praticados} dos últimos 14 dias` },
        (pr.dias || []).map(d => el('span', { class: d.praticou ? 'praticou' : null, title: dataCurta(d.dia) })))),
    voz.cota > 0
      ? el('div', { class: 'divisor', style: 'display:flex;flex-direction:column;gap:8px' },
        el('div', { style: 'display:flex;align-items:center;gap:10px;font-size:14px;font-weight:600' }, icone('mic'),
          voz.minutos == null ? 'Voz neste mês: sem medição agora' : `Voz neste mês: ${numero(voz.minutos)} de ${voz.cota} min`),
        el('div', { class: 'barra', role: 'img', 'aria-label': `${numero(voz.minutos || 0)} de ${voz.cota} minutos` },
          el('span', { style: `width:${Math.min(100, Math.round(((voz.minutos || 0) / voz.cota) * 100))}%` })))
      : el('p', { class: 'vazio divisor', text: 'O plano dele não tem conversa por voz.' }));

  const perfil = f.perfil || {};
  const lista = (vals, mapa) => (vals || []).map(v => mapa[v]).filter(Boolean).join(', ');
  const linhasPerfil = [
    ['Nível', ROTULOS.nivel[perfil.nivel]],
    ['Aprende para', lista(perfil.objetivos, ROTULOS.objetivos)],
    ['Gosta de', lista(perfil.gostos, ROTULOS.gostos)],
    ['Nas palavras', perfil.detalhe ? `“${perfil.detalhe}”` : ''],
  ].filter(([, v]) => v);
  const memoria = f.memoria || [];
  const sabe = el('div', { class: 'cartao' },
    el('h2', { text: 'O que a Yara sabe' }),
    linhasPerfil.length
      ? el('dl', { class: 'dl' }, linhasPerfil.map(([k, v]) => [el('dt', { text: k }), el('dd', { text: v })]))
      : el('p', { class: 'vazio', text: 'Ainda não respondeu o "Sobre mim".' }),
    el('div', { class: 'divisor', style: 'display:flex;flex-direction:column;gap:10px' },
      el('p', { class: 'cartao__rotulo', style: 'color:var(--destaque)' }, icone('brilho', 16), 'Das conversas com a Yara'),
      memoria.length
        ? el('ul', { class: 'itens' }, memoria.slice().reverse().map(m => el('li', null, el('span', { class: 'itens__texto' },
          el('span', { text: m.texto }),
          el('span', { class: 'nota-meta', text: [ROTULOS.tipoFato[m.tipo] || m.tipo, dataCurta(m.em), m.canal === 'texto' ? 'chat' : 'ligação'].filter(Boolean).join(' · ') })))))
        : el('p', { class: 'vazio', text: 'A Yara ainda não anotou nada das conversas.' })));

  montar(S, voltarParaAlunos(), cabecalho, acoes, painel, progresso, sabe, cartaoNotas(a.id, f.notas || []));
}

const voltarParaAlunos = () => el('a', { class: 'voltar', href: '#alunos' }, icone('voltar', 20), 'Alunos');

function painelLink(a) {
  const saida = el('div', { style: 'display:flex;flex-direction:column;gap:8px' });
  const gerar = el('button', { type: 'button', class: 'botao botao--escuro', text: 'Gerar link agora', onclick: async () => {
    gerar.disabled = true; gerar.textContent = 'Gerando…';
    try {
      const r = await postar('/api/admin/login-link', { email: a.email });
      const hash = (String(r.loginUrl || '').match(/token_hash=([a-f0-9]+)/i) || [])[1];
      const link = hash ? `${location.origin}/entrar.html?t=${hash}` : String(r.loginUrl || '');
      saida.textContent = '';
      saida.append(
        el('p', { class: 'aviso aviso--ok', text: 'Link pronto. Ele vale UMA vez: mande agora.' }),
        el('p', { class: 'nota-meta', style: 'overflow-wrap:anywhere', text: link }),
        el('div', { class: 'painel__acoes' },
          el('button', { type: 'button', class: 'botao botao--pequeno', text: 'Copiar', onclick: async () => toast(await copiar(link) ? 'Link copiado.' : 'Não consegui copiar.') }),
          el('a', { class: 'botao botao--pequeno botao--principal', href: linkWhatsApp(`Oi, ${primeiroNome(a.name)}! Seu acesso à Capy English: ${link}`), target: '_blank', rel: 'noopener' }, icone('chat', 16), 'Mandar no WhatsApp')));
    } catch (e) {
      if (e.message !== 'unauthorized') toast(e.message === 'conta_nao_encontrada' ? 'Esse e-mail não tem conta.' : 'Não consegui gerar o link.', 'erro');
    } finally { gerar.disabled = false; gerar.textContent = 'Gerar outro link'; }
  } });
  return el('div', { class: 'painel' },
    el('strong', { text: 'Link de acesso' }),
    el('p', { class: 'vazio', text: 'O aluno entra sem senha e sem e-mail. Use quando ele não consegue entrar.' }),
    gerar, saida);
}

function painelSenha(a) {
  const campo = el('input', { id: 'nova-senha', type: 'text', autocomplete: 'new-password', minlength: '8', placeholder: 'mínimo 8 caracteres' });
  const botao = el('button', { type: 'button', class: 'botao botao--escuro', text: 'Definir senha', onclick: async () => {
    const senha = campo.value;
    if (senha.length < 8) { toast('A senha precisa ter pelo menos 8 caracteres.', 'erro'); return; }
    botao.disabled = true;
    try {
      await postar('/api/admin/set-password', { email: a.email, password: senha });
      campo.value = '';
      toast('Senha definida. Passe o e-mail e a senha para o aluno.');
    } catch (e) {
      if (e.message !== 'unauthorized') toast((e.corpo && e.corpo.message) || 'Não consegui definir a senha.', 'erro');
    } finally { botao.disabled = false; }
  } });
  return el('div', { class: 'painel' },
    el('strong', { text: 'Definir senha' }),
    el('p', { class: 'vazio', text: 'Você escolhe a senha e passa para o aluno. Ele entra com e-mail e senha na tela de login.' }),
    el('div', { class: 'campo' }, el('label', { for: 'nova-senha', text: 'Nova senha' }), campo),
    botao);
}

function painelPlano(a, p) {
  const plano = el('select', { id: 'novo-plano' },
    ['super', 'pro', 'free'].map(v => el('option', { value: v, selected: v === p.plano, text: ROTULOS.plano[v] })));
  const prazo = el('select', { id: 'novo-prazo' },
    [['', 'Sem prazo'], ['30', '30 dias'], ['90', '90 dias'], ['365', '1 ano']].map(([v, t]) => el('option', { value: v, text: t })));
  const botao = el('button', { type: 'button', class: 'botao botao--escuro', text: 'Salvar plano', onclick: async () => {
    botao.disabled = true;
    try {
      if (plano.value === 'free') {
        if (!window.confirm(`Tirar o plano de ${a.name}? Ele volta para o Grátis.`)) return;
        await postar('/api/admin/revoke-plan', { email: a.email });
      } else {
        const corpo = { email: a.email, plan: plano.value };
        if (prazo.value) corpo.expiresAt = new Date(Date.now() + Number(prazo.value) * 86400000).toISOString();
        await postar('/api/admin/grant-plan', corpo);
      }
      toast('Plano atualizado.');
      esquecer('aluno:' + a.id, 'alunos', 'visao', 'cortesias');
      telaAluno(a.id);
    } catch (e) {
      if (e.message !== 'unauthorized') toast('Não consegui mudar o plano.', 'erro');
    } finally { botao.disabled = false; }
  } });
  return el('div', { class: 'painel' },
    el('strong', { text: 'Mudar plano' }),
    el('div', { class: 'linha-campos' },
      el('div', { class: 'campo' }, el('label', { for: 'novo-plano', text: 'Plano' }), plano),
      el('div', { class: 'campo' }, el('label', { for: 'novo-prazo', text: 'Prazo' }), prazo)),
    botao);
}

function cartaoNotas(alunoId, notasIniciais) {
  let notas = notasIniciais;
  const lista = el('ul', { class: 'itens' });
  const desenhar = () => {
    lista.textContent = '';
    for (const n of notas) {
      lista.appendChild(el('li', { class: 'divisor', style: 'padding-top:10px' },
        el('span', { class: 'itens__texto' }, el('span', { text: n.texto }), el('span', { class: 'nota-meta', text: `você · ${dataCurta(n.em)}` })),
        el('button', { type: 'button', class: 'botao botao--pequeno botao--perigo', text: 'Apagar', 'aria-label': 'Apagar anotação',
          onclick: async () => {
            if (!window.confirm('Apagar esta anotação?')) return;
            try {
              notas = (await postar('/api/admin/notas/apagar', { aluno: alunoId, id: n.id })).notas || [];
              esquecer('aluno:' + alunoId);
              desenhar();
            } catch (e) { if (e.message !== 'unauthorized') toast('Não consegui apagar.', 'erro'); }
          } })));
    }
  };
  const texto = el('textarea', { id: 'nova-nota', rows: '3', maxlength: '1000', placeholder: 'Ex.: disse que trava no listening; ligar na quinta' });
  const salvar = el('button', { type: 'button', class: 'botao botao--escuro', style: 'align-self:flex-start', text: 'Salvar anotação', onclick: async () => {
    const t = texto.value.trim();
    if (!t) { texto.focus(); return; }
    salvar.disabled = true;
    try {
      notas = (await postar('/api/admin/notas', { aluno: alunoId, texto: t })).notas || [];
      texto.value = '';
      esquecer('aluno:' + alunoId);
      desenhar();
      toast('Anotação salva.');
    } catch (e) { if (e.message !== 'unauthorized') toast('Não consegui salvar.', 'erro'); }
    finally { salvar.disabled = false; }
  } });
  desenhar();
  return el('div', { class: 'cartao' },
    el('h2', { text: 'Suas anotações' }),
    el('p', { class: 'vazio', text: 'Só você vê. Para a conversa de retenção: o que aconteceu, onde travou, o que ele sentiu.' }),
    el('div', { class: 'campo' }, el('label', { for: 'nova-nota', text: 'Nova anotação' }), texto),
    salvar, lista);
}

// ══ CONTEÚDO ══════════════════════════════════════════════════════════════
async function telaConteudo() {
  const S = 'secao-conteudo';
  if (!$(S).childElementCount) carregando(S);
  let funil, conteudo, saude;
  try {
    [funil, conteudo, saude] = await Promise.all([
      carregar('funil', '/api/admin/funnel?days=7'), carregar('conteudo', '/api/admin/conteudo'), carregar('saude', '/api/admin/saude'),
    ]);
  } catch (e) { return mostrarErro(S, e, telaConteudo); }
  if (!aindaEm('conteudo')) return;

  const t = funil.totals || {};
  const etapas = [['Começaram', t.mini_start || 0], ['Terminaram', t.mini_complete || 0], ['Fizeram o quiz', t.quiz_finish || 0]];
  const maior = Math.max(1, ...etapas.map(e => e[1]));
  const comecaram = t.mini_start || 0;
  const pararam = comecaram ? Math.max(0, comecaram - (t.mini_complete || 0)) : 0;
  const cartaoFunil = el('div', { class: 'cartao' },
    el('div', { class: 'bloco__topo' }, el('h2', { text: 'Mini-aulas nesta semana' }), el('span', { class: 'nota-meta', text: 'últimos 7 dias' })),
    el('div', { class: 'funil' }, etapas.map(([rotulo, n]) => el('div', { class: 'funil__linha' },
      el('div', { class: 'funil__rotulo' }, el('span', { text: rotulo }), el('span', { text: numero(n) })),
      el('div', { class: 'barra barra--grossa barra--navy' }, el('span', { style: `width:${Math.round((n / maior) * 100)}%` }))))),
    comecaram
      ? el('p', { class: pararam / comecaram > 0.5 ? 'aviso' : 'aviso aviso--ok', text: `${pararam} de ${comecaram} pararam no meio da mini-aula.` })
      : el('p', { class: 'vazio', text: 'Ninguém começou uma mini-aula nesta semana.' }));

  const cursos = conteudo.cursos || [];
  const crons = saude.crons || [];
  montar(S,
    el('p', { class: 'secao__sub', text: 'Cursos, aulas e o que os alunos fazem com elas' }),
    cartaoFunil,
    bloco('Cursos', null, el('ul', { class: 'lista' }, cursos.map(c => el('li', null, el('div', { class: 'linha linha--compacta' },
      el('span', { class: 'linha__texto' }, el('span', { class: 'linha__titulo', text: c.nome }), el('span', { class: 'linha__sub', text: c.legenda })),
      el('span', { class: 'selo tom-neutro', text: `${numero(c.aulas)} aulas` }))))),
      el('p', { class: 'vazio', text: `${numero(cursos.reduce((s, c) => s + c.aulas, 0))} aulas no total, contadas das próprias páginas.` })),
    bloco('Tarefas automáticas', null, el('ul', { class: 'lista' }, crons.map(c => el('li', null, el('div', { class: 'linha linha--compacta' },
      el('span', { class: 'linha__texto' }, el('span', { class: 'linha__titulo', style: 'white-space:normal', text: c.rotulo }),
        el('span', { class: 'linha__sub', text: `todo dia às ${c.horario} · última vez: ${quandoFoi(c.ultima)}${c.detalhe ? ` · ${c.detalhe}` : ''}` })),
      el('span', { class: `selo ${c.ok === false ? 'tom-erro' : cronEmDia(c) ? 'tom-ok' : 'tom-atencao'}`, text: c.ok === false ? 'falhou' : cronEmDia(c) ? 'em dia' : 'atrasada' })))))));
}

// ══ DINHEIRO ══════════════════════════════════════════════════════════════
async function telaDinheiro() {
  const S = 'secao-dinheiro';
  if (!$(S).childElementCount) carregando(S);
  let metas, visao, cortesias, saude;
  try {
    [metas, visao, cortesias, saude] = await Promise.all([
      carregar('metas', '/api/admin/goals'), carregar('visao', '/api/admin/overview'),
      carregar('cortesias', '/api/admin/courtesies'), carregar('saude', '/api/admin/saude'),
    ]);
  } catch (e) { return mostrarErro(S, e, telaDinheiro); }
  if (!aindaEm('dinheiro')) return;

  const mes = hojeISO().slice(0, 7);
  const lancamentos = Array.isArray(metas.manualRevenue) ? metas.manualRevenue : [];
  const receita = lancamentos.filter(l => l.month === mes).reduce((s, l) => s + (Number(l.amount) || 0), 0);
  const alvo = Number(metas.monthlyRevenueTarget) || 0;
  const planos = visao.plans || {};
  const nCortesias = (cortesias.courtesies || []).length;
  const pagantes = Math.max(0, (planos.pro || 0) + (planos.super || 0) - nCortesias);
  const vencendo = (cortesias.courtesies || []).filter(c => c.expiresAt && new Date(c.expiresAt) - Date.now() < 30 * 86400000).length;
  const nomeMes = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric', timeZone: FUSO });

  const editar = el('div', { class: 'hidden' });
  const cartaoMeta = el('div', { class: 'cartao cartao--escuro' },
    el('p', { class: 'cartao__rotulo', text: 'Meta do mês' }),
    el('div', { style: 'display:flex;align-items:baseline;gap:8px' },
      el('span', { style: 'font-size:34px;font-weight:800;letter-spacing:-.02em', text: reais(receita) }),
      el('span', { style: 'font-size:15px;color:#DCDFE4', text: alvo ? `de ${reais(alvo)}` : 'sem meta definida' })),
    el('div', { class: 'barra barra--grossa', role: 'img', 'aria-label': `${alvo ? Math.round((receita / alvo) * 100) : 0}% da meta` },
      el('span', { style: `width:${alvo ? Math.min(100, Math.max(2, Math.round((receita / alvo) * 100))) : 0}%` })),
    el('div', { style: 'display:flex;justify-content:space-between;gap:12px;font-size:13px;color:#DCDFE4' },
      el('span', { text: `${pagantes} de ${numero(metas.studentsTarget || 0)} alunos pagantes` }),
      el('button', { type: 'button', class: 'botao botao--pequeno', text: 'Mudar meta', onclick: () => {
        editar.textContent = '';
        editar.appendChild(painelMeta(metas));
        editar.classList.toggle('hidden');
      } })));

  const cartaoPlanos = el('div', { class: 'cartao' },
    el('h2', { text: 'Quem paga o quê' }),
    el('div', { class: 'numeros numeros--caixas' },
      el('div', null, el('strong', { text: numero(pagantes) }), el('span', { text: 'pagando' })),
      el('div', null, el('strong', { text: numero(nCortesias) }), el('span', { text: 'cortesia' })),
      el('div', null, el('strong', { text: numero(vencendo) }), el('span', { text: 'vencendo em 30 dias' }))),
    el('div', { class: 'painel' }, el('strong', { text: 'Dar cortesia' }), formCortesia()));

  const k = saude.kiwify || {};
  const cartaoVendas = el('div', { class: 'cartao' },
    el('h2', { text: 'Vendas pela Kiwify' }),
    k.eventos
      ? el('p', { class: 'aviso aviso--ok', text: `${numero(k.eventos)} aviso(s) de compra recebido(s). O último ${quandoFoi(k.ultima)}.` })
      : el('p', { class: 'aviso', text: 'Nenhuma compra chegou ao site até hoje. Antes de anunciar, vale uma compra de teste para ver se o plano é liberado sozinho.' }),
    lancamentos.length ? el('ul', { class: 'itens' }, lancamentos.slice(-6).reverse().map(l => el('li', null,
      el('span', { class: 'itens__texto' }, el('span', { text: `${reais(l.amount)}${l.note ? ` · ${l.note}` : ''}` }), el('span', { class: 'nota-meta', text: l.month }))))) : null,
    painelReceita(metas));

  const voz = saude.voz || {};
  const pctVoz = voz.usd != null && voz.tetoUsd ? Math.min(100, Math.round((voz.usd / voz.tetoUsd) * 100)) : 0;
  const cartaoCustos = el('div', { class: 'cartao' },
    el('h2', { text: 'Custos de IA' }),
    el('div', { style: 'display:flex;flex-direction:column;gap:6px' },
      el('div', { class: 'linha--dupla', style: 'display:flex' }, el('span', { text: 'Voz (ligações)' }),
        el('strong', { text: voz.usd == null ? 'sem medição' : `${dolares(voz.usd)} de ${dolares(voz.tetoUsd)}` })),
      el('div', { class: 'barra', role: 'img', 'aria-label': `${pctVoz}% do teto de voz` }, el('span', { style: `width:${Math.max(1, pctVoz)}%` })),
      el('span', { class: 'nota-meta', text: 'Teto por aluno: 60 min no Super. Passou do teto do site, a voz pausa sozinha.' })),
    el('div', { class: 'divisor linha--dupla', style: 'display:flex' }, el('span', { text: 'Texto (chat, correções, resumo)' }),
      el('span', { class: 'nota-meta', style: 'font-weight:600', text: 'sem medição' })));

  montar(S,
    el('p', { class: 'secao__sub', text: nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1) }),
    cartaoMeta, editar, cartaoPlanos, cartaoVendas, cartaoCustos);
}

function painelMeta(metas) {
  const valor = el('input', { id: 'meta-valor', type: 'number', min: '0', step: '1', value: String(metas.monthlyRevenueTarget || 0) });
  const alunos = el('input', { id: 'meta-alunos', type: 'number', min: '0', step: '1', value: String(metas.studentsTarget || 0) });
  const botao = el('button', { type: 'button', class: 'botao botao--escuro', text: 'Salvar meta', onclick: async () => {
    botao.disabled = true;
    try {
      await postar('/api/admin/goals', { ...metas, monthlyRevenueTarget: Number(valor.value) || 0, studentsTarget: Number(alunos.value) || 0 });
      esquecer('metas');
      toast('Meta salva.');
      telaDinheiro();
    } catch (e) { if (e.message !== 'unauthorized') toast('Não consegui salvar a meta.', 'erro'); }
    finally { botao.disabled = false; }
  } });
  return el('div', { class: 'cartao' },
    el('div', { class: 'linha-campos' },
      el('div', { class: 'campo' }, el('label', { for: 'meta-valor', text: 'Receita do mês (R$)' }), valor),
      el('div', { class: 'campo' }, el('label', { for: 'meta-alunos', text: 'Alunos pagantes' }), alunos)),
    botao);
}

function painelReceita(metas) {
  const valor = el('input', { id: 'receita-valor', type: 'number', min: '0', step: '0.01', placeholder: '0,00' });
  const nota = el('input', { id: 'receita-nota', type: 'text', maxlength: '200', placeholder: 'Ex.: aula particular da Ana' });
  const botao = el('button', { type: 'button', class: 'botao', text: 'Lançar receita à mão', onclick: async () => {
    const quanto = Number(valor.value);
    if (!(quanto > 0)) { valor.focus(); return; }
    botao.disabled = true;
    try {
      const lancamentos = [...(Array.isArray(metas.manualRevenue) ? metas.manualRevenue : []), { month: hojeISO().slice(0, 7), amount: quanto, note: nota.value.trim() }];
      await postar('/api/admin/goals', { ...metas, manualRevenue: lancamentos });
      esquecer('metas');
      toast('Receita lançada.');
      telaDinheiro();
    } catch (e) { if (e.message !== 'unauthorized') toast('Não consegui lançar.', 'erro'); }
    finally { botao.disabled = false; }
  } });
  return el('div', { class: 'painel' },
    el('div', { class: 'linha-campos' },
      el('div', { class: 'campo' }, el('label', { for: 'receita-valor', text: 'Valor (R$)' }), valor),
      el('div', { class: 'campo' }, el('label', { for: 'receita-nota', text: 'De quê' }), nota)),
    botao);
}

function formCortesia() {
  const email = el('input', { id: 'cortesia-email', type: 'email', autocomplete: 'off', placeholder: 'email@do-aluno.com' });
  const saida = el('div', { style: 'display:flex;flex-direction:column;gap:8px' });
  const botao = el('button', { type: 'button', class: 'botao botao--escuro', text: 'Dar Super sem prazo', onclick: async () => {
    const e = email.value.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) { toast('Confira o e-mail.', 'erro'); return; }
    botao.disabled = true;
    try {
      const r = await postar('/api/admin/grant-plan', { email: e, plan: 'super' });
      esquecer('alunos', 'visao', 'cortesias');
      saida.textContent = '';
      saida.appendChild(el('p', { class: 'aviso aviso--ok', text: `${e} agora está no Super${r.accountCreated ? ' (conta criada agora)' : ''}.` }));
      const hash = (String(r.loginUrl || '').match(/token_hash=([a-f0-9]+)/i) || [])[1];
      if (hash) {
        const link = `${location.origin}/entrar.html?t=${hash}`;
        saida.appendChild(el('a', { class: 'botao botao--pequeno botao--principal', href: linkWhatsApp(`Oi! Seu acesso à Capy English: ${link}`), target: '_blank', rel: 'noopener' }, icone('chat', 16), 'Mandar o link de acesso'));
      }
      email.value = '';
    } catch (err) { if (err.message !== 'unauthorized') toast('Não consegui dar a cortesia.', 'erro'); }
    finally { botao.disabled = false; }
  } });
  return el('div', { style: 'display:flex;flex-direction:column;gap:10px' },
    el('div', { class: 'campo' }, el('label', { for: 'cortesia-email', text: 'E-mail do aluno' }), email), botao, saida);
}

// ══ AVISOS ════════════════════════════════════════════════════════════════
const DESTINOS = [['/learn.html', 'Trilha diária'], ['/ai_chat.html', 'Chat com a Yara'], ['/account.html', 'Minha conta']];

async function telaAvisos() {
  const S = 'secao-avisos';
  if (!$(S).childElementCount) carregando(S);
  let alunos, saude;
  try { [alunos, saude] = await Promise.all([carregar('alunos', '/api/admin/students'), carregar('saude', '/api/admin/saude')]); }
  catch (e) { return mostrarErro(S, e, telaAvisos); }
  if (!aindaEm('avisos')) return;

  const r = alunos.summary || {};
  const titulo = el('input', { id: 'aviso-titulo', type: 'text', maxlength: '60', value: 'A Yara está com saudade!' });
  const corpo = el('textarea', { id: 'aviso-corpo', rows: '3', maxlength: '140' });
  corpo.value = 'Só 5 minutinhos de inglês hoje já mantêm sua sequência viva.';
  const destino = el('select', { id: 'aviso-destino' }, DESTINOS.map(([v, t]) => el('option', { value: v, text: t })));
  const previaTitulo = el('strong'), previaCorpo = el('span');
  const atualizarPrevia = () => { previaTitulo.textContent = titulo.value || 'Título'; previaCorpo.textContent = corpo.value || 'Mensagem'; };
  titulo.addEventListener('input', atualizarPrevia);
  corpo.addEventListener('input', atualizarPrevia);
  atualizarPrevia();

  const enviar = el('button', { type: 'button', class: 'botao botao--principal botao--largo', disabled: !r.withPush,
    onclick: async () => {
      if (!titulo.value.trim() || !corpo.value.trim()) { toast('Escreva o título e a mensagem.', 'erro'); return; }
      if (!window.confirm(`Mandar este aviso para ${r.withPush} aluno(s)?`)) return;
      enviar.disabled = true;
      try {
        const res = await postar('/api/admin/broadcast', { title: titulo.value.trim(), body: corpo.value.trim(), url: destino.value });
        if (res.error === 'push_not_configured') toast('As notificações não estão configuradas no servidor.', 'erro');
        else toast(`Enviado para ${res.sent || 0} aluno(s)${res.failed ? ` · ${res.failed} falharam` : ''}.`);
      } catch (e) { if (e.message !== 'unauthorized') toast('Não consegui enviar.', 'erro'); }
      finally { enviar.disabled = false; }
    } }, icone('enviar'), r.withPush ? `Enviar para ${r.withPush} aluno${r.withPush === 1 ? '' : 's'}` : 'Ninguém recebe avisos ainda');

  const crons = saude.crons || [];
  montar(S,
    el('p', { class: 'secao__sub', text: 'Notificação no celular dos alunos' }),
    el('ul', { class: 'lista' }, linhaIcone('sino', r.withPush ? 'tom-ok' : 'tom-atencao',
      `${numero(r.withPush)} de ${numero(r.total)} alunos recebem avisos`,
      r.total - r.withPush > 0 ? `Os outros ${r.total - r.withPush} precisam ligar a notificação no app` : 'Todos ligaram a notificação')),
    el('div', { class: 'cartao' },
      el('h2', { text: 'Novo aviso' }),
      el('div', { class: 'campo' }, el('label', { for: 'aviso-titulo', text: 'Título' }), titulo),
      el('div', { class: 'campo' }, el('label', { for: 'aviso-corpo', text: 'Mensagem' }), corpo),
      el('div', { class: 'campo' }, el('label', { for: 'aviso-destino', text: 'Abrir ao tocar' }), destino),
      el('div', { class: 'campo' }, el('span', { class: 'campo__rotulo', text: 'Como chega no celular' }),
        el('div', { class: 'notificacao' }, el('span', { class: 'notificacao__icone', 'aria-hidden': 'true', text: 'C' }),
          el('span', { class: 'notificacao__texto' }, el('span', { style: 'font-size:12px;color:var(--texto-3)', text: 'Capy English · agora' }), previaTitulo, previaCorpo))),
      enviar),
    bloco('Automáticos', null, el('ul', { class: 'lista' }, crons.map(c => el('li', null, el('div', { class: 'linha linha--compacta' },
      el('span', { class: 'linha__texto' }, el('span', { class: 'linha__titulo', style: 'white-space:normal', text: c.rotulo }),
        el('span', { class: 'linha__sub', text: `todo dia às ${c.horario} · última vez: ${quandoFoi(c.ultima)}` })),
      el('span', { class: `selo ${c.ok === false ? 'tom-erro' : cronEmDia(c) ? 'tom-ok' : 'tom-atencao'}`, text: c.ok === false ? 'falhou' : cronEmDia(c) ? 'ativo' : 'atrasado' })))))));
}

const TELAS = { hoje: telaHoje, alunos: telaAlunos, aluno: telaAluno, conteudo: telaConteudo, dinheiro: telaDinheiro, avisos: telaAvisos };

// ── Boot ───────────────────────────────────────────────────────────────────
Auth.ready().then(user => {
  if (!user || user.role === 'guest') showGate('deslogado');
  else if (user.role !== 'admin') showGate('nao_admin');
  else entrarNoAdmin();
});
