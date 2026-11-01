/* Entrar na turma do professor (turma.html?c=<código>).
 * O aluno vê quem é o professor e o que ele vai poder ver, e só entra se aceitar
 * (consentimento, LGPD). Pode sair pela mesma página.
 */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const codigo = (new URLSearchParams(location.search).get('c') || '').toLowerCase();

  function botao(texto, classe, acao) {
    const b = document.createElement(acao ? 'button' : 'a');
    b.className = 'botao ' + (classe || '');
    b.textContent = texto;
    if (acao) { b.type = 'button'; b.addEventListener('click', acao); }
    return b;
  }

  function mostrar(texto, detalhe, botoes) {
    $('texto').textContent = texto;
    $('detalhe').textContent = detalhe || '';
    const a = $('acoes');
    a.textContent = '';
    (botoes || []).forEach(b => a.appendChild(b));
  }

  async function enviar(rota) {
    const r = await fetch(rota, { method: 'POST', credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ codigo }) });
    return r.ok;
  }

  async function iniciar() {
    if (!/^[a-z0-9]{8}$/.test(codigo)) { mostrar('Link de turma inválido.', 'Peça o link de novo ao seu professor.'); return; }
    let user = null;
    try { user = await Auth.ready(); } catch (e) {}
    if (!user || user.role === 'guest') {
      const voltar = encodeURIComponent('turma.html?c=' + codigo);
      const entrar = botao('Entrar ou criar conta', 'rosa');
      entrar.href = '4_Login_Capy_Yara_Welcomes_You.html?next=' + voltar;
      mostrar('Para entrar na turma, entre na sua conta.', 'O professor acompanha o progresso pela sua conta, então visitante não pode entrar.', [entrar]);
      return;
    }
    const r = await fetch('/api/turma?c=' + codigo, { credentials: 'same-origin' });
    if (r.status === 404) { mostrar('Essa turma não existe mais.', 'Peça o link de novo ao seu professor.'); return; }
    if (!r.ok) { mostrar('Não deu para abrir a turma agora.', 'Tente de novo em instantes.'); return; }
    const t = await r.json();
    const inicio = botao('Ir para o início', '');
    inicio.href = '6_Home_Forest_Expedition.html';
    if (t.proprio) { mostrar('Esta é a sua própria turma.', 'Mande o link para os seus alunos.', [inicio]); return; }
    if (t.jaEsta) {
      mostrar(`Você está na turma do professor ${t.professor}.`,
        'Ele vê seu progresso na trilha diária, nos cursos e as suas lições de casa. Você pode sair quando quiser.',
        [inicio, botao('Sair da turma', 'perigo', async () => { if (await enviar('/api/turma/sair')) iniciar(); })]);
      return;
    }
    mostrar(`O professor ${t.professor} convidou você para a turma dele.`,
      'Ao entrar, ele passa a ver: os dias em que você praticou, a sua sequência, as mini-lições da trilha e as lições de casa que você enviar nos cursos. Ele não vê sua senha, seus pagamentos nem as conversas com a Yara. Você pode sair quando quiser.',
      [botao('Aceitar e entrar na turma', 'rosa', async () => {
        if (await enviar('/api/turma/entrar')) mostrar(`Pronto! Você está na turma do professor ${t.professor}. 🎉`, 'Bons estudos!', [inicio]);
        else mostrar('Não deu para entrar agora.', 'Tente de novo em instantes.');
      })]);
  }

  iniciar();
})();
