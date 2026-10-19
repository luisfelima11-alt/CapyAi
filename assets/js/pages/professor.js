/* Painel do Professor (professor.html).
 * Página endurecida: nada inline, e tudo o que vem do aluno (nome, título, respostas)
 * entra na tela por textContent, nunca como HTML. O servidor só devolve os alunos que
 * entraram na turma deste professor.
 */
(function () {
  'use strict';

  const $ = id => document.getElementById(id);
  let turma = null;

  function el(tag, cls, texto) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (texto != null) e.textContent = String(texto);
    return e;
  }

  function dataCurta(iso) {
    if (!iso) return '—';
    const [a, m, d] = String(iso).slice(0, 10).split('-');
    return `${d}/${m}${a !== String(new Date().getFullYear()) ? '/' + a.slice(2) : ''}`;
  }

  function quando(dias) {
    if (dias === null || dias === undefined) return 'nunca';
    if (dias === 0) return 'hoje';
    if (dias === 1) return 'ontem';
    return `há ${dias} dias`;
  }

  const MOTIVO = {
    sumido: a => `está há ${a.diasSem} dias sem praticar`,
    nunca_praticou: () => 'ainda não praticou nenhuma vez',
    licao_atrasada: () => 'não entrega lição de casa há 7+ dias',
  };

  function estado(texto, erro) {
    const s = $('estado');
    s.hidden = false;
    s.textContent = texto;
    s.classList.toggle('erro', !!erro);
  }

  async function carregar() {
    let user = null;
    try { user = await Auth.ready(); } catch (e) {}
    if (!user || user.role === 'guest') {
      location.href = '4_Login_Capy_Yara_Welcomes_You.html?next=professor.html';
      return;
    }
    if (!['teacher', 'admin'].includes(user.role)) {
      estado('Esta conta não é de professor. Peça o acesso ao administrador.', true);
      return;
    }
    try {
      const r = await fetch('/api/professor/turma', { credentials: 'same-origin' });
      if (r.status === 403) {
        const d = await r.json().catch(() => ({}));
        estado(d.error === 'mfa_required'
          ? 'Para ver os dados dos alunos, ative a verificação em duas etapas no admin.'
          : 'Esta conta não é de professor.', true);
        return;
      }
      if (!r.ok) throw new Error(String(r.status));
      turma = await r.json();
      desenhar();
    } catch (e) {
      estado('Não deu para carregar a turma agora. Tente de novo em instantes.', true);
    }
  }

  function desenhar() {
    $('estado').hidden = true;
    $('painel').hidden = false;
    $('nome-turma').textContent = turma.nome || 'Minha turma';
    $('link-turma').value = `${location.origin}/turma.html?c=${turma.codigo}`;

    const alunos = turma.alunos || [];
    $('n-alunos').textContent = alunos.length;
    $('n-hoje').textContent = alunos.filter(a => a.trilhaHoje).length;
    $('n-sumidos').textContent = alunos.filter(a => a.alertas.includes('sumido') || a.alertas.includes('nunca_praticou')).length;
    const limite = Date.now() - 14 * 86400000;
    $('n-licoes').textContent = alunos.reduce((n, a) => n + a.licoes.filter(l => Date.parse(l.em) >= limite).length, 0);

    const lista = $('lista-alertas');
    lista.textContent = '';
    const comAlerta = alunos.filter(a => a.alertas.length);
    $('alertas').hidden = !comAlerta.length;
    for (const a of comAlerta) {
      const li = el('li');
      li.appendChild(el('strong', null, a.nome));
      li.append(' ' + a.alertas.map(k => MOTIVO[k] ? MOTIVO[k](a) : k).join(' e ') + '.');
      lista.appendChild(li);
    }

    $('vazio').hidden = alunos.length > 0;
    $('tabela').hidden = alunos.length === 0;
    preencherTabela();
  }

  function preencherTabela() {
    const termo = $('busca').value.trim().toLowerCase();
    const corpo = $('corpo');
    corpo.textContent = '';
    const alunos = (turma.alunos || [])
      .filter(a => !termo || a.nome.toLowerCase().includes(termo))
      .sort((x, y) => (y.alertas.length - x.alertas.length) || x.nome.localeCompare(y.nome));
    alunos.forEach(a => {
      const tr = el('tr');
      const nome = el('td', 'aluno');
      nome.appendChild(el('span', 'avatar', a.avatar));
      nome.appendChild(el('span', null, a.nome));
      tr.appendChild(nome);
      tr.appendChild(el('td', a.trilhaHoje ? 'ok' : 'nao', a.trilhaHoje ? `✅ ${a.minisHoje} mini${a.minisHoje === 1 ? '' : 's'}` : '— ainda não'));
      tr.appendChild(el('td', null, a.sequencia ? `🔥 ${a.sequencia}` : '0'));
      tr.appendChild(el('td', a.diasSem >= 3 || a.diasSem === null ? 'nao' : null, quando(a.diasSem)));
      const total = Object.values(a.minisPorIdioma || {}).reduce((n, v) => n + v, 0);
      tr.appendChild(el('td', null, total));
      tr.appendChild(el('td', null, a.licoes.length ? `${a.licoes.length} · última ${dataCurta(a.licoes[0].em)}` : '—'));
      const acao = el('td');
      const ver = el('button', 'botao pequeno', 'Ver');
      ver.type = 'button';
      ver.addEventListener('click', () => abrirDetalhe(a));
      acao.appendChild(ver);
      tr.appendChild(acao);
      corpo.appendChild(tr);
    });
  }

  function secao(titulo) {
    const s = el('section', 'det-secao');
    s.appendChild(el('h3', null, titulo));
    return s;
  }

  function abrirDetalhe(a) {
    $('det-nome').textContent = `${a.avatar} ${a.nome}`;
    const c = $('det-corpo');
    c.textContent = '';

    const resumo = secao('Resumo');
    const p = el('p', 'sub');
    p.textContent = `Último dia de prática: ${quando(a.diasSem)} · sequência: ${a.sequencia} dia(s) · ${a.xp} XP · na turma desde ${dataCurta(a.entrouEm)}`;
    resumo.appendChild(p);
    c.appendChild(resumo);

    const trilha = secao('Trilha diária — últimos 14 dias');
    const grade = el('div', 'dias');
    const porDia = new Map(a.dias14.map(d => [d.dia, d]));
    const hoje = new Date(turma.hoje + 'T12:00:00Z');
    for (let i = 13; i >= 0; i--) {
      const dia = new Date(hoje.getTime() - i * 86400000).toISOString().slice(0, 10);
      const d = porDia.get(dia);
      const caixa = el('div', 'dia ' + (d && d.minis > 0 ? 'feito' : d ? 'meio' : 'vazio'));
      caixa.title = `${dataCurta(dia)}: ${d ? `${d.minis} mini-lição(ões), ${d.xp} XP` : 'sem prática'}`;
      caixa.appendChild(el('span', null, dia.slice(8)));
      grade.appendChild(caixa);
    }
    trilha.appendChild(grade);
    const idiomas = Object.entries(a.minisPorIdioma || {}).map(([k, v]) => `${({ en: 'Inglês', fr: 'Francês', tr: 'Turco' })[k] || k}: ${v}`).join(' · ');
    trilha.appendChild(el('p', 'sub', `Mini-lições concluídas no total — ${idiomas || 'nenhuma ainda'}.`));
    c.appendChild(trilha);

    const lic = secao('Lições de casa dos cursos');
    if (!a.licoes.length) lic.appendChild(el('p', 'sub', 'Nenhuma entrega ainda.'));
    a.licoes.forEach(l => {
      const linha = el('div', 'licao');
      linha.appendChild(el('span', null, `${dataCurta(l.em)} · ${l.titulo || l.lessonId}`));
      const b = el('button', 'botao pequeno', 'Ler');
      b.type = 'button';
      const caixa = el('pre', 'respostas');
      caixa.hidden = true;
      b.addEventListener('click', async () => {
        if (!caixa.hidden) { caixa.hidden = true; return; }
        caixa.hidden = false;
        caixa.textContent = 'Carregando…';
        try {
          const r = await fetch('/api/professor/licao?id=' + encodeURIComponent(l.id), { credentials: 'same-origin' });
          if (!r.ok) throw new Error();
          const d = await r.json();
          caixa.textContent = formatarRespostas(d.respostas);
        } catch (e) { caixa.textContent = 'Não deu para abrir esta entrega.'; }
      });
      linha.appendChild(b);
      lic.appendChild(linha);
      lic.appendChild(caixa);
    });
    c.appendChild(lic);

    const sair = secao('Turma');
    const remover = el('button', 'botao perigo', 'Tirar da turma');
    remover.type = 'button';
    remover.addEventListener('click', async () => {
      if (!confirm(`Tirar ${a.nome} da sua turma? Você deixa de ver o progresso dele.`)) return;
      const r = await fetch('/api/professor/remover', { method: 'POST', credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ alunoId: a.id }) });
      if (r.ok) { $('detalhe').close(); carregar(); }
    });
    sair.appendChild(remover);
    c.appendChild(sair);

    $('detalhe').showModal();
  }

  // As respostas da lição de casa são um objeto livre: vira texto legível, sem HTML.
  function formatarRespostas(obj, prefixo = '') {
    if (obj == null) return '(vazio)';
    if (typeof obj !== 'object') return String(obj);
    const linhas = [];
    for (const [k, v] of Object.entries(obj)) {
      if (v && typeof v === 'object') linhas.push(`${prefixo}${k}:\n${formatarRespostas(v, prefixo + '  ')}`);
      else linhas.push(`${prefixo}${k}: ${v}`);
    }
    return linhas.join('\n') || '(vazio)';
  }

  $('btn-sair').addEventListener('click', () => Auth.logout());
  $('busca').addEventListener('input', preencherTabela);
  $('det-fechar').addEventListener('click', () => $('detalhe').close());
  $('btn-copiar').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText($('link-turma').value); $('btn-copiar').textContent = 'Copiado!'; }
    catch (e) { $('link-turma').select(); }
    setTimeout(() => { $('btn-copiar').textContent = 'Copiar'; }, 2000);
  });
  $('btn-whats').addEventListener('click', () => {
    const msg = `Entre na minha turma no Capy English para eu acompanhar seu progresso: ${$('link-turma').value}`;
    window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  });

  carregar();
})();
